/* Dead or Wild - 5x5, 15-line slot engine. */
(() => {
  "use strict";

  const BET_LEVELS = [10, 20, 50, 100, 250, 500];
  const SPEEDS = [1, 2, 4];
  const START_BALANCE = 10000;
  const MAX_WIN_MULT = 12500;
  const SAVE_KEY = "dead-or-wild-v1";

  const SYMBOLS = {
    wild:     { name: "Wild", pay: { 3: 2, 4: 8, 5: 20 }, wild: true },
    star:     { name: "Sheriff Badge", pay: { 3: 2, 4: 8, 5: 20 } },
    revolver: { name: "Revolver", pay: { 3: 1, 4: 5, 5: 12 } },
    whisky:   { name: "Whisky", pay: { 3: 1, 4: 4, 5: 10 } },
    money:    { name: "Cash", pay: { 3: 0.8, 4: 3, 5: 8 } },
    skull:    { name: "Cow Skull", pay: { 3: 0.5, 4: 2, 5: 5 } },
    bandit:   { name: "Bandit", pay: { 3: 0.5, 4: 2, 5: 5 } },
    a:        { name: "Ace", pay: { 3: 0.2, 4: 0.5, 5: 1 } },
    k:        { name: "King", pay: { 3: 0.2, 4: 0.5, 5: 1 } },
    q:        { name: "Queen", pay: { 3: 0.2, 4: 0.5, 5: 1 } },
    j:        { name: "Jack", pay: { 3: 0.2, 4: 0.5, 5: 1 } },
    t10:      { name: "Ten", pay: { 3: 0.2, 4: 0.5, 5: 1 } },
    vs:       { name: "VS DuelReel" },
    duel:     { name: "Duel at Dawn", scatter: true },
    dead:     { name: "Dead Man's Hand", scatter: true },
    train:    { name: "Great Train Robbery", scatter: true },
    mult:     { name: "Multiplier", collect: true },
    wildc:    { name: "Collect Wild", collect: true }
  };

  const PAY_SYMBOLS = ["wild", "star", "revolver", "whisky", "money", "skull", "bandit", "a", "k", "q", "j", "t10"];
  const SCATTERS = ["duel", "dead", "train"];

  const PAYLINES = [
    [2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0],
    [4, 4, 4, 4, 4],
    [1, 1, 1, 1, 1],
    [3, 3, 3, 3, 3],
    [0, 1, 2, 3, 4],
    [4, 3, 2, 1, 0],
    [0, 1, 2, 1, 0],
    [4, 3, 2, 3, 4],
    [0, 0, 1, 2, 2],
    [4, 4, 3, 2, 2],
    [1, 0, 0, 0, 1],
    [3, 4, 4, 4, 3],
    [1, 2, 1, 2, 1],
    [3, 2, 3, 2, 3]
  ];
  const LINE_COLORS = ["#ffd56a", "#fff3df", "#e8621e", "#ff9a3c", "#f2b632", "#ffe08a"];

  const BASE_WEIGHTS = {
    t10: 20, j: 20, q: 19, k: 18, a: 17,
    skull: 5, bandit: 5, money: 6, whisky: 6, revolver: 7, star: 8,
    wild: 6, vs: 1.2, duel: 1.4, dead: 1.4, train: 1.4
  };
  const COLLECT_WEIGHTS = {
    t10: 20, j: 20, q: 19, k: 18, a: 17,
    skull: 6, bandit: 6, money: 6, whisky: 6, revolver: 6, star: 6,
    wildc: 7, mult: 7
  };
  const SHOWDOWN_WEIGHTS = {
    t10: 18, j: 18, q: 17, k: 16, a: 15,
    skull: 8, bandit: 8, money: 9, whisky: 9, revolver: 10, star: 11, wild: 6
  };

  const MULT_POOL = [2, 2, 3, 3, 4, 4, 5, 5, 6, 8, 10, 12, 15, 20, 25, 50, 100];
  const DUEL_MULT_POOL = [3, 3, 4, 4, 5, 5, 6, 8, 10, 12, 15, 20, 25, 50, 100];
  const DEAD_MULT_POOL = [2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 8, 10, 12, 15, 20, 25, 31];

  const BONUS_COST = { dead: 100, duel: 60, train: 50 };
  const BONUS_META = {
    dead:  { name: "Dead Man's Hand", icon: "dead", desc: "Hold-and-spin. Collect wilds and multipliers, then a 3-spin showdown." },
    duel:  { name: "Duel at Dawn", icon: "duel", desc: "10 free spins with boosted VS DuelReels and big multipliers." },
    train: { name: "Great Train Robbery", icon: "train", desc: "10 free spins where every wild sticks to the reels." }
  };

  const $ = (id) => document.getElementById(id);
  const reelsEl = $("reels");
  const svgEl = $("lines");
  const bannerEl = $("banner");
  const balanceEl = $("balanceVal");
  const betEl = $("betVal");
  const lastWinEl = $("lastWinVal");
  const bountyEl = $("bountyVal");
  const spinBtn = $("spinBtn");
  const autoBtn = $("autoBtn");
  const speedBtn = $("speedBtn");
  const soundBtn = $("soundBtn");
  const betDown = $("betDown");
  const betUp = $("betUp");
  const topupBtn = $("topupBtn");
  const featureBar = $("featurebar");
  const paytable = $("paytable");
  const bonusModal = $("bonusModal");
  const buyList = $("buyList");

  const reelEls = Array.from(reelsEl.querySelectorAll(".reel"));
  const strips = reelEls.map((r) => r.querySelector(".strip"));
  const targetCells = [];

  const STORAGE = { balance: START_BALANCE, bet: 10, sound: true, speed: 1 };
  let state = Object.assign({}, STORAGE);

  const game = {
    mode: "base",
    busy: false,
    autoRemaining: 0,
    nextTimer: null,
    lastWin: 0,
    featureWin: 0,
    spinsLeft: 0,
    sticky: new Set(),
    locked: new Map(),
    deadWilds: 0,
    deadMult: 0,
    collectSpins: 0,
    showdownSpins: 0
  };

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (typeof saved.balance === "number") state.balance = saved.balance;
      if (typeof saved.bet === "number" && BET_LEVELS.indexOf(saved.bet) !== -1) state.bet = saved.bet;
      if (typeof saved.sound === "boolean") state.sound = saved.sound;
      if (typeof saved.speed === "number" && SPEEDS.indexOf(saved.speed) !== -1) state.speed = saved.speed;
    }
  } catch (err) { /* ignore */ }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        balance: state.balance,
        bet: state.bet,
        sound: state.sound,
        speed: state.speed
      }));
    } catch (err) { /* ignore */ }
  }

  const fmt = (n) => Math.round(n).toLocaleString("en-US");
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

  function makeSym(id) {
    const s = { id: id };
    if (id === "mult") s.value = DEAD_MULT_POOL[(Math.random() * DEAD_MULT_POOL.length) | 0];
    return s;
  }

  function cloneSym(s) {
    return { id: s.id, value: s.value };
  }

  function cloneGrid(g) {
    return g.map((col) => col.map(cloneSym));
  }

  function isWild(s) {
    return s.id === "wild";
  }

  function pick(weights) {
    let total = 0;
    for (const k in weights) total += weights[k];
    let r = Math.random() * total;
    for (const k in weights) {
      r -= weights[k];
      if (r <= 0) return k;
    }
    return "t10";
  }

  function buildGrid(weights) {
    const g = [];
    for (let c = 0; c < 5; c++) {
      const col = [];
      for (let r = 0; r < 5; r++) col.push(makeSym(pick(weights)));
      g.push(col);
    }
    return g;
  }

  function artFor(sym) {
    const art = window.SLOT_ART || {};
    if (sym.id === "mult" && art.mult) return art.mult(sym.value);
    return art[sym.id] || "";
  }

  function sizeReels() {
    const cs = getComputedStyle(reelsEl);
    const pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
    const gap = parseFloat(cs.columnGap || cs.gap) || 0;
    const inner = reelsEl.clientWidth - pad - gap * 4;
    const cell = Math.max(26, Math.floor(inner / 5));
    reelsEl.style.setProperty("--cell", cell + "px");
  }

  // ---------- Audio ----------
  let actx = null;
  let master = null;

  function audio() {
    if (actx) {
      if (actx.state === "suspended") actx.resume();
      return actx;
    }
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      actx = new Ctx();
      master = actx.createGain();
      master.gain.value = 0.45;
      master.connect(actx.destination);
    } catch (err) { return null; }
    return actx;
  }

  function tone(freq, dur, type, vol, when, slideTo) {
    if (!state.sound) return;
    const a = audio();
    if (!a) return;
    const t = a.currentTime + (when || 0);
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.03);
  }

  function noise(dur, vol, when) {
    if (!state.sound) return;
    const a = audio();
    if (!a) return;
    const t = a.currentTime + (when || 0);
    const len = Math.max(1, Math.floor(a.sampleRate * dur));
    const buf = a.createBuffer(1, len, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = a.createBufferSource();
    src.buffer = buf;
    const g = a.createGain();
    g.gain.value = vol;
    src.connect(g);
    g.connect(master);
    src.start(t);
  }

  const sfx = {
    click() { tone(680, 0.05, "square", 0.045); },
    spin() { tone(170, 0.34, "sawtooth", 0.08, 0, 880); tone(85, 0.34, "sine", 0.07, 0, 230); },
    spinSoft() { tone(220, 0.12, "triangle", 0.06, 0, 520); },
    stop(c) { tone(330 + c * 55, 0.09, "triangle", 0.1, 0, 200 + c * 24); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, "triangle", 0.11, i * 0.09)); },
    big() {
      const seq = [523, 659, 784, 1047, 1319, 1568];
      seq.forEach((f, i) => tone(f, 0.22, "triangle", 0.12, i * 0.1));
      tone(2093, 0.5, "sine", 0.09, seq.length * 0.1);
    },
    mega() {
      const seq = [392, 523, 659, 784, 1047, 1319, 1568, 2093];
      seq.forEach((f, i) => tone(f, 0.26, "sawtooth", 0.08, i * 0.1));
      noise(0.4, 0.06, 0);
    },
    bonus() { [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.24, "triangle", 0.1, i * 0.09)); },
    gunshot() {
      noise(0.2, 0.38, 0);
      tone(95, 0.18, "sawtooth", 0.18, 0, 42);
      tone(160, 0.07, "square", 0.13, 0, 60);
    },
    stamp() { tone(120, 0.16, "sine", 0.24, 0, 48); noise(0.07, 0.14, 0); },
    collect() { [880, 1108, 1320].forEach((f, i) => tone(f, 0.08, "triangle", 0.09, i * 0.05)); },
    reload() { tone(500, 0.05, "square", 0.07); tone(320, 0.06, "square", 0.07, 0.08); },
    topup() { [660, 880, 1320].forEach((f, i) => tone(f, 0.1, "sine", 0.09, i * 0.07)); }
  };

  // ---------- Particles ----------
  const fxCanvas = $("fx");
  const ctx = fxCanvas.getContext("2d");
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const particles = [];
  let hadParticles = false;
  const PALETTE = ["#f2b632", "#ffd56a", "#fff3df", "#e8621e", "#b8322a", "#7cc36a"];

  function resizeFx() {
    fxCanvas.width = Math.floor(window.innerWidth * dpr);
    fxCanvas.height = Math.floor(window.innerHeight * dpr);
    fxCanvas.style.width = window.innerWidth + "px";
    fxCanvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeFx();
  window.addEventListener("resize", resizeFx);

  function burst(x, y, count, power) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * power + power * 0.12;
      const kind = Math.random();
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - power * 0.35,
        g: 0.52 + Math.random() * 0.5,
        size: 3 + Math.random() * 6,
        color: PALETTE[(Math.random() * PALETTE.length) | 0],
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.45,
        life: 1,
        decay: 0.007 + Math.random() * 0.008,
        shape: kind < 0.3 ? "coin" : (kind < 0.64 ? "rect" : "circle")
      });
    }
    if (particles.length > 650) particles.splice(0, particles.length - 650);
  }

  function coinRain() {
    for (let i = 0; i < 42; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: -40 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: 3 + Math.random() * 4,
        g: 0.16,
        size: 9 + Math.random() * 8,
        color: "#f2b632",
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.2,
        life: 1,
        decay: 0.0035,
        shape: "coin"
      });
    }
  }

  let lastT = performance.now();
  function frame(t) {
    const dt = Math.min(2.5, (t - lastT) / 16.667) || 1;
    lastT = t;
    if (particles.length) {
      hadParticles = true;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += p.g * dt;
        p.vx *= Math.pow(0.99, dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0 || p.y > window.innerHeight + 70) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.15));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.shape === "circle") {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "coin") {
          ctx.fillStyle = "#ffd56a";
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.72, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#a06a00";
          ctx.font = "bold " + (p.size * 1.05).toFixed(0) + "px Georgia, serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("$", 0, 0.5);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      }
    } else if (hadParticles) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      hadParticles = false;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ---------- Reel rendering ----------
  function paintCell(cell, sym) {
    cell.dataset.sym = sym.id;
    if (sym.value != null) cell.dataset.value = sym.value;
    else delete cell.dataset.value;
    cell.innerHTML = artFor(sym);
    cell.classList.toggle("sym-mult", sym.id === "mult");
    cell.classList.toggle("sym-wild", sym.id === "wild" || sym.id === "wildc");
  }

  function makeCell(sym) {
    const cell = document.createElement("div");
    cell.className = "cell";
    paintCell(cell, sym);
    return cell;
  }

  function populateStatic() {
    strips.forEach((strip, c) => {
      strip.innerHTML = "";
      strip.style.transition = "none";
      strip.style.transform = "translateY(0)";
      const cells = [];
      for (let r = 0; r < 5; r++) {
        const cell = makeCell(makeSym(pick(BASE_WEIGHTS)));
        strip.appendChild(cell);
        cells.push(cell);
      }
      targetCells[c] = cells;
    });
  }

  function clearWinVisuals() {
    svgEl.innerHTML = "";
    reelsEl.querySelectorAll(".cell.win").forEach((c) => c.classList.remove("win"));
  }

  function clearReelBadges() {
    reelEls.forEach((r) => r.querySelectorAll(".reel-badge").forEach((b) => b.remove()));
  }

  function addReelBadge(c, mult) {
    const old = reelEls[c].querySelector(".reel-badge");
    if (old) old.remove();
    const badge = document.createElement("div");
    badge.className = "reel-badge";
    badge.textContent = "\u00D7" + mult;
    reelEls[c].appendChild(badge);
  }

  function spinReel(c, target) {
    return new Promise((resolve) => {
      const strip = strips[c];
      strip.style.transition = "none";
      strip.style.transform = "translateY(0)";
      strip.innerHTML = "";

      const pad = 20 + c * 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < pad; i++) strip.appendChild(makeCell(makeSym(pick(BASE_WEIGHTS))));

      const cells = [];
      for (let r = 0; r < 5; r++) {
        const cell = makeCell(target[r]);
        strip.appendChild(cell);
        cells.push(cell);
      }
      targetCells[c] = cells;

      const len = pad + 5;
      const targetPct = -((len - 5) / len) * 100;
      const dur = Math.round((1050 + c * 150 + Math.floor(Math.random() * 90)) / state.speed);

      let finished = false;
      function finish() {
        if (finished) return;
        finished = true;
        strip.style.transform = "translateY(" + targetPct.toFixed(4) + "%)";
        strip.removeEventListener("transitionend", onEnd);
        reelEls[c].classList.remove("spinning");
        sfx.stop(c);
        resolve();
      }
      function onEnd(e) {
        if (e.target === strip && e.propertyName === "transform") finish();
      }

      void strip.offsetHeight;
      reelEls[c].classList.add("spinning");
      strip.addEventListener("transitionend", onEnd);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          strip.style.transition = "transform " + dur + "ms cubic-bezier(.16,.84,.28,1)";
          strip.style.transform = "translateY(" + targetPct.toFixed(4) + "%)";
        });
      });

      setTimeout(finish, dur + 500);
    });
  }

  function spinAll(grid) {
    return Promise.all(grid.map((col, c) => spinReel(c, col)));
  }

  // ---------- Evaluation ----------
  function countScatters(g) {
    const counts = { duel: 0, dead: 0, train: 0 };
    for (let c = 0; c < g.length; c++) {
      for (let r = 0; r < g[c].length; r++) {
        if (counts[g[c][r].id] != null) counts[g[c][r].id]++;
      }
    }
    return counts;
  }

  function pickFeature(c) {
    const order = { dead: 3, duel: 2, train: 1 };
    let best = null;
    ["dead", "duel", "train"].forEach((t) => {
      if (c[t] < 3) return;
      if (!best || c[t] > c[best] || (c[t] === c[best] && order[t] > order[best])) best = t;
    });
    return best;
  }

  function evaluate(g, bet, colMult) {
    const wins = [];
    let total = 0;
    for (let li = 0; li < PAYLINES.length; li++) {
      const line = PAYLINES[li];
      const syms = line.map((row, c) => g[c][row]);
      let id = null;
      for (let c = 0; c < 5; c++) {
        if (!isWild(syms[c])) { id = syms[c].id; break; }
      }
      if (id === null) id = "wild";
      const def = SYMBOLS[id];
      if (!def || !def.pay) continue;
      let count = 0;
      for (let c = 0; c < 5; c++) {
        if (isWild(syms[c]) || syms[c].id === id) count++;
        else break;
      }
      if (count < 3) continue;
      const pay = def.pay[count] || 0;
      if (!pay) continue;
      let mult = 0;
      let any = false;
      for (let c = 0; c < count; c++) {
        if (colMult && colMult[c]) { mult += colMult[c]; any = true; }
      }
      if (!any) mult = 1;
      const amount = pay * bet * mult;
      total += amount;
      const cells = [];
      for (let c = 0; c < count; c++) cells.push({ c: c, r: line[c] });
      wins.push({ line: li, id: id, count: count, mult: mult, amount: amount, cells: cells });
    }
    return { wins: wins, total: total };
  }

  // ---------- VS DuelReels ----------
  function animateDuel(c, mult, rawGrid) {
    return new Promise((resolve) => {
      const reel = reelEls[c];
      const ov = document.createElement("div");
      ov.className = "duel-overlay";
      ov.innerHTML =
        '<div class="duelist outlaw">' + window.SLOT_ART.outlaw + "</div>" +
        '<div class="duel-vs">VS</div>' +
        '<div class="duelist sheriff">' + window.SLOT_ART.sheriff + "</div>" +
        '<div class="duel-mult">\u00D7' + mult + "</div>";
      reel.appendChild(ov);
      reel.classList.add("duel-shake");
      sfx.gunshot();

      const hold = Math.max(420, Math.round(950 / state.speed));
      setTimeout(() => {
        for (let r = 0; r < 5; r++) {
          const sym = { id: "wild" };
          rawGrid[c][r] = sym;
          const cell = targetCells[c][r];
          paintCell(cell, sym);
          cell.classList.remove("wild-pop");
          void cell.offsetWidth;
          cell.classList.add("wild-pop");
        }
        addReelBadge(c, mult);
        reel.classList.remove("duel-shake");
        reel.classList.add("duel-flash");
        sfx.stamp();
        ov.classList.add("reveal");
        setTimeout(() => {
          reel.classList.remove("duel-flash");
          ov.remove();
          resolve();
        }, 320);
      }, hold);
    });
  }

  async function resolveVs(rawGrid, mode) {
    const colMult = {};
    const triggered = [];
    for (let c = 0; c < 5; c++) {
      let hasVs = false;
      let hasScatter = false;
      for (let r = 0; r < 5; r++) {
        if (rawGrid[c][r].id === "vs") hasVs = true;
        if (SCATTERS.indexOf(rawGrid[c][r].id) !== -1) hasScatter = true;
      }
      if (!hasVs || hasScatter) continue;
      const clone = cloneGrid(rawGrid);
      for (let r = 0; r < 5; r++) clone[c][r] = { id: "wild" };
      const test = evaluate(clone, state.bet, null);
      if (test.wins.some((w) => w.count > c)) triggered.push(c);
    }
    if (!triggered.length) return { grid: rawGrid, colMult: colMult, triggered: triggered };

    const pool = mode === "duel" ? DUEL_MULT_POOL : MULT_POOL;
    triggered.forEach((c) => {
      colMult[c] = pool[(Math.random() * pool.length) | 0];
    });
    for (let i = 0; i < triggered.length; i++) {
      await animateDuel(triggered[i], colMult[triggered[i]], rawGrid);
    }
    return { grid: rawGrid, colMult: colMult, triggered: triggered };
  }

  // ---------- Highlights ----------
  function highlightWins(wins) {
    const seen = new Set();
    wins.forEach((w) => {
      w.cells.forEach((pos) => {
        const cell = targetCells[pos.c][pos.r];
        if (cell && !seen.has(cell)) {
          seen.add(cell);
          cell.classList.add("win");
        }
      });
    });
    drawWinLines(wins);
  }

  function drawWinLines(wins) {
    const rect = reelsEl.getBoundingClientRect();
    if (!rect.width) return;
    svgEl.setAttribute("viewBox", "0 0 " + rect.width + " " + rect.height);
    svgEl.innerHTML = "";
    wins.slice(0, 6).forEach((w, i) => {
      const points = w.cells.map((pos) => {
        const cell = targetCells[pos.c][pos.r];
        const r = cell.getBoundingClientRect();
        const x = r.left + r.width / 2 - rect.left;
        const y = r.top + r.height / 2 - rect.top;
        return x.toFixed(1) + "," + y.toFixed(1);
      }).join(" ");
      const color = LINE_COLORS[i % LINE_COLORS.length];
      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      poly.setAttribute("points", points);
      poly.setAttribute("fill", "none");
      poly.setAttribute("stroke", color);
      poly.setAttribute("stroke-width", "4");
      poly.setAttribute("stroke-linecap", "round");
      poly.setAttribute("stroke-linejoin", "round");
      poly.style.filter = "drop-shadow(0 0 6px " + color + ")";
      poly.style.animationDelay = (i * 0.07) + "s";
      poly.classList.add("pl");
      svgEl.appendChild(poly);
    });
  }

  // ---------- Banner / HUD ----------
  let bannerTimer = null;

  function showBanner(html, variant) {
    clearTimeout(bannerTimer);
    bannerEl.className = "banner";
    bannerEl.innerHTML = html;
    if (variant) bannerEl.classList.add(variant);
    void bannerEl.offsetWidth;
    bannerEl.classList.add("show");
    bannerTimer = setTimeout(() => bannerEl.classList.remove("show"), 2200);
  }

  function bump(el) {
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }

  function setLastWin(amount) {
    game.lastWin = amount;
    lastWinEl.textContent = fmt(amount);
    if (amount > 0) bump(lastWinEl);
  }

  function fbIcon(kind) {
    const art = (window.SLOT_ART || {})[kind] || "";
    return '<span class="fb-icon">' + art + "</span>";
  }

  function updateFeatureBar() {
    if (game.mode === "base") {
      featureBar.classList.remove("show");
      featureBar.innerHTML = "";
      return;
    }
    featureBar.classList.add("show");
    if (game.mode === "duel") {
      featureBar.innerHTML = fbIcon("duel") +
        "<span><b>DUEL AT DAWN</b> &middot; <b>" + game.spinsLeft + "</b> FREE SPINS</span>";
    } else if (game.mode === "train") {
      featureBar.innerHTML = fbIcon("train") +
        "<span><b>TRAIN ROBBERY</b> &middot; <b>" + game.spinsLeft + "</b> SPINS &middot; STICKY WILDS <b>" + game.sticky.size + "</b></span>";
    } else if (game.mode === "dead-collect") {
      featureBar.innerHTML = fbIcon("dead") +
        "<span><b>DEAD MAN'S HAND</b> &middot; RESPINS <b>" + game.collectSpins + "</b> &middot; WILDS <b>" + game.deadWilds + "</b> &middot; MULT <b>\u00D7" + game.deadMult + "</b></span>";
    } else if (game.mode === "dead-showdown") {
      featureBar.innerHTML = fbIcon("dead") +
        "<span><b>SHOWDOWN</b> &middot; <b>" + game.showdownSpins + "</b> SPINS &middot; WILDS <b>" + game.deadWilds + "</b> &middot; MULT <b>\u00D7" + Math.max(1, game.deadMult) + "</b></span>";
    }
  }

  function updateHUD() {
    balanceEl.textContent = fmt(state.balance);
    betEl.textContent = fmt(state.bet);
    lastWinEl.textContent = fmt(game.lastWin);
    bountyEl.textContent = fmt(game.featureWin);

    autoBtn.textContent = game.autoRemaining > 0 ? "STOP " + game.autoRemaining : "AUTO";
    autoBtn.classList.toggle("active", game.autoRemaining > 0);
    speedBtn.textContent = "SPEED \u00D7" + state.speed;
    speedBtn.classList.toggle("turbo-on", state.speed > 1);
    soundBtn.textContent = state.sound ? "SOUND" : "MUTED";
    soundBtn.classList.toggle("off", !state.sound);

    const inFeature = game.mode !== "base";
    const broke = !inFeature && state.balance < state.bet;
    topupBtn.classList.toggle("show", broke);
    spinBtn.disabled = game.busy || inFeature || broke;
    autoBtn.disabled = inFeature;
    betDown.disabled = game.busy || inFeature;
    betUp.disabled = game.busy || inFeature;
    bonusBtn.disabled = game.busy || inFeature;

    updateFeatureBar();
  }

  function addWin(amount) {
    if (!(amount > 0)) return 0;
    const cap = MAX_WIN_MULT * state.bet;
    const capped = Math.round(Math.min(amount, cap));
    state.balance += capped;
    if (game.mode !== "base") game.featureWin += capped;
    return capped;
  }

  function showWinBanner(win, wins, vsCount) {
    if (!win || win <= 0) {
      if (vsCount > 0) showBanner("DUELREELS<small>MULTIPLIERS IN PLAY</small>", "bonus");
      return;
    }
    const x = win / state.bet;
    let variant = "win";
    let label = "WIN " + fmt(win);
    if (x >= 100) { variant = "mega"; label = "MASSIVE WIN " + fmt(win); }
    else if (x >= 25) { variant = "big"; label = "BIG WIN " + fmt(win); }
    const lines = wins && wins.length
      ? "<small>" + wins.length + " LINE" + (wins.length > 1 ? "S" : "") + "</small>"
      : "";
    showBanner(label + lines, variant);

    const rect = reelsEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    if (variant === "win") {
      sfx.win();
      burst(cx, cy, 60, 9);
    } else if (variant === "big") {
      sfx.big();
      for (let i = 0; i < 2; i++) {
        setTimeout(() => burst(cx + (Math.random() - 0.5) * 200, cy - 30, 80, 12), i * 220);
      }
    } else {
      sfx.mega();
      for (let i = 0; i < 3; i++) {
        setTimeout(() => burst(cx + (Math.random() - 0.5) * 220, cy - 40, 90, 13), i * 220);
      }
      setTimeout(coinRain, 320);
    }
  }

  function promptTopup() {
    topupBtn.classList.remove("pulse");
    void topupBtn.offsetWidth;
    topupBtn.classList.add("pulse");
    showBanner("ADD CREDITS<small>TO KEEP SPINNING</small>", "win");
  }

  const bonusBtn = $("bonusBtn");

  // ---------- Feature helpers ----------
  function weightsFor(mode) {
    const w = Object.assign({}, BASE_WEIGHTS);
    if (mode === "base") return w;
    ["duel", "dead", "train"].forEach((k) => { delete w[k]; });
    if (mode === "duel") { w.vs = 8; return w; }
    if (mode === "train") { delete w.vs; w.wild = 5; return w; }
    return w;
  }

  function markLocked() {
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 5; r++) {
        const cell = targetCells[c][r];
        if (!cell) continue;
        const entry = game.locked.get(c + "_" + r);
        if (entry) {
          paintCell(cell, entry);
          cell.classList.add("locked");
        } else {
          cell.classList.remove("locked");
        }
      }
    }
  }

  function markSticky() {
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 5; r++) {
        const cell = targetCells[c][r];
        if (cell) cell.classList.toggle("sticky", game.sticky.has(c + "_" + r));
      }
    }
  }

  function clearCellStates() {
    reelsEl.querySelectorAll(".cell").forEach((cell) => {
      cell.classList.remove("win", "sticky", "locked", "drop", "wild-pop");
    });
  }

  function reshuffleCollect(newGrid) {
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 5; r++) {
        if (game.locked.has(c + "_" + r)) continue;
        const cell = targetCells[c][r];
        if (!cell) continue;
        paintCell(cell, newGrid[c][r]);
        cell.classList.remove("drop");
        void cell.offsetWidth;
        cell.classList.add("drop");
      }
    }
  }

  function collectFrom(grid) {
    let any = false;
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 5; r++) {
        const key = c + "_" + r;
        if (game.locked.has(key)) continue;
        const sym = grid[c][r];
        if (sym.id === "wildc") {
          game.locked.set(key, { id: "wildc" });
          game.deadWilds = Math.min(20, game.deadWilds + 1);
          any = true;
        } else if (sym.id === "mult") {
          game.locked.set(key, { id: "mult", value: sym.value });
          game.deadMult = Math.min(31, game.deadMult + sym.value);
          any = true;
        }
      }
    }
    markLocked();
    return any;
  }

  function placeDeadWilds(grid) {
    const spots = [];
    for (let c = 0; c < 5; c++) for (let r = 0; r < 5; r++) spots.push([c, r]);
    for (let i = spots.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const tmp = spots[i]; spots[i] = spots[j]; spots[j] = tmp;
    }
    const n = Math.min(20, game.deadWilds, spots.length);
    for (let i = 0; i < n; i++) {
      grid[spots[i][0]][spots[i][1]] = { id: "wild" };
    }
  }

  function beginFeature(label, sub) {
    game.featureWin = 0;
    game.lastWin = 0;
    game.sticky = new Set();
    game.locked = new Map();
    game.deadWilds = 0;
    game.deadMult = 0;
    clearWinVisuals();
    clearReelBadges();
    clearCellStates();
    updateHUD();
    showBanner(label + "<small>" + sub + "</small>", "bonus");
    sfx.bonus();
  }

  // ---------- Features ----------
  async function duelSpin() {
    clearWinVisuals();
    clearReelBadges();
    game.lastWin = 0;
    updateHUD();
    sfx.spin();
    const grid = buildGrid(weightsFor("duel"));
    await spinAll(grid);
    await sleep(Math.max(40, 110 / state.speed));
    const vsRes = await resolveVs(grid, "duel");
    const res = evaluate(vsRes.grid, state.bet, vsRes.colMult);
    if (res.wins.length) highlightWins(res.wins);
    const win = addWin(res.total);
    if (win > 0) setLastWin(win);
    showWinBanner(win, res.wins, vsRes.triggered.length);
    updateHUD();
  }

  async function runDuel() {
    game.mode = "duel";
    game.spinsLeft = 10;
    beginFeature("DUEL AT DAWN", "10 FREE SPINS &middot; BOOSTED VS REELS");
    await sleep(Math.max(900, 1400 / state.speed));
    while (game.spinsLeft > 0) {
      await duelSpin();
      game.spinsLeft--;
      updateHUD();
      if (game.spinsLeft > 0) await sleep(Math.max(300, 800 / state.speed));
    }
  }

  async function trainSpin() {
    clearWinVisuals();
    clearReelBadges();
    game.lastWin = 0;
    updateHUD();
    sfx.spin();
    const grid = buildGrid(weightsFor("train"));
    game.sticky.forEach((key) => {
      const p = key.split("_");
      grid[+p[0]][+p[1]] = { id: "wild" };
    });
    await spinAll(grid);
    await sleep(Math.max(40, 110 / state.speed));
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 5; r++) {
        if (grid[c][r].id === "wild") game.sticky.add(c + "_" + r);
      }
    }
    markSticky();
    const res = evaluate(grid, state.bet, null);
    if (res.wins.length) highlightWins(res.wins);
    const win = addWin(res.total);
    if (win > 0) setLastWin(win);
    showWinBanner(win, res.wins, 0);
    updateHUD();
  }

  async function runTrain() {
    game.mode = "train";
    game.spinsLeft = 10;
    game.sticky = new Set();
    beginFeature("GREAT TRAIN ROBBERY", "10 FREE SPINS &middot; STICKY WILDS");
    await sleep(Math.max(900, 1400 / state.speed));
    while (game.spinsLeft > 0) {
      await trainSpin();
      game.spinsLeft--;
      updateHUD();
      if (game.spinsLeft > 0) await sleep(Math.max(300, 800 / state.speed));
    }
  }

  async function deadShowdown() {
    game.mode = "dead-showdown";
    game.showdownSpins = 3;
    game.locked = new Map();
    game.collectSpins = 0;
    markLocked();
    clearReelBadges();
    showBanner("DEAD MAN'S HAND<small>SHOWDOWN &middot; " + game.deadWilds + " WILDS &middot; \u00D7" + Math.max(1, game.deadMult) + "</small>", "mega");
    sfx.bonus();
    updateHUD();
    await sleep(Math.max(900, 1400 / state.speed));
    const mult = Math.max(1, game.deadMult);
    while (game.showdownSpins > 0) {
      clearWinVisuals();
      game.lastWin = 0;
      updateHUD();
      sfx.spin();
      const grid = buildGrid(SHOWDOWN_WEIGHTS);
      placeDeadWilds(grid);
      await spinAll(grid);
      await sleep(Math.max(40, 110 / state.speed));
      const res = evaluate(grid, state.bet, null);
      if (res.wins.length) highlightWins(res.wins);
      const win = addWin(res.total * mult);
      if (win > 0) setLastWin(win);
      showWinBanner(win, res.wins, 0);
      game.showdownSpins--;
      updateHUD();
      if (game.showdownSpins > 0) await sleep(Math.max(300, 800 / state.speed));
    }
  }

  async function runDead() {
    game.mode = "dead-collect";
    game.locked = new Map();
    game.deadWilds = 0;
    game.deadMult = 0;
    game.collectSpins = 3;
    beginFeature("DEAD MAN'S HAND", "COLLECT WILDS &amp; MULTIPLIERS");
    await sleep(Math.max(900, 1400 / state.speed));

    clearWinVisuals();
    clearReelBadges();
    game.lastWin = 0;
    updateHUD();
    sfx.spin();
    const startGrid = buildGrid(COLLECT_WEIGHTS);
    await spinAll(startGrid);
    await sleep(Math.max(60, 150 / state.speed));
    if (collectFrom(startGrid)) sfx.collect();
    updateHUD();
    await sleep(Math.max(300, 650 / state.speed));

    let guard = 0;
    while (game.collectSpins > 0 && guard++ < 60) {
      if (game.deadWilds >= 20 || game.deadMult >= 31) break;
      game.collectSpins--;
      game.lastWin = 0;
      clearWinVisuals();
      updateHUD();
      sfx.spinSoft();
      const grid = buildGrid(COLLECT_WEIGHTS);
      reshuffleCollect(grid);
      await sleep(Math.max(240, 520 / state.speed));
      if (collectFrom(grid)) {
        sfx.collect();
        game.collectSpins = 3;
      }
      updateHUD();
      await sleep(Math.max(260, 560 / state.speed));
    }

    await deadShowdown();
  }

  async function endFeature() {
    const total = Math.round(game.featureWin);
    game.mode = "base";
    game.spinsLeft = 0;
    game.sticky = new Set();
    game.locked = new Map();
    game.deadWilds = 0;
    game.deadMult = 0;
    game.collectSpins = 0;
    game.showdownSpins = 0;
    clearWinVisuals();
    clearReelBadges();
    clearCellStates();
    updateHUD();
    if (total > 0) {
      showBanner("FEATURE COMPLETE<small>+" + fmt(total) + " CREDITS</small>", "win");
      sfx.big();
      const rect = reelsEl.getBoundingClientRect();
      for (let i = 0; i < 3; i++) {
        setTimeout(() => burst(rect.left + rect.width / 2 + (Math.random() - 0.5) * 200, rect.top + rect.height / 2 - 40, 80, 12), i * 220);
      }
      setTimeout(coinRain, 300);
    } else {
      showBanner("BACK TO THE HUNT", "bonus");
    }
    await sleep(Math.max(900, 1300 / state.speed));
    game.featureWin = 0;
    game.lastWin = 0;
    updateHUD();
    save();
  }

  async function runFeature(type) {
    if (type === "duel") await runDuel();
    else if (type === "train") await runTrain();
    else await runDead();
    await endFeature();
  }

  // ---------- Game flow ----------
  async function doSpin() {
    if (game.busy || game.mode !== "base") return;
    clearTimeout(game.nextTimer);
    game.nextTimer = null;

    if (state.balance < state.bet) {
      game.autoRemaining = 0;
      updateHUD();
      promptTopup();
      return;
    }

    game.busy = true;
    state.balance -= state.bet;
    game.lastWin = 0;
    clearWinVisuals();
    clearReelBadges();
    updateHUD();
    sfx.spin();

    const grid = buildGrid(BASE_WEIGHTS);
    await spinAll(grid);
    await sleep(Math.max(40, 120 / state.speed));

    const sc = countScatters(grid);
    const vsRes = await resolveVs(grid, "base");
    const res = evaluate(vsRes.grid, state.bet, vsRes.colMult);
    if (res.wins.length) highlightWins(res.wins);
    const win = addWin(res.total);
    if (win > 0) setLastWin(win);
    showWinBanner(win, res.wins, vsRes.triggered.length);
    updateHUD();
    save();

    const feature = pickFeature(sc);
    if (feature) {
      await sleep(Math.max(600, 1200 / state.speed));
      await runFeature(feature);
    }

    game.busy = false;
    updateHUD();
    scheduleAuto();
  }

  function scheduleAuto() {
    if (game.mode !== "base") return;
    if (game.autoRemaining > 0) {
      game.autoRemaining--;
      updateHUD();
      if (game.autoRemaining > 0) {
        game.nextTimer = setTimeout(() => {
          game.nextTimer = null;
          doSpin();
        }, Math.max(320, 900 / state.speed));
      }
    }
  }

  // ---------- Controls ----------
  function changeBet(dir) {
    if (game.busy || game.mode !== "base") return;
    const idx = BET_LEVELS.indexOf(state.bet);
    const next = clamp(idx + dir, 0, BET_LEVELS.length - 1);
    if (next === idx) return;
    state.bet = BET_LEVELS[next];
    sfx.click();
    save();
    updateHUD();
  }

  function cycleSpeed() {
    const idx = SPEEDS.indexOf(state.speed);
    state.speed = SPEEDS[(idx + 1) % SPEEDS.length];
    sfx.click();
    save();
    updateHUD();
  }

  spinBtn.addEventListener("click", () => {
    game.autoRemaining = 0;
    clearTimeout(game.nextTimer);
    game.nextTimer = null;
    updateHUD();
    doSpin();
  });

  autoBtn.addEventListener("click", () => {
    sfx.click();
    if (game.autoRemaining > 0) {
      game.autoRemaining = 0;
      clearTimeout(game.nextTimer);
      game.nextTimer = null;
      updateHUD();
      return;
    }
    if (game.busy || game.mode !== "base") return;
    if (state.balance < state.bet) { promptTopup(); return; }
    game.autoRemaining = 10;
    updateHUD();
    doSpin();
  });

  betDown.addEventListener("click", () => changeBet(-1));
  betUp.addEventListener("click", () => changeBet(1));
  speedBtn.addEventListener("click", cycleSpeed);

  soundBtn.addEventListener("click", () => {
    state.sound = !state.sound;
    save();
    updateHUD();
    if (state.sound) {
      audio();
      sfx.click();
    }
  });

  topupBtn.addEventListener("click", () => {
    state.balance += 10000;
    sfx.topup();
    save();
    updateHUD();
    showBanner("+10,000<small>FREE CREDITS</small>", "win");
  });

  // ---------- Modals ----------
  function openPaytable() {
    sfx.click();
    paytable.classList.add("show");
  }
  function closePaytable() { paytable.classList.remove("show"); }

  $("payBtn").addEventListener("click", openPaytable);
  $("closePay").addEventListener("click", closePaytable);
  paytable.addEventListener("click", (e) => {
    if (e.target === paytable) closePaytable();
  });

  $("resetBtn").addEventListener("click", () => {
    if (game.busy || game.mode !== "base") { closePaytable(); return; }
    try { localStorage.removeItem(SAVE_KEY); } catch (err) { /* ignore */ }
    state = Object.assign({}, STORAGE);
    game.autoRemaining = 0;
    game.featureWin = 0;
    game.lastWin = 0;
    game.mode = "base";
    game.spinsLeft = 0;
    game.sticky = new Set();
    game.locked = new Map();
    clearTimeout(game.nextTimer);
    game.nextTimer = null;
    clearWinVisuals();
    clearReelBadges();
    closePaytable();
    updateHUD();
    showBanner("RESET", "win");
  });

  function buildBuyList() {
    buyList.innerHTML = "";
    ["dead", "duel", "train"].forEach((type) => {
      const meta = BONUS_META[type];
      const cost = BONUS_COST[type] * state.bet;
      const row = document.createElement("div");
      row.className = "buycard";
      row.innerHTML =
        '<div class="buyicon">' + ((window.SLOT_ART || {})[meta.icon] || "") + "</div>" +
        '<div><div class="buyname">' + meta.name + '</div><div class="buydesc">' + meta.desc + "</div></div>";
      const btn = document.createElement("button");
      btn.className = "buybtn";
      btn.textContent = fmt(cost);
      btn.disabled = state.balance < cost;
      btn.addEventListener("click", () => buyFeature(type));
      row.appendChild(btn);
      buyList.appendChild(row);
    });
  }

  function openBonus() {
    if (game.busy || game.mode !== "base") return;
    sfx.click();
    buildBuyList();
    bonusModal.classList.add("show");
  }
  function closeBonus() { bonusModal.classList.remove("show"); }

  bonusBtn.addEventListener("click", openBonus);
  $("closeBonus").addEventListener("click", closeBonus);
  bonusModal.addEventListener("click", (e) => {
    if (e.target === bonusModal) closeBonus();
  });

  function buyFeature(type) {
    if (game.busy || game.mode !== "base") return;
    const cost = BONUS_COST[type] * state.bet;
    if (state.balance < cost) { promptTopup(); return; }
    closeBonus();
    state.balance -= cost;
    game.busy = true;
    game.autoRemaining = 0;
    game.lastWin = 0;
    clearTimeout(game.nextTimer);
    game.nextTimer = null;
    clearWinVisuals();
    clearReelBadges();
    save();
    updateHUD();
    sfx.click();
    runFeature(type).then(() => {
      game.busy = false;
      updateHUD();
      scheduleAuto();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (paytable.classList.contains("show") || bonusModal.classList.contains("show")) {
      if (e.key === "Escape") { closePaytable(); closeBonus(); }
      return;
    }
    if (e.code === "Space" || e.key === " ") {
      e.preventDefault();
      if (!spinBtn.disabled) {
        game.autoRemaining = 0;
        clearTimeout(game.nextTimer);
        game.nextTimer = null;
        updateHUD();
        doSpin();
      }
    } else if (e.key === "Escape") {
      closePaytable();
      closeBonus();
    } else if (e.key === "t" || e.key === "T") {
      cycleSpeed();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      changeBet(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      changeBet(-1);
    } else if (e.key === "b" || e.key === "B") {
      openBonus();
    }
  });

  document.addEventListener("pointerdown", () => { audio(); }, { once: true });
  window.addEventListener("resize", sizeReels);

  // ---------- Paytable ----------
  function payRow(symId) {
    const def = SYMBOLS[symId];
    const row = document.createElement("div");
    row.className = "prow";
    row.innerHTML =
      '<span class="psym">' + artFor({ id: symId }) + "</span>" +
      '<span class="pname">' + def.name + "</span>" +
      '<span class="ppay"><b>' + def.pay[3] + "</b> &middot; <b>" + def.pay[4] + "</b> &middot; <b>" + def.pay[5] + "</b><br><small>3 &middot; 4 &middot; 5 of a kind</small></span>";
    return row;
  }

  function buildPaytable() {
    const rows = $("ptableRows");
    rows.innerHTML = "";
    PAY_SYMBOLS.forEach((id) => rows.appendChild(payRow(id)));

    const special = [
      { id: "vs", name: "VS DuelReel", text: "Turns its reel wild<br><small>when it completes a win</small>" },
      { id: "duel", name: "Duel at Dawn", text: "3+ = 10 free spins<br><small>boosted VS reels</small>" },
      { id: "train", name: "Great Train Robbery", text: "3+ = 10 free spins<br><small>sticky wilds</small>" },
      { id: "dead", name: "Dead Man's Hand", text: "3+ = hold &amp; spin<br><small>collect wilds &amp; multipliers</small>" },
      { id: "wildc", name: "Collect Wild", text: "Adds a wild<br><small>to the showdown</small>" },
      { id: "mult", name: "Multiplier", text: "Adds to the<br><small>showdown multiplier</small>" }
    ];
    special.forEach((s) => {
      const icon = s.id === "mult"
        ? ((window.SLOT_ART && window.SLOT_ART.mult) ? window.SLOT_ART.mult(5) : "")
        : artFor({ id: s.id });
      const row = document.createElement("div");
      row.className = "prow";
      row.innerHTML =
        '<span class="psym">' + icon + "</span>" +
        '<span class="pname">' + s.name + "</span>" +
        '<span class="ppay">' + s.text + "</span>";
      rows.appendChild(row);
    });
  }

  // ---------- Init ----------
  function init() {
    const sceneEl = $("scene");
    if (sceneEl && window.SLOT_LANDSCAPE) sceneEl.innerHTML = window.SLOT_LANDSCAPE;
    sizeReels();
    populateStatic();
    buildPaytable();
    updateHUD();
  }

  init();
})();
