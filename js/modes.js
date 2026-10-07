'use strict';

const EVENTS = [
  { id: 'wind', name: 'WINDSTORM', desc: 'gusts shove you sideways, then turn around', w: 3 },
  { id: 'ice', name: 'ICE AGE', desc: 'every ledge is slippery', w: 3 },
  { id: 'lowgrav', name: 'LOW GRAVITY', desc: 'float like an astronaut', w: 2 },
  { id: 'heavy', name: 'HEAVY GRAVITY', desc: 'every jump falls short', w: 2 },
  { id: 'quake', name: 'EARTHQUAKE', desc: 'the tower bucks and throws you around', w: 2 },
  { id: 'dark', name: 'BLACKOUT', desc: 'who turned off the lights?', w: 2 },
  { id: 'mirror', name: 'MIRROR', desc: 'left is right and right is left', w: 1 },
  { id: 'bouncy', name: 'TRAMPOLINES', desc: 'every ledge bounces you up', w: 2 },
  { id: 'crumble', name: 'CRUMBLING LEDGES', desc: "ledges break if you don't move", w: 2 },
  { id: 'turbo', name: 'TURBO', desc: 'super speed!', w: 2 },
  { id: 'drift', name: 'SLIDING LEDGES', desc: 'the ledges slide back and forth', w: 3 },
  { id: 'rush', name: 'RUSH', desc: 'the tower rises much faster', w: 2 },
];
const CLASHES = [['lowgrav', 'heavy'], ['ice', 'turbo'], ['dark', 'rush']];
const EVENT_WARN = 90, EVENT_LEN = 540, EVENT_GAP = 210;
const eventById = id => EVENTS.find(e => e.id === id);
const activeEvent = id => {
  for (const e of G.events) if (e.id === id && e.t >= EVENT_WARN) return e;
  return null;
};
const chaosOn = id => !!activeEvent(id);
function eventStrength(id) {
  const e = activeEvent(id);
  if (!e) return 0;
  const t = e.t - EVENT_WARN;
  return clamp(Math.min(t / 30, (EVENT_LEN - t) / 30), 0, 1);
}
function windPush() {
  const e = activeEvent('wind');
  if (!e) return 0;
  const f = G.frame, gust = 0.72 + 0.2 * Math.sin(f * 0.043) + 0.3 * Math.max(0, Math.sin(f * 0.11 + e.seed));
  return e.dir * 0.2 * wideK(0.15) * eventStrength('wind') * gust;
}
function chaosGravity() {
  if (!G.events.length) return 1;
  return 1 - 0.45 * eventStrength('lowgrav') + 0.2 * eventStrength('heavy');
}
function ledgeShift(p, f = G.frame) {
  if (!G.events.length || p.full || p.none) return 0;
  const k = eventStrength('drift');
  if (!k) return 0;
  const d = Math.sin(f * 0.034 + p.n * 1.7 + (p.lane || 0) * 2.3) * 52 * wideK(0.3) * k;
  return clamp(d, LEFT + 4 - p.x1, RIGHT - 4 - p.x2);
}
const ledgeCarry = p => (G.events.length ? ledgeShift(p) - ledgeShift(p, G.frame - 1) : 0);

function startTwist() {
  G.twists++;
  const double = G.twists > 2 && Math.random() < Math.min(0.85, (0.2 + G.twists * 0.05) * wideK(0.15));
  const picked = [];
  for (let n = double ? 2 : 1; n > 0; n--) {
    const pool = EVENTS.filter(e => !G.lastEvents.includes(e.id) && !picked.includes(e) &&
      !picked.some(p => CLASHES.some(([a, b]) => (a === p.id && b === e.id) || (b === p.id && a === e.id))));
    let r = Math.random() * pool.reduce((a, e) => a + e.w, 0), ev = pool[0];
    for (const e of pool) { r -= e.w; if (r <= 0) { ev = e; break; } }
    picked.push(ev);
  }
  G.lastEvents = picked.map(e => e.id);
  G.events = picked.map(e => ({ id: e.id, t: 0, dir: Math.random() < 0.5 ? -1 : 1, seed: Math.random() * 6 }));
  if (picked.length > 1) G.banners.push({ text: T('DOUBLE TWIST!'), sub: picked.map(e => T(e.name)).join(' + '), t: 0, dur: 170, color: '#ff5fb8' });
  else G.banners.push({ text: T(picked[0].name), sub: T(picked[0].desc), t: 0, dur: 150, color: '#c77dff' });
  Sfx.twist();
}

function updateChaos() {
  if (!G.scrolling || G.finished) return;
  if (!G.events.length) {
    if (--G.eventT <= 0) startTwist();
    return;
  }
  let done = false;
  for (const e of G.events) {
    e.t++;
    if (e.t < EVENT_WARN && e.t % 30 === 0) Sfx.warn();
    if (e.t === EVENT_WARN) haptic('light');
    if (e.t >= EVENT_WARN + EVENT_LEN) { done = true; continue; }
    if (e.t >= EVENT_WARN) applyEvent(e);
  }
  if (done) {
    if (G.crumbling) { G.crumbling.crumbleAt = 0; G.crumbling = null; }
    G.events = G.events.filter(e => e.t < EVENT_WARN + EVENT_LEN);
    if (!G.events.length) G.eventT = EVENT_GAP / wideK(0.3);
  }
}

function applyEvent(e) {
  const k = eventStrength(e.id), t = e.t - EVENT_WARN;
  if (e.id === 'wind') {
    if (t === EVENT_LEN >> 1) { e.dir = -e.dir; Sfx.twist(); haptic('light'); }
    const push = Math.abs(windPush());
    for (let i = 0; i < (LOW ? 1 : 2); i++) {
      const x = e.dir > 0 ? LEFT - 10 : RIGHT + 10, sp = 10 + Math.random() * 8 + push * 30;
      G.particles.push({ x, y: G.camY + Math.random() * H, vx: e.dir * sp, vy: (Math.random() - 0.5) * 0.6, g: 0, rot: 0, vr: 0, life: 44, max: 44, size: 1.6 + push * 6, color: 'rgba(235,245,255,0.55)', kind: 'streak' });
    }
  } else if (e.id === 'quake') {
    G.shake = Math.max(G.shake, 6 * k);
    if (P.onGround && t % (34 + (e.seed * 3 | 0)) === 0) {
      P.vy = -4.6; P.onGround = false; P.coyote = 0;
      P.vx += (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 2) * wideK(0.2);
      Sfx.crash();
    }
    if (!LOW && t % 6 === 0) burst(LEFT + Math.random() * (RIGHT - LEFT), G.camY - 6, 1, { angle: Math.PI / 2, spread: 0.4, speed: 2, g: 0.25, color: 'rgba(150,140,130,0.8)', size: 3, life: 70 });
  } else if (e.id === 'turbo' && !P.onGround && G.frame % 2 === 0) {
    burst(P.x - P.face * 10, P.y - 26, 1, { angle: P.face > 0 ? Math.PI : 0, spread: 0.3, speed: 3, g: 0, color: 'rgba(255,217,61,0.7)', size: 3, life: 14 });
  } else if (e.id === 'crumble') {
    const p = P.onGround ? P.ledge : null;
    if (G.crumbling && G.crumbling !== p) { G.crumbling.crumbleAt = 0; G.crumbling = null; }
    if (p && !p.full && !brokenLedge(p)) {
      if (!p.crumbleAt) { p.crumbleAt = G.frame; G.crumbling = p; }
      else if (G.frame - p.crumbleAt > 42) {
        p.brokenUntil = G.frame + 240; p.crumbleAt = 0; G.crumbling = null;
        const th = themeOf(p.n), sh = ledgeShift(p);
        for (let x = p.x1 + 6; x < p.x2; x += 10) burst(x + sh, -p.n * FLOOR_H + 6, 2, { angle: Math.PI / 2, spread: 1.5, speed: 2, g: 0.3, color: th.body, size: 4, life: 40 });
        Sfx.crash();
      }
    }
  }
}
const brokenLedge = p => !!(p.brokenUntil && G.frame < p.brokenUntil);
function chaosLand() {
  if (!chaosOn('bouncy') || state !== 'play') return;
  P.vy = -(P.ph.jumpBase * 1.3); P.onGround = false; P.coyote = 0; P.squash = 1;
  Sfx.bounce();
}
function chaosLedge(p, sy, sh) {
  const x1 = p.x1 + sh, w = p.x2 - p.x1;
  const ice = eventStrength('ice'), bouncy = eventStrength('bouncy'), drift = eventStrength('drift');
  if (ice) { ctx.fillStyle = `rgba(215,245,255,${0.8 * ice})`; rr(x1, sy - 1, w, 4, 2); ctx.fill(); }
  if (bouncy) {
    ctx.globalAlpha = bouncy;
    ctx.strokeStyle = '#ff7fb7'; ctx.lineWidth = 1.6;
    for (let x = x1 + 10; x < x1 + w - 6; x += 22) {
      ctx.beginPath(); for (let i = 0; i <= 4; i++) ctx.lineTo(x + (i % 2 ? 3 : -3), sy - i * 1.6); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  if (drift && !p.full) {
    const v = ledgeShift(p) - ledgeShift(p, G.frame - 4);
    if (Math.abs(v) > 0.6) {
      ctx.globalAlpha = drift * Math.min(1, Math.abs(v) / 4) * 0.7;
      ctx.fillStyle = '#c77dff';
      const bx = v > 0 ? x1 - 6 : x1 + w + 6, d = v > 0 ? -1 : 1;
      for (let i = 0; i < 3; i++) ctx.fillRect(bx + d * i * 7 - 2, sy + 3 + i * 3, 4, 2);
      ctx.globalAlpha = 1;
    }
  }
}
function drawBlackout() {
  const k = eventStrength('dark');
  if (!k) return;
  const x = P.x, y = P.y - G.camY - 26, flash = G.frame % 200 < 5 ? 0.45 : 1;
  const g = ctx.createRadialGradient(x, y, 46, x, y, 160);
  g.addColorStop(0, 'rgba(4,5,12,0)'); g.addColorStop(1, `rgba(4,5,12,${0.97 * k * flash})`);
  ctx.fillStyle = g; ctx.fillRect(-20, -20, GW + 40, H + 40);
}
function drawChaosHUD(x, y) {
  if (!G.events.length) {
    if (G.scrolling) text(T('NEXT TWIST: {0}', Math.ceil(G.eventT / 60)), x, y, 11, '#c9d2e8', { align: 'right', lw: 3 });
    return y + 16;
  }
  for (const e of G.events) {
    const ev = eventById(e.id), name = T(ev.name) + (e.id === 'wind' ? (e.dir > 0 ? ' →' : ' ←') : '');
    if (e.t < EVENT_WARN) { if ((G.frame >> 3) & 1) text(`! ${name}`, x, y, 13, '#ffd93d', { align: 'right', lw: 4, max: 190 }); }
    else text(name, x, y, 13, '#c77dff', { align: 'right', lw: 4, max: 190 });
    y += 17;
  }
  const e = G.events[0];
  if (e.t >= EVENT_WARN) {
    const left = 1 - (e.t - EVENT_WARN) / EVENT_LEN;
    ctx.fillStyle = 'rgba(10,14,34,0.6)'; rr(x - 90, y - 7, 90, 6, 3); ctx.fill();
    ctx.fillStyle = '#c77dff'; rr(x - 90, y - 7, Math.max(6, 90 * left), 6, 3); ctx.fill();
  }
  return y + 12;
}

const ROCK_WARN = 54, MAX_HEARTS = 3;
function updateRocks() {
  if (G.scrolling && !G.finished && --G.rockT <= 0) {
    G.rockT = (Math.max(26, 72 - G.level * 9) + Math.random() * 28) / wideK(0.5);
    const aimed = Math.random() < Math.min(0.6, 0.35 * wideK(0.45));
    const x = clamp(aimed ? P.x + (Math.random() - 0.5) * 70 : LEFT + 20 + Math.random() * (RIGHT - LEFT - 40), LEFT + 14, RIGHT - 14);
    const big = Math.random() < 0.15;
    G.rocks.push(newFaller(themeOf(midFloor()), x, big));
  }
  for (const r of G.rocks) {
    if (r.warn > 0) {
      if (r.warn % 18 === 0) Sfx.warn();
      if (--r.warn === 0) { r.y = G.camY - 30; r.vy = 3 + G.level * 0.5; }
      continue;
    }
    r.py = r.y;
    const prevBottom = r.y + r.r;
    r.vy = Math.min(r.vy + 0.32, 13);
    r.y += r.vy; r.rot += r.vr;
    if (P.inv <= 0 && Math.abs(r.x - P.x) < r.r + 9 && r.y + r.r > P.y - 50 && r.y - r.r < P.y) { hitClimber(r); if (state !== 'play') return; continue; }
    const bottom = r.y + r.r;
    for (let n = Math.floor(-prevBottom / FLOOR_H + 1e-6); n >= Math.max(0, Math.ceil(-bottom / FLOOR_H - 1e-6)); n--) {
      const t = -n * FLOOR_H;
      if (prevBottom > t || bottom < t) continue;
      if (plat(n).all.some(p => { const sh = ledgeShift(p); return r.x + r.r * 0.6 >= p.x1 + sh && r.x - r.r * 0.6 <= p.x2 + sh && !brokenLedge(p); })) {
        shatter(r, t);
        break;
      }
    }
    if (r.y - G.camY > H + 60) r.dead = true;
  }
  compact(G.rocks, r => !r.dead);
}
const ZONE_FALLERS = {
  stone: ['rock', 'brick', 'boulder'],
  ice: ['icicle', 'snowball', 'icecube'],
  wood: ['barrel', 'log', 'crate'],
  steel: ['anvil', 'gear', 'nut'],
  candy: ['gumball', 'wrapped', 'lolly'],
  cloud: ['hail', 'raindrop', 'snowball'],
  shine: ['goldbar', 'coin', 'crown'],
  crystal: ['shard', 'gem', 'geode'],
  neon: ['block', 'tetro', 'disc'],
  cosmic: ['meteor', 'comet', 'planet'],
};
const SPECIAL_FALLERS = { souls: 'fireball', witcher: 'sword', gravity: 'weight', lumiere: 'paint', monolith: 'paint', arcade: 'coin', glitch: 'glitchblock', prism: 'gem' };
function fallerFor(t) {
  if (SPECIAL_FALLERS[t.special]) return SPECIAL_FALLERS[t.special];
  if (STORMY.has(t.name)) return 'bolt';
  if (t.name === 'THE SUMMIT') return 'star';
  return ZONE_FALLERS[t.kind][t.index % 3];
}
function newFaller(t, x, big) {
  const type = fallerFor(t), hue = (Math.random() * 360) | 0;
  let c1 = t.body, c2 = t.edge;
  if (t.kind === 'neon') { c1 = t.top; c2 = t.body; }
  else if (t.kind === 'candy') { c1 = `hsl(${hue}, 80%, 62%)`; c2 = `hsl(${(hue + 50) % 360}, 80%, 70%)`; }
  else if (t.kind === 'ice' || type === 'planet') { c1 = t.top; c2 = t.body; }
  else if (type === 'raindrop') { c1 = '#7fb4ff'; c2 = '#cfe5fb'; }
  else if (type === 'meteor') { c1 = '#8a6a5a'; c2 = '#ff8a3d'; }
  else if (t.kind === 'shine') { c1 = t.body; c2 = t.top; }
  if (FALLER_COLORS[type]) [c1, c2] = FALLER_COLORS[type];
  return { x, y: 0, vy: 0, r: big ? 20 : 12 + Math.random() * 4, warn: ROCK_WARN, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.2,
    type, special: t.special, c1, c2, seed: (Math.random() * 1000) | 0, landY: G.camY ? landingY(x) : null };
}
function landingY(x) {
  const top = Math.floor(-G.camY / FLOOR_H), bottom = Math.max(0, Math.floor(-(G.camY + H) / FLOOR_H));
  for (let n = top; n >= bottom; n--) {
    if (plat(n).all.some(p => !brokenLedge(p) && x >= p.x1 && x <= p.x2)) return -n * FLOOR_H;
  }
  return null;
}
function shatter(r, y) {
  r.dead = true;
  burst(r.x, y - 2, 12, { angle: -Math.PI / 2, spread: 2.6, speed: 2.8, g: 0.25, colors: [r.c1, r.c2, '#ffffff'], size: 3.5, life: 28, kind: 'spark' });
  if (Math.abs(r.y - P.y) < H) Sfx.crash();
}
function hitClimber(r) {
  shatter(r, r.y);
  G.hearts--; G.hits++;
  if (G.hits === 1) G.cleanFloor = G.highest;
  P.hurt = 36; P.inv = 100;
  P.vx = (Math.sign(P.x - r.x) || 1) * 6;
  P.vy = Math.min(P.vy, -4); P.onGround = false; P.coyote = 0;
  G.shake = 10;
  Sfx.hit();
  haptic('heavy');
  if (G.combo.active) endCombo();
  if (G.hearts <= 0) endRun(false, 'rocks');
}
function outline(w = 2) { ctx.strokeStyle = NAVY; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.stroke(); }
function drawFaller(r, x, y) {
  const s = r.r * 1.3, c1 = r.c1, c2 = r.c2;
  glowAt(x, y, s * 2.4, 'rgba(8,10,24,0.7)');
  glowAt(x, y, s * 1.9, 'rgba(255,70,50,0.6)', 0.6 + 0.4 * Math.sin(G.frame * 0.3));
  const speed = Math.min(1, r.vy / 12);
  for (let i = 0; i < 3; i++) limb(x + (i - 1) * s * 0.55, y - s * 1.3 - 4, x + (i - 1) * s * 0.55, y - s * 1.3 - 4 - 18 * speed, 1.6, `rgba(255,255,255,${0.35 * speed})`);
  ctx.save();
  ctx.translate(x, y);
  const spin = () => ctx.rotate(r.rot);
  const path = pts => { ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px * s, py * s) : ctx.moveTo(px * s, py * s))); ctx.closePath(); };
  switch (r.type) {
    case 'rock': case 'boulder':
      spin();
      ctx.fillStyle = c1; ctx.beginPath();
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, k = (r.type === 'boulder' ? 1.05 : 0.9) * (0.8 + hashSeed(r.seed, i, 3) * 0.35); ctx.lineTo(Math.cos(a) * s * k, Math.sin(a) * s * k); }
      ctx.closePath(); ctx.fill(); outline();
      circ(-s * 0.3, -s * 0.3, s * 0.28, 'rgba(255,255,255,0.3)');
      if (r.type === 'boulder') limb(-s * 0.2, s * 0.1, s * 0.4, s * 0.45, 1.4, 'rgba(0,0,0,0.35)');
      break;
    case 'brick':
      spin(); ctx.fillStyle = c1; rr(-s, -s * 0.55, s * 2, s * 1.1, 3); ctx.fill(); outline();
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(-s, -0.6, s * 2, 1.2); ctx.fillRect(-0.6, -s * 0.55, 1.2, s * 0.55);
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(-s + 2, -s * 0.55 + 1.5, s * 2 - 4, 2);
      break;
    case 'fireball':
      for (let i = 0; i < 4; i++) tri(-s * 0.7 + i * s * 0.47, -s * 0.2, -s * 0.4 + i * s * 0.47, -s * 0.2, -s * 0.55 + i * s * 0.47 + Math.sin(G.frame * 0.4 + i) * 2, -s * 2.4 - (i % 2) * s * 0.5, i % 2 ? '#ffd93d' : '#ff6a1a');
      circ(0, 0, s, '#ff6a1a'); ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); outline();
      circ(0, s * 0.1, s * 0.6, '#ffd93d'); circ(0, s * 0.2, s * 0.3, '#fff6c2');
      break;
    case 'icicle':
      path([[-0.6, -1.6], [0.6, -1.6], [0, 1.4]]); ctx.fillStyle = c1; ctx.fill(); outline();
      limb(-s * 0.22, -s * 1.4, 0, s * 0.7, 1.5, 'rgba(255,255,255,0.85)');
      break;
    case 'snowball':
      spin(); circ(0, 0, s, '#f4faff'); ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); outline();
      circ(s * 0.25, s * 0.25, s * 0.45, c1); circ(-s * 0.35, -s * 0.35, s * 0.25, '#ffffff');
      break;
    case 'icecube':
      spin(); ctx.fillStyle = c1; rr(-s * 0.85, -s * 0.85, s * 1.7, s * 1.7, 4); ctx.fill(); outline();
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(-s * 0.6, -s * 0.6, s * 0.5, s * 0.25); ctx.fillRect(-s * 0.6, -s * 0.6, s * 0.2, s * 0.6);
      break;
    case 'barrel':
      spin(); ctx.fillStyle = c1; rr(-s * 0.8, -s, s * 1.6, s * 2, s * 0.45); ctx.fill(); outline();
      ctx.fillStyle = '#5a5f6b'; ctx.fillRect(-s * 0.8, -s * 0.55, s * 1.6, 2.2); ctx.fillRect(-s * 0.8, s * 0.4, s * 1.6, 2.2);
      ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(-s * 0.45, -s, 2, s * 2);
      break;
    case 'log':
      spin(); ctx.fillStyle = c1; rr(-s * 1.2, -s * 0.55, s * 2.4, s * 1.1, s * 0.5); ctx.fill(); outline();
      ell(s * 1.05, 0, s * 0.3, s * 0.5, c2); ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(s * 1.05, 0, s * 0.2, 0, Math.PI * 2); ctx.stroke();
      break;
    case 'crate':
      spin(); ctx.fillStyle = c1; ctx.fillRect(-s * 0.9, -s * 0.9, s * 1.8, s * 1.8); ctx.beginPath(); ctx.rect(-s * 0.9, -s * 0.9, s * 1.8, s * 1.8); outline();
      limb(-s * 0.8, -s * 0.8, s * 0.8, s * 0.8, 2.2, c2); limb(-s * 0.8, s * 0.8, s * 0.8, -s * 0.8, 2.2, c2);
      break;
    case 'sword':
      ctx.rotate(Math.PI);
      ctx.fillStyle = '#e9eef6'; path([[-0.18, -1.1], [0.18, -1.1], [0.18, 1.2], [0, 1.6], [-0.18, 1.2]]); ctx.fill(); outline(1.6);
      ctx.fillStyle = '#c9a24a'; ctx.fillRect(-s * 0.7, -s * 1.2, s * 1.4, s * 0.25);
      ctx.fillStyle = '#3a2817'; ctx.fillRect(-s * 0.13, -s * 1.9, s * 0.26, s * 0.7);
      break;
    case 'anvil':
      ctx.fillStyle = c1; path([[-1.25, -0.6], [1.35, -0.6], [0.7, -0.1], [0.4, 0.3], [0.7, 0.8], [-0.7, 0.8], [-0.4, 0.3], [-0.6, -0.1]]); ctx.fill(); outline();
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(-s * 1.1, -s * 0.6, s * 2.3, 2);
      break;
    case 'gear':
      spin(); gear(0, 0, s * 1.05, 8, 0, c1); ctx.beginPath(); ctx.arc(0, 0, s * 1.05, 0, Math.PI * 2); outline(1.4);
      break;
    case 'nut':
      spin(); ctx.fillStyle = c1; ctx.beginPath(); for (let i = 0; i < 6; i++) ctx.lineTo(Math.cos(i * Math.PI / 3) * s, Math.sin(i * Math.PI / 3) * s); ctx.closePath(); ctx.fill(); outline();
      circ(0, 0, s * 0.4, NAVY);
      break;
    case 'weight':
      ctx.fillStyle = '#2a2f3a'; rr(-s * 1.1, -s * 0.75, s * 2.2, s * 1.5, 4); ctx.fill(); outline();
      ctx.fillStyle = '#ff8a3d'; ctx.fillRect(-s * 1.1, -s * 0.75, s * 2.2, 3);
      text('10T', 0, 1, s * 0.95, '#ffffff', { stroke: false });
      break;
    case 'gumball':
      circ(0, 0, s, c1); ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); outline();
      circ(-s * 0.35, -s * 0.35, s * 0.3, 'rgba(255,255,255,0.75)');
      break;
    case 'wrapped':
      spin(); tri(-s * 0.7, 0, -s * 1.5, -s * 0.6, -s * 1.5, s * 0.6, c2); tri(s * 0.7, 0, s * 1.5, -s * 0.6, s * 1.5, s * 0.6, c2);
      ell(0, 0, s * 0.85, s * 0.65, c1); ctx.beginPath(); ctx.ellipse(0, 0, s * 0.85, s * 0.65, 0, 0, Math.PI * 2); outline();
      limb(-s * 0.3, -s * 0.5, s * 0.1, s * 0.55, 2, 'rgba(255,255,255,0.7)');
      break;
    case 'lolly':
      spin(); limb(0, 0, 0, s * 1.8, 2.4, '#f6f0e6');
      circ(0, 0, s, c1); ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); outline();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.2; ctx.beginPath(); for (let k = 0; k < 26; k++) ctx.lineTo(Math.cos(k * 0.45) * k * s / 30, Math.sin(k * 0.45) * k * s / 30); ctx.stroke();
      break;
    case 'hail':
      circ(0, 0, s * 0.85, '#ffffff'); ctx.beginPath(); ctx.arc(0, 0, s * 0.85, 0, Math.PI * 2); outline();
      circ(s * 0.2, s * 0.2, s * 0.35, '#cfe5fb');
      break;
    case 'raindrop':
      ctx.fillStyle = c1; ctx.beginPath(); ctx.moveTo(0, -s * 1.5); ctx.quadraticCurveTo(s * 1.05, s * 0.2, 0, s); ctx.quadraticCurveTo(-s * 1.05, s * 0.2, 0, -s * 1.5); ctx.fill(); outline();
      circ(-s * 0.3, 0, s * 0.22, 'rgba(255,255,255,0.7)');
      break;
    case 'bolt':
      ctx.fillStyle = '#ffe14d'; path([[0.3, -1.6], [-0.6, 0.15], [0, 0.15], [-0.35, 1.6], [0.7, -0.35], [0.05, -0.35]]); ctx.fill(); outline();
      break;
    case 'goldbar':
      spin(); ctx.fillStyle = c1; path([[-1, 0.5], [1, 0.5], [0.65, -0.5], [-0.65, -0.5]]); ctx.fill(); outline();
      ctx.fillStyle = '#fff3b0'; ctx.fillRect(-s * 0.55, -s * 0.5 + 1.5, s * 1.1, 2);
      break;
    case 'coin':
      ctx.scale(Math.max(0.2, Math.abs(Math.cos(G.frame * 0.15 + r.seed))), 1);
      circ(0, 0, s, c1); ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); outline();
      circ(0, 0, s * 0.62, c2); text('★', 0, 1, s * 1.05, '#fff3b0', { stroke: false, cache: false });
      break;
    case 'crown':
      ctx.fillStyle = c1; path([[-1, 0.6], [1, 0.6], [1, -0.6], [0.5, -0.05], [0, -0.75], [-0.5, -0.05], [-1, -0.6]]); ctx.fill(); outline();
      circ(0, s * 0.25, s * 0.18, '#ff4f6d'); circ(-s * 0.55, s * 0.28, s * 0.13, '#4d96ff'); circ(s * 0.55, s * 0.28, s * 0.13, '#6bcb77');
      break;
    case 'paint':
      ctx.fillStyle = '#d8a43a'; ctx.beginPath(); ctx.moveTo(0, -s * 1.5); ctx.quadraticCurveTo(s * 1.1, s * 0.2, 0, s); ctx.quadraticCurveTo(-s * 1.1, s * 0.2, 0, -s * 1.5); ctx.fill(); outline();
      circ(-s * 0.3, 0, s * 0.22, 'rgba(255,255,255,0.6)');
      break;
    case 'shard': case 'gem':
      spin();
      ctx.fillStyle = r.special === 'prism' ? `hsl(${(G.frame * 4 + r.seed) % 360}, 85%, 62%)` : c1;
      path(r.type === 'shard' ? [[0, -1.3], [0.55, 0], [0, 1.3], [-0.55, 0]] : [[-0.9, -0.3], [-0.5, -0.8], [0.5, -0.8], [0.9, -0.3], [0, 1]]); ctx.fill(); outline();
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; path(r.type === 'shard' ? [[0, -1.3], [-0.55, 0], [0, 0]] : [[-0.5, -0.8], [0, -0.3], [-0.9, -0.3]]); ctx.fill();
      break;
    case 'geode':
      spin(); circ(0, 0, s, '#6b5a78'); ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); outline();
      circ(0, 0, s * 0.62, c1); for (let i = 0; i < 6; i++) tri(0, 0, Math.cos(i) * s * 0.55, Math.sin(i) * s * 0.55, Math.cos(i + 0.5) * s * 0.55, Math.sin(i + 0.5) * s * 0.55, c2);
      break;
    case 'block':
      spin(); ctx.fillStyle = c1; ctx.fillRect(-s * 0.8, -s * 0.8, s * 1.6, s * 1.6); ctx.beginPath(); ctx.rect(-s * 0.8, -s * 0.8, s * 1.6, s * 1.6); outline();
      ctx.fillStyle = '#0d0a16'; ctx.fillRect(-s * 0.4, -s * 0.4, s * 0.8, s * 0.8);
      break;
    case 'tetro':
      spin(); ctx.fillStyle = c1;
      for (const [bx, by] of [[-1.5, -0.5], [-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5]]) { ctx.fillRect(bx * s * 0.75, by * s * 0.75, s * 0.75, s * 0.75); ctx.beginPath(); ctx.rect(bx * s * 0.75, by * s * 0.75, s * 0.75, s * 0.75); outline(1.4); }
      break;
    case 'disc':
      spin(); circ(0, 0, s, '#14101e'); ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); outline();
      circ(0, 0, s * 0.4, c1); circ(0, 0, s * 0.1, '#14101e');
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, s * 0.7, 0.3, 1.4); ctx.stroke();
      break;
    case 'glitchblock':
      for (let i = 0; i < 5; i++) { ctx.fillStyle = GLITCH_COLORS[(i + (G.frame >> 2)) % 5]; ctx.fillRect(-s + hashSeed(r.seed, i, G.frame >> 3) * s, -s + i * s * 0.4, s * 1.2, s * 0.4); }
      break;
    case 'meteor': case 'comet':
      tri(-s * 0.75, 0, s * 0.75, 0, 0, -s * (r.type === 'comet' ? 4.5 : 3.2), r.type === 'comet' ? 'rgba(150,220,255,0.6)' : 'rgba(255,150,60,0.65)');
      spin(); ctx.fillStyle = r.type === 'comet' ? '#cfe9ff' : c1; ctx.beginPath();
      for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, k = 0.8 + hashSeed(r.seed, i, 5) * 0.3; ctx.lineTo(Math.cos(a) * s * k, Math.sin(a) * s * k); }
      ctx.closePath(); ctx.fill(); outline();
      break;
    case 'planet':
      circ(0, 0, s * 0.85, c1); ctx.beginPath(); ctx.arc(0, 0, s * 0.85, 0, Math.PI * 2); outline();
      ctx.strokeStyle = c2; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(0, 0, s * 1.5, s * 0.4, -0.3, 0, Math.PI * 2); ctx.stroke();
      break;
    case 'star':
      spin(); drawStar(0, 0, s * 1.2, '#ffd93d');
      break;
    default:
      if (EXTRA_FALLERS[r.type]) EXTRA_FALLERS[r.type](s, r, c1, c2, path, spin);
  }
  ctx.restore();
}
function drawRocks() {
  for (const r of G.rocks) {
    if (r.landY != null && (r.warn > 0 || r.y < r.landY)) {
      const ty = r.landY - G.camY, k = 0.6 + 0.4 * Math.sin(G.frame * 0.35);
      ctx.beginPath(); ctx.ellipse(r.x, ty - 1, r.r * 1.4, r.r * 0.45, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(8,10,24,0.6)'; ctx.lineWidth = 4.5; ctx.stroke();
      ctx.strokeStyle = `rgba(255,79,58,${0.5 * k + 0.5})`; ctx.lineWidth = 2.2; ctx.stroke();
    }
    if (r.warn > 0) {
      const blink = r.warn > 24 ? (r.warn >> 3) & 1 : (r.warn >> 2) & 1;
      ctx.drawImage(warnColumn().c, r.x - r.r * 1.3, 0, r.r * 2.6, 200);
      if (blink || r.warn < 12) {
        tri(r.x - 14, 12, r.x + 14, 12, r.x, 38, '#ff4f3a');
        ctx.strokeStyle = NAVY; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(r.x - 14, 12); ctx.lineTo(r.x + 14, 12); ctx.lineTo(r.x, 38); ctx.closePath(); ctx.stroke();
        text('!', r.x, 21, 16, '#ffffff', { stroke: false });
      }
      continue;
    }
    drawFaller(r, r.x, (r.py == null ? r.y : r.py + (r.y - r.py) * renderAlpha) - G.camY);
  }
}
let warnArt = null;
function warnColumn() {
  if (!warnArt || warnArt.k !== devicePx()) {
    warnArt = drawInto(makeLayer(8, 200), () => {
      const g = ctx.createLinearGradient(0, 0, 0, 200);
      g.addColorStop(0, 'rgba(255,79,58,0.42)'); g.addColorStop(1, 'rgba(255,79,58,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 8, 200);
    });
  }
  return warnArt;
}
function heart(x, y, s, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y + 0.9 * s);
  ctx.bezierCurveTo(x - 1.25 * s, y + 0.05 * s, x - 0.6 * s, y - 0.75 * s, x, y - 0.2 * s);
  ctx.bezierCurveTo(x + 0.6 * s, y - 0.75 * s, x + 1.25 * s, y + 0.05 * s, x, y + 0.9 * s);
  ctx.fill();
  ctx.strokeStyle = NAVY; ctx.lineWidth = 1.6; ctx.stroke();
}
function drawHearts(x, y) {
  for (let i = 0; i < MAX_HEARTS; i++) {
    const full = i < G.hearts, pop = full && P.inv > 0 && i === G.hearts - 1 ? 1 + Math.sin(G.frame * 0.4) * 0.12 : 1;
    heart(x - (MAX_HEARTS - 1 - i) * 25, y, 10 * pop, full ? '#ff4f6d' : 'rgba(255,255,255,0.2)');
  }
}
