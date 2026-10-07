'use strict';

const box = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
const skyFill = (h, stops) => { ctx.fillStyle = vgrad(0, h, stops); ctx.fillRect(0, 0, GW, h); };
function ridge(h, y0, amp, color, seed) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0, h);
  for (let x = 0; x <= GW + 12; x += 12) ctx.lineTo(x, y0 + Math.sin(x * 0.013 + seed) * amp + Math.sin(x * 0.037 + seed * 2.1) * amp * 0.35);
  ctx.lineTo(GW, h); ctx.closePath(); ctx.fill();
}
function jag(h, base, hgt, color, seed, snow) {
  const pts = [];
  for (let i = 0, x = -10; x <= GW + 30; i++, x += 26) pts.push([x, base - (0.25 + 0.75 * SR(i + seed * 50, 330)) * hgt * (0.7 + 0.3 * Math.sin(x * 0.011 + seed))]);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(-10, h);
  for (const [x, y] of pts) ctx.lineTo(x, y);
  ctx.lineTo(GW + 30, h); ctx.closePath(); ctx.fill();
  if (!snow) return;
  ctx.save(); ctx.clip();
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    if (y < pts[i - 1][1] && y < pts[i + 1][1] && y < base - hgt * 0.45) tri(x - 16, y + 20, x + 16, y + 20, x, y, 'rgba(235,245,255,0.75)');
  }
  ctx.restore();
}
function seedling(x, y, s) {
  glow(x, y - 26 * s, 38 * s, 'rgba(190,255,200,0.5)');
  limb(x, y, x, y - 24 * s, 2.4 * s, '#3d7a46');
  ell(x - 8 * s, y - 18 * s, 8 * s, 4 * s, '#5fc470'); ell(x + 8 * s, y - 25 * s, 8 * s, 4 * s, '#8be894');
  circ(x, y - 27 * s, 2.6 * s, '#e6ffe0');
}
function paperLantern(x, y, s, a) {
  alpha(a);
  glowAt(x, y, 30 * s, 'rgba(255,190,110,0.9)', 0.55);
  ctx.fillStyle = '#ffb25a'; ctx.beginPath(); ctx.ellipse(x, y, 9 * s, 12 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffd7a0'; ctx.beginPath(); ctx.ellipse(x - 2.5 * s, y - 2 * s, 3 * s, 6 * s, 0, 0, Math.PI * 2); ctx.fill();
  box(x - 4 * s, y - 13 * s, 8 * s, 2.4 * s, '#6a3a22'); box(x - 4 * s, y + 11 * s, 8 * s, 2.4 * s, '#6a3a22');
  limb(x, y + 13 * s, x + 2 * s, y + 22 * s, 1.2, '#6a3a22');
  alpha(1);
}

Object.assign(SCENES, {
  journey: {
    far(h) {
      skyFill(h, ['#2a1a46', '#9a4a6a', '#e8845a', '#f7c885']);
      for (let i = 0; i < 40; i++) box(SR(i, 300) * GW, SR(i, 301) * h * 0.3, 1.5, 1.5, `rgba(255,240,230,${0.2 + SR(i, 302) * 0.5})`);
      glow(GW * 0.28, h * 0.5, 170, 'rgba(255,214,150,0.65)');
      circ(GW * 0.28, h * 0.5, 36, '#fff1c8');
      const mx = GW * 0.7, base = h * 0.64, top = h * 0.2;
      poly([mx - 170, base, mx, top, mx + 170, base], '#5a2e4e');
      poly([mx, top, mx + 170, base, mx + 40, base], '#3c1f3c');
      ridge(h, h * 0.66, 20, '#a8506a', 1); ridge(h, h * 0.73, 26, '#8a3a56', 2.3);
      ridge(h, h * 0.82, 30, '#5e2646', 4.1); ridge(h, h * 0.92, 24, '#3a1632', 5.5);
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        for (let i = 0; i < 4; i++) {
          const y = 90 + i * (T - 180) / 3, wd = 26 + SR(i + side * 9, 303) * 18;
          ell(x0, y, wd, 66 + SR(i, 304) * 22, i % 2 ? '#c4755a' : '#b0634f');
          ell(x0 + dir * 6, y - 18, wd * 0.62, 34, 'rgba(255,214,160,0.2)');
        }
        const bx = x0 + dir * 44, by = T * (side ? 0.3 : 0.74);
        limb(bx, by, bx, by - 72, 3, '#3a1a2e');
        ctx.fillStyle = '#d63a3a';
        ctx.beginPath(); ctx.moveTo(bx, by - 70); ctx.bezierCurveTo(bx + dir * 18, by - 78, bx + dir * 30, by - 58, bx + dir * 48, by - 64);
        ctx.lineTo(bx + dir * 48, by - 54); ctx.bezierCurveTo(bx + dir * 30, by - 48, bx + dir * 18, by - 66, bx, by - 58); ctx.fill();
      }
    },
    live() {
      const f = G.frame;
      ctx.strokeStyle = 'rgba(255,224,190,0.22)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
      for (let i = 0; i < 5; i++) {
        const x = ((f * (1.6 + i * 0.3) + i * 170) % (GW + 200)) - 100, y = H * (0.28 + i * 0.09);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 50 + i * 8, y - 3); ctx.stroke();
      }
      const p = f % 1000;
      if (p < 440) {
        const x = -30 + p * 1.25, y = H * 0.4 + Math.sin(p * 0.03) * 36;
        ctx.strokeStyle = 'rgba(58,26,46,0.85)'; ctx.lineWidth = 1.8;
        for (let k = 0; k < 5; k++) {
          const bx = x - k * 20, by = y + (k % 2 ? 9 : -5) * (k > 0 ? 1 : 0) + Math.sin(p * 0.05 + k) * 3, fl = Math.sin(p * 0.24 + k * 1.3) * 4;
          ctx.beginPath(); ctx.moveTo(bx - 7, by - fl); ctx.quadraticCurveTo(bx - 3, by - fl - 4, bx, by); ctx.quadraticCurveTo(bx + 3, by - fl - 4, bx + 7, by - fl); ctx.stroke();
        }
      }
    },
  },

  grove: {
    far(h) {
      skyFill(h, ['#050f16', '#0f2e34', '#1d4a3c', '#10281f']);
      glow(GW * 0.2, h * 0.14, 130, 'rgba(210,240,255,0.35)'); circ(GW * 0.2, h * 0.14, 26, '#eef6f2');
      for (const [layer, col, ty] of [[0, '#0a1e1c', 0.62], [1, '#07140f', 0.74]]) {
        for (let i = 0; i < 9; i++) {
          const x = SR(i + layer * 20, 310) * GW, hh = 140 + SR(i + layer * 20, 311) * 110, base = h * ty + 60;
          box(x - 8, base - hh, 16, hh + 220, col);
          circ(x, base - hh, 40 + SR(i, 312) * 26, col); circ(x - 28, base - hh + 24, 30, col); circ(x + 30, base - hh + 18, 32, col);
        }
      }
      const cx = GW / 2, py = h * 0.74;
      const g = ctx.createLinearGradient(0, 0, 0, py);
      g.addColorStop(0, 'rgba(210,255,230,0)'); g.addColorStop(1, 'rgba(210,255,230,0.3)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(cx - 24, 0); ctx.lineTo(cx + 24, 0); ctx.lineTo(cx + 74, py); ctx.lineTo(cx - 74, py); ctx.closePath(); ctx.fill();
      box(0, py + 28, GW, h, '#0b1f17');
      for (let i = 0; i < 40; i++) { const x = SR(i, 313) * GW; tri(x - 3, py + 30, x + 3, py + 30, x, py + 16 - SR(i, 314) * 8, '#12301f'); }
      glow(cx, py - 8, 80, 'rgba(190,255,220,0.35)');
      ctx.fillStyle = '#46564e'; rr(cx - 36, py + 4, 72, 44, 4); ctx.fill();
      ctx.fillStyle = '#5f7066'; rr(cx - 36, py + 4, 72, 8, 4); ctx.fill();
      for (let i = 0; i < 5; i++) ell(cx - 30 + i * 15, py + 5, 8, 3, '#4f9a52');
      seedling(cx, py + 3, 1);
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, tw = 30, tx = side ? x0 - tw : x0;
        box(tx, 0, tw, T, '#2a1f17');
        for (let y = 0; y < T; y += 26) box(tx + SR(y + side * 3, 313) * 20, y, 3 + SR(y, 314) * 8, 14, 'rgba(0,0,0,0.25)');
        box(side ? tx : tx + tw - 4, 0, 4, T, 'rgba(255,255,255,0.05)');
        for (let i = 0; i < 5; i++) ell(tx + (side ? 6 : tw - 6), 50 + i * 110 + side * 24, 8, 26, 'rgba(70,140,70,0.55)');
        for (const cy of [110, 340, 570]) {
          const y = cy + side * 40 - 20;
          for (let k = 0; k < 5; k++) circ(tx + (side ? 0 : tw) + dir * (10 + k * 13), y + Math.sin(k * 2 + side) * 14, 18 + (k % 2) * 6, k % 2 ? '#123a24' : '#0d2c1c');
          for (let k = 0; k < 3; k++) { const vx = tx + (side ? 0 : tw) + dir * (24 + k * 20); limb(vx, y + 14, vx + dir * 2, y + 44 + k * 10, 1.6, '#1d5a30'); circ(vx + dir * 2, y + 44 + k * 10, 2.2, '#2f8a48'); }
        }
        for (const my of [T * 0.28, T * 0.8]) {
          const mx = tx + (side ? 1 : tw - 1);
          limb(mx, my, mx + dir * 7, my - 4, 2.4, '#cfe8e0'); ell(mx + dir * 9, my - 6, 6, 4, '#4fe0d0'); circ(mx + dir * 8, my - 7, 1.1, '#e8fff8');
        }
      }
    },
    live() {
      const f = G.frame;
      for (let i = 0; i < 16; i++) {
        const x = SR(i, 315) * GW + Math.sin(f * 0.012 + i * 2) * 26;
        const y = (SR(i, 316) * H + f * (0.1 + SR(i, 317) * 0.2) * (i % 2 ? -1 : 1) + H * 4) % H;
        glowAt(x, y, 10 + (i % 3) * 3, 'rgba(210,255,140,0.9)', 0.4 + 0.5 * Math.abs(Math.sin(f * 0.04 + i)));
      }
    },
  },

  celeste: {
    far(h) {
      skyFill(h, ['#1f1244', '#6a2e86', '#d9588a', '#ffb18a']);
      for (let i = 0; i < 70; i++) { const s = SR(i, 320) > 0.85 ? 3 : 2; box(Math.round(SR(i, 321) * GW / 2) * 2, Math.round(SR(i, 322) * h * 0.4 / 2) * 2, s, s, `rgba(255,240,250,${0.25 + SR(i, 323) * 0.6})`); }
      const mount = (cx, base, hgt, w, lit, dark, snow) => {
        const ay = base - hgt, ridgeX = cx + w * 0.08;
        ctx.save();
        ctx.beginPath(); ctx.moveTo(cx - w, h); ctx.lineTo(cx - w * 0.64, ay + hgt * 0.54); ctx.lineTo(cx - w * 0.36, ay + hgt * 0.36); ctx.lineTo(cx - w * 0.15, ay + hgt * 0.1);
        ctx.lineTo(cx, ay); ctx.lineTo(cx + w * 0.22, ay + hgt * 0.26); ctx.lineTo(cx + w * 0.42, ay + hgt * 0.4); ctx.lineTo(cx + w * 0.7, ay + hgt * 0.64); ctx.lineTo(cx + w, h); ctx.closePath();
        ctx.clip();
        box(cx - w, ay - 4, ridgeX - cx + w, h, lit); box(ridgeX, ay - 4, w * 1.1, h, dark);
        if (snow) {
          for (const [x0, x1, col] of [[cx - w, ridgeX, '#fff0f6'], [ridgeX, cx + w, '#d8c8ee']]) {
            ctx.save(); ctx.beginPath(); ctx.rect(x0, ay - 4, x1 - x0, hgt); ctx.clip();
            ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx - w, ay - 4); ctx.lineTo(cx + w, ay - 4);
            for (let k = 8; k >= 0; k--) ctx.lineTo(cx - w + k * w / 4, ay + hgt * 0.3 + (k % 2 ? 12 : -4) + SR(k + cx, 324) * 8);
            ctx.closePath(); ctx.fill(); ctx.restore();
          }
        }
        ctx.restore();
      };
      mount(GW * 0.72, h * 0.66, h * 0.4, 210, '#a94a8e', '#5a2a7a', true);
      mount(GW * 0.2, h * 0.74, h * 0.22, 150, '#8e3f86', '#4e2470', true);
      mount(GW * 0.5, h * 0.84, h * 0.16, 260, '#5d2a6e', '#3c1d5c', false);
      box(0, h * 0.94, GW, h * 0.06, '#24103e');
    },
    near(T) {
      const cols = ['#5ab4ff', '#ffffff', '#ff5a6e', '#6bd36b', '#ffd93d'];
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        for (let i = 0; i < 5; i++) {
          const y = 70 + i * (T - 140) / 4;
          ell(x0, y, 30 + SR(i + side * 7, 325) * 14, 54, '#e4d8f2'); ell(x0 + dir * 4, y - 8, 20, 34, '#ffffff');
        }
        for (const fy of [T * 0.2 + side * 30, T * 0.64 - side * 20]) {
          const ex = x0 + dir * 84, ey = fy + 30, cxm = (x0 + ex) / 2, cym = fy + 44;
          ctx.strokeStyle = 'rgba(40,20,50,0.7)'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(x0, fy); ctx.quadraticCurveTo(cxm, cym, ex, ey); ctx.stroke();
          for (let k = 1; k < 7; k++) {
            const [px, py] = qpt(x0, fy, cxm, cym, ex, ey, k / 7);
            ctx.fillStyle = cols[k % 5]; ctx.fillRect(px - 5, py, 10, 12);
          }
        }
      }
    },
    live() {
      const f = G.frame;
      ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        const x = ((f * (2.2 + i * 0.35) + i * 130) % (GW + 160)) - 80, y = H * (0.18 + i * 0.1) + Math.sin(f * 0.02 + i) * 6;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 40 + i * 6, y); ctx.stroke();
      }
      paperLantern(GW * 0.3, H * 0.5 + Math.sin(f * 0.04) * 8, 1.1, 0.7);
      paperLantern(GW * 0.72, H * 0.58 + Math.sin(f * 0.04 + 2) * 8, 1.1, 0.7);
    },
  },

  dragon: {
    far(h) {
      skyFill(h, ['#04081a', '#0d2444', '#2a5a7c', '#7ea6c0']);
      for (let i = 0; i < 60; i++) box(SR(i, 331) * GW, SR(i, 332) * h * 0.45, 1.5, 1.5, `rgba(255,255,255,${0.3 + SR(i, 333) * 0.6})`);
      glow(GW * 0.78, h * 0.13, 120, 'rgba(210,230,255,0.3)'); circ(GW * 0.78, h * 0.13, 22, '#e9f1ff');
      [['90,255,170', 0.1, 0], ['150,120,255', 0.16, 2], ['70,230,255', 0.22, 4]].forEach(([rgb, y0, ph]) => {
        const g = ctx.createLinearGradient(0, 0, 0, h * 0.4);
        g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(0.45, `rgba(${rgb},0.34)`); g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0);
        for (let x = 0; x <= GW + 10; x += 10) ctx.lineTo(x, h * y0 + Math.sin(x * 0.02 + ph) * 28 + Math.sin(x * 0.05 + ph) * 8);
        for (let x = GW; x >= 0; x -= 10) ctx.lineTo(x, h * y0 + 90 + Math.sin(x * 0.017 + ph) * 22);
        ctx.closePath(); ctx.fill();
      });
      jag(h, h * 0.62, 150, '#1b3552', 1, true); jag(h, h * 0.72, 120, '#122a44', 2, true); jag(h, h * 0.84, 80, '#0b1d33', 3, false);
      const tx = GW * 0.8, ty = h * 0.7;
      box(tx - 16, ty - 70, 32, 72, '#0a1829'); box(tx - 22, ty - 78, 14, 10, '#0a1829'); box(tx + 4, ty - 84, 14, 16, '#0a1829');
      box(tx - 4, ty - 52, 8, 12, 'rgba(255,190,90,0.9)');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        for (let i = 0; i < 4; i++) {
          const x = x0 + dir * (14 + SR(i + side * 5, 334) * 20), base = 130 + i * (T - 150) / 3, ht = 90 + SR(i, 335) * 30;
          for (let k = 0; k < 5; k++) {
            const y = base - k * ht / 6, hw = (5 - k) * ht / 22 + 4;
            tri(x - hw, y, x + hw, y, x, y - ht / 3.2, '#0c1c22');
            tri(x - hw * 0.8, y - 2, x + hw * 0.8, y - 2, x, y - ht / 4.2, 'rgba(235,245,255,0.7)');
          }
        }
        const rx = x0 + dir * 52, ry = T * (side ? 0.36 : 0.7);
        poly([rx - 12, ry + 36, rx - 9, ry - 12, rx, ry - 22, rx + 10, ry - 10, rx + 13, ry + 36], '#2a3550');
        poly([rx - 12, ry + 36, rx - 9, ry - 12, rx - 3, ry - 17, rx - 4, ry + 36], '#35436a');
        ctx.strokeStyle = 'rgba(150,190,230,0.45)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(rx + 2, ry - 14); ctx.lineTo(rx - 1, ry + 4); ctx.lineTo(rx + 4, ry + 18); ctx.stroke();
      }
    },
    live() {
      const p = G.frame % 1500;
      if (p > 560) return;
      const x = GW + 70 - p * 1.35, y = H * 0.22 + Math.sin(p * 0.02) * 16, fl = Math.sin(p * 0.16);
      ctx.fillStyle = 'rgba(6,12,24,0.9)';
      ctx.beginPath(); ctx.ellipse(x, y, 24, 7, 0.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - 20, y - 3); ctx.quadraticCurveTo(x - 34, y - 12, x - 44, y - 6); ctx.lineTo(x - 36, y + 1); ctx.quadraticCurveTo(x - 28, y + 4, x - 20, y + 4); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + 20, y); ctx.quadraticCurveTo(x + 46, y + 8, x + 70, y - 4); ctx.quadraticCurveTo(x + 46, y + 2, x + 20, y + 4); ctx.fill();
      for (const k of [0, 1]) {
        const wy = y - 30 - fl * 24 - k * 4, wx = x + 8 + k * 12;
        poly([x - 2 + k * 6, y - 4, wx - 20, wy + 6, wx - 4, wy - 8, wx + 18, wy + 12, wx + 28, y - 2], k ? 'rgba(6,12,24,0.7)' : 'rgba(6,12,24,0.95)');
      }
    },
  },

  blocks: {
    far(h) {
      skyFill(h, ['#4fb0ff', '#8cd0ff', '#cdebff']);
      const sx = GW * 0.78, sy = h * 0.12;
      glow(sx, sy, 130, 'rgba(255,240,150,0.5)'); circ(sx, sy, 36, '#ffe44d'); circ(sx, sy, 27, '#fff38a');
      // rolling fields stitched together like a quilt
      const field = (y0, amp, seed, cols, cell) => {
        ctx.save(); ctx.beginPath(); ctx.moveTo(0, h);
        for (let x = 0; x <= GW + 12; x += 12) ctx.lineTo(x, y0 + Math.sin(x * 0.013 + seed) * amp + Math.sin(x * 0.037 + seed * 2.1) * amp * 0.35);
        ctx.lineTo(GW, h); ctx.closePath(); ctx.clip();
        const top = y0 - amp * 1.5;
        for (let r = 0; top + r * cell < h; r++) for (let c = -1; c * cell * 1.5 < GW + cell; c++) {
          const x = c * cell * 1.5 + (r % 2) * cell * 0.75, y = top + r * cell;
          box(x, y, cell * 1.5, cell, cols[Math.floor(SR(r * 40 + c + seed * 13, 340) * cols.length)]);
        }
        ctx.strokeStyle = 'rgba(255,244,190,0.45)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        for (let r = 0; top + r * cell < h; r++) for (let c = -1; c * cell * 1.5 < GW + cell; c++) {
          ctx.strokeRect(c * cell * 1.5 + (r % 2) * cell * 0.75 + 2, top + r * cell + 2, cell * 1.5 - 4, cell - 4);
        }
        ctx.setLineDash([]); ctx.restore();
      };
      field(h * 0.58, 34, 1, ['#7ccb66', '#8fd470', '#a6d667', '#6fbe5e'], 30);
      const tree = (x, base) => { box(x - 4, base - 54, 8, 54, '#6b4a2a'); circ(x, base - 66, 26, '#3f9a3a'); circ(x - 14, base - 54, 16, '#4fb04a'); circ(x + 15, base - 56, 17, '#4fb04a'); };
      tree(GW * 0.2, h * 0.62); tree(GW * 0.62, h * 0.64);
      field(h * 0.72, 26, 3, ['#68b852', '#c7c85a', '#7ac060', '#d8b64e'], 28);
      field(h * 0.84, 18, 5, ['#58a844', '#b89a46', '#6cae4e', '#9a7a3c'], 26);
      field(h * 0.94, 12, 7, ['#4a9a38', '#8a6a46', '#5aa240'], 24);
    },
    near(T) {
      const tones = ['#8a9096', '#767c82', '#9ba0a5', '#6c7278'];
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, wd = 46, rowH = 18;
        for (let row = 0; row * rowH < T; row++) {
          let cx = 0, i = 0;
          while (cx < wd - 2) {
            const w1 = Math.min(18 + SR(row * 7 + i + side * 99, 343) * 16, wd - cx), x = side ? x0 - cx - w1 : x0 + cx;
            ctx.fillStyle = tones[(row + i + side) % 4]; rr(x + 1, row * rowH + 1, w1 - 2, rowH - 2, 5); ctx.fill();
            box(x + 4, row * rowH + 2, w1 - 8, 2, 'rgba(255,255,255,0.16)');
            cx += w1; i++;
          }
        }
        const ty = T * (side ? 0.44 : 0.76), tx = x0 + dir * (wd + 8);
        limb(tx, ty - 14, tx, ty + 8, 2, '#3a3a40'); box(tx - 5, ty - 22, 10, 9, '#2a2a30');
        glowAt(tx, ty - 17, 22, 'rgba(255,190,80,0.8)', 0.75); circ(tx, ty - 17, 3, '#ffe6a0');
      }
    },
    live() {
      const f = G.frame;
      [[0, 0.1, 0.25, 0.9], [1, 0.22, 0.18, 0.8], [2, 0.34, 0.3, 0.7], [3, 0.16, 0.12, 0.85]].forEach(([i, ky, sp, a]) => {
        puffCloud(((f * sp + i * 190) % (GW + 220)) - 90, H * ky, 18, a);
      });
    },
  },

  hollow: {
    far(h) {
      skyFill(h, ['#03050b', '#0a1222', '#142038', '#0b1424']);
      for (let i = 0; i < 9; i++) {
        const x = SR(i, 350) * GW, w = 16 + SR(i, 351) * 26, len = 60 + SR(i, 352) * 150;
        tri(x - w, 0, x + w, 0, x, len, i % 2 ? '#0a1020' : '#0e1830');
      }
      for (let i = 0; i < 6; i++) { const x = 40 + SR(i, 353) * (GW - 80), top = h * (0.25 + SR(i, 354) * 0.3); box(x - 9, top, 18, h, '#0e182c'); box(x - 11, top, 22, 8, '#16233c'); }
      glow(GW * 0.3, h * 0.55, 120, 'rgba(120,170,255,0.12)'); glow(GW * 0.75, h * 0.3, 100, 'rgba(120,170,255,0.1)');
      ridge(h, h * 0.86, 16, '#08101e', 2); box(0, h * 0.94, GW, h, '#060b16');
      for (let i = 0; i < 7; i++) { const x = SR(i, 355) * GW; glow(x, h * 0.92, 22, 'rgba(100,200,255,0.4)'); ell(x, h * 0.93, 7, 4, '#3fa8e8'); }
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        ctx.fillStyle = '#080e1c';
        ctx.beginPath(); ctx.moveTo(x0, 0);
        for (let y = 0; y <= T; y += 32) ctx.lineTo(x0 + dir * (10 + SR(y + side * 777, 356) * 36), y);
        ctx.lineTo(x0, T); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(90,170,255,0.5)'; ctx.lineWidth = 1.4;
        for (let v = 0; v < 3; v++) {
          let x = x0 + dir * 6, y = 30 + v * T / 3.2;
          ctx.beginPath(); ctx.moveTo(x, y);
          for (let k = 0; k < 6; k++) { x += dir * (2 + SR(v * 7 + k + side * 50, 357) * 6); y += 14 + SR(v * 5 + k, 358) * 14; ctx.lineTo(x, y); }
          ctx.stroke();
        }
        for (let i = 0; i < 4; i++) {
          const y = 90 + i * (T - 180) / 3, rx = x0 + dir * (18 + SR(i + side * 4, 359) * 22);
          limb(rx, y, rx + dir * 2, y + 54 + i * 6, 1.1, 'rgba(200,220,255,0.35)');
          circ(rx + dir * 2, y + 54 + i * 6, 2.4, 'rgba(230,240,255,0.7)');
        }
        const fy = T * (side ? 0.62 : 0.3), fx = x0 + dir * 30;
        limb(fx, fy, fx + dir * 3, fy - 16, 1.8, '#9ad0ff'); circ(fx + dir * 3, fy - 19, 4.4, '#4fb8ff'); circ(fx + dir * 3, fy - 19, 2, '#e8f8ff');
      }
    },
    live() {
      const f = G.frame;
      for (let i = 0; i < 14; i++) {
        const x = SR(i, 360) * GW + Math.sin(f * 0.01 + i) * 18, y = H - ((SR(i, 361) * H + f * (0.18 + SR(i, 362) * 0.3)) % H);
        glowAt(x, y, 8, 'rgba(210,230,255,0.9)', 0.25 + 0.4 * Math.abs(Math.sin(f * 0.03 + i * 1.7)));
      }
    },
  },
});

const SPECIAL_PLATFORMS = {
  journey(x, sy, w, h) {
    ctx.fillStyle = '#b9714f'; rr(x, sy, w, h, 6); ctx.fill();
    ctx.fillStyle = '#e6b288'; rr(x, sy, w, 6, 5); ctx.fill();
    box(x + 4, sy + h - 4, w - 8, 3, 'rgba(70,30,40,0.3)');
    ctx.strokeStyle = '#ffe3a8'; ctx.lineWidth = 1.3; ctx.lineCap = 'round';
    ctx.beginPath();
    for (let bx = x + 12; bx < x + w - 10; bx += 22) { ctx.moveTo(bx, sy + 8); ctx.lineTo(bx + 6, sy + 8); ctx.lineTo(bx + 6, sy + 13); ctx.moveTo(bx + 11, sy + 8); ctx.lineTo(bx + 11, sy + 13); }
    ctx.stroke();
  },
  grove(x, sy, w, h) {
    ctx.fillStyle = '#44544a'; rr(x, sy, w, h, 6); ctx.fill();
    box(x + 4, sy + h - 4, w - 8, 3, 'rgba(0,0,0,0.25)');
    for (let bx = x + 6, i = 0; bx < x + w - 4; bx += 11, i++) ell(bx, sy + 2, 7 + SR(i, 370) * 3, 4, i % 2 ? '#4fa04c' : '#5db85a');
    for (let bx = x + 20, i = 0; bx < x + w - 14; bx += 56, i++) { ell(bx, sy + 11, 4, 2, 'rgba(255,214,110,0.85)'); ell(bx + 7, sy + 13, 3, 1.6, 'rgba(255,214,110,0.6)'); }
  },
  celeste(x, sy, w, h) {
    ctx.fillStyle = '#4a3a6e'; rr(x, sy, w, h, 6); ctx.fill();
    ctx.save(); rr(x, sy, w, h, 6); ctx.clip();
    box(x, sy + h - 5, w, 5, '#36285a');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(x, sy);
    for (let bx = x; bx <= x + w; bx += 8) ctx.lineTo(bx, sy + 7 + (Math.sin(bx * 0.4) > 0.3 ? 3 : 0));
    ctx.lineTo(x + w, sy); ctx.closePath(); ctx.fill();
    ctx.restore();
    for (let bx = x + 14, i = 0; bx < x + w - 10; bx += 26, i++) box(bx, sy + 11, 3, 4, ['#5ab4ff', '#ff5a6e', '#ffd93d', '#6bd36b'][i % 4]);
  },
  dragon(x, sy, w, h) {
    ctx.fillStyle = '#3a4560'; rr(x, sy, w, h, 5); ctx.fill();
    box(x + 4, sy + h - 4, w - 8, 3, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = '#f0f6ff';
    for (let bx = x + 6, i = 0; bx < x + w - 4; bx += 12, i++) { ctx.beginPath(); ctx.arc(bx, sy + 2, 5 + SR(i + x, 371) * 3, Math.PI, 0); ctx.fill(); }
    rr(x, sy, w, 3, 2); ctx.fill();
    for (let bx = x + 12, i = 0; bx < x + w - 8; bx += 17, i++) tri(bx - 3, sy + h - 1, bx + 3, sy + h - 1, bx, sy + h + 4 + (i % 3) * 2.5, '#cfe8ff');
  },
  blocks(x, sy, w, h) {
    ctx.fillStyle = '#8a5a32'; rr(x, sy, w, h, 5); ctx.fill();
    ctx.fillStyle = '#5fb040'; rr(x, sy, w, 8, 5); ctx.fill();
    box(x + 3, sy + h - 4, w - 8, 3, 'rgba(0,0,0,0.25)');
    ctx.strokeStyle = 'rgba(255,236,170,0.85)'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(x + 5, sy + 13); ctx.lineTo(x + w - 5, sy + 13); ctx.stroke(); ctx.setLineDash([]);
  },
  hollow(x, sy, w, h) {
    ctx.fillStyle = '#1c2438'; rr(x, sy, w, h, 6); ctx.fill();
    ctx.fillStyle = '#26314c'; rr(x, sy + 6, w, h - 6, 6); ctx.fill();
    ctx.fillStyle = '#c9d8f4'; rr(x + 2, sy, w - 4, 3, 2); ctx.fill();
    for (let i = 0; i < w / 14; i++) circ(x + 6 + SR(i + x, 372) * (w - 12), sy + 6 + SR(i, 373) * (h - 10), 0.9, 'rgba(200,220,255,0.55)');
  },
};

const propX = () => GW / 2 + 80;
Object.assign(FLOOR_PROPS, {
  journey(sy) {
    const x = propX(), f = G.frame;
    limb(x, sy, x, sy - 62, 3, '#3a1a2e'); circ(x, sy - 64, 3, '#d9b25a');
    ctx.fillStyle = '#d63a3a';
    ctx.beginPath(); ctx.moveTo(x, sy - 60);
    for (let i = 0; i <= 8; i++) ctx.lineTo(x + i * 6, sy - 60 + Math.sin(f * 0.12 + i * 0.7) * 3 + i * 0.6);
    for (let i = 8; i >= 0; i--) ctx.lineTo(x + i * 6, sy - 46 + Math.sin(f * 0.12 + i * 0.7) * 3 + i * 1.4);
    ctx.closePath(); ctx.fill();
  },
  grove(sy) {
    const x = propX(), k = 0.5 + 0.5 * Math.sin(G.frame * 0.06);
    glowAt(x, sy - 30, 54 + k * 8, 'rgba(190,255,220,0.8)', 0.45 + k * 0.25);
    ctx.fillStyle = '#5d6e64'; rr(x - 16, sy - 20, 32, 20, 3); ctx.fill();
    ctx.fillStyle = '#788a80'; rr(x - 16, sy - 20, 32, 5, 3); ctx.fill();
    seedling(x, sy - 19, 0.9);
  },
  celeste(sy) {
    const x = propX(), f = G.frame;
    ell(x, sy - 1, 18, 3.4, 'rgba(0,0,0,0.25)');
    ell(x, sy - 7, 15, 8, '#7a6a98'); ell(x - 1, sy - 17, 10, 6.5, '#8e7eae'); ell(x + 1, sy - 25, 6, 4.4, '#a494c4');
    limb(x, sy - 27, x, sy - 58, 2, '#4a3a5e');
    ctx.fillStyle = '#ff5a6e'; ctx.beginPath(); ctx.moveTo(x, sy - 58);
    for (let i = 0; i <= 6; i++) ctx.lineTo(x + i * 3.4, sy - 58 + Math.sin(f * 0.14 + i * 0.8) * 2 + i * 0.5);
    for (let i = 6; i >= 0; i--) ctx.lineTo(x + i * 3.4, sy - 49 + Math.sin(f * 0.14 + i * 0.8) * 2 + i * 0.9);
    ctx.closePath(); ctx.fill();
  },
  dragon(sy) {
    const x = propX(), k = 0.6 + 0.4 * Math.sin(G.frame * 0.08);
    glowAt(x, sy - 22, 46, 'rgba(255,120,50,0.9)', 0.35 + k * 0.3);
    ell(x, sy - 1, 18, 3.4, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = '#3a4560'; ctx.beginPath(); ctx.moveTo(x, sy - 52); ctx.bezierCurveTo(x + 22, sy - 44, x + 20, sy, x, sy); ctx.bezierCurveTo(x - 20, sy, x - 22, sy - 44, x, sy - 52); ctx.fill();
    ctx.fillStyle = '#4c5a7e'; ctx.beginPath(); ctx.moveTo(x - 2, sy - 50); ctx.bezierCurveTo(x - 18, sy - 42, x - 18, sy - 6, x - 8, sy - 2); ctx.bezierCurveTo(x - 12, sy - 20, x - 12, sy - 40, x - 2, sy - 50); ctx.fill();
    ctx.save(); ctx.shadowColor = '#ff7a2a'; ctx.shadowBlur = 8 * k; ctx.strokeStyle = '#ffa24a'; ctx.lineWidth = 1.8; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x - 4, sy - 38); ctx.lineTo(x + 2, sy - 30); ctx.lineTo(x - 3, sy - 22); ctx.lineTo(x + 4, sy - 12); ctx.stroke();
    ctx.restore();
  },
  blocks(sy) {
    const x = propX();
    ell(x, sy - 1, 26, 4, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = '#e2bd52'; ctx.beginPath(); ctx.ellipse(x, sy, 22, 32, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f0d27a'; ctx.beginPath(); ctx.ellipse(x - 5, sy - 2, 12, 26, 0, Math.PI, Math.PI * 1.8); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#b8902e'; ctx.lineWidth = 1.2;
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x - 18 + i * 7, sy - 4); ctx.lineTo(x - 14 + i * 7 - (i - 2.5) * 2, sy - 28 + Math.abs(i - 2.5) * 5); ctx.stroke(); }
    limb(x + 30, sy, x + 22, sy - 44, 2, '#6b4a2a'); limb(x + 22, sy - 44, x + 16, sy - 50, 1.6, '#6b4a2a'); limb(x + 22, sy - 44, x + 28, sy - 50, 1.6, '#6b4a2a');
  },
  hollow(sy) {
    const x = propX(), k = 0.7 + 0.3 * Math.sin(G.frame * 0.05);
    for (const [dx, hh, r] of [[-22, 14, 6], [-10, 22, 8], [2, 10, 5]]) { limb(x + dx, sy, x + dx, sy - hh, 2.4, '#1a2a44'); ell(x + dx, sy - hh, r, r * 0.55, '#2a4a7a'); glowAt(x + dx, sy - hh, r * 3, 'rgba(110,190,255,0.8)', 0.4 * k); }
    limb(x + 26, sy, x + 26, sy - 46, 2.4, '#10182a'); glowAt(x + 26, sy - 52, 36, 'rgba(160,210,255,0.9)', k * 0.8);
    circ(x + 26, sy - 52, 4, '#bfe2ff'); circ(x + 26, sy - 52, 2, '#ffffff');
  },
});

Object.assign(SCENE_PARTICLES, {
  journey: { fills: ['rgba(255,224,170,0.25)', 'rgba(255,214,150,0.4)', 'rgba(255,240,200,0.55)'], speed: 0.5, shape: 'dot' },
  grove: { fills: ['rgba(190,255,120,0.4)', 'rgba(220,255,150,0.6)', 'rgba(255,255,190,0.8)'], speed: -0.25, shape: 'dot' },
  celeste: { fills: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.5)', 'rgba(255,240,250,0.7)'], speed: 1.5, shape: 'dot' },
  dragon: { fills: ['rgba(230,240,255,0.35)', 'rgba(230,240,255,0.5)', 'rgba(255,255,255,0.7)'], speed: 1.8, shape: 'dot' },
  blocks: { fills: ['rgba(255,244,170,0.4)', 'rgba(255,255,255,0.5)', 'rgba(220,255,190,0.5)'], speed: 0.6, shape: 'dot' },
  hollow: { fills: ['rgba(190,215,255,0.2)', 'rgba(200,225,255,0.35)', 'rgba(235,245,255,0.5)'], speed: -0.3, shape: 'dot' },
});

Object.assign(SPECIAL_FALLERS, {
  journey: 'scarf', grove: 'acorn', celeste: 'snowclump', dragon: 'fireball', blocks: 'woodbox', hollow: 'orb', girders: 'hexnut', hell: 'skull',
  match3: 'jewel', tetris: 'slab', hills: 'shell', mushroom: 'cog', dream: 'star', erdtree: 'goldleaf', prelude: 'shard',
  pellet: 'drone', rhythm: 'note', portal: 'flask',
});
const FALLER_COLORS = {
  scarf: ['#e04040', '#ffb2a0'], acorn: ['#b8803a', '#6a4220'], snowclump: ['#f4f8ff', '#bcd0ec'], woodbox: ['#b07a3c', '#6f4825'], orb: ['#e8f4ff', '#7fb0ff'],
};
const EXTRA_FALLERS = {
  scarf(s, r, c1, c2, path, spin) {
    spin();
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s * 1.2, -s * 0.2); ctx.bezierCurveTo(-s * 0.4, -s * 1.2, s * 0.4, s * 0.8, s * 1.2, -s * 0.2);
    ctx.strokeStyle = NAVY; ctx.lineWidth = s * 0.7; ctx.stroke();
    ctx.strokeStyle = c1; ctx.lineWidth = s * 0.45; ctx.stroke();
    ctx.strokeStyle = c2; ctx.lineWidth = 1.2; ctx.stroke();
  },
  acorn(s, r, c1, c2, path, spin) {
    spin();
    ctx.fillStyle = c1; ctx.beginPath(); ctx.moveTo(0, s * 1.3); ctx.bezierCurveTo(-s * 1.1, s * 0.6, -s * 0.9, -s * 0.3, 0, -s * 0.3); ctx.bezierCurveTo(s * 0.9, -s * 0.3, s * 1.1, s * 0.6, 0, s * 1.3); ctx.fill(); outline();
    ctx.fillStyle = c2; ctx.beginPath(); ctx.ellipse(0, -s * 0.35, s * 1.05, s * 0.65, 0, Math.PI, 0); ctx.fill(); outline();
    limb(0, -s * 0.95, s * 0.2, -s * 1.5, 2, c2);
  },
  snowclump(s, r, c1, c2, path, spin) {
    spin();
    circ(0, 0, s, c1); ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); outline();
    circ(s * 0.25, s * 0.3, s * 0.55, c2); circ(-s * 0.3, -s * 0.3, s * 0.3, '#ffffff');
  },
  woodbox(s, r, c1, c2, path, spin) {
    spin();
    ctx.fillStyle = c1; ctx.fillRect(-s * 0.9, -s * 0.9, s * 1.8, s * 1.8); ctx.beginPath(); ctx.rect(-s * 0.9, -s * 0.9, s * 1.8, s * 1.8); outline();
    ctx.strokeStyle = c2; ctx.lineWidth = s * 0.28; ctx.beginPath(); ctx.moveTo(-s * 0.8, -s * 0.8); ctx.lineTo(s * 0.8, s * 0.8); ctx.moveTo(s * 0.8, -s * 0.8); ctx.lineTo(-s * 0.8, s * 0.8); ctx.stroke();
    ctx.strokeRect(-s * 0.7, -s * 0.7, s * 1.4, s * 1.4);
  },
  orb(s, r, c1, c2) {
    glowAt(0, 0, s * 1.8, 'rgba(160,200,255,0.9)', 0.8);
    circ(0, 0, s * 0.8, c1); ctx.beginPath(); ctx.arc(0, 0, s * 0.8, 0, Math.PI * 2); outline();
    circ(-s * 0.2, -s * 0.2, s * 0.28, '#ffffff'); circ(s * 0.2, s * 0.25, s * 0.3, c2);
  },
};

function skull(x, y, r, eye, bone = '#e9e2cf') {
  circ(x, y, r, bone); rr(x - r * 0.6, y + r * 0.4, r * 1.2, r * 0.9, r * 0.25); ctx.fillStyle = bone; ctx.fill();
  ctx.fillStyle = '#1a0606'; ctx.beginPath(); ctx.ellipse(x - r * 0.4, y - r * 0.05, r * 0.28, r * 0.34, 0, 0, Math.PI * 2); ctx.ellipse(x + r * 0.4, y - r * 0.05, r * 0.28, r * 0.34, 0, 0, Math.PI * 2); ctx.fill();
  if (eye) { circ(x - r * 0.4, y - r * 0.05, r * 0.14, eye); circ(x + r * 0.4, y - r * 0.05, r * 0.14, eye); }
  tri(x - r * 0.12, y + r * 0.3, x + r * 0.12, y + r * 0.3, x, y + r * 0.1, '#1a0606');
  ctx.fillStyle = '#1a0606'; for (let i = -1; i <= 1; i++) ctx.fillRect(x + i * r * 0.32 - 0.5, y + r * 0.85, 1, r * 0.4);
}
function gem(cx, cy, s, k, a) {
  const cs = ['#ff4f6d', '#4dd0ff', '#ffd93d', '#6bcb77', '#c77dff', '#ff9f43'];
  alpha(a);
  ctx.fillStyle = cs[k % 6];
  ctx.beginPath();
  if (k % 6 === 0) ctx.arc(cx, cy, s, 0, Math.PI * 2);
  else if (k % 6 === 1) { ctx.moveTo(cx, cy - s * 1.15); ctx.quadraticCurveTo(cx + s * 1.1, cy + s * 0.3, cx, cy + s * 0.95); ctx.quadraticCurveTo(cx - s * 1.1, cy + s * 0.3, cx, cy - s * 1.15); }
  else if (k % 6 === 2) { for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5, rad = i & 1 ? s * 0.5 : s * 1.15; ctx.lineTo(cx + Math.cos(an) * rad, cy + Math.sin(an) * rad); } ctx.closePath(); }
  else if (k % 6 === 3) rr(cx - s * 0.9, cy - s * 0.9, s * 1.8, s * 1.8, s * 0.35);
  else if (k % 6 === 4) { for (let i = 0; i < 6; i++) ctx.lineTo(cx + Math.cos(i * Math.PI / 3) * s, cy + Math.sin(i * Math.PI / 3) * s); ctx.closePath(); }
  else ctx.ellipse(cx, cy, s * 1.1, s * 0.8, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.ellipse(cx - s * 0.3, cy - s * 0.35, s * 0.28, s * 0.16, -0.7, 0, Math.PI * 2); ctx.fill();
  alpha(1);
}
const TETRO_COLORS = ['#5b8fb9', '#c8795a', '#d6b66a', '#7aa384', '#9a7fb5', '#b8575f', '#6fb0b8'];
const TETRO_SHAPES = [
  [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]], [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
  [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1]], [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]], [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]], [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1]],
];
function cell(x, y, w, h, c) {
  if (w < 4 || h < 4) { box(x, y, w, h, c); return; }
  ctx.fillStyle = c; rr(x + 1, y + 1, w - 2, h - 2, Math.min(5, w * 0.22)); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.22)'; rr(x + 3, y + 3, Math.max(2, w - 6), Math.max(2, h * 0.22), 2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(x + 3, y + h - 5, Math.max(2, w - 6), 3);
}
const spin2 = r => ctx.rotate(r.rot);
function crateBox(x, y, w) {
  box(x, y, w, w, '#a8743a'); box(x + 2, y + 2, w - 4, w - 4, '#b98446');
  ctx.strokeStyle = '#5a3a18'; ctx.lineWidth = 1.6; ctx.strokeRect(x + 0.8, y + 0.8, w - 1.6, w - 1.6);
  ctx.beginPath(); ctx.moveTo(x + 2, y + 2); ctx.lineTo(x + w - 2, y + w - 2); ctx.moveTo(x + w - 2, y + 2); ctx.lineTo(x + 2, y + w - 2); ctx.stroke();
}
const RHYTHM_LANES = ['#ff4ea0', '#3fe0d0', '#ffd24a', '#8a6aff'];
const girderLines = h => Array.from({ length: 6 }, (_, i) => { const y = h * (0.08 + i * 0.17); return i % 2 ? [y, y + 34] : [y + 34, y]; });

Object.assign(SCENES, {
  girders: {
    far(h) {
      skyFill(h, ['#070a1e', '#10163a', '#1a2050']);
      for (let i = 0; i < 30; i++) box(SR(i, 380) * GW, SR(i, 381) * h * 0.5, 1.4, 1.4, 'rgba(255,255,255,0.4)');
      girderLines(h).forEach(([y0, y1]) => {
        const th = 22, sl = (y1 - y0) / GW;
        poly([0, y0, GW, y1, GW, y1 + th, 0, y0 + th], '#8a2a26');
        poly([0, y0 + th - 5, GW, y1 + th - 5, GW, y1 + th, 0, y0 + th], '#5e1c1a');
        poly([0, y0, GW, y1, GW, y1 + 3, 0, y0 + 3], '#b04a40');
        for (let x = 12; x < GW; x += 30) poly([x, y0 + sl * x + 6, x + 14, y0 + sl * (x + 14) + 6, x + 14, y0 + sl * (x + 14) + th - 8, x, y0 + sl * x + th - 8], '#0c1130');
      });
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        for (const by of [T * 0.3, T * 0.86]) {
          for (let k = 0; k < 3; k++) crateBox(side ? x0 - (k + 1) * 24 : x0 + k * 24, by - 24, 24);
          for (let k = 0; k < 2; k++) crateBox(side ? x0 - (k + 1) * 24 - 12 : x0 + k * 24 + 12, by - 48, 24);
          crateBox(side ? x0 - 36 : x0 + 24, by - 72, 24);
        }
        const lx = x0 + dir * 34, ly = T * (side ? 0.62 : 0.52);
        for (const o of [-6, 6]) limb(lx + o, ly, lx + o, ly + 90, 2.2, '#6ad0ff');
        for (let k = 0; k < 8; k++) limb(lx - 6, ly + 6 + k * 11, lx + 6, ly + 6 + k * 11, 2, '#6ad0ff');
      }
    },
    live() {
      const f = G.frame, sw = Math.sin(f * 0.025) * 0.5, cx = GW / 2, len = H * 0.46, hx = cx + Math.sin(sw) * len, hy = Math.cos(sw) * len;
      ctx.strokeStyle = '#3a4468'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(-sw * 0.5);
      ctx.strokeStyle = '#8a92a8'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 8, 8, -Math.PI * 0.2, Math.PI * 1.15); ctx.stroke();
      box(-3, -4, 6, 6, '#8a92a8'); crateBox(-14, 18, 28); ctx.restore();
    },
  },

  hell: {
    far(h) {
      skyFill(h, ['#14020a', '#4a0a0c', '#9a2610', '#e06a18']);
      glow(GW / 2, h, 340, 'rgba(255,120,30,0.5)');
      jag(h, h * 0.7, 150, '#2a0a0a', 1, false); jag(h, h * 0.8, 110, '#1a0606', 2, false);
      const cx = GW / 2, top = h * 0.2, bot = h * 0.82;
      box(cx - 112, top + 90, 38, bot - top - 90, '#0f0303'); box(cx + 74, top + 90, 38, bot - top - 90, '#0f0303');
      ctx.fillStyle = '#0f0303'; ctx.beginPath(); ctx.arc(cx, top + 90, 112, Math.PI, 0); ctx.arc(cx, top + 90, 74, 0, Math.PI, true); ctx.closePath(); ctx.fill();
      glow(cx, top + 150, 120, 'rgba(255,60,20,0.45)');
      ctx.save(); ctx.shadowColor = '#ff3a1a'; ctx.shadowBlur = 16; ctx.strokeStyle = '#ff4a2a'; ctx.lineWidth = 2.4; ctx.lineJoin = 'miter'; ctx.miterLimit = 8;
      ctx.beginPath(); ctx.arc(cx, top + 150, 58, 0, Math.PI * 2);
      ctx.moveTo(cx + 50, top + 150); ctx.arc(cx, top + 150, 50, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 4 / 5, px = cx + Math.cos(a) * 50, py = top + 150 + Math.sin(a) * 50; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.closePath(); ctx.stroke(); ctx.restore();
      skull(cx - 93, top + 118, 14, '#ff4a1a'); skull(cx + 93, top + 118, 14, '#ff4a1a');
      ridge(h, h * 0.94, 5, '#ff6a1a', 3); box(0, h * 0.97, GW, h, '#ffa03a');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        ctx.fillStyle = '#150505';
        ctx.beginPath(); ctx.moveTo(x0, 0);
        for (let y = 0; y <= T; y += 32) ctx.lineTo(x0 + dir * (14 + SR(y + side * 555, 385) * 38), y);
        ctx.lineTo(x0, T); ctx.closePath(); ctx.fill();
        ctx.save(); ctx.shadowColor = '#ff5a1a'; ctx.shadowBlur = 6; ctx.strokeStyle = 'rgba(255,110,30,0.85)'; ctx.lineWidth = 1.4;
        for (let v = 0; v < 3; v++) {
          let x = x0 + dir * 8, y = v * T / 3 + 20 + SR(v + side * 9, 386) * 40;
          ctx.beginPath(); ctx.moveTo(x, y);
          for (let k = 0; k < 6; k++) { x += dir * (2 + SR(v * 7 + k, 387) * 5); y += 12 + SR(v * 7 + k, 388) * 14; ctx.lineTo(x, y); }
          ctx.stroke();
        }
        ctx.restore();
        for (const sy of [T * 0.22, T * 0.68]) skull(x0 + dir * (20 + SR(sy, 389) * 12), sy + side * 30, 9, '#ff5a1a');
        const chx = x0 + dir * 46, chy = T * (side ? 0.4 : 0.1);
        for (let k = 0; k < 9; k++) { ctx.strokeStyle = '#4a4040'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(chx, chy + k * 9, 3, 5, 0, 0, Math.PI * 2); ctx.stroke(); }
      }
    },
    live() {
      const f = G.frame;
      const k = 0.03 + 0.03 * Math.sin(f * 0.05);
      box(0, 0, GW, H, `rgba(255,40,10,${k})`);
      for (let i = 0; i < 7; i++) {
        const x = 20 + i * 70 + SR(i, 395) * 20, hh = 30 + ((f * 2 + i * 23) % 30) + Math.sin(f * 0.3 + i) * 5, y = H * 0.97;
        glowAt(x, y - 10, 60, 'rgba(255,140,40,0.8)', 0.6);
        tri(x - 12, y, x + 12, y, x + Math.sin(f * 0.2 + i) * 4, y - hh, 'rgba(255,100,20,0.9)');
        tri(x - 6, y, x + 6, y, x + Math.sin(f * 0.3 + i) * 2, y - hh * 0.6, 'rgba(255,220,100,0.95)');
      }
    },
  },

  match3: {
    far(h) {
      skyFill(h, ['#1c0c38', '#3a1a62', '#5a2a82']);
      const g = 60;
      for (let r = 0; r * g < h + g; r++) for (let c = 0; c * g < GW; c++) {
        box(c * g, r * g, g, g, (r + c) % 2 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.12)');
        gem(c * g + g / 2, r * g + g / 2, 19, Math.floor(SR(r * 8 + c, 390) * 6), 0.16);
      }
    },
    near(T) {
      for (const side of [0, 1]) {
        const x0 = side ? GW - WALL : WALL, g = 32;
        for (let row = 0; row < T / g; row++) for (let c = 0; c < 2; c++) {
          if (c === 1 && SR(row * 2 + side * 77, 391) < 0.45) continue;
          const k = Math.floor(SR(row * 2 + c + side * 77, 392) * 6), x = side ? x0 - (c + 1) * g : x0 + c * g;
          gem(x + g / 2, row * g + g / 2, 12.5, k, 1);
        }
      }
    },
    live() {
      const f = G.frame, g = 60, rows = Math.floor(H / g), cyc = Math.floor(f / 150), t = f % 150;
      if (t > 60) return;
      const r = cyc % rows, c0 = Math.floor(SR(cyc, 393) * (Math.floor(GW / g) - 2)), k = cyc % 6, p = Math.sin(t / 60 * Math.PI);
      for (let i = 0; i < 3; i++) {
        const cx = (c0 + i) * g + g / 2, cy = r * g + g / 2;
        glowAt(cx, cy, 44, 'rgba(255,255,255,0.9)', p * 0.8);
        gem(cx, cy, 19 * (1 + p * 0.25), k, 0.6 + p * 0.4);
        twinkle(cx + 10, cy - 12, p, 7, '#ffffff');
      }
    },
  },

  tetris: {
    far(h) {
      skyFill(h, ['#050818', '#0a1030', '#101a48']);
      glow(GW / 2, h * 0.3, 260, 'rgba(120,150,255,0.16)');
      alpha(0.5);
      for (let r = 0; r < 7; r++) for (let c = 0; c < 20; c++) {
        if (SR(r * 20 + c, 395) > 0.95 - r * 0.15) continue;
        cell(c * 24, h - (r + 1) * 24, 24, 24, TETRO_COLORS[Math.floor(SR(r * 20 + c, 396) * 7)]);
      }
      alpha(1);
    },
    near(T) {
      for (const side of [0, 1]) {
        const x0 = side ? GW - WALL : WALL, g = 20;
        for (let row = 0; row < T / g; row++) for (let c = 0; c < 3; c++) {
          if (SR(row * 3 + c + side * 111, 397) > [0.9, 0.6, 0.32][c]) continue;
          cell(side ? x0 - (c + 1) * g : x0 + c * g, row * g, g, g, TETRO_COLORS[Math.floor(SR(row * 3 + c + side * 5, 398) * 7)]);
        }
      }
    },
    live() {
      const f = G.frame, k = Math.floor(f / 300), t = f % 300, idx = Math.floor(SR(k, 399) * 7), shape = TETRO_SHAPES[idx];
      const col = 2 + Math.floor(SR(k, 400) * 12), y = -80 + t * ((H * 0.62 + 80) / 300);
      alpha(0.7);
      for (const [cx, cy] of shape) cell((col + cx) * 24, Math.floor(y / 24) * 24 + cy * 24, 24, 24, TETRO_COLORS[idx]);
      alpha(1);
    },
  },
});

function puffCloud(x, y, s, a) {
  alpha(a);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  for (const [dx, dy, r] of [[-1.1, 0.2, 0.7], [-0.4, -0.3, 0.95], [0.5, -0.1, 0.85], [1.2, 0.25, 0.65]]) { ctx.moveTo(x + dx * s + r * s, y + dy * s); ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); }
  ctx.fill();
  box(x - 1.6 * s, y + 0.5 * s, 3.4 * s, 0.4 * s, '#ffffff');
  alpha(1);
}
function lighthouse(x, base, s) {
  poly([x - 14 * s, base + 60 * s, x - 9 * s, base - 10 * s, x + 9 * s, base - 10 * s, x + 14 * s, base + 60 * s], '#f4f1ea');
  poly([x - 12 * s, base + 36 * s, x - 10.6 * s, base + 18 * s, x + 10.6 * s, base + 18 * s, x + 12 * s, base + 36 * s], '#d8453a');
  poly([x - 10.6 * s, base + 18 * s, x - 9.6 * s, base + 6 * s, x + 9.6 * s, base + 6 * s, x + 10.6 * s, base + 18 * s], '#f4f1ea');
  box(x - 11 * s, base - 14 * s, 22 * s, 5 * s, '#3a4458'); box(x - 7 * s, base - 28 * s, 14 * s, 14 * s, '#ffe9a0'); box(x - 7 * s, base - 28 * s, 14 * s, 2 * s, '#3a4458');
  poly([x - 10 * s, base - 28 * s, x, base - 40 * s, x + 10 * s, base - 28 * s], '#d8453a');
  glow(x, base - 21 * s, 40 * s, 'rgba(255,240,170,0.5)');
}
function daisy(x, y, s, seed = 0) {
  limb(x, y, x, y - 26 * s, 2.2 * s, '#2f8a3a');
  tri(x, y - 10 * s, x + 11 * s, y - 17 * s, x + 3 * s, y - 5 * s, '#3fae4a');
  const petal = seed % 2 ? '#ffffff' : '#ffc2dc';
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ell(x + Math.cos(a) * 6.5 * s, y - 28 * s + Math.sin(a) * 6.5 * s, 4.6 * s, 2.2 * s, petal); }
  circ(x, y - 28 * s, 4 * s, '#ffd93d');
}
function butterfly(x, y, ph, seed) {
  const w = 0.35 + 0.65 * Math.abs(Math.sin(ph)), c = ['#ff9ac8', '#ffd24a', '#8ad0ff'][Math.floor(Math.abs(seed)) % 3];
  ctx.save(); ctx.translate(x, y);
  for (const d of [-1, 1]) { ctx.save(); ctx.scale(d * w, 1); ell(5, -3, 6, 5, c); ell(4, 4, 4.4, 3.4, c); ctx.restore(); }
  limb(0, -5, 0, 6, 1.6, '#3a2a4a');
  ctx.restore();
}
function parasol(x, y, s) {
  limb(x, y, x + 3 * s, y - 56 * s, 2.4 * s, '#e8e0d0');
  ctx.save(); ctx.translate(x + 3 * s, y - 56 * s); ctx.rotate(0.08);
  for (let k = 0; k < 6; k++) { ctx.fillStyle = k % 2 ? '#ffffff' : '#e8453c'; ctx.beginPath(); ctx.moveTo(0, -16 * s); ctx.arc(0, 0, 30 * s, Math.PI + k * Math.PI / 6, Math.PI + (k + 1) * Math.PI / 6); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
const stripes = (x, y, w, h, s, c1, c2) => { for (let j = 0; j * s < h; j++) box(x, y + j * s, w, s, j % 2 ? c1 : c2); };
Object.assign(SCENES, {
  hills: {
    far(h) {
      skyFill(h, ['#2f94ff', '#7cc6ff', '#c8ecff']);
      ridge(h, h * 0.54, 36, '#5a9fd8', 2);
      box(0, h * 0.6, GW, h * 0.07, '#3a8ae0');
      for (let i = 0; i < 12; i++) box(SR(i, 410) * GW, h * 0.61 + SR(i, 411) * h * 0.05, 18 + SR(i, 412) * 22, 2, 'rgba(255,255,255,0.45)');
      ridge(h, h * 0.66, 16, '#2f8a3a', 1);
      const hill = (cx, base, w, hgt) => {
        ctx.save();
        ctx.beginPath(); ctx.ellipse(cx, base, w, hgt, 0, Math.PI, 0); ctx.lineTo(cx + w, h); ctx.lineTo(cx - w, h); ctx.closePath(); ctx.clip();
        stripes(cx - w, base - hgt, w * 2, h, 14, '#a06a36', '#b98246');
        ctx.restore();
        ctx.strokeStyle = '#3fa832'; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(cx, base, w, hgt, 0, Math.PI, 0); ctx.stroke();
        ctx.strokeStyle = '#6cd04e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, base - 4, w - 4, hgt, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke();
      };
      hill(GW * 0.14, h * 0.78, 190, 120); hill(GW * 0.86, h * 0.84, 210, 150); hill(GW * 0.5, h * 0.95, 300, 90);
      lighthouse(GW * 0.2, h * 0.78 - 118, 1);
      for (let i = 0; i < 7; i++) daisy(GW * (0.28 + i * 0.07), h * 0.985, 0.9, i);
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, w = 40;
        stripes(side ? x0 - w : x0, 0, w, T, 14, '#a06a36', '#b98246');
        box(side ? x0 - w : x0 + w - 4, 0, 4, T, 'rgba(0,0,0,0.25)');
        box(side ? x0 - w : x0 + w - 8, 0, 8, T, '#58c43e'); box(side ? x0 - w : x0 + w - 8, 0, 3, T, '#8ae860');
        const py = T * (side ? 0.78 : 0.4);
        daisy(x0 + dir * (w + 14), py, 1, side); daisy(x0 + dir * (w + 30), py + 6, 0.8, side + 1);
      }
    },
    live() {
      const f = G.frame;
      [[0, 0.1, 0.22], [1, 0.2, 0.15], [2, 0.3, 0.28]].forEach(([i, ky, sp]) => puffCloud(((f * sp + i * 230) % (GW + 280)) - 100, H * ky, 22, 0.95));
      [[0.3, 0.38, 0], [0.7, 0.46, 2], [0.5, 0.58, 4]].forEach(([kx, ky, ph]) => butterfly(GW * kx + Math.sin(f * 0.02 + ph) * 26, H * ky + Math.sin(f * 0.05 + ph) * 12, f * 0.3 + ph, ph));
    },
  },

  mushroom: {
    far(h) {
      skyFill(h, ['#2c566a', '#5a98a2', '#cfdcbc']);
      // far factory skyline: chimneys and sheds
      const stack = (x, w, top, base, c) => { box(x, top, w, base - top, c); box(x - 2, top, w + 4, 6, '#222e36'); box(x, top + 12, w, 3, 'rgba(255,255,255,0.12)'); };
      for (let i = 0; i < 5; i++) stack(GW * (0.08 + i * 0.22) + SR(i, 410) * 20, 18 + SR(i, 411) * 8, h * (0.4 + SR(i, 412) * 0.18), h * 0.9, '#33444e');
      for (let x = 0; x < GW; x += 70) { const bh = 40 + SR(x, 413) * 50; box(x, h * 0.84 - bh, 70, bh + 60, '#2a3a44'); poly([x, h * 0.84 - bh, x + 35, h * 0.84 - bh - 16, x + 70, h * 0.84 - bh], '#2a3a44'); }
      box(0, h * 0.88, GW, h * 0.2, '#1e2a32');
      // riveted iron floor
      box(0, h * 0.93, GW, h * 0.07 + 20, '#6a4e38'); box(0, h * 0.93, GW, 3, '#a07850');
      for (let x = 0; x < GW; x += 48) { box(x, h * 0.93, 1.5, h * 0.07 + 20, '#3a2a1c'); circ(x + 8, h * 0.95, 1.8, '#b08a60'); circ(x + 40, h * 0.95, 1.8, '#b08a60'); }
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, pw = 30, px = side ? x0 - pw : x0;
        const body = ctx.createLinearGradient(px, 0, px + pw, 0);
        body.addColorStop(0, '#5a3418'); body.addColorStop(0.3, '#d89a58'); body.addColorStop(0.55, '#b07034'); body.addColorStop(1, '#4a2a12');
        ctx.fillStyle = body; ctx.fillRect(px, 0, pw, T);
        ctx.fillStyle = 'rgba(255,230,190,0.35)'; ctx.fillRect(px + 5, 0, 4, T);
        for (let y = 60; y < T; y += 150) {
          const fy = y + side * 44;
          box(px - 4, fy, pw + 8, 12, '#8a5424'); box(px - 4, fy, pw + 8, 3, '#d8a468'); box(px - 4, fy + 9, pw + 8, 3, '#4a2a12');
          for (let bx = px + 1; bx < px + pw + 2; bx += 9) circ(bx, fy + 6, 1.6, '#2a1608');
        }
        const gy = T * (side ? 0.5 : 0.34), gx = x0 + dir * (pw + 20);
        box(Math.min(x0 + dir * pw, gx), gy - 2, 20, 4, '#8a5424');
        circ(gx, gy, 14, '#2a1a0c'); circ(gx, gy, 11.5, '#f2ead6');
        ctx.strokeStyle = '#d8453a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(-2.2 + side) * 8, gy + Math.sin(-2.2 + side) * 8); ctx.stroke();
        ctx.strokeStyle = '#2a1a0c'; ctx.lineWidth = 1; for (let k = 0; k < 7; k++) { const a = Math.PI * (0.8 + k * 0.23); ctx.beginPath(); ctx.moveTo(gx + Math.cos(a) * 9, gy + Math.sin(a) * 9); ctx.lineTo(gx + Math.cos(a) * 11, gy + Math.sin(a) * 11); ctx.stroke(); }
      }
    },
    live() {
      const f = G.frame;
      for (let i = 0; i < 4; i++) {
        const t = ((f * 0.4 + i * 90) % 360) / 360, x = GW * (0.1 + i * 0.25) + t * 40, y = H * (0.5 - t * 0.5);
        alpha((1 - t) * 0.5); circ(x, y, 10 + t * 28, '#e6eef0'); alpha(1);
      }
      [[0, 0.1, 0.2], [1, 0.22, 0.14]].forEach(([i, ky, sp]) => puffCloud(((f * sp + i * 210) % (GW + 260)) - 90, H * ky, 20, 0.5));
    },
  },
});

Object.assign(SPECIAL_PLATFORMS, {
  girders(x, sy, w, h) {
    ctx.fillStyle = '#c8352c'; rr(x, sy, w, h, 3); ctx.fill();
    box(x + 2, sy, w - 4, 3, '#ee6a5c'); box(x + 2, sy + h - 3, w - 4, 3, '#8e231d');
    for (let bx = x + 8; bx < x + w - 14; bx += 22) poly([bx, sy + 5, bx + 9, sy + 5, bx + 14, sy + h - 5, bx + 5, sy + h - 5], '#0c1130');
    for (let bx = x + 5; bx < x + w - 3; bx += 22) circ(bx, sy + 8, 1.4, '#ff8a7a');
  },
  hell(x, sy, w, h) {
    ctx.fillStyle = '#2b1612'; rr(x, sy, w, h, 4); ctx.fill();
    ctx.fillStyle = '#483028'; rr(x, sy, w, 4, 3); ctx.fill();
    ctx.save(); ctx.shadowColor = '#ff6a1a'; ctx.shadowBlur = 6; ctx.strokeStyle = '#ff8a2a'; ctx.lineWidth = 1.2;
    for (let i = 0; i < w / 36; i++) {
      const cx = x + 8 + SR(i + x, 420) * (w - 18);
      ctx.beginPath(); ctx.moveTo(cx, sy + 4); ctx.lineTo(cx + (SR(i, 421) - 0.5) * 8, sy + 8); ctx.lineTo(cx + (SR(i, 422) - 0.5) * 12, sy + 11); ctx.lineTo(cx + (SR(i, 423) - 0.5) * 6, sy + 13); ctx.stroke();
    }
    ctx.restore();
    for (let bx = x + 6; bx < x + w - 6; bx += 12) tri(bx - 3, sy + h - 1, bx + 3, sy + h - 1, bx, sy + h + 4, '#e9e2cf');
  },
  match3(x, sy, w, h) {
    const cs = ['#ff4f6d', '#4dd0ff', '#ffd93d', '#6bcb77', '#c77dff'];
    ctx.fillStyle = '#e8d6f8'; rr(x, sy, w, h, 7); ctx.fill();
    ctx.fillStyle = '#ffffff'; rr(x, sy, w, 6, 6); ctx.fill();
    box(x + 4, sy + h - 4, w - 8, 3, 'rgba(90,40,140,0.35)');
    for (let bx = x + 10, i = 0; bx < x + w - 6; bx += 18, i++) { circ(bx, sy + 9.5, 5, cs[(i + (x | 0)) % 5]); circ(bx - 1.6, sy + 7.9, 1.6, 'rgba(255,255,255,0.85)'); }
  },
  tetris(x, sy, w, h) {
    for (let bx = x, i = 0; bx < x + w; bx += 16, i++) cell(bx, sy, Math.min(16, x + w - bx), h, TETRO_COLORS[((x | 0) + i * 3) % 7]);
  },
  hills(x, sy, w, h) {
    ctx.fillStyle = '#4a2c10'; rr(x - 1.5, sy - 1.5, w + 3, h + 3, 5); ctx.fill();
    ctx.save(); rr(x, sy, w, h, 4); ctx.clip();
    stripes(x, sy + 5, w, h, 4, '#e6bd6e', '#f1d58a');
    box(x, sy + h - 3, w, 3, 'rgba(90,50,10,0.35)');
    box(x, sy, w, 6, '#58c43e'); box(x, sy, w, 2, '#9cf070');
    ctx.restore();
  },
  mushroom(x, sy, w, h) {
    ctx.fillStyle = '#7a4a22'; rr(x, sy, w, h, 4); ctx.fill();
    ctx.fillStyle = '#d89a58'; rr(x, sy, w, 5, 4); ctx.fill();
    box(x + 3, sy + h - 4, w - 8, 3, 'rgba(0,0,0,0.3)');
    for (let bx = x + 8; bx < x + w - 4; bx += 16) { circ(bx, sy + 10, 1.6, '#2a1608'); box(bx + 8, sy + 6, 1.2, h - 8, 'rgba(0,0,0,0.25)'); }
  },
});

Object.assign(FLOOR_PROPS, {
  girders(sy) {
    const x = propX(), k = 0.7 + 0.3 * Math.sin(G.frame * 0.1);
    limb(x - 14, sy, x, sy - 30, 2.4, '#4a5270'); limb(x + 14, sy, x, sy - 30, 2.4, '#4a5270'); limb(x, sy, x, sy - 30, 2.4, '#4a5270');
    glowAt(x, sy - 46, 54, 'rgba(255,230,150,0.9)', k * 0.7);
    ctx.save(); ctx.translate(x, sy - 38); ctx.rotate(-0.25);
    box(-11, -10, 22, 18, '#e8b02e'); box(-11, -10, 22, 4, '#ffd95a'); box(-7, -5, 14, 10, '#fff6c8'); ctx.restore();
  },
  hell(sy) {
    const x = propX(), k = 0.7 + 0.3 * Math.sin(G.frame * 0.15);
    glowAt(x, sy - 22, 60, 'rgba(255,60,20,0.9)', k * 0.7);
    tri(x - 22, sy - 26, x - 12, sy - 34, x - 24, sy - 52, '#e9e2cf'); tri(x + 22, sy - 26, x + 12, sy - 34, x + 24, sy - 52, '#e9e2cf');
    skull(x, sy - 22, 17, '#ff5a1a');
    ell(x, sy - 2, 22, 5, '#2a0a0a');
  },
  match3(sy) {
    const x = propX(), p = 0.5 + 0.5 * Math.sin(G.frame * 0.08);
    glowAt(x, sy - 16, 50, 'rgba(255,255,255,0.8)', 0.3 + p * 0.3);
    for (let i = 0; i < 3; i++) gem(x - 26 + i * 26, sy - 14, 11, 0, 1);
    twinkle(x, sy - 36, p, 8, '#ffffff');
  },
  tetris(sy) {
    const x = propX();
    glowAt(x, sy - 30, 60, 'rgba(130,160,255,0.8)', 0.4);
    for (const [cx, cy, i] of [[0, 0, 0], [1, 0, 1], [1, 1, 2], [2, 1, 3], [2, 2, 4]]) cell(x - 24 + cx * 16, sy - 16 * (3 - cy) + 0, 16, 16, TETRO_COLORS[i]);
  },
  hills(sy) {
    const x = propX();
    ell(x, sy - 1, 22, 3.4, 'rgba(0,0,0,0.22)');
    parasol(x, sy, 1);
    box(x + 12, sy - 8, 20, 8, '#f4ead2'); box(x + 12, sy - 8, 20, 2, '#ffffff');
  },
  mushroom(sy) {
    const x = propX(), f = G.frame;
    box(x - 10, sy - 26, 20, 26, '#8a5424'); box(x - 10, sy - 26, 20, 4, '#d8a468'); box(x - 14, sy - 30, 28, 6, '#a06a34');
    limb(x, sy - 30, x, sy - 40, 2.4, '#4a2a12');
    ctx.strokeStyle = '#d8453a'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x - 12, sy - 40); ctx.lineTo(x + 12, sy - 40); ctx.stroke();
    for (let i = 0; i < 3; i++) { const t = ((f * 0.04 + i / 3) % 1); alpha(0.6 * (1 - t)); circ(x + Math.sin(t * 6 + i) * 6, sy - 44 - t * 34, 4 + t * 9, '#eef4f4'); alpha(1); }
  },
});

Object.assign(SCENE_PARTICLES, {
  girders: { fills: ['rgba(255,150,60,0.5)', 'rgba(255,190,80,0.65)', 'rgba(255,230,150,0.8)'], speed: -0.6, shape: 'square' },
  hell: { fills: ['rgba(255,110,40,0.55)', 'rgba(255,160,60,0.7)', 'rgba(255,220,120,0.85)'], speed: -1.2, shape: 'dot' },
  match3: { fills: ['rgba(255,255,255,0.45)', 'rgba(255,214,250,0.6)', 'rgba(180,230,255,0.6)'], speed: 0.6, shape: 'square' },
  tetris: { fills: ['rgba(110,150,200,0.45)', 'rgba(200,140,110,0.45)', 'rgba(220,190,120,0.5)'], speed: 0.7, shape: 'square' },
  hills: { fills: ['rgba(120,210,90,0.5)', 'rgba(255,230,120,0.6)', 'rgba(255,255,255,0.6)'], speed: 0.7, shape: 'dot' },
  mushroom: { fills: ['rgba(255,214,150,0.45)', 'rgba(255,240,200,0.6)', 'rgba(255,255,255,0.6)'], speed: -0.5, shape: 'dot' },
});

Object.assign(FALLER_COLORS, {
  hexnut: ['#9aa2b4', '#5a6278'], skull: ['#e9e2cf', '#ff5a1a'], shell: ['#f4b8a0', '#fff0e4'], cog: ['#b8803a', '#6a4220'],
});
Object.assign(EXTRA_FALLERS, {
  hexnut(s, r, c1, c2, path, spin) {
    spin();
    ctx.fillStyle = c1; ctx.beginPath(); for (let i = 0; i < 6; i++) ctx.lineTo(Math.cos(i * Math.PI / 3) * s, Math.sin(i * Math.PI / 3) * s); ctx.closePath(); ctx.fill(); outline();
    circ(0, 0, s * 0.42, c2); ctx.beginPath(); ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2); outline(1.4);
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(-s * 0.6, -s * 0.8, s * 0.7, s * 0.14);
  },
  skull(s, r, c1, c2) {
    for (let i = 0; i < 3; i++) tri(-s * 0.7 + i * s * 0.7, -s * 0.3, -s * 0.2 + i * s * 0.7, -s * 0.3, -s * 0.45 + i * s * 0.7 + Math.sin(G.frame * 0.4 + i) * 2, -s * 2 - (i % 2) * s * 0.5, i % 2 ? '#ffd93d' : '#ff6a1a');
    skull(0, 0, s * 0.95, c2, c1); ctx.beginPath(); ctx.arc(0, 0, s * 0.95, 0, Math.PI * 2); outline(1.6);
  },
  slab(s, r) {
    spin2(r);
    const sh = TETRO_SHAPES[r.seed % TETRO_SHAPES.length], u = s * 0.62, col = TETRO_COLORS[r.seed % TETRO_COLORS.length];
    let mx = 0, my = 0; for (const [cx, cy] of sh) { mx += cx; my += cy; } mx /= sh.length; my /= sh.length;
    for (const [cx, cy] of sh) { const bx = (cx - mx - 0.5) * u, by = (cy - my - 0.5) * u; ctx.fillStyle = col; rr(bx, by, u, u, 3); ctx.fill(); ctx.strokeStyle = NAVY; ctx.lineWidth = 1.4; ctx.stroke(); }
  },
  jewel(s, r, c1, c2, path, spin) {
    spin();
    ctx.fillStyle = c1; path([[-0.9, -0.35], [-0.5, -0.9], [0.5, -0.9], [0.9, -0.35], [0.9, 0.35], [0.5, 0.9], [-0.5, 0.9], [-0.9, 0.35]]); ctx.fill(); outline();
    ctx.fillStyle = c2; path([[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]]); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; path([[-0.7, -0.3], [-0.4, -0.7], [0, -0.7], [-0.5, -0.2]]); ctx.fill();
  },
  shell(s, r, c1, c2, path, spin) {
    spin();
    ctx.fillStyle = c1; ctx.beginPath(); ctx.moveTo(0, s * 0.9); ctx.bezierCurveTo(-s * 1.4, s * 0.3, -s * 1.1, -s * 1.0, 0, -s * 1.0); ctx.bezierCurveTo(s * 1.1, -s * 1.0, s * 1.4, s * 0.3, 0, s * 0.9); ctx.fill(); outline();
    ctx.strokeStyle = c2; ctx.lineWidth = 1.4;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(0, s * 0.8); ctx.quadraticCurveTo(i * s * 0.5, -s * 0.1, i * s * 0.42, -s * 0.85); ctx.stroke(); }
  },
  cog(s, r, c1, c2, path, spin) {
    spin();
    ctx.fillStyle = c1; ctx.beginPath();
    for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, rad = i & 1 ? s * 0.78 : s * 1.02; ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); }
    ctx.closePath(); ctx.fill(); outline();
    circ(0, 0, s * 0.32, c2); ctx.beginPath(); ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2); outline(1.4);
  },
});

function starShape(x, y, r, fill, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i & 1 ? r * 0.48 : r; ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); }
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.restore();
}
function drone(x, y, s, color, look) {
  ctx.fillStyle = color; rr(x - s, y - s * 0.8, s * 2, s * 1.6, s * 0.6); ctx.fill();
  box(x - s * 0.1, y - s * 1.35, s * 0.2, s * 0.6, color); circ(x, y - s * 1.4, s * 0.22, '#ffffff');
  box(x - s * 1.3, y - s * 0.2, s * 0.3, s * 0.7, color); box(x + s, y - s * 0.2, s * 0.3, s * 0.7, color);
  ell(x, y - s * 0.1, s * 0.7, s * 0.4, '#0a1224'); circ(x + (look || 0) * s * 0.26, y - s * 0.1, s * 0.22, '#7fffe8');
  box(x - s * 0.5, y + s * 0.8, s, s * 0.18, 'rgba(0,0,0,0.3)');
}
function flaskShape(x, y, s, liquid) {
  ctx.fillStyle = 'rgba(210,225,240,0.8)';
  ctx.beginPath(); ctx.moveTo(x - 3 * s, y - 20 * s); ctx.lineTo(x + 3 * s, y - 20 * s); ctx.lineTo(x + 3 * s, y - 12 * s); ctx.lineTo(x + 10 * s, y); ctx.lineTo(x - 10 * s, y); ctx.lineTo(x - 3 * s, y - 12 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = liquid; ctx.beginPath(); ctx.moveTo(x - 6.5 * s, y - 6 * s); ctx.lineTo(x + 6.5 * s, y - 6 * s); ctx.lineTo(x + 10 * s, y); ctx.lineTo(x - 10 * s, y); ctx.closePath(); ctx.fill();
  box(x - 4 * s, y - 22 * s, 8 * s, 3 * s, '#8a909c');
}
function crystalShape(cx, cy, w, h, c1, c2, c3) {
  poly([cx, cy - h, cx + w, cy - h * 0.3, cx + w * 0.8, cy + h * 0.45, cx, cy + h, cx - w * 0.8, cy + h * 0.45, cx - w, cy - h * 0.3], c2);
  poly([cx, cy - h, cx + w, cy - h * 0.3, cx + w * 0.8, cy + h * 0.45, cx, cy + h * 0.1], c1);
  poly([cx, cy - h, cx, cy + h * 0.1, cx - w * 0.8, cy + h * 0.45, cx - w, cy - h * 0.3], c3);
  poly([cx, cy - h, cx + w * 0.3, cy - h * 0.2, cx, cy + h * 0.1, cx - w * 0.3, cy - h * 0.2], 'rgba(255,255,255,0.4)');
}

Object.assign(SCENES, {
  dream: {
    far(h) {
      skyFill(h, ['#9edcff', '#ffd0ee', '#fff3c4']);
      const rb = ['#ff8aa0', '#ffc27a', '#fff09a', '#9aeaa0', '#8ad0ff', '#c7a0ff'];
      rb.forEach((c, i) => { ctx.strokeStyle = c; ctx.globalAlpha = 0.5; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(GW * 0.6, h * 0.55, 190 - i * 8.5, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); });
      ctx.globalAlpha = 1;
      for (let i = 0; i < 26; i++) starShape(SR(i, 430) * GW, SR(i, 431) * h * 0.7, 3 + SR(i, 432) * 4, ['#ffffff', '#fff3a0', '#ffc2ea'][i % 3], SR(i, 433));
      ridge(h, h * 0.7, 26, '#b8f0c8', 1); ridge(h, h * 0.78, 22, '#ffc8e0', 2.6); ridge(h, h * 0.87, 24, '#a8e8ff', 4);
      ridge(h, h * 0.95, 14, '#ffe8a8', 5);
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, w = 44, px = side ? x0 - w : x0;
        for (let i = 0; i < 9; i++) {
          const y = i * T / 9, c = i % 2 ? '#ffb3d9' : '#a8dcff';
          box(px, y, w, T / 9, c); box(px, y, w, 2, 'rgba(255,255,255,0.6)'); box(px, y + T / 9 - 2, w, 2, 'rgba(0,0,0,0.12)');
          starShape(px + w / 2, y + T / 18, 11, i % 2 ? '#fff3a0' : '#ffffff');
        }
        const cy = T * (side ? 0.26 : 0.66);
        for (const [dx, dy, r] of [[0, 0, 16], [14, -6, 14], [28, 2, 12]]) circ(x0 + dir * (w + dx), cy + dy, r, 'rgba(255,255,255,0.92)');
      }
    },
    live() {
      const f = G.frame, p = (f % 700) / 700, x = -40 + p * (GW + 80), y = H * 0.32 + Math.sin(p * 9) * 36;
      for (let k = 6; k > 0; k--) starShape(x - k * 14, y + Math.sin(p * 9 - k * 0.3) * 36 - Math.sin(p * 9) * 36 + 0, 3 + (6 - k) * 0.3, `rgba(255,243,160,${0.1 + (6 - k) * 0.08})`, f * 0.1);
      glowAt(x, y, 38, 'rgba(255,240,150,0.9)', 0.6);
      starShape(x, y, 13, '#ffd93d', f * 0.04); starShape(x, y, 6, '#fff6c8', f * 0.04);
    },
  },

  erdtree: {
    far(h) {
      skyFill(h, ['#0e0a14', '#2a1a1e', '#5a3a14', '#8a5a1c']);
      const tx = GW * 0.5, base = h * 0.84, top = h * 0.12;
      glow(tx, top + 70, 260, 'rgba(255,190,70,0.5)');
      ctx.fillStyle = '#4a3010';
      ctx.beginPath(); ctx.moveTo(tx - 30, base); ctx.bezierCurveTo(tx - 24, base - 120, tx - 40, top + 190, tx - 16, top + 130);
      ctx.lineTo(tx + 16, top + 130); ctx.bezierCurveTo(tx + 40, top + 190, tx + 24, base - 120, tx + 30, base); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#6a4818'; ctx.lineWidth = 7; ctx.lineCap = 'round';
      for (const [dx, dy] of [[-150, 20], [-100, -20], [-55, -45], [55, -45], [100, -20], [150, 20], [0, -60]]) { ctx.beginPath(); ctx.moveTo(tx + Math.sign(dx) * 8, top + 140); ctx.quadraticCurveTo(tx + dx * 0.5, top + 100 + dy * 0.6, tx + dx, top + 80 + dy); ctx.stroke(); }
      for (let i = 0; i < 90; i++) {
        const a = SR(i, 440) * Math.PI * 2, r = Math.sqrt(SR(i, 441)) * 190;
        glowAt(tx + Math.cos(a) * r * 1.15, top + 70 + Math.sin(a) * r * 0.55, 18 + SR(i, 442) * 14, 'rgba(255,200,80,0.9)', 0.5 + SR(i, 443) * 0.4);
      }
      for (let i = 0; i < 12; i++) { const x = SR(i, 444) * GW; tri(x - 10, h, x + 10, h, x, h - 40 - SR(i, 445) * 50, '#2a1a0a'); }
      ridge(h, h * 0.9, 10, '#3a2410', 2); box(0, h * 0.94, GW, h, '#2a180a');
      for (let i = 0; i < 70; i++) box(SR(i, 446) * GW, h * 0.9 + SR(i, 447) * h * 0.1, 2, 2, 'rgba(255,214,110,0.7)');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        for (const [y, hh] of [[T * 0.2, 150], [T * 0.62 + side * 20, 170]]) {
          const px = x0 + dir * 14;
          box(side ? px - 22 : px, y, 22, hh, '#6a5a44'); box(side ? px - 22 : px + 18, y, 4, hh, 'rgba(255,255,255,0.1)');
          box(side ? px - 28 : px - 6, y - 8, 34, 10, '#7a6a52'); box(side ? px - 28 : px - 6, y - 8, 34, 3, '#9a8a6c');
          ctx.strokeStyle = 'rgba(255,200,80,0.8)'; ctx.lineWidth = 1.3;
          for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(px + dir * 6, y + 20 + k * 36); ctx.quadraticCurveTo(px + dir * (14 + k * 4), y + 36 + k * 36, px + dir * 4, y + 50 + k * 36); ctx.stroke(); }
        }
        const bx = x0 + dir * 66;
        for (let i = 0; i < 5; i++) { const fy = T * (side ? 0.4 : 0.85) - i * 3; circ(bx + dir * i * 7, fy, 2.2, '#ffd25a'); circ(bx + dir * i * 7 + 1, fy - 5, 1.6, '#fff0a0'); }
      }
    },
    live() {
      const f = G.frame, k = 0.5 + 0.5 * Math.sin(f * 0.025);
      const g = ctx.createLinearGradient(0, 0, 0, H * 0.7);
      g.addColorStop(0, `rgba(255,214,120,${0.12 + k * 0.1})`); g.addColorStop(1, 'rgba(255,214,120,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(GW / 2 - 50, 0); ctx.lineTo(GW / 2 + 50, 0); ctx.lineTo(GW / 2 + 190, H * 0.7); ctx.lineTo(GW / 2 - 190, H * 0.7); ctx.closePath(); ctx.fill();
      for (let i = 0; i < 14; i++) {
        const x = (SR(i, 448) * GW + f * (0.2 + SR(i, 449) * 0.3) + Math.sin(f * 0.02 + i) * 14) % GW, y = (SR(i, 450) * H + f * (0.35 + SR(i, 451) * 0.5)) % H;
        tri(x - 3, y, x + 3, y - 2, x, y + 6, `rgba(255,214,90,${0.5 + 0.4 * Math.sin(f * 0.1 + i)})`);
      }
    },
  },

  prelude: {
    far(h) {
      skyFill(h, ['#0a0830', '#16205a', '#1a4a78', '#0c2a48']);
      glow(GW / 2, h * 0.34, 260, 'rgba(120,230,255,0.4)');
      for (let i = 0; i < 70; i++) box(SR(i, 460) * GW, SR(i, 461) * h, 1.5, 1.5, `rgba(200,240,255,${0.2 + SR(i, 462) * 0.6})`);
      ctx.fillStyle = '#1a2a50'; ctx.beginPath(); ctx.moveTo(GW / 2 - 150, h); ctx.lineTo(GW / 2 - 110, h * 0.82); ctx.lineTo(GW / 2 + 110, h * 0.82); ctx.lineTo(GW / 2 + 150, h); ctx.closePath(); ctx.fill();
      box(GW / 2 - 120, h * 0.82, 240, 10, '#2a3c6c'); box(GW / 2 - 90, h * 0.82 - 12, 180, 12, '#3a4e82'); box(GW / 2 - 60, h * 0.82 - 22, 120, 10, '#4a5e96');
      for (const [dx, dy, sc] of [[-170, -40, 0.4], [180, -80, 0.5], [-120, -150, 0.3], [130, -190, 0.35]]) { alpha(0.7); crystalShape(GW / 2 + dx, h * 0.45 + dy, 16 * sc * 2, 34 * sc * 2, '#7fe8ff', '#3fb0e0', '#a0c0ff'); alpha(1); }
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL;
        for (let i = 0; i < 3; i++) {
          const cy = 90 + i * (T - 180) / 2 + side * 20, cols = i % 2 ? ['#d8a0ff', '#a86ae8', '#e8c0ff'] : ['#7fe8ff', '#3fb0e0', '#b8f4ff'];
          crystalShape(x0 + dir * 18, cy, 20, 74, cols[0], cols[1], cols[2]);
          crystalShape(x0 + dir * 46, cy + 30, 11, 36, cols[2], cols[1], cols[0]);
        }
      }
    },
    live() {
      const f = G.frame, bob = Math.sin(f * 0.03) * 8, cx = GW / 2, cy = H * 0.34 + bob, k = 0.5 + 0.5 * Math.sin(f * 0.04);
      glowAt(cx, cy, 150 + k * 20, 'rgba(120,230,255,0.9)', 0.55 + k * 0.2);
      crystalShape(cx, cy, 44, 98, '#9ff4ff', '#4cc4f0', '#7a9cff');
      for (let i = 0; i < 5; i++) {
        const a = f * 0.02 + i * Math.PI * 2 / 5;
        crystalShape(cx + Math.cos(a) * 110, cy + Math.sin(a) * 30 - 10, 7, 16, '#c8f8ff', '#6ad0f0', '#9ab0ff');
      }
      for (let i = 0; i < 6; i++) twinkle(cx + (SR(i, 463) - 0.5) * 120, cy + (SR(i, 464) - 0.5) * 140, pulse(0.04, i * 2.1, 8), 6, '#ffffff');
    },
  },

  pellet: {
    far(h) {
      box(0, 0, GW, h, '#02030c');
      const g = 32, occ = new Set();
      const cols = Math.floor(GW / g), rows = Math.ceil(h / g);
      const walls = [];
      for (let k = 0; k < 80; k++) {
        const c = 1 + Math.floor(SR(k, 470) * (cols - 3)), r = 1 + Math.floor(SR(k, 471) * (rows - 2)), w = 1 + Math.floor(SR(k, 472) * 3), hh = 1 + Math.floor(SR(k, 473) * 2);
        let ok = true;
        for (let i = -1; i <= w && ok; i++) for (let j = -1; j <= hh; j++) if (occ.has((c + i) + ',' + (r + j))) { ok = false; break; }
        if (!ok) continue;
        for (let i = 0; i < w; i++) for (let j = 0; j < hh; j++) occ.add((c + i) + ',' + (r + j));
        walls.push([c, r, w, hh]);
      }
      ctx.save(); ctx.shadowColor = '#12d8b4'; ctx.shadowBlur = 8; ctx.strokeStyle = '#18d8b0'; ctx.lineWidth = 2.5;
      for (const [c, r, w, hh] of walls) { rr(c * g + 4, r * g + 4, w * g - 8, hh * g - 8, 8); ctx.stroke(); }
      ctx.restore();
      ctx.strokeStyle = 'rgba(80,230,200,0.45)'; ctx.lineWidth = 1;
      for (const [c, r, w, hh] of walls) { rr(c * g + 8, r * g + 8, w * g - 16, hh * g - 16, 5); ctx.stroke(); }
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (!occ.has(c + ',' + r) && (c + r) % 2 === 0) circ(c * g + g / 2, r * g + g / 2, 2, 'rgba(170,255,240,0.5)');
    },
    near(T) {
      for (const side of [0, 1]) {
        const x0 = side ? GW - WALL : WALL, dir = side ? -1 : 1;
        ctx.save(); ctx.shadowColor = '#12d8b4'; ctx.shadowBlur = 8; ctx.strokeStyle = '#2ae0bc'; ctx.lineWidth = 2.5;
        rr(side ? x0 - 40 : x0, 6, 40, T - 12, 12); ctx.stroke();
        ctx.restore();
        for (let y = 20; y < T - 10; y += 32) circ(x0 + dir * 56, y, 2.4, '#b8fff0');
        circ(x0 + dir * 56, T * 0.5, 4, '#b8fff0');
      }
    },
    live() {
      const f = G.frame, g = 32, rows = Math.floor(H / g);
      [['#ff5a8a', 0], ['#ffc24a', 1], ['#5ae8ff', 2], ['#a98aff', 3]].forEach(([c, i]) => {
        const row = 2 + ((i * 3) % Math.max(3, rows - 3)), dir = i % 2 ? -1 : 1, x = ((f * (1.2 + i * 0.15) * dir + i * 120) % (GW + 80) + GW + 80) % (GW + 80) - 40;
        drone(x, row * g + g / 2, 11, c, dir);
      });
      const px = ((f * 1.5) % (GW + 60)) - 30;
      glowAt(px, H * 0.62, 30, 'rgba(120,255,230,0.9)', 0.6); circ(px, H * 0.62, 6, '#d8fff6');
      for (let k = 1; k < 6; k++) circ(px - k * 9, H * 0.62, 5 - k * 0.7, `rgba(150,255,235,${0.5 - k * 0.07})`);
    },
  },

  rhythm: {
    far(h) {
      skyFill(h, ['#08051a', '#1a0a30', '#30103a']);
      for (let i = 0; i < 5; i++) { const x = 40 + i * 100; ctx.fillStyle = `hsla(${i * 60 + 300}, 80%, 55%, 0.1)`; poly([x, 0, x + 24, 0, x + 120, h * 0.9, x - 60, h * 0.9], ctx.fillStyle); }
      ctx.fillStyle = '#0a0612'; ctx.beginPath(); ctx.moveTo(0, h);
      for (let x = 0; x <= GW; x += 14) ctx.lineTo(x, h * 0.93 - 9 - SR(x, 480) * 14);
      ctx.lineTo(GW, h); ctx.fill();
      for (let x = 7; x <= GW; x += 14) circ(x, h * 0.93 - 9 - SR(x - 7, 480) * 14, 6, '#0a0612');
      for (const [x, w] of [[30, 56], [GW - 86, 56]]) {
        box(x, h * 0.62, w, h * 0.38, '#14101c'); box(x, h * 0.62, w, 4, '#2a2438');
        for (let r = 0; r < 3; r++) { circ(x + w / 2, h * 0.7 + r * 46, 17, '#0a0810'); circ(x + w / 2, h * 0.7 + r * 46, 12, '#241e30'); circ(x + w / 2, h * 0.7 + r * 46, 4, '#383048'); }
      }
      const lx = GW / 2 - 96;
      RHYTHM_LANES.forEach((c, i) => { ctx.fillStyle = 'rgba(255,255,255,0.045)'; ctx.fillRect(lx + i * 48, 0, 46, h); ctx.fillStyle = c; ctx.globalAlpha = 0.5; ctx.fillRect(lx + i * 48, 0, 2, h); ctx.globalAlpha = 1; });
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(lx, 0, 2, h); ctx.fillRect(lx + 192, 0, 2, h);
    },
    near(T) {
      for (let i = 0; i < 4; i++) for (let k = 0; k < 4; k++) {
        if (SR(i * 7 + k, 481) < 0.35) continue;
        const x = GW / 2 - 72 + i * 48, y = 30 + k * 150 + SR(i * 7 + k, 482) * 80;
        circ(x, y, 13, 'rgba(0,0,0,0.4)'); circ(x, y, 11, RHYTHM_LANES[i]); circ(x, y, 7, 'rgba(255,255,255,0.85)'); circ(x, y, 4, RHYTHM_LANES[i]);
      }
    },
    live() {
      const f = G.frame;
      for (let i = 0; i < 4; i++) {
        const sw = Math.sin(f * 0.02 + i * 1.7), x = 60 + i * 120 + sw * 30;
        ctx.fillStyle = `hsla(${(i * 80 + f * 0.4) % 360}, 90%, 60%, 0.1)`;
        poly([x, 0, x + 18, 0, x + 18 + sw * 90 + 40, H * 0.8, x + sw * 90 - 30, H * 0.8], ctx.fillStyle);
      }
      const beat = (f % 30) / 30;
      glowAt(GW / 2, H * 0.97, 220, 'rgba(255,60,200,0.8)', 0.15 + (1 - beat) * 0.2);
    },
  },

  portal: {
    far(h) {
      skyFill(h, ['#c4cad4', '#d8dde6', '#b8bfcc']);
      for (let x = 0; x < GW; x += 64) for (let y = 0; y < h; y += 64) { box(x + 1, y + 1, 62, 62, (x / 64 + y / 64) % 2 ? '#d6dbe4' : '#dfe3ea'); box(x, y, 64, 1.5, '#a8afbc'); box(x, y, 1.5, 64, '#a8afbc'); box(x + 6, y + 6, 2, 2, '#9aa2b0'); box(x + 56, y + 56, 2, 2, '#9aa2b0'); }
      // observation window, a wall display and a sample rack
      box(46, h * 0.1, 150, 76, '#1a2030'); box(50, h * 0.1 + 4, 142, 68, '#2a3550'); poly([60, h * 0.1 + 4, 100, h * 0.1 + 4, 70, h * 0.1 + 72, 50, h * 0.1 + 72], 'rgba(255,255,255,0.12)');
      circ(150, h * 0.1 + 60, 9, '#101626'); box(142, h * 0.1 + 64, 16, 8, '#101626');
      const dx = GW * 0.62, dy = h * 0.28;
      box(dx, dy, 120, 70, '#1a2030'); box(dx + 4, dy + 4, 112, 62, '#0f2a2a');
      ctx.strokeStyle = '#3fe0b0'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(dx + 10, dy + 54); for (let i = 1; i <= 8; i++) ctx.lineTo(dx + 10 + i * 12, dy + 54 - Math.abs(Math.sin(i * 1.7)) * 36); ctx.stroke();
      for (let i = 0; i < 5; i++) box(dx + 10 + i * 20, dy + 58, 14, 2, 'rgba(63,224,176,0.5)');
      const rx = GW * 0.14, ry = h * 0.56;
      box(rx, ry, 130, 6, '#8a909c'); box(rx, ry + 60, 130, 6, '#8a909c'); box(rx, ry, 4, 66, '#8a909c'); box(rx + 126, ry, 4, 66, '#8a909c');
      for (let i = 0; i < 6; i++) { const fx = rx + 10 + i * 20; flaskShape(fx + 7, ry + 6, 0.8, ['#5fe08a', '#7fd0ff', '#ffd24a'][i % 3]); flaskShape(fx + 7, ry + 60, 0.8, ['#c77dff', '#5fe08a', '#7fd0ff'][i % 3]); }
      const sx = GW * 0.86, sy = h * 0.06;
      box(sx - 3, 0, 6, sy, '#8a909c'); ctx.fillStyle = '#e8ecf2'; ctx.beginPath(); ctx.arc(sx, sy + 14, 16, 0, Math.PI * 2); ctx.fill();
      circ(sx + 4, sy + 16, 7, '#1a1e28'); circ(sx + 4, sy + 16, 3, '#ffb040');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, w = 36, px = side ? x0 - w : x0;
        box(px, 0, w, T, '#e8ecf2'); box(side ? px : px + w - 4, 0, 4, T, 'rgba(0,0,0,0.12)');
        for (let y = 0; y < T; y += 64) { box(px, y, w, 1.5, '#a8afbc'); for (let k = 0; k < 4; k++) box(px + 6, y + 14 + k * 8, w - 12, 2, '#b8bfcc'); }
        for (const ly of [T * 0.25, T * 0.7]) { circ(px + w / 2, ly + side * 30, 3, '#3fd46a'); }
        box(px, T * (side ? 0.4 : 0.55), w, 6, '#3fc4a8'); box(px, T * (side ? 0.4 : 0.55) + 8, w, 3, '#7fd0ff');
      }
    },
    live() {
      const f = G.frame, k = (f % 240) / 240, y = H * (0.1 + k * 0.8);
      const g = ctx.createLinearGradient(0, y - 20, 0, y);
      g.addColorStop(0, 'rgba(63,224,176,0)'); g.addColorStop(1, 'rgba(63,224,176,0.22)');
      ctx.fillStyle = g; ctx.fillRect(0, y - 20, GW, 20);
      box(0, y, GW, 1.5, 'rgba(63,224,176,0.5)');
    },
  },
});

Object.assign(SPECIAL_PLATFORMS, {
  dream(x, sy, w, h) {
    ctx.fillStyle = '#e46aa8'; rr(x, sy + 3, w, h - 3, 8); ctx.fill();
    ctx.fillStyle = '#ff9ccf'; rr(x, sy, w, h - 3, 8); ctx.fill();
    ctx.fillStyle = '#ffffff';
    for (let bx = x + 8, i = 0; bx < x + w - 4; bx += 14, i++) { ctx.beginPath(); ctx.arc(bx, sy + 4, 6 + (i % 2) * 2, Math.PI, 0); ctx.fill(); }
    rr(x, sy + 2, w, 4, 2); ctx.fill();
    for (let bx = x + 14, i = 0; bx < x + w - 8; bx += 24, i++) starShape(bx, sy + 11, 3.6, i % 2 ? '#fff3a0' : '#a8dcff');
  },
  erdtree(x, sy, w, h) {
    ctx.fillStyle = '#6a5a44'; rr(x, sy, w, h, 5); ctx.fill();
    ctx.fillStyle = '#8a7a5e'; rr(x, sy, w, 5, 4); ctx.fill();
    box(x + 4, sy + h - 4, w - 8, 3, 'rgba(0,0,0,0.3)');
    ctx.save(); ctx.shadowColor = '#ffc850'; ctx.shadowBlur = 6; ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(x + 6, sy + 10);
    for (let bx = x + 6; bx < x + w - 6; bx += 8) ctx.quadraticCurveTo(bx + 4, sy + 6, bx + 8, sy + 10);
    ctx.stroke(); ctx.restore();
  },
  prelude(x, sy, w, h) {
    ctx.fillStyle = '#5ac0ec'; rr(x, sy, w, h, 6); ctx.fill();
    ctx.fillStyle = '#d6f6ff'; rr(x, sy, w, 6, 5); ctx.fill();
    ctx.fillStyle = '#3a98d0'; ctx.fillRect(x + 3, sy + h - 5, w - 6, 5);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1;
    for (let bx = x + 6; bx < x + w - 6; bx += 14) { ctx.beginPath(); ctx.moveTo(bx, sy + h - 2); ctx.lineTo(bx + 7, sy + 5); ctx.stroke(); }
  },
  pellet(x, sy, w, h) {
    ctx.fillStyle = '#05061a'; rr(x, sy, w, h, 8); ctx.fill();
    ctx.save(); ctx.shadowColor = '#12d8b4'; ctx.shadowBlur = 6; ctx.strokeStyle = '#2ae0bc'; ctx.lineWidth = 2; rr(x + 1, sy + 1, w - 2, h - 2, 8); ctx.stroke(); ctx.restore();
    for (let bx = x + 12; bx < x + w - 8; bx += 14) circ(bx, sy + h / 2, 1.8, '#b8fff0');
  },
  rhythm(x, sy, w, h) {
    ctx.fillStyle = '#2a2236'; rr(x, sy, w, h, 4); ctx.fill();
    ctx.fillStyle = '#463a5c'; rr(x, sy, w, 5, 3); ctx.fill();
    box(x + 3, sy + h - 3, w - 6, 3, 'rgba(0,0,0,0.35)');
    for (let bx = x + 10, i = 0; bx < x + w - 6; bx += 18, i++) box(bx, sy + 8, 10, 3, RHYTHM_LANES[i % 4]);
  },
  portal(x, sy, w, h) {
    ctx.fillStyle = '#eef1f6'; rr(x, sy, w, h, 3); ctx.fill();
    ctx.strokeStyle = '#2a3040'; ctx.lineWidth = 1.6; rr(x + 0.8, sy + 0.8, w - 1.6, h - 1.6, 3); ctx.stroke();
    for (let bx = x + 16; bx < x + w - 4; bx += 16) box(bx, sy + 2, 1, h - 4, '#c0c7d4');
    box(x + 4, sy + h - 6, w - 8, 3, '#7fd0ff'); box(x + 4, sy + h - 9, w - 8, 2, '#3fc4a8');
  },
});

Object.assign(FLOOR_PROPS, {
  dream(sy) {
    const x = propX(), f = G.frame;
    glowAt(x, sy - 30, 50, 'rgba(255,240,150,0.9)', 0.6);
    starShape(x, sy - 28 + Math.sin(f * 0.08) * 4, 18, '#ffd93d', Math.sin(f * 0.05) * 0.2); starShape(x, sy - 28 + Math.sin(f * 0.08) * 4, 8, '#fff6c8', Math.sin(f * 0.05) * 0.2);
  },
  erdtree(sy) {
    const x = propX(), f = G.frame, k = 0.6 + 0.4 * Math.sin(f * 0.07);
    glowAt(x, sy - 34, 70, 'rgba(255,200,80,0.9)', k * 0.6);
    ell(x, sy - 1, 16, 3, 'rgba(0,0,0,0.25)');
    ctx.strokeStyle = '#6a4818'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, sy); ctx.quadraticCurveTo(x - 3, sy - 18, x, sy - 30); ctx.moveTo(x, sy - 22); ctx.quadraticCurveTo(x - 10, sy - 28, x - 14, sy - 38); ctx.moveTo(x, sy - 26); ctx.quadraticCurveTo(x + 10, sy - 32, x + 15, sy - 40); ctx.stroke();
    for (const [dx, dy] of [[-14, -40], [15, -42], [0, -36], [-6, -46], [8, -48]]) { circ(x + dx, sy + dy, 5, `rgba(255,214,90,${0.6 + k * 0.3})`); circ(x + dx, sy + dy, 2.4, '#fff3b0'); }
  },
  prelude(sy) {
    const x = propX(), k = 0.5 + 0.5 * Math.sin(G.frame * 0.06);
    glowAt(x, sy - 36, 60, 'rgba(120,230,255,0.9)', 0.4 + k * 0.3);
    box(x - 14, sy - 10, 28, 10, '#3a4e82'); box(x - 9, sy - 18, 18, 8, '#4a5e96');
    crystalShape(x, sy - 38 + Math.sin(G.frame * 0.05) * 3, 12, 26, '#9ff4ff', '#4cc4f0', '#7a9cff');
  },
  pellet(sy) {
    const x = propX(), k = 0.5 + 0.5 * Math.sin(G.frame * 0.1);
    glowAt(x, sy - 16, 44, 'rgba(100,255,225,0.9)', 0.3 + k * 0.3);
    for (let i = 0; i < 4; i++) { box(x - 16, sy - 28 + i * 7, 5, 3, '#c8d0d8'); box(x + 11, sy - 28 + i * 7, 5, 3, '#c8d0d8'); }
    rr(x - 12, sy - 32, 24, 28, 3); ctx.fillStyle = '#1a2a3a'; ctx.fill();
    ctx.strokeStyle = '#2ae0bc'; ctx.lineWidth = 1.4; ctx.stroke();
    circ(x, sy - 18, 5, '#2ae0bc'); circ(x, sy - 18, 2, '#d8fff6');
  },
  rhythm(sy) {
    const x = propX(), f = G.frame;
    rr(x - 26, sy - 18, 52, 18, 3); ctx.fillStyle = '#2a2236'; ctx.fill(); box(x - 26, sy - 18, 52, 3, '#463a5c');
    ell(x - 4, sy - 19, 20, 5, '#14101c');
    ctx.save(); ctx.translate(x - 4, sy - 19); ctx.scale(1, 0.26);
    circ(0, 0, 19, '#0c0914'); ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1; for (const r of [8, 12, 16]) { ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); }
    circ(0, 0, 5, RHYTHM_LANES[Math.floor(f / 30) % 4]); ctx.restore();
    limb(x + 18, sy - 22, x + 4, sy - 19, 1.6, '#c8ccd8'); circ(x + 18, sy - 22, 2.4, '#8a92a0');
  },
  portal(sy) {
    const x = propX(), k = 0.5 + 0.5 * Math.sin(G.frame * 0.1);
    glowAt(x, sy - 22, 44, 'rgba(95,224,138,0.9)', 0.25 + k * 0.25);
    box(x - 16, sy - 6, 32, 6, '#8a909c'); flaskShape(x, sy - 6, 1.5, '#5fe08a');
    for (let i = 0; i < 3; i++) { const t = ((G.frame * 0.03 + i / 3) % 1); circ(x + Math.sin(t * 7 + i) * 4, sy - 12 - t * 18, 1.6, 'rgba(210,255,225,0.9)'); }
  },
});

Object.assign(SCENE_PARTICLES, {
  dream: { fills: ['rgba(255,255,255,0.5)', 'rgba(255,214,240,0.65)', 'rgba(255,243,160,0.75)'], speed: 0.4, shape: 'square' },
  erdtree: { fills: ['rgba(255,200,80,0.45)', 'rgba(255,220,120,0.65)', 'rgba(255,245,190,0.8)'], speed: -0.5, shape: 'dot' },
  prelude: { fills: ['rgba(120,230,255,0.4)', 'rgba(190,245,255,0.6)', 'rgba(255,255,255,0.75)'], speed: -0.4, shape: 'dot' },
  pellet: { fills: ['rgba(255,230,160,0.3)', 'rgba(255,224,170,0.45)', 'rgba(255,255,255,0.55)'], speed: 0.4, shape: 'square' },
  rhythm: { fills: ['rgba(255,78,160,0.6)', 'rgba(63,224,208,0.6)', 'rgba(138,106,255,0.7)'], speed: 1.0, shape: 'square' },
  portal: { fills: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.28)'], speed: 0.2, shape: 'dot' },
});

Object.assign(FALLER_COLORS, { goldleaf: ['#ffc83a', '#fff0a0'], drone: ['#ff5a8a', '#ffffff'], flask: ['#c8d8e8', '#5fe08a'] });
Object.assign(EXTRA_FALLERS, {
  goldleaf(s, r, c1, c2, path, spin) {
    spin();
    glowAt(0, 0, s * 1.8, 'rgba(255,200,80,0.9)', 0.6);
    ctx.fillStyle = c1; path([[0, -1.5], [0.9, -0.2], [0.5, 1.1], [0, 1.5], [-0.5, 1.1], [-0.9, -0.2]]); ctx.fill(); outline();
    ctx.strokeStyle = c2; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, -1.1 * s); ctx.lineTo(0, 1.2 * s); ctx.stroke();
  },
  drone(s, r, c1) {
    drone(0, 0, s * 0.8, [c1, '#ffc24a', '#5ae8ff', '#a98aff'][r.seed % 4], 0);
    ctx.beginPath(); ctx.rect(-s * 0.8, -s * 0.64, s * 1.6, s * 1.28); outline(1.6);
  },
  note(s, r, c1, c2, path, spin) {
    const col = RHYTHM_LANES[r.seed % 4];
    circ(0, 0, s, 'rgba(0,0,0,0.5)'); circ(0, 0, s * 0.88, col); circ(0, 0, s * 0.55, '#ffffff'); circ(0, 0, s * 0.3, col);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.95, 0, Math.PI * 2); outline(1.6);
  },
  flask(s, r, c1, c2, path, spin) {
    spin();
    flaskShape(0, s * 1.0, s / 14, c2);
    ctx.beginPath(); ctx.moveTo(-s * 0.2, -s * 1.4); ctx.lineTo(s * 0.2, -s * 1.4); ctx.lineTo(s * 0.2, -s * 0.9); ctx.lineTo(s * 0.7, s * 1.0); ctx.lineTo(-s * 0.7, s * 1.0); ctx.lineTo(-s * 0.2, -s * 0.9); ctx.closePath(); outline(1.6);
  },
});

// An original wizard-school tier: a candlelit castle on a crag, floating candles, an owl, portraits that watch you climb.
function floatingCandle(x, y, f, i) {
  const k = 0.7 + 0.3 * Math.sin(f * 0.21 + i * 1.9);
  glowAt(x, y - 10, 24, 'rgba(255,200,110,0.9)', 0.45 * k);
  box(x - 2.5, y - 4, 5, 13, '#f4ecd8'); box(x - 2.5, y - 4, 2, 13, '#fffaf0'); box(x - 2.5, y + 5, 5, 4, '#d8cdb0');
  tri(x - 2.6, y - 4, x + 2.6, y - 4, x + Math.sin(f * 0.17 + i) * 0.8, y - 11 - k * 2.5, '#ffb44a');
  tri(x - 1.3, y - 4, x + 1.3, y - 4, x, y - 8 - k * 1.5, '#fff3b0');
}
function owlShape(x, y, flap, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(14,10,30,0.92)';
  for (const d of [-1, 1]) { ctx.save(); ctx.scale(d, 1); ctx.rotate(-0.35 + flap * 0.7); ctx.beginPath(); ctx.moveTo(4, -2); ctx.quadraticCurveTo(22, -12, 36, -2); ctx.quadraticCurveTo(22, 2, 4, 6); ctx.fill(); ctx.restore(); }
  ctx.beginPath(); ctx.ellipse(0, 2, 8, 12, 0, 0, Math.PI * 2); ctx.fill();
  tri(-7, -8, -2, -8, -7, -15, 'rgba(14,10,30,0.92)'); tri(7, -8, 2, -8, 7, -15, 'rgba(14,10,30,0.92)');
  circ(-3.4, -4, 2.2, '#ffd75a'); circ(3.4, -4, 2.2, '#ffd75a');
  ctx.restore();
}

Object.assign(SCENES, {
  academy: {
    far(h) {
      skyFill(h, ['#0a0a22', '#1c1a44', '#33295c', '#4a3a6a']);
      for (let i = 0; i < 60; i++) box(SR(i, 500) * GW, SR(i, 501) * h * 0.5, 1.5, 1.5, `rgba(255,248,230,${0.25 + SR(i, 502) * 0.6})`);
      glow(GW * 0.2, h * 0.15, 150, 'rgba(230,225,255,0.3)'); circ(GW * 0.2, h * 0.15, 30, '#f2eefc');
      [[-8, -6, 7], [10, 8, 5], [-2, 12, 4]].forEach(([dx, dy, r]) => circ(GW * 0.2 + dx, h * 0.15 + dy, r, 'rgba(190,184,220,0.4)'));
      const base = h * 0.78, cx = GW / 2, wall = '#14122c', roof = '#201b46';
      jag(h, base + 20, 120, '#0e0c22', 4, false);
      const tower = (x, w, top, rh) => {
        box(x, top, w, base - top + 60, wall); poly([x - 5, top, x + w + 5, top, x + w / 2, top - rh], roof); box(x - 4, top - 1, w + 8, 5, '#0e0c22');
        for (let y = top + 18; y < base - 20; y += 34) { ctx.fillStyle = 'rgba(255,200,110,0.85)'; ctx.beginPath(); ctx.moveTo(x + w / 2 - 3, y + 11); ctx.lineTo(x + w / 2 - 3, y + 3); ctx.arc(x + w / 2, y + 3, 3, Math.PI, 0); ctx.lineTo(x + w / 2 + 3, y + 11); ctx.fill(); }
      };
      box(cx - 150, base - 70, 300, 130, wall);
      for (let i = 0; i < 9; i++) { const x = cx - 142 + i * 34; ctx.fillStyle = SR(i, 503) > 0.25 ? 'rgba(255,200,110,0.8)' : 'rgba(255,200,110,0.2)'; ctx.beginPath(); ctx.moveTo(x, base - 24); ctx.lineTo(x, base - 44); ctx.arc(x + 5, base - 44, 5, Math.PI, 0); ctx.lineTo(x + 10, base - 24); ctx.fill(); }
      for (let i = 0; i < 12; i++) box(cx - 150 + i * 25, base - 76, 14, 8, wall);
      tower(cx - 26, 52, base - 240, 86); tower(cx - 118, 36, base - 160, 58); tower(cx + 82, 36, base - 180, 64); tower(cx - 170, 26, base - 110, 44); tower(cx + 140, 28, base - 128, 48);
      ctx.fillStyle = wall; ctx.fillRect(cx - 82, base - 130, 56, 8); ctx.fillRect(cx + 26, base - 150, 56, 8);
      ctx.fillStyle = vgrad(base - 40, base + 70, ['rgba(120,110,190,0)', 'rgba(120,110,190,0.28)', 'rgba(120,110,190,0)']); ctx.fillRect(0, base - 40, GW, 110);
      ridge(h, h * 0.9, 12, '#0a0818', 3); box(0, h * 0.95, GW, h, '#070612');
    },
    near(T) {
      for (const side of [0, 1]) {
        const dir = side ? -1 : 1, x0 = side ? GW - WALL : WALL, w = 44, px = side ? x0 - w : x0;
        box(px, 0, w, T, '#241f3a'); box(side ? px : px + w - 3, 0, 3, T, 'rgba(255,255,255,0.07)');
        for (let y = 0, r = 0; y < T; y += 26, r++) { box(px, y, w, 1.5, 'rgba(0,0,0,0.38)'); box(px + ((r % 2) ? 14 : 30), y, 1.5, 26, 'rgba(0,0,0,0.3)'); }
        for (const fy of [T * 0.16 + side * 70, T * 0.58 - side * 36]) {
          box(px + 5, fy, w - 10, 54, '#c9a23a'); box(px + 7, fy + 2, w - 14, 50, '#e6c35a'); box(px + 9, fy + 4, w - 18, 46, '#17132a');
          const mx = px + w / 2, my = fy + 48;
          circ(mx, my - 20, 6, '#3b3358'); ctx.fillStyle = '#3b3358'; ctx.beginPath(); ctx.ellipse(mx, my - 4, 11, 12, 0, Math.PI, 0); ctx.fill();
          box(mx - 11, my - 5, 22, 6, '#3b3358');
          if (SR(Math.floor(fy), side + 504) > 0.5) { circ(mx - 2.4, my - 21, 1.1, '#ffd75a'); circ(mx + 2.4, my - 21, 1.1, '#ffd75a'); }
        }
        const sy = T * (side ? 0.36 : 0.84), sx = x0 + dir * (w + 10);
        limb(sx, sy, sx, sy + 16, 2.4, '#3a2a18'); box(sx - 5, sy - 6, 10, 6, '#c9a23a'); glowAt(sx, sy - 10, 24, 'rgba(255,190,90,0.8)', 0.7);
        tri(sx - 2.4, sy - 6, sx + 2.4, sy - 6, sx, sy - 14, '#ffb44a');
      }
    },
    live() {
      const f = G.frame;
      for (let i = 0; i < 14; i++) {
        const x = SR(i, 505) * GW + Math.sin(f * 0.012 + i * 2.3) * 18;
        const y = H - ((SR(i, 506) * H + f * (0.12 + SR(i, 507) * 0.18)) % H);
        floatingCandle(x, y, f, i);
      }
      const p = f % 1500;
      if (p < 620) owlShape(GW + 50 - p * 1.1, H * 0.2 + Math.sin(p * 0.02) * 18, Math.sin(p * 0.2), 1.1);
    },
  },
});

Object.assign(SPECIAL_PLATFORMS, {
  academy(x, sy, w, h) {
    ctx.fillStyle = '#4a3f66'; rr(x, sy, w, h, 4); ctx.fill();
    ctx.fillStyle = '#6a5c8c'; rr(x, sy, w, 5, 3); ctx.fill();
    box(x + 3, sy + h - 4, w - 8, 3, 'rgba(0,0,0,0.32)');
    box(x + 4, sy + 9, w - 8, 1.4, 'rgba(230,190,90,0.85)');
    for (let bx = x + 16, i = 0; bx < x + w - 8; bx += 30, i++) starShape(bx, sy + h - 6, 2.8, i % 2 ? '#ffd98a' : '#fff3c8');
  },
});

Object.assign(FLOOR_PROPS, {
  academy(sy) {
    const x = propX(), f = G.frame, k = 0.5 + 0.5 * Math.sin(f * 0.07);
    box(x - 14, sy - 3, 28, 3, '#3a2818'); limb(x, sy - 3, x, sy - 26, 4, '#4a3320');
    poly([x - 21, sy - 26, x + 21, sy - 26, x + 15, sy - 35, x - 15, sy - 35], '#5a3f26');
    poly([x - 17, sy - 31, x, sy - 35, x, sy - 27, x - 17, sy - 25], '#f3ead2'); poly([x + 17, sy - 31, x, sy - 35, x, sy - 27, x + 17, sy - 25], '#e6d9bc');
    glowAt(x, sy - 42, 46, 'rgba(255,215,130,0.9)', 0.3 + k * 0.3);
    for (let i = 0; i < 5; i++) { const t = (f * 0.03 + i / 5) % 1; circ(x + Math.sin(t * 6 + i) * 11, sy - 36 - t * 32, 1.5, `rgba(255,230,150,${1 - t})`); }
  },
});

Object.assign(SCENE_PARTICLES, {
  academy: { fills: ['rgba(255,214,140,0.3)', 'rgba(255,230,170,0.5)', 'rgba(255,248,220,0.7)'], speed: -0.4, shape: 'dot' },
});

Object.assign(SPECIAL_FALLERS, { academy: 'tome' });
Object.assign(FALLER_COLORS, { tome: ['#6a2a5a', '#d8b456'] });
Object.assign(EXTRA_FALLERS, {
  tome(s, r, c1, c2, path, spin) {
    spin();
    ctx.fillStyle = c1; ctx.fillRect(-s * 0.85, -s * 1.05, s * 1.7, s * 2.1); ctx.beginPath(); ctx.rect(-s * 0.85, -s * 1.05, s * 1.7, s * 2.1); outline();
    ctx.fillStyle = '#f3ead2'; ctx.fillRect(-s * 0.7, -s * 0.95, s * 1.45, s * 0.14); ctx.fillRect(-s * 0.7, s * 0.82, s * 1.45, s * 0.14);
    ctx.fillStyle = c2; ctx.fillRect(-s * 0.85, -s * 1.05, s * 0.22, s * 2.1);
    starShape(s * 0.08, 0, s * 0.42, c2);
  },
});
