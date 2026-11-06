(function () {
  'use strict';

  // ---- 音频上下文（惰性初始化：浏览器要求用户手势后才能出声）----
  let ctx = null;
  let master = null;

  function ensureAudio() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    // 加一个压缩器，防止多鼓齐奏时削波
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp);
    comp.connect(ctx.destination);
  }

  // ---- 工具：白噪声 buffer（复用）----
  let noiseBuffer = null;
  function getNoiseBuffer() {
    if (noiseBuffer) return noiseBuffer;
    const length = ctx.sampleRate * 2; // 2 秒
    noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return noiseBuffer;
  }

  // ---- 通用：噪声突发 ----
  function noiseHit({ filterType = 'highpass', freq = 6000, q = 1, decay = 0.1, gain = 0.6 }) {
    const src = ctx.createBufferSource();
    src.buffer = getNoiseBuffer();
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const g = ctx.createGain();
    const now = ctx.currentTime;
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + decay);
    src.connect(filter);
    filter.connect(g);
    g.connect(master);
    src.start(now);
    src.stop(now + decay + 0.02);
  }

  // ---- 底鼓：正弦波下滑 + 短促“咔哒”瞬态 ----
  function playKick() {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(1.0, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + 0.5);

    noiseHit({ filterType: 'highpass', freq: 2000, decay: 0.04, gain: 0.25 });
  }

  // ---- 军鼓：带通噪声瞬态 + 三角波鼓腔体 ----
  function playSnare() {
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = getNoiseBuffer();
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1800;
    bp.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.7, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    src.connect(bp);
    bp.connect(g);
    g.connect(master);
    src.start(now);
    src.stop(now + 0.25);

    const body = ctx.createOscillator();
    body.type = 'triangle';
    body.frequency.setValueAtTime(200, now);
    body.frequency.exponentialRampToValueAtTime(150, now + 0.1);
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.5, now);
    bg.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    body.connect(bg);
    bg.connect(master);
    body.start(now);
    body.stop(now + 0.2);
  }

  // ---- 踩镲（open=true 为开放踩镲，衰减更长）----
  function playHiHat(open) {
    noiseHit({
      filterType: 'highpass',
      freq: 7000,
      decay: open ? 0.6 : 0.07,
      gain: open ? 0.45 : 0.5,
    });
  }

  // ---- 通鼓：正弦波下滑 ----
  function playTom(startFreq) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 0.6, now + 0.2);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.8, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // ---- 吊镲：高通噪声、长衰减 ----
  function playCrash() {
    noiseHit({ filterType: 'highpass', freq: 5000, decay: 1.6, gain: 0.55 });
  }

  // ---- 叮叮镲：带通噪声、金属“叮”声 ----
  function playRide() {
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = getNoiseBuffer();
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 8000;
    bp.Q.value = 1.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.45, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    src.connect(bp);
    bp.connect(g);
    g.connect(master);
    src.start(now);
    src.stop(now + 0.9);
  }

  // ---- 鼓垫 → 音色映射 ----
  const pads = {
    a: { play: playKick },
    s: { play: playSnare },
    d: { play: () => playHiHat(false) },
    f: { play: () => playHiHat(true) },
    g: { play: () => playTom(150) },
    h: { play: () => playTom(200) },
    j: { play: () => playTom(280) },
    k: { play: playCrash },
    l: { play: playRide },
  };

  // ---- 触发一次击鼓 ----
  function hit(key) {
    const pad = pads[key];
    if (!pad) return;
    ensureAudio();
    pad.play();
  }

  // ---- 视觉反馈 ----
  function setActive(key, active) {
    const el = document.querySelector('.pad[data-key="' + key + '"]');
    if (el) el.classList.toggle('active', active);
  }

  // ---- 事件绑定：鼠标 / 触屏 ----
  document.querySelectorAll('.pad').forEach((el) => {
    const key = el.dataset.key;
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      hit(key);
      setActive(key, true);
    });
    el.addEventListener('pointerup', () => setActive(key, false));
    el.addEventListener('pointerleave', () => setActive(key, false));
    el.addEventListener('pointercancel', () => setActive(key, false));
  });

  // ---- 事件绑定：键盘 ----
  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (!pads[key] || e.repeat) return;
    hit(key);
    setActive(key, true);
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (!pads[key]) return;
    setActive(key, false);
  });

  // ---- 自动演示：一键播放一段预设节奏 ----
  const DEMO_BPM = 120;
  const STEP_MS = 60000 / DEMO_BPM / 4; // 每步 = 16 分音符

  // 16 步节奏，每步要敲的鼓（字符 = data-key）
  const DEMO_PATTERN = [
    'ad', '', 'd', '',   // 底鼓 + 踩镲
    'sd', '', 'd', '',   // 军鼓 + 踩镲
    'ad', '', 'd', '',   // 底鼓 + 踩镲
    'sd', '', 'd', 'f',  // 军鼓 + 踩镲 + 开放踩镲收尾
  ];

  const demoBtn = document.getElementById('demo-btn');
  let demoTimer = null;
  let demoStep = 0;

  function clearActive() {
    document.querySelectorAll('.pad.active').forEach((el) => el.classList.remove('active'));
  }

  function updateDemoButton(playing) {
    demoBtn.textContent = playing ? '停止' : '▶ 播放演示';
    demoBtn.classList.toggle('playing', playing);
  }

  function stepDemo() {
    clearActive(); // 清掉上一步的高亮
    const keys = DEMO_PATTERN[demoStep % DEMO_PATTERN.length];
    if (keys) {
      for (const c of keys) {
        hit(c);
        setActive(c, true);
      }
    }
    demoStep++;
  }

  function startDemo() {
    ensureAudio(); // 在用户手势内初始化音频上下文
    demoStep = 0;
    stepDemo(); // 立即敲第一拍
    demoTimer = setInterval(stepDemo, STEP_MS);
    updateDemoButton(true);
  }

  function stopDemo() {
    clearInterval(demoTimer);
    demoTimer = null;
    clearActive();
    updateDemoButton(false);
  }

  demoBtn.addEventListener('click', () => {
    if (demoTimer) stopDemo();
    else startDemo();
  });
})();
