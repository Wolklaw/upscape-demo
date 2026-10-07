const DECOR_T = 640;
const SLOT_A = [330, 150], SLOT_B = [150, 470];
const hsla = (h, s, l, a) => `hsla(${h}, ${clamp(s, 0, 100)}%, ${clamp(l, 0, 100)}%, ${a})`;
let BGA = 1;
const alpha = a => { ctx.globalAlpha = BGA * a; };

const glowSprites = new Map();
function glowAt(x, y, r, color, a = 1) {
  const key = devicePx() + color;
  let g = glowSprites.get(key);
  if (!g) {
    trim(glowSprites, 40);
    g = drawInto(makeLayer(64, 64), () => glow(32, 32, 32, color));
    glowSprites.set(key, g);
  }
  alpha(a);
  ctx.drawImage(g.c, x - r, y - r, r * 2, r * 2);
  alpha(1);
}

const tierArt = new Map();
let warmedTier = -1;
function prewarmNextTier() {
  const f = -(G.camY + H / 2) / FLOOR_H, next = tierIndex(f) + 1;
  if (next >= TIERS.length || next === warmedTier || next * TIER_FLOORS - f > SCENE_FADE + 30) return;
  warmedTier = next;
  const t = TIERS[next];
  const build = () => { if (SCENES[t.special]) sceneLayers(t.special); else tierLayers(t); };
  (window.requestIdleCallback || (fn => setTimeout(fn, 0)))(build);
}
function tierLayers(t) {
  const z = ZONE_LOOKS[t.kind];
  const key = `${t.index}|${devicePx()}|${z.open ? H : 0}|${GW}`;
  let a = tierArt.get(key);
  if (!a) {
    trim(tierArt, 4);
    if (z.open) {
      a = { far: drawInto(makeLayer(GW, H), () => z.far(t, H)), near: drawInto(makeLayer(GW, DECOR_T), () => z.near(t, DECOR_T)) };
    } else {
      const [tw, th] = z.tile;
      a = {
        back: drawInto(makeLayer(GW, DECOR_T, true), () => {
          for (let y = 0; y < DECOR_T; y += th) for (let x = 0; x < GW; x += tw) {
            ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.rect(0, 0, tw, th); ctx.clip();
            z.wall(t, tw, th);
            ctx.restore();
          }
          forEachColumn(() => z.decor(t, DECOR_T));
        }),
      };
    }
    tierArt.set(key, a);
  }
  return a;
}

function drawTierBackdrop(ti, a) {
  BGA = a;
  ctx.globalAlpha = a;
  const t = TIERS[ti];
  if (SCENES[t.special]) {
    drawScene(t.special);
  } else {
    const z = ZONE_LOOKS[t.kind], art = tierLayers(t);
    const T = DECOR_T;
    if (z.open) {
      ctx.drawImage(art.far.c, 0, 0, GW, H);
      if (z.liveFar && !LOW) z.liveFar(t);
      const off = ((-G.camY * 0.6) % T + T) % T;
      for (let y = off - T; y < H; y += T) ctx.drawImage(art.near.c, 0, y, GW, T);
    } else {
      const bgCam = G.camY * 0.5, off = ((-bgCam % T) + T) % T;
      for (let y0 = off - T; y0 < H; y0 += T) ctx.drawImage(art.back.c, 0, y0, GW, T + 1);
      if (z.windows) drawWindows(bgCam);
      if (z.live && !LOW) for (let y0 = off - T; y0 < H; y0 += T) forEachColumn(() => z.live(t, y0));
    }
    if (z.screen && !LOW) z.screen(t);
  }
  ctx.globalAlpha = 1;
  BGA = 1;
}

const STORMY = new Set(['RAIN CLOUD', 'STORM FRONT']);
const styleCache = new Map();
function particleStyle(t) {
  let st = styleCache.get(t.index);
  if (!st) { st = makeParticleStyle(t); styleCache.set(t.index, st); }
  return st;
}
function makeParticleStyle(t) {
  if (t.special === 'witcher') return { fills: SNOW_FILLS, speed: 1, shape: 'dot' };
  const sp = SCENE_PARTICLES[t.special];
  if (sp) return Array.isArray(sp) ? { fills: sp, speed: t.special === 'souls' ? -0.7 : 1, shape: t.special === 'arcade' ? 'square' : 'dot' } : sp;
  switch (t.kind) {
    case 'stone': return { fills: ['rgba(255,230,200,0.14)', 'rgba(255,230,200,0.22)', 'rgba(255,230,200,0.3)'], speed: 0.35, shape: 'dot' };
    case 'wood': return { fills: ['rgba(214,150,80,0.35)', 'rgba(230,175,100,0.45)', 'rgba(245,205,140,0.55)'], speed: 0.7, shape: 'dot' };
    case 'steel': return { fills: ['rgba(255,140,40,0.5)', 'rgba(255,190,80,0.65)', 'rgba(255,230,150,0.8)'], speed: 1.8, shape: 'square' };
    case 'candy': return { fills: ['rgba(255,120,170,0.7)', 'rgba(120,220,255,0.7)', 'rgba(255,230,120,0.75)'], speed: 0.8, shape: 'square' };
    case 'cloud': return STORMY.has(t.name)
      ? { fills: ['rgba(170,190,220,0.3)', 'rgba(170,190,220,0.4)', 'rgba(200,215,240,0.5)'], speed: 9, shape: 'streak' }
      : { fills: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.18)', 'rgba(255,255,255,0.25)'], speed: 0.3, shape: 'dot' };
    case 'shine': return { fills: ['rgba(255,220,120,0.4)', 'rgba(255,235,160,0.55)', 'rgba(255,250,210,0.7)'], speed: 0.45, shape: 'square' };
    case 'crystal': return { fills: [hsla(t.h, 90, 75, 0.3), hsla(t.h, 90, 80, 0.45), hsla(t.h, 90, 88, 0.6)], speed: -0.45, shape: 'dot' };
    case 'neon': return { fills: ['rgba(255,47,160,0.5)', 'rgba(80,220,255,0.55)', 'rgba(180,120,255,0.6)'], speed: 0.6, shape: 'square' };
    case 'cosmic': return { fills: ['rgba(255,255,255,0.2)', 'rgba(200,220,255,0.3)', 'rgba(255,240,220,0.4)'], speed: 0.25, shape: 'dot' };
    default: return { fills: SNOW_FILLS, speed: 1, shape: 'dot' };
  }
}

function cloudPuff(x, y, s, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (const [dx, dy, r] of [[-0.9, 0.1, 0.5], [-0.35, -0.25, 0.7], [0.3, -0.35, 0.8], [0.9, 0, 0.55], [0, 0.15, 0.6]]) {
    ctx.moveTo(x + dx * s + r * s, y + dy * s);
    ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2);
  }
  ctx.fill();
}
function gear(x, y, r, teeth, ang, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  const n = teeth * 4;
  for (let i = 0; i <= n; i++) {
    const a = ang + i / n * Math.PI * 2, rr2 = (i % 4 < 2) ? r : r - 5;
    ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2);
  }
  ctx.fill();
  circ(x, y, r * 0.32, 'rgba(0,0,0,0.45)');
  circ(x, y, r * 0.14, fill);
}
function flake(x, y, r, stroke) {
  ctx.strokeStyle = stroke; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3, c = Math.cos(a), s = Math.sin(a);
    ctx.moveTo(x, y); ctx.lineTo(x + c * r, y + s * r);
    for (const k of [0.45, 0.7]) {
      const bx = x + c * r * k, by = y + s * r * k, b = r * 0.22;
      ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(a + 0.8) * b, by + Math.sin(a + 0.8) * b);
      ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(a - 0.8) * b, by + Math.sin(a - 0.8) * b);
    }
  }
  ctx.stroke();
}
const icicles = () => Array.from({ length: 30 }, (_, i) => [12 + i * 15.5 + SR(i, 80) * 6, 8 + SR(i, 81) * 34]);
const twinkle = (x, y, a, size, color) => {
  if (a < 0.05) return;
  alpha(a);
  ctx.fillStyle = color;
  ctx.fillRect(x - size, y - 0.75, size * 2, 1.5);
  ctx.fillRect(x - 0.75, y - size, 1.5, size * 2);
  alpha(1);
};
const pulse = (speed, phase, sharp = 1) => Math.pow(Math.max(0, Math.sin(G.frame * speed + phase)), sharp);

const neonSigns = new Map();
function neonSign(icon, color, lit) {
  const key = `${devicePx()}|${icon}|${color}|${lit}`;
  let s = neonSigns.get(key);
  if (s) return s;
  trim(neonSigns, 12);
  s = drawInto(makeLayer(96, 72), () => {
    ctx.save();
    ctx.translate(48, 36);
    if (lit) { ctx.shadowColor = color; ctx.shadowBlur = 12; }
    ctx.strokeStyle = lit ? color : 'rgba(120,110,140,0.35)'; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    if (icon === 'heart') { ctx.moveTo(0, 16); ctx.bezierCurveTo(-26, -2, -14, -24, 0, -10); ctx.bezierCurveTo(14, -24, 26, -2, 0, 16); }
    else if (icon === 'star') { for (let i = 0; i < 11; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 9 : 20; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } }
    else if (icon === 'arrow') { ctx.moveTo(0, 20); ctx.lineTo(0, -18); ctx.moveTo(-14, -4); ctx.lineTo(0, -18); ctx.lineTo(14, -4); }
    else if (icon === 'bolt') { ctx.moveTo(6, -22); ctx.lineTo(-10, 2); ctx.lineTo(2, 2); ctx.lineTo(-6, 22); ctx.lineTo(12, -4); ctx.lineTo(0, -4); ctx.closePath(); }
    else { ctx.arc(-8, 14, 6, 0, Math.PI * 2); ctx.moveTo(-2, 14); ctx.lineTo(-2, -18); ctx.lineTo(14, -22); ctx.lineTo(14, 8); ctx.moveTo(20, 8); ctx.arc(14, 8, 6, 0, Math.PI * 2); }
    ctx.stroke();
    ctx.restore();
  });
  neonSigns.set(key, s);
  return s;
}

const ZONE_LOOKS = {
  stone: {
    tile: [128, 64], windows: true,
    wall(t) {
      const s = Math.min(t.s, 30) * 0.55, l0 = 13 + t.l * 0.07;
      ctx.fillStyle = hsl(t.h, s, l0 - 6); ctx.fillRect(0, 0, 128, 64);
      for (let row = 0; row < 4; row++) for (let col = -1; col < 5; col++) {
        const x = col * 32 + (row % 2 ? 16 : 0), y = row * 16;
        ctx.fillStyle = hsl(t.h, s, l0 + ((row * 7 + col * 13) % 5) * 1.6);
        ctx.fillRect(x + 1, y + 1, 30, 14);
        ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(x + 1, y + 1, 30, 2);
      }
      if (t.name === 'MOSSY STEPS') for (let i = 0; i < 9; i++) ell(SR(i, 90) * 128, SR(i, 91) * 64, 4 + SR(i, 92) * 6, 2 + SR(i, 93) * 2, 'rgba(110,160,70,0.35)');
    },
    decor(t) {
      for (const [x, y] of [SLOT_A, SLOT_B]) {
        ctx.fillStyle = '#26262c'; rr(x - 6, y + 8, 12, 24, 3); ctx.fill();
        limb(x, y + 16, x, y + 3, 4, '#3a3a42');
        ctx.fillStyle = '#4a4a54'; ctx.beginPath(); ctx.moveTo(x - 9, y - 2); ctx.lineTo(x + 9, y - 2); ctx.lineTo(x + 5, y + 6); ctx.lineTo(x - 5, y + 6); ctx.fill();
      }
      const cloth = hsl(t.h, Math.max(t.s, 45), clamp(t.l * 0.6, 26, 44));
      for (const bx of [96, 384]) {
        limb(bx - 27, 300, bx + 27, 300, 3, '#3a3a42');
        circ(bx - 27, 300, 3, '#c9a24a'); circ(bx + 27, 300, 3, '#c9a24a');
        ctx.fillStyle = cloth;
        ctx.beginPath(); ctx.moveTo(bx - 22, 302); ctx.lineTo(bx + 22, 302); ctx.lineTo(bx + 22, 384); ctx.lineTo(bx, 370); ctx.lineTo(bx - 22, 384); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(bx + 6, 302, 16, 72);
        ctx.fillStyle = '#c9a24a'; ctx.fillRect(bx - 22, 306, 44, 2); ctx.fillRect(bx - 22, 360, 44, 2);
        circ(bx, 334, 11, 'rgba(255,232,170,0.85)');
        drawStarShape(bx, 334, 7, cloth);
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1.2;
      for (let i = 0; i < 4; i++) {
        let x = 60 + SR(i, 94) * 360, y = 420 + SR(i, 95) * 200;
        if (x > 240 && y < 570) y = 590;
        ctx.beginPath(); ctx.moveTo(x, y);
        for (let k = 0; k < 4; k++) { x += (SR(i * 5 + k, 96) - 0.5) * 16; y += 6 + SR(i * 5 + k, 97) * 8; ctx.lineTo(x, y); }
        ctx.stroke();
      }
    },
    live(t, y0) {
      for (const [x, y] of [SLOT_A, SLOT_B]) {
        const fy = y0 + y;
        if (fy < -60 || fy > H + 60) continue;
        const f = G.frame, w1 = Math.sin(f * 0.31 + x), w2 = Math.sin(f * 0.47 + x * 0.7);
        glowAt(x, fy - 10, 50 + w1 * 4, 'rgba(255,150,60,0.6)', 0.8);
        tri(x - 6, fy - 2, x + 6, fy - 2, x + w1 * 2.5, fy - 20 - w2 * 4, 'rgba(255,110,30,0.92)');
        tri(x - 3.5, fy - 2, x + 3.5, fy - 2, x + w2 * 1.5, fy - 12 - w1 * 2, 'rgba(255,225,110,0.95)');
      }
    },
    screen() {
      const p = (G.frame + 300) % 1150;
      if (p > 280) return;
      const x = -30 + p * 2, y = H * 0.24 + Math.sin(p * 0.05) * 36, w = Math.sin(p * 0.7) * 9;
      ell(x, y, 4, 3, '#141218');
      tri(x - 2, y, x - 16, y - w, x - 8, y + 3, '#141218');
      tri(x + 2, y, x + 16, y - w, x + 8, y + 3, '#141218');
    },
  },

  ice: {
    tile: [128, 64], windows: true,
    wall(t) {
      ctx.fillStyle = hsl(t.h, 40, 13); ctx.fillRect(0, 0, 128, 64);
      for (let row = 0; row < 2; row++) for (let col = -1; col < 3; col++) {
        const x = col * 64 + (row ? 32 : 0), y = row * 32;
        ctx.fillStyle = hsl(t.h, 45, 19 + ((row * 3 + col * 5 + 8) % 4) * 2);
        ctx.fillRect(x + 1, y + 1, 62, 30);
        ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(x + 1, y + 1, 62, 3);
        limb(x + 10, y + 26, x + 22, y + 6, 3, 'rgba(255,255,255,0.07)');
      }
    },
    decor(t) {
      ctx.fillStyle = hsl(t.h, 35, 22); ctx.fillRect(0, 296, GW, 9);
      ctx.fillStyle = hsl(t.h, 35, 30); ctx.fillRect(0, 296, GW, 2);
      for (const [x, len] of icicles()) {
        tri(x - 4, 304, x + 4, 304, x, 304 + len, 'rgba(160,200,240,0.4)');
        limb(x - 1.5, 306, x - 0.3, 300 + len * 0.8, 1, 'rgba(255,255,255,0.3)');
      }
      flake(SLOT_A[0], SLOT_A[1], 24, 'rgba(220,240,255,0.32)');
      flake(SLOT_B[0], SLOT_B[1], 24, 'rgba(220,240,255,0.32)');
      for (let i = 0; i < 5; i++) flake(60 + i * 90, 596 + SR(i, 83) * 24, 6 + SR(i, 84) * 5, 'rgba(220,240,255,0.25)');
    },
    live(t, y0) {
      const ic = icicles(), f = G.frame;
      for (const i of [3, 11, 19, 26]) {
        const [x, len] = ic[i], p = (f + i * 37) % 150;
        if (p < 48) { alpha(0.8 * (1 - p / 48)); circ(x, y0 + 304 + len + p * p * 0.06, 1.8, 'rgba(225,242,255,1)'); alpha(1); }
      }
      for (let i = 0; i < 6; i++) twinkle(40 + SR(i, 85) * 400, y0 + SR(i, 86) * DECOR_T, pulse(0.035, i * 1.9, 14), 5, '#ffffff');
    },
  },

  wood: {
    tile: [128, 64], windows: true,
    wall(t) {
      for (let i = 0; i < 4; i++) {
        const x = i * 32;
        ctx.fillStyle = hsl(t.h, t.s * 0.6, clamp(t.l * 0.42, 9, 30) + (i * 7 % 3) * 1.5);
        ctx.fillRect(x, 0, 32, 64);
        ctx.strokeStyle = 'rgba(0,0,0,0.13)'; ctx.lineWidth = 1;
        for (const gx of [9, 21]) { ctx.beginPath(); ctx.moveTo(x + gx, 0); ctx.bezierCurveTo(x + gx + 3, 20, x + gx - 3, 40, x + gx, 64); ctx.stroke(); }
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x + 31, 0, 1, 64);
        ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(x, (i * 23) % 64, 31, 1);
        circ(x + 5, 8 + (i % 2) * 32, 1.3, 'rgba(0,0,0,0.4)'); circ(x + 26, 8 + (i % 2) * 32, 1.3, 'rgba(0,0,0,0.4)');
      }
    },
    decor(t) {
      const beam = hsl(t.h, t.s * 0.5, clamp(t.l * 0.28, 7, 20));
      ctx.fillStyle = beam; ctx.fillRect(0, 302, GW, 18);
      ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(0, 302, GW, 3);
      limb(44, 410, 104, 320, 9, beam); limb(GW - 44, 410, GW - 104, 320, 9, beam);
      for (let x = 20; x < GW; x += 60) circ(x, 311, 2, 'rgba(0,0,0,0.45)');
      for (const [x, y] of [SLOT_A, SLOT_B]) { ctx.fillStyle = '#1e140c'; ctx.fillRect(x - 9, y - 76, 18, 6); }
      ctx.strokeStyle = '#7a5a34'; ctx.lineWidth = 2.5;
      for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(232, 346, 13 - k * 2.5, 9 - k * 1.8, 0, 0, Math.PI * 2); ctx.stroke(); }
      limb(232, 320, 232, 336, 2, '#7a5a34');
      ctx.fillStyle = '#5a5f66'; ctx.beginPath(); ctx.moveTo(296, 330); ctx.lineTo(340, 330); ctx.lineTo(340, 346); ctx.lineTo(300, 342); ctx.fill();
      ctx.fillStyle = beam; ctx.fillRect(338, 326, 12, 22);
      limb(296, 320, 300, 330, 1.5, '#2a1d12');
    },
    live(t, y0) {
      const f = G.frame;
      for (const [x, y] of [SLOT_A, SLOT_B]) {
        const ay = y0 + y - 70;
        if (ay < -120 || ay > H + 20) continue;
        const a = Math.sin(f * 0.025 + x) * 0.13, lx = x + Math.sin(a) * 56, ly = ay + Math.cos(a) * 56;
        limb(x, ay, lx, ly, 1.5, '#2a1d12');
        glowAt(lx, ly + 12, 54, 'rgba(255,190,90,0.55)', 0.85);
        ctx.fillStyle = '#2a1d12'; rr(lx - 8, ly, 16, 24, 3); ctx.fill();
        ctx.fillStyle = '#ffd27a'; rr(lx - 5, ly + 5, 10, 14, 2); ctx.fill();
        tri(lx - 9, ly + 1, lx + 9, ly + 1, lx, ly - 6, '#2a1d12');
        for (let k = 0; k < 3; k++) {
          const m = f * (0.04 + k * 0.01) + k * 2.1, r = 20 + Math.sin(f * 0.05 + k) * 7;
          circ(lx + Math.cos(m) * r, ly + 12 + Math.sin(m * 1.3) * r * 0.6, 1.3, 'rgba(255,240,170,0.85)');
        }
      }
    },
  },

  steel: {
    tile: [64, 64], windows: true,
    wall(t) {
      const s = t.s * 0.5;
      ctx.fillStyle = hsl(t.h, s, 10); ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = hsl(t.h, s, 16 + t.l * 0.05); ctx.fillRect(1, 1, 62, 62);
      ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(1, 1, 62, 2); ctx.fillRect(1, 1, 2, 62);
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(1, 61, 62, 2); ctx.fillRect(61, 1, 2, 62);
      for (const [x, y] of [[7, 7], [57, 7], [7, 57], [57, 57]]) { circ(x + 0.6, y + 0.8, 2, 'rgba(0,0,0,0.4)'); circ(x, y, 1.8, 'rgba(255,255,255,0.2)'); }
    },
    decor(t) {
      const pipe = (y, r, c) => {
        ctx.fillStyle = vgrad(y - r, y + r, [hsl(t.h, Math.max(t.s, 15), clamp(t.l * 0.55, 18, 40)), c, hsl(t.h, Math.max(t.s, 15), 8)]);
        ctx.fillRect(0, y - r, GW, r * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        for (let x = 40 + (y % 3) * 20; x < GW; x += 120) ctx.fillRect(x - 3, y - r - 2, 6, r * 2 + 4);
      };
      const pc = hsl(t.h, Math.max(t.s, 15), clamp(t.l * 0.4, 14, 28));
      pipe(314, 7, pc); pipe(340, 5, pc);
      ctx.strokeStyle = '#8a2a20'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(240, 314, 12, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; ctx.moveTo(240 + Math.cos(a) * 12, 314 + Math.sin(a) * 12); ctx.lineTo(240 - Math.cos(a) * 12, 314 - Math.sin(a) * 12); } ctx.stroke();
      ctx.fillStyle = '#3a3e48'; ctx.fillRect(GW - 76, 296, 14, 12);
      circ(SLOT_A[0], SLOT_A[1], 36, 'rgba(0,0,0,0.3)');
      const [gx, gy] = SLOT_B;
      circ(gx, gy, 19, '#2a2e36'); circ(gx, gy, 16, '#e9e4d8');
      ctx.strokeStyle = '#3a3e48'; ctx.lineWidth = 1.2;
      for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 - 1.2 + i / 8 * 2.4; ctx.beginPath(); ctx.moveTo(gx + Math.cos(a) * 13, gy + Math.sin(a) * 13); ctx.lineTo(gx + Math.cos(a) * 10, gy + Math.sin(a) * 10); ctx.stroke(); }
      ctx.fillStyle = 'rgba(198,58,42,0.7)'; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.arc(gx, gy, 13, -Math.PI / 2 + 0.75, -Math.PI / 2 + 1.2); ctx.closePath(); ctx.fill();
      limb(gx, gy + 19, gx, gy + 40, 4, '#3a3e48');
      circ(gx + 30, gy - 14, 5, '#2a2e36');
      ctx.save(); ctx.beginPath(); ctx.rect(60, 596, 70, 22); ctx.clip();
      ctx.fillStyle = '#ffd93d'; ctx.fillRect(60, 596, 70, 22); ctx.fillStyle = '#1e2230';
      for (let k = -2; k < 8; k++) { ctx.beginPath(); ctx.moveTo(60 + k * 14, 618); ctx.lineTo(67 + k * 14, 618); ctx.lineTo(89 + k * 14, 596); ctx.lineTo(82 + k * 14, 596); ctx.fill(); }
      ctx.restore();
    },
    live(t, y0) {
      const f = G.frame, [ax, ay] = SLOT_A, [bx, by] = SLOT_B;
      if (y0 + ay > -60 && y0 + ay < H + 60) {
        gear(ax, y0 + ay, 28, 10, f * 0.012, hsl(t.h, t.s * 0.5, 38));
        gear(ax + 40, y0 + ay + 22, 15, 6, -f * 0.012 * 28 / 15 + 0.3, hsl(t.h, t.s * 0.5, 48));
      }
      if (y0 + by > -60 && y0 + by < H + 60) {
        const a = -Math.PI / 2 + Math.sin(f * 0.017) * 1.0 + Math.sin(f * 0.43) * 0.04;
        limb(bx, y0 + by, bx + Math.cos(a) * 12, y0 + by + Math.sin(a) * 12, 1.6, '#1e2230');
        circ(bx, y0 + by, 2, '#1e2230');
        if ((f >> 4) & 1) { glowAt(bx + 30, y0 + by - 14, 16, 'rgba(255,60,40,0.8)'); circ(bx + 30, y0 + by - 14, 3.5, '#ff4a36'); }
      }
      const p = (f + 50) % 210;
      if (p < 80) for (let k = 0; k < 3; k++) {
        const q = p - k * 9;
        if (q <= 0) continue;
        alpha(0.4 * (1 - q / 80));
        circ(GW - 69 + q * 0.25, y0 + 294 - q * 0.9, 4 + q * 0.2, '#e6e8f0');
        alpha(1);
      }
    },
  },

  candy: {
    tile: [64, 64], windows: true,
    wall(t) {
      const s = Math.min(t.s, 60) * 0.6, l = clamp(t.l * 0.35, 10, 26);
      ctx.fillStyle = hsl(t.h, s, l); ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = hsl(t.h, s + 8, l + 5);
      for (let k = -1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(k * 32, 0); ctx.lineTo(k * 32 + 14, 0); ctx.lineTo(k * 32 + 14 - 64, 64); ctx.lineTo(k * 32 - 64, 64); ctx.fill(); }
      circ(16, 48, 2, 'rgba(255,255,255,0.08)'); circ(48, 16, 2, 'rgba(255,255,255,0.08)');
    },
    decor(t) {
      const icing = hsla(t.h, 45, 72, 0.45);
      ctx.fillStyle = icing; ctx.fillRect(0, 288, GW, 12);
      for (let i = 0; i < 22; i++) { const x = SR(i, 100) * GW, w = 6 + SR(i, 101) * 5; rr(x, 292, w, 8 + SR(i, 102) * 22, w / 2); ctx.fill(); }
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 40; i++) { ctx.fillStyle = CONFETTI[i % 5]; ctx.fillRect(SR(i, 103) * GW, 289 + SR(i, 104) * 8, 4, 1.6); }
      ctx.globalAlpha = 1;
      for (let i = 0; i < 5; i++) { const x = 120 + i * 60 + SR(i, 105) * 20; ctx.fillStyle = hsla((t.h + i * 70) % 360, 60, 55, 0.6); ctx.beginPath(); ctx.arc(x, 288, 7, Math.PI, 0); ctx.fill(); }
      for (const x of [58, GW - 58]) {
        const left = x < GW / 2;
        const path = () => { ctx.beginPath(); ctx.moveTo(x, 420); ctx.lineTo(x, 340); if (left) ctx.arc(x + 12, 340, 12, Math.PI, 0); else ctx.arc(x - 12, 340, 12, 0, Math.PI, true); };
        ctx.lineCap = 'butt'; ctx.lineWidth = 9;
        path(); ctx.strokeStyle = '#fbf6ee'; ctx.stroke();
        ctx.setLineDash([7, 7]); path(); ctx.strokeStyle = '#e8463a'; ctx.stroke(); ctx.setLineDash([]);
      }
      for (const [x, y] of [SLOT_A, SLOT_B]) limb(x, y + 24, x, y + 74, 4, '#f6f0e6');
    },
    live(t, y0) {
      const f = G.frame;
      [SLOT_A, SLOT_B].forEach(([x, y], i) => {
        const cy = y0 + y;
        if (cy < -40 || cy > H + 40) return;
        circ(x, cy, 25, i ? hsl((t.h + 150) % 360, 70, 62) : hsl(t.h, Math.max(t.s, 60), 62));
        ctx.save(); ctx.translate(x, cy); ctx.rotate(f * (i ? -0.02 : 0.02));
        ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath();
        for (let k = 0; k < 50; k++) { const a = k * 0.36, r = k * 0.44; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
        ctx.stroke(); ctx.restore();
        circ(x - 9, cy - 9, 5, 'rgba(255,255,255,0.35)');
      });
    },
  },

  shine: {
    tile: [64, 64], windows: true,
    wall(t) {
      ctx.fillStyle = hsl(t.h, Math.min(t.s, 60) * 0.5, 9 + t.l * 0.05); ctx.fillRect(0, 0, 64, 64);
      ctx.strokeStyle = hsla(t.h, Math.max(t.s, 50), 45, 0.35); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(32, 0); ctx.lineTo(64, 32); ctx.lineTo(32, 64); ctx.lineTo(0, 32); ctx.closePath(); ctx.stroke();
      for (const r of [8, 14, 20]) { ctx.beginPath(); ctx.arc(32, 64, r, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(32, 0, r, 0, Math.PI); ctx.stroke(); }
      circ(0, 0, 2, hsla(t.h, 60, 60, 0.5)); circ(64, 64, 2, hsla(t.h, 60, 60, 0.5));
    },
    decor(t) {
      ctx.fillStyle = vgrad(294, 306, ['#8a7444', hsl(t.h, Math.max(t.s, 50), 26), '#3a2808']); ctx.fillRect(0, 294, GW, 12);
      ctx.fillStyle = '#4a3410';
      for (let x = 2; x < GW; x += 10) ctx.fillRect(x, 306, 5, 5);
      for (const s of [0, 1]) {
        const x0 = s ? GW - WALL : WALL, d = s ? -1 : 1;
        ctx.fillStyle = 'hsl(350, 55%, 28%)';
        ctx.beginPath(); ctx.moveTo(x0, 311); ctx.lineTo(x0 + d * 84, 311); ctx.quadraticCurveTo(x0 + d * 40, 340, x0 + d * 22, 410); ctx.lineTo(x0, 410); ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2;
        for (const k of [0.3, 0.55, 0.8]) { ctx.beginPath(); ctx.moveTo(x0 + d * 84 * k, 312); ctx.quadraticCurveTo(x0 + d * 30 * k, 360, x0 + d * 16 * k, 408); ctx.stroke(); }
        circ(x0 + d * 26, 380, 4, '#e8be5a');
      }
      const [px, py] = SLOT_B;
      ctx.fillStyle = vgrad(py - 34, py + 34, ['#fff0b8', '#c99a2a', '#7a5410']); ctx.fillRect(px - 40, py - 32, 80, 64);
      ctx.fillStyle = vgrad(py - 26, py + 26, ['#7aa8d8', '#f2c79a']); ctx.fillRect(px - 33, py - 25, 66, 50);
      ctx.fillStyle = '#5f8a5a'; ctx.beginPath(); ctx.moveTo(px - 33, py + 25); ctx.quadraticCurveTo(px - 10, py + 4, px + 33, py + 18); ctx.lineTo(px + 33, py + 25); ctx.fill();
      ctx.fillStyle = '#4a5478'; ctx.fillRect(px - 5, py - 20, 10, 36);
      ctx.fillStyle = '#ffe9a8'; for (let k = 0; k < 4; k++) ctx.fillRect(px - 2, py - 15 + k * 8, 4, 3);
      tri(px - 7, py - 20, px + 7, py - 20, px, py - 28, '#4a5478');
      const [cx, cy] = SLOT_A;
      circ(cx, cy - 96, 7, '#c99a2a');
    },
    live(t, y0) {
      const [cx, cy] = SLOT_A, top = y0 + cy - 96;
      if (top < -160 || top > H + 20) return;
      const f = G.frame, a = Math.sin(f * 0.02) * 0.04, x = cx + Math.sin(a) * 70, y = top + Math.cos(a) * 70;
      limb(cx, top, x, y, 1.6, '#8a6418');
      glowAt(x, y + 4, 70, 'rgba(255,220,140,0.55)', 0.7);
      ctx.strokeStyle = '#c99a2a'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(x, y + 8, 34, 9, 0, 0, Math.PI); ctx.stroke();
      for (let k = 0; k < 5; k++) {
        const ax = x - 34 + k * 17, ay = y + 8 + Math.sin(k / 4 * Math.PI) * 9;
        ctx.fillStyle = '#f6efe0'; ctx.fillRect(ax - 2, ay - 9, 4, 8);
        tri(ax - 2.5, ay - 9, ax + 2.5, ay - 9, ax + Math.sin(f * 0.4 + k) * 1.2, ay - 16 - Math.sin(f * 0.53 + k) * 1.5, 'rgba(255,200,90,0.95)');
        twinkle(ax, ay + 7, 0.4 + pulse(0.05, k * 1.3, 6) * 0.6, 3, '#ffffff');
      }
    },
    screen() {
      for (const [x0, w, ph] of [[GW * 0.25, 70, 0], [GW * 0.62, 50, 2]]) {
        alpha(0.04 + 0.03 * Math.sin(G.frame * 0.01 + ph));
        ctx.fillStyle = '#ffe6a0';
        ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0 + w, 0); ctx.lineTo(x0 + w + 160, H); ctx.lineTo(x0 + 120, H); ctx.fill();
      }
      alpha(1);
    },
  },

  crystal: {
    tile: [128, 64], windows: false,
    wall(t) {
      const s = Math.min(t.s, 40);
      ctx.fillStyle = hsl(t.h, s * 0.4, 7); ctx.fillRect(0, 0, 128, 64);
      for (let i = 0; i < 10; i++) {
        const x = (i % 5) * 26 + 2 + SR(i, 110) * 4, y = Math.floor(i / 5) * 32 + 2 + SR(i, 111) * 4;
        ctx.fillStyle = hsl(t.h, s * 0.35, 10 + SR(i, 112) * 4); rr(x, y, 22, 27, 9); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.035)'; rr(x + 2, y + 2, 12, 8, 4); ctx.fill();
      }
    },
    decor(t) {
      for (let i = 0; i < 9; i++) { const x = 30 + SR(i, 113) * 420; tri(x - 7, 0, x + 7, 0, x, 18 + SR(i, 114) * 30, hsl(t.h, Math.min(t.s, 40) * 0.4, 9)); }
      CRYSTAL_SPOTS.forEach(([cx, cy, sc], j) => {
        for (let k = 0; k < 5; k++) {
          const hue = t.special === 'prism' ? (j * 70 + k * 50) % 360 : (t.h + (k - 2) * 8 + 360) % 360;
          const len = (24 + SR(j * 7 + k, 115) * 38) * sc, w = (7 + SR(j * 7 + k, 116) * 6) * sc;
          const a = (k - 2) * 0.28 + (SR(j * 7 + k, 117) - 0.5) * 0.2, bx = cx + (k - 2) * 7 * sc;
          ctx.save(); ctx.translate(bx, cy + 18 * sc); ctx.rotate(a);
          ctx.fillStyle = hsl(hue, 70, 52);
          ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.lineTo(w / 2, -len * 0.75); ctx.lineTo(0, -len); ctx.lineTo(-w / 2, -len * 0.75); ctx.closePath(); ctx.fill();
          ctx.fillStyle = hsl(hue, 75, 74);
          ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(0, 0); ctx.lineTo(0, -len); ctx.lineTo(-w / 2, -len * 0.75); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 1; ctx.stroke();
          ctx.restore();
        }
        ell(cx, cy + 20 * sc, 26 * sc, 6 * sc, hsl(t.h, Math.min(t.s, 40) * 0.4, 6));
      });
    },
    live(t, y0) {
      CRYSTAL_SPOTS.forEach(([cx, cy, sc], j) => {
        const y = y0 + cy;
        if (y < -80 || y > H + 80) return;
        const hue = t.special === 'prism' ? (j * 70) % 360 : t.h;
        glowAt(cx, y, 64 * sc, hsla(hue, 90, 65, 0.55), 0.45 + 0.3 * Math.sin(G.frame * 0.03 + j * 1.7));
        twinkle(cx + (SR(j, 118) - 0.5) * 20 * sc, y - 18 * sc, pulse(0.04, j * 2.3, 10), 5, '#ffffff');
      });
    },
  },

  neon: {
    tile: [64, 64], windows: true,
    wall(t) {
      ctx.fillStyle = hsl(t.h, 40, 6); ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = hsla(t.h, t.s ? 100 : 0, 55, 0.14); ctx.fillRect(0, 0, 64, 1); ctx.fillRect(0, 0, 1, 64);
      circ(32, 32, 1, hsla(t.h, 100, 60, 0.2));
    },
    decor(t) {
      for (const [x, y] of [SLOT_A, SLOT_B]) {
        ctx.fillStyle = '#0d0a16'; rr(x - 44, y - 34, 88, 68, 8); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 2; ctx.stroke();
        circ(x - 38, y - 28, 2, '#3a3450'); circ(x + 38, y - 28, 2, '#3a3450');
      }
      ctx.fillStyle = '#0d0a16'; rr(140, 300, 200, 80, 8); ctx.fill();
      ctx.strokeStyle = hsla(t.h, 100, 60, 0.4); ctx.lineWidth = 1.5; ctx.stroke();
    },
    live(t, y0) {
      const f = G.frame, color = t.s ? hsl(t.h, 100, 62) : '#6fd0b8';
      [SLOT_A, SLOT_B].forEach(([x, y], i) => {
        if (y0 + y < -50 || y0 + y > H + 50) return;
        const icon = ['heart', 'star', 'arrow', 'bolt', 'note'][(t.index + i * 2) % 5];
        const lit = hash(f >> 3, 120 + i + t.index) > 0.05;
        ctx.drawImage(neonSign(icon, i ? hsl((t.h + 180) % 360, 100, 62) : color, lit).c, x - 48, y0 + y - 36, 96, 72);
      });
      if (y0 + 380 < 0 || y0 + 300 > H) return;
      for (let i = 0; i < 14; i++) {
        const h = 6 + Math.abs(Math.sin(f * 0.07 + i * 0.9) * Math.sin(f * 0.031 + i * 1.7)) * 58;
        ctx.fillStyle = hsl((t.h + i * 8) % 360, t.s ? 100 : 0, 60);
        ctx.fillRect(150 + i * 13.5, y0 + 372 - h, 9, h);
      }
    },
    screen(t) {
      if (t.special !== 'glitch' || (G.frame % 97) > 6) return;
      for (let i = 0; i < 4; i++) {
        alpha(0.5);
        ctx.fillStyle = GLITCH_COLORS[(hash(G.frame, 130 + i) * 5) | 0];
        ctx.fillRect(hash(G.frame, 140 + i) * GW * 0.6, hash(G.frame, 150 + i) * H, 40 + hash(G.frame, 160 + i) * 200, 3 + hash(G.frame, 170 + i) * 10);
      }
      alpha(1);
    },
  },

  cloud: {
    open: true,
    far(t, h) {
      const day = !STORMY.has(t.name), s = Math.min(t.s, 70);
      ctx.fillStyle = vgrad(0, h, [hsl(t.h, s, day ? 42 : 20), hsl(t.h, s * 0.85, day ? 62 : 32), hsl(t.h, s * 0.8, day ? 74 : 44)]);
      ctx.fillRect(0, 0, GW, h);
      if (day) { glow(GW * 0.76, h * 0.14, 160, 'rgba(255,250,220,0.75)'); circ(GW * 0.76, h * 0.14, 24, 'rgba(255,252,236,0.95)'); }
      if (t.name === 'SKY PALACE') {
        const px = GW / 2, py = h * 0.4;
        ctx.fillStyle = 'rgba(255,214,120,0.6)';
        ctx.fillRect(px - 60, py - 30, 120, 34);
        for (const [dx, tw, th] of [[-70, 16, 70], [54, 16, 70], [-14, 28, 90]]) { ctx.fillRect(px + dx, py - th, tw, th); ctx.beginPath(); ctx.arc(px + dx + tw / 2, py - th, tw / 2 + 2, Math.PI, 0); ctx.fill(); }
        cloudPuff(px, py + 8, 70, 'rgba(255,255,255,0.75)');
      }
      for (let layer = 0; layer < 3; layer++) {
        const y = h * (0.6 + layer * 0.13), fill = day ? `rgba(225,236,255,${0.22 + layer * 0.12})` : `rgba(${90 + layer * 15},${100 + layer * 15},${125 + layer * 12},${0.6 + layer * 0.15})`;
        for (let x = -40; x < GW + 60; x += 70) cloudPuff(x + SR(x + layer * 99, 120) * 30, y + SR(x, 121 + layer) * 20, 34 + SR(x, 124 + layer) * 22, fill);
        ctx.fillStyle = fill; ctx.fillRect(0, y + 20, GW, h - y);
      }
    },
    near(t, T) {
      const day = !STORMY.has(t.name);
      for (let i = 0; i < 7; i++) {
        const side = i % 2, x = side ? GW - WALL - 10 - SR(i, 126) * 40 : WALL + 10 + SR(i, 126) * 40;
        cloudPuff(x, (i + 0.5) * T / 7, 30 + SR(i, 127) * 22, day ? 'rgba(235,242,255,0.4)' : 'rgba(120,130,155,0.6)');
      }
    },
    liveFar(t) {
      const f = G.frame, day = !STORMY.has(t.name);
      for (let i = 0; i < 3; i++) {
        const x = ((f * (0.15 + i * 0.1) + i * 230) % (GW + 260)) - 130;
        const y = ((i * 260 + 80 - G.camY * 0.2) % (H + 200) + H + 200) % (H + 200) - 100;
        alpha(0.3); cloudPuff(x, y, 40 + i * 10, day ? '#eef4ff' : '#8a93ac'); alpha(1);
      }
      if (day) {
        const p = (f + 200) % 900;
        if (p < 300) for (let k = 0; k < 5; k++) {
          const bx = GW + 20 - p * 1.8 + k * 16, by = H * 0.22 + Math.abs(k - 2) * 8 + Math.sin(p * 0.05) * 6, w = Math.sin(p * 0.4 + k) * 3;
          ctx.strokeStyle = 'rgba(40,50,80,0.6)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(bx - 5, by - w); ctx.lineTo(bx, by); ctx.lineTo(bx + 5, by - w); ctx.stroke();
        }
      } else {
        const p = f % 330, strike = Math.floor(f / 330);
        if (p < 12) {
          let x = 80 + hash(strike, 180) * (GW - 160), y = 0;
          ctx.strokeStyle = 'rgba(255,255,240,0.9)'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(x, y);
          for (let k = 0; k < 9; k++) { x += (hash(strike, 190 + k) - 0.5) * 50; y += H * 0.07; ctx.lineTo(x, y); }
          alpha(1 - p / 12); ctx.stroke();
          alpha(0.35 * (1 - p / 12)); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, GW, H);
          alpha(1);
        }
      }
    },
  },

  cosmic: {
    open: true,
    far(t, h) {
      ctx.fillStyle = vgrad(0, h, ['#000004', hsl(t.h, Math.min(t.s, 60), t.l * 0.25), '#02010a']); ctx.fillRect(0, 0, GW, h);
      for (let i = 0; i < 5; i++) glow(SR(t.index * 7 + i, 200) * GW, SR(t.index * 7 + i, 201) * h, 120 + SR(i, 202) * 140, hsla((t.h + (i % 2 ? 40 : -30) + 360) % 360, 80, 50, 0.2));
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.25 + SR(i, 203) * 0.7})`;
        const s = SR(i, 204) > 0.9 ? 2 : 1.2;
        ctx.fillRect(SR(i, 205) * GW, SR(i, 206) * h, s, s);
      }
      if (t.name === 'EVENT HORIZON') {
        glow(GW / 2, h * 0.32, 170, 'rgba(255,150,60,0.3)');
        circ(GW / 2, h * 0.32, 38, '#000000');
        ctx.strokeStyle = 'rgba(255,200,120,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(GW / 2, h * 0.32, 40, 0, Math.PI * 2); ctx.stroke();
      } else if (t.name === 'THE SUMMIT') {
        glow(GW / 2, 0, 260, 'rgba(255,215,120,0.45)');
      } else {
        const px = 90 + SR(t.index, 207) * (GW - 180), py = h * (0.15 + SR(t.index, 208) * 0.35), pr = 24 + SR(t.index, 209) * 30;
        const ph = (t.h + 60) % 360;
        ctx.save(); ctx.translate(px, py); ctx.rotate(-0.35);
        ctx.strokeStyle = hsla(ph, 50, 80, 0.55); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(0, 0, pr * 1.9, pr * 0.42, 0, Math.PI, Math.PI * 2); ctx.stroke();
        const g = ctx.createRadialGradient(-pr * 0.4, -pr * 0.4, pr * 0.1, 0, 0, pr);
        g.addColorStop(0, hsl(ph, 55, 62)); g.addColorStop(1, hsl(ph, 45, 18));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, pr, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(0, 0, pr * 1.9, pr * 0.42, 0, 0, Math.PI); ctx.stroke();
        ctx.restore();
      }
    },
    near(t, T) {
      for (let i = 0; i < 7; i++) {
        const x = 50 + SR(i + t.index, 210) * 380, y = SR(i, 211) * T;
        glow(x, y, 10, 'rgba(255,255,255,0.5)');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 6, y - 0.6, 12, 1.2); ctx.fillRect(x - 0.6, y - 6, 1.2, 12);
      }
      for (let i = 0; i < 3; i++) rock(60 + SR(i + t.index, 212) * 360, SR(i, 213) * T, 4 + SR(i, 214) * 6, 'rgba(90,80,100,0.8)', i + 40);
    },
    liveFar(t) {
      const f = G.frame;
      for (let i = 0; i < 12; i++) twinkle(SR(i, 220) * GW, SR(i, 221) * H, pulse(0.03, i * 2.1, 8), 4, '#ffffff');
      const p = f % 420;
      if (p < 36) {
        const s = Math.floor(f / 420), x = GW * (0.5 + hash(s, 230) * 0.5) - p * 10, y = H * hash(s, 231) * 0.4 + p * 4;
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2;
        alpha(1 - p / 36);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 40, y - 16); ctx.stroke();
        alpha(1);
      }
      if (t.name === 'EVENT HORIZON') {
        const cx = GW / 2, cy = H * 0.32;
        for (let i = 0; i < 48; i++) {
          const a = f * 0.02 + i * Math.PI * 2 / 48, x = cx + Math.cos(a) * 74, y = cy + Math.sin(a) * 18;
          if (Math.sin(a) < 0 && Math.abs(x - cx) < 38) continue;
          circ(x, y, 2, i % 3 ? 'rgba(255,170,80,0.9)' : 'rgba(255,240,200,0.95)');
        }
      }
    },
  },
};

const CRYSTAL_SPOTS = [[330, 150, 1.2], [150, 470, 1.1], [110, 140, 0.8], [370, 430, 0.9], [250, 600, 0.7], [80, 360, 0.6], [400, 300, 0.6]];
