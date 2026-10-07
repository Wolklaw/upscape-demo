const SCENE_TILE = 640, SCENE_FADE = 14;
const SR = (i, k) => hashSeed(0x5CE9E, i, k);

const sceneArt = new Map();
function sceneLayers(id) {
  const key = `${id}|${devicePx()}|${H}|${GW}|${settings.lang}`;
  let s = sceneArt.get(key);
  if (!s) {
    trim(sceneArt, 3);
    const def = SCENES[id], fade = BGA;
    BGA = 1;
    s = {
      far: drawInto(makeLayer(GW, H), () => def.far(H)),
      near: drawInto(makeLayer(GW, SCENE_TILE), () => def.near(SCENE_TILE)),
    };
    if (def.init) def.init(s);
    BGA = fade;
    sceneArt.set(key, s);
  }
  return s;
}

function drawScene(id) {
  const s = sceneLayers(id), def = SCENES[id];
  ctx.drawImage(s.far.c, 0, 0, GW, H);
  if (def.live && !LOW) def.live(s);
  const T = SCENE_TILE, off = ((-G.camY * 0.6) % T + T) % T;
  for (let y = off - T; y < H; y += T) ctx.drawImage(s.near.c, 0, y, GW, T);
}

function glow(x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
function vgrad(y0, y1, stops) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c));
  return g;
}
function rock(x, y, s, fill, seed) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * Math.PI * 2, r = s * (0.7 + SR(seed, i) * 0.5) * (Math.sin(a) > 0 ? 1.3 : 0.8);
    ctx.lineTo(x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r);
  }
  ctx.closePath(); ctx.fill();
}
const qpt = (x0, y0, cx, cy, x1, y1, t) => [
  (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1,
  (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1,
];
function garland(x0, x1, y, sag, colors, kind) {
  const cx = (x0 + x1) / 2, cy = y + sag;
  ctx.strokeStyle = 'rgba(40,30,30,0.7)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo(cx, cy, x1, y); ctx.stroke();
  for (let i = 1; i < 16; i++) {
    const [px, py] = qpt(x0, y, cx, cy, x1, y, i / 16);
    const c = colors[i % colors.length];
    if (kind === 'flags') tri(px - 6, py, px + 6, py, px, py + 12, c);
    else { circ(px, py + 3, 3.4, c); circ(px, py + 3, 1.3, '#ffe9a8'); }
  }
}

const PIX_FONT = {
  I: '111010010010111', N: '110101101101101', S: '111100111001111', E: '111100111100111', R: '110101110101101',
  T: '111010010010010', C: '111100100100111', O: '111101101101111', H: '101101111101101', U: '101101101101111',
  P: '111101111100100', '-': '000000111000000', ' ': '000000000000000',
  0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001',
  5: '111100111001111', 6: '111100111101111', 7: '111001001001001', 8: '111101111101111', 9: '111101111001111',
};
function pixText(str, x, y, px, color) {
  ctx.fillStyle = color;
  let cx = Math.round(x - (str.length * 4 * px - px) / 2);
  for (const ch of str) {
    const g = PIX_FONT[ch] || PIX_FONT[' '];
    for (let i = 0; i < 15; i++) if (g[i] === '1') ctx.fillRect(cx + (i % 3) * px, y + ((i / 3) | 0) * px, px, px);
    cx += 4 * px;
  }
}
const SCENES = {
  souls: {
    far(h) {
      const base = h * 0.8;
      ctx.fillStyle = vgrad(0, h, ['#120f0d', '#3a3129', '#62513f', '#1c1814']); ctx.fillRect(0, 0, GW, h);
      const ex = GW * 0.66, ey = h * 0.17;
      glow(ex, ey, 150, 'rgba(255,140,50,0.45)');
      circ(ex, ey, 30, '#e8a066'); circ(ex, ey, 22, '#f7c88e');
      ctx.fillStyle = '#17130f';
      ctx.fillRect(150, base - 96, 180, 96);
      ctx.fillRect(218, base - 176, 44, 80); tri(214, base - 176, 266, base - 176, 240, base - 290, '#17130f');
      for (const tx of [146, 300]) { ctx.fillStyle = '#17130f'; ctx.fillRect(tx, base - 150, 34, 150); tri(tx - 3, base - 150, tx + 37, base - 150, tx + 17, base - 214, '#17130f'); }
      ctx.strokeStyle = '#17130f'; ctx.lineWidth = 6;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(240 + s * 120, base - 40, 60, s < 0 ? -Math.PI / 2 : Math.PI, s < 0 ? 0 : -Math.PI / 2); ctx.stroke(); }
      for (let i = 0; i < 7; i++) {
        const wx = 164 + i * 24, wy = base - 70 + (i % 2) * 8;
        ctx.fillStyle = `rgba(255,140,50,${0.25 + SR(i, 1) * 0.4})`;
        ctx.beginPath(); ctx.moveTo(wx - 4, wy + 14); ctx.lineTo(wx - 4, wy + 4); ctx.lineTo(wx, wy); ctx.lineTo(wx + 4, wy + 4); ctx.lineTo(wx + 4, wy + 14); ctx.fill();
      }
      ctx.fillStyle = '#0f0c0a';
      ctx.beginPath(); ctx.moveTo(0, base + 6);
      for (let x = 0; x <= GW; x += 20) ctx.lineTo(x, base - SR(x, 2) * 26 + 4);
      ctx.lineTo(GW, h); ctx.lineTo(0, h); ctx.fill();
      ctx.fillStyle = vgrad(base - 50, base + 40, ['rgba(150,128,105,0)', 'rgba(150,128,105,0.28)', 'rgba(150,128,105,0)']);
      ctx.fillRect(0, base - 50, GW, 90);
    },
    near(T) {
      for (const side of [0, 1]) {
        const x0 = side ? GW - WALL - 40 : WALL;
        ctx.fillStyle = '#2b2622'; ctx.fillRect(x0, 0, 40, T);
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        for (let y = 0; y < T; y += 28) ctx.fillRect(x0, y, 40, 2);
        ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(side ? x0 : x0 + 36, 0, 4, T);
        for (const ay of [T * 0.22, T * 0.72]) {
          const dir = side ? -1 : 1, sx = side ? x0 : x0 + 40;
          ctx.strokeStyle = '#2b2622'; ctx.lineWidth = 13; ctx.lineCap = 'butt';
          ctx.beginPath(); ctx.moveTo(sx, ay + 90); ctx.quadraticCurveTo(sx + dir * 10, ay + 10, sx + dir * 92, ay - 6); ctx.stroke();
          ctx.fillStyle = '#2b2622';
          tri(sx + dir * 88, ay - 13, sx + dir * 104, ay - 2, sx + dir * 86, ay + 2, '#2b2622');
          ctx.strokeStyle = 'rgba(20,16,14,0.8)'; ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let k = 0; k < 9; k++) { const cx = sx + dir * 56, cy = ay + 6 + k * 7; ctx.moveTo(cx - 2, cy); ctx.arc(cx, cy, 2.4, Math.PI, Math.PI * 3); }
          ctx.stroke();
        }
      }
    },
  },

  witcher: {
    far(h) {
      ctx.fillStyle = vgrad(0, h, ['#060a1a', '#141f3c', '#2c3b5a']); ctx.fillRect(0, 0, GW, h);
      for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(255,255,255,${0.3 + SR(i, 3) * 0.6})`; ctx.fillRect(SR(i, 4) * GW, SR(i, 5) * h * 0.6, 1.4, 1.4); }
      const mx = GW * 0.3, my = h * 0.2;
      glow(mx, my, 150, 'rgba(210,225,255,0.32)');
      circ(mx, my, 44, '#efebd8');
      [[-12, -8, 9], [14, 6, 7], [-4, 16, 5], [10, -18, 4]].forEach(([dx, dy, r]) => circ(mx + dx, my + dy, r, 'rgba(180,176,158,0.45)'));
      ctx.fillStyle = '#1a2440';
      ctx.beginPath(); ctx.moveTo(0, h * 0.7);
      for (let x = 0; x <= GW; x += 40) ctx.lineTo(x, h * 0.6 + Math.sin(x * 0.03) * 22 - SR(x, 6) * 40);
      ctx.lineTo(GW, h); ctx.lineTo(0, h); ctx.fill();
      const cx = GW * 0.7, cy = h * 0.66;
      ctx.fillStyle = '#10172b';
      ctx.beginPath(); ctx.moveTo(cx - 90, h); ctx.lineTo(cx - 40, cy + 10); ctx.lineTo(cx + 30, cy); ctx.lineTo(cx + 110, h); ctx.fill();
      ctx.fillRect(cx - 30, cy - 46, 60, 50);
      for (const [tx, th] of [[-36, 76], [26, 92]]) {
        ctx.fillRect(cx + tx, cy - th, 16, th);
        tri(cx + tx - 4, cy - th, cx + tx + 20, cy - th, cx + tx + 8, cy - th - 26, '#10172b');
      }
      for (let i = 0; i < 6; i++) ctx.fillRect(cx - 30 + i * 11, cy - 52, 6, 6);
      ctx.fillStyle = '#ffcf6a'; ctx.fillRect(cx + 30, cy - 60, 4, 6); ctx.fillRect(cx - 8, cy - 30, 4, 5);
      ctx.fillStyle = '#0a1020';
      for (let x = -10; x < GW + 10; x += 14) {
        const th = 30 + SR(x, 7) * 40, by = h * 0.9;
        tri(x - 9, by, x + 9, by, x, by - th, '#0a1020');
      }
      ctx.fillRect(0, h * 0.9 - 1, GW, h * 0.1 + 1);
      ctx.fillStyle = vgrad(h * 0.74, h * 0.9, ['rgba(170,190,220,0)', 'rgba(170,190,220,0.14)', 'rgba(170,190,220,0)']);
      ctx.fillRect(0, h * 0.74, GW, h * 0.16);
      ctx.strokeStyle = '#05070f'; ctx.lineWidth = 1.6;
      for (let i = 0; i < 4; i++) {
        const bx = GW * 0.45 + SR(i, 8) * 140, by = h * 0.12 + SR(i, 9) * 80, s = 4 + SR(i, 10) * 3;
        ctx.beginPath(); ctx.moveTo(bx - s, by - s * 0.6); ctx.quadraticCurveTo(bx - s * 0.4, by - s * 0.3, bx, by); ctx.quadraticCurveTo(bx + s * 0.4, by - s * 0.3, bx + s, by - s * 0.6); ctx.stroke();
      }
    },
    near(TH) {
      const pine = (x, base, ht) => {
        for (let k = 0; k < 5; k++) {
          const y = base - k * ht / 6, hw = (5 - k) * ht / 22 + 4;
          tri(x - hw, y, x + hw, y, x, y - ht / 3.2, '#0d181b');
          limb(x - hw * 0.6, y - 3, x, y - ht / 4.5, 1.6, 'rgba(230,240,255,0.55)');
        }
      };
      for (let i = 0; i < 4; i++) {
        pine(WALL + 12 + SR(i, 11) * 18, (i + 0.9) * TH / 4, 110 + SR(i, 12) * 40);
        pine(GW - WALL - 12 - SR(i, 13) * 18, (i + 0.4) * TH / 4, 110 + SR(i, 14) * 40);
      }
      const bx = WALL + 18, by = TH * 0.52;
      ctx.fillStyle = '#3a2817'; ctx.fillRect(bx + 6, by, 5, 62); ctx.fillRect(bx + 78, by, 5, 62);
      ctx.fillStyle = '#5a3f26'; ctx.fillRect(bx, by - 6, 90, 50);
      ctx.fillStyle = '#3a2817'; ctx.fillRect(bx - 4, by - 10, 98, 6);
      ctx.fillStyle = '#e9dcbc'; ctx.fillRect(bx + 6, by, 44, 38);
      ctx.fillStyle = '#d8c9a2'; ctx.fillRect(bx + 56, by + 2, 28, 20); ctx.fillRect(bx + 58, by + 25, 22, 14);
      text(T('WANTED'), bx + 28, by + 8, 8.5, '#8a1c14', { stroke: false, font: BODY, weight: 900, max: 40 });
      text(T('tower wraith'), bx + 28, by + 19, 6.5, '#3a2a1a', { stroke: false, font: BODY, weight: 800, max: 40 });
      text(T('50 coins'), bx + 28, by + 29, 7, '#3a2a1a', { stroke: false, font: BODY, weight: 900, max: 40 });
      ctx.fillStyle = 'rgba(60,40,20,0.5)';
      for (let k = 0; k < 4; k++) ctx.fillRect(bx + 60, by + 6 + k * 4, 20 - (k % 2) * 6, 1.4);
    },
  },

  gravity: {
    far(h) {
      const g = ctx.createRadialGradient(GW / 2, h * 0.45, 20, GW / 2, h * 0.45, h * 0.8);
      g.addColorStop(0, '#c9d0da'); g.addColorStop(1, '#6c7890');
      ctx.fillStyle = g; ctx.fillRect(0, 0, GW, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 2;
      for (let k = 1; k < 9; k++) { ctx.beginPath(); ctx.ellipse(GW / 2, h * 1.25, k * 70, k * 46, 0, Math.PI, 0); ctx.stroke(); }
      for (let k = -4; k <= 4; k++) { ctx.beginPath(); ctx.moveTo(GW / 2 + k * 30, h * 1.25); ctx.lineTo(GW / 2 + k * 160, 0); ctx.stroke(); }
      const px = GW / 2, py = h * 0.24, r = 66;
      circ(px, py, r, '#04060e');
      ctx.save(); ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.clip();
      for (let i = 0; i < 30; i++) { ctx.fillStyle = `rgba(255,255,255,${0.4 + SR(i, 15) * 0.6})`; ctx.fillRect(px - r + SR(i, 16) * r * 2, py - r + SR(i, 17) * r * 2, 1.5, 1.5); }
      circ(px - 16, py + 18, 22, '#3f7d5c'); circ(px - 22, py + 12, 9, '#6fb07a'); circ(px - 6, py + 24, 6, '#2b5a42');
      ctx.restore();
      ctx.strokeStyle = '#e9edf2'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(px, py, r + 6, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#9aa4b4'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(px, py, r + 1, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; circ(px + Math.cos(a) * (r + 6), py + Math.sin(a) * (r + 6), 2, '#8a94a6'); }
      const cx = GW / 2, cy = h * 0.6;
      ctx.fillStyle = '#2a2f3a'; rr(cx - 96, cy - 34, 192, 76, 10); ctx.fill();
      ctx.fillStyle = '#ff8a3d'; ctx.fillRect(cx - 96, cy + 30, 192, 6);
      ctx.fillStyle = '#160404'; rr(cx - 80, cy - 24, 160, 40, 5); ctx.fill();
      text(T('GRAVITY'), cx - 34, cy - 4, 13, '#ff5a4a', { stroke: false });
      text('x1.2', cx + 46, cy - 4, 22, '#ff3b30', { stroke: false });
      ['#4d96ff', '#6bcb77', '#ffd93d', '#ff6b6b'].forEach((c, i) => circ(cx - 60 + i * 18, cy + 23, 4, c));
    },
    near(T) {
      for (const side of [0, 1]) {
        const x0 = side ? GW - WALL - 54 : WALL;
        ctx.fillStyle = '#d5dbe3'; ctx.fillRect(x0, 0, 54, T);
        ctx.fillStyle = '#b4bcc8';
        for (let y = 0; y < T; y += 80) ctx.fillRect(x0, y, 54, 2);
        ctx.fillStyle = '#ff8a3d'; ctx.fillRect(side ? x0 + 4 : x0 + 44, 0, 6, T);
        for (let y = 10; y < T; y += 40) { circ(x0 + 10, y, 1.8, '#8d96a5'); circ(x0 + 34, y, 1.8, '#8d96a5'); }
        for (const hy of [T * 0.3, T * 0.8]) {
          ctx.save(); ctx.beginPath(); ctx.rect(x0, hy, 54, 26); ctx.clip();
          ctx.fillStyle = '#ffd93d'; ctx.fillRect(x0, hy, 54, 26);
          ctx.fillStyle = '#1e2230';
          for (let k = -2; k < 8; k++) { ctx.beginPath(); ctx.moveTo(x0 + k * 14, hy + 26); ctx.lineTo(x0 + k * 14 + 7, hy + 26); ctx.lineTo(x0 + k * 14 + 33, hy); ctx.lineTo(x0 + k * 14 + 26, hy); ctx.fill(); }
          ctx.restore();
        }
      }
    },
    live() {
      if ((G.frame >> 5) & 1) circ(GW / 2 + 80, H * 0.6 - 26, 3, '#ff3b30');
    },
  },

  lumiere: {
    far(h) {
      const hz = Math.round(h * 0.6);
      ctx.fillStyle = vgrad(0, hz, ['#3c4a7a', '#8f7a9c', '#d6998f', '#f5d6a8']); ctx.fillRect(0, 0, GW, hz);
      glow(GW * 0.24, hz - 8, 160, 'rgba(255,236,196,0.8)');
      for (let i = 0; i < 7; i++) ell(SR(i, 18) * GW, h * 0.1 + SR(i, 19) * h * 0.32, 50 + SR(i, 20) * 70, 7 + SR(i, 21) * 6, 'rgba(255,222,205,0.22)');
      ctx.fillStyle = vgrad(hz, h, ['#8db0b2', '#47707f', '#1d3a4c']); ctx.fillRect(0, hz, GW, h - hz);
      for (let i = 0; i < 50; i++) {
        const t = i / 50, y = hz + 3 + t * t * (h - hz - 6), ww = 8 + t * 70;
        ctx.fillStyle = `rgba(255,232,190,${0.5 * (1 - t)})`;
        ctx.fillRect(GW * 0.24 - ww / 2 + (SR(i, 22) - 0.5) * 34 * t, y, ww, 1 + t * 2);
      }
      const mx = GW * 0.64, top = h * 0.14;
      ctx.beginPath(); ctx.moveTo(mx - 78, hz + 2); ctx.lineTo(mx - 46, top + 96); ctx.lineTo(mx - 28, top + 66); ctx.lineTo(mx + 24, top + 72); ctx.lineTo(mx + 46, top + 104); ctx.lineTo(mx + 80, hz + 2); ctx.closePath();
      ctx.fillStyle = '#3a3346'; ctx.fill();
      ctx.fillStyle = vgrad(top, hz, ['rgba(214,153,143,0.12)', 'rgba(245,214,168,0.55)']); ctx.fill();
      ctx.strokeStyle = 'rgba(255,225,205,0.22)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(mx - 28, top + 66); ctx.lineTo(mx - 46, top + 96); ctx.lineTo(mx - 78, hz); ctx.stroke();
      lighthouse(mx - 2, top + 30, 1.2);
      const cy = h * 0.9;
      ctx.fillStyle = '#4b4360';
      for (let x = 0; x < GW;) {
        const bw = 28 + SR(x, 31) * 40, bh = 18 + SR(x, 32) * 36;
        ctx.fillRect(x, cy - bh, bw - 2, bh + h);
        tri(x - 2, cy - bh, x + bw, cy - bh, x + bw / 2, cy - bh - 8, '#4b4360');
        for (let k = 0; k < 3; k++) if (SR(x, 33 + k) > 0.45) { ctx.fillStyle = 'rgba(255,214,140,0.7)'; ctx.fillRect(x + 5 + k * 8, cy - bh + 8, 3, 4); ctx.fillStyle = '#4b4360'; }
        x += bw;
      }
      ell(GW * 0.82, cy - 44, 26, 22, '#4b4360'); ctx.fillRect(GW * 0.82 - 26, cy - 44, 52, 44);
      const tx = GW * 0.34, tb = cy - 10, th = h * 0.36;
      ctx.fillStyle = '#2e2a3d'; ctx.fillRect(tx - 24, tb - th, 48, th + 12);
      poly([tx - 30, tb - th, tx + 30, tb - th, tx, tb - th - 46], '#3a3350'); ctx.fillRect(tx - 28, tb - th - 2, 56, 5);
      circ(tx, tb - th + 34, 16, '#f0e6c8'); circ(tx, tb - th + 34, 13, '#e6dcc0');
      ctx.strokeStyle = '#2e2a3d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx, tb - th + 34); ctx.lineTo(tx, tb - th + 24); ctx.moveTo(tx, tb - th + 34); ctx.lineTo(tx + 7, tb - th + 37); ctx.stroke();
      for (let y = tb - th + 66; y < tb - 30; y += 44) { ctx.fillStyle = 'rgba(255,214,140,0.7)'; ctx.beginPath(); ctx.moveTo(tx - 6, y + 22); ctx.lineTo(tx - 6, y + 6); ctx.arc(tx, y + 6, 6, Math.PI, 0); ctx.lineTo(tx + 6, y + 22); ctx.fill(); }
      ctx.fillStyle = '#d29a8e'; ctx.beginPath(); ctx.ellipse(tx, tb + 12, 30, 20, 0, Math.PI, 0); ctx.fill();
    },
    near(T) {
      for (const side of [0, 1]) {
        const x0 = side ? GW - WALL - 76 : WALL, w = 76, inner = side ? x0 : x0 + w;
        ctx.fillStyle = '#ecdcbc'; ctx.fillRect(x0, 0, w, T);
        ctx.fillStyle = 'rgba(140,110,70,0.2)';
        for (let y = 0; y < T; y += 16) ctx.fillRect(x0, y, w, 1);
        ctx.fillStyle = 'rgba(120,90,50,0.35)'; ctx.fillRect(side ? inner : inner - 4, 0, 4, T);
        for (let s = 0; s < T / 160; s++) {
          const y = s * 160;
          ctx.fillStyle = '#d6c29b'; ctx.fillRect(x0, y + 146, w, 8);
          ctx.fillStyle = '#f7ecd4'; ctx.fillRect(x0, y + 146, w, 2);
          const wx = x0 + w / 2 - 15, wy = y + 52;
          ctx.fillStyle = '#2f5f62';
          ctx.beginPath(); ctx.moveTo(wx, wy + 80); ctx.lineTo(wx, wy + 15); ctx.arc(wx + 15, wy + 15, 15, Math.PI, 0); ctx.lineTo(wx + 30, wy + 80); ctx.fill();
          ctx.fillStyle = 'rgba(255,240,210,0.25)'; ctx.fillRect(wx + 4, wy + 18, 6, 50);
          ctx.strokeStyle = '#ecdcbc'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(wx + 15, wy); ctx.lineTo(wx + 15, wy + 80); ctx.moveTo(wx, wy + 40); ctx.lineTo(wx + 30, wy + 40); ctx.stroke();
          ctx.strokeStyle = '#1d1b22'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(wx - 8, wy + 66); ctx.lineTo(wx + 38, wy + 66); ctx.moveTo(wx - 8, wy + 82); ctx.lineTo(wx + 38, wy + 82);
          for (let k = 0; k <= 8; k++) { ctx.moveTo(wx - 8 + k * 5.75, wy + 66); ctx.lineTo(wx - 8 + k * 5.75, wy + 82); }
          ctx.stroke();
          for (let k = 0; k < 6; k++) circ(wx - 4 + k * 7.5, wy + 64, 2.6, k % 2 ? '#ff9db0' : '#ffd38a');
        }
      }
      garland(WALL + 76, GW - WALL - 76, T * 0.12, 54, ['#f3ead7', '#c8322b', '#2f6f6a'], 'flags');
      garland(WALL + 76, GW - WALL - 76, T * 0.62, 38, ['#ff9db0', '#ffd38a', '#ffffff'], 'flowers');
    },
  },

  monolith: {
    far(h) {
      ctx.fillStyle = vgrad(0, h, ['#140d1a', '#3a1b2b', '#24141f']); ctx.fillRect(0, 0, GW, h);
      ctx.fillStyle = '#29242f'; ctx.fillRect(56, 0, GW - 112, h);
      for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(255,255,255,${0.015 + SR(i, 40) * 0.03})`; ctx.fillRect(56 + SR(i, 41) * (GW - 112), 0, 1 + SR(i, 42) * 3, h); }
      ctx.strokeStyle = '#16121b'; ctx.lineWidth = 1.6;
      for (let c = 0; c < 7; c++) {
        let x = 70 + SR(c, 43) * (GW - 140), y = SR(c, 44) * h;
        ctx.beginPath(); ctx.moveTo(x, y);
        for (let k = 0; k < 8; k++) { x += (SR(c * 9 + k, 45) - 0.5) * 30; y += 10 + SR(c * 9 + k, 46) * 20; ctx.lineTo(x, y); }
        ctx.stroke();
      }
      ctx.save();
      ctx.translate(GW / 2, h * 0.4); ctx.rotate(-0.05);
      ctx.shadowColor = 'rgba(230,170,60,0.55)'; ctx.shadowBlur = 30;
      paintedSun(0, 0, 130, '#d8a43a');
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#d8a43a';
      for (let i = 0; i < 16; i++) {
        const side = i % 2 ? 1 : -1, dx = side * (20 + SR(i, 47) * 100), len = 20 + SR(i, 48) * 150, dw = 4 + SR(i, 49) * 6;
        ctx.fillRect(dx - dw / 2, 70, dw, len);
        circ(dx, 70 + len, dw * 0.65, '#d8a43a');
      }
      ctx.restore();
      ctx.strokeStyle = 'rgba(120,190,200,0.5)'; ctx.lineWidth = 9; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(80, h * 0.78); ctx.bezierCurveTo(GW * 0.35, h * 0.72, GW * 0.6, h * 0.84, GW - 84, h * 0.76); ctx.stroke();
      for (let i = 0; i < 5; i++) rock(70 + SR(i, 50) * (GW - 140), h * 0.1 + SR(i, 51) * h * 0.8, 4 + SR(i, 52) * 7, '#1a161f', i + 10);
    },
    near(T) {
      for (const side of [0, 1]) {
        const x0 = side ? GW - WALL : WALL, dir = side ? -1 : 1;
        ctx.fillStyle = '#1c1820';
        ctx.beginPath(); ctx.moveTo(x0, 0);
        for (let y = 0; y <= T; y += 32) ctx.lineTo(x0 + dir * (14 + SR(y + side * 999, 53) * 40), y);
        ctx.lineTo(x0, T); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(230,170,70,0.5)'; ctx.lineWidth = 1.4;
        for (let v = 0; v < 3; v++) {
          let x = x0 + dir * 8, y = v * T / 3 + SR(v, 54) * 60;
          ctx.beginPath(); ctx.moveTo(x, y);
          for (let k = 0; k < 6; k++) { x += dir * (2 + SR(v * 7 + k, 55) * 5); y += 12 + SR(v * 7 + k, 56) * 14; ctx.lineTo(x, y); }
          ctx.stroke();
        }
      }
      for (let i = 0; i < 4; i++) rock(140 + SR(i, 57) * 200, i * T / 4 + 40, 3 + SR(i, 58) * 4, 'rgba(26,22,31,0.85)', i + 20);
    },
  },

  arcade: {
    far(h) {
      ctx.fillStyle = '#06050d'; ctx.fillRect(0, 0, GW, h);
      for (let i = 0; i < 80; i++) { ctx.fillStyle = SR(i, 60) > 0.7 ? '#7fe7ff' : '#ffffff'; ctx.globalAlpha = 0.3 + SR(i, 61) * 0.6; ctx.fillRect(Math.round(SR(i, 62) * GW / 2) * 2, Math.round(SR(i, 63) * h * 0.36) * 2, 2, 2); }
      ctx.globalAlpha = 1;
      const hy = h * 0.72;
      glow(GW / 2, hy, 200, 'rgba(255,60,200,0.35)');
      ctx.save(); ctx.beginPath(); ctx.arc(GW / 2, hy, 72, Math.PI, 0); ctx.clip();
      ctx.fillStyle = vgrad(hy - 72, hy, ['#ffe066', '#ff7a59', '#ff2d95']); ctx.fillRect(GW / 2 - 72, hy - 72, 144, 72);
      ctx.fillStyle = '#06050d';
      for (let k = 0; k < 6; k++) ctx.fillRect(GW / 2 - 72, hy - 30 + k * 6, 144, 1 + k * 0.6);
      ctx.restore();
      ctx.fillStyle = '#12061c'; ctx.fillRect(0, hy, GW, h - hy);
      ctx.strokeStyle = 'rgba(255,60,200,0.7)'; ctx.lineWidth = 1.5;
      for (let k = 0; k < 12; k++) { const y = hy + Math.pow(k / 11, 2) * (h - hy); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(GW, y); ctx.stroke(); }
      for (let k = -10; k <= 10; k++) { ctx.beginPath(); ctx.moveTo(GW / 2 + k * 12, hy); ctx.lineTo(GW / 2 + k * 90, h); ctx.stroke(); }
      pixText('HI-SCORE', GW / 2, h * 0.25, 3, '#ff5a5a');
      pixText('1000000', GW / 2, h * 0.25 + 22, 3, '#ffffff');
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, GW, 1);
    },
    near(T) {
      for (const side of [0, 1]) {
        const x0 = side ? GW - WALL - 46 : WALL + 6;
        ctx.save();
        ctx.shadowColor = '#ff4fd0'; ctx.shadowBlur = 8;
        ctx.strokeStyle = '#ff6ad8'; ctx.lineWidth = 2.5;
        for (let y = 20; y < T; y += 160) { rr(x0, y, 40, 120, 4); ctx.stroke(); rr(x0 + 7, y + 7, 26, 106, 2); ctx.stroke(); }
        ctx.restore();
        const px = side ? x0 - 18 : x0 + 58;
        for (let y = 8; y < T; y += 20) {
          if (y % 160 === 88) { circ(px, y, 4, '#7fe7ff'); continue; }
          ctx.fillStyle = '#7fe7ff'; ctx.fillRect(px - 2, y - 2, 4, 4);
        }
      }
    },
    init(s) {
      s.coin = drawInto(makeLayer(GW, 30), () => pixText('INSERT COIN', GW / 2, 2, 5, '#ffd93d'));
      s.bricks = drawInto(makeLayer(GW, 90), () => {
        const colors = ['#ff5ad1', '#7fe7ff', '#7dff9a', '#ffd93d'];
        for (let row = 0; row < 4; row++) for (let c = 0; c < 8; c++) {
          const x = GW / 2 - 4 * 44 + c * 44 + 3, y = 6 + row * 20;
          ctx.fillStyle = colors[row]; rr(x, y, 38, 14, 3); ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x + 3, y + 2, 32, 3);
        }
      });
    },
    live(s) {
      const f = G.frame, dx = Math.sin(f * 0.02) * 16;
      ctx.drawImage(s.bricks.c, dx, H * 0.12, GW, 90);
      const bx = GW / 2 + Math.sin(f * 0.037) * 150, by = H * 0.3 + Math.abs(Math.sin(f * 0.05)) * H * 0.18;
      circ(bx, by, 5, '#ffffff'); glowAt(bx, by, 16, 'rgba(255,255,255,0.8)', 0.6);
      if ((G.frame >> 5) & 1) ctx.drawImage(s.coin.c, 0, H * 0.46, GW, 30);
    },
  },
};

const SCENE_PARTICLES = {
  souls: ['rgba(255,130,40,0.45)', 'rgba(255,170,70,0.6)', 'rgba(255,215,130,0.75)'],
  gravity: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.18)', 'rgba(255,255,255,0.24)'],
  lumiere: ['rgba(255,170,190,0.55)', 'rgba(255,214,150,0.6)', 'rgba(255,245,235,0.65)'],
  monolith: ['rgba(255,170,190,0.45)', 'rgba(200,60,50,0.55)', 'rgba(60,50,60,0.7)'],
  arcade: ['rgba(125,255,154,0.35)', 'rgba(127,231,255,0.5)', 'rgba(255,90,209,0.6)'],
};

function paintedSun(x, y, r, color) {
  ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, r * 0.14); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(x, y, r, 0.3, Math.PI * 2 + 0.1); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, r * 0.5, 1.4, Math.PI * 2 + 1.0); ctx.stroke();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.2; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2); ctx.lineTo(x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 1.5); ctx.stroke(); }
}
function drawExpeditionFlag(sy) {
  const px = GW / 2 - 110;
  ctx.fillStyle = '#3a3346'; ctx.fillRect(px, sy - 70, 3, 70);
  circ(px + 1.5, sy - 72, 3, '#d9b25a');
  const wave = i => Math.sin(G.frame * 0.1 + i * 0.7) * 2.5;
  ctx.fillStyle = '#f3ead7';
  ctx.beginPath(); ctx.moveTo(px + 3, sy - 68);
  for (let i = 0; i <= 10; i++) ctx.lineTo(px + 3 + i * 5, sy - 68 + wave(i));
  for (let i = 10; i >= 0; i--) ctx.lineTo(px + 3 + i * 5, sy - 38 + wave(i));
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c8322b'; ctx.fillRect(px + 3, sy - 41 + wave(0), 50, 3);
  paintedSun(px + 28, sy - 54 + wave(5), 7, '#d8a43a');
}
function drawPaintPot(sy) {
  const x = GW / 2 + 80;
  ctx.fillStyle = '#8a8f99'; ctx.fillRect(x - 12, sy - 22, 24, 22);
  ctx.fillStyle = '#d8a43a'; ctx.fillRect(x - 13, sy - 24, 26, 5);
  ctx.fillRect(x - 8, sy - 20, 3, 9); ctx.fillRect(x + 4, sy - 20, 3, 13);
  limb(x + 2, sy - 22, x + 20, sy - 52, 3, '#7a5230');
  ctx.fillStyle = '#e8be5a'; ctx.fillRect(x + 18, sy - 58, 6, 8);
  ell(x + 21, sy - 61, 4, 4, '#d8a43a');
}
function drawCabinet(sy) {
  const x = GW / 2 + 84;
  ctx.fillStyle = '#2a1745'; ctx.fillRect(x - 18, sy - 62, 36, 62);
  ctx.fillStyle = '#ffd93d'; ctx.fillRect(x - 18, sy - 62, 36, 9);
  ctx.fillStyle = (G.frame >> 3) & 1 ? '#7fe7ff' : '#5ad1ff'; ctx.fillRect(x - 12, sy - 48, 24, 18);
  ctx.fillStyle = '#ff5ad1'; ctx.fillRect(x - 6 + ((G.frame >> 4) % 6) * 2, sy - 42, 4, 4);
  ctx.fillStyle = '#1a0e2c'; ctx.fillRect(x - 20, sy - 28, 40, 6);
  limb(x - 8, sy - 28, x - 8, sy - 35, 2, '#c9d2e8'); circ(x - 8, sy - 36, 2.6, '#ff6b6b');
  circ(x + 4, sy - 31, 2, '#ffd93d'); circ(x + 10, sy - 31, 2, '#6bcb77');
}
function drawPod(sy) {
  const x = GW / 2 + 90;
  limb(x - 18, sy, x - 10, sy - 14, 3, '#8d96a5'); limb(x + 18, sy, x + 10, sy - 14, 3, '#8d96a5');
  circ(x, sy - 30, 22, '#f1f3f6');
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.beginPath(); ctx.arc(x, sy - 30, 22, 0, Math.PI); ctx.fill();
  circ(x + 5, sy - 34, 8, '#2a4a7a'); circ(x + 3, sy - 36, 2.5, 'rgba(255,255,255,0.7)');
  ctx.fillStyle = '#ff8a3d'; ctx.fillRect(x - 22, sy - 31, 9, 3);
}
function drawTwoSwords(sy) {
  const x = GW / 2 + 84;
  ell(x, sy - 1, 14, 3, 'rgba(0,0,0,0.25)');
  ctx.save(); ctx.translate(x, sy - 2); ctx.rotate(0.08);
  ctx.fillStyle = '#d4dbe6'; ctx.fillRect(-2.5, -52, 5, 50);
  ctx.fillStyle = '#6a4a2a'; ctx.fillRect(-9, -55, 18, 3);
  ctx.fillStyle = '#3a2817'; ctx.fillRect(-1.5, -66, 3, 11);
  circ(0, -67, 2.6, '#c9a24a');
  ctx.restore();
  limb(x + 22, sy, x + 22, sy - 30, 2, '#3a2817'); circ(x + 22, sy - 33, 5, '#ffcf6a'); glowAt(x + 22, sy - 33, 22, 'rgba(255,200,100,0.8)', 0.6);
}
const FLOOR_PROPS = { souls: drawBonfire, witcher: drawTwoSwords, gravity: drawPod, lumiere: drawExpeditionFlag, monolith: drawPaintPot, arcade: drawCabinet };

const SOUL_NOTES = ['mind the gap', 'ledge ahead', 'a long way down', 'keep climbing', 'rest here', 'almost there', 'steady now', 'this way up'];
function drawSoulNote(p, sy) {
  const sn = p.n + (p.lane || 0) * 1009;
  if (p.full || hash(sn, 70) > 0.14) return;
  const msg = SOUL_NOTES[(hash(sn, 71) * SOUL_NOTES.length) | 0], cx = (p.x1 + p.x2) / 2;
  ell(cx, sy - 7, 30, 6, 'rgba(255,140,40,0.18)');
  text(T(msg), cx, sy - 8, 9.5, '#ffb35c', { stroke: false, font: BODY, weight: 800 });
}
