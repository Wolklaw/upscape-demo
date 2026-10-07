'use strict';

const SPEED_PER_ZONE = 0.02;
function scalePhysics() {
  const z = G.mode.id === 'sprint' ? 0 : themeOf(P.floor).zone;
  if (z === P.speedZone) return;
  const faster = P.speedZone >= 0 && z > P.speedZone;
  P.speedZone = z;
  const k = 1 + SPEED_PER_ZONE * z, b = P.basePh, ph = P.ph, k2 = k * k;
  ph.gravity = b.gravity * k2; ph.maxFall = b.maxFall * k; ph.maxVx = b.maxVx * k;
  ph.accG = b.accG * k2; ph.accA = b.accA * k2; ph.turnG = b.turnG * k2; ph.turnA = b.turnA * k2; ph.friction = b.friction * k2;
  ph.jumpBase = b.jumpBase * k; ph.jumpK = b.jumpK;
  if (faster) G.popups.push({ x: P.x, y: P.y - 90, text: T('FASTER!'), t: 0 });
}

const GOBLIN_TIME = 60 * 20, GOBLIN_BONUS = 500;
const goblinModes = new Set(['classic', 'chaos', 'rockfall']);
const nextGoblin = () => 60 * (32 + Math.random() * 23) / wideK(0.35);
const goblinBonus = () => GOBLIN_BONUS + 100 * themeOf(P.floor).zone;

function trackClimb() {
  const fresh = G.peakY === undefined;
  const peak = fresh ? P.y : Math.min(G.peakY, P.y);
  const rise = fresh ? 0 : G.peakY - peak;
  G.peakY = peak;
  G.climbAvg = (G.climbAvg || 0) * 0.985 + rise * 0.015;
}

function gobSound(g, name, vol = 1) {
  const dx = g.x - P.x, dy = (g.y - P.y) * 0.8;
  const near = clamp(1 - Math.hypot(dx, dy) / 760, 0.1, 1) * vol * (g.y - G.camY > H + 20 ? 0.5 : 1);
  Sfx[name](near, clamp(dx / 260, -0.85, 0.85), g.king ? 0.62 : 0.9 + Math.random() * 0.2);
}

function spawnGoblin(king) {
  const s = king ? 1.75 : 1.25;
  const n = Math.max(0, Math.floor(-(G.camY + H + 30) / FLOOR_H)), p = ledgeNear(n, P.x);
  const g = {
    x: clamp(P.x, p.x1 + 10, p.x2 - 10), fy: -n * FLOOR_H, y: 0, n, ledge: p, vx: 0, vy: 0, air: false, rest: 24, wind: 0, squash: 0, ph: 0,
    s, foot: 23.5 * s, t: 0, dir: P.x < GW / 2 ? -1 : 1, king, leaving: false, laugh: 0, step: 0, snarl: 0,
  };
  g.y = g.fy - g.foot;
  G.goblin = g;
  if (king) {
    G.kingDone = true;
    G.banners.push({ text: T('THE GOBLIN KING!'), sub: T('the final challenge: reach the summit before he catches you'), t: 0, dur: 220, color: '#c77dff' });
    Sfx.goblinKing();
  } else {
    G.banners.push({ text: T('GOBLIN!'), sub: T('he keeps up with you: stay ahead for 20 seconds'), t: 0, dur: 170, color: '#7dd34a' });
    Sfx.goblin();
  }
  haptic('heavy');
}

const gobVx = () => 8 * wideK(0.25);

function planGoblinJump(g, zone) {
  const grav = 0.5 * (1 + SPEED_PER_ZONE * zone) ** 2;
  const gap = g.king ? 520 : Math.max(300, 560 - g.t * 0.3) * clamp(1.6 - (G.climbAvg || 0) / 5, 1, 1.5);
  const lag = g.fy - (P.y + gap);
  const reach = clamp(2 + Math.ceil((lag + (g.king ? 0 : 160)) / 45) - (Math.random() < 0.3 ? 1 : 0), 1, g.king ? 11 : 9);
  const top = Math.min(g.n + reach, Math.max(g.n + 1, Math.floor(-P.y / FLOOR_H) + 1));
  let pick = null;
  for (let k = top; k > g.n; k--) {
    const p = ledgeNear(k, P.x);
    if (p.none || brokenLedge(p)) continue;
    const up = (k - g.n) * FLOOR_H, vy = Math.sqrt(2 * grav * (up + 26));
    const t = (vy + Math.sqrt(Math.max(0, vy * vy - 2 * grav * up))) / grav;
    const span = p.x2 - p.x1 - 16;
    const tx = clamp(P.x, p.x1 + 8, p.x2 - 8) + (Math.random() - 0.5) * Math.min(48, span);
    const vx = (tx - g.x) / t;
    if (Math.abs(vx) <= gobVx()) { pick = { vy, vx }; break; }
    if (k === g.n + 1 || !pick) pick = { vy, vx: clamp(vx, -gobVx(), gobVx()) };
  }
  if (!pick) {
    const up = FLOOR_H, vy = Math.sqrt(2 * grav * (up + 40));
    pick = { vy, vx: clamp((P.x - g.x) / 50, -gobVx(), gobVx()) };
  }
  if (Math.random() < 0.3) { pick.vx *= 1 + (Math.random() - 0.5) * 0.5; pick.vy *= 1 + (Math.random() - 0.5) * 0.25; }
  if (g.king) pick.vy *= 1.08;
  return pick;
}

function goblinLand(g, n, p) {
  g.ledge = p;
  g.air = false; g.n = n; g.fy = -n * FLOOR_H; g.vy = 0; g.vx = 0;
  g.squash = 1;
  const lag = g.fy - P.y;
  g.rest = Math.max(2, 11 - Math.floor(Math.max(0, lag - 300) / 50)) + Math.floor(Math.random() * 6) + (g.king ? 5 : 0);
  gobSound(g, 'gLand', g.king ? 1.4 : 1);
  if (g.king && Math.abs(g.y - P.y) < 500) G.shake = Math.max(G.shake, 3);
}

function updateGoblin() {
  const m = G.mode.id;
  if (m === 'sprint' || !G.scrolling || G.finished) return;
  trackClimb();
  if (!G.goblin) {
    if (!G.kingDone && P.floor >= TOP_FLOOR - TIER_FLOORS) spawnGoblin(true);
    else if (goblinModes.has(m) && P.floor < (DEMO ? DEMO_TOP - 50 : TOP_FLOOR - TIER_FLOORS - 20) && --G.goblinT <= 0) spawnGoblin(false);
    return;
  }
  const g = G.goblin;
  g.t++;
  if (g.leaving) {
    g.vy += 0.6; g.fy += g.vy; g.x += g.dir * 2;
    g.y = g.fy - g.foot;
    if (g.y - G.camY > H + 160) G.goblin = null;
    return;
  }
  const zone = themeOf(P.floor).zone, grav = 0.5 * (1 + SPEED_PER_ZONE * zone) ** 2;
  if (g.squash > 0) g.squash = Math.max(0, g.squash - 0.12);
  if (g.air) {
    const prev = g.fy;
    g.vy = Math.min(15 * (1 + SPEED_PER_ZONE * zone), g.vy + grav);
    g.fy += g.vy; g.x += g.vx;
    if (g.x < LEFT + 14 || g.x > RIGHT - 14) {
      g.x = clamp(g.x, LEFT + 14, RIGHT - 14); g.vx = -g.vx * 0.85;
      gobSound(g, 'gBonk');
    }
    if (g.vy >= 0) {
      for (let n = Math.floor(-prev / FLOOR_H + 1e-6); n >= Math.ceil(-g.fy / FLOOR_H); n--) {
        if (n < 0) break;
        const t = -n * FLOOR_H;
        if (prev > t + 0.01 || g.fy < t) continue;
        const hit = plat(n).all.find(p => { const sh = ledgeShift(p); return !p.none && !brokenLedge(p) && g.x + 6 >= p.x1 + sh && g.x - 6 <= p.x2 + sh; });
        if (hit) { g.fy = t; goblinLand(g, n, hit); break; }
      }
    }
    if (g.air && g.fy - G.camY > H + 320) {
      const n = Math.max(0, Math.floor(-(G.camY + H + 30) / FLOOR_H)), p = ledgeNear(n, g.x);
      g.x = clamp(g.x, p.x1 + 10, p.x2 - 10); g.fy = -n * FLOOR_H; g.n = n; g.ledge = p; g.air = false; g.vy = 0; g.vx = 0; g.rest = 6;
    }
  } else {
    const p = g.ledge, sh = ledgeShift(p);
    g.x += ledgeCarry(p);
    const want = clamp(P.x, p.x1 + sh + 8, p.x2 + sh - 8);
    if (g.wind > 0) {
      g.wind--;
      if (g.wind === 0) {
        const j = planGoblinJump(g, zone);
        g.vy = -j.vy; g.vx = j.vx; g.air = true;
        gobSound(g, 'gJump');
      }
    } else if (g.rest > 0) {
      g.rest--;
      const step = approach(g.x, want, (g.king ? 2.6 : 3.4) * wideK(0.4));
      if (step !== g.x) {
        g.ph += 0.6;
        if (++g.step >= 7) { g.step = 0; gobSound(g, 'gStep', 0.8); }
      }
      g.x = step;
    } else {
      const close = Math.abs(P.y - g.fy) < 70 && Math.abs(P.x - g.x) < 150;
      if (close && Math.random() < 0.3) {
        const grav2 = grav, vy = Math.sqrt(2 * grav2 * 60);
        g.vy = -vy; g.vx = clamp((P.x - g.x) / 22, -gobVx(), gobVx()); g.air = true;
        gobSound(g, 'gJump');
      } else {
        g.wind = g.king ? 7 : 5;
        gobSound(g, 'gWind', 0.8);
      }
    }
  }
  g.y = g.fy - g.foot;
  const dy = P.y - 24 - g.y;
  if (g.laugh > 0) g.laugh--;
  else if (Math.random() < 0.012) { g.laugh = 50; gobSound(g, 'gCackle'); }
  if (g.snarl > 0) g.snarl--;
  else if (Math.abs(g.x - P.x) < 220 && dy > -140 && dy < 160 && !g.air) { g.snarl = 70; gobSound(g, 'gSnarl'); }
  if (Math.abs(g.x - P.x) < (g.king ? 30 : 24) && Math.abs(dy) < (g.king ? 44 : 34) && P.inv <= 0) { caught(g); return; }
  if (!g.king && g.t > GOBLIN_TIME) escaped(g);
}

function caught(g) {
  G.shake = 12;
  haptic('heavy');
  Sfx.hit();
  if (g.king) { endRun(false, 'king'); return; }
  const stolen = Math.min(G.comboPts, Math.max(GOBLIN_BONUS, Math.floor(G.comboPts * 0.25)));
  G.comboPts -= stolen;
  if (G.combo.active) endCombo();
  P.vy = 7; P.onGround = false; P.coyote = 0;
  P.vx = (Math.sign(P.x - g.x) || 1) * 5;
  P.hurt = 36; P.inv = 90;
  G.banners.push({ text: T('CAUGHT!'), sub: stolen ? T('the goblin stole {0} points', stolen) : T('the goblin knocked you down'), t: 0, dur: 150, color: '#ff6b6b' });
  if (stolen) G.popups.push({ x: P.x, y: P.y - 70, text: `-${stolen}`, t: 0 });
  g.leaving = true; g.dir = g.x < GW / 2 ? -1 : 1; g.vy = -9;
  G.goblinT = nextGoblin();
  if (G.mode.id === 'rockfall') {
    G.hearts--; G.hits++;
    if (G.hits === 1) G.cleanFloor = G.highest;
    if (G.hearts <= 0) endRun(false, 'rocks');
  }
}

function escaped(g) {
  const bonus = goblinBonus();
  g.leaving = true; g.vy = -9; g.dir = g.x < GW / 2 ? -1 : 1;
  G.comboPts += bonus;
  G.goblinsEscaped++;
  G.banners.push({ text: T('THE GOBLIN GAVE UP!'), sub: T('+{0} points', bonus), t: 0, dur: 150, color: '#7dd34a' });
  G.popups.push({ x: P.x, y: P.y - 70, text: `+${bonus}`, t: 0 });
  G.goblinT = nextGoblin();
  Sfx.milestone();
  checkAchievements();
}

function drawGoblin() {
  const g = G.goblin;
  if (!g) return;
  const x = g.x, y = g.y - G.camY;
  if (y > H + 30) {
    if (!g.leaving) {
      const k = 0.6 + 0.4 * Math.sin(G.frame * 0.3);
      ctx.globalAlpha = k;
      tri(x - 14, H - 26, x + 14, H - 26, x, H - 6, g.king ? '#c77dff' : '#7dd34a');
      ctx.globalAlpha = 1;
      text('!', x, H - 20, 14, '#ffffff', { stroke: false });
    }
    return;
  }
  const f = G.frame, s = g.s, face = g.leaving ? g.dir : (P.x >= g.x ? 1 : -1);
  const body = g.king ? '#5f9c3a' : '#7dd34a', dark = g.king ? '#3b6a22' : '#4f9a2c', belly = '#c4ec8a';
  const airborne = g.air || g.leaving;
  const run = airborne ? (g.vy < 0 ? -1.3 : 0.7) : (g.wind > 0 ? 0.4 : Math.sin(g.ph));
  const sq = g.wind > 0 ? 0.55 : g.squash * 0.5;
  ctx.save();
  ctx.translate(x, y + g.foot);
  ctx.scale(s * face * (1 + sq * 0.25), s * (1 - sq * 0.3));
  ctx.translate(0, -23.5);
  if (g.king) {
    ctx.fillStyle = '#7a2a9c';
    ctx.beginPath(); ctx.moveTo(-8, -10); ctx.lineTo(8, -10); ctx.lineTo(13 + run * 2, 20); ctx.lineTo(-15 + run * 2, 20); ctx.closePath(); ctx.fill();
  }
  limb(-4, 8, -8 + run * 5, 20, 4.2, dark);
  limb(4, 8, 8 - run * 5, 20, 4.2, dark);
  ell(-9 + run * 5, 21, 4.5, 2.4, dark); ell(9 - run * 5, 21, 4.5, 2.4, dark);
  limb(-6, -5, -15, -13 - run * 6, 3.8, dark);
  ell(0, 1, 11.5, 13, body);
  ell(2.5, 4, 7, 8.5, belly);
  ctx.fillStyle = '#6b4a2a';
  ctx.beginPath(); ctx.moveTo(-11, 6); ctx.lineTo(11, 6); ctx.lineTo(9, 13); ctx.lineTo(4, 10); ctx.lineTo(0, 14); ctx.lineTo(-5, 10); ctx.lineTo(-10, 13); ctx.closePath(); ctx.fill();
  tri(-5, -21, -24, -32 + run * 2, -3, -12, body);
  tri(-7, -20, -19, -28 + run * 2, -5, -14, '#ff9fb0');
  circ(3, -17, 11.5, body);
  tri(9, -24, 25, -30 - run * 2, 12, -13, body);
  tri(10, -22, 21, -27 - run * 2, 12, -15, '#ff9fb0');
  for (const [ex, er] of [[-1, 3.2], [8, 3.6]]) {
    circ(ex, -20, er, '#ffe14d');
    ell(ex + 0.8, -20, 0.9, er * 0.75, '#b3261e');
  }
  limb(-4, -25, 2, -23, 1.8, dark); limb(5, -24, 11, -26, 1.8, dark);
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.moveTo(11, -18); ctx.quadraticCurveTo(21, -15, 16, -10); ctx.lineTo(11, -12); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2a1410';
  ctx.beginPath(); ctx.moveTo(-5, -10); ctx.quadraticCurveTo(4, g.laugh ? -1 : -5, 13, -10); ctx.quadraticCurveTo(4, -8, -5, -10); ctx.fill();
  for (let i = 0; i < 4; i++) tri(-3 + i * 4, -10 + i * 0.2, i * 4 - 1, -10 + i * 0.2, i * 4 - 2, -7.5, '#fffbe6');
  circ(-6, -14, 1, dark); circ(0, -27, 1.1, dark);
  limb(6, -5, 17, -12 + run * 6, 3.8, body);
  for (let i = -1; i <= 1; i++) limb(17, -12 + run * 6, 21, -14 + run * 6 + i * 2.5, 1.4, '#fffbe6');
  if (g.king) {
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath(); ctx.moveTo(-6, -27); ctx.lineTo(-6, -36); ctx.lineTo(-2, -31); ctx.lineTo(3, -38); ctx.lineTo(7, -31); ctx.lineTo(11, -36); ctx.lineTo(11, -27); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = NAVY; ctx.lineWidth = 1.2; ctx.stroke();
    circ(3, -30, 1.4, '#ff4f6d');
  }
  ctx.restore();
  if (g.laugh > 20 && !g.leaving) text(T('HEHEHE!'), x, y - 46 * s, 13, '#c4ec8a', { lw: 4 });
}

function drawGoblinHUD() {
  const g = G.goblin;
  if (!g || g.leaving) return;
  const near = clamp(1 - (g.y - G.camY - (P.y - G.camY)) / 400, 0, 1);
  if (near > 0) {
    const grad = ctx.createLinearGradient(0, H - 160, 0, H);
    grad.addColorStop(0, 'rgba(120,220,80,0)'); grad.addColorStop(1, `rgba(120,220,80,${0.28 * near * (0.7 + 0.3 * Math.sin(G.frame * 0.25))})`);
    ctx.fillStyle = grad; ctx.fillRect(0, H - 160, GW, 160);
  }
  const bx = GW / 2 - 60, by = 64;
  ctx.fillStyle = 'rgba(10,14,34,0.7)'; rr(bx - 4, by - 4, 128, 18, 9); ctx.fill();
  if (g.king) { text(T('GOBLIN KING'), GW / 2, by + 5, 11, '#c77dff', { lw: 3, max: 120 }); return; }
  ctx.fillStyle = 'rgba(125,211,74,0.25)'; rr(bx, by, 120, 10, 5); ctx.fill();
  ctx.fillStyle = '#7dd34a'; rr(bx, by, Math.max(10, 120 * (1 - g.t / GOBLIN_TIME)), 10, 5); ctx.fill();
}

function blockAt(n) {
  let b = G.blocks.get(n);
  if (b !== undefined) return b;
  b = null;
  if (n >= 400 && n < LAST_FLOOR - 2 && G.mode.id !== 'sprint' && hash(n, 30) < Math.min(0.25, 0.08 + (n - 400) / 12000)) {
    let lo = Infinity, hi = -Infinity, open = true;
    const spans = [];
    for (let k = n - 1; k <= n + 2; k++) {
      const p = plat(k);
      if (p.full) { open = false; break; }
      lo = Math.min(lo, p.x1); hi = Math.max(hi, p.x2);
      for (const q of p.all) spans.push([q.x1 - 30, q.x2 + 30]);
    }
    if (open) {
      const w = 34 + hash(n, 31) * 26, room = [];
      if (G.lanes === 1) {
        if (lo - 30 - LEFT >= w) room.push([LEFT, lo - 30 - w]);
        if (RIGHT - hi - 30 >= w) room.push([hi + 30, RIGHT - w]);
      } else {
        // Several lanes: a block fits wherever the ledges of these floors leave a gap wide enough.
        spans.sort((x, y) => x[0] - y[0]);
        let edge = LEFT;
        for (const [from, to] of spans) {
          if (from - edge >= w) room.push([edge, from - w]);
          edge = Math.max(edge, to);
        }
        if (RIGHT - edge >= w) room.push([edge, RIGHT - w]);
      }
      if (room.length) {
        const [a, c] = room[(hash(n, 32) * room.length) | 0];
        const x1 = a + hash(n, 33) * Math.max(0, c - a);
        b = { n, x1, x2: x1 + w, y1: -n * FLOOR_H - 54, y2: -n * FLOOR_H - 28 };
      }
    }
  }
  G.blocks.set(n, b);
  return b;
}

function collideBlocks(px, py) {
  const n0 = Math.floor(-P.y / FLOOR_H);
  for (let n = Math.max(0, n0 - 1); n <= n0 + 1; n++) {
    const b = blockAt(n);
    if (!b || P.x + 10 <= b.x1 || P.x - 10 >= b.x2 || P.y <= b.y1 || P.y - 46 >= b.y2) continue;
    if (py - 46 >= b.y2 - 1) {
      P.y = b.y2 + 46; P.vy = Math.max(P.vy, 1.5);
      Sfx.bonk();
      burst(P.x, b.y2, 5, { angle: Math.PI / 2, spread: 2, speed: 2, g: 0.1, colors: ['#ffffff', '#ffd93d'], size: 3, life: 18, kind: 'spark' });
    } else if (py <= b.y1 + 1) {
      P.y = b.y1; P.vy = -Math.max(6.5, Math.abs(P.vy) * 0.55); P.onGround = false; P.coyote = 0;
      Sfx.bounce();
    } else {
      P.x = px < (b.x1 + b.x2) / 2 ? b.x1 - 10 : b.x2 + 10;
      P.vx = -P.vx * 0.6;
      Sfx.bonk();
    }
  }
}

function drawBlock(b, sy) {
  const t = themeOf(b.n), w = b.x2 - b.x1, h = b.y2 - b.y1;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; rr(b.x1 + 3, sy + 4, w, h, 5); ctx.fill();
  ctx.fillStyle = t.edge; rr(b.x1, sy, w, h, 5); ctx.fill();
  ctx.fillStyle = t.body; rr(b.x1 + 2, sy + 2, w - 4, h - 7, 4); ctx.fill();
  ctx.save(); rr(b.x1 + 2, sy + 2, w - 4, h - 4, 4); ctx.clip();
  ctx.fillStyle = 'rgba(255,217,61,0.85)';
  for (let x = b.x1 - h; x < b.x2; x += 12) { ctx.beginPath(); ctx.moveTo(x, sy + h); ctx.lineTo(x + 6, sy + h); ctx.lineTo(x + 6 + h, sy); ctx.lineTo(x + h, sy); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.45)'; rr(b.x1 + 3, sy + 2, w - 6, 3, 1.5); ctx.fill();
  ctx.strokeStyle = NAVY; ctx.lineWidth = 2.4; rr(b.x1, sy, w, h, 5); ctx.stroke();
}
