'use strict';

// Thirteen more themed tiers. Each one tips its hat to a well-loved world through setting and mood alone:
// every shape, colour scheme, line and tune here is original, and nothing is named, quoted or traced.

function flame(x, y, s, f, i) {
  const k = 0.78 + 0.16 * Math.sin(f * 0.23 + i * 1.7) + 0.08 * Math.sin(f * 0.61 + i);
  glowAt(x, y - 8 * s, 30 * s, 'rgba(255,150,60,0.9)', 0.55 * k);
  tri(x - 6 * s, y, x + 6 * s, y, x + Math.sin(f * 0.15 + i) * 2 * s, y - 19 * s * k, '#ff6a1a');
  tri(x - 3.6 * s, y, x + 3.6 * s, y, x + Math.sin(f * 0.21 + i) * 1.5 * s, y - 12 * s * k, '#ffc23d');
  tri(x - 1.8 * s, y, x + 1.8 * s, y, x, y - 6 * s * k, '#fff3c0');
}
function stillFlame(x, y, s) {
  glow(x, y - 8 * s, 34 * s, 'rgba(255,160,70,0.55)');
  tri(x - 6 * s, y, x + 6 * s, y, x + s, y - 18 * s, '#ff6a1a');
  tri(x - 3.5 * s, y, x + 3.5 * s, y, x, y - 11 * s, '#ffc23d');
}
function pine(x, base, ht, col, snow) {
  box(x - ht * 0.03, base - ht * 0.2, ht * 0.06, ht * 0.2, col);
  for (let k = 0; k < 4; k++) {
    const y = base - ht * 0.15 - k * ht * 0.2, hw = ht * (0.3 - k * 0.06);
    tri(x - hw, y, x + hw, y, x, y - ht * 0.36, col);
    if (snow) tri(x - hw * 0.45, y - ht * 0.2, x + hw * 0.45, y - ht * 0.2, x, y - ht * 0.36, snow);
  }
}
function dome(x, base, r, fill, shade) {
  ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, base, r, Math.PI, 0); ctx.fill();
  if (shade) { ctx.fillStyle = shade; ctx.beginPath(); ctx.arc(x, base, r, -Math.PI / 2, 0); ctx.lineTo(x, base); ctx.fill(); }
}
function sparkle(x, y, r, a, color = '#fff6d0') {
  alpha(a);
  tri(x - r * 0.25, y, x + r * 0.25, y, x, y - r, color); tri(x - r * 0.25, y, x + r * 0.25, y, x, y + r, color);
  tri(x, y - r * 0.25, x, y + r * 0.25, x - r, y, color); tri(x, y - r * 0.25, x, y + r * 0.25, x + r, y, color);
  alpha(1);
}
function lolly(x, y, r, c1, c2) {
  circ(x, y, r, c1);
  ctx.strokeStyle = c2; ctx.lineWidth = r * 0.28; ctx.beginPath();
  for (let a = 0; a < Math.PI * 6; a += 0.3) { const rr2 = r * a / (Math.PI * 6) * 0.9; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); }
  ctx.stroke();
}
function caneStripes(x, y0, y1, w) {
  box(x - w / 2, y0, w, y1 - y0, '#fff4f4');
  ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y0, w, y1 - y0); ctx.clip();
  ctx.strokeStyle = '#e83a5a'; ctx.lineWidth = w * 0.45;
  ctx.beginPath(); for (let y = y0 - w; y < y1 + w; y += w * 1.4) { ctx.moveTo(x - w, y + w); ctx.lineTo(x + w, y - w); } ctx.stroke();
  ctx.restore();
}
function hazardBand(x, y, w, h) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  box(x, y, w, h, '#e8b830');
  ctx.fillStyle = '#1e1a14';
  for (let bx = x - h; bx < x + w + h; bx += h * 2) { ctx.beginPath(); ctx.moveTo(bx, y + h); ctx.lineTo(bx + h, y); ctx.lineTo(bx + h * 1.9, y); ctx.lineTo(bx + h * 0.9, y + h); ctx.fill(); }
  ctx.restore();
}
function trefoil(x, y, r) {
  circ(x, y, r, '#e8b830');
  ctx.fillStyle = '#1e1a14';
  for (let k = 0; k < 3; k++) {
    const a = -Math.PI / 2 + k * Math.PI * 2 / 3;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r * 0.82, a - 0.52, a + 0.52); ctx.closePath(); ctx.fill();
  }
  circ(x, y, r * 0.26, '#e8b830'); circ(x, y, r * 0.15, '#1e1a14');
}
function pot(x, base, s, col, cracked) {
  ell(x, base - 1, 13 * s, 3 * s, 'rgba(0,0,0,0.3)');
  ell(x, base - 12 * s, 12 * s, 12 * s, col);
  box(x - 6 * s, base - 28 * s, 12 * s, 8 * s, col);
  ell(x, base - 28 * s, 8 * s, 2.6 * s, '#3a2214');
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.ellipse(x - 5 * s, base - 15 * s, 3 * s, 6 * s, -0.3, 0, Math.PI * 2); ctx.fill();
  box(x - 11 * s, base - 13 * s, 22 * s, 1.6 * s, 'rgba(60,30,20,0.4)');
  if (cracked) { ctx.strokeStyle = 'rgba(40,20,10,0.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 3 * s, base - 22 * s); ctx.lineTo(x + 6 * s, base - 15 * s); ctx.lineTo(x + 3 * s, base - 9 * s); ctx.stroke(); }
}
function zigzag(x, y, w, amp, step, color, lw = 1.2) {
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x, y);
  for (let k = 1; k * step <= w; k++) ctx.lineTo(x + k * step, y + (k % 2 ? -amp : amp) / 2);
  ctx.stroke();
}
function tinyShip(x, y, dir, s, body, engine) {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  glowAt(-14, 0, 12, engine, 0.8);
  poly([-12, -3, 10, -1, 14, 0, 10, 1, -12, 4], body);
  poly([-6, -3, 2, -8, 6, -2], body);
  box(-1, -2, 6, 2, 'rgba(160,220,255,0.8)');
  ctx.restore();
}

// beacon chain: [x, peak y, size], farthest first
const BEACONS = [[0.88, 0.35, 0.45], [0.72, 0.41, 0.6], [0.52, 0.47, 0.78], [0.3, 0.53, 0.98], [0.1, 0.6, 1.2]];
const WALL_GEO = h => ({ top: h * 0.2, base: h * 0.7, sx: GW * 0.64 });
const RING_GEO = h => ({ cx: GW * 0.5, cy: h * 0.98, rx: GW * 0.78, ry: h * 0.86 });
const FUT_TUBES = [[0.05, 0.5, 0.3, 0.28, 0.55, 0.42], [0.45, 0.62, 0.7, 0.38, 0.97, 0.48], [0.2, 0.7, 0.5, 0.82, 0.8, 0.66]];
const HOARD_BODY = h => [GW / 2 + 50, h * 0.77];
const HOARD_EYE = h => [GW / 2 - 125, h * 0.7];
const COCOA_FALLS = h => ({ fx: Math.min(GW * 0.36, 190), ft: h * 0.42, fb: h * 0.77 });
const COCOA_PIPES = [[0.6, 0.14], [0.72, 0.2], [0.84, 0.26]];

Object.assign(SCENES, {
  beacons: {
    far(h) {
      skyFill(h, ['#0b1230', '#26285a', '#6a4170', '#d9825c', '#f2b27a']);
      for (let i = 0; i < 50; i++) box(SR(i, 600) * GW, SR(i, 601) * h * 0.3, 1.5, 1.5, `rgba(255,245,235,${0.2 + SR(i, 602) * 0.6})`);
      glow(GW * 0.55, h * 0.58, GW * 0.6, 'rgba(255,170,110,0.28)');
      jag(h, h * 0.5, 110, '#4e4676', 21, true);
      const cols = [['#5a5282', '#433c6c'], ['#4a4474', '#36305e'], ['#3a3664', '#28244e'], ['#2a2850', '#1c1a3c'], ['#1c1c3c', '#12122c']];
      BEACONS.forEach(([fx, fy, s], i) => {
        const x = GW * fx, top = h * fy, w = 130 * s + 50, [lit, dark] = cols[i];
        poly([x - w, h, x - w * 0.6, top + w * 0.5, x - w * 0.22, top + w * 0.16, x, top, x + w * 0.3, top + w * 0.24, x + w * 0.72, top + w * 0.6, x + w, h], lit);
        poly([x, top, x + w * 0.3, top + w * 0.24, x + w * 0.72, top + w * 0.6, x + w, h, x + w * 0.08, h], dark);
        poly([x - w * 0.22, top + w * 0.16, x, top, x + w * 0.3, top + w * 0.24, x + w * 0.16, top + w * 0.3, x + w * 0.04, top + w * 0.2, x - w * 0.1, top + w * 0.3], 'rgba(236,240,255,0.85)');
        box(x - 6 * s, top - 5 * s, 12 * s, 5 * s, '#2a2230');
        limb(x - 6 * s, top - 4 * s, x + 6 * s, top - 10 * s, 2 * s, '#3a2a1c'); limb(x + 6 * s, top - 4 * s, x - 6 * s, top - 10 * s, 2 * s, '#3a2a1c');
      });
      ridge(h, h * 0.86, 14, '#0e0f24', 3); box(0, h * 0.93, GW, h, '#0a0b1c');
      for (let i = 0; i < 9; i++) pine(SR(i, 603) * GW, h * 0.9 + SR(i, 604) * 20, 50 + SR(i, 605) * 30, '#080916', 'rgba(220,230,255,0.5)');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        ctx.fillStyle = '#23223e'; ctx.beginPath(); ctx.moveTo(x0, 0);
        for (let y = 0; y <= T; y += 40) ctx.lineTo(x0 + dir * (12 + SR(y + side * 91, 606) * 26), y);
        ctx.lineTo(x0, T); ctx.closePath(); ctx.fill();
        for (let y = 20; y < T; y += 80) ell(x0 + dir * 14, y + SR(y, 607) * 20, 14, 4, 'rgba(236,240,255,0.7)');
        for (let i = 0; i < 3; i++) pine(x0 + dir * (34 + SR(i + side * 5, 608) * 18), 150 + i * 200 + side * 60, 60 + SR(i, 609) * 24, '#141a2c', 'rgba(230,238,255,0.75)');
        const cy = T * (side ? 0.3 : 0.72), cx = x0 + dir * 48;
        for (let k = 0; k < 3; k++) ell(cx, cy - k * 9, 15 - k * 3, 6, k % 2 ? '#4a4660' : '#56526c');
        box(cx - 10, cy - 32, 20, 6, '#2a2026');
        stillFlame(cx, cy - 32, 1);
      }
    },
    live() {
      const f = G.frame, p = f % 960;
      BEACONS.forEach(([fx, fy, s], i) => {
        const x = GW * fx, y = H * fy - 9 * s, order = BEACONS.length - 1 - i;
        const on = p > 60 + order * 90 && p < 900;
        if (on) { glowAt(x, y - 10 * s, 60 * s, 'rgba(255,140,60,0.9)', 0.35); flame(x, y, s * 1.5, f, i); }
        else glowAt(x, y, 12 * s, 'rgba(255,120,50,0.8)', 0.3);
      });
    },
  },

  icewall: {
    far(h) {
      skyFill(h, ['#02050d', '#081428', '#12304e', '#2c5a7c']);
      for (let i = 0; i < 70; i++) box(SR(i, 610) * GW, SR(i, 611) * h * 0.22, 1.5, 1.5, `rgba(230,240,255,${0.25 + SR(i, 612) * 0.6})`);
      const { top, base, sx } = WALL_GEO(h);
      ctx.fillStyle = vgrad(top, base, ['#d4e8f4', '#a2c6dc', '#7298b6', '#4c7090']); ctx.fillRect(0, top, GW, base - top);
      for (let i = 0; i < 36; i++) {
        const x = SR(i, 613) * GW, y = top + SR(i, 614) * 30;
        box(x, y, 1 + SR(i, 615) * 3, (base - y) * (0.3 + SR(i, 616) * 0.6), i % 2 ? 'rgba(255,255,255,0.14)' : 'rgba(30,60,90,0.16)');
      }
      for (let k = 0; k < 6; k++) box(0, top + (base - top) * (0.12 + k * 0.15), GW, 2, 'rgba(255,255,255,0.09)');
      ctx.fillStyle = '#f2faff'; ctx.beginPath(); ctx.moveTo(0, top + 6);
      for (let x = 0; x <= GW + 16; x += 16) ctx.lineTo(x, top - 3 + SR(x, 617) * 6);
      ctx.lineTo(GW, top + 6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(46,32,22,0.85)'; ctx.lineWidth = 2; ctx.beginPath();
      for (let k = 0, y = base - 8; y > top + 10; k++, y -= 30) ctx.lineTo(sx + (k % 2 ? 44 : -44), y);
      ctx.stroke();
      const kx = sx;
      box(kx - 80, base - 30, 160, 60, '#0c1420'); box(kx - 96, base - 70, 30, 100, '#0c1420'); box(kx + 60, base - 54, 26, 84, '#0c1420');
      for (let i = 0; i < 6; i++) box(kx - 92 + i * 6, base - 76, 4, 6, '#0c1420');
      for (const [wx, wy] of [[-84, -52], [-60, -14], [-20, -14], [24, -14], [68, -36]]) box(kx + wx, base + wy, 4, 6, 'rgba(255,190,90,0.85)');
      for (const [layer, col, y0] of [[0, '#0a1620', 0.74], [1, '#050c14', 0.82]]) {
        for (let i = 0; i < 16; i++) pine(SR(i + layer * 30, 618) * GW, h * y0 + SR(i, 619) * 30 + 40, 70 + SR(i + layer, 620) * 50, col, 'rgba(220,235,255,0.35)');
      }
      box(0, h * 0.92, GW, h, '#040a10');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, px = x0 + dir * 10;
        box(px - 5, 0, 10, T, '#2e2218'); box(px - 5, 0, 3, T, 'rgba(255,255,255,0.08)');
        for (let y = 60; y < T; y += 160) {
          limb(px, y, px + dir * 46, y + 70, 5, '#3a2a1c');
          box(side ? px - 54 : px, y + 70, 54, 7, '#4a3624'); box(side ? px - 54 : px, y + 70, 54, 2, 'rgba(240,250,255,0.75)');
          for (let k = 0; k < 4; k++) tri(px + dir * (8 + k * 12), y + 77, px + dir * (14 + k * 12), y + 77, px + dir * (11 + k * 12), y + 86 + (k % 2) * 6, 'rgba(210,235,255,0.85)');
        }
        const ty = T * (side ? 0.42 : 0.86), tx = px + dir * 26;
        limb(tx, ty, tx, ty - 16, 2.6, '#3a2a1c'); stillFlame(tx, ty - 16, 0.9);
      }
    },
    live() {
      const f = G.frame, { top, base, sx } = WALL_GEO(H);
      for (let k = 0, y = base - 8; y > top + 10; k++, y -= 30) glowAt(sx + (k % 2 ? 44 : -44), y - 2, 7, 'rgba(255,170,80,0.9)', 0.5 + 0.3 * Math.sin(f * 0.2 + k));
      const lx = GW * 0.24, span = base - top - 20, cy = top + 14 + (0.5 - 0.5 * Math.cos(f * 0.004)) * span;
      limb(lx, top, lx, cy, 1, 'rgba(40,30,20,0.8)');
      box(lx - 6, cy, 12, 9, '#2a1e14'); box(lx - 4, cy + 2, 8, 4, 'rgba(255,190,90,0.7)');
      const p = f % 1300;
      if (p < 500) {
        const x = -20 + p * 1.2, y = H * 0.12 + Math.sin(p * 0.03) * 10, fl = Math.sin(p * 0.3) * 5;
        ctx.strokeStyle = 'rgba(4,8,14,0.95)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x - 10, y - fl); ctx.quadraticCurveTo(x - 4, y - fl - 3, x, y); ctx.quadraticCurveTo(x + 4, y - fl - 3, x + 10, y - fl); ctx.stroke();
      }
    },
  },

  shelter: {
    far(h) {
      skyFill(h, ['#2a281a', '#58562a', '#968c48', '#cdbb7a']);
      glow(GW * 0.72, h * 0.28, 170, 'rgba(255,240,170,0.35)'); circ(GW * 0.72, h * 0.28, 28, 'rgba(255,246,210,0.85)');
      const sky = h * 0.62;
      for (let i = 0; i < 14; i++) {
        const x = i * GW / 12 - 20 + SR(i, 620) * 14, w = 26 + SR(i, 621) * 30, ht = 60 + SR(i, 622) * 150;
        poly([x, sky, x, sky - ht, x + w * 0.3, sky - ht + 14 * SR(i, 623), x + w * 0.55, sky - ht - 10, x + w * 0.8, sky - ht + 20, x + w, sky - ht + 6, x + w, sky], '#3a3826');
        for (let k = 0; k < ht / 22 - 1; k++) for (let j = 0; j < 2; j++) if (SR(i * 20 + k * 2 + j, 624) > 0.35) box(x + 5 + j * (w - 14) / 1.4, sky - ht + 16 + k * 22, 5, 9, '#24231a');
      }
      const nx = GW * 0.2;
      poly([nx - 5, sky, nx - 2, sky - 220, nx + 2, sky - 220, nx + 5, sky], '#3a3826');
      ell(nx, sky - 222, 30, 8, '#3a3826'); ell(nx, sky - 228, 16, 8, '#3a3826'); limb(nx, sky - 234, nx, sky - 262, 2, '#3a3826');
      const wx = GW * 0.86;
      for (const d of [-14, 14]) limb(wx + d, sky, wx + d * 0.6, sky - 80, 2.4, '#4a4428');
      ell(wx, sky - 92, 24, 18, '#4a4428'); box(wx - 24, sky - 92, 48, 14, '#4a4428'); tri(wx - 26, sky - 100, wx + 26, sky - 100, wx, sky - 118, '#4a4428');
      ridge(h, h * 0.66, 8, '#6a5a36', 2); ridge(h, h * 0.76, 16, '#54462a', 4);
      const bx = GW * 0.24, by = h * 0.62;
      box(bx - 4, by, 4, 70, '#3a3020'); box(bx + 100, by, 4, 70, '#3a3020');
      box(bx - 10, by - 50, 124, 56, '#b8a878'); box(bx - 10, by - 50, 124, 4, '#8a7a50');
      ctx.strokeStyle = '#5a6a7a'; ctx.lineWidth = 2;
      for (const a of [0, 1.05, 2.1]) { ctx.beginPath(); ctx.ellipse(bx + 52, by - 22, 24, 9, a, 0, Math.PI * 2); ctx.stroke(); }
      circ(bx + 52, by - 22, 4, '#c84a3a');
      const mx = GW * 0.62, my = h * 0.86;
      ell(mx, my + 20, 170, 110, '#3e3422');
      circ(mx, my, 62, '#5c5a52'); circ(mx, my, 54, '#8a887c'); circ(mx, my, 50, '#7a786c');
      for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; circ(mx + Math.cos(a) * 58, my + Math.sin(a) * 58, 2.4, '#3a3a34'); }
      circ(mx, my, 16, '#5c5a52'); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4; limb(mx + Math.cos(a) * 16, my + Math.sin(a) * 16, mx + Math.cos(a) * 44, my + Math.sin(a) * 44, 4, '#6a685e'); }
      hazardBand(mx - 80, my - 74, 160, 8);
      const cx = GW * 0.16, cy = h * 0.88;
      ctx.fillStyle = '#5a3a2a'; ctx.beginPath(); ctx.moveTo(cx - 44, cy); ctx.quadraticCurveTo(cx - 44, cy - 16, cx - 24, cy - 18); ctx.quadraticCurveTo(cx - 8, cy - 34, cx + 16, cy - 30);
      ctx.quadraticCurveTo(cx + 30, cy - 18, cx + 46, cy - 14); ctx.lineTo(cx + 54, cy - 26); ctx.lineTo(cx + 50, cy); ctx.closePath(); ctx.fill();
      box(cx - 14, cy - 26, 22, 8, 'rgba(30,24,16,0.8)'); circ(cx - 26, cy, 8, '#1e1a14'); circ(cx + 30, cy, 8, '#1e1a14');
      box(0, h * 0.95, GW, h, '#2e2618');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, w = 40, px = side ? x0 - w : x0;
        for (let y = 0, i = 0; y < T; y += 90, i++) {
          const c = ['#6a4a30', '#5a4030', '#7a5636'][i % 3];
          box(px, y, w, 92, c);
          for (let k = 4; k < w; k += 6) box(px + k, y, 2, 92, 'rgba(0,0,0,0.18)');
          box(px, y + 88, w, 3, 'rgba(0,0,0,0.3)');
          for (let k = 0; k < 4; k++) circ(px + 6 + SR(i * 4 + k + side * 50, 625) * (w - 12), y + 10 + SR(i, 626 + k) * 70, 4 + SR(k, 627) * 5, 'rgba(150,80,30,0.35)');
        }
        const sy = T * (side ? 0.5 : 0.18);
        box(px + 4, sy, w - 8, w - 8, '#2a2418'); trefoil(px + w / 2, sy + (w - 8) / 2, (w - 14) / 2);
        hazardBand(px, T * (side ? 0.8 : 0.62), w, 10);
        limb(x0 + dir * w, T * 0.34, x0 + dir * (w + 20), T * 0.4, 2, '#2a2a2a'); limb(x0 + dir * (w + 20), T * 0.4, x0 + dir * (w + 12), T * 0.5, 2, '#2a2a2a');
      }
    },
    live() {
      const f = G.frame, p = f % 1100;
      if (p < 700) {
        const x = -40 + p * 0.8, y = H * 0.93 - Math.abs(Math.sin(p * 0.06)) * 18;
        ctx.save(); ctx.translate(x, y); ctx.rotate(p * 0.08);
        ctx.strokeStyle = 'rgba(110,84,46,0.85)'; ctx.lineWidth = 1.4;
        for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.ellipse(0, 0, 14, 9, k * 0.45, 0, Math.PI * 2); ctx.stroke(); }
        ctx.restore();
      }
      const on = Math.sin(f * 0.9) > -0.6 || f % 97 > 12;
      if (on) glowAt(GW * 0.24 + 52, H * 0.62 - 22, 40, 'rgba(255,230,140,0.8)', 0.25);
      for (let i = 0; i < 3; i++) {
        const x = ((f * (0.35 + i * 0.12) + i * 260) % (GW + 300)) - 150;
        alpha(0.12); ell(x, H * (0.55 + i * 0.1), 140, 18, '#e8d8a0'); alpha(1);
      }
    },
  },

  cocoa: {
    far(h) {
      skyFill(h, ['#2a1030', '#6a2a5a', '#d8709a', '#ffc4b0']);
      for (const [x, y, s] of [[0.14, 0.14, 26], [0.6, 0.1, 34], [0.9, 0.2, 24]]) cloudPuff(GW * x, h * y, s, 'rgba(255,200,225,0.75)');
      ridge(h, h * 0.5, 22, '#9a5ab8', 1); ridge(h, h * 0.58, 26, '#f08ab8', 2.6); ridge(h, h * 0.66, 18, '#7ad8b0', 4.2);
      const { fx, ft, fb } = COCOA_FALLS(h), lip = fx + 50;
      poly([-10, fb, -10, ft - 4, lip * 0.26, ft - 26, lip * 0.56, ft - 16, lip, ft + 2, lip + 6, fb], '#3a1c0c');
      for (let k = 1; k < 5; k++) box(0, ft + k * (fb - ft) / 5, lip, 2, 'rgba(255,190,140,0.08)');
      poly([-10, ft - 4, lip * 0.26, ft - 26, lip * 0.56, ft - 16, lip, ft + 2, lip - 6, ft + 10, lip * 0.56, ft - 6, lip * 0.26, ft - 15, -10, ft + 6], '#7ad8b0');
      ctx.fillStyle = vgrad(ft, fb, ['#9a5a2a', '#6a3618', '#5a2e14']); ctx.fillRect(fx - 26, ft - 6, 52, fb - ft + 6);
      ell(fx, ft - 6, 27, 5, '#a8683a');
      for (let k = 0; k < 6; k++) box(fx - 22 + k * 9, ft - 2, 2, fb - ft, 'rgba(255,210,170,0.14)');
      for (let k = 0; k < 7; k++) circ(fx - 36 + k * 12, fb - 4 - (k % 2) * 5, 10 + (k % 3) * 3, 'rgba(255,232,214,0.3)');
      ctx.fillStyle = '#5a2e14'; ctx.beginPath(); ctx.moveTo(0, h * 0.78);
      for (let x = 0; x <= GW + 10; x += 10) ctx.lineTo(x, h * 0.76 + Math.sin(x * 0.02) * 6);
      for (let x = GW; x >= 0; x -= 10) ctx.lineTo(x, h * 0.86 + Math.sin(x * 0.017 + 1) * 6);
      ctx.closePath(); ctx.fill();
      for (let i = 0; i < 18; i++) ell(SR(i, 630) * GW, h * (0.79 + SR(i, 631) * 0.05), 10 + SR(i, 632) * 14, 1.5, 'rgba(200,130,80,0.5)');
      COCOA_PIPES.forEach(([px, py]) => {
        const x = GW * px, top = h * py, path = () => { ctx.beginPath(); ctx.moveTo(x, h * 0.78); ctx.lineTo(x, top + 30); ctx.quadraticCurveTo(x, top, x + 30, top); ctx.lineTo(GW + 20, top); };
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 15; path(); ctx.stroke();
        ctx.strokeStyle = 'rgba(110,56,24,0.6)'; ctx.lineWidth = 7; path(); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 1.6; ctx.save(); ctx.translate(-5, -5); path(); ctx.stroke(); ctx.restore();
        box(x - 10, h * 0.76, 20, 7, '#c8b8d8'); box(x - 10, h * 0.76, 20, 2, '#e8dcf0');
      });
      for (const [x, y, r, c1, c2] of [[0.08, 0.6, 18, '#ff8ab8', '#fff0f6'], [0.47, 0.64, 14, '#ffd84a', '#ff7a3a'], [0.93, 0.6, 20, '#7ad8ff', '#ffffff']]) {
        limb(GW * x, h * y, GW * x, h * 0.78, 3, '#fff4f4'); lolly(GW * x, h * y, r, c1, c2);
      }
      for (let i = 0; i < 10; i++) { const x = SR(i, 634) * GW, y = h * (0.88 + SR(i, 635) * 0.06); dome(x, y, 8 + SR(i, 636) * 6, ['#ff5a8a', '#5ad8a0', '#ffd84a', '#8a6aff'][i % 4], 'rgba(0,0,0,0.15)'); }
      box(0, h * 0.95, GW, h, '#3a1a22');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        caneStripes(x0 + dir * 9, 0, T, 16);
        for (const [fy, r, c1, c2] of [[T * 0.2, 16, '#ff8ab8', '#ffffff'], [T * 0.55, 13, '#7ad8ff', '#ffffff'], [T * 0.85, 15, '#ffd84a', '#ff7a3a']]) {
          const y = fy + side * 40;
          limb(x0 + dir * 16, y + 10, x0 + dir * 42, y, 3, '#fff4f4'); lolly(x0 + dir * 50, y, r, c1, c2);
        }
        for (let k = 0; k < 3; k++) dome(x0 + dir * (24 + k * 14), T * 0.4 + k * 3 + side * 120, 7, ['#ff5a8a', '#5ad8a0', '#8a6aff'][k], 'rgba(0,0,0,0.15)');
      }
    },
    live() {
      const f = G.frame, { fx, ft, fb } = COCOA_FALLS(H);
      for (let k = 0; k < 5; k++) {
        const y = ft + ((f * 2.2 + k * 50) % (fb - ft - 14));
        box(fx - 22 + k * 11, y, 2.4, 14, 'rgba(255,220,180,0.35)');
      }
      COCOA_PIPES.forEach(([px, py], i) => {
        const span = H * (0.78 - py) - 30;
        for (let k = 0; k < 3; k++) circ(GW * px + Math.sin(f * 0.05 + k) * 1.5, H * 0.76 - ((f * (0.8 + i * 0.2) + k * 130 + i * 60) % span), 2.4, 'rgba(170,100,60,0.85)');
      });
    },
  },

  skyisle: {
    far(h) {
      skyFill(h, ['#2a62c8', '#4f92e6', '#9fd0f6', '#e4f4ff']);
      glow(GW * 0.18, h * 0.12, 150, 'rgba(255,255,230,0.55)');
      for (const [x, y, s] of [[0.06, 0.34, 44], [0.95, 0.28, 52], [0.86, 0.52, 34]]) { cloudPuff(GW * x, h * y, s, '#ffffff'); cloudPuff(GW * x + s * 0.2, h * y + s * 0.35, s * 0.8, '#dceaf8'); }
      const isle = (cx, cy, w, deep, tree) => {
        poly([cx - w, cy, cx - w * 0.7, cy + deep * 0.35, cx - w * 0.3, cy + deep * 0.7, cx + w * 0.05, cy + deep, cx + w * 0.4, cy + deep * 0.6, cx + w * 0.8, cy + deep * 0.3, cx + w, cy], '#8a7660');
        poly([cx + w * 0.05, cy + deep, cx + w * 0.4, cy + deep * 0.6, cx + w * 0.8, cy + deep * 0.3, cx + w, cy, cx + w * 0.2, cy], '#6a5a4a');
        for (let k = 0; k < w / 8; k++) {
          const rx = cx - w * 0.7 + SR(k + w, 640) * w * 1.4, ry = cy + deep * (0.3 + SR(k, 641) * 0.4);
          ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(rx, ry);
          ctx.quadraticCurveTo(rx + 6, ry + 30, rx - 2, ry + 30 + SR(k, 642) * deep * 0.8); ctx.stroke();
        }
        ell(cx, cy, w, w * 0.12, '#4fa04a'); ell(cx, cy - 3, w * 0.94, w * 0.08, '#6ac05a');
        if (!tree) return;
        for (const [dx, tw, th] of [[-0.55, 0.18, 0.7], [0.4, 0.22, 0.9], [-0.15, 0.16, 0.5]]) {
          const x = cx + dx * w, ww = tw * w, top = cy - th * w;
          box(x - ww / 2, top, ww, cy - top, '#cfc6b4'); box(x + ww * 0.15, top, ww * 0.35, cy - top, '#b2a894');
          for (let y = top + 12; y < cy - 14; y += 22) { ctx.fillStyle = '#3a3a48'; ctx.beginPath(); ctx.moveTo(x - 3, y + 10); ctx.lineTo(x - 3, y + 3); ctx.arc(x, y + 3, 3, Math.PI, 0); ctx.lineTo(x + 3, y + 10); ctx.fill(); }
          box(x - ww / 2 - 2, top - 3, ww + 4, 4, '#b2a894');
        }
        box(cx - 9, cy - w * 0.8, 18, w * 0.8, '#6a4a2e');
        limb(cx, cy - w * 0.6, cx - w * 0.4, cy - w * 0.9, 6, '#6a4a2e'); limb(cx, cy - w * 0.66, cx + w * 0.45, cy - w * 0.95, 6, '#6a4a2e');
        for (let k = 0; k < 16; k++) {
          const a = k / 16 * Math.PI, r = w * (0.5 + SR(k, 643) * 0.3);
          circ(cx + Math.cos(a) * r * 1.1, cy - w * 0.9 - Math.sin(a) * r * 0.5, w * (0.16 + SR(k, 644) * 0.08), k % 3 ? '#3e8a3e' : '#4f9a48');
        }
        for (let k = 0; k < 12; k++) circ(cx + (SR(k, 645) - 0.5) * w * 1.3, cy - w * (0.95 + SR(k, 646) * 0.4), w * 0.14, '#5fb052');
      };
      isle(GW * 0.82, h * 0.18, 34, 60, false);
      isle(GW * 0.14, h * 0.6, 26, 46, false);
      isle(GW * 0.56, h * 0.48, 130, 190, true);
      for (let i = 0; i < 14; i++) cloudPuff(i * GW / 12 - 10, h * (0.9 + SR(i, 647) * 0.04), 34 + SR(i, 648) * 14, i % 2 ? '#ffffff' : '#eef6ff');
      box(0, h * 0.95, GW, h, '#ffffff');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        for (let v = 0; v < 4; v++) {
          let x = x0 + dir * (6 + v * 9), y = 0;
          ctx.strokeStyle = v % 2 ? '#3a6a32' : '#4a7a3a'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x, y);
          for (; y < T; y += 20) { x = x0 + dir * (6 + v * 9 + Math.sin(y * 0.03 + v + side) * 6); ctx.lineTo(x, y); }
          ctx.stroke();
          for (let y2 = 20 + v * 13; y2 < T; y2 += 46) {
            const lx = x0 + dir * (6 + v * 9 + Math.sin(y2 * 0.03 + v + side) * 6);
            ell(lx + dir * 5, y2, 6, 3, '#5fb052');
            if (SR(y2 + v * 7 + side, 649) > 0.7) { circ(lx - dir * 3, y2 + 6, 2.4, '#ffffff'); circ(lx - dir * 3, y2 + 6, 1, '#ffd84a'); }
          }
        }
        for (const cy of [T * 0.3, T * 0.78]) {
          const y = cy + side * 50;
          poly([x0, y - 20, x0 + dir * 40, y - 14, x0 + dir * 48, y + 8, x0 + dir * 30, y + 22, x0, y + 20], '#9a8670');
          ell(x0 + dir * 22, y - 18, 26, 6, '#5fb052');
        }
      }
    },
    live() {
      const f = G.frame;
      [[0, 0.22, 0.2, 0.85], [1, 0.36, 0.28, 0.7], [2, 0.7, 0.16, 0.8]].forEach(([i, ky, sp, a]) => puffCloud(((f * sp + i * 220) % (GW + 260)) - 120, H * ky, 16, a));
      const p = f % 1400;
      if (p < 560) {
        const x = GW + 40 - p * 1.0, y = H * 0.3 + Math.sin(p * 0.015) * 24;
        poly([x - 30, y + 2, x, y - 3, x + 30, y + 2, x, y + 1], '#f4f0e6'); box(x - 3, y - 1, 6, 6, '#6a4a2e');
      }
      for (let k = 0; k < 4; k++) {
        const x = ((f * 0.7 + k * 26) % (GW + 120)) - 60, y = H * 0.16 + (k % 2) * 10 + Math.sin(f * 0.04 + k) * 3, fl = Math.sin(f * 0.25 + k) * 3;
        ctx.strokeStyle = 'rgba(40,50,70,0.7)'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(x - 6, y - fl); ctx.quadraticCurveTo(x - 2, y - fl - 3, x, y); ctx.quadraticCurveTo(x + 2, y - fl - 3, x + 6, y - fl); ctx.stroke();
      }
    },
  },

  colony: {
    far(h) {
      skyFill(h, ['#2a1440', '#7a3a5a', '#e0764e', '#ffc07a']);
      const gx = GW * 0.86, gy = h * 0.1, gr = 120;
      ctx.save(); ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.clip();
      box(gx - gr, gy - gr, gr * 2, gr * 2, '#e8a070');
      for (let k = 0; k < 7; k++) ell(gx, gy - gr + k * 34 + 10, gr * 1.2, 7 + (k % 3) * 3, k % 2 ? 'rgba(160,80,60,0.35)' : 'rgba(255,220,180,0.3)');
      ctx.restore();
      circ(GW * 0.12, h * 0.16, 12, 'rgba(255,230,210,0.8)');
      const cx = GW * 0.4, cy = h * 0.38;
      poly([cx - 9, cy + 22, cx + 9, cy + 22, cx + 3, h * 0.78, cx - 3, h * 0.78], '#5a4050');
      box(cx - 1, cy + 22, 2, h * 0.5, 'rgba(255,220,180,0.4)');
      ell(cx, cy + 16, 110, 18, '#7a5a64'); ell(cx, cy + 10, 120, 20, '#ece2da'); ell(cx, cy + 6, 116, 14, '#f8f0ea');
      for (let i = 0; i < 9; i++) {
        const x = cx - 90 + i * 22 + SR(i, 650) * 6, th = 24 + SR(i, 651) * 60, w = 10 + SR(i, 652) * 8;
        box(x - w / 2, cy + 6 - th, w, th, i % 2 ? '#f4ece4' : '#e2d6cc'); dome(x, cy + 6 - th, w / 2, '#f8f0ea');
        for (let y = cy + 2 - th + 8; y < cy; y += 8) box(x - 2, y, 4, 3, 'rgba(255,170,90,0.85)');
      }
      for (let k = 0; k < 18; k++) box(cx - 100 + k * 11, cy + 14, 5, 2.5, 'rgba(255,180,100,0.9)');
      const sx = GW * 0.8, sy = h * 0.55;
      limb(sx, sy + 6, sx, h * 0.8, 3, '#5a4050'); ell(sx, sy + 4, 34, 7, '#e2d6cc'); dome(sx, sy + 2, 12, '#f4ece4');
      for (const [y0, col, amp] of [[0.6, '#f0a070', 12], [0.68, '#e08a64', 16], [0.76, '#c06a54', 18], [0.86, '#9a5048', 14]]) {
        for (let i = 0; i < 16; i++) ell(i * GW / 14 + SR(i + y0 * 10, 653) * 20 - 20, h * y0 + Math.sin(i * 1.3 + y0 * 20) * amp, 48 + SR(i, 654) * 20, 22, col);
        box(0, h * y0 + 10, GW, h, col);
        for (let i = 0; i < 10; i++) ell(i * GW / 9 + 10, h * y0 - 8 + Math.sin(i * 1.7) * amp, 30, 4, 'rgba(255,230,190,0.25)');
      }
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, w = 38, px = side ? x0 - w : x0;
        ctx.fillStyle = '#e6dcd2'; rr(px, 0, w, T, 0); ctx.fill();
        box(side ? px : px + w - 6, 0, 6, T, '#c8b8ae');
        for (let y = 0; y < T; y += 128) {
          box(px, y, w, 3, '#b8a69c');
          circ(px + w / 2, y + 50, 11, '#7a5a64'); circ(px + w / 2, y + 50, 8, '#ffb070'); circ(px + w / 2 - 3, y + 47, 3, 'rgba(255,240,220,0.8)');
          box(px + 6, y + 82, w - 12, 3, '#ff9a5a'); box(px + 6, y + 92, w - 12, 2, 'rgba(255,154,90,0.5)');
        }
        limb(x0 + dir * w, T * (side ? 0.24 : 0.66), x0 + dir * (w + 22), T * (side ? 0.24 : 0.66), 3, '#c8b8ae');
        circ(x0 + dir * (w + 24), T * (side ? 0.24 : 0.66), 4, '#e6dcd2');
      }
    },
    live() {
      const f = G.frame;
      [[0, 0.3, 1.4, 1], [1, 0.5, -1.1, 0.8], [2, 0.22, 0.9, 0.6]].forEach(([i, ky, sp, s]) => {
        const span = GW + 200, p = (f * Math.abs(sp) + i * 330) % span, x = sp > 0 ? p - 100 : GW + 100 - p;
        tinyShip(x, H * ky + Math.sin(f * 0.03 + i) * 4, Math.sign(sp), s, '#efe6de', 'rgba(255,170,90,0.9)');
      });
      for (let i = 0; i < 3; i++) {
        const x = ((f * (0.25 + i * 0.1) + i * 200) % (GW + 300)) - 150;
        alpha(0.4); ell(x, H * (0.64 + i * 0.08), 80, 12, '#ffd2a8'); alpha(1);
      }
    },
  },

  hoard: {
    far(h) {
      skyFill(h, ['#070403', '#140c06', '#22140a', '#2e1c0c']);
      for (let i = 0; i < 5; i++) {
        const x = GW * (0.1 + i * 0.2), w = 46, base = h * 0.7;
        box(x - w / 2, 0, w, base, '#1c120a'); box(x - w / 2, 0, 6, base, 'rgba(255,190,90,0.06)');
        box(x - w / 2 - 8, h * 0.08, w + 16, 14, '#24180c'); box(x - w / 2 - 6, base - 16, w + 12, 16, '#24180c');
        for (let y = h * 0.14; y < base - 30; y += 46) poly([x - 10, y, x, y + 14, x + 10, y, x, y + 4], 'rgba(255,190,90,0.06)');
      }
      glow(GW * 0.5, h * 0.86, GW * 0.7, 'rgba(255,180,70,0.26)');
      for (const [x, y, rx, ry, c] of [[0.2, 0.96, 0.4, 0.2, '#8a6218'], [0.78, 0.94, 0.4, 0.22, '#9a6e1c'], [0.5, 0.92, 0.35, 0.16, '#b8862a']]) {
        ell(GW * x, h * y, GW * rx, h * ry, c); ell(GW * x - 10, h * y - h * ry * 0.5, GW * rx * 0.7, h * ry * 0.4, 'rgba(255,220,120,0.18)');
      }
      for (let i = 0; i < 160; i++) {
        const x = SR(i, 660) * GW, y = h * (0.8 + SR(i, 661) * 0.2);
        ell(x, y, 3, 1.4, SR(i, 662) > 0.5 ? '#ffd75a' : '#e0a83a');
      }
      for (let i = 0; i < 8; i++) { const x = SR(i, 663) * GW, y = h * (0.84 + SR(i, 664) * 0.1); box(x - 1, y - 14, 2, 14, '#c8c0b0'); box(x - 5, y - 10, 10, 2, '#8a6a3a'); }
      const [ex, ey] = HOARD_EYE(h), [bx, by] = HOARD_BODY(h), body = '#4a1810', dark = '#2a0a06', rim = 'rgba(255,190,90,0.45)';
      // tail curls round the front of the pile
      ctx.lineCap = 'round'; ctx.strokeStyle = body; ctx.lineWidth = 20;
      ctx.beginPath(); ctx.moveTo(bx + 120, by); ctx.quadraticCurveTo(bx + 180, by + 10, bx + 123, by + 44); ctx.quadraticCurveTo(bx + 65, by + 66, bx + 8, by + 54); ctx.stroke();
      ctx.lineWidth = 3; ctx.strokeStyle = rim; ctx.beginPath(); ctx.moveTo(bx + 120, by - 9); ctx.quadraticCurveTo(bx + 185, by + 1, bx + 132, by + 36); ctx.stroke();
      poly([bx + 8, by + 44, bx - 12, by + 54, bx + 8, by + 64, bx - 2, by + 54], dark);
      // folded wing
      const sx = bx - 30, sy = by - 30;
      poly([sx, sy, bx - 10, by - 132, bx + 44, by - 110, bx + 70, by - 120, bx + 104, by - 84, bx + 130, by - 86, bx + 120, by - 20], '#3a100a');
      ctx.strokeStyle = dark; ctx.lineWidth = 3;
      for (const [tx, ty] of [[bx - 10, by - 132], [bx + 70, by - 120], [bx + 130, by - 86]]) { ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(tx, ty); ctx.stroke(); }
      ctx.lineWidth = 2; ctx.strokeStyle = rim; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(bx - 10, by - 132); ctx.lineTo(bx + 44, by - 110); ctx.stroke();
      // body, scales and spines
      ell(bx, by, 145, 44, body);
      ctx.save(); ctx.beginPath(); ctx.ellipse(bx, by, 145, 44, 0, 0, Math.PI * 2); ctx.clip();
      ctx.strokeStyle = 'rgba(120,40,24,0.55)'; ctx.lineWidth = 1.2;
      for (let r = 0; r < 4; r++) for (let k = 0; k < 14; k++) { ctx.beginPath(); ctx.arc(bx - 140 + k * 22 + (r % 2) * 11, by - 34 + r * 16, 8, 0, Math.PI); ctx.stroke(); }
      ell(bx, by + 30, 140, 22, 'rgba(255,170,70,0.3)');
      ctx.restore();
      ctx.lineWidth = 3; ctx.strokeStyle = rim; ctx.beginPath(); ctx.ellipse(bx, by, 145, 44, 0, Math.PI * 1.08, Math.PI * 1.9); ctx.stroke();
      for (let k = 0; k < 8; k++) { const x = bx - 100 + k * 26, y = by - 42 + Math.abs(k - 3.5) * 2.5; tri(x - 7, y + 2, x + 7, y + 2, x + 3, y - 14, dark); }
      // forelegs resting on the gold
      for (const lx of [bx - 96, bx - 50]) { box(lx - 9, by + 14, 18, 26, body); for (let k = 0; k < 3; k++) tri(lx - 9 + k * 6, by + 40, lx - 4 + k * 6, by + 40, lx - 8 + k * 6, by + 46, '#e8dcc0'); }
      // neck and head, resting on the hoard, facing left
      ctx.strokeStyle = body; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(bx - 120, by - 6); ctx.quadraticCurveTo(bx - 200, by - 30, ex + 36, ey + 4); ctx.stroke();
      ctx.lineWidth = 3; ctx.strokeStyle = rim; ctx.beginPath(); ctx.moveTo(bx - 120, by - 22); ctx.quadraticCurveTo(bx - 200, by - 46, ex + 40, ey - 11); ctx.stroke();
      ctx.lineCap = 'butt';
      poly([ex + 44, ey - 16, ex + 6, ey - 15, ex - 30, ey - 8, ex - 54, ey + 2, ex - 56, ey + 10, ex - 30, ey + 14, ex + 10, ey + 20, ex + 44, ey + 20], body);
      poly([ex - 54, ey + 6, ex - 30, ey + 10, ex + 20, ey + 12, ex + 20, ey + 14, ex - 30, ey + 14, ex - 56, ey + 10], dark);
      poly([ex - 6, ey - 15, ex + 14, ey - 9, ex + 14, ey - 4, ex - 8, ey - 8], dark);
      for (const [hx, len, lift] of [[ex + 26, 46, 22], [ex + 14, 34, 14]]) {
        ctx.fillStyle = '#d8c8a8'; ctx.beginPath(); ctx.moveTo(hx - 6, ey - 12);
        ctx.quadraticCurveTo(hx + len * 0.5, ey - 14 - lift, hx + len, ey - 8 - lift * 0.6); ctx.quadraticCurveTo(hx + len * 0.4, ey - 8 - lift * 0.4, hx + 6, ey - 8); ctx.fill();
      }
      ctx.lineWidth = 2.4; ctx.strokeStyle = rim; ctx.beginPath(); ctx.moveTo(ex - 52, ey + 1); ctx.lineTo(ex - 30, ey - 9); ctx.lineTo(ex + 6, ey - 16); ctx.stroke();
      limb(ex - 6, ey - 2, ex + 8, ey - 1, 2, '#140402');
      ell(ex - 46, ey + 2, 2.6, 1.6, '#140402');
      for (const k of [0, 1, 2]) tri(ex - 44 + k * 9, ey + 10, ex - 39 + k * 9, ey + 10, ex - 42 + k * 9, ey + 15, '#e8dcc0');
      for (let i = 0; i < 60; i++) ell(bx + (SR(i, 667) - 0.5) * 320, by + 30 + SR(i, 668) * 30, 3, 1.4, '#ffd75a');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        for (const cy of [T * 0.26, T * 0.76]) {
          const y = cy + side * 60;
          for (let k = 0; k < 5; k++) ell(x0 + dir * 10, y - k * 7, 34 - k * 5, 9, k % 2 ? '#c8962e' : '#e0ae3e');
          for (let k = 0; k < 7; k++) ell(x0 + dir * (6 + SR(k + y, 670) * 26), y - SR(k, 671) * 30, 3.4, 1.6, '#fff0a0');
        }
        const cy2 = T * (side ? 0.56 : 0.08), cx = x0 + dir * 30;
        box(cx - 16, cy2, 32, 20, '#5a3418'); box(cx - 16, cy2 + 6, 32, 3, '#c8962e'); box(cx - 3, cy2 + 4, 6, 7, '#e0ae3e');
        poly([cx - 16, cy2, cx - 12, cy2 - 16, cx + 18, cy2 - 18, cx + 16, cy2], '#4a2a12');
        for (let k = 0; k < 5; k++) ell(cx - 10 + k * 5, cy2 - 1, 3, 1.6, '#ffd75a');
        const gx = x0 + dir * 44, gy = T * (side ? 0.94 : 0.44);
        poly([gx - 7, gy - 16, gx + 7, gy - 16, gx + 3, gy - 6, gx - 3, gy - 6], '#e0ae3e'); box(gx - 1, gy - 6, 2, 6, '#c8962e'); box(gx - 5, gy, 10, 2, '#c8962e');
        circ(gx, gy - 12, 1.8, '#d8304a');
      }
    },
    live() {
      const f = G.frame, [ex, ey] = HOARD_EYE(H), p = f % 900;
      if (p > 600 && p < 760) {
        const open = Math.min(1, (p - 600) / 20, (760 - p) / 20);
        glowAt(ex, ey, 22, 'rgba(255,200,60,0.9)', 0.6 * open);
        ell(ex, ey, 7, 2.4 * open + 0.2, '#ffd23a'); box(ex - 0.8, ey - 2.4 * open, 1.6, 4.8 * open, '#1a0604');
      }
      for (let k = 0; k < 3; k++) {
        const t = ((f * 0.008) + k / 3) % 1;
        alpha(0.3 * (1 - t)); circ(ex - 44 - t * 20, ey - t * 50, 4 + t * 10, '#8a7a70'); alpha(1);
      }
      for (let i = 0; i < 6; i++) {
        const s = Math.floor(f / 50 + i * 7), k = ((f + i * 25) % 50) / 50;
        sparkle(SR(s, 672) * GW, H * (0.82 + SR(s, 673) * 0.14), 5, Math.sin(k * Math.PI));
      }
    },
  },

  idol: {
    far(h) {
      skyFill(h, ['#120c06', '#1e160c', '#2a1e12', '#34261a']);
      for (let row = 0; row * 34 < h; row++) for (let c = -1; c * 58 < GW + 58; c++) {
        const x = c * 58 + (row % 2) * 29, y = row * 34;
        box(x + 1, y + 1, 56, 32, SR(row * 40 + c, 680) > 0.5 ? '#2e2216' : '#281e14');
        box(x + 1, y + 1, 56, 2, 'rgba(255,220,160,0.05)');
      }
      const fx = GW / 2, fy = h * 0.2;
      box(fx - 70, fy - 50, 140, 110, '#3a2c1c'); box(fx - 70, fy - 50, 140, 6, '#4a3824');
      box(fx - 50, fy - 26, 34, 14, '#1a120a'); box(fx + 16, fy - 26, 34, 14, '#1a120a');
      box(fx - 8, fy - 8, 16, 26, '#2a1e12'); box(fx - 36, fy + 30, 72, 12, '#1a120a');
      for (let k = 0; k < 6; k++) box(fx - 33 + k * 12, fy + 30, 6, 5, '#3a2c1c');
      for (const d of [-1, 1]) { box(fx + d * 84 - 8, fy - 40, 16, 90, '#3a2c1c'); for (let k = 0; k < 4; k++) box(fx + d * 84 - 5, fy - 34 + k * 22, 10, 10, '#241a10'); }
      for (const [x0, w] of [[0.18, 40], [0.62, 54]]) {
        const x = GW * x0;
        ctx.fillStyle = vgrad(0, h * 0.9, ['rgba(255,230,160,0.24)', 'rgba(255,230,160,0.04)']);
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + w, 0); ctx.lineTo(x + w + 120, h * 0.9); ctx.lineTo(x + 70, h * 0.9); ctx.closePath(); ctx.fill();
      }
      const sx = GW / 2, base = h * 0.84;
      for (let k = 0; k < 5; k++) box(sx - 110 + k * 18, base - k * 14, 220 - k * 36, 14, k % 2 ? '#3a2c1c' : '#44341f');
      box(sx - 12, base - 96, 24, 26, '#4a3a24');
      glow(sx, base - 110, 60, 'rgba(255,210,90,0.45)');
      ell(sx, base - 104, 10, 9, '#e8b830'); circ(sx, base - 118, 8, '#f2c840');
      box(sx - 4, base - 120, 3, 2, '#7a5a10'); box(sx + 2, base - 120, 3, 2, '#7a5a10'); box(sx - 3, base - 114, 6, 1.6, '#7a5a10');
      for (let i = 0; i < 9; i++) {
        const x = SR(i, 681) * GW, len = 60 + SR(i, 682) * 160;
        ctx.strokeStyle = '#2e4a1e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + 14, len / 2, x - 4, len); ctx.stroke();
        for (let y = 20; y < len; y += 22) ell(x + Math.sin(y * 0.05) * 6, y, 5, 2.6, '#3e6a28');
      }
      for (const cx of [0, GW]) { ctx.strokeStyle = 'rgba(220,220,210,0.18)'; ctx.lineWidth = 0.8; for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.arc(cx, 0, k * 14, 0, Math.PI); ctx.stroke(); } }
      box(0, h * 0.9, GW, h, '#1a120a');
      for (let i = 0; i < 12; i++) { const x = SR(i, 683) * GW; for (let k = -2; k <= 2; k++) limb(x, h * 0.92, x + k * 10, h * 0.86 - Math.abs(k) * -4, 2, '#2e4a1e'); }
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, w = 42, px = side ? x0 - w : x0;
        box(px, 0, w, T, '#4a3826'); box(side ? px + w - 4 : px, 0, 4, T, 'rgba(255,220,160,0.08)');
        for (let y = 0, i = 0; y < T; y += 40, i++) {
          box(px, y, w, 2, 'rgba(0,0,0,0.35)');
          const gx = px + w / 2, gy = y + 20;
          if (i % 3 === 0) { box(gx - 9, gy - 9, 18, 18, '#3a2c1c'); box(gx - 5, gy - 5, 10, 10, '#4a3826'); box(gx - 2, gy - 2, 4, 4, '#3a2c1c'); }
          else if (i % 3 === 1) { ctx.strokeStyle = '#3a2c1c'; ctx.lineWidth = 2; ctx.beginPath(); for (let a = 0; a < 9; a += 0.4) ctx.lineTo(gx + Math.cos(a) * a, gy + Math.sin(a) * a); ctx.stroke(); }
          else for (let k = 0; k < 3; k++) circ(gx - 10 + k * 10, gy, 2.4, '#1a120a');
        }
        const ty = T * (side ? 0.3 : 0.72), tx = x0 + dir * (w + 8);
        box(tx - 6, ty, 12, 5, '#3a2a1a'); limb(tx, ty + 5, tx - dir * 8, ty + 14, 3, '#3a2a1a'); stillFlame(tx, ty, 1);
        ctx.strokeStyle = '#2e4a1e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + dir * w, 0);
        for (let y = 0; y < T; y += 30) ctx.lineTo(x0 + dir * (w + 4 + Math.sin(y * 0.04 + side) * 6), y); ctx.stroke();
        for (let y = 15; y < T; y += 34) ell(x0 + dir * (w + 6 + Math.sin(y * 0.04 + side) * 6), y, 5, 2.6, '#3e6a28');
      }
    },
    live() {
      const f = G.frame, p = f % 1200;
      for (let i = 0; i < 12; i++) {
        const x = GW * (0.22 + (i % 2) * 0.42) + SR(i, 684) * 90 + Math.sin(f * 0.01 + i) * 10, y = (SR(i, 685) * H + f * 0.15) % (H * 0.9);
        glowAt(x + y * 0.13, y, 4, 'rgba(255,240,200,0.9)', 0.35);
      }
      if (p < 520) {
        const r = 46, x = -r + p * 1.15, y = H * 0.92 - r + 6;
        for (let k = 0; k < 4; k++) { alpha(0.25); circ(x - r - k * 16, y + r - 6 - k * 3, 10 + k * 5, '#8a7050'); alpha(1); }
        ctx.save(); ctx.translate(x, y); ctx.rotate(p * 0.025);
        circ(0, 0, r, '#6a5a44'); circ(-r * 0.3, -r * 0.3, r * 0.4, 'rgba(255,230,180,0.12)');
        ctx.strokeStyle = 'rgba(30,22,14,0.6)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-r * 0.6, -r * 0.2); ctx.lineTo(0, 0); ctx.lineTo(r * 0.3, r * 0.6); ctx.moveTo(0, 0); ctx.lineTo(r * 0.5, -r * 0.4); ctx.stroke();
        ctx.restore();
      }
    },
  },

  deephalls: {
    far(h) {
      skyFill(h, ['#020305', '#06080c', '#0a0e14', '#05070a']);
      const vy = h * 0.4, cx = GW / 2;
      // a tall doorway at the far end of the hall, faintly lit
      glow(cx, vy - 40, 120, 'rgba(120,160,220,0.22)');
      box(cx - 16, vy - 90, 32, 90, 'rgba(120,160,220,0.28)'); tri(cx - 16, vy - 90, cx + 16, vy - 90, cx, vy - 108, 'rgba(120,160,220,0.28)');
      // floor with lines running to the doorway
      box(0, vy, GW, h - vy, '#0c1016');
      ctx.strokeStyle = 'rgba(140,170,210,0.08)'; ctx.lineWidth = 1;
      for (let k = -8; k <= 8; k++) { ctx.beginPath(); ctx.moveTo(cx + k * 6, vy); ctx.lineTo(cx + k * GW * 0.2, h); ctx.stroke(); }
      for (let k = 1; k < 8; k++) box(0, vy + (h - vy) * (k / 8) ** 1.8, GW, 1, 'rgba(140,170,210,0.06)');
      // pillar rows, far to near: lit cold on the inside face, fading up into the dark ceiling
      for (let k = 0; k < 6; k++) {
        const d = 0.16 + k * 0.17, p = d ** 1.6, w = 6 + 96 * p, bottom = vy + h * 0.56 * d;
        const shade = Math.round(14 + 22 * d), col = `rgb(${shade},${shade + 5},${shade + 14})`;
        for (const sd of [-1, 1]) {
          const x = cx + sd * (GW * 0.05 + GW * 0.56 * p), inner = x - sd * w / 2;
          box(x - w / 2, 0, w, bottom, col);
          box(sd > 0 ? x - w / 2 : x + w / 2 - w * 0.18, 0, w * 0.18, bottom, 'rgba(150,185,230,0.12)');
          box(x - w / 2 - w * 0.14, bottom - w * 0.32, w * 1.28, w * 0.32, col);
          box(x - w / 2 - w * 0.14, bottom - w * 0.32, w * 1.28, Math.max(1, w * 0.04), 'rgba(150,185,230,0.2)');
          const band = bottom * 0.55;
          box(x - w / 2, band, w, w * 0.16, 'rgba(0,0,0,0.3)');
          for (let j = 0; j < 4; j++) tri(x - w * 0.4 + j * w * 0.2, band + w * 0.02, x - w * 0.2 + j * w * 0.2, band + w * 0.02, x - w * 0.3 + j * w * 0.2, band + w * 0.14, 'rgba(150,185,230,0.18)');
          ctx.strokeStyle = 'rgba(210,230,255,0.3)'; ctx.lineWidth = Math.max(0.6, w * 0.02);
          ctx.beginPath(); ctx.moveTo(inner + sd * w * 0.2, bottom * 0.15); ctx.lineTo(inner + sd * w * 0.35, bottom * 0.3); ctx.lineTo(inner + sd * w * 0.25, bottom * 0.42); ctx.stroke();
          if (k > 1) { glow(inner - sd * w * 0.3, bottom * 0.7, 10 + w * 0.25, 'rgba(160,210,255,0.3)'); circ(inner - sd * w * 0.3, bottom * 0.7, 1.5 + w * 0.04, '#cfe8ff'); }
        }
      }
      ctx.fillStyle = vgrad(0, h * 0.3, ['rgba(0,0,0,0.95)', 'rgba(0,0,0,0)']); ctx.fillRect(0, 0, GW, h * 0.3);
      // the chasm, the narrow bridge and the glow far below
      const ry = h * 0.74;
      ctx.fillStyle = '#020203'; ctx.beginPath(); ctx.moveTo(0, ry);
      for (let x = 0; x <= GW + 20; x += 20) ctx.lineTo(x, ry + SR(x, 690) * 8);
      for (let x = GW; x >= 0; x -= 20) ctx.lineTo(x, ry + 70 + SR(x, 691) * 10);
      ctx.closePath(); ctx.fill();
      glow(cx, ry + 74, 200, 'rgba(255,90,30,0.4)');
      ctx.strokeStyle = '#262c36'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(GW * 0.18, ry + 4); ctx.quadraticCurveTo(cx, ry - 18, GW * 0.82, ry + 4); ctx.stroke();
      ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,120,60,0.35)'; ctx.beginPath(); ctx.moveTo(GW * 0.18, ry + 8); ctx.quadraticCurveTo(cx, ry - 14, GW * 0.82, ry + 8); ctx.stroke();
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, w = 40, px = side ? x0 - w : x0;
        box(px, 0, w, T, '#1e232c'); box(side ? px : px + w - 4, 0, 4, T, 'rgba(180,200,230,0.08)');
        for (let y = 0; y < T; y += 80) {
          box(px, y, w, 6, '#2a303a');
          for (let k = 0; k < 4; k++) poly([px + 4 + k * 9, y + 16, px + 8.5 + k * 9, y + 24, px + 13 + k * 9, y + 16], '#141820');
          zigzag(px + 4, y + 44, w - 8, 8, 6, 'rgba(160,190,230,0.25)');
        }
        const ly = T * (side ? 0.38 : 0.82), lx = x0 + dir * (w + 10);
        limb(x0 + dir * w, ly - 20, lx, ly - 20, 2, '#2a303a'); limb(lx, ly - 20, lx, ly - 12, 1.2, '#2a303a');
        glow(lx, ly - 4, 26, 'rgba(170,210,255,0.35)');
        poly([lx - 5, ly - 12, lx + 5, ly - 12, lx + 3, ly + 2, lx - 3, ly + 2], '#bfe0ff');
      }
    },
    live() {
      const f = G.frame, b = f % 150;
      const env = Math.max(0, 1 - b / 14) + (b >= 26 ? Math.max(0, 1 - (b - 26) / 14) : 0);
      glowAt(GW * 0.5, H * 0.82, 200, 'rgba(255,90,30,0.9)', 0.12 + 0.22 * env);
      for (let i = 0; i < 10; i++) {
        const x = SR(i, 692) * GW, y = (SR(i, 693) * H + f * (0.3 + SR(i, 694) * 0.4)) % H;
        box(x, y, 1.4, 1.4, 'rgba(200,210,230,0.35)');
      }
    },
  },

  shrine: {
    far(h) {
      skyFill(h, ['#0c2014', '#1c3c24', '#3a6a3a', '#7aa860']);
      for (const [layer, col, n] of [[0, '#1e3e26', 9], [1, '#12281a', 7]]) {
        for (let i = 0; i < n; i++) {
          const x = SR(i + layer * 30, 700) * GW, w = 18 + layer * 12 + SR(i, 701) * 14;
          box(x - w / 2, 0, w, h, col);
          for (let y = 30; y < h; y += 50) box(x - w / 2 + 3, y + SR(y + i, 702) * 20, 3, 18, 'rgba(0,0,0,0.2)');
        }
        for (let i = 0; i < 12; i++) circ(SR(i + layer * 50, 703) * GW, SR(i, 704) * h * 0.12, 50 + SR(i, 705) * 30, layer ? '#16341e' : '#24482c');
      }
      for (const [x0, w] of [[0.3, 50], [0.56, 34], [0.7, 24]]) {
        ctx.fillStyle = vgrad(0, h * 0.85, ['rgba(255,250,200,0.26)', 'rgba(255,250,200,0.04)']);
        ctx.beginPath(); ctx.moveTo(GW * x0, 0); ctx.lineTo(GW * x0 + w, 0); ctx.lineTo(GW * x0 + w - 60, h * 0.85); ctx.lineTo(GW * x0 - 80, h * 0.85); ctx.closePath(); ctx.fill();
      }
      ridge(h, h * 0.78, 10, '#2a4a24', 1); box(0, h * 0.86, GW, h, '#1e3a1c');
      const cx = GW * 0.5, base = h * 0.8;
      for (const d of [-1, 1]) {
        box(cx + d * 70 - 12, base - 150, 24, 150, '#6a7466'); box(cx + d * 70 - 15, base - 156, 30, 10, '#7a8476');
        ell(cx + d * 70, base - 156, 16, 5, '#4f8a42');
        for (let y = base - 140; y < base; y += 24) box(cx + d * 70 - 12, y, 24, 1.6, 'rgba(0,0,0,0.2)');
      }
      ctx.strokeStyle = '#6a7466'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(cx, base - 150, 70, Math.PI, Math.PI * 1.62); ctx.stroke();
      glow(cx, base - 40, 90, 'rgba(255,255,210,0.45)');
      box(cx - 34, base - 12, 68, 12, '#7a8476'); box(cx - 26, base - 22, 52, 10, '#8a9486'); box(cx - 18, base - 30, 36, 8, '#9aa496');
      box(cx - 2.5, base - 82, 5, 54, '#d8e2ea'); tri(cx - 2.5, base - 82, cx + 2.5, base - 82, cx, base - 90, '#e8f0f6');
      box(cx - 13, base - 30, 26, 4, '#b8863a'); box(cx - 2, base - 26, 4, 0, '#5a3a20');
      for (let i = 0; i < 30; i++) circ(SR(i, 706) * GW, h * (0.82 + SR(i, 707) * 0.12), 1.8, ['#ffffff', '#ffe46a', '#ff9ab8'][i % 3]);
      for (let i = 0; i < 40; i++) { const x = SR(i, 708) * GW; tri(x - 3, h * 0.87, x + 3, h * 0.87, x + 1, h * 0.84 - SR(i, 709) * 10, '#2e5a28'); }
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, w = 34, px = side ? x0 - w : x0;
        box(px, 0, w, T, '#3a2c1e');
        for (let y = 0; y < T; y += 24) box(px + 5 + SR(y + side, 710) * 18, y, 3, 16 + SR(y, 711) * 8, 'rgba(0,0,0,0.25)');
        box(side ? px : px + w - 4, 0, 4, T, 'rgba(255,255,220,0.06)');
        for (let k = 0; k < 4; k++) ell(px + (side ? 4 : w - 4), 60 + k * 150 + side * 40, 6, 22, 'rgba(90,150,70,0.55)');
        for (const fy of [T * 0.22, T * 0.68]) {
          const fx = x0 + dir * w, y = fy + side * 50;
          for (let k = 0; k < 5; k++) {
            const a = -Math.PI / 2 + (k - 2) * 0.35 * dir, len = 34 - Math.abs(k - 2) * 5;
            ctx.strokeStyle = '#3e7a32'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(fx, y);
            ctx.quadraticCurveTo(fx + Math.cos(a) * len * 0.5 + dir * 10, y + Math.sin(a) * len * 0.5, fx + Math.cos(a) * len + dir * 14, y + Math.sin(a) * len + 8); ctx.stroke();
          }
        }
        const by = T * (side ? 0.5 : 0.95);
        box(side ? x0 - w - 30 : x0 + w, by - 22, 30, 22, '#6a7466'); ell(x0 + dir * (w + 15), by - 22, 16, 4, '#4f8a42');
      }
    },
    live() {
      const f = G.frame;
      for (let i = 0; i < 3; i++) butterfly(GW * (0.2 + i * 0.3) + Math.sin(f * 0.01 + i * 2) * 60, H * (0.5 + i * 0.1) + Math.sin(f * 0.023 + i) * 30, f * 0.3 + i, i);
      for (let i = 0; i < 12; i++) {
        const x = SR(i, 712) * GW + Math.sin(f * 0.01 + i) * 20, y = H - ((SR(i, 713) * H + f * 0.2) % H);
        glowAt(x, y, 6, 'rgba(240,255,200,0.9)', 0.3 + 0.3 * Math.sin(f * 0.05 + i));
      }
      const k = (f % 300) / 300;
      if (k < 0.2) sparkle(GW * 0.5, H * 0.8 - 86, 9, Math.sin(k / 0.2 * Math.PI));
    },
  },

  twinsuns: {
    far(h) {
      skyFill(h, ['#1e1838', '#6a3a5a', '#d8784e', '#f6c27a']);
      for (let i = 0; i < 30; i++) box(SR(i, 720) * GW, SR(i, 721) * h * 0.2, 1.4, 1.4, `rgba(255,240,230,${0.2 + SR(i, 722) * 0.4})`);
      const hy = h * 0.6;
      glow(GW * 0.4, hy - 30, 220, 'rgba(255,200,120,0.45)');
      circ(GW * 0.34, hy - 24, 30, '#ffd28a'); circ(GW * 0.34, hy - 24, 24, '#fff0c8');
      circ(GW * 0.5, hy - 58, 17, '#ffb070'); circ(GW * 0.5, hy - 58, 13, '#ffe0b0');
      poly([GW * 0.62, hy, GW * 0.66, hy - 50, GW * 0.8, hy - 54, GW * 0.84, hy], '#8a4a40');
      poly([GW * 0.04, hy, GW * 0.07, hy - 34, GW * 0.18, hy - 36, GW * 0.2, hy], '#8a4a40');
      ridge(h, hy, 10, '#c87a4a', 1); ridge(h, h * 0.7, 20, '#b0663e', 2.4); ridge(h, h * 0.8, 24, '#9a5634', 3.8); ridge(h, h * 0.9, 16, '#7e4428', 5.2);
      for (let i = 0; i < 6; i++) ell(SR(i, 723) * GW, h * (0.66 + i * 0.05), 60, 2, 'rgba(255,220,170,0.3)');
      const hx = GW * 0.72, hb = h * 0.78;
      box(hx - 50, hb - 20, 100, 24, '#d8b888'); dome(hx - 20, hb - 18, 34, '#e8c898', 'rgba(150,100,60,0.25)'); dome(hx + 34, hb - 10, 22, '#e8c898', 'rgba(150,100,60,0.25)');
      ctx.fillStyle = '#3a2418'; ctx.beginPath(); ctx.arc(hx - 20, hb - 4, 9, Math.PI, 0); ctx.lineTo(hx - 11, hb + 4); ctx.lineTo(hx - 29, hb + 4); ctx.fill();
      box(hx + 28, hb - 18, 10, 6, '#3a2418');
      for (const [px, ht] of [[0.6, 90], [0.88, 70]]) {
        const x = GW * px; limb(x, hb + 4, x, hb - ht, 2.4, '#a89880');
        for (let k = 0; k < 3; k++) ell(x, hb - ht * (0.5 + k * 0.2), 7 - k, 2, '#c8b898');
      }
      const sx = GW * 0.16, sy = h * 0.86;
      ctx.strokeStyle = '#f0e0c8'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(sx - 70, sy + 6); ctx.quadraticCurveTo(sx, sy - 6, sx + 70, sy + 4); ctx.stroke();
      for (let k = 0; k < 7; k++) { const x = sx - 54 + k * 18; ctx.beginPath(); ctx.moveTo(x, sy); ctx.quadraticCurveTo(x + 10, sy - 40 + Math.abs(k - 3) * 6, x + 18, sy + 2); ctx.stroke(); }
      ctx.lineCap = 'butt';
      ell(sx + 84, sy, 16, 10, '#f0e0c8'); circ(sx + 88, sy - 2, 3, '#7e4428');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, w = 40, px = side ? x0 - w : x0;
        for (let y = 0, i = 0; y < T; y += 70, i++) {
          ctx.fillStyle = i % 2 ? '#d8b888' : '#ccaa7a'; rr(px, y + 2, w, 66, 10); ctx.fill();
          box(px + 4, y + 30, w - 8, 3, 'rgba(120,70,40,0.25)');
        }
        for (const vy of [T * 0.2, T * 0.62]) { circ(px + w / 2, vy + side * 40, 8, '#8a6a4a'); circ(px + w / 2, vy + side * 40, 5, '#3a2418'); }
        for (const cy of [T * 0.4, T * 0.9]) {
          const y = cy - side * 30;
          poly([x0 + dir * w, y, x0 + dir * (w + 34), y + 6, x0 + dir * (w + 30), y + 40, x0 + dir * w, y + 46], side ? '#b8a080' : '#c8b090');
          limb(x0 + dir * w, y, x0 + dir * (w + 34), y + 6, 2, '#6a4a30');
        }
      }
    },
    live() {
      const f = G.frame, p = f % 800, hy = H * 0.6;
      if (p < 400) {
        const x = GW + 30 - p * (GW + 60) / 400, y = hy + 4;
        for (let k = 0; k < 8; k++) { alpha(0.35 * (1 - k / 8)); circ(x + k * 9, y - k * 0.6, 3 + k * 1.4, '#e8b888'); alpha(1); }
        box(x - 4, y - 2, 8, 3, '#4a3020');
      }
      const q = (f + 400) % 1600;
      if (q < 700) tinyShip(-40 + q * (GW + 80) / 700, H * 0.18 + Math.sin(q * 0.02) * 6, 1, 0.8, '#8a7a6a', 'rgba(140,200,255,0.8)');
    },
  },

  future: {
    far(h) {
      skyFill(h, ['#140a32', '#3a2470', '#a8508e', '#f69a7a']);
      for (let i = 0; i < 40; i++) box(SR(i, 730) * GW, SR(i, 731) * h * 0.3, 1.4, 1.4, `rgba(255,255,255,${0.2 + SR(i, 732) * 0.5})`);
      circ(GW * 0.42, h * 0.14, 26, '#f4e8f4'); circ(GW * 0.42 - 8, h * 0.14 - 4, 5, 'rgba(180,160,200,0.5)');
      const sky = h * 0.86;
      const tower = (x, ht, w, kind, col, lit) => {
        const top = sky - ht;
        if (kind === 0) {
          box(x - 4, top, 8, ht, col); ell(x, top + 10, w, w * 0.22, col); circ(x, top - 6, w * 0.3, col);
          for (let k = 0; k < 6; k++) box(x - w * 0.8 + k * w * 0.32, top + 8, 3, 3, lit);
        } else if (kind === 1) {
          box(x - w / 2, top, w, ht, col); dome(x, top, w / 2, col); box(x - w / 2 - 4, top + ht * 0.3, w + 8, 6, col);
          for (let y = top + 14; y < sky - 10; y += 14) for (let j = 0; j < w / 10 - 1; j++) if (SR(y + j + x, 733) > 0.4) box(x - w / 2 + 5 + j * 10, y, 4, 5, lit);
        } else {
          poly([x - w / 2, sky, x - w * 0.14, top, x + w * 0.14, top, x + w / 2, sky], col);
          for (let k = 1; k < 5; k++) ell(x, top + k * ht / 5, w * (0.14 + k * 0.08), 4, col);
          circ(x, top - 4, 4, lit);
        }
      };
      for (let i = 0; i < 9; i++) tower(GW * (i / 8) + SR(i, 734) * 20 - 10, 160 + SR(i, 735) * 170, 30 + SR(i, 736) * 24, i % 3, '#2a1e56', 'rgba(255,200,240,0.5)');
      for (let i = 0; i < 7; i++) tower(GW * ((i + 0.5) / 7) + SR(i, 737) * 20, 90 + SR(i, 738) * 130, 36 + SR(i, 739) * 26, (i + 1) % 3, '#1a1238', 'rgba(120,240,255,0.8)');
      for (const [x0, y0, cx, cy, x1, y1] of FUT_TUBES) {
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(180,240,255,0.28)'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(GW * x0, h * y0); ctx.quadraticCurveTo(GW * cx, h * cy, GW * x1, h * y1); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(GW * x0, h * y0 - 4); ctx.quadraticCurveTo(GW * cx, h * cy - 4, GW * x1, h * y1 - 4); ctx.stroke();
        ctx.lineCap = 'butt';
      }
      const bx = GW * 0.18, by = h * 0.42;
      limb(bx + 30, by + 40, bx + 30, sky, 4, '#1a1238');
      ctx.fillStyle = '#1a1238'; rr(bx - 10, by - 8, 80, 50, 10); ctx.fill();
      ctx.strokeStyle = '#ff5ac8'; ctx.lineWidth = 2.4; rr(bx - 6, by - 4, 72, 42, 8); ctx.stroke();
      circ(bx + 18, by + 17, 11, '#5af0ff'); ell(bx + 18, by + 17, 18, 4, 'rgba(255,90,200,0.9)');
      ctx.strokeStyle = '#ffe46a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx + 38, by + 17); ctx.lineTo(bx + 58, by + 17); ctx.lineTo(bx + 52, by + 11); ctx.moveTo(bx + 58, by + 17); ctx.lineTo(bx + 52, by + 23); ctx.stroke();
      box(0, sky, GW, h, '#0e0a22');
      for (let i = 0; i < 30; i++) box(SR(i, 740) * GW, sky + 6 + SR(i, 741) * 30, 6, 2, 'rgba(255,120,220,0.5)');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, w = 34, px = side ? x0 - w : x0;
        ctx.fillStyle = vgrad(0, 1, ['#c8ccd8', '#c8ccd8']); box(px, 0, w, T, '#b8bccc');
        box(side ? px : px + w - 8, 0, 8, T, '#e2e6f0'); box(side ? px + w - 3 : px, 0, 3, T, '#8a8ea0');
        for (let y = 0; y < T; y += 110) {
          box(px, y, w, 2, '#8a8ea0');
          circ(px + w / 2, y + 40, 10, '#6a6e80'); circ(px + w / 2, y + 40, 7, '#3a2a6a'); circ(px + w / 2 - 2, y + 38, 2, 'rgba(255,255,255,0.7)');
          box(px + 4, y + 70, w - 8, 3, '#5af0ff'); box(px + 4, y + 76, w - 8, 2, 'rgba(255,90,200,0.8)');
        }
        const tx = x0 + dir * (w + 14);
        box(tx - 7, 0, 14, T, 'rgba(180,240,255,0.18)'); box(tx - 7, 0, 2, T, 'rgba(255,255,255,0.3)');
        for (let y = 0; y < T; y += 160) box(tx - 9, y, 18, 6, '#b8bccc');
      }
    },
    live() {
      const f = G.frame;
      FUT_TUBES.forEach(([x0, y0, cx, cy, x1, y1], i) => {
        for (let k = 0; k < 2; k++) {
          const t = ((f * (0.006 + i * 0.002)) + k * 0.5) % 1, [x, y] = qpt(GW * x0, H * y0, GW * cx, H * cy, GW * x1, H * y1, t);
          ctx.fillStyle = '#ffe46a'; rr(x - 6, y - 3.5, 12, 7, 3.5); ctx.fill(); box(x - 2, y - 2, 6, 2, 'rgba(255,255,255,0.7)');
        }
      });
      [[0, 0.32, 1.6], [1, 0.38, -1.2], [2, 0.26, 1.0], [3, 0.44, -1.8]].forEach(([i, ky, sp]) => {
        const span = GW + 120, p = (f * Math.abs(sp) + i * 170) % span, x = sp > 0 ? p - 60 : GW + 60 - p, y = H * ky;
        glowAt(x - Math.sign(sp) * 12, y + 2, 10, 'rgba(255,120,220,0.9)', 0.7);
        ctx.fillStyle = ['#ff6a5a', '#5af0ff', '#ffe46a', '#9a7aff'][i]; rr(x - 10, y - 2, 20, 7, 3.5); ctx.fill();
        ctx.fillStyle = 'rgba(200,240,255,0.6)'; ctx.beginPath(); ctx.arc(x, y - 1, 6, Math.PI, 0); ctx.fill();
      });
    },
  },

  ring: {
    far(h) {
      skyFill(h, ['#06101e', '#0e2a46', '#2a6a8c', '#9ad8d0']);
      for (let i = 0; i < 60; i++) box(SR(i, 750) * GW, SR(i, 751) * h * 0.4, 1.4, 1.4, `rgba(255,255,255,${0.2 + SR(i, 752) * 0.6})`);
      const gx = GW * 0.18, gy = h * 0.24, gr = 70;
      ctx.save(); ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.clip();
      box(gx - gr, gy - gr, gr * 2, gr * 2, '#7a9ab8');
      for (let k = 0; k < 6; k++) ell(gx, gy - gr + k * 26 + 8, gr * 1.2, 6, k % 2 ? 'rgba(40,60,100,0.35)' : 'rgba(220,240,255,0.25)');
      circ(gx + gr * 0.5, gy + gr * 0.2, gr, 'rgba(6,16,30,0.55)');
      ctx.restore();
      const { cx, cy, rx, ry } = RING_GEO(h);
      ctx.lineCap = 'butt';
      ctx.strokeStyle = '#8894a8'; ctx.lineWidth = 22; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#3a7a5a'; ctx.lineWidth = 14; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#2a5a8a'; ctx.setLineDash([26, 40, 12, 30]); ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(230,240,255,0.25)'; ctx.lineWidth = 3; ctx.setLineDash([4, 14]); ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = '#c8d4e0'; ctx.lineWidth = 1.6;
      for (const d of [-11, 11]) { ctx.beginPath(); ctx.ellipse(cx, cy, rx + d, ry + d, 0, Math.PI, Math.PI * 2); ctx.stroke(); }
      ctx.fillStyle = vgrad(h * 0.45, h * 0.75, ['rgba(154,216,208,0)', 'rgba(154,216,208,0.55)']); ctx.fillRect(0, h * 0.45, GW, h * 0.3);
      ridge(h, h * 0.68, 22, '#2a6a5a', 1.5); ridge(h, h * 0.76, 26, '#1e5444', 3);
      const px = GW * 0.76, pb = h * 0.78;
      poly([px - 20, pb, px - 14, pb - 170, px - 4, pb - 200, px + 6, pb - 170, px + 20, pb], '#7a8494');
      poly([px - 4, pb - 200, px + 6, pb - 170, px + 20, pb, px + 2, pb], '#5a6474');
      limb(px - 2, pb - 160, px - 2, pb - 20, 2, '#7ae8ff'); glow(px - 2, pb - 190, 30, 'rgba(120,230,255,0.5)');
      poly([GW * 0.3, h * 0.72, GW * 0.34, h * 0.6, GW * 0.42, h * 0.58, GW * 0.44, h * 0.72], '#3a5a4a');
      box(GW * 0.39, h * 0.59, 3, h * 0.13, 'rgba(230,250,255,0.75)');
      ridge(h, h * 0.86, 16, '#143c30', 5); box(0, h * 0.93, GW, h, '#0e2e24');
      for (let i = 0; i < 40; i++) { const x = SR(i, 753) * GW; limb(x, h * 0.9, x + 2, h * 0.86 - SR(i, 754) * 10, 1.6, '#2a6a4a'); }
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        for (let y = 0, i = 0; y < T; y += 160, i++) {
          const w = 30 + (i % 2) * 12;
          poly([x0, y, x0 + dir * w, y + 20, x0 + dir * w, y + 140, x0 + dir * (w - 12), y + 158, x0, y + 158], i % 2 ? '#6a7484' : '#7a8494');
          poly([x0 + dir * w, y + 20, x0 + dir * w, y + 140, x0 + dir * (w - 6), y + 140, x0 + dir * (w - 6), y + 24], '#9aa4b4');
          limb(x0 + dir * (w * 0.5), y + 30, x0 + dir * (w * 0.5), y + 130, 2, '#7ae8ff');
          glow(x0 + dir * w * 0.5, y + 80, 22, 'rgba(120,230,255,0.25)');
        }
      }
    },
    live() {
      const f = G.frame, { cx, cy, rx, ry } = RING_GEO(H);
      for (let k = 0; k < 3; k++) {
        const a = Math.PI + ((f * 0.0015 + k / 3) % 1) * Math.PI;
        glowAt(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 14, 'rgba(230,250,255,0.9)', 0.45);
      }
      const p = f % 1100;
      if (p < 600) tinyShip(GW + 40 - p * (GW + 80) / 600, H * 0.34 + Math.sin(p * 0.02) * 10, -1, 1, '#9aa4b4', 'rgba(120,230,255,0.9)');
    },
  },
});

Object.assign(SPECIAL_PLATFORMS, {
  beacons(x, sy, w, h) {
    ctx.fillStyle = '#4a4864'; rr(x, sy, w, h, 5); ctx.fill();
    box(x + 4, sy + h - 4, w - 8, 3, 'rgba(0,0,0,0.3)');
    for (let bx = x + 10; bx < x + w - 8; bx += 24) box(bx, sy + 7, 1.4, h - 9, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = '#eef2ff'; ctx.beginPath(); ctx.moveTo(x + 2, sy + 2);
    for (let bx = x + 2; bx <= x + w - 2; bx += 10) ctx.lineTo(bx, sy + 5 + (Math.sin(bx * 0.3) > 0.2 ? 2 : 0));
    ctx.lineTo(x + w - 2, sy + 2); ctx.closePath(); ctx.fill();
    rr(x, sy, w, 3, 2); ctx.fill();
  },
  icewall(x, sy, w, h) {
    ctx.fillStyle = '#4a3624'; rr(x, sy, w, h, 3); ctx.fill();
    for (let bx = x + 22; bx < x + w - 6; bx += 34) box(bx, sy + 5, 1.6, h - 7, 'rgba(0,0,0,0.35)');
    box(x + 3, sy + 10, w - 6, 1.2, 'rgba(255,220,170,0.12)');
    ctx.fillStyle = '#e8f4fc'; ctx.beginPath(); ctx.moveTo(x + 1, sy);
    for (let bx = x + 1; bx <= x + w - 1; bx += 9) ctx.lineTo(bx, sy + 5 + (Math.sin(bx * 0.35) > 0.3 ? 2 : 0));
    ctx.lineTo(x + w - 1, sy); ctx.closePath(); ctx.fill();
    rr(x, sy, w, 3, 2); ctx.fill();
    for (let bx = x + 10, i = 0; bx < x + w - 6; bx += 15, i++) tri(bx - 2.4, sy + h, bx + 2.4, sy + h, bx, sy + h + 4 + (i % 3) * 2, 'rgba(210,235,255,0.9)');
  },
  shelter(x, sy, w, h) {
    ctx.fillStyle = '#6a5a4a'; rr(x, sy, w, h, 3); ctx.fill();
    hazardBand(x + 2, sy + 1, w - 4, 5);
    box(x + 2, sy + h - 4, w - 4, 3, 'rgba(0,0,0,0.35)');
    for (let bx = x + 8; bx < x + w - 4; bx += 20) circ(bx, sy + 11, 1.4, '#3a3026');
    for (let i = 0; i < w / 30; i++) circ(x + 14 + i * 28 + (i % 2) * 6, sy + 9 + (i % 3), 2.6, 'rgba(150,80,30,0.45)');
  },
  cocoa(x, sy, w, h) {
    ctx.fillStyle = '#4a2410'; rr(x, sy, w, h, 4); ctx.fill();
    for (let bx = x + 2; bx < x + w - 4; bx += 18) { ctx.fillStyle = '#6a3a1e'; rr(bx + 1, sy + 2, Math.min(16, x + w - bx - 3), h - 5, 2); ctx.fill(); box(bx + 3, sy + 3, Math.min(12, x + w - bx - 7), 2, 'rgba(255,210,170,0.3)'); }
    ctx.fillStyle = '#7a4424'; rr(x, sy, w, 2.4, 2); ctx.fill();
  },
  skyisle(x, sy, w, h) {
    ctx.fillStyle = '#9a8670'; rr(x, sy, w, h, 6); ctx.fill();
    box(x + 4, sy + h - 5, w - 8, 4, '#7a6a5a');
    ctx.fillStyle = '#5fb052'; rr(x, sy, w, 6, 4); ctx.fill();
    for (let bx = x + 6, i = 0; bx < x + w - 4; bx += 11, i++) ell(bx, sy + 2, 6, 3, i % 2 ? '#6ac05a' : '#4fa04a');
    for (let bx = x + 16, i = 0; bx < x + w - 10; bx += 34, i++) limb(bx, sy + h - 1, bx + (i % 2 ? 2 : -2), sy + h + 6 + (i % 3) * 3, 1.2, '#5a4a3a');
  },
  colony(x, sy, w, h) {
    ctx.fillStyle = '#e6dcd2'; rr(x, sy, w, h, 8); ctx.fill();
    ctx.fillStyle = '#c8b8ae'; rr(x, sy + h - 6, w, 6, 4); ctx.fill();
    box(x + 8, sy + 8, w - 16, 2, '#ff9a5a');
    ctx.fillStyle = '#ffffff'; rr(x + 3, sy + 1, w - 6, 3, 2); ctx.fill();
  },
  hoard(x, sy, w, h) {
    ctx.fillStyle = '#6a4e2c'; rr(x, sy, w, h, 4); ctx.fill();
    ctx.fillStyle = '#8a6a3a'; rr(x, sy, w, 5, 3); ctx.fill();
    box(x + 3, sy + h - 4, w - 6, 3, 'rgba(0,0,0,0.35)');
    for (let i = 0; i < w / 7; i++) ell(x + 4 + ((i * 37) % (w - 8)), sy + 2 + (i % 3) * 1.6, 3.4, 1.6, i % 2 ? '#ffd75a' : '#e0a83a');
    box(x + 4, sy + 10, w - 8, 1.2, 'rgba(255,200,90,0.3)');
  },
  idol(x, sy, w, h) {
    ctx.fillStyle = '#947c58'; rr(x, sy, w, h, 2); ctx.fill();
    box(x, sy, w, 3, '#c8ac7c');
    box(x + 2, sy + 6, w - 4, 6, '#5a4a34');
    for (let bx = x + 6, i = 0; bx < x + w - 8; bx += 12, i++) { if (i % 2) box(bx, sy + 7, 6, 4, '#947c58'); else { box(bx + 2, sy + 7, 2, 4, '#947c58'); box(bx, sy + 8, 6, 2, '#947c58'); } }
    box(x + 3, sy + h - 3, w - 6, 3, 'rgba(0,0,0,0.3)');
  },
  deephalls(x, sy, w, h) {
    ctx.fillStyle = '#5c6474'; rr(x, sy, w, h, 2); ctx.fill();
    box(x, sy, w, 3, '#95a0b4');
    zigzag(x + 4, sy + 9, w - 8, 6, 6, 'rgba(200,220,255,0.45)', 1.4);
    box(x + 2, sy + h - 3, w - 4, 3, 'rgba(0,0,0,0.35)');
  },
  shrine(x, sy, w, h) {
    ctx.fillStyle = '#8a9486'; rr(x, sy, w, h, 5); ctx.fill();
    box(x + 4, sy + h - 4, w - 8, 3, 'rgba(0,0,0,0.25)');
    for (let bx = x + 5, i = 0; bx < x + w - 4; bx += 12, i++) ell(bx, sy + 2, 7, 3.4, i % 2 ? '#4f8a42' : '#5f9a50');
    ctx.strokeStyle = 'rgba(30,40,30,0.4)'; ctx.lineWidth = 1.2;
    for (let bx = x + 24; bx < x + w - 14; bx += 60) { ctx.beginPath(); for (let a = 0; a < 10; a += 0.5) ctx.lineTo(bx + Math.cos(a) * a * 0.5, sy + 10 + Math.sin(a) * a * 0.4); ctx.stroke(); }
  },
  twinsuns(x, sy, w, h) {
    ctx.fillStyle = '#d8b888'; rr(x, sy, w, h, 8); ctx.fill();
    box(x + 2, sy + 9, w - 4, 3, '#a88660');
    box(x + 4, sy + h - 3, w - 8, 3, 'rgba(90,50,30,0.3)');
    for (let bx = x + 20; bx < x + w - 14; bx += 48) circ(bx, sy + 5, 2, '#8a6a4a');
  },
  future(x, sy, w, h) {
    ctx.fillStyle = '#b8bccc'; rr(x, sy, w, h, 7); ctx.fill();
    ctx.fillStyle = '#e2e6f0'; rr(x + 2, sy + 1, w - 4, 4, 3); ctx.fill();
    box(x + 6, sy + h - 4, w - 12, 2.4, '#5af0ff');
    for (let bx = x + 10; bx < x + w - 6; bx += 16) circ(bx, sy + 9, 1.2, '#8a8ea0');
  },
  ring(x, sy, w, h) {
    poly([x + 6, sy, x + w - 6, sy, x + w, sy + 6, x + w - 4, sy + h, x + 4, sy + h, x, sy + 6], '#6a7484');
    poly([x + 6, sy, x + w - 6, sy, x + w - 3, sy + 3, x + 3, sy + 3], '#9aa4b4');
    box(x + 10, sy + 9, w - 20, 1.6, '#7ae8ff');
  },
});

Object.assign(FLOOR_PROPS, {
  beacons(sy) {
    const x = propX(), f = G.frame;
    for (let k = 0; k < 4; k++) { limb(x - 18 + k * 2, sy - k * 5 - 2, x + 18 - k * 2, sy - k * 5 - 2, 4, k % 2 ? '#5a3a20' : '#6a4626'); }
    limb(x - 14, sy, x + 6, sy - 22, 3, '#4a2e18'); limb(x + 14, sy, x - 6, sy - 22, 3, '#4a2e18');
    flame(x, sy - 18, 1.5, f, 3);
    for (let i = 0; i < 4; i++) { const t = (f * 0.02 + i / 4) % 1; circ(x + Math.sin(t * 7 + i) * 8, sy - 40 - t * 40, 1.4, `rgba(255,190,90,${1 - t})`); }
  },
  icewall(sy) {
    const x = propX();
    limb(x - 10, sy, x - 2, sy - 22, 2.4, '#3a2a1c'); limb(x + 10, sy, x + 2, sy - 22, 2.4, '#3a2a1c');
    ctx.strokeStyle = '#e8dcc0'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - 22, sy - 30); ctx.quadraticCurveTo(x, sy - 18, x + 18, sy - 34); ctx.stroke();
    ctx.lineCap = 'butt';
    circ(x + 20, sy - 36, 5, '#cfc2a4'); circ(x + 20, sy - 36, 2.6, '#3a2a1c'); box(x - 6, sy - 28, 3, 6, '#3a2a1c'); box(x + 4, sy - 28, 3, 6, '#3a2a1c');
  },
  shelter(sy) {
    const x = propX(), f = G.frame;
    ctx.fillStyle = '#7a3a2a'; rr(x - 18, sy - 24, 36, 24, 8); ctx.fill();
    ctx.fillStyle = '#5a2a1e'; rr(x - 18, sy - 6, 36, 6, 3); ctx.fill();
    circ(x - 7, sy - 13, 7, '#d8c8a0'); for (let k = 0; k < 4; k++) box(x + 3, sy - 19 + k * 4, 11, 1.6, '#3a2018');
    limb(x - 7, sy - 13, x - 7 + Math.cos(f * 0.02) * 5, sy - 13 + Math.sin(f * 0.02) * 5, 1, '#3a2018');
    limb(x + 12, sy - 24, x + 22, sy - 46, 1.2, '#8a8a8a');
    for (let i = 0; i < 3; i++) {
      const t = (f * 0.012 + i / 3) % 1, nx = x + 4 + Math.sin(t * 6 + i) * 10, ny = sy - 30 - t * 40;
      alpha(1 - t); circ(nx, ny, 2.2, '#f2e8c0'); limb(nx + 2, ny, nx + 2, ny - 7, 1, '#f2e8c0'); alpha(1);
    }
  },
  cocoa(sy) {
    const x = propX(), f = G.frame;
    limb(x + 18, sy, x + 18, sy - 34, 2.4, '#fff4f4'); lolly(x + 18, sy - 40, 9, '#ff8ab8', '#ffffff');
    box(x - 22, sy - 10, 32, 10, '#4a2410'); box(x - 22, sy - 10, 14, 10, '#c83a4a'); box(x - 8, sy - 11, 2, 12, '#e8d8b0');
    ctx.save(); ctx.translate(x - 6, sy - 10); ctx.rotate(-0.3 + Math.sin(f * 0.04) * 0.03);
    ctx.fillStyle = '#f2c840'; rr(0, -18, 16, 22, 1.5); ctx.fill(); box(2, -14, 12, 1.2, '#b8860b'); box(2, -10, 12, 1.2, '#b8860b');
    ctx.restore();
    sparkle(x - 2, sy - 34, 4, 0.5 + 0.5 * Math.sin(f * 0.1));
  },
  skyisle(sy) {
    const x = propX(), k = 0.5 + 0.5 * Math.sin(G.frame * 0.05);
    box(x - 10, sy - 18, 20, 18, '#9a8670'); box(x - 12, sy - 20, 24, 4, '#b2a090');
    glowAt(x, sy - 30, 44 + k * 10, 'rgba(120,200,255,0.9)', 0.35 + k * 0.3);
    poly([x, sy - 40, x + 6, sy - 30, x, sy - 22, x - 6, sy - 30], '#7ad0ff'); poly([x, sy - 40, x + 6, sy - 30, x, sy - 30], '#c8f0ff');
    limb(x, sy - 40, x, sy - 46, 1, '#6a4a2e');
  },
  colony(sy) {
    const x = propX(), on = (G.frame % 60) < 30;
    limb(x, sy, x, sy - 40, 2.4, '#c8b8ae'); ell(x - 8, sy - 26, 10, 4, '#e6dcd2'); limb(x - 8, sy - 26, x - 14, sy - 32, 1, '#8a7a72');
    circ(x, sy - 42, 3, on ? '#ff6a3a' : '#7a3a2a');
    if (on) glowAt(x, sy - 42, 14, 'rgba(255,110,60,0.9)', 0.7);
  },
  hoard(sy) {
    const x = propX(), k = 0.5 + 0.5 * Math.sin(G.frame * 0.06);
    for (let i = 0; i < 4; i++) ell(x, sy - i * 4, 24 - i * 5, 5, i % 2 ? '#c8962e' : '#e0ae3e');
    poly([x - 9, sy - 34, x + 9, sy - 34, x + 5, sy - 22, x - 5, sy - 22], '#e0ae3e'); box(x - 1.5, sy - 22, 3, 8, '#c8962e'); box(x - 6, sy - 15, 12, 2.4, '#c8962e');
    circ(x - 3, sy - 29, 1.6, '#3a8ad8'); circ(x + 3, sy - 29, 1.6, '#d8304a');
    glowAt(x + 18, sy - 12, 22, 'rgba(230,240,255,0.9)', 0.4 + k * 0.4);
    poly([x + 18, sy - 18, x + 23, sy - 12, x + 18, sy - 7, x + 13, sy - 12], '#f4f8ff');
  },
  idol(sy) {
    const x = propX(), k = 0.5 + 0.5 * Math.sin(G.frame * 0.05);
    box(x - 10, sy - 26, 20, 26, '#7a6448'); box(x - 13, sy - 29, 26, 4, '#9a8264');
    glowAt(x, sy - 38, 30, 'rgba(255,210,90,0.9)', 0.3 + k * 0.25);
    ell(x, sy - 34, 6, 5, '#e8b830'); circ(x, sy - 42, 5, '#f2c840'); box(x - 2.6, sy - 43, 2, 1.4, '#7a5a10'); box(x + 0.8, sy - 43, 2, 1.4, '#7a5a10');
    ell(x + 22, sy - 6, 9, 7, '#b89a6a'); box(x + 19, sy - 15, 6, 4, '#a0845a'); limb(x + 18, sy - 14, x + 26, sy - 14, 1.2, '#6a5030');
  },
  deephalls(sy) {
    const x = propX();
    ell(x, sy - 2, 22, 6, '#2a303a'); box(x - 22, sy - 16, 44, 14, '#3a404c'); ell(x, sy - 16, 22, 6, '#4a5260'); ell(x, sy - 16, 17, 4, '#06080c');
    for (let k = 0; k < 4; k++) box(x - 20 + k * 11, sy - 14, 1.2, 12, 'rgba(0,0,0,0.3)');
    limb(x - 20, sy - 16, x - 20, sy - 42, 2, '#4a3a2a'); limb(x + 20, sy - 16, x + 20, sy - 42, 2, '#4a3a2a'); limb(x - 22, sy - 42, x + 22, sy - 42, 2.4, '#4a3a2a');
    const by = sy - 30 + Math.sin(G.frame * 0.03) * 2;
    limb(x, sy - 42, x, by, 0.8, '#8a7a6a'); box(x - 4, by, 8, 7, '#6a4a2e');
  },
  shrine(sy) {
    const x = propX();
    pot(x - 14, sy, 0.8, '#b8643a', false); pot(x + 10, sy, 1, '#a85a34', true); pot(x + 28, sy, 0.6, '#c8744a', false);
  },
  twinsuns(sy) {
    const x = propX(), on = (G.frame % 90) < 45;
    dome(x, sy, 22, '#e8c898', 'rgba(150,100,60,0.25)');
    ctx.fillStyle = '#3a2418'; ctx.beginPath(); ctx.arc(x - 4, sy, 7, Math.PI, 0); ctx.fill();
    glowAt(x - 4, sy - 3, 10, 'rgba(255,200,120,0.9)', 0.4);
    limb(x + 14, sy - 14, x + 14, sy - 46, 1.6, '#a89880'); ell(x + 14, sy - 30, 5, 1.6, '#c8b898'); ell(x + 14, sy - 38, 4, 1.4, '#c8b898');
    circ(x + 14, sy - 47, 2, on ? '#ff5a3a' : '#6a3a2a');
  },
  future(sy) {
    const x = propX(), f = G.frame, k = 0.5 + 0.5 * Math.sin(f * 0.05);
    glowAt(x, sy - 30, 40, 'rgba(120,220,255,0.9)', 0.25 + k * 0.2);
    ctx.fillStyle = '#b8bccc'; rr(x - 14, sy - 62, 28, 62, 12); ctx.fill();
    ctx.fillStyle = 'rgba(190,235,255,0.85)'; rr(x - 9, sy - 54, 18, 40, 8); ctx.fill();
    for (let i = 0; i < 6; i++) circ(x - 6 + SR(i, 760) * 12, sy - 50 + SR(i, 761) * 32, 1.4 + SR(i, 762), 'rgba(255,255,255,0.9)');
    box(x - 10, sy - 10, 20, 3, '#5af0ff');
    for (let i = 0; i < 3; i++) { const t = (f * 0.015 + i / 3) % 1; alpha(1 - t); circ(x - 10 + i * 10, sy - 64 - t * 20, 1.6, '#e8faff'); alpha(1); }
  },
  ring(sy) {
    const x = propX(), f = G.frame, k = 0.5 + 0.5 * Math.sin(f * 0.07);
    poly([x - 12, sy, x - 8, sy - 26, x + 8, sy - 30, x + 12, sy], '#7a8494'); poly([x - 8, sy - 26, x + 8, sy - 30, x + 6, sy - 24, x - 6, sy - 21], '#9aa4b4');
    box(x - 1, sy - 20, 2, 18, '#7ae8ff');
    alpha(0.35 + k * 0.3);
    poly([x - 4, sy - 32, x + 4, sy - 34, x + 14, sy - 60, x - 14, sy - 56], 'rgba(120,230,255,0.5)');
    alpha(1);
    for (let i = 0; i < 3; i++) box(x - 6 + i * 4, sy - 46 + Math.sin(f * 0.1 + i) * 4, 2, 2, '#c8f8ff');
  },
});

Object.assign(SCENE_PARTICLES, {
  beacons: { fills: ['rgba(255,140,60,0.45)', 'rgba(255,190,90,0.6)', 'rgba(255,230,160,0.75)'], speed: -0.6, shape: 'dot' },
  icewall: { fills: SNOW_FILLS, speed: 1.4, shape: 'dot' },
  shelter: { fills: ['rgba(220,200,140,0.25)', 'rgba(200,180,120,0.35)', 'rgba(240,230,180,0.45)'], speed: 0.4, shape: 'dot' },
  cocoa: { fills: ['rgba(255,138,184,0.6)', 'rgba(122,216,255,0.6)', 'rgba(255,216,74,0.7)'], speed: 0.7, shape: 'square' },
  skyisle: { fills: ['rgba(255,255,255,0.4)', 'rgba(200,240,190,0.5)', 'rgba(255,255,220,0.6)'], speed: 0.35, shape: 'dot' },
  colony: { fills: ['rgba(255,210,170,0.25)', 'rgba(255,190,140,0.35)', 'rgba(255,240,220,0.45)'], speed: 0.25, shape: 'dot' },
  hoard: { fills: ['rgba(255,215,90,0.45)', 'rgba(255,200,70,0.6)', 'rgba(255,245,190,0.75)'], speed: -0.3, shape: 'square' },
  idol: { fills: ['rgba(200,170,120,0.25)', 'rgba(220,190,140,0.35)', 'rgba(255,230,180,0.45)'], speed: 0.3, shape: 'dot' },
  deephalls: { fills: ['rgba(170,190,220,0.18)', 'rgba(190,210,240,0.28)', 'rgba(255,140,80,0.4)'], speed: 0.5, shape: 'dot' },
  shrine: { fills: ['rgba(200,255,160,0.35)', 'rgba(255,255,200,0.5)', 'rgba(255,230,120,0.6)'], speed: -0.2, shape: 'dot' },
  twinsuns: { fills: ['rgba(255,214,160,0.3)', 'rgba(240,190,130,0.4)', 'rgba(255,235,200,0.5)'], speed: 0.4, shape: 'dot' },
  future: { fills: ['rgba(90,240,255,0.5)', 'rgba(255,90,200,0.5)', 'rgba(255,228,106,0.6)'], speed: 0.5, shape: 'square' },
  ring: { fills: ['rgba(200,240,255,0.2)', 'rgba(120,230,255,0.35)', 'rgba(255,255,255,0.4)'], speed: 0.25, shape: 'dot' },
});

Object.assign(SPECIAL_FALLERS, {
  beacons: 'fireball', icewall: 'snowclump', shelter: 'bottlecap', cocoa: 'bonbon', skyisle: 'shard', colony: 'hexnut',
  hoard: 'coin', idol: 'boulder', deephalls: 'rock', shrine: 'acorn', twinsuns: 'cog', future: 'can', ring: 'shard',
});
Object.assign(FALLER_COLORS, { bottlecap: ['#c8403a', '#f2e8d0'], bonbon: ['#5a2e14', '#ff8ab8'], can: ['#3fd0c8', '#f4f4f4'] });
Object.assign(EXTRA_FALLERS, {
  bottlecap(s, r, c1, c2, path, spin) {
    spin();
    ctx.fillStyle = c1; ctx.beginPath();
    for (let i = 0; i < 21; i++) { const a = i / 21 * Math.PI * 2, rr2 = s * (i % 2 ? 0.92 : 1.05); ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); }
    ctx.closePath(); ctx.fill(); outline();
    circ(0, 0, s * 0.68, c2); starShape(0, 0, s * 0.4, c1);
  },
  bonbon(s, r, c1, c2, path, spin) {
    spin();
    for (const d of [-1, 1]) { tri(d * s * 0.7, 0, d * s * 1.6, -s * 0.6, d * s * 1.6, s * 0.6, c2); }
    ctx.fillStyle = c1; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.85, s * 0.7, 0, 0, Math.PI * 2); ctx.fill(); outline();
    ctx.strokeStyle = c2; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 0.1); ctx.quadraticCurveTo(0, -s * 0.5, s * 0.5, -s * 0.1); ctx.stroke();
  },
  can(s, r, c1, c2, path, spin) {
    spin();
    ctx.fillStyle = c1; rr(-s * 0.6, -s, s * 1.2, s * 2, s * 0.25); ctx.fill(); outline();
    box(-s * 0.6, -s * 0.2, s * 1.2, s * 0.5, c2); circ(0, s * 0.05, s * 0.2, '#ff5ac8');
    box(-s * 0.5, -s, s, s * 0.14, '#d8dce8');
  },
});
