'use strict';

const savedClimber = climberById(load('climber', 'hal'));
const menu = {
  focus: 3,
  mode: modeById(load('mode', 'classic')).id,
  climber: isUnlocked(savedClimber) ? savedClimber.id : 'hal',
  skins: load('skins', {}),
  start: load('start', 0),
  tab: 0, boardWide: false,
  nudge: 0,
};
let uiFrame = 0;

let hits = [];
let hitDX = 0, hitDY = 0;
function addHit(x, y, w, h, fn) { hits.push({ x: x + hitDX, y: y + hitDY, w, h, fn }); }

let uiOX = 0, uiOY = 0;
function centered(draw) {
  ctx.save();
  ctx.translate(uiOX, uiOY);
  hitDX = uiOX; hitDY = uiOY;
  draw();
  hitDX = hitDY = 0;
  ctx.restore();
}

const pointer = { x: -1, y: -1, downAt: -99, mouse: false };
const under = (x, y, w, h) => pointer.x >= x + hitDX && pointer.x <= x + hitDX + w && pointer.y >= y + hitDY && pointer.y <= y + hitDY + h;
function button(x, y, w, h, label, o = {}) {
  const over = under(x, y, w, h), pressed = over && uiFrame - pointer.downAt < 9;
  const on = !!o.focus || (pointer.mouse && over);
  if (pressed) { ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(0.94, 0.94); ctx.translate(-x - w / 2, -y - h / 2); }
  ctx.fillStyle = o.primary ? (on ? '#ffb547' : '#e89a2c') : (on ? 'rgba(182,227,122,0.28)' : 'rgba(10,14,34,0.85)');
  rr(x, y, w, h, h / 2); ctx.fill();
  ctx.strokeStyle = on ? '#ffffff' : (o.primary ? '#ffd28a' : 'rgba(182,227,122,0.55)');
  ctx.lineWidth = on ? 3 : 2; ctx.stroke();
  if (o.icon) o.icon(x + w / 2, y + h / 2);
  else text(label, x + w / 2, y + h / 2 + 1, o.size || 20, o.primary ? NAVY : '#eef6ff', o.primary ? { stroke: false, max: w - 16 } : { lw: 4, max: w - 16 });
  if (pressed) ctx.restore();
  if (o.onClick) addHit(x, y, w, h, o.onClick);
}
function noteIcon(on) {
  return (cx, cy) => {
    const c = on ? '#eef6ff' : '#7c86ad';
    circ(cx - 6, cy + 6, 4, c); circ(cx + 6, cy + 3, 4, c);
    limb(cx - 2.5, cy + 6, cx - 2.5, cy - 9, 2.4, c); limb(cx + 9.5, cy + 3, cx + 9.5, cy - 12, 2.4, c);
    limb(cx - 2.5, cy - 9, cx + 9.5, cy - 12, 3.4, c);
    if (!on) limb(cx - 13, cy + 11, cx + 14, cy - 13, 3, '#ff6b6b');
  };
}
function speakerIcon(on) {
  return (cx, cy) => {
    const c = on ? '#eef6ff' : '#7c86ad';
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.moveTo(cx - 12, cy - 4); ctx.lineTo(cx - 6, cy - 4); ctx.lineTo(cx + 1, cy - 11); ctx.lineTo(cx + 1, cy + 11); ctx.lineTo(cx - 6, cy + 4); ctx.lineTo(cx - 12, cy + 4); ctx.closePath(); ctx.fill();
    if (on) {
      ctx.strokeStyle = c; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(cx + 2, cy, 6, -0.8, 0.8); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 2, cy, 11, -0.8, 0.8); ctx.stroke();
    } else {
      limb(cx + 6, cy - 6, cx + 14, cy + 6, 2.6, '#ff6b6b');
      limb(cx + 14, cy - 6, cx + 6, cy + 6, 2.6, '#ff6b6b');
    }
  };
}

function arrow(x, y, dir, onClick) {
  const over = under(x - 22, y - 24, 44, 48);
  const s = (9 + (Math.sin(uiFrame * 0.15) > 0.9 ? 1 : 0)) * (over && uiFrame - pointer.downAt < 9 ? 0.8 : 1);
  tri(x - dir * s * 0.6, y - s, x - dir * s * 0.6, y + s, x + dir * s, y, over && pointer.mouse ? '#ffffff' : '#b6e37a');
  addHit(x - 22, y - 24, 44, 48, onClick);
}

let logoArt = null;
function logoLayer() {
  const k = devicePx();
  if (logoArt && logoArt.k === k && logoArt.ready === fontsReady) return logoArt;
  const size = 84, lw = 13;
  logoArt = drawInto(makeLayer(440, 150), () => {
    ctx.font = `${size}px ${DISPLAY}`;
    const wUp = ctx.measureText('UP').width, wRest = ctx.measureText('SCAPE').width, w = wUp + wRest;
    const x0 = 220 - w / 2, y = 78;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    ctx.lineWidth = lw + 8; ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.strokeText('UPSCAPE', x0, y + 6);
    ctx.lineWidth = lw; ctx.strokeStyle = NAVY;
    ctx.strokeText('UPSCAPE', x0, y);
    const g1 = ctx.createLinearGradient(0, y - size / 2, 0, y + size / 2);
    g1.addColorStop(0, '#f0ffb0'); g1.addColorStop(0.5, '#8be05a'); g1.addColorStop(1, '#2f9a48');
    ctx.fillStyle = g1; ctx.fillText('UP', x0, y);
    const g2 = ctx.createLinearGradient(0, y - size / 2, 0, y + size / 2);
    g2.addColorStop(0, '#fff6c2'); g2.addColorStop(0.5, '#ffc04a'); g2.addColorStop(1, '#ff6b3d');
    ctx.fillStyle = g2; ctx.fillText('SCAPE', x0 + wUp, y);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(x0 + 6, y - size * 0.3, w - 12, 3);
    const ax = x0 + wUp / 2;
    ctx.fillStyle = NAVY;
    ctx.beginPath(); ctx.moveTo(ax - 24, 34); ctx.lineTo(ax, 6); ctx.lineTo(ax + 24, 34); ctx.lineTo(ax + 12, 34); ctx.lineTo(ax, 21); ctx.lineTo(ax - 12, 34); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8be05a';
    ctx.beginPath(); ctx.moveTo(ax - 17, 30); ctx.lineTo(ax, 11); ctx.lineTo(ax + 17, 30); ctx.lineTo(ax + 11, 30); ctx.lineTo(ax, 18); ctx.lineTo(ax - 11, 30); ctx.closePath(); ctx.fill();
  });
  logoArt.ready = fontsReady;
  return logoArt;
}
function drawLogo(y) {
  const a = logoLayer();
  ctx.save();
  ctx.translate(UI_W / 2, y);
  ctx.rotate(Math.sin(uiFrame * 0.03) * 0.015);
  ctx.drawImage(a.c, -220, -78, 440, 150);
  ctx.restore();
}

function dim(a) { ctx.fillStyle = `rgba(10,14,34,${a})`; ctx.fillRect(-uiOX, -uiOY, GW, H); }

const currentClimber = () => climberById(menu.climber);
const currentSkin = () => skinById(currentClimber(), menu.skins[menu.climber] || 'classic');
function bestLine(modeId, wide = playsWide(modeId)) {
  const b = boardFor(modeId, wide)[0];
  if (!b) return T('NO RECORD YET');
  return T('BEST {0} · {1}', modeId === 'sprint' ? formatTime(b.time) : num(b.score), b.name);
}

function cycleMode(d) {
  const i = MODES.findIndex(m => m.id === menu.mode);
  menu.mode = MODES[(i + d + MODES.length) % MODES.length].id;
  save('mode', menu.mode);
  Sfx.move();
}
function cycleClimber(d) {
  const i = CLIMBERS.findIndex(c => c.id === menu.climber);
  menu.climber = CLIMBERS[(i + d + CLIMBERS.length) % CLIMBERS.length].id;
  if (isUnlocked(currentClimber())) save('climber', menu.climber);
  Sfx.move();
}
const FOCUS_ORDER = [0, 6, 1, 2, 3, 4, 5, 7];
function currentStart() { return startFloors().filter(f => f <= menu.start).pop() || 0; }
function cycleStart(d) {
  const list = startFloors();
  menu.start = list[(list.indexOf(currentStart()) + d + list.length) % list.length];
  save('start', menu.start);
  Sfx.move();
}
function cycleSkin(d) {
  const c = currentClimber(), list = skinsFor(c);
  const s = list[(list.indexOf(currentSkin()) + d + list.length) % list.length];
  menu.skins[c.id] = s.id;
  if (skinUnlocked(c, s)) save('skins', menu.skins);
  Sfx.move();
}
function menuChange(d) {
  if (menu.focus === 0) cycleMode(d);
  else if (menu.focus === 1 || menu.focus === 3) cycleClimber(d);
  else if (menu.focus === 2) cycleSkin(d);
  else if (menu.focus === 6) cycleStart(d);
}
function menuActivate() {
  if (menu.focus === 4) { openGoals(); return; }
  if (menu.focus === 7) { openSettings('menu'); return; }
  if (menu.focus === 5) { openScores(); return; }
  const c = currentClimber(), s = currentSkin();
  if (!isUnlocked(c)) { Sfx.nope(); menu.nudge = 12; menu.focus = 1; return; }
  if (!skinUnlocked(c, s)) { Sfx.nope(); menu.nudge = 12; menu.focus = 2; return; }
  Sfx.select();
  beginRun(menu.mode, c.id, s.id, currentStart());
}
function openScores() {
  state = 'scores';
  menu.tab = MODES.findIndex(m => m.id === menu.mode);
  menu.boardWide = playsWide(menu.mode);
  Sfx.move();
}
function openGoals() {
  state = 'goals';
  Sfx.move();
}
function toMenu() {
  hideNameBox();
  newWorld(menu.mode, menu.climber, currentSkin().id, 0, true);
  lastCamY = G.camY;
  state = 'menu';
  menu.focus = 3;
  Sfx.music.play('lobby');
}

function drawMenuBackdrop() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(10,14,34,0.88)');
  g.addColorStop(1, 'rgba(10,14,34,0.55)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, GW, H);
  if (state === 'lang') return;
  ctx.save();
  ctx.translate(uiOX, 0);
  hitDX = uiOX;
  button(380, 12, 88, 24, T('PRIVACY'), { size: 11, onClick: () => { state = 'privacy'; Sfx.move(); } });
  drawDirectButtons();
  hitDX = 0;
  ctx.restore();
}

const CLIMBER_DY = 12;
function drawMenu() {
  drawLogo(92);
  text(T(DEMO ? 'free demo: the first 2,000 floors' : 'escape the goblin tower!'), UI_W / 2, 160, 13, '#c6f08a', { font: BODY, weight: 800, lw: 4 });

  const mode = modeById(menu.mode);
  panel(40, 180, 400, 94, menu.focus === 0 ? '#ffb547' : undefined);
  addHit(40, 180, 400, 94, () => { menu.focus = 0; });
  text(T('MODE'), 60, 195, 12, '#b6e37a', { align: 'left', font: BODY, weight: 800, lw: 3 });
  text(bestLine(mode.id), 420, 195, 12, '#ffd93d', { align: 'right', font: BODY, weight: 800, lw: 3, max: 290 });
  text(T(mode.name), UI_W / 2, 219, 28, '#ffffff', { lw: 6, max: 300 });
  text(T(mode.desc), UI_W / 2, 242, 11.5, '#c9d2e8', { font: BODY, weight: 700, lw: 3, max: 372 });
  if (mode.id !== 'sprint') {
    const st = currentStart(), tiers = startFloors().length;
    if (menu.focus === 6) { ctx.strokeStyle = '#ffb547'; ctx.lineWidth = 2; rr(96, 250, 288, 22, 8); ctx.stroke(); }
    addHit(96, 248, 288, 26, () => { menu.focus = 6; });
    text(tiers > 1 ? T('START FLOOR {0} · {1}', num(st), T(themeOf(st).name)) : T('START FLOOR 0 · reach floor 100 for more'), UI_W / 2, 261, 12, tiers > 1 ? '#ffd93d' : '#8f9bc4', { font: BODY, weight: 800, lw: 3, max: tiers > 1 ? 236 : 370 });
    if (tiers > 1) { arrow(108, 261, -1, () => { menu.focus = 6; cycleStart(-1); }); arrow(372, 261, 1, () => { menu.focus = 6; cycleStart(1); }); }
  }
  arrow(66, 219, -1, () => { menu.focus = 0; cycleMode(-1); });
  arrow(414, 219, 1, () => { menu.focus = 0; cycleMode(1); });

  const c = currentClimber(), skin = currentSkin();
  const climberLocked = !isUnlocked(c), skinLocked = !skinUnlocked(c, skin);
  const secret = skin.glitch && skinLocked;
  const nudge = menu.nudge > 0 ? Math.sin(menu.nudge * 1.6) * 5 : 0;
  ctx.save();
  ctx.translate(nudge, CLIMBER_DY);
  hitDY += CLIMBER_DY;
  panel(40, 270, 400, 230, menu.focus === 1 ? '#ffb547' : undefined);
  addHit(40, 270, 400, 230, () => { menu.focus = 1; });
  text(T('CLIMBER'), 60, 286, 12, '#b6e37a', { align: 'left', font: BODY, weight: 800, lw: 3 });
  text(`${CLIMBERS.indexOf(c) + 1} / ${CLIMBERS.length}`, 420, 286, 12, '#b6e37a', { align: 'right', font: BODY, weight: 800, lw: 3 });
  ell(132, 470, 46, 8, 'rgba(182,227,122,0.15)');
  if (climberLocked || secret) {
    drawClimberAt(c, 132, 468, 2.2, uiFrame, true);
    text('?', 132, 404, 48, '#b6e37a', { lw: 8 });
  } else {
    const a0 = ctx.globalAlpha;
    if (skinLocked) ctx.globalAlpha = a0 * 0.4;
    drawClimberAt(c, 132, 468, 2.2, uiFrame, false, skin);
    ctx.globalAlpha = a0;
  }
  text(c.name, 322, 312, 28, climberLocked ? '#7c86ad' : '#ffffff', { lw: 6 });
  if (climberLocked) {
    text(T('LOCKED'), 322, 346, 18, '#ff7fb7', { lw: 5, max: 180 });
    wrapCentered(goalText(c.unlock), 322, 374, 180, 18, 14, '#eef6ff');
    text(goalProgress(c.unlock), 322, 428, 12, '#ffd93d', { font: BODY, weight: 800, lw: 3 });
  } else {
    text(T(c.tag), 322, 336, 12.5, '#c9d2e8', { font: BODY, weight: 700, lw: 3, max: 196 });
    [['SPEED', 'speed'], ['JUMP', 'jump'], ['GRIP', 'grip'], ['AIR', 'air']].forEach(([label, k], i) => {
      const y = 360 + i * 18;
      text(T(label), 228, y, 11, '#b6e37a', { align: 'left', font: BODY, weight: 800, lw: 3, max: 48 });
      for (let j = 0; j < 5; j++) {
        ctx.fillStyle = j < c.stats[k] ? '#ffd93d' : 'rgba(182,227,122,0.18)';
        rr(280 + j * 23, y - 5, 19, 10, 3); ctx.fill();
      }
    });
    const list = skinsFor(c);
    if (menu.focus === 2) { ctx.strokeStyle = '#ffb547'; ctx.lineWidth = 2; rr(224, 434, 200, 60, 10); ctx.stroke(); }
    addHit(224, 434, 200, 60, () => { menu.focus = 2; });
    text(T('SKIN {0}/{1}', list.indexOf(skin) + 1, list.length), 234, 446, 10.5, '#b6e37a', { align: 'left', font: BODY, weight: 800, lw: 3 });
    text(secret ? '? ? ?' : T(skin.name), 324, 464, 17, skinLocked ? '#7c86ad' : '#ffffff', { lw: 4, max: 136 });
    if (skinLocked) {
      text(`${goalText(skin.unlock)} · ${goalProgress(skin.unlock)}`, 324, 484, 10, '#ffb547', { font: BODY, weight: 800, lw: 3, max: 196 });
    }
    arrow(240, 464, -1, () => { menu.focus = 2; cycleSkin(-1); });
    arrow(408, 464, 1, () => { menu.focus = 2; cycleSkin(1); });
  }
  arrow(66, 384, -1, () => { menu.focus = 1; cycleClimber(-1); });
  arrow(414, 384, 1, () => { menu.focus = 1; cycleClimber(1); });
  ctx.restore();
  hitDY -= CLIMBER_DY;

  const ready = !climberLocked && !skinLocked;
  button(140, 522, 200, 46, T(ready ? 'PLAY' : 'LOCKED'), {
    primary: ready, focus: menu.focus === 3, size: 28,
    onClick: () => { menu.focus = 3; menuActivate(); },
  });
  button(46, 576, 126, 34, T('ACHIEVEMENTS'), { focus: menu.focus === 4, size: settings.lang === 'fr' ? 15 : 12.5, onClick: () => { menu.focus = 4; openGoals(); } });
  button(177, 576, 126, 34, T('SCORES'), { focus: menu.focus === 5, size: 15, onClick: () => { menu.focus = 5; openScores(); } });
  button(308, 576, 126, 34, T('SETTINGS'), { focus: menu.focus === 7, size: 15, onClick: () => { menu.focus = 7; openSettings('menu'); } });
  addHit(130, 20, 220, 130, tapLogo);

  if (menu.toast && uiFrame - menu.toast.at < 240) {
    panel(70, 150, 340, 70, '#ffd93d');
    text(menu.toast.text, UI_W / 2, 174, 22, '#ffd93d', { lw: 5 });
    text(menu.toast.sub, UI_W / 2, 200, 12, '#eef6ff', { font: BODY, weight: 800, lw: 3, max: 320 });
  }

  const help = T(isTouch ? 'tap or swipe to choose' : '↑↓ ←→ choose · SPACE play · M sound · N music · F fullscreen');
  text(help, UI_W / 2, 628, 11.5, '#8f9bc4', { font: BODY, weight: 800, lw: 3, max: UI_W - 20 });
}

function wrapCentered(str, x, y, maxW, lineH, size, color) {
  ctx.font = `800 ${size}px ${BODY}`;
  const lines = [];
  let line = '';
  for (const word of str.split(' ')) {
    const t = line ? line + ' ' + word : word;
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = word; } else line = t;
  }
  if (line) lines.push(line);
  lines.forEach((l, i) => text(l, x, y + i * lineH, size, color, { font: BODY, weight: 800, lw: 3 }));
}

const SETTING_ROWS = [
  { id: 'lang', label: 'LANGUAGE', type: 'choice', options: LANGS },
  { id: 'master', label: 'MASTER VOLUME', type: 'vol' },
  { id: 'music', label: 'MUSIC', type: 'vol' },
  { id: 'sfx', label: 'SOUND EFFECTS', type: 'vol' },
  { id: 'quality', label: 'GRAPHICS', type: 'choice', options: ['auto', 'high', 'medium', 'low'] },
  { id: 'lowfx', label: 'LOW FX MODE', type: 'choice', options: ['auto', 'on', 'off'] },
  { id: 'width', label: 'LEVEL WIDTH', type: 'choice', options: ['normal', 'wide', 'huge', 'fit'], labels: { normal: 'NORMAL', wide: 'WIDE', huge: 'HUGE', fit: 'FIT SCREEN' }, hint: 'Wider levels: more routes up, more hazards. FIT SCREEN follows your screen, so turn a phone sideways to go wide. Starts with your next run.' },
  { id: 'shake', label: 'SCREEN SHAKE', type: 'bool' },
  { id: 'haptics', label: 'VIBRATION', type: 'bool' },
  { id: 'fps', label: 'SHOW FPS', type: 'bool' },
  { id: 'fullscreen', label: 'FULLSCREEN', type: 'action', hidden: () => IN_ANDROID },
  { id: 'retro', label: 'RETRO PIXELS', type: 'bool', locked: () => !settings.retroUnlocked },
  { id: 'cheats', label: 'CHEATS', type: 'action', locked: () => !settings.retroUnlocked },
  { id: 'reset', label: 'RESET PROGRESS', type: 'action' },
];
const settingRows = () => SETTING_ROWS.filter(r => !(r.hidden && r.hidden()));
let settingsFrom = 'menu', settingsFocus = 0, resetArmed = 0;

function openSettings(from) {
  settingsFrom = from;
  settingsFocus = 0;
  resetArmed = 0;
  state = 'settings';
  Sfx.move();
}
function closeSettings() {
  state = settingsFrom;
  Sfx.move();
}
function resetProgress() {
  for (const k of ['stats', 'boards', 'skins', 'start', 'climber', 'best', 'dprCap']) { try { localStorage.removeItem(KEY + k); } catch (e) {   } }
  stats = Object.assign({}, STATS_DEFAULT);
  boards = Object.fromEntries(MODES.map(m => [m.id, []]));
  menu.skins = {}; menu.start = 0; menu.climber = 'hal';
  resetArmed = 0;
  Sfx.broken();
}
function changeSetting(row, d) {
  if (row.locked && row.locked()) { Sfx.nope(); return; }
  if (row.type === 'vol') settings[row.id] = clamp(settings[row.id] + d, 0, 10);
  else if (row.type === 'choice') {
    const i = row.options.indexOf(settings[row.id]);
    settings[row.id] = row.options[(i + d + row.options.length) % row.options.length];
  } else if (row.type === 'bool') settings[row.id] = !settings[row.id];
  else if (row.id === 'fullscreen') { toggleFullscreen(); return; }
  else if (row.id === 'cheats') { state = 'cheats'; cheatFocus = 0; Sfx.move(); return; }
  else if (row.id === 'reset') {
    if (resetArmed && uiFrame - resetArmed < 180) resetProgress();
    else { resetArmed = uiFrame; Sfx.nope(); }
    return;
  }
  saveSettings();
  if (row.type === 'vol') Sfx.applyVolumes();
  if (row.id === 'quality') {
    if (settings.quality === 'auto') save('dprCap', defaultCap);
    dprCap = QUALITY_CAPS[settings.quality] || load('dprCap', 2);
    resize();
  }
  if (row.id === 'lowfx') {
    if (settings.lowfx === 'auto') autoLow = weakDevice;
    applyFx();
  }
  if (row.id === 'retro') resize();
  if (row.id === 'width' && settingsFrom === 'menu') { newWorld(menu.mode, menu.climber, currentSkin().id, 0, true); lastCamY = G.camY; }
  if (row.id === 'lang') applyLang();
  Sfx.move();
}
function drawSettings() {
  dim(0.9);
  text(T('SETTINGS'), UI_W / 2, 52, 42, '#ffffff', { lw: 9 });
  const rows = settingRows(), RH = rows.length > 13 ? 32 : rows.length > 12 ? 36 : 38;
  settingsFocus = clamp(settingsFocus, 0, rows.length);
  panel(30, 86, 420, rows.length * RH + 12);
  rows.forEach((row, i) => {
    const y = 110 + i * RH, focus = settingsFocus === i, locked = row.locked && row.locked();
    if (focus) { ctx.fillStyle = 'rgba(255,181,71,0.16)'; rr(38, y - (RH - 2) / 2, 404, RH - 2, 10); ctx.fill(); }
    text(locked ? '? ? ?' : T(row.label), 54, y, 15, row.id === 'reset' ? '#ff6b6b' : locked ? '#7c86ad' : '#ffffff', { align: 'left', lw: 3, max: 210 });
    addHit(38, y - RH / 2, 220, RH, () => { settingsFocus = i; if (row.type === 'bool' || row.type === 'action') changeSetting(row, 1); });
    if (row.type === 'vol') {
      for (let j = 0; j < 10; j++) {
        ctx.fillStyle = j < settings[row.id] ? '#ffd93d' : 'rgba(182,227,122,0.18)';
        rr(292 + j * 12, y - 6, 9, 12, 2); ctx.fill();
        addHit(290 + j * 12, y - RH / 2, 12, RH, () => { settingsFocus = i; changeSetting(row, j + 1 - settings[row.id]); });
      }
      arrow(272, y, -1, () => { settingsFocus = i; changeSetting(row, -1); });
      arrow(424, y, 1, () => { settingsFocus = i; changeSetting(row, 1); });
    } else if (row.type === 'choice') {
      const v = row.id === 'lang' ? LANG_NAMES[settings.lang] : T(row.labels ? row.labels[settings[row.id]] : settings[row.id].toUpperCase());
      text(row.id === 'lowfx' && settings.lowfx === 'auto' ? T(LOW ? '{0}: ON' : '{0}: OFF', v) : v, 350, y, 16, '#ffd93d', { lw: 3, max: 120 });
      arrow(272, y, -1, () => { settingsFocus = i; changeSetting(row, -1); });
      arrow(424, y, 1, () => { settingsFocus = i; changeSetting(row, 1); });
    } else if (row.type === 'bool') {
      const on = !!settings[row.id];
      ctx.fillStyle = locked ? 'rgba(182,227,122,0.1)' : on ? '#6bcb77' : 'rgba(182,227,122,0.18)';
      rr(360, y - 12, 70, 24, 12); ctx.fill();
      text(T(locked ? 'SECRET' : on ? 'ON' : 'OFF'), 395, y + 1, 13, on && !locked ? NAVY : '#c9d2e8', { stroke: false });
      addHit(350, y - RH / 2, 92, RH, () => { settingsFocus = i; changeSetting(row, 1); });
    } else {
      const label = row.id === 'reset' ? T(resetArmed && uiFrame - resetArmed < 180 ? 'PRESS AGAIN' : 'RESET')
        : row.id === 'cheats' ? (locked ? T('SECRET') : T('{0} ON', CHEATS.filter(c => settings.cheats[c.id]).length))
        : T(document.fullscreenElement ? 'EXIT' : 'ENTER');
      button(330, y - 14, 104, 28, label, { size: 13, onClick: () => { settingsFocus = i; changeSetting(row, 1); } });
    }
  });
  const by = 110 + rows.length * RH + 4;
  button(180, by, 120, 36, T('BACK'), { focus: settingsFocus === rows.length, size: 18, onClick: closeSettings });
  const hint = rows[settingsFocus] && rows[settingsFocus].hint;
  if (hint) wrapCentered(T(hint), UI_W / 2, by + 50, 430, 15, 12, '#ffd93d');
  else if (!isTouch) text(T('↑↓ choose · ←→ change · ESC back'), UI_W / 2, by + 52, 12, '#8f9bc4', { font: BODY, weight: 800, lw: 3 });
}

let langFocus = (navigator.language || '').toLowerCase().startsWith('fr') ? 1 : 0;
function chooseLang(lang) {
  settings.lang = lang;
  saveSettings();
  applyLang();
  state = 'menu';
  Sfx.select();
}
function applyLang() {
  document.documentElement.lang = settings.lang || 'en';
  nameBox.querySelector('button').textContent = T('SAVE');
  nameInput.setAttribute('aria-label', T('Your name for the high score board'));
  canvas.setAttribute('aria-label', T('Upscape game. Arrow keys to run, Space to jump.'));
}
function drawFlag(lang, x, y, w, h) {
  ctx.save();
  rr(x, y, w, h, 6); ctx.clip();
  if (lang === 'fr') {
    ['#1f4fb5', '#ffffff', '#e2322b'].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(x + i * w / 3, y, w / 3 + 1, h); });
  } else {
    ctx.fillStyle = '#1a2f7a'; ctx.fillRect(x, y, w, h);
    ctx.lineCap = 'butt';
    limb(x, y, x + w, y + h, h * 0.2, '#ffffff'); limb(x + w, y, x, y + h, h * 0.2, '#ffffff');
    limb(x, y, x + w, y + h, h * 0.07, '#d22f36'); limb(x + w, y, x, y + h, h * 0.07, '#d22f36');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x + w / 2 - h * 0.17, y, h * 0.34, h); ctx.fillRect(x, y + h / 2 - h * 0.17, w, h * 0.34);
    ctx.fillStyle = '#d22f36'; ctx.fillRect(x + w / 2 - h * 0.1, y, h * 0.2, h); ctx.fillRect(x, y + h / 2 - h * 0.1, w, h * 0.2);
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2; rr(x, y, w, h, 6); ctx.stroke();
}
function drawLangPicker() {
  drawLogo(110);
  text('LANGUAGE · LANGUE', UI_W / 2, 206, 18, '#b6e37a', { lw: 5 });
  LANGS.forEach((lang, i) => {
    const y = 240 + i * 150, focus = langFocus === i;
    panel(70, y, 340, 130, focus ? '#ffb547' : undefined);
    drawFlag(lang, 100, y + 25, 120, 80);
    text(LANG_NAMES[lang], 320, y + 65, 26, focus ? '#ffd93d' : '#ffffff', { lw: 6, max: 160 });
    addHit(70, y, 340, 130, () => { langFocus = i; chooseLang(lang); });
  });
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiPos = 0, logoTaps = [];
function unlockRetro() {
  if (settings.retroUnlocked) { menu.toast = { text: T('ALREADY UNLOCKED'), sub: T('Cheats and retro pixels are in Settings'), at: uiFrame }; return; }
  settings.retroUnlocked = true;
  saveSettings();
  Sfx.unlock();
  haptic('heavy');
  menu.toast = { text: T('SECRETS UNLOCKED'), sub: T('Cheats and retro pixels are now in Settings'), at: uiFrame };
}
function tapLogo() {
  const now = uiFrame;
  logoTaps = logoTaps.filter(t => now - t < 180).concat(now);
  if (logoTaps.length >= 7) { logoTaps = []; unlockRetro(); }
}

let cheatFocus = 0;
function toggleCheat(c) {
  settings.cheats[c.id] = !settings.cheats[c.id];
  saveSettings();
  Sfx.move();
}
function drawCheats() {
  dim(0.9);
  text(T('CHEATS'), UI_W / 2, 52, 42, '#ff7fb7', { lw: 9 });
  text(T("Runs with any cheat on don't count for scores or achievements."), UI_W / 2, 86, 11.5, '#c9d2e8', { font: BODY, weight: 800, lw: 3, max: 420 });
  panel(30, 104, 420, CHEATS.length * 46 + 12);
  CHEATS.forEach((c, i) => {
    const y = 132 + i * 46, on = !!settings.cheats[c.id];
    if (cheatFocus === i) { ctx.fillStyle = 'rgba(255,127,183,0.16)'; rr(38, y - 20, 404, 40, 10); ctx.fill(); }
    text(T(c.name), 54, y - 7, 16, '#ffffff', { align: 'left', lw: 3, max: 290 });
    text(T(c.desc), 54, y + 10, 11.5, '#9fa9cf', { align: 'left', font: BODY, weight: 800, lw: 3, max: 296 });
    ctx.fillStyle = on ? '#ff7fb7' : 'rgba(182,227,122,0.18)';
    rr(360, y - 12, 70, 24, 12); ctx.fill();
    text(T(on ? 'ON' : 'OFF'), 395, y + 1, 13, on ? NAVY : '#c9d2e8', { stroke: false });
    addHit(38, y - 20, 404, 40, () => { cheatFocus = i; toggleCheat(c); });
  });
  const by = 132 + CHEATS.length * 46;
  button(180, by, 120, 38, T('BACK'), { focus: cheatFocus === CHEATS.length, size: 18, onClick: () => { state = 'settings'; Sfx.move(); } });
}

const ACH_PER_PAGE = 8;
function drawAchievements() {
  dim(0.9);
  const done = ACHIEVEMENTS.filter(a => goalDone(a.goal)).length, total = ACHIEVEMENTS.length;
  const pages = Math.ceil(total / ACH_PER_PAGE);
  menu.achPage = clamp(menu.achPage || 0, 0, pages - 1);
  text(T('ACHIEVEMENTS'), UI_W / 2, 46, 36, '#ffffff', { lw: 8 });
  text(T('{0} of {1} earned · {2}%', done, total, Math.round(done / total * 100)), UI_W / 2, 78, 13, '#ffd93d', { font: BODY, weight: 800, lw: 3 });
  panel(30, 94, 420, ACH_PER_PAGE * 54 + 10);
  ACHIEVEMENTS.slice(menu.achPage * ACH_PER_PAGE, (menu.achPage + 1) * ACH_PER_PAGE).forEach((a, i) => {
    const y = 124 + i * 54, ok = goalDone(a.goal), hidden = a.secret && !ok;
    if (i) { ctx.fillStyle = 'rgba(182,227,122,0.1)'; ctx.fillRect(46, y - 27, 388, 1); }
    if (ok) drawSigil(60, y, 15, '#ffb547', '#fff1b8');
    else { circ(60, y, 14, 'rgba(182,227,122,0.12)'); text(hidden ? '?' : '·', 60, y + 1, 16, '#7c86ad', { stroke: false }); }
    text(hidden ? '? ? ?' : T(a.name), 84, y - 12, 15, ok ? '#ffffff' : '#c9d2e8', { align: 'left', lw: 3, max: 250 });
    text(hidden ? T('A hidden achievement. Keep climbing...') : goalText(a.goal), 84, y + 4, 11, '#9fa9cf', { align: 'left', font: BODY, weight: 800, lw: 3, max: 346 });
    if (a.reward && !hidden) text(T('Reward: {0}', rewardLabel(a)), 84, y + 18, 10.5, ok ? '#6bcb77' : '#7fae86', { align: 'left', font: BODY, weight: 800, lw: 3, max: 346 });
    const frac = ok ? 1 : goalFraction(a.goal);
    if (!hidden && !ok && GOAL_TYPES[a.goal.type].value) {
      ctx.fillStyle = 'rgba(182,227,122,0.15)'; rr(362, y - 1, 70, 5, 2.5); ctx.fill();
      ctx.fillStyle = '#ffd93d'; rr(362, y - 1, Math.max(5, 70 * frac), 5, 2.5); ctx.fill();
    }
    if (!hidden) text(ok ? T('DONE') : goalProgress(a.goal), 432, y - 12, ok ? 13 : 10.5, ok ? '#6bcb77' : '#ffd93d', { align: 'right', font: ok ? DISPLAY : BODY, weight: ok ? '' : 800, lw: 3 });
  });
  const py = 124 + ACH_PER_PAGE * 54 - 6;
  arrow(170, py, -1, () => { menu.achPage = (menu.achPage + pages - 1) % pages; Sfx.move(); });
  text(`${menu.achPage + 1} / ${pages}`, UI_W / 2, py, 15, '#ffffff', { lw: 3 });
  arrow(310, py, 1, () => { menu.achPage = (menu.achPage + 1) % pages; Sfx.move(); });
  button(180, py + 26, 120, 36, T('BACK'), { focus: true, size: 18, onClick: () => { state = 'menu'; Sfx.move(); } });
}

const PRIVACY_TEXT = [
  'Upscape does not collect, use or share any personal information.',
  'Your high scores, the name you type for the board, unlocked climbers and sound settings are saved only on this device. They are never sent anywhere.',
  'There are no ads, no accounts, no analytics and no tracking. The game works without an internet connection.',
  ...PRIVACY_EXTRA,
  "On Android, your device's own backup may include the game's saved scores, like any app data.",
  'Made by Wolklaw. Fonts: Germania One by John Vargas Beltrán and Barlow Semi Condensed by the Barlow Project Authors, under the SIL Open Font License 1.1.',
];
function wrapLines(str, maxW, size) {
  ctx.font = `700 ${size}px ${BODY}`;
  const lines = [];
  let line = '';
  for (const word of str.split(' ')) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}
let privacyLayout = null;
function privacyFit() {
  const key = settings.lang + '|' + fontsReady;
  if (privacyLayout && privacyLayout.key === key) return privacyLayout;
  let size = 16, best = null;
  for (; size >= 10; size -= 0.5) {
    const lineH = size * 1.42, gap = size * 0.8;
    const paras = PRIVACY_TEXT.map(p => wrapLines(T(p), 356, size));
    const h = paras.reduce((a, l) => a + l.length * lineH, 0) + gap * (paras.length - 1) + 44;
    best = { key, size, lineH, gap, paras, h };
    if (112 + h <= 540) break;
  }
  privacyLayout = best;
  return best;
}
function drawPrivacy() {
  dim(0.9);
  text(T('PRIVACY'), UI_W / 2, 70, 44, '#ffffff', { lw: 9, max: 400 });
  const L = privacyFit();
  panel(40, 112, 400, L.h);
  let y = 112 + 22 + L.size * 0.7;
  for (const lines of L.paras) {
    for (const line of lines) { text(line, 62, y, L.size, '#eef6ff', { align: 'left', font: BODY, weight: 700, lw: 3 }); y += L.lineH; }
    y += L.gap;
  }
  button(180, 112 + L.h + 22, 120, 44, T('BACK'), { focus: true, size: 20, onClick: () => { state = 'menu'; Sfx.move(); } });
}

const MEDALS = ['#ffd93d', '#d7dde3', '#e0965a'];
function drawScores() {
  dim(0.86);
  text(T('HIGH SCORES'), UI_W / 2, 56, 40, '#ffffff', { lw: 9, max: 420 });
  const tw = 400 / MODES.length;
  MODES.forEach((m, i) => {
    button(40 + i * tw + 3, 88, tw - 6, 30, T(m.name), { focus: menu.tab === i, size: 14, onClick: () => { menu.tab = i; Sfx.move(); } });
  });
  const mode = MODES[menu.tab], canWide = mode.id !== 'sprint', wide = canWide && menu.boardWide, b = boardFor(mode.id, wide);
  if (canWide) {
    [['NORMAL', false], ['WIDE', true]].forEach(([label, w], i) => {
      button(140 + i * 104, 124, 96, 26, T(label), { focus: wide === w, size: 12, onClick: () => { menu.boardWide = w; Sfx.move(); } });
    });
  }
  panel(40, 156, 400, 300);
  for (let i = 0; i < 5; i++) {
    const y = 186 + i * 58, e = b[i];
    if (i) { ctx.fillStyle = 'rgba(182,227,122,0.12)'; ctx.fillRect(60, y - 29, 360, 1); }
    if (e && i < 3) drawSigil(78, y, 16, MEDALS[i], '#ffffff');
    else circ(78, y, 14, e ? '#4a547f' : 'rgba(182,227,122,0.12)');
    text(String(i + 1), 78, y + 1, 15, e && i < 3 ? NAVY : '#eef6ff', { stroke: false });
    if (!e) { text('—', 112, y, 20, '#4a547f', { align: 'left', stroke: false }); continue; }
    text(e.name, 106, y - 6, 22, '#ffffff', { align: 'left', lw: 4 });
    const sub = mode.id === 'sprint'
      ? T('{0} · combo {1}', climberById(e.climber).name, e.combo)
      : T('{0} · floor {1} · combo {2}', climberById(e.climber).name, e.floor, e.combo);
    text(sub, 106, y + 15, 11.5, '#b6e37a', { align: 'left', font: BODY, weight: 800, lw: 3 });
    text(mode.id === 'sprint' ? formatTime(e.time) : num(e.score), 420, y, 26, '#ffd93d', { align: 'right', lw: 5 });
  }
  text(T('{0} RUNS · HIGHEST FLOOR {1} · BIGGEST COMBO {2}', stats.runs || 0, stats.bestFloor, stats.bestCombo), UI_W / 2, 478, 12, '#c9d2e8', { font: BODY, weight: 800, lw: 3, max: 420 });
  button(180, 500, 120, 44, T('BACK'), { focus: true, size: 20, onClick: () => { state = 'menu'; Sfx.move(); } });
  if (!isTouch) text(T(canWide ? '←→ switch mode · ↑↓ level width · ESC back' : '←→ switch mode · ESC back'), UI_W / 2, 568, 12, '#8f9bc4', { font: BODY, weight: 800, lw: 3 });
}

const nameBox = document.getElementById('nameBox');
const nameInput = document.getElementById('nameInput');
function showNameBox() {
  nameInput.value = load('name', '');
  nameBox.hidden = false;
  setTimeout(() => { nameInput.focus(); nameInput.select(); }, 60);
}
function hideNameBox() { nameBox.hidden = true; }
nameBox.addEventListener('submit', e => {
  e.preventDefault();
  if (state !== 'name') return;
  const name = (nameInput.value.trim().toUpperCase() || T('PLAYER')).slice(0, 10);
  save('name', name);
  hideNameBox();
  saveScore(name);
  state = 'over';
  G.overT = 30;
  canvas.focus({ preventScroll: true });
});

function drawNameEntry() {
  dim(0.6);
  panel(50, 190, 380, 250, '#ffb547');
  const r = G.result;
  text(T('NEW HIGH SCORE!'), UI_W / 2, 232, 34 + Math.sin(uiFrame * 0.2) * 1.5, '#ffd93d', { lw: 7, cache: false, max: 350 });
  const value = r.mode === 'sprint' ? formatTime(r.time) : num(r.score);
  text(`${T(modeById(r.mode).name)}${r.wide ? ` · ${T('WIDE')}` : ''} · ${value}`, UI_W / 2, 270, 18, '#ffffff', { lw: 4 });
  text(T('Type your name for the board'), UI_W / 2, 382, 13, '#c9d2e8', { font: BODY, weight: 800, lw: 3 });
  text(T('ENTER to save'), UI_W / 2, 408, 12, '#8f9bc4', { font: BODY, weight: 800, lw: 3 });
}

function drawPaused() {
  dim(0.65);
  text(T('PAUSED'), UI_W / 2, 220, 54, '#ffffff', { lw: 10 });
  button(150, 270, 180, 48, T('RESUME'), { primary: true, focus: true, size: 22, onClick: resumeGame });
  button(150, 328, 86, 42, '', { icon: noteIcon(Sfx.music.on), onClick: () => Sfx.music.toggle() });
  button(244, 328, 86, 42, '', { icon: speakerIcon(!Sfx.muted), onClick: () => Sfx.toggle() });
  button(150, 378, 180, 38, T('SETTINGS'), { size: 15, onClick: () => openSettings('paused') });
  button(150, 424, 180, 40, T('QUIT TO MENU'), { size: 16, onClick: () => { Sfx.music.stop(); toMenu(); } });
  if (!isTouch) text(T('P resume · Q quit · M sound · N music'), UI_W / 2, 486, 13, '#b6e37a', { font: BODY, weight: 800, lw: 4 });
}

function drawOver() {
  const r = G.result;
  const k = Math.min(1, G.overT / 20);
  dim(0.5 * k);
  ctx.save();
  ctx.translate(0, (1 - easeOutBack(k)) * 80);
  ctx.globalAlpha = k;
  panel(60, 120, UI_W - 120, 400, r.won ? '#6bcb77' : undefined);

  let title, color = '#ff6b6b';
  if (r.reason === 'summit') { title = 'THE SUMMIT!'; color = '#ffd93d'; }
  else if (r.reason === 'demo') { title = 'END OF THE DEMO'; color = '#ffd93d'; }
  else if (r.won) { title = 'FLOOR 100!'; color = '#6bcb77'; }
  else title = r.title || 'GAME OVER';
  if (title === 'THE EMBERS FADE') text(T(title), UI_W / 2, 164, 38, '#d98a3c', { font: 'Georgia, "Times New Roman", serif', lw: 6, stroke: '#140606', max: UI_W - 100 });
  else text(T(title), UI_W / 2, 164, 42, color, { lw: 9, max: UI_W - 140 });

  let rows;
  if (r.mode === 'sprint') {
    rows = r.won
      ? [['CLIMBER', climberById(r.climber).name], ['BEST COMBO', r.combo], ['TIME', formatTime(r.time)]]
      : [['CLIMBER', climberById(r.climber).name], ['TIME', formatTime(r.time)], ['FLOOR', `${r.floor} / ${SPRINT_GOAL}`]];
  } else {
    rows = [[r.start ? T('FLOOR (FROM {0})', num(r.start)) : 'FLOOR', r.floor], ['BEST COMBO', r.combo], ['COMBO POINTS', r.score - (r.floor - (r.start || 0)) * 10], ['SCORE', r.score]];
  }
  let y = 214;
  const count = clamp((G.overT - 14) / 36, 0, 1);
  rows.forEach(([l, v], i) => {
    const last = i === rows.length - 1;
    if (last && typeof v === 'number' && count < 1) v = Math.round(v * easeOutBack(count) * 0.97);
    if (last) { ctx.fillStyle = 'rgba(182,227,122,0.25)'; ctx.fillRect(90, y - 18, UI_W - 180, 1.5); y += 6; }
    text(T(l), 94, y, last ? 18 : 15, '#b6e37a', { align: 'left', font: BODY, weight: 800, lw: 4, max: 170 });
    text(typeof v === 'number' ? num(v) : String(v), UI_W - 94, y, last ? 30 : 20, last ? '#ffffff' : '#eef6ff', { align: 'right', lw: 5, cache: !(last && count < 1) });
    y += last ? 40 : 32;
  });

  if (r.reason === 'demo') { wrapCentered(T('The full game climbs on to floor 10,000 through 100 tiers. Coming to Google Play and Steam.'), UI_W / 2, y - 4, UI_W - 150, 17, 13, '#ffd93d'); y += 20; }
  else if (r.rank) text(r.rank === 1 ? T('NEW RECORD!') : T('#{0} ON THE BOARD', r.rank), UI_W / 2, y, 24 + Math.sin(uiFrame * 0.2) * 2, '#ffd93d', { lw: 6, cache: false, max: UI_W - 140 });
  else text(bestLine(r.mode, r.wide), UI_W / 2, y, 15, '#c9d2e8', { lw: 4, max: UI_W - 140 });
  y += 30;
  const labels = r.unlocked.length > 3 ? r.unlocked.slice(0, 2).concat(T('+ {0} MORE UNLOCKS', r.unlocked.length - 2)) : r.unlocked;
  for (const label of labels) {
    text(label, UI_W / 2, y, 16, '#6bcb77', { lw: 4, max: UI_W - 140 });
    y += 22;
  }

  const ready = G.overT > 45;
  ctx.globalAlpha = k * (ready ? 1 : 0.5);
  button(84, 452, 148, 46, T('RETRY'), { primary: true, focus: true, size: 22, onClick: () => ready && beginRun(G.mode.id, P.climber.id, P.skin.id, G.start) });
  button(248, 452, 148, 46, T('MENU'), { size: 22, onClick: () => ready && toMenu() });
  ctx.restore();
  if (!isTouch) text(T('SPACE retry · ESC menu'), UI_W / 2, 544, 13, '#b6e37a', { font: BODY, weight: 800, lw: 4 });
}

function drawSummit() {
  const t = G.summitT;
  const fade = (start, len = 25) => clamp((t - start) / len, 0, 1);
  if (t > 20) {
    const k = Math.min(1, (t - 20) / 18), s = 0.3 + 0.7 * easeOutBack(k);
    ctx.save();
    ctx.translate(UI_W / 2, 108);
    ctx.scale(s, s);
    const g = ctx.createLinearGradient(0, -30, 0, 30);
    g.addColorStop(0, '#fff6c2'); g.addColorStop(1, '#f2a53a');
    text(T('THE SUMMIT'), 0, 0, 58, g, { lw: 11, max: UI_W - 40 });
    ctx.restore();
  }
  ctx.globalAlpha = fade(70);
  text(T('FLOOR {0}', num(TOP_FLOOR)), UI_W / 2, 158, 24, '#ffffff', { lw: 5 });
  ctx.globalAlpha = fade(120);
  text(T('Congratulations!'), UI_W / 2, 210, 32, '#b6e37a', { lw: 7 });
  text(T('You climbed the whole tower.'), UI_W / 2, 242, 15, '#eef6ff', { font: BODY, weight: 800, lw: 4 });
  ctx.globalAlpha = fade(SUMMIT_DONE - 40);
  text(T('...and the goblins are very annoyed.'), UI_W / 2, 396, 12, '#c9d2e8', { font: BODY, weight: 800, lw: 3 });
  ctx.globalAlpha = fade(120);
  if (t > SUMMIT_REVEAL) {
    ctx.globalAlpha = fade(SUMMIT_REVEAL, 15);
    panel(90, 274, 300, 104, '#6fd0b8');
    text(T('NEW SKIN UNLOCKED'), UI_W / 2, 298, 15, '#6bcb77', { lw: 4, max: 280 });
    const jig = ((G.frame >> 2) % 3) - 1;
    text(T('GLITCH'), UI_W / 2 + jig * 3, 333, 34, '#6fd0b8', { stroke: false, cache: false });
    text(T('GLITCH'), UI_W / 2 - jig, 331, 34, '#f8f8f8', { lw: 7, cache: false });
    text(T('works on every climber'), UI_W / 2, 360, 12, '#c9d2e8', { font: BODY, weight: 800, lw: 3 });
  }
  ctx.globalAlpha = 1;
  if (t > SUMMIT_DONE && Math.floor(G.frame / 30) % 2 === 0) {
    text(T(isTouch ? 'TAP TO CONTINUE' : 'PRESS SPACE TO CONTINUE'), UI_W / 2, H - 48, 20, '#ffffff', { lw: 5, max: UI_W - 30 });
  }
  addHit(-uiOX, 0, GW, H, finishSummit);
}

let shownState = '', shownAt = 0;
function fadeIn(draw) {
  const k = Math.min(1, (uiFrame - shownAt) / 10);
  if (k >= 1) { centered(draw); return; }
  ctx.save();
  ctx.globalAlpha = k;
  ctx.translate(0, (1 - k) * 14);
  centered(draw);
  ctx.restore();
}
function render() {
  if (state !== shownState) { shownState = state; shownAt = uiFrame; }
  hits = [];
  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
  uiOY = Math.round((H - BASE_H) / 2);
  uiOX = Math.round((GW - UI_W) / 2);
  drawWorld();
  if (state === 'menu') { drawMenuBackdrop(); fadeIn(drawMenu); return; }
  if (state === 'lang') { drawMenuBackdrop(); fadeIn(drawLangPicker); return; }
  if (state === 'scores') { fadeIn(drawScores); return; }
  if (state === 'privacy') { fadeIn(drawPrivacy); return; }
  if (state === 'goals') { fadeIn(drawAchievements); return; }
  if (state === 'cheats') {
    if (settingsFrom === 'paused') drawHUD();
    fadeIn(drawCheats);
    return;
  }
  if (state === 'settings') {
    if (settingsFrom === 'paused') drawHUD();
    fadeIn(drawSettings);
    return;
  }
  if (state === 'summit') {
    ctx.save();
    ctx.translate(uiOX, 0);
    hitDX = uiOX;
    drawSummit();
    hitDX = 0;
    ctx.restore();
    return;
  }
  drawHUD();
  if (state === 'play') drawSteer();
  if (state === 'play' || state === 'paused') { drawAnnounce(); drawBanners(); }
  if (state === 'paused') fadeIn(drawPaused);
  else if (state === 'name') fadeIn(drawNameEntry);
  else if (state === 'over') centered(drawOver);
}

function drawSteer() {
  const s = gest.steer;
  if (!s) return;
  ctx.strokeStyle = 'rgba(182,227,122,0.35)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(s.ax, s.y, STEER_LEASH + 8, 0, Math.PI * 2); ctx.stroke();
  circ(s.x, s.y, 13, input.left || input.right ? 'rgba(255,181,71,0.55)' : 'rgba(182,227,122,0.35)');
}

function toggleFullscreen() {
  try {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  } catch (e) {   }
}

function uiPress(k) {
  if (state === 'lang') {
    if (k === 'up' || k === 'down' || k === 'left' || k === 'right') { langFocus = 1 - langFocus; Sfx.move(); }
    else if (k === 'ok') chooseLang(LANGS[langFocus]);
  } else if (state === 'menu') {
    if (k === 'up' || k === 'down') {
      const order = menu.mode === 'sprint' ? FOCUS_ORDER.filter(f => f !== 6) : FOCUS_ORDER;
      const i = Math.max(0, order.indexOf(menu.focus));
      menu.focus = order[(i + (k === 'up' ? order.length - 1 : 1)) % order.length];
      Sfx.move();
    }
    else if (k === 'left') menuChange(-1);
    else if (k === 'right') menuChange(1);
    else if (k === 'ok') menuActivate();
  } else if (state === 'cheats') {
    const n = CHEATS.length;
    if (k === 'up') { cheatFocus = (cheatFocus + n) % (n + 1); Sfx.move(); }
    else if (k === 'down') { cheatFocus = (cheatFocus + 1) % (n + 1); Sfx.move(); }
    else if (k === 'back' || (k === 'ok' && cheatFocus === n)) { state = 'settings'; Sfx.move(); }
    else if (cheatFocus < n && (k === 'ok' || k === 'left' || k === 'right')) toggleCheat(CHEATS[cheatFocus]);
  } else if (state === 'goals') {
    const pages = Math.ceil(ACHIEVEMENTS.length / ACH_PER_PAGE);
    if (k === 'left' || k === 'up') { menu.achPage = ((menu.achPage || 0) + pages - 1) % pages; Sfx.move(); }
    else if (k === 'right' || k === 'down') { menu.achPage = ((menu.achPage || 0) + 1) % pages; Sfx.move(); }
    else if (k === 'ok' || k === 'back') { state = 'menu'; Sfx.move(); }
  } else if (state === 'settings') {
    const rows = settingRows();
    if (k === 'up') { settingsFocus = (settingsFocus + rows.length) % (rows.length + 1); Sfx.move(); }
    else if (k === 'down') { settingsFocus = (settingsFocus + 1) % (rows.length + 1); Sfx.move(); }
    else if (settingsFocus === rows.length) { if (k === 'ok' || k === 'back') closeSettings(); }
    else if (k === 'left' || k === 'right') changeSetting(rows[settingsFocus], k === 'left' ? -1 : 1);
    else if (k === 'ok') changeSetting(rows[settingsFocus], 1);
    else if (k === 'back') closeSettings();
  } else if (state === 'privacy') {
    if (k === 'ok' || k === 'back') { state = 'menu'; Sfx.move(); }
  } else if (state === 'summit') {
    if (k === 'ok' || k === 'back') finishSummit();
  } else if (state === 'scores') {
    if (k === 'left' || k === 'right') { menu.tab = (menu.tab + (k === 'left' ? MODES.length - 1 : 1)) % MODES.length; Sfx.move(); }
    else if ((k === 'up' || k === 'down') && MODES[menu.tab].id !== 'sprint') { menu.boardWide = !menu.boardWide; Sfx.move(); }
    else if (k === 'ok' || k === 'back') { state = 'menu'; Sfx.move(); }
  } else if (state === 'paused') {
    if (k === 'ok' || k === 'pause') resumeGame();
    else if (k === 'quit') { Sfx.music.stop(); toMenu(); }
  } else if (state === 'over') {
    if (G.overT <= 45) return;
    if (k === 'ok') beginRun(G.mode.id, P.climber.id, P.skin.id, G.start);
    else if (k === 'back' || k === 'quit') toMenu();
  }
}

const PLAY_KEYS = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'jump', ArrowUp: 'jump', KeyW: 'jump' };
const UI_KEYS = {
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  Space: 'ok', Enter: 'ok', Escape: 'back', Backspace: 'back', KeyP: 'pause', KeyQ: 'quit',
};

window.addEventListener('keydown', e => {
  if (e.target === nameInput) return;
  Sfx.init();
  if (isTouch && !e.repeat) setTouch(false);
  if (state === 'menu' && !e.repeat) {
    konamiPos = e.code === KONAMI[konamiPos] ? konamiPos + 1 : (e.code === KONAMI[0] ? 1 : 0);
    if (konamiPos === KONAMI.length) { konamiPos = 0; unlockRetro(); }
  }
  if (e.code === 'KeyF' || e.code === 'F11') { e.preventDefault(); toggleFullscreen(); return; }
  if (e.code === 'KeyM') { Sfx.toggle(); return; }
  if (e.code === 'KeyN') { Sfx.music.toggle(); return; }
  if (state === 'play') {
    const k = PLAY_KEYS[e.code];
    if (k) {
      e.preventDefault();
      if (k === 'jump' && !input.jump) input.jump = true;
      input[k] = true;
    } else if (e.code === 'KeyP' || e.code === 'Escape') {
      pauseGame();
    }
    return;
  }
  const k = UI_KEYS[e.code];
  if (!k) return;
  e.preventDefault();
  if (e.repeat && (k === 'ok' || k === 'back')) return;
  if (PLAY_KEYS[e.code] === 'jump') input.jump = true;
  if (state === 'paused' && k === 'back') { resumeGame(); return; }
  uiPress(k);
});
window.addEventListener('keyup', e => {
  const k = PLAY_KEYS[e.code];
  if (!k) return;
  input[k] = false;
  if (k === 'jump') input.jumpBlocked = false;
});
window.addEventListener('blur', () => {
  input.left = input.right = input.jump = false;
  pauseGame();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseGame();
  Sfx.setActive(!document.hidden);
});

window.upBack = () => {
  switch (state) {
    case 'play': pauseGame(); return true;
    case 'paused': Sfx.music.stop(); toMenu(); return true;
    case 'scores': case 'privacy': case 'goals': state = 'menu'; Sfx.move(); return true;
    case 'settings': closeSettings(); return true;
    case 'cheats': state = 'settings'; Sfx.move(); return true;
    case 'summit': finishSummit(); return true;
    case 'name': nameBox.requestSubmit(); return true;
    case 'over': toMenu(); return true;
    default: return false;
  }
};
window.upAppHidden = () => { pauseGame(); Sfx.setActive(false); };
window.upAppShown = () => { Sfx.setActive(true); };

const STEER_DEAD = 7, STEER_LEASH = 26, TAP_MS = 260, FLICK = 26;
const gest = { steer: null, pending: new Map(), holders: new Set(), menuStart: null };

function toLogical(e) {
  const r = canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width * GW, y: (e.clientY - r.top) / r.height * H };
}
function tapJump() { input.tap = 9; }
function resetTouch() {
  gest.steer = null; gest.pending.clear(); gest.holders.clear();
  input.touchHold = false; input.tap = 0;
}

window.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'touch') return;
  setTouch(true);
  Sfx.init();
  const p = toLogical(e);
  if (state === 'menu') { gest.menuStart = { id: e.pointerId, x: p.x, y: p.y, t: performance.now() }; return; }
  if (state !== 'play') return;
  if (gest.steer) { gest.holders.add(e.pointerId); input.touchHold = true; return; }
  gest.pending.set(e.pointerId, { x: p.x, y: p.y, t: performance.now() });
});

window.addEventListener('pointermove', e => {
  if (e.pointerType !== 'touch' || state !== 'play') return;
  const p = toLogical(e), id = e.pointerId, now = performance.now();
  const pend = gest.pending.get(id);
  if (pend) {
    const dx = p.x - pend.x, dy = p.y - pend.y;
    if (Math.abs(dx) > STEER_DEAD) {
      gest.pending.delete(id);
      gest.steer = { id, ax: pend.x, x: p.x, y: p.y, trail: [] };
    } else if (dy < -FLICK) {
      gest.pending.delete(id);
      gest.steer = { id, ax: p.x, x: p.x, y: p.y, trail: [] };
      tapJump();
      return;
    } else return;
  }
  const s = gest.steer;
  if (!s || s.id !== id) return;
  s.x = p.x; s.y = p.y;
  if (s.x - s.ax > STEER_LEASH) s.ax = s.x - STEER_LEASH;
  if (s.ax - s.x > STEER_LEASH) s.ax = s.x + STEER_LEASH;
  const d = s.x - s.ax;
  input.right = d > STEER_DEAD;
  input.left = d < -STEER_DEAD;
  s.trail.push({ t: now, y: p.y });
  while (s.trail.length && now - s.trail[0].t > 200) s.trail.shift();
  let low = p.y;
  for (const q of s.trail) if (q.y > low) low = q.y;
  if (low - p.y > FLICK) { tapJump(); s.trail.length = 0; }
});

function endTouch(e) {
  if (e.pointerType !== 'touch') return;
  const id = e.pointerId;
  if (gest.menuStart && gest.menuStart.id === id) {
    const st = gest.menuStart, p = toLogical(e);
    gest.menuStart = null;
    const dx = p.x - st.x, dy = p.y - st.y, y = st.y - uiOY;
    if (state === 'menu' && Math.abs(dx) > 50 && Math.abs(dx) > 2 * Math.abs(dy) && performance.now() - st.t < 700) {
      const d = dx < 0 ? 1 : -1;
      if (y >= 180 && y <= 274) { menu.focus = 0; cycleMode(d); }
      else if (y >= 434 + CLIMBER_DY && y <= 500 + CLIMBER_DY && st.x - uiOX > 220) { menu.focus = 2; cycleSkin(d); }
      else if (y >= 270 + CLIMBER_DY && y <= 500 + CLIMBER_DY) { menu.focus = 1; cycleClimber(d); }
    }
  }
  const pend = gest.pending.get(id);
  if (pend) {
    gest.pending.delete(id);
    if (state === 'play' && performance.now() - pend.t < TAP_MS) tapJump();
  }
  if (gest.holders.delete(id) && gest.holders.size === 0) input.touchHold = false;
  if (gest.steer && gest.steer.id === id) {
    gest.steer = null;
    input.left = input.right = false;
  }
}
window.addEventListener('pointerup', endTouch);
window.addEventListener('pointercancel', endTouch);

function trackPointer(e) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = (e.clientX - rect.left) / rect.width * GW;
  pointer.y = (e.clientY - rect.top) / rect.height * H;
  pointer.mouse = e.pointerType === 'mouse';
}
canvas.addEventListener('pointermove', e => {
  trackPointer(e);
  if (!pointer.mouse) return;
  const over = hits.some(h => pointer.x >= h.x && pointer.x <= h.x + h.w && pointer.y >= h.y && pointer.y <= h.y + h.h);
  canvas.style.cursor = over ? 'pointer' : '';
});
canvas.addEventListener('pointerleave', () => { pointer.x = pointer.y = -1; canvas.style.cursor = ''; });
canvas.addEventListener('pointerdown', e => {
  Sfx.init();
  if (state !== 'name') canvas.focus({ preventScroll: true });
  trackPointer(e);
  pointer.downAt = uiFrame;
  const x = pointer.x, y = pointer.y;
  for (let i = hits.length - 1; i >= 0; i--) {
    const h = hits[i];
    if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { h.fn(); return; }
  }
});

if (!settings.lang) state = 'lang';
applyLang();
newWorld(menu.mode, menu.climber, currentSkin().id, 0, true);
lastCamY = G.camY;
applyFx();

// Turning a phone (or resizing the window) re-fits the menu's level, so FIT SCREEN always previews the width the next run gets.
let refitTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(refitTimer);
  refitTimer = setTimeout(() => {
    const onMenu = state === 'menu' || (state === 'settings' && settingsFrom === 'menu');
    if (onMenu && settings.width === 'fit' && wantedStageWidth('classic') !== GW) {
      newWorld(menu.mode, menu.climber, currentSkin().id, 0, true);
      lastCamY = G.camY;
    }
  }, 200);
});
Sfx.music.play('lobby');
if (IN_APP || IN_ANDROID) Sfx.init();

const perfWatch = { last: 0, late: 0, n: 0, t0: 0, strikes: 0, calm: 0, graceUntil: 0 };
function watchPerformance(now) {
  if (state !== 'play' || document.hidden || now < perfWatch.graceUntil) { perfWatch.last = 0; perfWatch.t0 = 0; return; }
  if (!perfWatch.t0) perfWatch.t0 = now;
  if (perfWatch.last) {
    const iv = now - perfWatch.last;
    if (iv < 120) { perfWatch.n++; if (iv > 25) perfWatch.late++; }
  }
  perfWatch.last = now;
  if (now - perfWatch.t0 < 3000) return;
  const ratio = perfWatch.n > 30 ? perfWatch.late / perfWatch.n : 0;
  perfWatch.late = perfWatch.n = 0;
  perfWatch.t0 = now;
  perfWatch.strikes = ratio > 0.15 ? perfWatch.strikes + 1 : 0;
  perfWatch.calm = ratio < 0.02 ? perfWatch.calm + 1 : 0;
  if (!highHz && !hzLocked && strongDevice && perfWatch.calm >= 3) {
    highHz = true;
    applyHz();
    perfWatch.calm = perfWatch.strikes = 0;
    perfWatch.graceUntil = now + 3000;
    return;
  }
  if (highHz && IN_ANDROID && ratio > 0.2) {
    highHz = false; hzLocked = true;
    applyHz();
    perfWatch.strikes = perfWatch.calm = 0;
    perfWatch.graceUntil = now + 3000;
    return;
  }
  const strikes = perfWatch.strikes;
  if (strikes < 2) return;
  const auto = settings.quality === 'auto', lowNext = settings.lowfx === 'auto' && !autoLow;
  let acted = true;
  if (auto && dpr > 1.25) {
    dprCap = Math.max(1.25, +(dpr - 0.5).toFixed(2));
    if (weakDevice) save('dprCap', dprCap);
  } else if (auto && GW > UI_W && renderCut > 0.65) {
    renderCut = +(renderCut - 0.15).toFixed(2);
  } else if (lowNext && strikes >= 3) {
    autoLow = true;
    G.banners.push({ text: T('LOW FX ON'), sub: T('switched on to keep the game smooth'), t: 0, dur: 170, color: '#b6e37a' });
  } else if (auto && dpr > 1 && strikes >= 3) {
    dprCap = 1;
    if (weakDevice) save('dprCap', dprCap);
  } else acted = false;
  if (acted) {
    applyFx();
    perfWatch.strikes = perfWatch.calm = 0;
    perfWatch.graceUntil = now + 3000;
  }
}

let last = performance.now(), acc = 0;
const fpsTimes = [];
const prevStep = { camY: 0, x: 0, y: 0, angle: 0, ok: false };
function renderBetween(a) {
  const cam = G.camY, x = P.x, y = P.y, ang = P.angle, p = prevStep;
  renderAlpha = a;
  if (a < 1 && p.ok) {
    const mix = (from, to) => from + (to - from) * a;
    if (Math.abs(cam - p.camY) < 200) G.camY = mix(p.camY, cam);
    if (Math.abs(x - p.x) < 60) P.x = mix(p.x, x);
    if (Math.abs(y - p.y) < 200) P.y = mix(p.y, y);
    if (Math.abs(ang - p.angle) < 1) P.angle = mix(p.angle, ang);
  }
  try { render(); } finally { G.camY = cam; P.x = x; P.y = y; P.angle = ang; renderAlpha = 1; }
}
let jsMs = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const t0 = performance.now();
  acc += Math.min(0.1, (now - last) / 1000);
  last = now;
  let steps = 0;
  if (state !== 'play' && (gest.steer || gest.pending.size || gest.holders.size)) {
    resetTouch();
    input.left = input.right = false;
  }
  while (acc >= STEP && steps < 5) {
    prevStep.camY = G.camY; prevStep.x = P.x; prevStep.y = P.y; prevStep.angle = P.angle; prevStep.ok = true;
    uiFrame++;
    if (menu.nudge > 0) menu.nudge--;
    stepWorld();
    acc -= STEP;
    steps++;
  }
  if (steps === 5) acc = 0;
  renderBetween(acc / STEP);
  jsMs += (performance.now() - t0 - jsMs) * 0.05;
  watchPerformance(now);
  fpsTimes.push(now);
  while (fpsTimes.length && now - fpsTimes[0] > 1000) fpsTimes.shift();
  if (settings.fps) {
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
    text(`${fpsTimes.length} FPS · ${jsMs.toFixed(1)} ms JS`, 46, H - 30, 12, '#6bcb77', { align: 'left', lw: 3, cache: false });
    text(`x${dpr.toFixed(2)} · ${LOW ? 'LOW FX' : 'FULL FX'} · ${highHz ? 'HI' : '60'} HZ · ${DYN.pages.length + TXT_DYN.pages.length + TXT_STATIC.pages.length} PAGES`, 46, H - 14, 11, '#6bcb77', { align: 'left', lw: 3, cache: false });
  }
}
requestAnimationFrame(frame);
if (document.fonts && document.fonts.load) {
  document.fonts.load(`40px ${DISPLAY}`).catch(() => {});
  document.fonts.load(`800 14px ${BODY}`).catch(() => {});
}
