'use strict';

const DEFAULT_PHYS = {
  gravity: 0.5, maxFall: 15, maxVx: 11,
  accG: 0.28, accA: 0.22, turnG: 0.6, turnA: 0.35, friction: 0.22,
  jumpBase: 10, jumpK: 1.2,
};

const CLIMBERS = [
  {
    id: 'hal', name: 'FIG', tag: "Grabbed the jailer's keys and ran.", stats: { speed: 3, jump: 3, grip: 3, air: 3 }, phys: {},
    pal: {
      skin: '#ffcf9f', skinD: '#efb486', cheek: 'rgba(255,120,110,0.45)', freckle: 'rgba(180,100,60,0.6)', mouth: '#7a3324',
      hair: '#e8622c', hairD: '#b8461c', tunic: '#efe3c4', tunicD: '#d3c39c', stripe: '#6b5440',
      pants: '#5b4a7a', pantsB: '#483a62', patch: '#c9a46a', boot: '#5a3e2c', bootB: '#46301f', sole: '#2a1e16',
      helm: '#9aa3b4', helmD: '#6c7486', helmL: '#d4dae4', horn: '#f1e8cf', rope: '#c9a46a', key: '#ffd93d',
    },
    skins: [
      { id: 'classic', name: 'CLASSIC' },
      { id: 'midnight', name: 'NIGHT RUNNER', unlock: { type: 'floor', v: 250 },
        colors: { tunic: '#3a3d58', tunicD: '#2c2e44', stripe: '#ff5aa5', pants: '#22232f', pantsB: '#1a1b24', helm: '#2b2d3a', helmD: '#1a1b24', helmL: '#5a5e78', horn: '#ff5aa5', boot: '#1a1b24', bootB: '#121219', rope: '#ff5aa5' } },
      { id: 'golden', name: 'GOLD KEY', unlock: { type: 'floor', v: 2500 },
        colors: { tunic: '#fff3c4', tunicD: '#e8d48a', stripe: '#d4a017', helm: '#f2c230', helmD: '#b8860b', helmL: '#fff3b0', horn: '#ffffff', pants: '#8a6a1e', pantsB: '#6b5216', rope: '#f2c230' } },
      { id: 'ashen', name: 'CINDER', unlock: { type: 'floor', v: 600, label: 'Rest by the embers on floor 600' },
        colors: { style: 'cinder', tunic: '#6a6460', tunicD: '#4e4946', stripe: '#2e2b2a', pants: '#3a3634', pantsB: '#2c2928', helm: '#3d3836', helmD: '#26221f', helmL: '#5a5450', horn: '#9a8a78', hair: '#8a8a8a', hairD: '#5a5a5a', boot: '#2c2724', bootB: '#201c1a', rope: '#7a5a3a', ember: '#ffb547' } },
      { id: 'wolf', name: 'HUNTER', unlock: { type: 'floor', v: 2400, label: 'Cross the Windswept Moor on floor 2,400' },
        colors: { style: 'hunter', plain: true, tunic: '#4d4743', tunicD: '#38332f', stripe: '#2a2624', pants: '#35313b', pantsB: '#28252e', patch: '#35313b', boot: '#3a2a1e', bootB: '#2a1e16', rope: '#7a5c38', hair: '#eceef4', hairD: '#b3b7c8', iris: '#e8b52a', cheek: 'rgba(255,120,110,0.28)', blade: '#d6dde9', hilt: '#3a2e28', guard: '#a89678', medal: '#c9ced8' } },
      { id: 'surge', name: 'SUPERCHARGED', unlock: { type: 'floor', v: 3700, label: 'Train in the Heavy Hall on floor 3,700' },
        colors: { style: 'super', tunic: '#f28c28', tunicD: '#c96a12', stripe: '#2e6fd8', pants: '#1b3a8a', pantsB: '#152d6b', hair: '#ffe14d', hairD: '#f2b705', iris: '#2fd3b8', rope: '#2e6fd8', aura: true } },
      { id: 'tunic', name: "HERO'S TUNIC", unlock: { type: 'rockFloor', v: 500 },
        colors: { style: 'elf', plain: true, tunic: '#3fa04a', tunicD: '#2e7a38', pants: '#f3ecd6', pantsB: '#d9cfb2', patch: '#f3ecd6', boot: '#6a4426', bootB: '#553520', rope: '#6e4a28', hair: '#f4cf5a', hairD: '#c99a24', iris: '#3a74d6', cap: '#3fa04a', capD: '#2e7a38', blade: '#d8e0ea', hilt: '#5a3e86', guard: '#c9a046', shield: '#3b5fc0', shieldD: '#2a4494' } },
      { id: 'plumber', name: 'PLUMBER', unlock: { type: 'floor', v: 8500, label: 'Insert a coin on floor 8,500' },
        colors: { style: 'plumber', plain: true, tunic: '#e8463a', tunicD: '#b5312a', overall: '#2e5fd8', button: '#ffd93d', pants: '#2e5fd8', pantsB: '#2149a8', patch: '#2149a8', boot: '#6a4426', bootB: '#553520', rope: '#2e5fd8', hair: '#5b3a24', hairD: '#3a2416', cap: '#e8463a', capD: '#b5312a', stache: '#3a2416' } },
    ],
  },
  {
    id: 'pip', name: 'VIX', tag: 'Fastest thief in the dungeon. Can\'t stop!', stats: { speed: 5, jump: 2, grip: 1, air: 3 },
    phys: { maxVx: 12, jumpBase: 9.5, accG: 0.22, turnG: 0.32, friction: 0.06 },
    unlock: { type: 'total', v: 7500 },
    pal: {
      fur: '#f28c38', furD: '#cc6a22', belly: '#fff1e0', mask: '#2d2440', earIn: '#ffc9a8', sock: '#3a2a2e',
      bandana: '#7b4bd6', bandanaD: '#5a32a8', nose: '#2d2440', tip: '#fff4e6', sack: '#b58a5a', sackD: '#8a6640', coin: '#ffd93d', iris: '#ffb547',
    },
    skins: [
      { id: 'classic', name: 'CLASSIC' },
      { id: 'emperor', name: 'ARCTIC', unlock: { type: 'combo', v: 60 },
        colors: { fur: '#eef3fb', furD: '#c3cfe0', belly: '#ffffff', mask: '#5a6a8a', earIn: '#c9d8f0', sock: '#8a9ab8', bandana: '#4d96ff', bandanaD: '#2e6fd8', nose: '#3a4560', tip: '#ffffff', iris: '#5ff3ff' } },
      { id: 'rockhopper', name: 'SHADOW', unlock: { type: 'total', v: 10000 },
        colors: { fur: '#3a3a48', furD: '#26262f', belly: '#8a8a9a', mask: '#111118', earIn: '#ff8fa0', sock: '#111118', bandana: '#e8463a', bandanaD: '#b5312a', nose: '#111118', tip: '#c9c9d6', iris: '#ffd93d', sack: '#5a4a3a', sackD: '#3a2e24' } },
      { id: 'blur', name: 'BLUE BLUR', unlock: { type: 'sprintTime', v: 45 },
        colors: { style: 'blur', fur: '#2d63d8', furD: '#2049a8', belly: '#f5c995', earIn: '#f5b3a0', arm: '#e3ab78', armD: '#c98f5e', shoe: '#e8463a', shoeD: '#a62a24', strap: '#ffffff', buckle: '#ffd93d', glove: '#ffffff', gloveD: '#b8c0d0', nose: '#16161f', iris: '#3ab552' } },
      { id: 'twin', name: 'TWIN TAILS', unlock: { type: 'spins', v: 300 },
        colors: { style: 'twin', fur: '#f7a823', furD: '#d9811a', belly: '#fff3dc', earIn: '#fff3dc', shoe: '#e8463a', shoeD: '#a62a24', strap: '#ffffff', buckle: '#ffd93d', glove: '#ffffff', gloveD: '#b8c0d0', nose: '#16161f', tip: '#ffffff', iris: '#3a9ae8' } },
    ],
  },
  {
    id: 'bolt', name: 'TAD', tag: 'Hopped out of the goblin soup. Sticky feet!', stats: { speed: 2, jump: 3, grip: 5, air: 4 },
    phys: { maxVx: 10.3, accG: 0.5, turnG: 1.0, friction: 0.6, accA: 0.26, turnA: 0.45 },
    unlock: { type: 'sprintTime', v: 75 },
    pal: {
      skin: '#7ccc5c', skinD: '#569e3e', belly: '#eaf5b8', spot: '#4a8e36', mouth: '#5a2034', tongue: '#ff6b8a',
      cheek: 'rgba(255,120,140,0.5)', pad: '#b4e67a', leaf: '#3fae5a', leafD: '#2a7a3e', pouch: '#f4f9d0',
    },
    skins: [
      { id: 'classic', name: 'CLASSIC' },
      { id: 'copper', name: 'POISON DART', unlock: { type: 'sprintTime', v: 50 },
        colors: { skin: '#2f80e0', skinD: '#1f5ca8', belly: '#9fd0ff', spot: '#0f1626', pad: '#5fb0ff', leaf: '#ffd93d', leafD: '#c9a017', pouch: '#cfe8ff', cheek: 'rgba(120,200,255,0.45)' } },
      { id: 'chrome', name: 'FROG PRINCE', unlock: { type: 'sprintTime', v: 40 },
        colors: { style: 'prince', skin: '#9ad85a', skinD: '#6aa83a', belly: '#fff6c2', spot: '#78b844', pad: '#d8f0a0', cape: '#c43a4e', capeD: '#8a2236', crown: '#ffd93d', crownD: '#d4a017' } },
      { id: 'knight', name: 'FROG KNIGHT', unlock: { type: 'goblins', v: 25 },
        colors: { style: 'knight', skin: '#5fae4a', skinD: '#46883a', belly: '#e2efb0', spot: '#3f7a32', pad: '#a8d878', cape: '#4a5ac8', capeD: '#34418f', blade: '#d8e0ea', hilt: '#8a5a2a', guard: '#c9a046', scarf: '#ffd93d' } },
    ],
  },
  {
    id: 'yeti', name: 'BRAM', tag: "The goblins' stone doorstop. Not anymore.", stats: { speed: 2, jump: 5, grip: 3, air: 2 },
    phys: { maxVx: 10, jumpBase: 11.6, jumpK: 1.18, accA: 0.17, turnA: 0.28 },
    unlock: { type: 'floor', v: 1000 },
    pal: {
      stone: '#959caa', stoneD: '#6c7383', stoneL: '#bfc5cf', crack: '#5a6070', moss: '#6bab4a', mossD: '#4a8a34',
      rune: '#ffc24a', glow: 'rgba(255,194,74,0.35)', iron: '#4a4f5c', ironL: '#727a8a', flower: '#ff8fb5',
    },
    skins: [
      { id: 'classic', name: 'CLASSIC' },
      { id: 'sasquatch', name: 'MAGMA', unlock: { type: 'floor', v: 2000 },
        colors: { stone: '#45414c', stoneD: '#2e2b33', stoneL: '#5e5a66', crack: '#ff7a2a', moss: '#2e2b33', mossD: '#1e1c22', rune: '#ff7a2a', glow: 'rgba(255,122,42,0.4)', flower: '#ffd93d', lava: true } },
      { id: 'frostbite', name: 'CRYSTAL', unlock: { type: 'combo', v: 40 },
        colors: { stone: '#a4dcf2', stoneD: '#6eb2d4', stoneL: '#e4f8ff', crack: '#5aa0c8', moss: '#ffffff', mossD: '#d2e8f6', rune: '#5ff3ff', glow: 'rgba(95,243,255,0.4)', iron: '#4a6a8a', ironL: '#7a9aba', flower: '#5ff3ff' } },
      { id: 'block', name: 'GRASS BLOCK', unlock: { type: 'total', v: 25000 },
        colors: { block: true, stone: '#8a5a32', stoneD: '#6b4426', stoneL: '#a87448', crack: '#5a3a1e', moss: '#5fa83a', mossD: '#4a8a2c', rune: '#ffffff', glow: 'rgba(255,255,255,0.22)', iron: '#555a66', ironL: '#7a808c' } },
    ],
  },
  {
    id: 'nova', name: 'FLIT', tag: 'Hurt wing, but still glides.', stats: { speed: 3, jump: 4, grip: 3, air: 5 },
    phys: { gravity: 0.4, maxFall: 11, jumpBase: 9, jumpK: 1.08, accA: 0.3, turnA: 0.5 },
    unlock: { type: 'combo', v: 100 },
    pal: {
      fur: '#7a5aa8', furD: '#5a3e86', face: '#a98ad2', belly: '#c8b0ea', wing: '#2a1c45', membrane: '#3e2a62',
      earIn: '#ff9fc4', nose: '#3a2850', bandage: '#f4ecd8', bandageD: '#cfc3a4', feet: '#3a2850', cheek: 'rgba(255,140,180,0.5)',
    },
    skins: [
      { id: 'classic', name: 'CLASSIC' },
      { id: 'mars', name: 'FRUIT BAT', unlock: { type: 'combo', v: 150 },
        colors: { fur: '#c87a3a', furD: '#9a5426', face: '#e0a060', belly: '#f2c89a', wing: '#4a2612', membrane: '#7a4420', earIn: '#ffb08a', nose: '#4a2a1a', feet: '#4a2a1a' } },
      { id: 'eclipse', name: 'VAMPIRE', unlock: { type: 'floor', v: 4000 },
        colors: { style: 'vampire', fur: '#34303f', furD: '#211e2a', face: '#5a5468', belly: '#6a6480', wing: '#17151f', membrane: '#8a2032', earIn: '#d84a5e', nose: '#17151f', feet: '#17151f', iris: '#ff4a5a', collar: '#17151f', collarIn: '#c43a4e' } },
      { id: 'puff', name: 'PUFFBALL', unlock: { type: 'chaosFloor', v: 500 },
        colors: { style: 'puff', fur: '#ff9ec7', furD: '#e87aa8', face: '#ffb8d6', belly: '#ffc7de', wing: '#c2507f', membrane: '#e97aa9', earIn: '#ff6b8a', nose: '#c2386a', feet: '#e8463a', cheek: 'rgba(255,80,130,0.6)' } },
    ],
  },
];

const GLITCH_SKIN = { id: 'glitch', name: 'GLITCH', glitch: true, unlock: { type: 'summit' } };
const GLITCH_COLORS = ['#f8f8f8', '#b8b8c8', '#585868', '#181820', '#6fd0b8'];

const climberById = id => CLIMBERS.find(c => c.id === id) || CLIMBERS[0];
const skinsFor = c => c.skins.concat(GLITCH_SKIN);
const skinById = (c, id) => skinsFor(c).find(s => s.id === id) || c.skins[0];
function paletteFor(c, skin) {
  if (!skin || !skin.colors) return c.pal;
  if (!skin.pals) skin.pals = {};
  return skin.pals[c.id] || (skin.pals[c.id] = Object.assign({}, c.pal, skin.colors));
}

function climberPose(c, s) {
  const f = s.frame;
  let fF, fB, hF, hB, lean = 0, bob = 0;
  const amp = s.ground ? Math.min(1, Math.abs(s.vx) / 5) : 0;
  if (s.ground) {
    const r = s.run, sn = Math.sin(r);
    if (amp > 0.05) {
      fF = [sn * 9 * amp + 2, -Math.max(0, Math.cos(r)) * 5 * amp];
      fB = [-sn * 9 * amp + 1, -Math.max(0, -Math.cos(r)) * 5 * amp];
      hF = [-sn * 9 * amp + 4, -19]; hB = [sn * 9 * amp - 3, -19];
      lean = 0.13 * amp; bob = -Math.abs(Math.cos(r)) * 1.6 * amp;
    } else {
      const b = Math.sin(f * 0.06) * 0.8;
      fF = [5, 0]; fB = [-4, 0]; hF = [7, -18 + b]; hB = [-6, -18 + b]; bob = b * 0.4;
    }
    if (s.teeter) {
      const a = f * 0.45;
      hF = [Math.cos(a) * 12, -33 + Math.sin(a) * 12]; hB = [Math.cos(a + 3) * 12, -33 + Math.sin(a + 3) * 12];
      lean = -0.12;
    }
  } else if (s.vy < 0) {
    fF = [8, -8]; fB = [-3, -2]; hF = [13, -49]; hB = [-9, -50]; lean = 0.1;
  } else {
    fF = [6, -1]; fB = [-6, -3]; hF = [14, -40]; hB = [-12, -38]; lean = -0.06;
  }
  if (s.mood === 'panic' && !s.ground) {
    hF = [10 + Math.sin(f * 0.8) * 4, -50 + Math.cos(f * 0.8) * 6];
    hB = [-10 + Math.sin(f * 0.8 + 2) * 4, -48 + Math.cos(f * 0.8 + 2) * 6];
  }
  if (s.mood === 'happy' && s.ground && amp < 0.3) {
    hF = [8, -59 + Math.sin(f * 0.3) * 3]; hB = [-6, -58 + Math.cos(f * 0.3) * 3];
  }
  const pose = { fF, fB, hF, hB, lean, bob, face: null, amp, coin: 0, tongue: 0, croak: 0 };
  const g = GESTURES[c.id];
  if (g) g(pose, s, f);
  return pose;
}
const every = (f, period, len, phase = 0) => (f + phase) % period < len;
const phaseIn = (f, period, len, phase = 0) => ((f + phase) % period) / len;
const calm = s => s.ground && !s.teeter && Math.abs(s.vx) < 0.5 && s.mood === 'idle' && s.idleT > 90;

const GESTURES = {
  hal(p, s, f) {
    if (p.amp > 0.05) p.lean = 0.17 * p.amp;
    if (calm(s)) {
      p.bob += Math.sin(f * 0.21) * 0.5;
      if (every(f, 380, 70, 200)) { p.hF = [9, -57 + Math.sin(f * 0.4)]; p.face = 'peek'; }
    }
  },
  pip(p, s, f) {
    if (s.ground && p.amp > 0.05) {
      p.lean = 0.2 + Math.sin(s.run) * 0.08;
      if (s.speed01 > 0.88) { p.lean = 0.5; p.bob = 2.5; p.hF = [-4, -22]; p.hB = [-8, -23]; }
    }
    if (calm(s) && every(f, 260, 60, 100)) { p.coin = phaseIn(f, 260, 60, 100); p.hF = [11, -30]; }
  },
  bolt(p, s, f) {
    if (s.ground && !s.teeter) p.bob += 1.5;
    if (s.ground && p.amp > 0.05) p.bob -= Math.abs(Math.sin(s.run)) * 2;
    if (!s.ground && s.vy < 0) { p.fF = [9, -3]; p.fB = [-6, 0]; }
    if (calm(s)) {
      if (every(f, 300, 44, 60)) p.tongue = phaseIn(f, 300, 44, 60);
      else if (every(f, 300, 60, 180)) p.croak = Math.sin(phaseIn(f, 300, 60, 180) * Math.PI * 3) * 0.5 + 0.5;
    }
  },
  yeti(p, s, f) {
    if (s.ground && !s.teeter && s.mood !== 'happy') {
      const sw = p.amp > 0.05 ? Math.sin(s.run) * 6 * p.amp : 0;
      p.hF = [12 + sw, -13 + Math.abs(sw) * 0.3]; p.hB = [-12 - sw, -14];
    }
    if (s.ground && p.amp > 0.05) p.bob *= 1.8;
    if (s.ground && !s.teeter) p.bob += Math.sin(f * 0.05) * 0.9;
    if (calm(s) && every(f, 420, 64, 300)) { p.hF = [9, -63]; p.hB = [-9, -63]; p.face = 'yawn'; p.lean = -0.08; }
  },
  nova(p, s, f) {
    if (!s.ground && s.mood !== 'panic') {
      const fl = Math.sin(f * (s.vy < 0 ? 0.55 : 0.28));
      p.hF = [27, -40 + fl * 12]; p.hB = [-25, -41 + fl * 12];
    } else if (s.ground && p.amp < 0.05 && !s.teeter && s.mood !== 'happy') {
      p.hF = [6, -21]; p.hB = [-5, -21];
    }
    if (s.ground && !s.teeter) p.bob += Math.sin(f * 0.07) * 1.2;
    if (calm(s) && every(f, 300, 90, 40)) { p.hF = [9, -29]; p.hB = [-3, -28]; p.face = 'snug'; }
  },
};

const INK = '#1a1a2a';
const WIDE_EYED = new Set(['panic', 'scared', 'fall', 'chased']);
const FRIGHT = new Set(['panic', 'scared', 'chased']);
const eyeTarget = o => o.look || [1, 0];

function eyeAt(x, y, r, o, iris, lid) {
  const m = o.mood;
  if (o.face === 'yawn' || o.face === 'snug' || m === 'happy') {
    ctx.strokeStyle = INK; ctx.lineWidth = 1.7; ctx.lineCap = 'round';
    ctx.beginPath();
    if (o.face === 'yawn') { ctx.moveTo(x - r, y + 0.5); ctx.lineTo(x + r, y + 0.5); }
    else ctx.arc(x, y + r * 0.55, r * 0.9, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    return;
  }
  if (m === 'hurt') {
    const k = r * 0.8;
    limb(x - k, y - k, x + k, y + k, 1.5, INK); limb(x - k, y + k, x + k, y - k, 1.5, INK);
    return;
  }
  if (o.blink && !WIDE_EYED.has(m)) { limb(x - r, y + 0.5, x + r, y + 0.5, 1.6, INK); return; }
  const wide = WIDE_EYED.has(m), ew = r * (wide ? 1.12 : 1), eh = r * (wide ? 1.42 : 1.22);
  ell(x, y, ew, eh, '#ffffff');
  let [lx, ly] = eyeTarget(o);
  if (o.face === 'peek') { lx = 0.3; ly = -1; }
  const pr = r * (wide ? 0.42 : 0.6);
  const px = x + lx * (ew - pr) * 0.6, py = y + ly * (eh - pr) * 0.6;
  if (iris) { circ(px, py, pr * 1.3, iris); circ(px, py, pr * 0.62, INK); }
  else circ(px, py, pr, INK);
  circ(px + pr * 0.35, py - pr * 0.45, Math.max(0.55, pr * 0.34), '#ffffff');
  if (m === 'run' && lid) {
    ctx.fillStyle = lid; ctx.fillRect(x - ew - 0.6, y - eh - 0.6, ew * 2 + 1.2, eh * 0.75);
    limb(x - ew, y - eh * 0.25, x + ew, y - eh * 0.25 + 0.6, 0.9, 'rgba(26,26,42,0.55)');
  }
}
function browAt(x, y, len, o, color, w = 1.6) {
  const m = o.mood;
  let tilt = 0, dy = 0;
  if (o.face === 'yawn' || o.face === 'peek') dy = -2;
  else if (m === 'run' || m === 'hurt') { tilt = 0.34; dy = 1.1; }
  else if (WIDE_EYED.has(m)) { tilt = -0.32; dy = -1.8; }
  else if (m === 'happy' || m === 'jump') dy = -1.5;
  const cx = Math.cos(tilt) * len / 2, sy = Math.sin(tilt) * len / 2;
  limb(x - cx, y + dy - sy, x + cx, y + dy + sy, w, color);
}
function mouthAt(x, y, o, color, k = 1) {
  const m = o.mood;
  ctx.lineCap = 'round';
  if (o.face === 'yawn') { ell(x - 0.5, y + 1, 3.2 * k, 4.4 * k, color); ell(x - 0.5, y + 3 * k, 2 * k, 1.4 * k, '#ff8fa0'); return; }
  if (m === 'happy' || m === 'jump') {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(x - 3.5 * k, y - 1); ctx.quadraticCurveTo(x, y + 5.5 * k, x + 3.5 * k, y - 1); ctx.closePath(); ctx.fill();
    ell(x + 0.3, y + 1.7 * k, 1.6 * k, 1 * k, '#ff8fa0');
    return;
  }
  if (m === 'fall') { ell(x, y + 0.5, 1.7 * k, 2.3 * k, color); return; }
  if (FRIGHT.has(m)) {
    ctx.strokeStyle = color; ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) ctx.lineTo(x - 3.4 * k + i * 1.7 * k, y + (i % 2 ? -0.9 : 0.9) * k);
    ctx.stroke();
    return;
  }
  if (m === 'hurt') {
    ctx.fillStyle = color; rr(x - 3 * k, y - 1.4, 6 * k, 3, 1); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 2.4 * k, y - 0.9, 4.8 * k, 0.9);
    return;
  }
  if (m === 'run') { limb(x - 2.6 * k, y + 0.2, x + 2.6 * k, y - 0.6, 1.5, color); return; }
  ctx.strokeStyle = color; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y - 2.3 * k, 3 * k, Math.PI * 0.22, Math.PI * 0.78); ctx.stroke();
}
function sweat(x, y, o) {
  if (!FRIGHT.has(o.mood)) return;
  const t = (o.frame % 36) / 36, dy = t * 6;
  ctx.save();
  ctx.globalAlpha *= 1 - t;
  ctx.fillStyle = 'rgba(160,215,255,0.95)';
  ctx.beginPath(); ctx.moveTo(x, y + dy - 3.2); ctx.quadraticCurveTo(x + 2.4, y + dy + 0.5, x, y + dy + 1.8); ctx.quadraticCurveTo(x - 2.4, y + dy + 0.5, x, y + dy - 3.2); ctx.fill();
  ctx.restore();
}

const armUp = p => p.hF[1] < -42;

function joint(x0, y0, x1, y1, len, dir) {
  const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy) || 1, half = d / 2;
  const h = half < len ? Math.sqrt(len * len - half * half) : 0;
  return [x0 + dx / 2 - dy / d * h * dir, y0 + dy / 2 + dx / d * h * dir];
}
function bentLimb(x0, y0, x1, y1, len, dir, w, color) {
  const [jx, jy] = joint(x0, y0, x1, y1, len, dir);
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(jx, jy); ctx.lineTo(x1, y1); ctx.stroke();
  return [jx, jy];
}
const legTo = (hipX, f, w, color) => bentLimb(hipX, -15, f[0], f[1] - 3, 6.5, -1, w, color);
const armTo = (shX, h, w, color, len = 7) => bentLimb(shX, -31, h[0], h[1], len, 1, w, color);
function torso(o, fn) {
  ctx.save();
  ctx.translate(0, -14);
  ctx.rotate(o.lean || 0);
  ctx.translate(0, 14 + (o.bob || 0));
  fn();
  ctx.restore();
}
function oval(x, y, rx, ry, rot, fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fill(); }
function poly(pts, fill) {
  ctx.fillStyle = fill; ctx.beginPath();
  for (let i = 0; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.closePath(); ctx.fill();
}
function fuzz(x, y, rx, ry, fill, n = 18, wob = 0) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a = i / (n * 2) * Math.PI * 2, k = i % 2 ? 1.1 + Math.sin(wob + i) * 0.03 : 0.98;
    ctx.lineTo(x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k);
  }
  ctx.closePath(); ctx.fill();
}

function boot(f, color, sole) {
  ell(f[0] + 2, f[1] - 2.8, 6.2, 3.6, color);
  ctx.fillStyle = sole; rr(f[0] - 4, f[1] - 1.3, 12.4, 1.9, 0.9); ctx.fill();
}
function keyRing(x, y, o, c) {
  const sw = o.swayX * 0.5, kx = x + sw * 0.3, ky = y + 1.5;
  ctx.strokeStyle = c.key; ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.arc(kx, ky, 1.7, 0, Math.PI * 2); ctx.stroke();
  for (const [a, len] of [[-0.45, 3.6], [0.25, 4.4]]) {
    const ang = Math.PI / 2 + a + sw * 0.05, ex = kx + Math.cos(ang) * (1.7 + len), ey = ky + Math.sin(ang) * (1.7 + len);
    limb(kx + Math.cos(ang) * 1.7, ky + Math.sin(ang) * 1.7, ex, ey, 1, c.key);
    limb(ex, ey, ex + Math.cos(ang - 1.57) * 1.3, ey + Math.sin(ang - 1.57) * 1.3, 0.9, c.key);
  }
}
function goblinHelmet(o, c) {
  const slip = FRIGHT.has(o.mood) || o.mood === 'fall' ? 0.16 : o.face === 'peek' ? -0.08 : 0;
  ctx.save();
  ctx.translate(1, -51 - (o.face === 'peek' ? 2.5 : 0));
  ctx.rotate(-0.1 + slip + o.swayX * 0.006);
  ctx.fillStyle = c.horn;
  ctx.beginPath(); ctx.moveTo(-8, -7); ctx.quadraticCurveTo(-16, -10, -15, -19); ctx.quadraticCurveTo(-12, -12, -4, -10); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(7, -8); ctx.quadraticCurveTo(15, -11, 14, -20); ctx.quadraticCurveTo(11, -13, 3, -10.5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = c.helm;
  ctx.beginPath(); ctx.arc(0, 0, 12.6, Math.PI, 0); ctx.closePath(); ctx.fill();
  oval(-5, -6.5, 2.4, 4.2, -0.5, c.helmL);
  limb(3, -11, 6, -7.5, 1.1, c.helmD);
  ctx.fillStyle = c.helmD; rr(-14, -1.8, 28, 4.6, 2.2); ctx.fill();
  for (let i = -2; i <= 2; i++) circ(i * 5.5, 0.5, 0.85, c.helmL);
  if (c.style === 'cinder') {
    ctx.globalAlpha *= 0.55 + 0.45 * Math.sin(o.frame * 0.12);
    ctx.strokeStyle = c.ember; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-9, -7); ctx.lineTo(-6, -4); ctx.lineTo(-7, -1.5); ctx.moveTo(4, -12); ctx.lineTo(7, -8); ctx.lineTo(9, -7); ctx.stroke();
  }
  ctx.restore();
}
function hunterTail(o, c) {
  const w = o.swayX * 0.6, h = o.swayY * 0.5, lift = FRIGHT.has(o.mood) ? -3 : 0;
  ctx.fillStyle = c.hairD;
  ctx.beginPath();
  ctx.moveTo(-8, -50);
  ctx.bezierCurveTo(-14 + w, -51, -19 + w, -45 + h + lift, -18.5 + w, -35 + h * 1.4);
  ctx.bezierCurveTo(-14.5 + w * 0.6, -40, -11, -43, -7, -44);
  ctx.closePath(); ctx.fill();
  limb(-8.5, -47, -11.5, -46.5, 2.6, c.rope);
}
function hunterHair(o, c) {
  const peek = o.face === 'peek' ? -1.2 : 0;
  ctx.fillStyle = c.hair;
  ctx.beginPath();
  ctx.moveTo(-10.4, -42.5);
  ctx.bezierCurveTo(-13.5, -55 + peek, -3, -61.5 + peek, 6, -59 + peek);
  ctx.bezierCurveTo(12, -57 + peek, 13.4, -52, 12.6, -48.6);
  ctx.lineTo(10, -50.8); ctx.lineTo(8.2, -48.4); ctx.lineTo(5.4, -50.6); ctx.lineTo(2.8, -49); ctx.lineTo(-0.8, -51.6);
  ctx.bezierCurveTo(-4.5, -52, -7.5, -47.5, -7.2, -42.5);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = c.hairD;
  ctx.beginPath(); ctx.moveTo(-9, -49); ctx.bezierCurveTo(-8, -55, -2, -57.5, 3, -57.5); ctx.bezierCurveTo(-2, -55, -5, -52, -6.5, -47); ctx.closePath(); ctx.fill();
}
function backSword(x0, y0, x1, y1, c) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const gx = x0 + ux * 7.5, gy = y0 + uy * 7.5;
  limb(gx, gy, x1, y1, 2.9, c.blade);
  limb(gx + ux * 2, gy + uy * 2, x1 - ux * 2, y1 - uy * 2, 0.9, 'rgba(255,255,255,0.75)');
  limb(x0, y0, gx, gy, 2.7, c.hilt);
  for (let k = 1; k < 4; k++) { const a = k * 1.9; limb(x0 + ux * a - nx * 1.4, y0 + uy * a - ny * 1.4, x0 + ux * a + nx * 1.4, y0 + uy * a + ny * 1.4, 0.8, 'rgba(0,0,0,0.45)'); }
  limb(gx - nx * 4.2, gy - ny * 4.2, gx + nx * 4.2, gy + ny * 4.2, 2.2, c.guard);
  circ(x0 - ux * 1.4, y0 - uy * 1.4, 2.1, c.guard);
}
function heroShield(c) {
  ctx.fillStyle = c.shieldD; ctx.beginPath(); ctx.arc(-9.5, -27, 10.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = c.shield; ctx.beginPath(); ctx.arc(-9.5, -27, 8.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = c.guard;
  ctx.beginPath(); ctx.moveTo(-9.5, -33); ctx.lineTo(-5.8, -24); ctx.lineTo(-9.5, -26.5); ctx.lineTo(-13.2, -24); ctx.closePath(); ctx.fill();
}
function superHair(o, c) {
  ctx.fillStyle = c.hairD;
  ctx.beginPath(); ctx.moveTo(-11, -51.5);
  for (const [x, y] of [[-14, -61], [-7, -56], [-6, -70], [0, -59], [3, -74], [6, -59], [12, -68], [11, -56], [15, -57], [12, -52]]) ctx.lineTo(x, y);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = c.hair;
  ctx.beginPath(); ctx.moveTo(-9, -52.5);
  for (const [x, y] of [[-11, -59], [-5, -55], [-4, -66], [1, -58], [3, -69], [6, -58], [10, -64], [9, -54]]) ctx.lineTo(x, y);
  ctx.closePath(); ctx.fill();
}
function sword(x0, y0, x1, y1, c) {
  const dx = x1 - x0, dy = y1 - y0, gx = x0 + dx * 0.24, gy = y0 + dy * 0.24, nx = -dy * 0.12, ny = dx * 0.12;
  limb(gx, gy, x1, y1, 2.6, c.blade);
  limb(x0, y0, gx, gy, 2.3, c.hilt);
  limb(gx - nx, gy - ny, gx + nx, gy + ny, 2, c.guard);
}
function elfBack(o, c) {
  const sw = o.swayX * 0.7, sy = o.swayY * 0.5;
  ctx.fillStyle = c.cap;
  ctx.beginPath();
  ctx.moveTo(-8, -58);
  ctx.bezierCurveTo(-17 + sw, -62, -27 + sw, -53 + sy, -26 + sw, -35 + sy * 1.5);
  ctx.bezierCurveTo(-20 + sw * 0.7, -43, -14, -45, -8, -47);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = c.capD;
  ctx.beginPath();
  ctx.moveTo(-9, -52); ctx.bezierCurveTo(-16 + sw * 0.7, -52, -22 + sw * 0.8, -46 + sy, -24 + sw, -38 + sy * 1.4);
  ctx.bezierCurveTo(-20 + sw * 0.7, -44, -14, -46, -8, -47); ctx.closePath(); ctx.fill();
}
function elfCap(o, c) {
  ctx.fillStyle = c.cap;
  ctx.beginPath();
  ctx.moveTo(-11.2, -48.2);
  ctx.bezierCurveTo(-12.5, -64, 10.5, -66, 12.6, -50.4);
  ctx.lineTo(-11.2, -48.2);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = c.capD;
  ctx.beginPath();
  ctx.moveTo(-11.4, -50.4); ctx.lineTo(12.8, -52.4); ctx.lineTo(12.6, -49.6); ctx.lineTo(-11, -47); ctx.closePath(); ctx.fill();
}
function heroHair(o, c) {
  ctx.fillStyle = c.hair;
  tri(-7, -46.5, -2, -48.5, -4.6, -42, c.hair);
  ctx.beginPath(); ctx.moveTo(3, -49); ctx.lineTo(10.5, -48.6); ctx.lineTo(8, -45.4); ctx.lineTo(5.8, -47.2); ctx.lineTo(3.4, -45.6); ctx.closePath(); ctx.fill();
}
function plumberCap(c) {
  ctx.fillStyle = c.cap; ctx.beginPath(); ctx.arc(1, -50.5, 11.6, Math.PI, 0); ctx.closePath(); ctx.fill();
  ell(10.5, -50.2, 7.5, 2.3, c.capD);
  circ(0.5, -55.5, 3.4, '#ffffff');
}
function figArm(p, c, front) {
  const h = front ? p.hF : p.hB;
  armTo(front ? 2 : -2, h, 5.4, front ? c.tunic : c.tunicD);
  circ(h[0], h[1], 3.1, c.skin);
}

function drawFig(p, o, c) {
  const style = c.style;
  torso(o, () => {
    if (c.aura) {
      const pulse = 0.5 + 0.5 * Math.sin(o.frame * 0.3), r = 42 + pulse * 5;
      const gl = ctx.createRadialGradient(0, -32, 6, 0, -32, r);
      gl.addColorStop(0, 'rgba(255,236,120,0.5)'); gl.addColorStop(0.6, 'rgba(255,205,60,0.2)'); gl.addColorStop(1, 'rgba(255,205,60,0)');
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, -32, r, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i - 2) * 0.5, h = 10 + ((o.frame * 3 + i * 17) % 9);
        tri(Math.cos(a) * 20 - 2, -34 + Math.sin(a) * 30, Math.cos(a) * 20 + 2, -34 + Math.sin(a) * 30, Math.cos(a) * (20 + h), -34 + Math.sin(a) * (30 + h), 'rgba(255,240,150,0.7)');
      }
    }
    if (style === 'hunter') backSword(-15, -45, 9, -15, c);
    if (style === 'elf') { heroShield(c); backSword(-15, -45, 9, -15, c); }
    figArm(p, c, false);
  });
  legTo(-2, p.fB, 7, c.pantsB); boot(p.fB, c.bootB, c.sole);
  torso(o, () => {
    ctx.fillStyle = c.tunic; rr(-10, -38, 20, 25, 7); ctx.fill();
    ctx.save(); ctx.beginPath(); rr(-10, -38, 20, 25, 7); ctx.clip();
    ctx.fillStyle = c.stripe;
    if (!c.plain) for (let y = -35; y < -14; y += 5.2) ctx.fillRect(-11, y, 22, 2.3);
    if (style === 'plumber') {
      ctx.fillStyle = c.overall; rr(-9, -28, 18, 16, 3); ctx.fill();
      limb(-6, -38, -6, -27, 2.6, c.overall); limb(6, -38, 6, -27, 2.6, c.overall);
      circ(-6, -27, 1.3, c.button); circ(6, -27, 1.3, c.button);
    }
    if (style === 'hunter') {
      limb(-10, -37, 10, -19, 3, c.stripe);
      limb(-10, -26, 10, -37, 2.2, c.stripe);
      circ(0, -28, 1.4, c.guard);
    }
    if (style === 'elf') {
      ctx.fillStyle = c.pants; ctx.beginPath(); ctx.moveTo(-3.5, -38); ctx.lineTo(3.5, -38); ctx.lineTo(0, -32); ctx.closePath(); ctx.fill();
      ctx.fillStyle = c.tunicD; for (let x = -10; x < 10; x += 5) tri(x, -14, x + 5, -14, x + 2.5, -9.5, c.tunicD);
    }
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-10, -38, 4, 25);
    ctx.restore();
    ctx.fillStyle = c.rope; rr(-10.5, -17.5, 21, 3.4, 1.7); ctx.fill();
    if (style === 'elf') {
      ctx.fillStyle = c.guard; rr(2.8, -18.6, 5.6, 5.6, 1.2); ctx.fill();
      ctx.fillStyle = c.rope; rr(4.2, -17.2, 2.8, 2.8, 0.6); ctx.fill();
    } else {
      circ(6, -15.8, 1.9, c.rope);
      limb(6, -15, 7.5 + o.swayX * 0.2, -10.5, 1.3, c.rope); limb(5.5, -15, 4.5 + o.swayX * 0.2, -11, 1.3, c.rope);
    }
    if (style === 'hunter') {
      ctx.fillStyle = c.medal; circ(3.6, -31.2, 2.6, c.medal);
      circ(3.6, -31.2, 1.3, c.hilt);
    }
    if (style !== 'hunter' && style !== 'elf') keyRing(-6, -15, o, c);
    if (style === 'cinder') {
      for (let i = 0; i < 3; i++) {
        const t = ((o.frame + i * 23) % 70) / 70;
        ctx.save(); ctx.globalAlpha *= 1 - t;
        circ(-6 + i * 6 + Math.sin(t * 6 + i) * 3, -36 - t * 26, 1.1, c.ember);
        ctx.restore();
      }
    }
  });
  const knee = legTo(2, p.fF, 7, c.pants);
  ctx.fillStyle = c.patch; rr(knee[0] - 2.6, knee[1] - 2.4, 5.2, 5, 1.2); ctx.fill();
  boot(p.fF, c.boot, c.sole);
  torso(o, () => {
    if (armUp(p)) figArm(p, c, true);
    if (style === 'hunter') hunterTail(o, c);
    if (style === 'elf') elfBack(o, c);
    if (style !== 'super' && style !== 'hunter') circ(-7.5, -44, 4.2, c.hair);
    circ(1, -46, 11, c.skin);
    circ(-3.8, -44.5, 2.5, c.skinD);
    circ(7.8, -41.4, 2.4, c.cheek);
    if (!style) { circ(5.6, -42.6, 0.6, c.freckle); circ(7.6, -43.3, 0.6, c.freckle); circ(9.2, -42.4, 0.6, c.freckle); }
    eyeAt(2.2, -45.6, 2.6, o, c.iris, c.skin);
    eyeAt(8, -45.6, 3, o, c.iris, c.skin);
    ell(11.6, -43, 1.6, 1.3, c.skinD);
    mouthAt(7.3, -39.6, o, c.mouth);
    if (style === 'cinder') { circ(-1, -41, 1.6, 'rgba(40,36,34,0.35)'); circ(10, -48, 1.2, 'rgba(40,36,34,0.3)'); }
    if (style === 'plumber') { ell(9.6, -41.6, 4.4, 1.9, c.stache); ell(12.8, -42, 2.2, 1.6, c.stache); }
    if (style === 'elf') {
      tri(-6.5, -42, -3, -47.5, -14.5, -46, c.skin);
      tri(-6, -43.4, -3.6, -46.4, -11.4, -45.6, c.skinD);
      browAt(2.2, -49.4, 3.2, o, c.hairD); browAt(8.1, -49.6, 3.8, o, c.hairD);
      heroHair(o, c);
      elfCap(o, c);
    } else if (style === 'plumber') {
      browAt(2.2, -49.4, 3.2, o, c.hairD); browAt(8.1, -49.6, 3.8, o, c.hairD);
      tri(-9, -48, -5, -48, -8, -42, c.hair);
      plumberCap(c);
    } else if (style === 'super') {
      browAt(2.2, -49.6, 3.2, o, c.hairD); browAt(8.1, -49.8, 3.8, o, c.hairD);
      superHair(o, c);
    } else if (style === 'hunter') {
      browAt(2.2, -49.4, 3.2, o, c.hairD); browAt(8.1, -49.6, 3.8, o, c.hairD);
      limb(9.6, -43.8, 11.2, -40.8, 0.9, 'rgba(160,60,60,0.7)');
      hunterHair(o, c);
    } else {
      browAt(2.2, -49.4, 3.2, o, c.hairD); browAt(8.1, -49.6, 3.8, o, c.hairD);
      tri(4, -52.5, 11, -51.5, 8.5, -47.6, c.hair);
      tri(-3, -52.5, 4, -52.5, 0.5, -48.8, c.hair);
      goblinHelmet(o, c);
    }
    sweat(-7, -53, o);
    if (!armUp(p)) figArm(p, c, true);
  });
}

function vixTail(o, c) {
  const L = 17 + Math.min(9, Math.abs(o.swayX) * 1.3), lift = o.swayY * 0.7 + Math.sin(o.frame * 0.09) * 2.2 - (FRIGHT.has(o.mood) ? 6 : 0);
  const ang = -0.45 + lift * 0.035;
  const ex = -6 - Math.cos(ang) * L, ey = -20 + Math.sin(ang) * L * 0.9;
  oval((-6 + ex) / 2, (-20 + ey) / 2, L / 2 + 4, 6.4, Math.atan2(ey + 20, ex + 6), c.fur);
  oval(ex + Math.cos(ang) * 2.5, ey - Math.sin(ang) * 2, 5.4, 4.6, Math.atan2(ey + 20, ex + 6), c.tip);
}
function vixArm(p, c, front) {
  const h = front ? p.hF : p.hB;
  armTo(front ? 2 : -2, h, 4.2, front ? c.fur : c.furD, 7.2);
  circ(h[0], h[1], 2.7, c.sock);
}
function vixLeg(hipX, f, c, front) {
  bentLimb(hipX, -14, f[0], f[1] - 3, 7, -1, 4.8, front ? c.fur : c.furD);
  ell(f[0] + 2.5, f[1] - 2.3, 5.4, 2.8, c.sock);
}
function quill(ax, ay, bx, by, tx, ty, bulge) {
  ctx.beginPath(); ctx.moveTo(ax, ay);
  ctx.quadraticCurveTo((ax + tx) / 2 + bulge * 0.3, (ay + ty) / 2 - bulge, tx, ty);
  ctx.quadraticCurveTo((bx + tx) / 2 + bulge * 0.3, (by + ty) / 2 - bulge * 0.4, bx, by);
  ctx.closePath(); ctx.fill();
}
function mascotShoe(f, c) {
  const x = f[0], y = f[1];
  ctx.fillStyle = c.shoe;
  ctx.beginPath();
  ctx.moveTo(x - 4.4, y - 0.2);
  ctx.quadraticCurveTo(x - 5.6, y - 5.4, x - 2, y - 7.2);
  ctx.lineTo(x + 3.4, y - 6.8);
  ctx.quadraticCurveTo(x + 10, y - 6.2, x + 11, y - 2.6);
  ctx.quadraticCurveTo(x + 11, y + 0.2, x + 8, y + 0.2);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = c.shoeD; ctx.fillRect(x - 4.6, y - 1.1, 15.6, 1.4);
  ctx.fillStyle = c.strap; rr(x + 1, y - 6.9, 3.2, 6.1, 1); ctx.fill();
  ctx.fillStyle = c.buckle; ctx.fillRect(x + 1.2, y - 4.6, 2.8, 2);
  ell(x - 0.4, y - 7.2, 3.2, 1.5, c.glove);
}
function mascotLeg(hipX, f, c, front) {
  bentLimb(hipX, -14, f[0], f[1] - 6, 5.2, -1, 4.2, front ? c.fur : c.furD);
  mascotShoe(f, c);
}
function mascotArm(p, c, front) {
  const h = front ? p.hF : p.hB, col = front ? (c.arm || c.fur) : (c.armD || c.furD);
  armTo(front ? 2 : -2, h, 4, col, 7.2);
  circ(h[0], h[1], 3.5, c.glove);
  ctx.strokeStyle = c.gloveD; ctx.lineWidth = 0.8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(h[0], h[1], 2.3, -0.4, 1.1); ctx.stroke();
}
function mascotEye(x, y, rx, ry, o, c, lid, slant) {
  const m = o.mood;
  if (o.face === 'yawn' || o.face === 'snug' || m === 'happy' || m === 'hurt' || (o.blink && !WIDE_EYED.has(m))) { eyeAt(x, y, rx, o, c.iris, lid); return; }
  const wide = WIDE_EYED.has(m), w = rx * (wide ? 1.1 : 1), h = ry * (wide ? 1.18 : 1);
  ell(x, y, w, h, '#ffffff');
  let [lx, ly] = eyeTarget(o);
  if (o.face === 'peek') { lx = 0.3; ly = -1; }
  const ir = w * (wide ? 0.6 : 0.74);
  const px = x + lx * (w - ir) * 0.95, py = y + 0.6 + ly * (h - ir) * 0.7;
  ell(px, py, ir, Math.min(h * 0.92, ir * 1.35), c.iris);
  circ(px + lx * 0.5, py, ir * 0.52, INK);
  circ(px + ir * 0.34, py - ir * 0.5, Math.max(0.6, ir * 0.3), '#ffffff');
  if (!wide && lid) {
    const cov = m === 'run' ? 0.42 : m === 'jump' ? 0.06 : 0.16, ly0 = y - h + 2 * h * cov;
    ctx.save();
    ctx.beginPath(); ctx.ellipse(x, y, w + 0.3, h + 0.3, 0, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = lid;
    ctx.beginPath(); ctx.moveTo(x - w - 2, ly0 - slant); ctx.lineTo(x + w + 2, ly0 + slant); ctx.lineTo(x + w + 2, y - h - 3); ctx.lineTo(x - w - 2, y - h - 3); ctx.closePath(); ctx.fill();
    ctx.restore();
    limb(x - w, ly0 - slant, x + w, ly0 + slant, 0.8, 'rgba(20,20,40,0.35)');
  }
}
function mascotMouth(x0, y0, x1, y1, o, c, k = 1) {
  const m = o.mood;
  if (m === 'happy' || m === 'jump') {
    ctx.fillStyle = c.nose;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, y0 + 7 * k, x1, y1); ctx.closePath(); ctx.fill();
    ell((x0 + x1) / 2 + 0.2, y0 + 3.1 * k, 2.4 * k, 1.2 * k, '#ff8fa0');
  } else if (m === 'idle' || m === 'run') {
    ctx.strokeStyle = c.nose; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, y0 + (m === 'run' ? 1.4 : 3.2) * k, x1, y1); ctx.stroke();
  } else mouthAt((x0 + x1) / 2, y0 + 0.8, o, c.nose, 0.85 * k);
}
function ringAt(t, p, c) {
  const cx = p.hF[0], cy = p.hF[1] - 5 - Math.sin(t * Math.PI) * 24, rx = 3 * Math.abs(Math.cos(t * 14)) + 0.5;
  ctx.strokeStyle = c.buckle; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, 3.2, 0, 0, Math.PI * 2); ctx.stroke();
}
function mascotBody(p, o, c, back, head) {
  torso(o, () => { back(); mascotArm(p, c, false); });
  mascotLeg(-2.5, p.fB, c, false);
  torso(o, () => {
    ell(0, -24, 9.6, 12.4, c.fur);
    ell(3.6, -22.6, 6, 9.6, c.belly);
  });
  mascotLeg(3, p.fF, c, true);
  torso(o, () => {
    if (armUp(p)) mascotArm(p, c, true);
    head();
    sweat(-5, -54, o);
    if (!armUp(p)) mascotArm(p, c, true);
    if (p.coin) ringAt(p.coin, p, c);
  });
}

function hogHead(o, c) {
  const qs = o.swayX * 0.4, qy = o.swayY * 0.3, m = o.mood;
  ctx.fillStyle = c.furD;
  quill(1, -54, -6, -49, -24 + qs, -56 + qy, 4);
  quill(-4, -49, -9, -40, -29 + qs, -45 + qy, 4);
  quill(-6, -42, -4, -33, -25 + qs, -33 + qy, 4);
  ctx.fillStyle = c.fur;
  quill(2, -55, -5, -49, -22 + qs, -59 + qy, 4);
  quill(-3, -50, -8, -41, -27 + qs, -48 + qy, 4);
  quill(-5, -43, -3, -34, -23 + qs, -36 + qy, 4);
  tri(-0.5, -54, 6.5, -54, 3, -62.5, c.fur); tri(1.4, -54.6, 5, -54.4, 3.2, -59.4, c.earIn);
  tri(5.5, -54.5, 12, -52, 11, -60.5, c.fur); tri(7.2, -54.4, 10.6, -52.8, 10.4, -58, c.earIn);
  ell(2.5, -45, 11.2, 10.8, c.fur);
  ell(9.4, -42.2, 8.4, 6.6, c.belly);
  ell(14.4, -41.4, 5.4, 4.2, c.belly);
  poly([6.4, -44, 8, -52, 11, -44], c.belly);
  ell(18.6, -43.4, 2.5, 1.9, c.nose); circ(19, -44.2, 0.7, 'rgba(255,255,255,0.7)');
  mascotEye(6, -47.6, 3.1, 4.6, o, c, c.fur, 0.9);
  mascotEye(12.2, -47.6, 3.3, 4.8, o, c, c.fur, 0.9);
  mascotMouth(10, -38.9, 17.4, -39.8, o, c);
}
function drawHog(p, o, c) {
  mascotBody(p, o, c, () => {
    ctx.fillStyle = c.furD;
    ctx.beginPath(); ctx.moveTo(-7, -27); ctx.quadraticCurveTo(-14, -26.5, -16.5, -21); ctx.quadraticCurveTo(-11, -22, -6.5, -16.5); ctx.closePath(); ctx.fill();
  }, () => hogHead(o, c));
}

function fluffTail(bx, by, ang, len, wid, c) {
  const N = 12, top = [], bot = [], dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
  for (let i = 0; i <= N; i++) {
    const t = i / N, e = (t - 0.62) / 0.38;
    const w = wid * (t < 0.62 ? 0.3 + 0.7 * Math.sin(t / 0.62 * Math.PI / 2) : Math.sqrt(Math.max(0, 1 - e * e)));
    const cx = bx + dx * len * t, cy = by + dy * len * t;
    top.push([cx + nx * w, cy + ny * w]); bot.push([cx - nx * w, cy - ny * w]);
  }
  ctx.fillStyle = c.fur;
  ctx.beginPath();
  top.forEach(([x, y]) => ctx.lineTo(x, y));
  for (let i = N; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]);
  ctx.closePath(); ctx.fill();
  const i0 = 8;
  ctx.fillStyle = c.tip;
  ctx.beginPath();
  for (let k = 0; k <= 4; k++) {
    const u = k / 4, off = k % 2 ? -2.2 : 0.6;
    ctx.lineTo(top[i0][0] + (bot[i0][0] - top[i0][0]) * u + dx * off, top[i0][1] + (bot[i0][1] - top[i0][1]) * u + dy * off);
  }
  for (let i = i0 + 1; i <= N; i++) ctx.lineTo(bot[i][0], bot[i][1]);
  for (let i = N; i > i0; i--) ctx.lineTo(top[i][0], top[i][1]);
  ctx.closePath(); ctx.fill();
}
function twinTails(o, c) {
  const move = Math.min(1, Math.abs(o.swayX) / 6), fright = FRIGHT.has(o.mood) ? 0.28 : 0;
  const L = 22 + move * 5, idle = Math.sin(o.frame * 0.09) * 0.06, spin = o.rising ? o.frame * 0.62 : 0;
  [[-0.24, 2.2], [0.68, 0]].forEach(([a, ph]) => {
    const flap = o.rising ? Math.sin(spin + ph * 2) * 1.05 : 0;
    const ang = Math.PI + a * (1 - move * 0.55) + (a > 0 ? fright : 0) + idle + o.swayY * 0.025 + flap;
    fluffTail(-6.5, -19, ang, L * (o.rising ? 0.92 + 0.08 * Math.cos(spin + ph * 2) : 1), 6.4, c);
  });
}
function twinHead(o, c) {
  const m = o.mood, tw = every(o.frame, 170, 8) ? -0.2 : 0;
  ctx.save(); ctx.translate(-2, -52); ctx.rotate(tw);
  tri(-6.5, 3, 2.5, 0.5, -4.5, -13.5, c.furD); tri(-4.4, 1.6, 0.6, 0.6, -4, -8.6, c.earIn);
  ctx.restore();
  tri(5.5, -51.5, 13, -50, 10.8, -64.5, c.fur); tri(7.4, -51.8, 11.4, -51, 10.6, -59.4, c.earIn);
  poly([0.4, -53, 1.8, -59.4, 3.6, -54.4, 5.6, -60, 7, -53], c.fur);
  ell(3, -44.4, 11.4, 10.6, c.fur);
  poly([-5.4, -44, -11.5, -41.4, -6.6, -40, -10, -35.4, -2.4, -37.4, -1.2, -33.4, 2.4, -36.6, 5, -37, 5, -42], c.belly);
  ell(10, -40.6, 8.6, 5.6, c.belly);
  ell(15, -40.6, 4.8, 3.6, c.belly);
  ell(18.6, -42.2, 2.2, 1.7, c.nose); circ(19, -42.9, 0.6, 'rgba(255,255,255,0.7)');
  mascotEye(5.4, -47, 3.5, 4.5, o, c, c.fur, 0.5);
  mascotEye(12, -47, 3.6, 4.6, o, c, c.fur, 0.5);
  mascotMouth(11, -38, 16.4, -38.4, o, c, 0.8);
  tri(3.4, -35.4, 9.4, -34.4, 5.8, -30.4, c.belly);
}
function drawTwin(p, o, c) {
  mascotBody(p, o, c, () => twinTails(o, c), () => twinHead(o, c));
}

function foxHead(o, c, m) {
  const tw = every(o.frame, 170, 8) ? -0.25 : 0;
  ctx.save(); ctx.translate(-3, -51); ctx.rotate(tw);
  tri(-4, 3, 3, 0, -3, -11, c.furD); tri(-2.5, 1.6, 1.4, 0.2, -2.4, -6.5, c.earIn);
  ctx.restore();
  tri(2, -52, 9, -51, 6.5, -63, c.fur); tri(3.6, -52, 7.8, -51.6, 6.3, -59, c.earIn);
  circ(2.5, -45, 9.4, c.fur);
  ctx.fillStyle = c.fur;
  ctx.beginPath(); ctx.moveTo(6, -49); ctx.quadraticCurveTo(15, -47, 18.5, -43.5); ctx.quadraticCurveTo(15, -39.5, 6, -38.5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = c.belly;
  ctx.beginPath(); ctx.moveTo(4, -41.5); ctx.quadraticCurveTo(12, -42, 17.5, -42.6); ctx.quadraticCurveTo(13, -38.4, 4, -37.5); ctx.closePath(); ctx.fill();
  tri(-6.5, -45, -2, -40, -8, -38.5, c.belly);
  circ(18.2, -43.8, 1.7, c.nose);
  ctx.fillStyle = c.mask; rr(-1.5, -50, 15.5, 6.6, 3.3); ctx.fill();
  const fl = Math.sin(o.frame * 0.3) * 1.2 + o.swayY * 0.2;
  tri(-1, -49, -1, -45, -7 - Math.abs(o.swayX) * 0.4, -48 + fl, c.mask);
  eyeAt(4, -46.8, 2.3, o, c.iris, c.mask);
  eyeAt(9.6, -47, 2.6, o, c.iris, c.mask);
  browAt(4, -51.6, 3, o, c.furD, 1.4); browAt(9.8, -51.8, 3.4, o, c.furD, 1.4);
  if (m === 'happy' || m === 'jump' || m === 'idle' || m === 'run') {
    ctx.strokeStyle = c.mask; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(9, -39.5); ctx.quadraticCurveTo(12.5, m === 'idle' || m === 'run' ? -38.6 : -37.2, 15.5, -40.4); ctx.stroke();
    if (m === 'happy' || m === 'jump') tri(10.5, -39.2, 12, -39.2, 11.2, -37.6, '#ffffff');
  } else mouthAt(12, -39.4, o, c.mask, 0.75);
}
function drawVix(p, o, c) {
  if (c.style === 'blur') { drawHog(p, o, c); return; }
  if (c.style === 'twin') { drawTwin(p, o, c); return; }
  const m = o.mood;
  torso(o, () => {
    vixTail(o, c);
    vixArm(p, c, false);
  });
  vixLeg(-2, p.fB, c, false);
  torso(o, () => {
    ell(0, -25, 10, 13.5, c.fur);
    ell(3.5, -23, 6.2, 10, c.belly);
    circ(-10, -29, 6.6, c.sack);
    tri(-13, -35, -7, -35, -10, -38.5, c.sackD);
    circ(-12.5, -36.5, 1.9, c.coin);
    limb(-8, -33, 6, -17, 1.6, c.sackD);
  });
  vixLeg(3, p.fF, c, true);
  torso(o, () => {
    if (armUp(p)) vixArm(p, c, true);
    foxHead(o, c, m);
    sweat(-5, -52, o);
    ctx.fillStyle = c.bandana; rr(-7, -37.5, 16, 4.4, 2.2); ctx.fill();
    tri(3, -34, 10, -34, 7.5, -28.5 + Math.sin(o.frame * 0.25) * 0.8, c.bandanaD);
    if (!armUp(p)) vixArm(p, c, true);
    if (p.coin) {
      const t = p.coin, cx = p.hF[0], cy = p.hF[1] - 4 - Math.sin(t * Math.PI) * 24;
      oval(cx, cy, 2.6 * Math.abs(Math.cos(t * 14)) + 0.4, 2.6, 0, c.coin);
    }
  });
}

function frogMouth(o, c, p) {
  const m = o.mood;
  ctx.lineCap = 'round';
  if (p.tongue) {
    const t = p.tongue, k = Math.sin(t * Math.PI), tx = 14 + k * 26, ty = -36 - k * 9;
    ell(12.5, -35.5, 3, 2, c.mouth);
    limb(13, -35.5, tx, ty, 2.2, c.tongue); circ(tx, ty, 2.3, c.tongue);
    if (t < 0.5) { circ(40, -45, 1.3, INK); ell(39.2, -46.8, 1.6, 0.9, 'rgba(255,255,255,0.8)'); }
    return;
  }
  if (o.face === 'yawn' || m === 'fall' || FRIGHT.has(m)) {
    const big = o.face === 'yawn' ? 1.3 : m === 'fall' ? 0.7 : 1;
    ell(9, -35.5, 4.5 * big, 2.8 * big, c.mouth);
    ell(9, -34.6, 2.6 * big, 1.1 * big, c.tongue);
    return;
  }
  if (m === 'happy' || m === 'jump') {
    ctx.fillStyle = c.mouth;
    ctx.beginPath(); ctx.moveTo(1, -37); ctx.quadraticCurveTo(9, -29.5, 15.5, -37.2); ctx.closePath(); ctx.fill();
    ell(9, -33.6, 3, 1.4, c.tongue);
    return;
  }
  if (m === 'hurt') { limb(2, -35, 15, -36, 1.8, c.mouth); return; }
  ctx.strokeStyle = c.mouth; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0.5, -37.5); ctx.quadraticCurveTo(8, m === 'run' ? -35.5 : -33.6, 15.5, -37.8); ctx.stroke();
}
function frogFoot(f, c) {
  ell(f[0] + 2.6, f[1] - 1.8, 5.6, 2.1, c.skin);
  circ(f[0] + 8.4, f[1] - 2.2, 1.6, c.pad); circ(f[0] + 8.8, f[1] - 0.2, 1.5, c.pad); circ(f[0] + 6.6, f[1] + 0.3, 1.4, c.pad);
}
function frogArm(p, c, front) {
  const h = front ? p.hF : p.hB;
  armTo(front ? 3 : -3, h, 3.4, front ? c.skin : c.skinD, 7.4);
  circ(h[0], h[1], 1.9, front ? c.skin : c.skinD);
  circ(h[0] + 2, h[1] - 1.2, 1.1, c.pad); circ(h[0] + 2.3, h[1] + 0.8, 1.1, c.pad);
}
function drawTad(p, o, c) {
  torso(o, () => {
    if (c.style === 'knight') sword(-16, -52, 4, -16, c);
    if (c.cape) {
      const w = o.swayX * 0.7;
      ctx.fillStyle = c.capeD;
      ctx.beginPath(); ctx.moveTo(-7, -33); ctx.lineTo(4, -33); ctx.lineTo(-2 + w, -10); ctx.lineTo(-15 + w, -12); ctx.closePath(); ctx.fill();
    }
    frogArm(p, c, false);
  });
  bentLimb(-4, -13, p.fB[0], p.fB[1] - 1.5, 8.5, -1, 5, c.skinD); frogFoot(p.fB, c);
  torso(o, () => {
    ell(0, -22, 12, 12.5, c.skin);
    ell(4, -20, 7.6, 9, c.belly);
    circ(-6.5, -27, 2.3, c.spot); circ(-8.5, -19.5, 1.6, c.spot); circ(-3.5, -16.5, 1.4, c.spot);
  });
  bentLimb(3, -12, p.fF[0], p.fF[1] - 1.5, 8.5, -1, 5.4, c.skin); frogFoot(p.fF, c);
  torso(o, () => {
    if (armUp(p)) frogArm(p, c, true);
    if (p.croak) ell(8, -31.5, 4 + p.croak * 4.5, 3 + p.croak * 3.6, c.pouch);
    ell(4, -38, 13, 8.4, c.skin);
    circ(-0.5, -44.5, 5.4, c.skin); circ(8.5, -45, 5.8, c.skin);
    circ(-6, -40, 1.6, c.spot);
    ell(12, -42, 0.6, 0.5, c.skinD); ell(14.6, -41.6, 0.6, 0.5, c.skinD);
    circ(13.6, -37.8, 2.1, c.cheek);
    eyeAt(-0.5, -45, 3.3, o, null, c.skin);
    eyeAt(8.5, -45.6, 3.7, o, null, c.skin);
    frogMouth(o, c, p);
    if (c.style === 'knight') {
      ctx.fillStyle = c.scarf; rr(-7, -31.5, 19, 3.6, 1.8); ctx.fill();
      tri(-6, -30, -1, -30, -11 + o.swayX * 0.6, -25 + o.swayY * 0.3, c.scarf);
    } else if (c.style === 'prince') {
      const cy = -52 + o.swayY * 0.2;
      poly([-1, cy, 9, cy, 10.5, cy - 7, 7.2, cy - 3.6, 4, cy - 8.5, 0.8, cy - 3.6, -2.5, cy - 7], c.crown);
      ctx.fillStyle = c.crownD; ctx.fillRect(-1, cy - 1.4, 10, 1.4);
      circ(4, cy - 3, 1, '#e8463a'); circ(-2.5, cy - 7, 0.9, c.crown); circ(10.5, cy - 7, 0.9, c.crown); circ(4, cy - 8.5, 0.9, c.crown);
    } else {
      const sw = o.swayX * 0.25;
      ctx.save(); ctx.translate(4, -50.5); ctx.rotate(-0.5 + sw * 0.08);
      oval(0, -3.2, 2, 3.8, 0, c.leaf); limb(0, 0.5, 0, -6, 0.7, c.leafD);
      ctx.restore();
    }
    sweat(-8, -50, o);
    if (!armUp(p)) frogArm(p, c, true);
  });
}

function golemFace(o, c) {
  const m = o.mood, [lx, ly] = eyeTarget(o), ex = lx * 1.2, ey = ly * 0.8;
  for (const x of [0.5, 7.5]) {
    const cx = x + ex, cy = -47 + ey;
    if (o.face === 'yawn' || (o.blink && !WIDE_EYED.has(m) && m !== 'happy')) { limb(cx - 1.8, cy + 0.5, cx + 1.8, cy + 0.5, 1.3, c.rune); continue; }
    circ(cx, cy, 3.6, c.glow);
    if (m === 'happy' || m === 'jump') {
      ctx.strokeStyle = c.rune; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(cx, cy + 1.2, 1.9, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    } else if (m === 'hurt') {
      limb(cx - 1.5, cy - 1.5, cx + 1.5, cy + 1.5, 1.3, c.rune); limb(cx - 1.5, cy + 1.5, cx + 1.5, cy - 1.5, 1.3, c.rune);
    } else if (WIDE_EYED.has(m)) {
      circ(cx, cy, 2.3, c.rune); circ(cx, cy, 1, '#ffffff');
    } else {
      ctx.fillStyle = c.rune; rr(cx - 1.9, cy - 1.3, 3.8, 2.6, 1.2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(cx - 1, cy - 0.9, 1, 0.8);
    }
  }
  const mx = 4 + ex * 0.5, my = -41.5;
  if (o.face === 'yawn' || m === 'fall' || m === 'panic' || m === 'chased') ell(mx, my, o.face === 'yawn' ? 3.4 : 2.2, o.face === 'yawn' ? 3 : 2, c.crack);
  else if (m === 'happy' || m === 'jump') { ctx.strokeStyle = c.crack; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(mx, my - 2, 3.4, 0.4, Math.PI - 0.4); ctx.stroke(); }
  else if (FRIGHT.has(m)) { ctx.strokeStyle = c.crack; ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = 0; i <= 4; i++) ctx.lineTo(mx - 3 + i * 1.5, my + (i % 2 ? -0.8 : 0.8)); ctx.stroke(); }
  else limb(mx - 2.6, my, mx + 2.6, my - 0.3, 1.4, c.crack);
}
function golemArm(p, o, c, front) {
  const h = front ? p.hF : p.hB, sh = front ? 3 : -4;
  if (c.block) {
    ctx.strokeStyle = front ? c.stone : c.stoneD; ctx.lineWidth = 8; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.moveTo(sh, -30); ctx.lineTo(h[0], h[1]); ctx.stroke();
    ctx.fillStyle = front ? c.stoneD : c.stoneD; ctx.fillRect(h[0] - 4, h[1] - 4, 8, 8);
    ctx.fillStyle = c.stoneL; ctx.fillRect(h[0] - 3, h[1] - 3, 3, 2);
    return;
  }
  armTo(sh, h, 8.5, front ? c.stone : c.stoneD, 7.6);
  ctx.save(); ctx.translate(h[0], h[1]);
  ctx.fillStyle = front ? c.stone : c.stoneD; rr(-4.8, -4.6, 9.6, 9.2, c.block ? 0.5 : 3); ctx.fill();
  ctx.fillStyle = c.stoneL; rr(-3.8, -3.8, 4, 2, 1); ctx.fill();
  ctx.restore();
  if (c.block) return;
  const [jx, jy] = joint(sh, -31, h[0], h[1], 7.6, 1);
  const wx = jx + (h[0] - jx) * 0.62, wy = jy + (h[1] - jy) * 0.62;
  circ(wx, wy, 4.6, c.iron); circ(wx - 1.2, wy - 1.2, 1.2, c.ironL);
  if (front) {
    const sw = o.swayX * 0.6, sy = o.swayY * 0.4;
    ctx.strokeStyle = c.iron; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.ellipse(wx - 2 + sw * 0.4, wy + 5 + sy * 0.4, 1.6, 2.4, 0.3, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(wx - 3.5 + sw, wy + 9 + sy, 1.6, 2.4, -0.4, 0, Math.PI * 2); ctx.stroke();
  }
}
function blockLeg(hipX, f, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 9.5; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(hipX, -15); ctx.lineTo(f[0] + 1.5, f[1] - 4.5); ctx.stroke();
}
function drawBram(p, o, c) {
  torso(o, () => golemArm(p, o, c, false));
  if (c.block) blockLeg(-4, p.fB, c.stoneD); else legTo(-4, p.fB, 9, c.stoneD);
  ctx.fillStyle = c.stoneD; rr(p.fB[0] - 4.5, p.fB[1] - 5, 12.5, 5, 2); ctx.fill();
  torso(o, () => {
    const br = 1 + Math.sin(o.frame * 0.05) * 0.02;
    ctx.save(); ctx.translate(0, -27); ctx.scale(br, br); ctx.translate(0, 27);
    if (c.block) {
      ctx.fillStyle = c.stone; ctx.fillRect(-14, -42, 29, 30);
      ctx.fillStyle = c.stoneD; ctx.fillRect(9, -42, 6, 30);
      for (let i = 0; i < 14; i++) { ctx.fillStyle = i % 2 ? c.stoneL : c.crack; ctx.fillRect(-13 + hashSeed(7, i, 31) * 24 | 0, -34 + hashSeed(7, i, 32) * 20 | 0, 2.4, 2.4); }
      ctx.fillStyle = c.moss; ctx.fillRect(-14, -42, 29, 6);
      for (let i = 0; i < 7; i++) ctx.fillRect(-14 + i * 4.2, -36, 4.2, 1 + (i * 5 % 3) * 1.4);
      ctx.restore();
      return;
    }
    poly([-14, -15, -16.5, -27, -13, -38, -3, -42.5, 10, -41, 16, -31, 15, -18, 7, -12, -7, -11.5], c.stone);
    poly([15, -18, 16, -31, 10, -41, 7, -30, 9, -18, 4, -12, 7, -12], c.stoneD);
    poly([-13, -38, -3, -42.5, 3, -42, -8, -37], c.stoneL);
    ctx.strokeStyle = c.crack; ctx.lineWidth = 1.1; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-12, -24); ctx.lineTo(-8, -22); ctx.lineTo(-9, -18); ctx.moveTo(11, -36); ctx.lineTo(8, -33); ctx.stroke();
    ctx.globalAlpha *= c.lava ? 0.7 + 0.3 * Math.sin(o.frame * 0.1) : 0.55 + 0.45 * Math.sin(o.frame * 0.06);
    ctx.strokeStyle = c.rune; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-1, -33); ctx.lineTo(3, -27); ctx.lineTo(-1, -21); ctx.moveTo(3, -27); ctx.lineTo(7, -27); ctx.stroke();
    if (c.lava) { ctx.beginPath(); ctx.moveTo(-14, -30); ctx.lineTo(-10, -32); ctx.lineTo(-11, -36); ctx.moveTo(12, -22); ctx.lineTo(9, -16); ctx.stroke(); }
    ctx.restore();
  });
  if (c.block) blockLeg(4, p.fF, c.stone); else legTo(4, p.fF, 9.5, c.stone);
  ctx.fillStyle = c.stone; rr(p.fF[0] - 4.5, p.fF[1] - 5.5, 13, 5.5, c.block ? 0.5 : 2); ctx.fill();
  ctx.fillStyle = c.stoneL; ctx.fillRect(p.fF[0] - 3, p.fF[1] - 5, 8, 1.2);
  torso(o, () => {
    if (armUp(p)) golemArm(p, o, c, true);
    const hr = c.block ? 0.5 : 6;
    ctx.fillStyle = c.stone; rr(-8, -57, 21, 19, hr); ctx.fill();
    ctx.fillStyle = c.stoneD; rr(6, -56, 7, 17, c.block ? 0.5 : 4.5); ctx.fill();
    if (c.block) {
      ctx.fillStyle = c.moss; ctx.fillRect(-8, -57, 21, 4.5);
      for (let i = 0; i < 5; i++) ctx.fillRect(-8 + i * 4.2, -52.5, 4.2, 0.8 + (i * 2 % 3) * 1.3);
      golemFace(o, c);
      sweat(-8, -52, o);
      if (!armUp(p)) golemArm(p, o, c, true);
      return;
    }
    ctx.fillStyle = c.stoneL; rr(-6, -55, 6, 3, 1.5); ctx.fill();
    ctx.fillStyle = c.stoneD; rr(-8, -51.6, 21, 2.8, 1.4); ctx.fill();
    golemFace(o, c);
    const sw = o.swayX * 0.4;
    fuzz(2.5, -57.5, 11, 3.8, c.moss, 13);
    ell(-2, -56.5, 4.5, 1.7, c.mossD);
    limb(7 + sw * 0.3, -59, 8 + sw, -63.5, 0.9, c.mossD);
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + o.frame * 0.01; circ(8 + sw + Math.cos(a) * 1.6, -64.5 + Math.sin(a) * 1.6, 1.1, c.flower); }
    circ(8 + sw, -64.5, 0.9, '#fff3b0');
    sweat(-8, -52, o);
    if (!armUp(p)) golemArm(p, o, c, true);
  });
}

function batWing(p, o, c, front) {
  const h = front ? p.hF : p.hB, sx = front ? 1 : -2, sy = -32;
  const [jx, jy] = joint(sx, sy, h[0], h[1], 11, 1);
  const bx = front ? -3 : -6, by = -19;
  if (Math.hypot(h[0] - sx, h[1] - sy) < 15 && h[1] > -36) {
    ctx.fillStyle = front ? c.membrane : c.wing;
    ctx.beginPath(); ctx.moveTo(sx - 1, -35); ctx.quadraticCurveTo(sx + 9, -31, h[0] + 2.5, h[1] + 2);
    ctx.quadraticCurveTo(h[0] - 1, h[1] + 5, h[0] - 4, h[1] + 3); ctx.quadraticCurveTo(sx - 3, -24, sx - 3, -31); ctx.closePath(); ctx.fill();
    limb(sx, -34, h[0] + 1, h[1] + 1, 1.8, c.wing);
    circ(sx + 0.5, -35.5, 1.3, c.wing);
    return;
  }
  const open = Math.min(1, Math.hypot(h[0] - sx, h[1] - by) / 24);
  const s1 = [h[0] + (bx - h[0]) * 0.36, h[1] + (by - h[1]) * 0.36 + 4 * open];
  const s2 = [h[0] + (bx - h[0]) * 0.7, h[1] + (by - h[1]) * 0.7 + 3 * open];
  ctx.fillStyle = front ? c.membrane : c.wing;
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(jx, jy); ctx.lineTo(h[0], h[1]);
  ctx.quadraticCurveTo((h[0] + s1[0]) / 2 - 1, (h[1] + s1[1]) / 2 - 1.5 * open, s1[0], s1[1]);
  ctx.quadraticCurveTo((s1[0] + s2[0]) / 2, (s1[1] + s2[1]) / 2 - 2 * open, s2[0], s2[1]);
  ctx.quadraticCurveTo((s2[0] + bx) / 2, (s2[1] + by) / 2 - 2 * open, bx, by);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = c.wing; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(jx, jy); ctx.lineTo(h[0], h[1]); ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(jx, jy); ctx.lineTo(s1[0], s1[1]); ctx.moveTo(jx, jy); ctx.lineTo(s2[0], s2[1]); ctx.stroke();
  circ(h[0], h[1], 1.6, c.wing);
  if (front) {
    const mx = (jx + h[0]) / 2, my = (jy + h[1]) / 2, a = Math.atan2(h[1] - jy, h[0] - jx);
    ctx.save(); ctx.translate(mx, my); ctx.rotate(a);
    ctx.fillStyle = c.bandage; ctx.fillRect(-3, -2.4, 2.2, 4.8); ctx.fillRect(0.4, -2.4, 2.2, 4.8);
    ctx.fillStyle = c.bandageD; ctx.fillRect(-0.8, -2.4, 1.2, 4.8);
    ctx.restore();
  }
}
function batFoot(f, c, x0, w) {
  if (c.style === 'puff') { ell(f[0] + 2, f[1] - 2.6, 5.6, 3.1, c.feet); return; }
  for (let i = 0; i < 3; i++) limb(f[0] + x0 + i * 2.2, f[1] - 2, f[0] + x0 + 0.5 + i * 2.4, f[1], w, c.feet);
}
function drawFlit(p, o, c) {
  const m = o.mood, puff = c.style === 'puff', ear = puff ? 0.5 : 1;
  torso(o, () => {
    if (c.style === 'vampire') {
      ctx.fillStyle = c.collar;
      ctx.beginPath(); ctx.moveTo(-12, -34); ctx.lineTo(-15, -50); ctx.lineTo(-4, -40); ctx.lineTo(8, -40); ctx.lineTo(15, -49); ctx.lineTo(12, -34); ctx.closePath(); ctx.fill();
      tri(-12.5, -36, -14, -47, -6, -39, c.collarIn); tri(12.5, -36, 13.5, -46, 7, -39, c.collarIn);
    }
    batWing(p, o, c, false);
  });
  bentLimb(-2, -17, p.fB[0], p.fB[1] - 2, 5, -1, 2.6, c.furD);
  batFoot(p.fB, c, -1, 1.3);
  torso(o, () => {
    if (puff) circ(0, -26.5, 12.2, c.fur);
    else fuzz(0, -27, 11, 12, c.fur, 16, o.frame * 0.04);
    ell(3, -26, 7, 8.5, c.belly);
  });
  bentLimb(2, -17, p.fF[0], p.fF[1] - 2, 5, -1, 2.8, c.fur);
  batFoot(p.fF, c, -0.5, 1.4);
  torso(o, () => {
    if (armUp(p)) batWing(p, o, c, true);
    const tw = every(o.frame, 150, 6, 40) ? 0.3 : 0;
    ctx.save(); ctx.translate(-2, -53); ctx.rotate(-0.2 - tw); ctx.scale(ear, ear);
    tri(-5, 3, 3, 1, -3, -15, c.furD); tri(-3, 1.5, 1.4, 0.6, -2.2, -9.5, c.earIn);
    ctx.restore();
    ctx.save(); ctx.translate(8, -53); ctx.rotate(0.25 + tw * 0.5); ctx.scale(ear, ear);
    tri(-4, 1.5, 4, 2, 1, -15, c.fur); tri(-2, 1, 2.6, 1.2, 0.8, -9.5, c.earIn);
    ctx.restore();
    if (puff) circ(3, -45.5, 10.4, c.fur);
    else fuzz(3, -45.5, 10, 9.5, c.fur, 14);
    ell(5.5, -44, 7.4, 6.4, c.face);
    if (!puff) for (let i = 0; i < 3; i++) tri(-1 + i * 3, -54.5, 2 + i * 3, -54.5, 0.5 + i * 3 + o.swayX * 0.3, -58 + o.swayY * 0.2, c.fur);
    eyeAt(2.6, -46.4, 2.8, o, c.iris, c.face);
    eyeAt(8.6, -46.7, 3.1, o, c.iris, c.face);
    circ(11.5, -42, 2, c.cheek);
    ell(12.6, -43.2, 2.2, 1.6, c.nose);
    mouthAt(8, -40.2, o, c.nose, 0.8);
    if (!puff && m !== 'happy' && m !== 'jump' && o.face !== 'yawn' && m !== 'hurt') tri(8.2, -40.4, 9.6, -40.4, 8.9, -38.4, '#ffffff');
    sweat(-6, -54, o);
    if (!armUp(p)) batWing(p, o, c, true);
  });
}

const DRAWERS = { hal: drawFig, pip: drawVix, bolt: drawTad, yeti: drawBram, nova: drawFlit };

function drawClimber(c, pose, o) {
  o.swayX = o.swayX || 0; o.swayY = o.swayY || 0;
  o.lean = pose.lean || 0; o.bob = pose.bob || 0;
  if (pose.face) o.face = pose.face;
  if (o.skin && o.skin.glitch) { drawGlitch(c, pose, o); return; }
  DRAWERS[c.id](pose, o, paletteFor(c, o.skin));
}

const glitchCanvas = document.createElement('canvas');
glitchCanvas.width = 40; glitchCanvas.height = 44;
const glitchCtx = glitchCanvas.getContext('2d');
function drawGlitch(c, pose, o) {
  const g = glitchCtx;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, 40, 44);
  const saved = ctx;
  ctx = g;
  ctx.setTransform(0.5, 0, 0, 0.5, 20, 40);
  DRAWERS[c.id](pose, o, c.pal);
  ctx = saved;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'source-atop';
  const tick = Math.floor(o.frame / 5);
  for (let y = 0; y < 44; y += 2) {
    for (let x = 0; x < 40; x += 2) {
      const h = hashSeed(tick, x * 53 + y, 7);
      if (h < 0.5) { g.fillStyle = GLITCH_COLORS[(h * 997 | 0) % 5]; g.fillRect(x, y, 2, 2); }
    }
  }
  g.globalCompositeOperation = 'source-over';
  const smooth = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  for (let row = 0; row < 44; row += 4) {
    const j = hashSeed(tick, row, 9);
    const dx = j < 0.3 ? Math.round((j / 0.3 - 0.5) * 10) : 0;
    ctx.drawImage(glitchCanvas, 0, row, 40, 4, -40 + dx, -80 + row * 2, 80, 8);
  }
  ctx.imageSmoothingEnabled = smooth;
}

const IDLE_UP = [0.4, -1], IDLE_BACK = [-0.6, 0], IDLE_FRONT = [1, 0];
const idleLook = f => every(f, 240, 50, 90) ? IDLE_UP : every(f, 240, 30, 190) ? IDLE_BACK : IDLE_FRONT;

const silCanvas = document.createElement('canvas');
silCanvas.width = 440; silCanvas.height = 440;
const silCtx = silCanvas.getContext('2d');
function drawClimberAt(c, x, y, s, frame, locked, skin) {
  const st = { ground: true, vx: 0, vy: 0, run: 0, teeter: 0, frame, idleT: 999, speed01: 0, mood: 'idle' };
  const pose = climberPose(c, st);
  const o = {
    frame, blink: !locked && (frame % 200) < 7, mood: 'idle', look: idleLook(frame),
    swayX: Math.sin(frame * 0.05) * 1.2, swayY: Math.cos(frame * 0.07) * 0.8, combo: false, skin,
  };
  if (!locked) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    drawClimber(c, pose, o);
    ctx.restore();
    return;
  }
  silCtx.setTransform(1, 0, 0, 1, 0, 0);
  silCtx.clearRect(0, 0, 440, 440);
  const saved = ctx;
  ctx = silCtx;
  ctx.save(); ctx.translate(220, 400); ctx.scale(s * 2, s * 2);
  drawClimber(c, pose, Object.assign(o, { skin: null }));
  ctx.restore();
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = '#1b2140';
  ctx.fillRect(0, 0, 440, 440);
  ctx.globalCompositeOperation = 'source-over';
  ctx = saved;
  ctx.drawImage(silCanvas, x - 110, y - 200, 220, 220);
}
