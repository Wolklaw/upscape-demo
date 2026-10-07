'use strict';

const UI_W = 480;
let GW = UI_W;
const BASE_H = 640;
let H = BASE_H;
const WALL = 32, LEFT = WALL;
let RIGHT = GW - WALL;
const FLOOR_H = 80;
const STEP = 1 / 60;

const DISPLAY = '"Germania One", "Arial Black", Impact, sans-serif';
const BODY = '"Barlow Semi Condensed", "Arial Narrow", "Trebuchet MS", sans-serif';
const NAVY = '#0a0e22';
const IN_APP = !!(window.chrome && window.chrome.webview);
const IN_ANDROID = !!window.AndroidHost;

function haptic(kind) {
  if (!settings.haptics) return;
  try {
    if (IN_ANDROID) window.AndroidHost.haptic(kind);
    else if (isTouch && navigator.vibrate) navigator.vibrate(kind === 'heavy' ? 40 : 15);
  } catch (e) {   }
}

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const approach = (v, t, d) => v < t ? Math.min(v + d, t) : Math.max(v - d, t);
const hexRgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const mixRgb = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const easeOutBack = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

function hashSeed(seed, n, k) {
  let h = (seed ^ Math.imul(n | 0, 0x9E3779B1) ^ Math.imul((k | 0) + 1, 0x85EBCA77)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
  h = Math.imul(h ^ (h >>> 15), 0x846ca68b);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function formatTime(frames) {
  const t = frames / 60, m = Math.floor(t / 60), s = t - m * 60;
  return `${m}:${s < 10 ? '0' : ''}${s.toFixed(2)}`;
}

function compact(list, keep) {
  let j = 0;
  for (let i = 0; i < list.length; i++) if (keep(list[i])) list[j++] = list[i];
  list.length = j;
}

const KEY = 'upscape.';
function load(k, d) { try { const v = localStorage.getItem(KEY + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
function save(k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {   } }

const settings = Object.assign({
  master: 8, music: 7, sfx: 8, quality: 'auto', lowfx: 'auto', shake: true, haptics: true, fps: false, retro: false, retroUnlocked: false,
  lang: null, width: window.matchMedia && matchMedia('(pointer: coarse)').matches ? 'fit' : 'normal',
  cheats: {},
}, load('settings', {}));
const saveSettings = () => save('settings', settings);
const QUALITY_CAPS = { high: 2, medium: 1.5, low: 1 };
// The most device pixels a wide stage's canvas may have before it renders below native resolution. Wide stages on big monitors
// would otherwise push several times more pixels than a normal tower, which costs frames; the browser scales the result up.
// Normal-width stages are never cut.
const PIXEL_BUDGET = { auto: 2.6e6, high: 12e6, medium: 2e6, low: 1.2e6 };
let renderCut = 1;

const FR = {};
const LANGS = ['en', 'fr'], LANG_NAMES = { en: 'ENGLISH', fr: 'FRANÇAIS' };
function T(s, ...args) {
  const r = settings.lang === 'fr' && FR[s] != null ? FR[s] : s;
  return args.length ? r.replace(/\{(\d)\}/g, (_, i) => args[i]) : r;
}

const canvas = document.getElementById('game');
const screenEl = document.getElementById('screen');
const mainCtx = canvas.getContext('2d', { alpha: false });
let ctx = mainCtx;
let scale = 1, dpr = 1;
const coarse = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
const weakDevice = !!((navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2));
const strongDevice = !!(navigator.deviceMemory >= 6 && navigator.hardwareConcurrency >= 6);
const defaultCap = coarse ? (strongDevice ? 2 : 1.5) : 2;
if (load('perfReset', 0) < 3) {
  save('dprCap', defaultCap);
  try { localStorage.removeItem(KEY + 'autoLow'); } catch (e) {   }
  save('perfReset', 3);
}
let dprCap = QUALITY_CAPS[settings.quality] || load('dprCap', defaultCap);
let autoLow = weakDevice;
let LOW = false, highHz = !IN_ANDROID, hzLocked = false;
const devicePx = () => scale * dpr;
let renderAlpha = 1;

function resize() {
  const aw = screenEl.clientWidth, ah = screenEl.clientHeight;
  if (!aw || !ah) return;
  H = Math.round(clamp(ah / aw * GW, BASE_H, 1070));
  scale = Math.max(0.2, Math.min(aw / GW, ah / H));
  const cap = LOW && settings.quality === 'auto' ? Math.min(dprCap, 1) : dprCap;
  dpr = settings.retro ? 0.5 : Math.min(window.devicePixelRatio || 1, cap);
  if (!settings.retro && GW > UI_W) {
    const css = GW * scale * H * scale, budget = (PIXEL_BUDGET[settings.quality] || PIXEL_BUDGET.auto) * renderCut;
    if (css * dpr * dpr > budget) dpr = Math.max(0.5, Math.sqrt(budget / css));
  }
  canvas.style.imageRendering = settings.retro ? 'pixelated' : 'auto';
  canvas.style.width = Math.floor(GW * scale) + 'px';
  canvas.style.height = Math.floor(H * scale) + 'px';
  canvas.width = Math.round(GW * scale * dpr);
  canvas.height = Math.round(H * scale * dpr);
  document.documentElement.style.setProperty('--s', scale.toFixed(3));
}
function applyHz() {
  if (IN_ANDROID && window.AndroidHost.setLowPower) { try { window.AndroidHost.setLowPower(LOW || !highHz); } catch (e) {   } }
}
function applyFx() {
  LOW = settings.lowfx === 'on' || (settings.lowfx === 'auto' && autoLow);
  applyHz();
  if (typeof Sfx !== 'undefined') Sfx.routeReverb();
  resize();
}
let isTouch = false;
function setTouch(on) {
  if (on === isTouch) return;
  isTouch = on;
  document.body.classList.toggle('is-touch', on);
  resize();
}
window.addEventListener('resize', resize);
if (window.matchMedia && matchMedia('(pointer: coarse)').matches) setTouch(true);

function rr(x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeLayer(w, h, opaque) {
  const k = devicePx();
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w * k));
  c.height = Math.max(1, Math.ceil(h * k));
  const g = c.getContext('2d', opaque ? { alpha: false } : undefined);
  // Stretch by a fraction of a pixel so the drawing covers the whole canvas: otherwise the last column and row stay
  // unpainted whenever w * k is not a whole number, and show as a hairline where layers are tiled.
  g.setTransform(c.width / w, 0, 0, c.height / h, 0, 0);
  return { c, g, w, h, k };
}
function drawInto(layer, fn) {
  const saved = ctx;
  ctx = layer.g;
  try { fn(); } finally { ctx = saved; }
  return layer;
}

const ATLAS = 1024, ATLAS_PAD = 2;
function newPage() {
  const c = document.createElement('canvas');
  c.width = c.height = ATLAS;
  return { c, g: c.getContext('2d'), x: 0, y: 0, rh: 0, gen: 0 };
}
function resetPage(pg) {
  pg.g.setTransform(1, 0, 0, 1, 0, 0);
  pg.g.clearRect(0, 0, ATLAS, ATLAS);
  pg.x = pg.y = pg.rh = 0;
  pg.gen++;
}
function makePool(max) { return { pages: [], i: 0, max, k: 0 }; }
function resetPool(pool) { for (const pg of pool.pages) resetPage(pg); pool.i = 0; }
function poolAlloc(pool, dw, dh) {
  const k = devicePx();
  if (pool.k !== k) { resetPool(pool); pool.k = k; }
  if (!pool.pages.length) pool.pages.push(newPage());
  const w = dw + ATLAS_PAD * 2, h = dh + ATLAS_PAD * 2;
  const fit = pg => {
    if (pg.x + w > ATLAS) { pg.y += pg.rh; pg.x = 0; pg.rh = 0; }
    return pg.y + h <= ATLAS;
  };
  let pg = pool.pages[pool.i];
  if (!fit(pg)) {
    if (pool.pages.length < pool.max) { pool.pages.push(newPage()); pool.i = pool.pages.length - 1; }
    else { pool.i = (pool.i + 1) % pool.pages.length; resetPage(pool.pages[pool.i]); }
    pg = pool.pages[pool.i];
    fit(pg);
  }
  const px = pg.x + ATLAS_PAD, py = pg.y + ATLAS_PAD;
  pg.x += w; pg.rh = Math.max(pg.rh, h);
  return { pg, px, py };
}
function makeSprite(pool, w, h, fn) {
  const k = devicePx(), dw = Math.ceil(w * k), dh = Math.ceil(h * k);
  let pg, px = 0, py = 0;
  if (dw + ATLAS_PAD * 2 > ATLAS || dh + ATLAS_PAD * 2 > ATLAS) {
    const c = document.createElement('canvas');
    c.width = dw; c.height = dh;
    pg = { c, g: c.getContext('2d'), gen: 0 };
  } else ({ pg, px, py } = poolAlloc(pool, dw, dh));
  const g = pg.g;
  g.save();
  g.setTransform(k, 0, 0, k, px, py);
  g.beginPath(); g.rect(0, 0, dw / k, dh / k); g.clip();
  const saved = ctx;
  ctx = g;
  try { fn(); } finally { ctx = saved; g.restore(); }
  return { pg, gen: pg.gen, sx: px, sy: py, sw: dw, sh: dh, w, h, k };
}
const spriteLive = s => !!s && s.gen === s.pg.gen && s.k === devicePx();
function blit(s, x, y, w, h) {
  ctx.drawImage(s.pg.c, s.sx, s.sy, s.sw, s.sh, x, y, w === undefined ? s.w : w, h === undefined ? s.h : h);
}
const DYN = makePool(6), TXT_DYN = makePool(3), TXT_STATIC = makePool(3);
const DIGITS = /\d/;

const textCache = new Map();
let fontsReady = 0;
function clearTextCache() { textCache.clear(); fitCache.clear(); resetPool(TXT_DYN); resetPool(TXT_STATIC); fontsReady++; }
function trim(map, max) {
  if (map.size <= max) return;
  let drop = map.size - max * 0.8;
  for (const key of map.keys()) { map.delete(key); if (--drop <= 0) break; }
}
if (document.fonts) {
  document.fonts.ready.then(clearTextCache);
  if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', clearTextCache);
}

const fitCache = new Map();
function fitSize(str, size, opts) {
  const font = `${opts.weight || ''} ${size}px ${opts.font || DISPLAY}`, key = str + '|' + font;
  let w = fitCache.get(key);
  if (w == null) {
    trim(fitCache, 600);
    mainCtx.font = font;
    w = mainCtx.measureText(str).width;
    fitCache.set(key, w);
  }
  return w > opts.max ? size * opts.max / w : size;
}

function text(str, x, y, size, fill, opts = {}) {
  if (opts.max) size = fitSize(String(str), size, opts);
  if (typeof fill === 'string' && opts.cache !== false && ctx === mainCtx) {
    const stroke = opts.stroke === false ? 0 : (opts.lw || Math.max(3, size * 0.2));
    str = String(str);
    const key = `${str}|${size}|${fill}|${stroke}|${opts.stroke || ''}|${opts.font || ''}|${opts.weight || ''}`;
    let e = textCache.get(key);
    if (!e || !spriteLive(e.s)) {
      trim(textCache, 800);
      const font = `${opts.weight || ''} ${size}px ${opts.font || DISPLAY}`;
      mainCtx.font = font;
      const tw = mainCtx.measureText(str).width;
      const pad = stroke / 2 + 2, h = size * 1.5 + stroke;
      const s = makeSprite(DIGITS.test(str) ? TXT_DYN : TXT_STATIC, tw + pad * 2, h, () => {
        ctx.font = font; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
        if (stroke) { ctx.lineWidth = stroke; ctx.strokeStyle = opts.stroke || NAVY; ctx.strokeText(str, pad, h / 2); }
        ctx.fillStyle = fill;
        ctx.fillText(str, pad, h / 2);
      });
      e = { s, w: tw, pad, h };
      textCache.set(key, e);
    }
    const align = opts.align || 'center';
    const ax = align === 'left' ? 0 : align === 'right' ? e.w : e.w / 2;
    blit(e.s, x - ax - e.pad, y - e.h / 2, e.w + e.pad * 2, e.h);
    return;
  }
  ctx.font = `${opts.weight || ''} ${size}px ${opts.font || DISPLAY}`;
  ctx.textAlign = opts.align || 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  if (opts.stroke !== false) {
    ctx.lineWidth = opts.lw || Math.max(3, size * 0.2);
    ctx.strokeStyle = opts.stroke || NAVY;
    ctx.strokeText(str, x, y);
  }
  ctx.fillStyle = fill;
  ctx.fillText(str, x, y);
}

function limb(x1, y1, x2, y2, w, c) {
  ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
function circ(x, y, r, fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function ell(x, y, rx, ry, fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
function tri(x1, y1, x2, y2, x3, y3, fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); ctx.fill(); }

function drawStar(cx, cy, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rad = i & 1 ? r * 0.48 : r;
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = NAVY; ctx.stroke();
}

function panel(x, y, w, h, edge) {
  ctx.fillStyle = 'rgba(10,14,34,0.9)';
  rr(x, y, w, h, 14); ctx.fill();
  ctx.strokeStyle = edge || 'rgba(182,227,122,0.5)'; ctx.lineWidth = 2; ctx.stroke();
}
