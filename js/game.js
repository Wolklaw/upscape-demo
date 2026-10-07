'use strict';

const FOOT = 9, HALF_W = 12;
// Snappier control on small ledges: falls are quicker than rises, letting go of the stick brakes in the air,
// and turning around mid-air bites harder. The jump arc on the way up is unchanged.
const FALL_GRAVITY = 1.35, FALL_MAX = 1.15, AIR_BRAKE = 0.8, AIR_TURN = 1.45;
const COMBO_TIME = 170;
const SPRINT_GOAL = 100;
const CLOCK_CLASSIC = { every: 20, speeds: [0, 1.3, 2.05, 2.8, 3.55, 4.3], zoneBoost: true };
const CLOCK_STEADY = { every: 30, speeds: [0, 0.9, 1.5, 2.1, 2.8] };

const MODES = [
  { id: 'classic', name: 'CLASSIC', desc: 'Climb as high as you can. The tower rises faster every 20 seconds.', song: 'ascent', clock: CLOCK_CLASSIC },
  { id: 'sprint', name: 'SPRINT 100', desc: 'Race to floor 100. Same tower every run.', song: 'breakout', seed: 0x1CEC0DE, clock: CLOCK_STEADY },
  { id: 'chaos', name: 'CHAOS', desc: 'Wind, quakes, blackouts and more: a new twist every 14 seconds.', song: 'havoc', clock: CLOCK_STEADY },
  { id: 'rockfall', name: 'ROCKFALL', desc: "Dodge what falls from the sky. Three hits and you're out.", song: 'rubble', clock: CLOCK_STEADY },
];
const modeById = id => MODES.find(m => m.id === id) || MODES[0];
const maxLevel = () => G.mode.clock.speeds.length - 1;

const TIER_FLOORS = 100;
const TOP_FLOOR = 10000;
// The free web demo (built by store/tools/build-demo.ps1) sets window.UPSCAPE_DEMO: the tower ends at floor 2,000.
const DEMO = !!window.UPSCAPE_DEMO, DEMO_TOP = 2000, LAST_FLOOR = DEMO ? DEMO_TOP : TOP_FLOOR;
const ZONE_KEYS = [0, 2, 3, 5, -2, 0, 2, 3, 5, 7];
const ZONES = [
  { name: 'STONEWORK', kind: 'stone', wall: [54, 62, 96], tiers: [
    ['Cellar Stone', 228, 10, 58], ['Old Brick', 10, 45, 48], ['Mossy Steps', 95, 25, 45], ['Dune Road', 38, 55, 62], ['Slate Ledges', 215, 15, 42],
    ['Granite', 0, 4, 55], ['Ember Keep', 20, 8, 26], ['Marble Hall', 40, 15, 85], ['Obsidian', 270, 20, 16], ['Moonlit Grove', 140, 35, 30]] },
  { name: 'FROZEN HALLS', kind: 'ice', wall: [70, 104, 140], tiers: [
    ['Frost', 195, 70, 80], ['Glacier', 190, 60, 70], ['Lilac Peak', 345, 55, 80], ['Icicle Row', 185, 65, 75], ['Permafrost', 210, 35, 65],
    ['Beacon Peaks', 25, 50, 45], ['Hoarfrost', 180, 25, 86], ['Wyrm Pass', 205, 45, 55], ['Aurora Ice', 160, 60, 70], ['Wall of Ice', 200, 45, 70]] },
  { name: 'TIMBERWORKS', kind: 'wood', wall: [86, 62, 48], tiers: [
    ['Pine', 35, 45, 55], ['Patchwork Plains', 100, 45, 50], ['Birch', 40, 25, 80], ['Driftwood', 30, 12, 62], ['Windswept Moor', 25, 40, 38],
    ['Redwood', 5, 55, 35], ['Bamboo', 65, 45, 55], ['Arcane Academy', 355, 50, 28], ['Lantern Depths', 225, 30, 35], ['Ancient Bark', 20, 30, 30]] },
  { name: 'THE FOUNDRY', kind: 'steel', wall: [66, 68, 76], tiers: [
    ['Iron', 210, 8, 50], ['Girder Works', 5, 70, 48], ['Rivets', 200, 6, 42], ['Wasteland', 50, 35, 45], ['Bronze', 33, 50, 42],
    ['Hell Gate', 8, 85, 40], ['Chrome', 210, 15, 82], ['Heavy Hall', 210, 12, 90], ['Cobalt', 225, 55, 45], ['Molten Edge', 12, 85, 45]] },
  { name: 'SUGAR HEIGHTS', kind: 'candy', wall: [110, 60, 96], tiers: [
    ['Chocolate Falls', 20, 55, 32], ['Bubblegum', 325, 80, 72], ['Gem Grid', 290, 70, 65], ['Licorice', 280, 15, 14], ['Mint Chip', 150, 55, 70],
    ['Block Stack', 200, 90, 55], ['Grape Taffy', 275, 55, 55], ['Caramel', 30, 70, 52], ['Seaside Meadow', 100, 65, 50], ['Sugar Rush', 5, 85, 60]] },
  { name: 'CLOUD KINGDOM', kind: 'cloud', wall: [120, 140, 190], tiers: [
    ['Floating Isle', 205, 80, 65], ['Stratus', 215, 20, 82], ['Pipe Works', 8, 80, 55], ['Rain Cloud', 215, 12, 58], ['Sunset Colony', 22, 80, 62],
    ['Cirrus', 200, 80, 92], ['Cotton Heights', 320, 80, 82], ['Silver Lining', 210, 10, 90], ['Storm Front', 255, 25, 32], ['Sky Palace', 48, 90, 88]] },
  { name: 'GOLDEN SPIRE', kind: 'shine', wall: [112, 92, 44], tiers: [
    ["Dragon's Hoard", 42, 90, 50], ['Brass', 42, 55, 48], ['Golden Tree', 44, 90, 55], ['White Gold', 48, 40, 82], ['Royal Gold', 44, 95, 50],
    ['Promenade', 42, 55, 82], ['Honey', 38, 90, 58], ['Idol Temple', 35, 35, 45], ['Treasure', 50, 100, 48], ['The Painted Wall', 260, 12, 22]] },
  { name: 'CRYSTAL CAVERNS', kind: 'crystal', wall: [72, 52, 118], tiers: [
    ['Quartz', 300, 15, 88], ['Deep Halls', 215, 12, 50], ['Emerald', 145, 65, 45], ['Crystal Choir', 195, 85, 70], ['Ruby', 350, 75, 48],
    ['Topaz', 40, 90, 58], ['Forest Shrine', 120, 35, 40], ['Jade', 160, 45, 48], ['Diamond', 200, 40, 94], ['Prism', 0, 0, 92]] },
  { name: 'NEON GRID', kind: 'neon', wall: [34, 28, 58], tiers: [
    ['Neon Pink', 320, 100, 60], ['Neon Maze', 225, 100, 55], ['Laser Lime', 95, 100, 55], ['Beat Boulevard', 320, 90, 55], ['Ultraviolet', 265, 100, 65],
    ['Insert Coin', 50, 100, 55], ['Hologram', 175, 90, 60], ['Clean Room', 30, 90, 55], ['Overdrive', 10, 100, 58], ['Glitch', 0, 0, 85]] },
  { name: 'STARLIGHT SUMMIT', kind: 'cosmic', wall: [26, 22, 48], tiers: [
    ['Twilight', 260, 45, 30], ['Twin Suns', 28, 65, 55], ['Nebula', 300, 55, 35], ['Year 3000', 290, 70, 55], ['Galaxy', 235, 60, 32],
    ['Orbital Ring', 185, 60, 55], ['Pulsar', 185, 70, 40], ['Quasar', 280, 80, 45], ['Event Horizon', 0, 0, 8], ['The Summit', 48, 90, 60]] },
];
const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${clamp(l, 0, 100)}%)`;
const TIERS = [];
ZONES.forEach((z, zi) => z.tiers.forEach(([name, h, s, l], i) => {
  const t = {
    name: name.toUpperCase(), zone: zi, index: zi * 10 + i, kind: z.kind, variant: i % 3, h, s, l,
    body: hsl(h, s, l), top: hsl(h, s * 0.8, l + 16), edge: hsl(h, s, Math.min(l - 22, 58)),
  };
  if (z.kind === 'neon') { t.body = hsl(h, 35, 11); t.top = hsl(h, s, l); t.edge = hsl(h, s, l); t.glow = hsl(h, s, l); }
  if (z.kind === 'cosmic') { t.body = hsl(h, s, l * 0.75 + 6); t.top = hsl(h, s, l + 30); t.edge = hsl(h, s, l * 0.3); }
  TIERS.push(t);
}));
TIERS[79].special = 'prism';
TIERS[89].special = 'glitch';
TIERS[6].special = 'souls';
TIERS[24].special = 'witcher';
TIERS[37].special = 'gravity';
TIERS[65].special = 'lumiere';
TIERS[69].special = 'monolith';
TIERS[85].special = 'arcade';
const TRIBUTE_TIERS = {
  3: 'journey', 9: 'grove', 12: 'celeste', 17: 'dragon', 21: 'blocks', 27: 'academy', 28: 'hollow', 31: 'girders', 35: 'hell', 42: 'match3',
  45: 'tetris', 48: 'hills', 52: 'mushroom', 56: 'dream', 62: 'erdtree', 73: 'prelude', 81: 'pellet', 83: 'rhythm', 87: 'portal',
  15: 'beacons', 19: 'icewall', 33: 'shelter', 40: 'cocoa', 50: 'skyisle', 54: 'colony', 60: 'hoard', 67: 'idol', 71: 'deephalls',
  76: 'shrine', 91: 'twinsuns', 93: 'future', 95: 'ring',
};
for (const i in TRIBUTE_TIERS) TIERS[i].special = TRIBUTE_TIERS[i];
const TIER_SONGS = {
  souls: 'ashen', witcher: 'wolf', gravity: 'surge', lumiere: 'lumiere', monolith: 'lumiere', arcade: 'insert', glitch: 'glitch',
  journey: 'dunes', grove: 'grove', celeste: 'peak', dragon: 'nord', blocks: 'cubic', hollow: 'hollow', girders: 'barrel', hell: 'hell',
  match3: 'match', tetris: 'stack', hills: 'hills', mushroom: 'warp', dream: 'dream', erdtree: 'grace', prelude: 'prelude',
  pellet: 'waka', rhythm: 'rhythm', portal: 'chamber', academy: 'academy',
  beacons: 'beacon', icewall: 'watch', shelter: 'atomic', cocoa: 'cocoa', skyisle: 'isle', colony: 'cloudline', hoard: 'hoard',
  idol: 'idol', deephalls: 'deep', shrine: 'shrine', twinsuns: 'twosuns', future: 'future', ring: 'ring',
};
const TIER_QUIPS = {
  souls: 'Rest here, weary climber. The embers are warm.',
  witcher: 'Cold wind, thin air, long road.',
  gravity: 'Everything weighs a little more here.',
  lumiere: 'A town by the sea, waiting for you.',
  monolith: 'Someone painted this long ago. Keep climbing.',
  arcade: 'Insert coin to continue',
  journey: 'Sand, wind and a long way up.',
  grove: 'A small light grows between the roots.',
  celeste: 'Thin air, bright flags.',
  dragon: 'Something large circles overhead.',
  blocks: 'Fields stitched together with care.',
  hollow: 'Dark, quiet and very deep.',
  girders: 'Hard hats recommended.',
  hell: 'Abandon all hope. Keep climbing.',
  match3: 'Match three to climb on!',
  tetris: "Don't let it stack to the top.",
  hills: 'Salt air, soft grass, easy climbing.',
  mushroom: 'Mind the steam.',
  dream: 'Floaty, fluffy, dreamy.',
  erdtree: 'A tree older than the tower.',
  prelude: 'The crystals are singing.',
  pellet: 'Follow the glowing trail.',
  rhythm: 'Hit every note!',
  portal: 'Results pending.',
  academy: 'The staircases have opinions.',
  beacons: 'One fire calls the next, all the way up.',
  icewall: 'Cold on this side. Colder on the other.',
  shelter: 'Please remain calm. The shelter is upstairs.',
  cocoa: "Whatever you do, don't drink from the river.",
  skyisle: 'It has floated here longer than anyone remembers.',
  colony: 'Lovely view. Read the fine print.',
  hoard: 'Tread softly. Something is sleeping.',
  idol: 'Nobody touch anything.',
  deephalls: "Don't drop anything down the well.",
  shrine: 'Smash a pot or two. For luck.',
  twinsuns: 'Two suns, lots of sand, a long way up.',
  future: 'Your thousand-year nap is over. Climb on.',
  ring: 'The horizon curves up. So do you.',
};
const midFloor = () => Math.floor(-(G.camY + H / 2) / FLOOR_H);
const tierIndex = n => Math.min(TIERS.length - 1, Math.floor(Math.max(0, n) / TIER_FLOORS));
const themeOf = n => TIERS[tierIndex(n)];

const COMBO_WORDS = [
  [4, 'SNEAKY!'], [7, 'SLICK!'], [15, 'DARING!'], [25, 'WICKED!'], [35, 'FEARLESS!'],
  [50, 'RUTHLESS!'], [70, 'UNCHAINED!'], [100, 'RELENTLESS!'], [140, 'MYTHICAL!'], [200, 'UNCATCHABLE!'],
];
const EMBERS = [
  ['#fff1b8', '#ffb547', '#ff6a2a'],
  ['#ffd0f0', '#ff5fb8', '#b04dff'],
  ['#e6ffd0', '#8be05a', '#2fd3a0'],
];
const emberSet = level => EMBERS[level >= 7 ? 2 : level >= 4 ? 1 : 0];

const SKY = [
  { f: 0,     top: '#3a2463', bot: '#f2945f' },
  { f: 600,   top: '#14204f', bot: '#5a4f9e' },
  { f: 1200,  top: '#081a33', bot: '#1f7a6a' },
  { f: 2200,  top: '#1a1030', bot: '#7a3b2e' },
  { f: 3200,  top: '#140c0c', bot: '#8a3a12' },
  { f: 4200,  top: '#2a0f3a', bot: '#ff7fb7' },
  { f: 5200,  top: '#3f6fd0', bot: '#bfe3ff' },
  { f: 6200,  top: '#3a2a08', bot: '#ffcf5a' },
  { f: 7200,  top: '#0f0830', bot: '#6a3fd0' },
  { f: 8200,  top: '#05010f', bot: '#ff2fa0' },
  { f: 9200,  top: '#000000', bot: '#1a0a3a' },
  { f: 10000, top: '#000000', bot: '#000000' },
];
SKY.forEach(s => { s.topC = hexRgb(s.top); s.botC = hexRgb(s.bot); });

const CONFETTI = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ffffff'];

let stats = load('stats', null);
let boards = load('boards', null);
if (!stats || !boards) {
  const old = load('best', null);
  stats = stats || { bestFloor: old ? old.floor : 0, bestCombo: old ? old.combo : 0, runs: 0 };
  boards = boards || { classic: [], sprint: [] };
  if (old && old.score > 0 && !boards.classic.length) boards.classic.push({ name: 'YOU', score: old.score, floor: old.floor, combo: old.combo, climber: 'hal' });
  save('stats', stats); save('boards', boards);
}
const STATS_DEFAULT = {
  bestFloor: 0, bestCombo: 0, runs: 0, totalFloors: 0, sprintBest: 0, summit: false,
  bestBounces: 0, totalSpins: 0, bestScore: 0, cheated: false, chaosFloor: 0, rockFloor: 0, rockClean: 0, goblins: 0,
};
stats = Object.assign({}, STATS_DEFAULT, stats);
for (const m of MODES) boards[m.id] = boards[m.id] || [];
if (!stats.sprintBest && boards.sprint[0]) stats.sprintBest = boards.sprint[0].time;
if (load('scoring', 1) < 2) {
  for (const m of MODES) {
    if (m.id === 'sprint') continue;
    for (const e of boards[m.id]) {
      if (e.score == null || !e.combo) continue;
      const base = Math.max(0, e.floor - (e.start || 0)) * 10, extra = Math.max(0, e.score - base);
      e.score = base + Math.round(extra * comboPoints(e.combo) / (e.combo * e.combo));
    }
    boards[m.id].sort((a, b) => b.score - a.score);
  }
  save('boards', boards); save('scoring', 2);
}

const boardKey = (modeId, wide) => wide && modeId !== 'sprint' ? modeId + ':wide' : modeId;
const boardFor = (modeId, wide) => boards[boardKey(modeId, wide)] || (boards[boardKey(modeId, wide)] = []);
const playsWide = modeId => wantedStageWidth(modeId) > UI_W;
const fmtSeconds = v => `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`;
const num = v => settings.lang === 'fr' ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') : v.toLocaleString('en-US');
const GOAL_TYPES = {
  floor: { text: v => T('Reach floor {0}', num(v)), value: () => stats.bestFloor, live: l => l.floor },
  combo: { text: v => T('Land a {0}-floor combo', v), value: () => stats.bestCombo, live: l => l.combo },
  score: { text: v => T('Score over {0} in one run', num(v - 1)), value: () => stats.bestScore, live: l => l.score },
  bounces: { text: v => T('Bounce off the walls {0} times in one run', v), value: () => stats.bestBounces, live: l => l.bounces },
  spins: { text: v => T('Do {0} spin jumps', v), value: () => stats.totalSpins },
  runs: { text: v => T('Play {0} runs', v), value: () => stats.runs },
  secret: { text: () => T('Enter a famous cheat code on the main menu'), done: () => !!settings.retroUnlocked, progress: () => T('up, up, ...') },
  cheater: { text: () => T('Play a run with cheats on'), done: () => !!stats.cheated, progress: () => T('not yet') },
  total: { text: v => T('Climb {0} floors in total', num(v)), value: () => stats.totalFloors },
  sprintTime: {
    text: v => T('Finish Sprint 100 in under {0}', fmtSeconds(v)),
    done: v => stats.sprintBest > 0 && stats.sprintBest < v * 60,
    progress: () => stats.sprintBest ? T('best {0}', formatTime(stats.sprintBest)) : T('not finished yet'),
  },
  chaosFloor: { text: v => T('Reach floor {0} in Chaos', v), value: () => stats.chaosFloor, live: l => (l.mode === 'chaos' ? l.floor : 0) },
  rockFloor: { text: v => T('Reach floor {0} in Rockfall', v), value: () => stats.rockFloor, live: l => (l.mode === 'rockfall' ? l.floor : 0) },
  rockClean: { text: v => T('Reach floor {0} in Rockfall without getting hit', v), value: () => stats.rockClean, live: l => (l.mode === 'rockfall' && !l.hits ? l.floor : 0) },
  goblins: { text: v => (v === 1 ? T('Outclimb a goblin until it gives up') : T('Outclimb {0} goblins until they give up', v)), value: () => stats.goblins, live: l => stats.goblins + (l.goblins || 0) },
  summit: { text: () => T('Reach the top of the tower'), done: () => !!stats.summit, progress: () => T('best floor {0} of {1}', num(stats.bestFloor), num(TOP_FLOOR)) },
};
function goalDone(g, live) {
  if (!g) return true;
  const t = GOAL_TYPES[g.type];
  if (t.done) return t.done(g.v);
  return Math.max(t.value(), live && t.live ? t.live(live) : 0) >= g.v;
}
const goalText = g => g.label ? T(g.label) : GOAL_TYPES[g.type].text(g.v);
function goalFraction(g) {
  const t = GOAL_TYPES[g.type];
  return t.value ? clamp(t.value() / g.v, 0, 1) : 0;
}
function goalProgress(g) {
  if (goalDone(g)) return T('DONE');
  const t = GOAL_TYPES[g.type];
  return t.progress ? t.progress(g.v) : `${num(t.value())} / ${num(g.v)}`;
}
const unlockAll = () => !!settings.cheats.all;
const isUnlocked = c => unlockAll() || goalDone(c.unlock);
function startFloors() {
  const reached = unlockAll() ? TOP_FLOOR : Math.floor(stats.bestFloor / TIER_FLOORS) * TIER_FLOORS;
  const top = Math.min(reached, LAST_FLOOR - TIER_FLOORS);
  const out = [];
  for (let f = 0; f <= top; f += TIER_FLOORS) out.push(f);
  return out;
}
const skinUnlocked = (c, s) => isUnlocked(c) && (unlockAll() || goalDone(s.unlock));
const ACHIEVEMENTS = [
  { id: 'first', name: 'First Steps', goal: { type: 'floor', v: 10 } },
  { id: 'century', name: 'Centurion', goal: { type: 'floor', v: 100 } },
  { id: 'midnight', name: 'Night Owl', reward: ['hal', 'midnight'] },
  { id: 'yeti', name: 'Rock Solid', reward: ['yeti'] },
  { id: 'ashen', name: 'Kindled', reward: ['hal', 'ashen'] },
  { id: 'kilo', name: 'Frozen Halls', goal: { type: 'floor', v: 1000 } },
  { id: 'sasquatch', name: 'Hot Rocks', reward: ['yeti', 'sasquatch'] },
  { id: 'wolf', name: 'Long Road', reward: ['hal', 'wolf'] },
  { id: 'golden', name: 'Key Master', reward: ['hal', 'golden'] },
  { id: 'surge', name: 'Heavyweight', reward: ['hal', 'surge'] },
  { id: 'eclipse', name: 'Night Fangs', reward: ['nova', 'eclipse'] },
  { id: 'half', name: 'Halfway There', goal: { type: 'floor', v: 5000 } },
  { id: 'summit', name: 'The Summit', reward: ['*', 'glitch'], secret: true },
  { id: 'combo10', name: 'Combo Starter', goal: { type: 'combo', v: 10 } },
  { id: 'combo25', name: 'Wicked!', goal: { type: 'combo', v: 25 } },
  { id: 'pip', name: 'Sticky Fingers', reward: ['pip'] },
  { id: 'emperor', name: 'Cold Trail', reward: ['pip', 'emperor'] },
  { id: 'nova', name: 'Take Wing', reward: ['nova'] },
  { id: 'mars', name: 'Fruit Salad', reward: ['nova', 'mars'] },
  { id: 'bolt', name: 'Speedrunner', reward: ['bolt'] },
  { id: 'copper', name: 'Toxic Time', reward: ['bolt', 'copper'] },
  { id: 'chrome', name: 'Royal Hop', reward: ['bolt', 'chrome'] },
  { id: 'frostbite', name: 'Crystal Clear', reward: ['yeti', 'frostbite'] },
  { id: 'rockhopper', name: 'Marathon', reward: ['pip', 'rockhopper'] },
  { id: 'pinball', name: 'Pinball', goal: { type: 'bounces', v: 30 } },
  { id: 'spins', name: 'Spin Doctor', goal: { type: 'spins', v: 100 } },
  { id: 'nine', name: 'Nine Thousand', goal: { type: 'score', v: 9001 } },
  { id: 'storm', name: 'Storm Chaser', goal: { type: 'chaosFloor', v: 250 } },
  { id: 'hardhat', name: 'Hard Hat', goal: { type: 'rockFloor', v: 250 } },
  { id: 'untouchable', name: 'Untouchable', goal: { type: 'rockClean', v: 100 } },
  { id: 'goblin1', name: 'Not Today, Goblin', goal: { type: 'goblins', v: 1 } },
  { id: 'goblin10', name: 'Goblin Repellent', goal: { type: 'goblins', v: 10 } },
  { id: 'tunic', name: 'Dangerous Heights', reward: ['hal', 'tunic'] },
  { id: 'plumber', name: 'Coin Collector', reward: ['hal', 'plumber'] },
  { id: 'blur', name: 'Blue Streak', reward: ['pip', 'blur'] },
  { id: 'twin', name: 'Two Tails Up', reward: ['pip', 'twin'] },
  { id: 'knight', name: "Frog's Honor", reward: ['bolt', 'knight'] },
  { id: 'block', name: 'Block Party', reward: ['yeti', 'block'] },
  { id: 'puff', name: 'Soft Landing', reward: ['nova', 'puff'] },
  { id: 'runs', name: 'Dedicated', goal: { type: 'runs', v: 50 } },
  { id: 'secret', name: 'Up Up Down Down', goal: { type: 'secret' }, secret: true },
  { id: 'cheater', name: 'Cheater!', goal: { type: 'cheater' }, secret: true },
];
for (const a of ACHIEVEMENTS) {
  if (!a.reward) continue;
  const [cid, sid] = a.reward;
  a.goal = sid === 'glitch' ? GLITCH_SKIN.unlock : sid ? skinById(climberById(cid), sid).unlock : climberById(cid).unlock;
}
function rewardLabel(a) {
  if (!a.reward) return '';
  const [cid, sid] = a.reward;
  if (sid === 'glitch') return T('GLITCH skin for every climber');
  const c = climberById(cid);
  return sid ? T('{0} {1} skin', c.name, T(skinById(c, sid).name)) : T('{0} climber', c.name);
}
const earnedAchievements = live => new Set(ACHIEVEMENTS.filter(a => goalDone(a.goal, live)).map(a => a.id));
const achievementById = id => ACHIEVEMENTS.find(a => a.id === id);

const CHEATS = [
  { id: 'all', name: 'UNLOCK ALL', desc: 'Every climber, skin and starting floor' },
  { id: 'moon', name: 'MOON JUMP', desc: 'Jump 40% higher' },
  { id: 'turbo', name: 'TURBO SHOES', desc: 'Run 30% faster' },
  { id: 'slow', name: 'SLOW CLOCK', desc: 'The screen rises at half speed' },
  { id: 'endless', name: 'ENDLESS COMBO', desc: 'The combo bar never runs out' },
  { id: 'net', name: 'SAFETY NET', desc: 'Fall off the bottom, bounce back up' },
  { id: 'wrap', name: 'WRAPAROUND', desc: 'Run through a wall, out the other side' },
  { id: 'rainbow', name: 'RAINBOW TRAIL', desc: 'Leave a trail of confetti' },
  { id: 'tiny', name: 'TINY CLIMBER', desc: 'Half-size you, same hitbox' },
];
const cheatOn = id => !!(G.cheats && G.cheats[id]);

let state = 'menu';
let G, P;
const input = { left: false, right: false, jump: false, jumpBlocked: false, tap: 0, touchHold: false };

const STAGE_WIDTHS = { normal: UI_W, wide: 720, huge: 960 }, STAGE_MAX = 1280;
function wantedStageWidth(modeId) {
  if (modeId === 'sprint') return UI_W;
  if (settings.width === 'fit') {
    const aw = screenEl.clientWidth || innerWidth, ah = screenEl.clientHeight || innerHeight;
    return aw && ah ? clamp(Math.round(BASE_H * aw / ah / 8) * 8, UI_W, STAGE_MAX) : UI_W;
  }
  return STAGE_WIDTHS[settings.width] || UI_W;
}
// Wider stages give more room to run and fewer walls to rebound off, so hazards ramp up with the extra width.
// wideK(k) is 1 on a normal stage and grows by k for every extra stage-width of 480.
function wideK(k) { return 1 + k * (GW / UI_W - 1); }
function setStageWidth(w) {
  if (w === GW) return;
  GW = w;
  RIGHT = GW - WALL;
  for (const f of snow) f.x = Math.random() * GW;
  resize();
}

function newWorld(modeId, climberId, skinId, start = 0, menuWorld = false) {
  const mode = modeById(modeId);
  const climber = climberById(climberId);
  setStageWidth(menuWorld ? wantedStageWidth('classic') : wantedStageWidth(modeId));
  G = {
    mode, start, wide: GW > UI_W, lanes: laneCount(),
    seed: mode.seed != null ? mode.seed : (Math.random() * 4294967296) >>> 0,
    cache: new Map(),
    camY: -start * FLOOR_H - (H - 72),
    scrolling: false, clock: 0, level: 0, elapsed: 0,
    highest: start, comboPts: 0, bestCombo: 0,
    combo: { active: false, floors: 0, jumps: 0, timer: 0 },
    popups: [], banners: [], bannerY: 336, particles: [], rings: [], announce: null,
    shake: 0, frame: 0, overT: 0, clockShake: 0, clockFlip: 0, musicLevel: 0,
    countdown: 0, finished: false, finishT: 0, result: null, summitT: 0,
    bounces: 0, spins: 0, toasts: [], toasted: new Set(), earnedAtStart: new Set(),
    cheats: Object.assign({}, settings.cheats),
    events: [], eventT: 300, lastEvents: [], twists: 0, crumbling: null,
    rocks: [], rockT: 90, hearts: MAX_HEARTS, hits: 0, cleanFloor: 0,
    goblin: null, goblinT: 60 * 30 / wideK(0.35), kingDone: false, goblinsEscaped: 0, blocks: new Map(),
  };
  G.cheated = CHEATS.some(c => G.cheats[c.id]);
  P = {
    climber, skin: skinById(climber, skinId), ph: Object.assign({}, DEFAULT_PHYS, climber.phys),
    x: GW / 2, y: -start * FLOOR_H, vx: 0, vy: 0, onGround: true, floor: start, face: 1,
    angle: 0, spin: 0, run: 0, coyote: 0, teeter: 0, squash: 0, blink: 0,
    sway: { x: 0, y: 0, vx: 0, vy: 0 }, pose: null, idleT: 0, hurt: 0, inv: 0,
  };
  buildTo(start + 20);
  P.ledge = plat(start);
  if (G.cheats.turbo) { P.ph.maxVx *= 1.3; P.ph.accG *= 1.25; P.ph.accA *= 1.25; }
  if (G.cheats.moon) { P.ph.jumpBase *= 1.18; P.ph.jumpK *= 1.18; }
  P.basePh = Object.assign({}, P.ph);
  P.speedZone = -1;
  scalePhysics();
}
const hash = (n, k) => hashSeed(G.seed, n, k);
const score = () => (G.highest - G.start) * 10 + G.comboPts;

function comboPoints(floors) {
  if (floors <= 30) return floors * floors;
  if (floors <= 100) return 900 + (floors - 30) * 40;
  return 3700 + (floors - 100) * 15;
}

// Every floor has one ledge per lane. A normal stage has one lane. A wider stage carries several independent ledge chains
// side by side, each climbable like a whole normal tower, so there are real routes to choose between and more ledges
// within reach for combos. plat(n) is the floor's first ledge; plat(n).all lists every ledge on the floor.
const MAX_GAP = 130, LANE_W = 400, LANE_OVERLAP = 36, LANE_CLEAR = 28;
const laneCount = () => Math.max(1, Math.round((RIGHT - LEFT) / LANE_W));
function laneBand(c, k) {
  const bw = (RIGHT - LEFT) / k, ov = k > 1 ? LANE_OVERLAP : 0;
  return [Math.max(LEFT, LEFT + c * bw - ov), Math.min(RIGHT, LEFT + (c + 1) * bw + ov)];
}
// A point in [lo, hi], picked by t (0..1), that stays out of the ranges in avoid; null when nothing is left.
function pickClear(lo, hi, avoid, t) {
  let free = [[lo, hi]];
  for (const [a, b] of avoid) {
    const next = [];
    for (const [s, e] of free) {
      if (b <= s || a >= e) next.push([s, e]);
      else { if (a > s) next.push([s, a]); if (b < e) next.push([b, e]); }
    }
    free = next;
  }
  const total = free.reduce((sum, [s, e]) => sum + (e - s), 0);
  if (total <= 0) return null;
  let d = t * total;
  for (const [s, e] of free) { if (d <= e - s) return s + d; d -= e - s; }
  return free[free.length - 1][1];
}
function makeLedge(n, c, k, below, placed) {
  const base = 60 + 160 * Math.exp(-n / 1800), gap = Math.min(MAX_GAP, 75 + n * 0.025), arcade = themeOf(n).special === 'arcade';
  let w = Math.round(base * (0.8 + 0.4 * hash(n, 1 + 20 * c)));
  if (arcade) w = Math.max(64, Math.round(w / 16) * 16);
  const [bLo, bHi] = laneBand(c, k), t = hash(n, 2 + 20 * c);
  let lo = Math.max(bLo + 6, below.x1 - w - gap), hi = Math.min(bHi - 6 - w, below.x2 + gap), x1;
  if (k > 1 && hi < lo) { lo = bLo + 6; hi = Math.max(lo, bHi - 6 - w); }
  if (!placed.length) x1 = lo + t * (hi - lo);
  else {
    const avoid = placed.map(q => [q.x1 - w - LANE_CLEAR, q.x2 + LANE_CLEAR]);
    x1 = pickClear(lo, hi, avoid, t);
    if (x1 === null) x1 = pickClear(bLo + 6, Math.max(bLo + 6, bHi - 6 - w), avoid, t);
    if (x1 === null) x1 = Math.max(bLo + 6, bHi - 6 - w);
  }
  if (arcade) x1 = lo + Math.floor((x1 - lo) / 16) * 16;
  return { n, x1, x2: x1 + w, lane: c };
}
function plat(n) {
  let p = G.cache.get(n);
  if (p) return p;
  if (n > LAST_FLOOR) {
    p = { n, x1: 0, x2: -999, none: true, lane: 0 };
  } else if (n <= 0 || n % 100 === 0) {
    p = { n, x1: LEFT, x2: RIGHT, full: true, lane: 0 };
  } else {
    if (!G.cache.has(n - 1)) buildTo(n - 1);
    const below = plat(n - 1).all, out = [];
    for (let c = 0; c < G.lanes; c++) out.push(makeLedge(n, c, G.lanes, below[Math.min(c, below.length - 1)], out));
    p = out[0];
    p.all = out;
    G.cache.set(n, p);
    return p;
  }
  p.all = [p];
  G.cache.set(n, p);
  return p;
}
// The ledge on floor n whose span is closest to x.
function ledgeNear(n, x) {
  const all = plat(n).all;
  let best = all[0], bd = Infinity;
  for (const p of all) {
    const d = x < p.x1 ? p.x1 - x : x > p.x2 ? x - p.x2 : 0;
    if (d < bd) { bd = d; best = p; }
  }
  return best;
}
function buildTo(n) {
  let k = 1;
  while (k < n && G.cache.has(k)) k++;
  for (; k <= Math.min(n, LAST_FLOOR); k++) plat(k);
}

function burst(x, y, n, o) {
  if (LOW) n = Math.ceil(n / 3);
  for (let i = 0; i < n; i++) {
    const a = o.angle != null ? o.angle + (Math.random() - 0.5) * (o.spread || 1) : Math.random() * Math.PI * 2;
    const sp = (o.speed || 2) * (0.4 + Math.random() * 0.8);
    const life = (o.life || 30) * (0.7 + Math.random() * 0.6);
    G.particles.push({
      x, y, vx: Math.cos(a) * sp + (o.vx || 0), vy: Math.sin(a) * sp + (o.vy || 0),
      g: o.g != null ? o.g : 0.08, life, max: life, size: (o.size || 3) * (0.6 + Math.random() * 0.8),
      color: o.colors ? o.colors[(Math.random() * o.colors.length) | 0] : o.color, kind: o.kind || 'dot',
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
    });
  }
}

const SNOW_FILLS = ['rgba(235,245,255,0.3)', 'rgba(235,245,255,0.5)', 'rgba(235,245,255,0.7)'];
const snow = Array.from({ length: 70 }, () => ({
  x: Math.random() * GW, y: Math.random() * H, s: 0.6 + Math.random() * 1.8,
  v: 0.25 + Math.random() * 0.6, ph: Math.random() * 6, lv: (Math.random() * 3) | 0,
}));
let lastCamY = 0;

function beginRun(modeId, climberId, skinId, start = 0) {
  if (modeId === 'sprint') start = 0;
  newWorld(modeId, climberId, skinId, start);
  G.earnedAtStart = earnedAchievements();
  perfWatch.graceUntil = performance.now() + 2000;
  lastCamY = G.camY;
  state = 'play';
  input.jumpBlocked = input.jump;
  const m = G.mode.id;
  if (m === 'sprint') {
    G.countdown = 180;
    Sfx.beep(false);
  } else {
    if (m === 'chaos') G.banners.push({ text: T('CHAOS'), sub: T('a new twist every 14 seconds, and they stack'), t: 0, dur: 170, color: '#c77dff' });
    else if (m === 'rockfall') G.banners.push({ text: T('ROCKFALL'), sub: T("dodge what falls. Three hits and you're out"), t: 0, dur: 170, color: '#ff8a3d' });
    else if (G.cheated) G.banners.push({ text: T('CHEATS ON'), sub: T("this run won't count for scores or achievements"), t: 0, dur: 170, color: '#ff7fb7' });
    else if (start) G.banners.push({ text: T('FLOOR {0}', num(start)), sub: T(themeOf(start).name), t: 0, dur: 150, color: '#b6e37a' });
    else G.banners.push({ text: T('CLIMB!'), sub: T('reach floor 5 to start the clock'), t: 0, dur: 120, color: '#b6e37a' });
    Sfx.start();
  }
  if (GW > UI_W) G.banners.push({ text: T('WIDE LEVEL'), sub: T('more room, more trouble'), t: 0, dur: 150, color: '#4dd2ff' });
  const song0 = m === 'sprint' ? G.mode.song : (TIER_SONGS[themeOf(start).special] || G.mode.song);
  Sfx.music.play(song0);
  if (m !== 'sprint' && song0 === G.mode.song) Sfx.music.setKey(ZONE_KEYS[themeOf(start).zone]);
  canvas.focus({ preventScroll: true });
}

function endRun(won, reason) {
  if (G.combo.active) endCombo();
  const m = G.mode.id;
  const res = {
    mode: m, won, reason, score: score(), floor: G.highest, start: G.start, combo: G.bestCombo,
    time: G.elapsed, climber: P.climber.id, skin: P.skin.id, rank: 0, unlocked: [],
    title: reason === 'fall' && themeOf(P.floor).special === 'souls' ? 'THE EMBERS FADE'
      : reason === 'fall' && themeOf(P.floor).zone === 8 ? 'SIGNAL LOST' : reason === 'rocks' ? 'KNOCKED OUT!' : reason === 'king' ? 'THE GOBLIN KING GOT YOU!' : reason === 'demo' ? 'END OF THE DEMO' : null,
  };
  if (G.cheated) {
    stats.cheated = true;
  } else {
    stats.bestFloor = Math.max(stats.bestFloor, G.highest);
    stats.bestCombo = Math.max(stats.bestCombo, G.bestCombo);
    stats.runs = (stats.runs || 0) + 1;
    stats.totalFloors = (stats.totalFloors || 0) + G.highest - G.start;
    stats.bestBounces = Math.max(stats.bestBounces, G.bounces);
    stats.totalSpins += G.spins;
    stats.goblins += G.goblinsEscaped;
    stats.bestScore = Math.max(stats.bestScore, res.score);
    if (m === 'chaos') stats.chaosFloor = Math.max(stats.chaosFloor, G.highest);
    if (m === 'rockfall') {
      stats.rockFloor = Math.max(stats.rockFloor, G.highest);
      stats.rockClean = Math.max(stats.rockClean, G.hits ? G.cleanFloor : G.highest);
    }
    if (m === 'sprint' && won) stats.sprintBest = stats.sprintBest ? Math.min(stats.sprintBest, G.elapsed) : G.elapsed;
    if (reason === 'summit') stats.summit = true;
  }
  save('stats', stats);
  res.cheated = G.cheated;
  res.unlocked = [...earnedAchievements()].filter(id => !G.earnedAtStart.has(id)).map(id => {
    const a = achievementById(id), reward = rewardLabel(a);
    return reward ? T('{0}: {1}', T(a.name).toUpperCase(), reward.toUpperCase()) : T('ACHIEVEMENT: {0}', T(a.name).toUpperCase());
  });
  res.wide = G.wide;
  res.qualifies = !G.cheated && qualifies(m, res);
  G.result = res;
  G.overT = 0;
  Sfx.music.stop();
  haptic(won ? 'light' : 'heavy');
  if (!won) Sfx.over();
  else if (reason === 'summit') Sfx.music.play('lobby');
  if (res.unlocked.length) setTimeout(() => Sfx.unlock(), 900);
  if (res.qualifies) { state = 'name'; showNameBox(); }
  else state = 'over';
}

const better = (mode, a, b) => mode === 'sprint' ? a.time < b.time : a.score > b.score;
function qualifies(mode, res) {
  if (mode === 'sprint' ? !res.won : res.score <= 0) return false;
  const b = boardFor(mode, res.wide);
  return b.length < 5 || better(mode, res, b[b.length - 1]);
}
function saveScore(name) {
  const r = G.result, m = r.mode, b = boardFor(m, r.wide);
  const entry = m === 'sprint'
    ? { name, time: r.time, combo: r.combo, climber: r.climber }
    : { name, score: r.score, floor: r.floor, start: r.start, combo: r.combo, climber: r.climber };
  b.push(entry);
  b.sort((x, y) => m === 'sprint' ? x.time - y.time : y.score - x.score);
  if (b.length > 5) b.length = 5;
  r.rank = b.indexOf(entry) + 1;
  save('boards', boards);
}

function pauseGame() {
  if (state !== 'play') return;
  state = 'paused';
  Sfx.music.pause();
}
function resumeGame() {
  if (state !== 'paused') return;
  state = 'play';
  Sfx.music.resume();
}

function stepWorld() {
  G.frame++;
  if (state === 'paused' || state === 'name') return;
  if (state === 'play') updatePlay();
  else if (state === 'summit') updateSummit();
  else if (state === 'over') G.overT++;
  else if (state === 'menu' || state === 'lang' || state === 'scores' || state === 'goals' || state === 'privacy' || ((state === 'settings' || state === 'cheats') && settingsFrom === 'menu')) G.camY -= 0.35;

  if (P.blink > 0) P.blink--;
  else if (Math.random() < 0.006) P.blink = 8;
  if (state === 'play' || state === 'summit' || state === 'over') animateClimber();
  if (state === 'play' && G.frame % 30 === 0) prewarmNextTier();

  const dCam = G.camY - lastCamY;
  lastCamY = G.camY;
  const bl = tierBlend(), drift = particleStyle(TIERS[bl.lo]).speed * (1 - bl.t) + particleStyle(TIERS[bl.hi]).speed * bl.t;
  const gust = state === 'play' ? windPush() * 18 : 0;
  for (const f of snow) {
    f.y += f.v * f.s * drift - dCam * (0.35 + f.s * 0.15);
    f.x += Math.sin((G.frame + f.ph * 60) * 0.02) * 0.3 + gust * f.s;
    if (f.y > H + 4) { f.y -= H + 8; f.x = Math.random() * GW; }
    if (f.y < -4) { f.y += H + 8; f.x = Math.random() * GW; }
    if (f.x > GW + 4) f.x -= GW + 8;
    else if (f.x < -4) f.x += GW + 8;
  }
  for (const p of G.particles) {
    p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.98; p.rot += p.vr; p.life--;
    if (p.kind === 'ember') p.vx += Math.sin(p.rot * 3) * 0.06;
  }
  compact(G.particles, p => p.life > 0);
  for (const r of G.rings) r.t++;
  compact(G.rings, r => r.t < r.dur);
  for (const p of G.popups) { p.t++; p.y -= 0.7; }
  compact(G.popups, p => p.t < 50);
  for (const b of G.banners) b.t++;
  compact(G.banners, b => b.t < b.dur);
  if (G.announce && ++G.announce.t > G.announce.dur) G.announce = null;
  G.bannerY += ((G.announce && G.announce.y > 250 ? 434 : 336) - G.bannerY) * 0.15;
  if (G.toasts.length && state === 'play' && ++G.toasts[0].t > 200) G.toasts.shift();
  G.shake *= 0.88;
  if (G.shake < 0.3) G.shake = 0;
  if (G.clockShake > 0) G.clockShake--;
  if (G.clockFlip > 0) G.clockFlip--;
}

function updatePlay() {
  scalePhysics();
  const ph = P.ph, m = G.mode.id, px = P.x, py = P.y;
  if (P.hurt > 0) P.hurt--;
  if (P.inv > 0) P.inv--;

  if (G.countdown > 0) {
    G.countdown--;
    input.tap = 0;
    if (G.countdown > 0 && G.countdown % 60 === 0) Sfx.beep(false);
    if (G.countdown === 0) {
      Sfx.beep(true);
      G.banners.push({ text: T('GO!'), sub: '', t: 0, dur: 60, color: '#6bcb77' });
    }
    return;
  }
  if (!G.finished) G.elapsed++;

  let dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (chaosOn('mirror')) dir = -dir;
  const ice = chaosOn('ice') ? 0.4 : 1, turbo = chaosOn('turbo') ? 1.5 : 1, wind = windPush(), drift = wind * 12;
  if (dir) {
    P.face = dir;
    let acc = P.onGround ? ph.accG * ice : ph.accA;
    if (P.vx * dir < 0) acc = P.onGround ? ph.turnG * ice : ph.turnA * AIR_TURN;
    P.vx += dir * acc * (turbo > 1 ? 1.6 : 1);
  } else if (P.onGround) {
    P.vx = approach(P.vx, drift, ph.friction * (ice < 1 ? 0.06 : 1));
  } else {
    P.vx = approach(P.vx, drift, ph.accA * AIR_BRAKE);
  }
  if (wind) P.vx += wind * (P.onGround ? 0.7 : 1);
  P.vx = clamp(P.vx, -ph.maxVx * turbo + drift, ph.maxVx * turbo + drift);
  P.x += P.vx;
  if (P.onGround) P.x += ledgeCarry(P.ledge);

  if (cheatOn('wrap')) {
    if (P.x < LEFT) P.x += RIGHT - LEFT;
    else if (P.x > RIGHT) P.x -= RIGHT - LEFT;
  } else if (P.x - HALF_W < LEFT) { P.x = LEFT + HALF_W; bounceWall(-1); }
  else if (P.x + HALF_W > RIGHT) { P.x = RIGHT - HALF_W; bounceWall(1); }

  P.idleT = P.onGround && !dir && Math.abs(P.vx) < 0.5 ? P.idleT + 1 : 0;

  P.teeter = 0;
  if (P.onGround) {
    const p = P.ledge, sh = ledgeShift(p), x1 = p.x1 + sh, x2 = p.x2 + sh;
    if (P.x + FOOT < x1 || P.x - FOOT > x2 || brokenLedge(p)) {
      P.onGround = false; P.vy = 0; P.coyote = 5;
    } else {
      if (Math.abs(P.vx) < 0.8) P.teeter = P.x < x1 ? -1 : P.x > x2 ? 1 : 0;
      P.run += Math.abs(P.vx) * 0.085;
    }
  }

  const wantJump = (input.jump && !input.jumpBlocked) || input.touchHold || input.tap > 0;
  if (input.tap > 0) input.tap--;
  if (wantJump && (P.onGround || P.coyote > 0)) {
    input.tap = 0;
    const sp = Math.abs(P.vx);
    P.vy = -(ph.jumpBase + sp * ph.jumpK);
    P.onGround = false; P.coyote = 0;
    P.spin = sp >= ph.maxVx * 0.77 ? (Math.sign(P.vx) || P.face) : 0;
    if (P.spin) G.spins++;
    if (P.spin && Math.random() < 0.2) G.popups.push({ x: P.x, y: P.y - 70, text: T('WHEEE!'), t: 0 });
    P.angle = 0;
    P.squash = -0.7;
    Sfx.jump(sp / ph.maxVx);
    burst(P.x, P.y, 5, { angle: Math.PI / 2, spread: 2.4, speed: 1.4, g: -0.02, color: 'rgba(230,240,255,0.8)', size: 4, life: 20 });
  }
  if (P.coyote > 0) P.coyote--;

  if (!P.onGround) {
    P.vy = Math.min(P.vy + ph.gravity * (P.vy > 0 ? FALL_GRAVITY : 1) * (themeOf(P.floor).special === 'gravity' ? 1.2 : 1) * chaosGravity(), ph.maxFall * FALL_MAX);
    const prevY = P.y;
    P.y += P.vy;
    if (P.spin) {
      P.angle += P.spin * 0.21;
      if (Math.abs(P.angle) >= Math.PI * 2) { P.angle = 0; P.spin = 0; }
    }
    if (G.frame % 2 === 0) {
      if (G.combo.active) burst(P.x - P.vx * 1.5, P.y - 20, 1, { speed: 0.5, g: -0.035, colors: emberSet(comboLevel(G.combo.floors)), size: 3.4, life: 34, kind: 'ember' });
      if (cheatOn('rainbow')) burst(P.x, P.y - 24, 1, { speed: 0.4, g: 0, colors: CONFETTI, size: 3, life: 28, kind: 'spark' });
    }
    if (P.vy > 0) {
      const hi = Math.floor(-prevY / FLOOR_H + 1e-6);
      const lo = Math.max(0, Math.ceil(-P.y / FLOOR_H - 1e-6));
      for (let n = hi; n >= lo; n--) {
        const t = -n * FLOOR_H;
        if (prevY > t + 0.01 || P.y < t) continue;
        let hit = null;
        for (const p of plat(n).all) {
          const sh = ledgeShift(p);
          if (P.x + FOOT >= p.x1 + sh && P.x - FOOT <= p.x2 + sh && !brokenLedge(p)) { hit = p; break; }
        }
        if (hit) { land(n, hit); break; }
      }
      if (state !== 'play') return;
    }
  }
  P.squash *= 0.8;

  if (G.combo.active && !cheatOn('endless') && --G.combo.timer <= 0) endCombo();

  if (G.scrolling && !G.finished) {
    const ck = G.mode.clock, top = maxLevel();
    if (Math.floor((G.clock + STEP) / ck.every) > Math.floor(G.clock / ck.every)) G.clockFlip = 26;
    G.clock += STEP;
    if (m === 'sprint') {
      G.level = 2;
    } else {
      const prev = G.level;
      G.level = Math.min(1 + Math.floor(G.clock / ck.every), top);
      if (G.level > prev && prev > 0) {
        const max = G.level === top;
        G.banners.push({ text: max ? T('MAX SPEED!') : T('SPEED {0}!', G.level), sub: max ? T("it won't get any faster") : T('the tower rises faster'), t: 0, dur: 130, color: '#ff6b3d', flash: true });
        G.clockShake = 90;
        Sfx.hurry();
      }
    }
    const boost = ck.zoneBoost ? 1 + SPEED_PER_ZONE * themeOf(P.floor).zone : 1;
    G.camY -= ck.speeds[G.level] * boost * wideK(0.12) * (cheatOn('slow') ? 0.5 : 1) * (1 + 0.6 * eventStrength('rush'));
  }
  const ml = m === 'sprint' ? Math.min(5, Math.floor(G.highest / 20)) : G.level + (G.goblin && !G.goblin.leaving ? 2 : 0);
  if (ml !== G.musicLevel) { G.musicLevel = ml; Sfx.music.setLevel(ml); }

  if (!G.over9000 && m !== 'sprint' && score() > 9000) {
    G.over9000 = true;
    G.banners.push({ text: T('NINE THOUSAND!'), sub: '', t: 0, dur: 140, color: '#ffb547' });
    Sfx.milestone();
  }

  if (m !== 'sprint') collideBlocks(px, py);
  if (m === 'chaos') updateChaos();
  else if (m === 'rockfall') { updateRocks(); if (state !== 'play') return; }
  updateGoblin();
  if (state !== 'play') return;

  const sy = P.y - G.camY;
  if (sy < 210) G.camY += (sy - 210) * 0.16;

  if (G.finished) {
    if (++G.finishT >= 110) endRun(true, 'finish');
  } else if (P.y - G.camY > H + 60) {
    if (cheatOn('net')) {
      P.y = G.camY + H + 40; P.vy = -24; P.onGround = false; P.coyote = 0; P.spin = P.face;
      Sfx.bounce();
      burst(P.x, G.camY + H - 10, 20, { angle: -Math.PI / 2, spread: 1.2, speed: 5, g: 0.1, colors: CONFETTI, size: 4, life: 40, kind: 'spark' });
    } else endRun(false, 'fall');
  }
}

function syncMusic(n) {
  if (G.mode.id === 'sprint') return;
  const t = themeOf(n), want = TIER_SONGS[t.special] || G.mode.song;
  if (Sfx.music.current !== want) Sfx.music.play(want, true, 3);
  if (want === G.mode.song) Sfx.music.setKey(ZONE_KEYS[t.zone]);
}

function checkAchievements() {
  if (G.cheated || state !== 'play') return;
  const live = { floor: G.highest, combo: G.bestCombo, score: score(), bounces: G.bounces, mode: G.mode.id, hits: G.hits, goblins: G.goblinsEscaped };
  for (const a of ACHIEVEMENTS) {
    if (G.earnedAtStart.has(a.id) || G.toasted.has(a.id) || !goalDone(a.goal, live)) continue;
    G.toasted.add(a.id);
    G.toasts.push({ name: T(a.name), reward: rewardLabel(a), t: 0 });
    Sfx.unlock();
  }
}

function bounceWall(side) {
  const sp = Math.abs(P.vx);
  P.vx = -P.vx * (P.onGround ? 0.5 : 1);
  if (!P.onGround && sp > 3) {
    G.bounces++;
    checkAchievements();
    Sfx.bounce();
    burst(side < 0 ? LEFT : RIGHT, P.y - 26, 8, { angle: side < 0 ? 0 : Math.PI, spread: 1.6, speed: 3, g: 0.05, colors: ['#ffd93d', '#fff'], size: 3, life: 18, kind: 'spark' });
  }
}

function land(n, ledge) {
  const diff = n - P.floor, impact = P.vy;
  P.ledge = ledge;
  P.y = -n * FLOOR_H;
  P.vy = 0;
  P.onGround = true;
  P.angle = 0; P.spin = 0;
  P.squash = 1;
  P.floor = n;
  Sfx.land();
  burst(P.x, P.y, 7, { angle: -Math.PI / 2, spread: 2.6, speed: 1.6, g: 0.06, color: themeOf(n).top, size: 3.5, life: 22 });
  if (impact > 9) {
    if (P.climber.id === 'bolt') burst(P.x, P.y - 2, 9, { angle: -Math.PI / 2, spread: 2.6, speed: 2.6, g: 0.18, colors: [paletteFor(P.climber, P.skin).pad, '#ffffff'], size: 3, life: 20 });
    if (P.climber.id === 'yeti') { G.shake = Math.max(G.shake, 4); burst(P.x, P.y, 12, { angle: -Math.PI / 2, spread: 3, speed: 2.2, g: 0.05, color: 'rgba(170,170,180,0.65)', size: 5, life: 26 }); }
    if (P.climber.id === 'nova') burst(P.x, P.y - 4, 6, { angle: -Math.PI / 2, spread: 3, speed: 1.4, g: -0.01, color: 'rgba(200,180,240,0.6)', size: 2.4, life: 26 });
  }

  if (diff >= 2) {
    if (G.combo.active) { G.combo.floors += diff; G.combo.jumps++; }
    else G.combo = { active: true, floors: diff, jumps: 1, timer: 0 };
    G.combo.timer = COMBO_TIME;
    G.popups.push({ x: P.x, y: P.y - 60, text: `+${diff}`, t: 0, combo: true });
    if (G.combo.jumps > 1) burst(P.x, P.y - 4, 6, { angle: -Math.PI / 2, spread: 2.4, speed: 1.9, g: -0.02, colors: emberSet(comboLevel(G.combo.floors)), size: 3, life: 26, kind: 'ember' });
    Sfx.step(Math.min(G.combo.jumps, 10));
  } else if (G.combo.active) {
    endCombo();
  }

  if (n > G.highest) {
    const old = G.highest;
    G.highest = n;
    if (G.mode.id === 'rockfall' && tierIndex(n) > tierIndex(old) && G.hearts < MAX_HEARTS) {
      G.hearts++;
      G.popups.push({ x: P.x, y: P.y - 84, text: T('+1 HEART'), t: 0 });
    }
    checkAchievements();
    if (!G.scrolling && n >= G.start + 5) { G.scrolling = true; G.level = G.mode.id === 'sprint' ? 2 : 1; }
    if (G.mode.id === 'sprint' && n >= SPRINT_GOAL) {
      G.finished = true;
      G.banners.push({ text: T('FINISH!'), sub: formatTime(G.elapsed), t: 0, dur: 200, color: '#6bcb77' });
      burst(GW / 2, P.y - 140, 90, { speed: 6, g: 0.12, colors: CONFETTI, size: 4, life: 90, kind: 'spark' });
      G.shake = 8;
      Sfx.music.stop();
      Sfx.finish();
    } else if (DEMO && n >= DEMO_TOP) {
      endRun(true, 'demo');
    } else if (n >= TOP_FLOOR) {
      startSummit();
    } else if (tierIndex(n) > tierIndex(old)) {
      const t = themeOf(n);
      if (t.special && TIER_QUIPS[t.special]) {
        G.banners.push({ text: T(t.name), sub: T(TIER_QUIPS[t.special]), t: 0, dur: 220, color: '#ffb547' });
        burst(GW / 2, P.y - 120, 50, { speed: 4.4, g: -0.02, colors: EMBERS[0], size: 4, life: 70, kind: 'ember' });
      } else if (t.index % 10 === 0) {
        G.banners.push({ text: T('ZONE {0}', t.zone + 1), sub: T(ZONES[t.zone].name), t: 0, dur: 200, color: '#ffd93d' });
        burst(GW / 2, P.y - 120, 64, { speed: 5, g: -0.02, colors: EMBERS[2], size: 4, life: 70, kind: 'ember' });
      } else {
        G.banners.push({ text: T('FLOOR {0}', num(t.index * TIER_FLOORS)), sub: T(t.name), t: 0, dur: 150, color: '#b6e37a' });
        burst(GW / 2, P.y - 120, 36, { speed: 4.2, g: -0.02, colors: EMBERS[0], size: 3.6, life: 60, kind: 'ember' });
      }
      Sfx.milestone();
      syncMusic(n);
    }
  }
  if (G.mode.id === 'chaos') chaosLand();
}

function startSummit() {
  if (G.goblin) G.goblin.leaving = true;
  if (G.combo.active) endCombo();
  state = 'summit';
  G.summitT = 0;
  G.scrolling = false;
  G.banners.length = 0;
  Sfx.finish();
  Sfx.music.play('gommage', true, 2.5);
  haptic('heavy');
}

const SUMMIT_REVEAL = 250, SUMMIT_DONE = 400;
function updateSummit() {
  const t = ++G.summitT;
  const groundY = -TOP_FLOOR * FLOOR_H;
  if (P.onGround) {
    const dx = GW / 2 - P.x;
    P.vx = Math.abs(dx) > 3 ? Math.sign(dx) * Math.min(4, Math.abs(dx) * 0.06 + 1) : 0;
    P.x += P.vx;
    if (P.vx) { P.face = Math.sign(P.vx); P.run += Math.abs(P.vx) * 0.085; }
    if (!P.vx && t > 60 && t % 46 === 0) {
      P.vy = -7.5; P.onGround = false;
      P.face = (t / 46) % 2 ? 1 : -1;
      Sfx.jump(0.3);
    }
  } else {
    P.vy += 0.5;
    P.y += P.vy;
    if (P.y >= groundY) { P.y = groundY; P.vy = 0; P.onGround = true; P.squash = 1; }
  }
  P.squash *= 0.8;
  P.angle = 0; P.spin = 0;
  G.camY += (groundY - H * 0.76 - G.camY) * 0.05;
  if (t > 40 && t % 18 === 0) {
    const fx = 80 + hash(t, 61) * (GW - 160), fy = G.camY + 70 + hash(t, 62) * H * 0.3;
    burst(fx, fy, 46, { speed: 4.2, g: 0.05, colors: [CONFETTI[(t / 18) % 6 | 0], '#ffffff'], size: 3.5, life: 70, kind: 'spark' });
    Sfx.firework();
  }
  if (t === SUMMIT_REVEAL) { Sfx.unlock(); G.shake = 6; haptic('heavy'); }
}
function finishSummit() {
  if (state === 'summit' && G.summitT > SUMMIT_DONE) endRun(true, 'summit');
}

function comboLevel(floors) {
  let level = 0;
  for (let i = 0; i < COMBO_WORDS.length; i++) if (floors >= COMBO_WORDS[i][0]) level = i;
  return level;
}
function endCombo() {
  const c = G.combo;
  if (c.active && c.jumps >= 2) {
    const pts = comboPoints(c.floors), level = comboLevel(c.floors), pal = emberSet(level);
    G.comboPts += pts;
    G.bestCombo = Math.max(G.bestCombo, c.floors);
    G.announce = { word: T(COMBO_WORDS[level][1]), pts, floors: c.floors, level, t: 0, dur: 120, pal, y: P.y - G.camY < 270 ? 318 : 172 };
    checkAchievements();
    G.shake = Math.min(14, 3 + level * 1.4);
    Sfx.combo(level);
    haptic(level >= 4 ? 'heavy' : 'light');
    burst(P.x, P.y - 30, 16 + level * 5, { speed: 2.6 + level * 0.35, g: -0.03, colors: pal, size: 4, life: 56, kind: 'ember' });
    G.rings.push({ x: P.x, y: P.y - 30, t: 0, dur: 30, r: 80 + level * 14, color: pal[1] });
  }
  G.combo = { active: false, floors: 0, jumps: 0, timer: 0 };
}

const windowCache = new Map();
const WIN_W = 86, WIN_H = 136;
function windowArt(k, sky, skyKey) {
  const key = `${devicePx()}|${k}|${skyKey}`;
  let art = windowCache.get(key);
  if (spriteLive(art)) return art;
  trim(windowCache, 24);
  const starCount = 4 + Math.min(14, skyKey * 8 / 30 | 0);
  art = makeSprite(DYN, WIN_W, WIN_H, () => {
    const x = WIN_W / 2, y = 4, ww = 70, wh = 116, r = ww / 2;
    ctx.beginPath();
    ctx.moveTo(x - r, y + wh);
    ctx.lineTo(x - r, y + r);
    ctx.arc(x, y + r, r, Math.PI, 0);
    ctx.lineTo(x + r, y + wh);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, y, 0, y + wh);
    g.addColorStop(0, rgba(sky.top));
    g.addColorStop(1, rgba(mixRgb(sky.top, sky.bot, 0.7)));
    ctx.fillStyle = g;
    ctx.fill();
    ctx.save();
    ctx.clip();
    if (k % 5 === 2) {
      circ(x + 12, y + 34, 13, 'rgba(255,250,225,0.95)');
      circ(x + 18, y + 30, 11, rgba(sky.top));
    }
    for (let s = 0; s < starCount; s++) {
      ctx.fillStyle = `rgba(255,255,255,${0.4 + hash(k * 31 + s, 43) * 0.5})`;
      ctx.fillRect(x - r + hash(k * 31 + s, 41) * ww, y + hash(k * 31 + s, 42) * wh, 1.6, 1.6);
    }
    ctx.restore();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#3a4266';
    ctx.stroke();
    ctx.strokeStyle = '#262c48';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + 4); ctx.lineTo(x, y + wh);
    ctx.moveTo(x - r, y + 62); ctx.lineTo(x + r, y + 62);
    ctx.stroke();
    ctx.fillStyle = '#4a547f';
    ctx.fillRect(x - r - 8, y + wh, ww + 16, 8);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x - r - 8, y + wh + 8, ww + 16, 4);
  });
  windowCache.set(key, art);
  return art;
}

let edgeShade = null;
const edgeWidth = () => Math.min(GW * 0.18, UI_W * 0.18);
function edgeShading() {
  const k = devicePx(), w = edgeWidth();
  if (!edgeShade || edgeShade.k !== k || edgeShade.w !== w) {
    const strip = left => drawInto(makeLayer(w, 4), () => {
      const g = ctx.createLinearGradient(left ? 0 : w, 0, left ? w : 0, 0);
      g.addColorStop(0, 'rgba(0,0,0,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, 4);
    });
    edgeShade = { k, w, l: strip(true), r: strip(false) };
  }
  return edgeShade;
}

function skyAt(f) {
  for (let i = 0; i < SKY.length - 1; i++) {
    const a = SKY[i], b = SKY[i + 1];
    if (f <= b.f) {
      const t = clamp((f - a.f) / (b.f - a.f), 0, 1);
      return { top: mixRgb(a.topC, b.topC, t), bot: mixRgb(a.botC, b.botC, t) };
    }
  }
  const l = SKY[SKY.length - 1];
  return { top: l.topC, bot: l.botC };
}

function drawWorld() {
  ctx.save();
  if (G.shake && settings.shake) {
    ctx.fillStyle = NAVY;
    ctx.fillRect(0, 0, GW, H);
    ctx.translate((Math.random() - 0.5) * G.shake, (Math.random() - 0.5) * G.shake);
    const tilt = eventStrength('quake') * Math.sin(G.frame * 0.19) * 0.014;
    if (tilt) { ctx.translate(GW / 2, H / 2); ctx.rotate(tilt); ctx.translate(-GW / 2, -H / 2); }
  }
  drawBackground();
  drawSnow();
  drawPlatforms();
  if (G.rocks.length) drawRocks();
  drawParticles();
  if (G.rings.length) drawRings();
  if (state !== 'menu' && state !== 'lang' && state !== 'scores' && state !== 'privacy' && state !== 'goals' && !((state === 'settings' || state === 'cheats') && settingsFrom === 'menu')) drawPlayer();
  if (G.goblin) drawGoblin();
  drawBlackout();
  drawWalls();
  drawPopups();
  ctx.restore();
}

const blendNow = { lo: 0, hi: 0, t: 0 };
function tierBlend() {
  const f = -(G.camY + H / 2) / FLOOR_H, k = Math.round(f / TIER_FLOORS), b = blendNow;
  if (k >= 1 && k < TIERS.length && Math.abs(f - k * TIER_FLOORS) < SCENE_FADE) {
    const t = (f - k * TIER_FLOORS) / (2 * SCENE_FADE) + 0.5;
    b.lo = k - 1; b.hi = k; b.t = t * t * (3 - 2 * t);
  } else { b.lo = b.hi = tierIndex(f); b.t = 0; }
  return b;
}

function drawBackdrops() {
  const b = tierBlend();
  drawTierBackdrop(b.lo, 1);
  if (b.t > 0) drawTierBackdrop(b.hi, b.t);
}
function drawBackground() {
  drawBackdrops();
  if (LOW) return;

  const shade = edgeShading(), w = edgeWidth();
  ctx.drawImage(shade.l.c, 0, 0, w, H);
  ctx.drawImage(shade.r.c, GW - w, 0, w, H);
}
// The brick-wall zones draw their windows, torches and banners in a 480-wide design. On a wider stage that design repeats side
// by side (not mirrored), centred on the middle of the stage, so the decorations fill the whole width.
function forEachColumn(fn) {
  const real = GW;
  if (real <= UI_W) { fn(); return; }
  const half = (real - UI_W) / 2;
  GW = UI_W;
  try {
    for (let ox = half - Math.ceil(half / UI_W) * UI_W; ox < real; ox += UI_W) {
      ctx.save();
      ctx.translate(ox, 0);
      fn();
      ctx.restore();
    }
  } finally { GW = real; }
}

function drawWindows(bgCam) {
  const camFloor = -G.camY / FLOOR_H;
  const sky = skyAt(camFloor);
  const skyKey = Math.max(0, Math.floor(camFloor / 8));
  const kMin = Math.ceil((90 - bgCam - H) / 320), kMax = Math.floor((260 - bgCam) / 320);
  for (let k = kMin; k <= kMax; k++) {
    const y = 100 - 320 * k - bgCam;
    const x = (k & 1 ? 318 : 130) + (hash(k, 40) - 0.5) * 40;
    const art = windowArt(k, sky, skyKey);
    forEachColumn(() => blit(art, x - WIN_W / 2, y - 4));
  }
}

function drawSnow() {
  const b = tierBlend();
  drawFlakes(particleStyle(TIERS[b.lo]), 1 - b.t);
  if (b.t > 0) drawFlakes(particleStyle(TIERS[b.hi]), b.t);
}
function drawFlakes(st, a) {
  if (a <= 0.01) return;
  ctx.globalAlpha = a;
  for (let lv = LOW ? 2 : 0; lv < 3; lv++) {
    if (st.shape === 'streak') {
      ctx.strokeStyle = st.fills[lv]; ctx.lineWidth = 1;
      ctx.beginPath();
      for (const f of snow) if (f.lv === lv) { ctx.moveTo(f.x, f.y); ctx.lineTo(f.x - 2, f.y - 8 - f.s * 4); }
      ctx.stroke();
      continue;
    }
    ctx.fillStyle = st.fills[lv];
    if (st.shape === 'square') {
      for (const f of snow) if (f.lv === lv) ctx.fillRect(f.x - f.s, f.y - f.s, f.s * 2, f.s * 2);
      continue;
    }
    ctx.beginPath();
    for (const f of snow) {
      if (f.lv !== lv) continue;
      ctx.moveTo(f.x + f.s, f.y);
      ctx.arc(f.x, f.y, f.s, 0, Math.PI * 2);
    }
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawPlatforms() {
  const nTop = Math.ceil(-G.camY / FLOOR_H) + 1;
  const nBot = Math.max(0, Math.floor(-(G.camY + H) / FLOOR_H) - 1);
  for (let n = nBot; n <= nTop; n++) {
    const sy = -n * FLOOR_H - G.camY;
    if (n === 0) drawGround(sy);
    else if (n <= LAST_FLOOR) for (const p of plat(n).all) drawPlatform(p, sy);
  }
  if (G.mode.id !== 'sprint') for (let n = nBot; n <= nTop; n++) { const b = blockAt(n); if (b) drawBlock(b, b.y1 - G.camY); }
  for (let n = Math.max(1, nBot - 6); n < nBot; n++) {
    const p = G.cache.get(n);
    if (p) for (const q of p.all) q.art = null;
  }
}

const PLAT_PAD = 6;
function drawPlatform(p, sy) {
  const th = themeOf(p.n);
  if (!spriteLive(p.art)) {
    p.art = makeSprite(DYN, p.x2 - p.x1 + PLAT_PAD * 2 + 4, PLAT_PAD + 64, () => {
      ctx.translate(PLAT_PAD - p.x1, PLAT_PAD);
      drawPlatformArt(p, 0);
    });
  }
  if (brokenLedge(p)) return;
  const sh = ledgeShift(p), jx = (p.crumbleAt ? Math.sin(G.frame * 1.9) * 1.6 : 0) + sh;
  blit(p.art, p.x1 - PLAT_PAD + jx, sy - PLAT_PAD);
  if (G.events.length) chaosLedge(p, sy, sh);
  const goal = G.mode.id === 'sprint' && p.n === SPRINT_GOAL;
  if (p.n === TOP_FLOOR) drawSummitFlag(sy);
  if (p.n % 100 === 0 && FLOOR_PROPS[th.special]) FLOOR_PROPS[th.special](sy);
  if (th.special === 'souls') drawSoulNote(p, sy);
  if (!LOW && (th.kind === 'shine' || th.kind === 'ice' || th.kind === 'crystal') && !goal && p.n !== TOP_FLOOR) {
    const w = p.x2 - p.x1, x1 = p.x1 + sh;
    const gx = x1 + ((G.frame * 1.5 + p.n * 37) % (w + 80)) - 40;
    if (gx > x1 + 2 && gx + 20 < x1 + w) {
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.beginPath(); ctx.moveTo(gx, sy + 16); ctx.lineTo(gx + 8, sy + 16); ctx.lineTo(gx + 18, sy); ctx.lineTo(gx + 10, sy); ctx.fill();
    }
  }
}

function drawGround(sy) {
  const th = TIERS[0];
  ctx.fillStyle = '#2a3048';
  ctx.fillRect(LEFT, sy, RIGHT - LEFT, H - sy + 20);
  ctx.fillStyle = '#353c5a';
  for (let row = 0; row < 8; row++) {
    const y = sy + 18 + row * 22;
    if (y > H) break;
    for (let x = LEFT + (row % 2 ? 0 : 24) - 48; x < RIGHT; x += 48) ctx.fillRect(Math.max(LEFT, x + 2), y, Math.min(44, RIGHT - x - 2), 19);
  }
  ctx.fillStyle = th.body; ctx.fillRect(LEFT, sy, RIGHT - LEFT, 16);
  ctx.fillStyle = th.top; ctx.fillRect(LEFT, sy, RIGHT - LEFT, 5);
  ctx.fillStyle = th.edge; ctx.fillRect(LEFT, sy + 13, RIGHT - LEFT, 3);
}

function drawPlatformArt(p, sy) {
  const th = themeOf(p.n);
  const x = p.x1, w = p.x2 - p.x1, h = 16, n = p.n, v = th.variant;
  const goal = G.mode.id === 'sprint' && n === SPRINT_GOAL;
  const summit = n === TOP_FLOOR;
  const r = (k, i) => hash(n * 13 + (p.lane || 0) * 977 + (i || 0), k);

  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  rr(x + 4, sy + 6, w - 4, h, 7); ctx.fill();

  if (goal) {
    ctx.save();
    rr(x, sy, w, h, 4); ctx.clip();
    for (let i = 0; i * 8 < w; i++) for (let j = 0; j < 2; j++) {
      ctx.fillStyle = (i + j) % 2 ? '#1b1f33' : '#ffffff';
      ctx.fillRect(x + i * 8, sy + j * 8, 8, 8);
    }
    ctx.restore();
  } else if (summit) {
    const g = ctx.createLinearGradient(0, sy, 0, sy + h);
    g.addColorStop(0, '#fff6c2'); g.addColorStop(0.35, '#f2c230'); g.addColorStop(1, '#a2760d');
    ctx.fillStyle = g; rr(x, sy, w, h, 6); ctx.fill();
    for (let bx = x + 20; bx < x + w - 10; bx += 34) drawStarShape(bx, sy + 9, 4, '#fff6c2');
  } else if (th.special === 'prism') {
    ctx.save(); rr(x, sy, w, h, 7); ctx.clip();
    ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(x, sy + i * 4, w, 4); });
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; rr(x, sy, w, 4, 3); ctx.fill();
  } else if (th.special === 'glitch') {
    ctx.fillStyle = '#16121f'; rr(x, sy, w, h, 4); ctx.fill();
    ctx.save(); rr(x, sy, w, h, 4); ctx.clip();
    for (let i = 0; i < w / 6; i++) {
      ctx.fillStyle = GLITCH_COLORS[(r(5, i) * 5) | 0];
      ctx.fillRect(x + r(6, i) * w, sy + ((r(7, i) * 4) | 0) * 4, 4 + r(8, i) * 14, 4);
    }
    ctx.restore();
    ctx.fillStyle = '#6fd0b8'; ctx.fillRect(x + 2, sy, w - 4, 2);
  } else if (SPECIAL_PLATFORMS[th.special]) {
    SPECIAL_PLATFORMS[th.special](x, sy, w, h, th, r);
  } else if (th.special === 'souls') {
    ctx.fillStyle = '#34302d'; rr(x, sy, w, h, 4); ctx.fill();
    ctx.fillStyle = '#4e4843'; rr(x, sy, w, 4, 3); ctx.fill();
    ctx.save();
    ctx.shadowColor = '#ff6a1a'; ctx.shadowBlur = 6;
    ctx.strokeStyle = '#ff8a3d'; ctx.lineWidth = 1.2;
    for (let i = 0; i < w / 40; i++) {
      const cx = x + 8 + r(30, i) * (w - 20);
      ctx.beginPath(); ctx.moveTo(cx, sy + 4); ctx.lineTo(cx + (r(32, i) - 0.5) * 9, sy + 8); ctx.lineTo(cx + (r(33, i) - 0.5) * 12, sy + 11); ctx.lineTo(cx + (r(34, i) - 0.5) * 6, sy + 13); ctx.stroke();
    }
    ctx.restore();
  } else if (th.special === 'witcher') {
    ctx.fillStyle = th.body; rr(x, sy, w, h, 6); ctx.fill();
    ctx.fillStyle = th.top; rr(x, sy, w, 5, 4); ctx.fill();
    ctx.fillStyle = 'rgba(40,20,10,0.45)';
    for (let bx = x + 28; bx < x + w - 8; bx += 32) ctx.fillRect(bx, sy + 3, 2, h - 6);
    const cx = x + 14 + r(31) * (w - 40);
    for (let i = 0; i < 3; i++) limb(cx + i * 4, sy + 3, cx + i * 4 + 7, sy + 13, 1.4, 'rgba(25,12,6,0.75)');
    circ(x + 6, sy + 8, 1.8, '#c9ced8'); circ(x + w - 6, sy + 8, 1.8, '#c9ced8');
  } else if (th.special === 'gravity') {
    ctx.fillStyle = '#e8ecf2'; rr(x, sy, w, h, 3); ctx.fill();
    ctx.fillStyle = '#c3cad6';
    for (let bx = x + 16; bx < x + w - 2; bx += 16) ctx.fillRect(bx, sy, 1, h);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 2, sy, w - 4, 3);
    ctx.fillStyle = '#ff8a3d'; ctx.fillRect(x + 2, sy + h - 4, w - 4, 3);
  } else if (th.special === 'lumiere') {
    ctx.fillStyle = '#f3e6c8'; rr(x, sy, w, h, 7); ctx.fill();
    ctx.fillStyle = '#2f6f6a'; ctx.fillRect(x + 4, sy + h - 3, w - 8, 3);
    ctx.fillStyle = '#d9b25a'; rr(x, sy, w, 4, 3); ctx.fill();
    ctx.strokeStyle = '#c39a3f'; ctx.lineWidth = 1;
    for (let bx = x + 12; bx < x + w - 10; bx += 22) {
      ctx.beginPath(); ctx.arc(bx, sy + 9, 3.5, Math.PI * 0.2, Math.PI * 1.6); ctx.stroke();
      ctx.beginPath(); ctx.arc(bx + 8, sy + 9, 3.5, Math.PI * 1.2, Math.PI * 2.6); ctx.stroke();
    }
  } else if (th.special === 'monolith') {
    ctx.fillStyle = '#6f6879'; rr(x, sy, w, h, 3); ctx.fill();
    ctx.fillStyle = '#9a93a6'; rr(x, sy, w, 4, 2); ctx.fill();
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(216,164,58,0.9)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x + 6, sy + 4); ctx.bezierCurveTo(x + w * 0.3, sy + 1, x + w * 0.6, sy + 7, x + w - 8, sy + 3); ctx.stroke();
    ctx.strokeStyle = 'rgba(120,190,200,0.85)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(x + 10, sy + 10); ctx.bezierCurveTo(x + w * 0.4, sy + 13, x + w * 0.7, sy + 8, x + w - 12, sy + 11); ctx.stroke();
  } else if (th.special === 'arcade') {
    ctx.fillStyle = '#1a1f5a'; ctx.fillRect(x, sy, w, h);
    ctx.fillStyle = '#4d96ff'; ctx.fillRect(x, sy, w, 2); ctx.fillRect(x, sy + h - 2, w, 2);
    for (let bx = x + 6; bx < x + w - 10; bx += 14) {
      ctx.fillStyle = '#ffd93d'; ctx.fillRect(bx + 2, sy + 3, 6, 10); ctx.fillRect(bx, sy + 5, 10, 6);
      ctx.fillStyle = '#c99a00'; ctx.fillRect(bx + 4, sy + 5, 2, 6);
    }
  } else if (th.kind === 'cloud') {
    const puff = v === 1 ? 10 : 7;
    ctx.fillStyle = th.edge;
    rr(x, sy + 4, w, h - 2, 8); ctx.fill();
    ctx.fillStyle = th.body;
    rr(x, sy + 1, w, h - 5, 8); ctx.fill();
    ctx.fillStyle = th.top;
    for (let bx = x + 10, i = 0; bx < x + w - 6; bx += 16, i++) {
      ctx.beginPath(); ctx.arc(bx, sy + 3, puff + r(9, i) * 3, Math.PI, 0); ctx.fill();
    }
    if (v === 2) for (let i = 0; i < w / 30; i++) circ(x + 8 + r(10, i) * (w - 16), sy - 4 - r(11, i) * 6, 1.2, '#ffffff');
  } else if (th.kind === 'neon') {
    ctx.fillStyle = th.body; rr(x, sy, w, h, 5); ctx.fill();
    ctx.save();
    ctx.shadowColor = th.glow; ctx.shadowBlur = 8;
    ctx.strokeStyle = th.glow; ctx.lineWidth = 2;
    rr(x + 1, sy + 1, w - 2, h - 2, 5); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = th.glow; ctx.lineWidth = 1;
    if (v === 1) { ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(x + 6, sy + 8); ctx.lineTo(x + w - 6, sy + 8); ctx.stroke(); ctx.setLineDash([]); }
    if (v === 2) { ctx.globalAlpha = 0.5; for (let bx = x + 12; bx < x + w - 6; bx += 12) { ctx.beginPath(); ctx.moveTo(bx, sy + 3); ctx.lineTo(bx, sy + h - 3); ctx.stroke(); } ctx.globalAlpha = 1; }
  } else if (th.kind === 'cosmic') {
    ctx.fillStyle = th.body; rr(x, sy, w, h, 7); ctx.fill();
    for (let i = 0; i < w / 9; i++) circ(x + 4 + r(12, i) * (w - 8), sy + 3 + r(13, i) * (h - 6), 0.6 + r(14, i) * 0.9, 'rgba(255,255,255,0.9)');
    const g = ctx.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, th.top); g.addColorStop(0.5, '#ffffff'); g.addColorStop(1, th.top);
    ctx.fillStyle = g; rr(x, sy, w, 3, 2); ctx.fill();
    if (v === 1) { circ(x + w - 14, sy + 8, 3, th.top); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x + w - 14, sy + 8, 6, 2, -0.3, 0, Math.PI * 2); ctx.stroke(); }
    if (v === 2) { const cx = x + 10 + r(15) * (w - 40); ctx.fillStyle = 'rgba(255,255,255,0.7)'; tri(cx, sy + 7, cx + 22, sy + 5, cx + 22, sy + 9, 'rgba(255,255,255,0.35)'); circ(cx, sy + 7, 2, '#ffffff'); }
  } else {
    ctx.fillStyle = th.body;
    rr(x, sy, w, h, 7); ctx.fill();
    ctx.save(); rr(x, sy, w, h, 7); ctx.clip();
    ctx.fillStyle = th.edge;
    ctx.fillRect(x, sy + h - 4, w, 4);

    if (th.kind === 'stone') {
      ctx.fillStyle = 'rgba(30,30,40,0.35)';
      for (let i = 1, bx = x + 22 + r(3) * 10; bx < x + w - 6; bx += 24 + r(4, i++) * 10) ctx.fillRect(bx, sy + 5, 2, h - 9);
      if (v === 1) {
        ctx.strokeStyle = 'rgba(20,20,30,0.5)'; ctx.lineWidth = 1;
        const cx = x + 10 + r(16) * (w - 30);
        ctx.beginPath(); ctx.moveTo(cx, sy + 4); ctx.lineTo(cx + 4, sy + 8); ctx.lineTo(cx + 2, sy + 11); ctx.lineTo(cx + 7, sy + 14); ctx.stroke();
      }
    } else if (th.kind === 'wood') {
      ctx.fillStyle = 'rgba(40,20,10,0.45)';
      for (let bx = x + 30; bx < x + w - 8; bx += 34) ctx.fillRect(bx, sy + 3, 2, h - 6);
      ctx.fillStyle = 'rgba(255,230,190,0.18)';
      ctx.fillRect(x + 6, sy + 8, w - 12, 1.5);
      if (v === 1) for (let i = 0; i < w / 40; i++) ell(x + 12 + r(17, i) * (w - 24), sy + 9, 3, 2, 'rgba(40,20,10,0.5)');
      if (v === 2) { circ(x + 6, sy + 8, 1.4, '#c9d2e8'); circ(x + w - 6, sy + 8, 1.4, '#c9d2e8'); }
    } else if (th.kind === 'steel') {
      if (v === 1) {
        for (let bx = x - 10; bx < x + w + 10; bx += 12) {
          ctx.fillStyle = '#ffd93d'; ctx.beginPath(); ctx.moveTo(bx, sy + h); ctx.lineTo(bx + 6, sy + h); ctx.lineTo(bx + 10, sy + h - 5); ctx.lineTo(bx + 4, sy + h - 5); ctx.fill();
        }
      }
      if (v === 2) { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x + 4, sy + 7, w - 8, 1.5); }
      for (let bx = x + 9; bx < x + w - 4; bx += v === 2 ? 26 : 18) circ(bx, sy + (v === 1 ? 7 : 9), v === 2 ? 2.6 : 2, th.edge);
    } else if (th.kind === 'candy') {
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      if (v === 1) {
        for (let bx = x + 8, i = 0; bx < x + w - 4; bx += 14, i++) circ(bx, sy + (i % 2 ? 6 : 10), 2.6, 'rgba(255,255,255,0.8)');
      } else {
        for (let bx = x - 20; bx < x + w + 20; bx += 18) {
          ctx.beginPath(); ctx.moveTo(bx, sy + h); ctx.lineTo(bx + 8, sy + h); ctx.lineTo(bx + 20, sy); ctx.lineTo(bx + 12, sy); ctx.fill();
        }
      }
    } else if (th.kind === 'crystal') {
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 1;
      for (let bx = x + 6; bx < x + w; bx += 14) { ctx.beginPath(); ctx.moveTo(bx, sy + h); ctx.lineTo(bx + 8, sy); ctx.stroke(); }
    }
    ctx.restore();

    ctx.fillStyle = th.top;
    rr(x, sy, w, 6, 6); ctx.fill();
    ctx.fillRect(x + 4, sy + 3, w - 8, 3);

    if (th.kind === 'stone' && v === 2) {
      for (let i = 0; i < w / 18; i++) { const mx = x + 6 + r(18, i) * (w - 12); ell(mx, sy + 1, 3 + r(19, i) * 3, 2, 'hsl(100, 40%, 42%)'); }
    }
    if (th.kind === 'ice') {
      if (v === 1) for (let bx = x + 6, i = 0; bx < x + w - 4; bx += 11, i++) { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(bx, sy + 1, 4 + r(20, i) * 2, Math.PI, 0); ctx.fill(); }
      ctx.fillStyle = 'rgba(200,240,255,0.9)';
      const long = v === 2 ? 1.6 : 1;
      for (let i = 0, bx = x + 8; bx < x + w - 8; i++, bx += 11 + r(50, i) * 12) {
        const len = (5 + r(80, i) * 11) * long;
        ctx.beginPath(); ctx.moveTo(bx - 3, sy + h - 1); ctx.lineTo(bx + 3, sy + h - 1); ctx.lineTo(bx, sy + h - 1 + len); ctx.fill();
      }
    }
    if (th.kind === 'candy' && v === 2) {
      ctx.fillStyle = '#ffffff';
      for (let i = 0, bx = x + 10; bx < x + w - 10; i++, bx += 16 + r(21, i) * 10) { rr(bx - 2.5, sy + h - 3, 5, 6 + r(22, i) * 7, 2.5); ctx.fill(); }
    }
    if (th.kind === 'shine') {
      if (v === 1) for (let bx = x + 14, i = 0; bx < x + w - 10; bx += 28, i++) { const c = i % 2 ? '#ff6b6b' : '#4d96ff'; tri(bx, sy + 5, bx + 4, sy + 9, bx, sy + 13, c); tri(bx, sy + 5, bx - 4, sy + 9, bx, sy + 13, c); }
      if (v === 2) { ctx.fillStyle = th.edge; ctx.fillRect(x + 5, sy + 9, w - 10, 1); ctx.fillRect(x + 5, sy + 12, w - 10, 1); }
    }
    if (th.kind === 'crystal' && v > 0) {
      ctx.fillStyle = th.top;
      for (let i = 0, bx = x + 10; bx < x + w - 10; i++, bx += 14 + r(23, i) * 12) {
        const ht = 4 + r(24, i) * 6;
        if (v === 1) tri(bx - 3, sy + 1, bx + 3, sy + 1, bx, sy + 1 - ht, th.top);
        else tri(bx - 3, sy + h - 1, bx + 3, sy + h - 1, bx, sy + h - 1 + ht, th.top);
      }
    }
  }

  // One floor sign per floor: on wide stages it rotates between the lanes.
  if (n % 10 === 0 && (p.full || Math.floor(n / 10) % G.lanes === (p.lane || 0))) {
    const cx = (p.x1 + p.x2) / 2;
    const label = summit ? T('SUMMIT') : goal ? T('GOAL') : String(n);
    ctx.font = `15px ${DISPLAY}`;
    const tw = Math.max(34, ctx.measureText(label).width + 16);
    ctx.fillStyle = '#5a3a1e';
    ctx.fillRect(cx - tw / 2 + 6, sy + h, 3, 8);
    ctx.fillRect(cx + tw / 2 - 9, sy + h, 3, 8);
    ctx.fillStyle = goal ? '#6bcb77' : summit ? '#ffd93d' : '#f6e3b4';
    rr(cx - tw / 2, sy + h + 6, tw, 20, 4); ctx.fill();
    ctx.strokeStyle = '#5a3a1e'; ctx.lineWidth = 2; ctx.stroke();
    text(label, cx, sy + h + 17, 15, goal || summit ? NAVY : '#5a3a1e', { stroke: false });
  }
}

function drawStarShape(cx, cy, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rad = i & 1 ? r * 0.45 : r;
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
}

function drawBonfire(sy) {
  const x = GW / 2 + 70, f = G.frame;
  ell(x, sy - 1, 16, 4, '#4a4440');
  ell(x, sy - 2, 11, 3, '#6a5f58');
  limb(x - 12, sy - 3, x + 10, sy - 12, 4, '#5a4632');
  limb(x + 12, sy - 3, x - 10, sy - 12, 4, '#3a2e28');
  for (let i = 0; i < 5; i++) {
    const fx = x - 8 + i * 4, h = 10 + ((f * 2 + i * 13) % 9) + Math.sin(f * 0.3 + i) * 3;
    tri(fx - 3, sy - 3, fx + 3, sy - 3, fx + Math.sin(f * 0.2 + i) * 2, sy - 3 - h, i % 2 ? 'rgba(255,120,30,0.85)' : 'rgba(255,200,60,0.9)');
  }
  for (let i = 0; i < 4; i++) {
    const t = (f * 0.6 + i * 25) % 60;
    circ(x - 6 + i * 4 + Math.sin(t * 0.2 + i) * 3, sy - 8 - t * 0.7, 1, `rgba(255,170,60,${1 - t / 60})`);
  }
}

function drawSummitFlag(sy) {
  const px = RIGHT - 70;
  ctx.fillStyle = '#c9d2e8'; ctx.fillRect(px, sy - 64, 3, 64);
  circ(px + 1.5, sy - 66, 3, '#ffd93d');
  ctx.fillStyle = '#e8463a';
  ctx.beginPath();
  ctx.moveTo(px + 3, sy - 62);
  for (let i = 0; i <= 8; i++) ctx.lineTo(px + 3 + i * 4.5, sy - 62 + Math.sin(G.frame * 0.12 + i * 0.7) * 2.5 + i * 0.4);
  for (let i = 8; i >= 0; i--) ctx.lineTo(px + 3 + i * 4.5, sy - 40 + Math.sin(G.frame * 0.12 + i * 0.7) * 2.5 + i * 0.4);
  ctx.closePath(); ctx.fill();
  drawStarShape(px + 20, sy - 51, 5, '#ffd93d');
}

const WALL_ROWS = 16, WALL_BH = 40, WALL_TILE = 48;
const wallArt = new Map();
function wallPatterns(zone) {
  const k = devicePx();
  const key = `${k}|${zone}`;
  if (wallArt.has(key)) return wallArt.get(key);
  trim(wallArt, 6);
  const [wr, wg, wb] = ZONES[zone].wall;
  const pats = [0, 1].map(side => drawInto(makeLayer(WALL_TILE, WALL_ROWS * WALL_BH), () => {
    const wx = side ? WALL_TILE - WALL : 0;
    const sx = side ? WALL_TILE - WALL - 16 : WALL;
    ctx.fillStyle = `rgb(${wr * 0.5 | 0},${wg * 0.5 | 0},${wb * 0.55 | 0})`;
    ctx.fillRect(wx, 0, WALL, WALL_ROWS * WALL_BH);
    for (let r = 0; r < WALL_ROWS; r++) {
      const y = r * WALL_BH;
      const l = 0.8 + hashSeed(7331, r, 10 + side) * 0.35;
      const segs = r & 1 ? [[0, 14], [14, 18]] : [[0, 20], [20, 12]];
      for (const [bx, bw] of segs) {
        ctx.fillStyle = `rgb(${wr * l | 0},${wg * l | 0},${wb * l | 0})`;
        ctx.fillRect(wx + bx + 1, y + 1, bw - 2, WALL_BH - 2);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(wx + bx + 1, y + 1, bw - 2, 3);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(wx + bx + 1, y + WALL_BH - 5, bw - 2, 4);
      }
    }
    const g = ctx.createLinearGradient(side ? sx + 16 : sx, 0, side ? sx : sx + 16, 0);
    g.addColorStop(0, 'rgba(0,0,0,0.45)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(sx, 0, 16, WALL_ROWS * WALL_BH);
    ctx.fillStyle = side ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.1)';
    ctx.fillRect(side ? wx : WALL - 2, 0, 2, WALL_ROWS * WALL_BH);
  }));
  wallArt.set(key, pats);
  return pats;
}

function drawWalls() {
  const b = tierBlend(), zLo = TIERS[b.lo].zone, zHi = TIERS[b.hi].zone;
  drawWallPass(zLo, 1);
  if (zHi !== zLo && b.t > 0) drawWallPass(zHi, b.t);
}
function drawWallPass(zone, a) {
  const pats = wallPatterns(zone);
  const T = WALL_ROWS * WALL_BH;
  const off = ((G.camY % T) + T) % T;
  ctx.globalAlpha = a;
  for (let side = 0; side < 2; side++) {
    const x = side ? GW - WALL_TILE : 0;
    for (let y = -off; y < H; y += T) ctx.drawImage(pats[side].c, x, y, WALL_TILE, T + 1);
  }
  ctx.globalAlpha = 1;
}

function drawParticles() {
  let color = null, embers = 0;
  for (const p of G.particles) {
    if (p.kind === 'ember') { embers++; continue; }
    const a = clamp(p.life / p.max, 0, 1);
    const x = p.x, y = p.y - G.camY;
    ctx.globalAlpha = a;
    if (p.color !== color) { ctx.fillStyle = p.color; color = p.color; }
    if (p.kind === 'streak') {
      ctx.fillRect(x - 14, y, 28, p.size);
    } else if (p.kind === 'spark') {
      const sw = p.size * (0.35 + 0.65 * Math.abs(Math.cos(p.rot)));
      ctx.fillRect(x - sw / 2, y - p.size / 2, sw, p.size);
    } else {
      ctx.beginPath(); ctx.arc(x, y, p.size * (0.5 + a * 0.5), 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  if (embers) drawEmbers();
}

function drawEmbers() {
  ctx.globalCompositeOperation = 'lighter';
  for (const p of G.particles) {
    if (p.kind !== 'ember') continue;
    const a = clamp(p.life / p.max, 0, 1), x = p.x, y = p.y - G.camY, s = p.size * (0.35 + a * 0.65);
    if (!LOW) glowAt(x, y, s * 3.4, p.color, a * 0.5);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.moveTo(x, y - s * 1.3); ctx.lineTo(x + s * 0.55, y); ctx.lineTo(x, y + s * 0.8); ctx.lineTo(x - s * 0.55, y); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

function drawRings() {
  ctx.lineCap = 'round';
  for (const r of G.rings) {
    const k = r.t / r.dur, e = 1 - (1 - k) * (1 - k), rad = 14 + r.r * e, y = r.y - G.camY;
    ctx.globalAlpha = (1 - k) * 0.85;
    ctx.strokeStyle = r.color; ctx.lineWidth = 2 + 7 * (1 - k);
    ctx.beginPath(); ctx.arc(r.x, y, rad, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = (1 - k) * 0.4;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(r.x, y, rad * 0.7, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function climberMood() {
  if (state === 'summit') return P.onGround ? 'happy' : 'jump';
  if (P.hurt > 0) return 'hurt';
  if (G.scrolling && P.y - G.camY > H - 150) return 'panic';
  if (G.goblin && !G.goblin.leaving && G.goblin.y - P.y < 300 && G.goblin.y - P.y > -80) return 'chased';
  if (G.combo.active && G.combo.floors >= 8) return 'happy';
  if (P.teeter) return 'scared';
  if (!P.onGround) return P.vy > 8 ? 'fall' : 'jump';
  if (Math.abs(P.vx) > P.ph.maxVx * 0.7) return 'run';
  return 'idle';
}
const POSE_KEYS = ['fF', 'fB', 'hF', 'hB'];
const LOOK_UP = [1, -0.8], LOOK_DOWN = [0.5, 1], LOOK_AHEAD = [1, -0.1], LOOK_FRONT = [1, 0], LOOK_BACK = [-1, 0.5];
function climberLook(mood) {
  if (mood === 'jump') return LOOK_UP;
  if (mood === 'chased') return LOOK_BACK;
  if (mood === 'fall' || mood === 'panic' || mood === 'scared') return LOOK_DOWN;
  if (mood === 'run') return LOOK_AHEAD;
  return P.idleT > 90 ? idleLook(G.frame) : LOOK_FRONT;
}

function animateClimber() {
  const mood = climberMood();
  const target = climberPose(P.climber, {
    ground: P.onGround, vx: P.vx, vy: P.vy, run: P.run, teeter: P.teeter, frame: G.frame,
    idleT: P.idleT, speed01: Math.abs(P.vx) / P.ph.maxVx, mood,
  });
  if (!P.pose) P.pose = { fF: target.fF.slice(), fB: target.fB.slice(), hF: target.hF.slice(), hB: target.hB.slice(), lean: target.lean, bob: target.bob, face: target.face, amp: target.amp };
  else {
    const k = P.onGround && target.amp > 0.05 ? 0.5 : 0.32, cur = P.pose;
    for (const key of POSE_KEYS) {
      const c = cur[key], t = target[key];
      c[0] += (t[0] - c[0]) * k; c[1] += (t[1] - c[1]) * k;
    }
    cur.lean += (target.lean - cur.lean) * k;
    cur.bob += (target.bob - cur.bob) * k;
    cur.face = target.face; cur.amp = target.amp;
  }
  const sw = P.sway;
  sw.vx = (sw.vx + (clamp(-P.vx * P.face * 0.7, -7, 7) - sw.x) * 0.16) * 0.82; sw.x += sw.vx;
  sw.vy = (sw.vy + (clamp(-P.vy * 0.45, -5, 6) - sw.y) * 0.16) * 0.82; sw.y += sw.vy;
}

function playerSkin() {
  if (state !== 'summit' || G.summitT < SUMMIT_REVEAL - 20) return P.skin;
  if (G.summitT > SUMMIT_REVEAL + 60) return GLITCH_SKIN;
  return (G.frame >> 2) & 1 ? GLITCH_SKIN : P.skin;
}

function drawPlayer() {
  if (P.y - G.camY > H + 40) return;
  const sx = P.x, sy = P.y - G.camY;
  ctx.save();
  ctx.translate(sx, sy);
  if (P.onGround) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(0, 1, 13, 3, 0, 0, Math.PI * 2); ctx.fill();
  }
  const sq = P.squash;
  const tiny = cheatOn('tiny') ? 0.55 : 1;
  let twX = 1, twY = 1;
  if (P.angle) {
    const tw = Math.cos(P.angle), k = Math.abs(P.angle) / (Math.PI * 2);
    twX = (tw < 0 ? -1 : 1) * Math.max(0.16, Math.abs(tw));
    twY = 1 + Math.sin(k * Math.PI) * 0.1;
    drawTwirl(k, tiny, false);
  }
  ctx.scale(P.face * (1 + sq * 0.18) * tiny * twX, (1 - sq * 0.18) * tiny * twY);
  if (P.teeter) ctx.rotate(P.teeter * P.face * 0.18 * Math.sin(G.frame * 0.25));
  if (P.inv > 0 && (G.frame >> 2) & 1) ctx.globalAlpha = 0.35;
  const mood = climberMood();
  drawClimber(P.climber, P.pose || climberPose(P.climber, { ground: true, vx: 0, vy: 0, run: 0, teeter: 0, frame: G.frame, idleT: 0, speed01: 0, mood }), {
    frame: G.frame, blink: P.blink > 0, mood, look: climberLook(mood),
    swayX: P.sway.x, swayY: P.sway.y, rising: !P.onGround && P.vy < 0, combo: G.combo.active, skin: playerSkin(),
  });
  ctx.globalAlpha = 1;
  ctx.restore();
  if (P.angle) {
    ctx.save();
    ctx.translate(sx, sy);
    drawTwirl(Math.abs(P.angle) / (Math.PI * 2), cheatOn('tiny') ? 0.55 : 1, true);
    ctx.restore();
  }
}

function drawTwirl(k, s, front) {
  const fade = Math.sin(k * Math.PI), spin = k * Math.PI * 4;
  const color = G.combo.active ? emberSet(comboLevel(G.combo.floors))[1] : '#cfe6ff';
  ctx.strokeStyle = color; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const y = (-8 - i * 17) * s, rx = (20 - i * 2.5) * s, ry = 5.5 * s, a0 = spin + i * 1.9;
    const from = front ? 0 : Math.PI, to = from + Math.PI;
    ctx.globalAlpha = fade * (front ? 0.85 : 0.4);
    ctx.lineWidth = (front ? 2.6 : 1.8) * s;
    ctx.beginPath();
    for (let j = 0; j <= 10; j++) {
      const a = from + (to - from) * j / 10, w = 0.5 + 0.5 * Math.sin(a - a0);
      if (w < 0.25) { ctx.moveTo(Math.cos(a) * rx, y + Math.sin(a) * ry); continue; }
      ctx.lineTo(Math.cos(a) * rx, y + Math.sin(a) * ry);
    }
    ctx.stroke();
  }
  if (front && !P.onGround && P.vy < 0) {
    ctx.globalAlpha = fade * 0.5;
    ctx.lineWidth = 1.4;
    for (let i = -1; i <= 1; i++) limb(i * 9 * s, 6, i * 9 * s, 6 + (10 + Math.abs(P.vy)) * s * (i ? 0.7 : 1), 1.4, color);
  }
  ctx.globalAlpha = 1;
}

function drawPopups() {
  for (const p of G.popups) {
    ctx.globalAlpha = 1 - p.t / 50;
    text(p.text, p.x, p.y - G.camY, p.combo ? 22 : 20, p.combo ? '#ffb547' : '#ffd93d', { lw: 5 });
  }
  ctx.globalAlpha = 1;
}

const HG_W = 40, HG_H = 58;
let hourglassArt = null;
function glassPath(cx, y0, y1) {
  const m = (y0 + y1) / 2, r = 12, n = 1.8;
  ctx.beginPath();
  ctx.moveTo(cx - r, y0);
  ctx.bezierCurveTo(cx - r, m - 9, cx - n, m - 5, cx - n, m);
  ctx.bezierCurveTo(cx - n, m + 5, cx - r, m + 9, cx - r, y1);
  ctx.lineTo(cx + r, y1);
  ctx.bezierCurveTo(cx + r, m + 9, cx + n, m + 5, cx + n, m);
  ctx.bezierCurveTo(cx + n, m - 5, cx + r, m - 9, cx + r, y0);
  ctx.closePath();
}
function hourglassFrame() {
  const k = devicePx();
  if (!hourglassArt || hourglassArt.k !== k) {
    hourglassArt = drawInto(makeLayer(HG_W, HG_H), () => {
      const cx = HG_W / 2, top = 5, bot = HG_H - 5;
      for (const x of [cx - 16, cx + 16]) {
        ctx.fillStyle = NAVY; ctx.fillRect(x - 3.2, top, 6.4, bot - top);
        ctx.fillStyle = '#4a3428'; ctx.fillRect(x - 2, top, 4, bot - top);
        ctx.fillStyle = 'rgba(255,220,170,0.25)'; ctx.fillRect(x - 1.6, top, 1.2, bot - top);
      }
      glassPath(cx, top + 4, bot - 4);
      ctx.fillStyle = 'rgba(150,180,255,0.14)'; ctx.fill();
      ctx.strokeStyle = NAVY; ctx.lineWidth = 3.2; ctx.stroke();
      ctx.strokeStyle = 'rgba(205,225,255,0.7)'; ctx.lineWidth = 1.3; ctx.stroke();
      for (const y of [top, bot]) {
        ctx.fillStyle = '#3a2a22'; rr(cx - 20, y - 4.5, 40, 9, 3); ctx.fill();
        ctx.strokeStyle = NAVY; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#c9a24a'; ctx.fillRect(cx - 16, y - 1, 32, 1.8);
        circ(cx - 16, y, 1.6, '#e8c46a'); circ(cx + 16, y, 1.6, '#e8c46a');
      }
    });
    hourglassArt.k = k;
  }
  return hourglassArt;
}
function drawHourglass(x, y, frac, hot) {
  const fr = hourglassFrame(), flip = G.clockFlip / 26;
  if (hot && !LOW) glowAt(x, y, 46, 'rgba(255,70,40,0.75)', 0.45 + 0.25 * Math.sin(G.frame * 0.2));
  ctx.save();
  ctx.translate(x, y);
  if (flip > 0) ctx.rotate(Math.PI * flip * flip * (3 - 2 * flip));
  ctx.drawImage(fr.c, -HG_W / 2, -HG_H / 2, HG_W, HG_H);
  const y0 = -HG_H / 2 + 9, y1 = HG_H / 2 - 9;
  ctx.save();
  glassPath(0, y0, y1); ctx.clip();
  const sand = hot ? '#ff6a3d' : '#ffc061', deep = hot ? '#c2361b' : '#d98a2a';
  const topH = -y0 * (1 - frac) * 0.86, pile = y1 * frac * 0.86;
  if (topH > 0.5) {
    ctx.fillStyle = deep; ctx.fillRect(-14, -topH, 28, topH);
    ctx.fillStyle = sand; ctx.fillRect(-14, -topH, 28, Math.min(2, topH));
  }
  ctx.fillStyle = deep;
  ctx.beginPath(); ctx.moveTo(-14, y1); ctx.lineTo(-14, y1 - pile * 0.55); ctx.quadraticCurveTo(0, y1 - pile * 1.5, 14, y1 - pile * 0.55); ctx.lineTo(14, y1); ctx.closePath(); ctx.fill();
  if (frac < 0.995 && flip <= 0 && G.scrolling) {
    ctx.fillStyle = sand;
    ctx.fillRect(-0.8, 0, 1.6, y1 - pile);
    if ((G.frame >> 2) & 1) circ(0, y1 - pile, 1.6, sand);
  }
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(-8, y0 + 2, 2, 7); ctx.fillRect(-8, y1 - 9, 2, 6);
  ctx.restore();
}
function diamond(x, y, r, fill, edge) {
  ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r * 0.82, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r * 0.82, y); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  if (edge) { ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(1.5, r * 0.2); ctx.strokeStyle = edge; ctx.stroke(); }
}
function drawSigil(x, y, r, fill, light) {
  diamond(x, y, r, fill, NAVY);
  const a = ctx.globalAlpha;
  ctx.globalAlpha = a * 0.45;
  tri(x, y - r, x - r * 0.82, y, x, y, light);
  ctx.globalAlpha = a * 0.25;
  tri(x, y + r, x + r * 0.82, y, x, y, NAVY);
  ctx.globalAlpha = a * 0.6;
  ctx.strokeStyle = light; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(x, y - r * 0.62); ctx.lineTo(x + r * 0.5, y); ctx.lineTo(x, y + r * 0.62); ctx.lineTo(x - r * 0.5, y); ctx.closePath(); ctx.stroke();
  ctx.globalAlpha = a;
}
const gaugeFills = new Map();
function gaugeFill(key, y0, y1, stops) {
  let g = gaugeFills.get(key);
  if (!g) {
    g = mainCtx.createLinearGradient(0, y1, 0, y0);
    stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c));
    gaugeFills.set(key, g);
  }
  return g;
}
const GAUGE_Y = 196, GAUGE_H = 288, GAUGE_W = 14;
function drawGauge(x, frac, fill, tip, warn) {
  const y = GAUGE_Y, h = GAUGE_H, w = GAUGE_W;
  ctx.fillStyle = 'rgba(6,5,14,0.88)'; rr(x - 4, y - 4, w + 8, h + 8, 4); ctx.fill();
  ctx.strokeStyle = warn ? '#ff5a3d' : '#4a4458'; ctx.lineWidth = 2; ctx.stroke();
  if (frac > 0) {
    const fh = h * frac, top = y + h - fh;
    ctx.fillStyle = fill; ctx.fillRect(x, top, w, fh);
    if (tip) {
      const f = G.frame, fl = 6 + 3 * Math.sin(f * 0.5) + 2 * Math.sin(f * 0.83);
      ctx.fillStyle = tip;
      ctx.beginPath(); ctx.moveTo(x, top); ctx.quadraticCurveTo(x + w * 0.2, top - fl * 0.55, x + w / 2 + Math.sin(f * 0.37) * 2, top - fl);
      ctx.quadraticCurveTo(x + w * 0.8, top - fl * 0.55, x + w, top); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      for (let i = 0; i < 3; i++) {
        const p = (f * (1.4 + i * 0.5) + i * 97) % fh, sx = x + 3 + ((i * 5 + (f >> 3)) % (w - 6));
        ctx.fillRect(sx, y + h - p, 1.6, 1.6);
      }
    }
    ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(x + 2, top, 2, fh);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  for (let i = 1; i < 6; i++) ctx.fillRect(x - 3, y + h * i / 6, 5, 1.5);
  for (const cy of [y - 7, y + h + 1]) {
    ctx.fillStyle = '#2e2838'; rr(x - 6, cy, w + 12, 6, 2); ctx.fill();
    ctx.strokeStyle = NAVY; ctx.lineWidth = 1.5; ctx.stroke();
    circ(x - 2, cy + 3, 1.3, '#8a8098'); circ(x + w + 2, cy + 3, 1.3, '#8a8098');
  }
}

function drawClockHUD(m) {
  const ck = G.mode.clock, top = maxLevel(), max = G.level === top && m !== 'sprint';
  const alarm = G.clockShake && G.frame % 10 < 5;
  ctx.save();
  if (G.clockShake) ctx.translate(Math.sin(G.frame * 1.7) * 2.5, 0);
  drawHourglass(54, 45, G.scrolling ? (G.clock % ck.every) / ck.every : 0, max || alarm);
  ctx.restore();
  if (m === 'sprint') return;
  text(max ? T('MAX SPEED') : T('SPEED'), 80, 32, 12.5, max ? '#ff8a5a' : '#c9d2e8', { align: 'left', lw: 4, max: 110 });
  for (let i = 1; i <= top; i++) {
    const lit = i <= G.level;
    diamond(86 + (i - 1) * 13, 53, 6, lit ? (max ? '#ff5a3d' : '#ffb547') : 'rgba(10,14,34,0.75)', lit ? NAVY : 'rgba(159,170,210,0.45)');
  }
}

function drawComboHUD() {
  const c = G.combo, on = c.active, level = on ? comboLevel(c.floors) : 0, pal = emberSet(level), set = EMBERS.indexOf(pal);
  const frac = on ? c.timer / COMBO_TIME : 0;
  drawGauge(9, frac, gaugeFill('combo' + set, GAUGE_Y, GAUGE_Y + GAUGE_H, [pal[2], pal[1], pal[0]]), pal[0], on && frac < 0.3 && (G.frame >> 2) & 1);
  const bx = 16, by = GAUGE_Y - 30, r = on ? 17 + Math.sin(G.frame * 0.3) * 1.2 : 15;
  if (on && !LOW) glowAt(bx, by, r * 2.6, pal[1], 0.5 + 0.2 * Math.sin(G.frame * 0.21));
  drawSigil(bx, by, r, on ? pal[1] : '#2e2a3e', on ? pal[0] : '#6a6488');
  text(on ? String(c.floors) : '0', bx, by + 1, on ? (c.floors > 99 ? 12 : 15) : 13, on ? '#1a0f0a' : '#a8a2c0', { stroke: false });
  ctx.save();
  ctx.translate(16, GAUGE_Y + GAUGE_H + 34); ctx.rotate(-Math.PI / 2);
  text(T('COMBO'), 0, 0, 12.5, on ? pal[0] : '#9fa9cf', { lw: 3 });
  ctx.restore();
}

function drawHUD() {
  if (G.goblin) drawGoblinHUD();
  const m = G.mode.id;
  drawClockHUD(m);

  if (m === 'sprint') {
    text(T('TIME'), GW - 44, 20, 13, '#b6e37a', { align: 'right', lw: 4 });
    text(formatTime(G.elapsed), GW - 44, 44, 30, '#ffffff', { align: 'right', lw: 6, cache: false });
    text(T('FLOOR {0} / {1}', P.floor, SPRINT_GOAL), GW - 44, 72, 17, '#ffd93d', { align: 'right', lw: 5 });
    drawGauge(GW - 23, Math.min(1, G.highest / SPRINT_GOAL), gaugeFill('sprint', GAUGE_Y, GAUGE_Y + GAUGE_H, ['#3a3fd8', '#4d96ff', '#9fe3ff']), null, false);
    text('100', GW - 16, GAUGE_Y - 20, 13, '#6bcb77', { lw: 4 });
    const best = boards.sprint[0];
    if (best) text(T('best {0}', formatTime(best.time)).toUpperCase(), GW - 44, 92, 12, '#c9d2e8', { align: 'right', lw: 3 });
  } else {
    text(T('SCORE'), GW - 44, 20, 13, '#b6e37a', { align: 'right', lw: 4 });
    text(num(score()), GW - 44, 44, 30, '#ffffff', { align: 'right', lw: 6 });
    text(T('FLOOR {0}', P.floor), GW - 44, 72, 17, '#ffd93d', { align: 'right', lw: 5 });
    text(T(themeOf(P.floor).name), GW - 44, 92, 12, '#c9d2e8', { align: 'right', lw: 3, max: 200 });
    let y = 112;
    if (m === 'chaos') y = drawChaosHUD(GW - 44, y);
    if (m === 'rockfall') { drawHearts(GW - 54, 116); y = 140; }
    if (G.cheated) text(T('CHEATS ON'), GW - 44, y, 12, '#ff7fb7', { align: 'right', lw: 3 });
  }

  drawComboHUD();

  if (isTouch && state === 'play') {
    circ(GW / 2, 34, 17, 'rgba(10,14,34,0.7)');
    ctx.strokeStyle = 'rgba(182,227,122,0.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(GW / 2, 34, 17, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#eef6ff'; ctx.fillRect(GW / 2 - 6, 27, 4, 14); ctx.fillRect(GW / 2 + 2, 27, 4, 14);
    addHit(GW / 2 - 30, 6, 60, 56, pauseGame);
    if (G.countdown === 0 && G.highest < 3 && G.elapsed < 600) {
      ctx.globalAlpha = 0.65 + 0.35 * Math.sin(G.frame * 0.12);
      text(T('DRAG ← → TO RUN  ·  TAP TO JUMP'), GW / 2, H - 96, 16, '#eef6ff', { font: BODY, weight: 800, lw: 4, max: UI_W - 40 });
      ctx.globalAlpha = 1;
    }
  }
  if (G.toasts.length && state === 'play') {
    const t = G.toasts[0], k = Math.min(1, t.t / 14), out = t.t > 180 ? (t.t - 180) / 20 : 0;
    ctx.save();
    ctx.globalAlpha = 1 - out;
    ctx.translate((GW - UI_W) / 2, (1 - easeOutBack(k)) * -80 - out * 30);
    panel(80, 108, 320, t.reward ? 62 : 46, '#ffd93d');
    drawSigil(104, 131, 12, '#ffb547', '#fff1b8');
    text(T('ACHIEVEMENT UNLOCKED'), 124, 122, 11, '#ffd93d', { align: 'left', font: BODY, weight: 800, lw: 3 });
    text(t.name, 124, 140, 18, '#ffffff', { align: 'left', lw: 4 });
    if (t.reward) text(T('Unlocked: {0}', t.reward), 124, 158, 11, '#6bcb77', { align: 'left', font: BODY, weight: 800, lw: 3, max: UI_W - 150 });
    ctx.restore();
  }
  if (Sfx.muted || !Sfx.music.on) text(T(Sfx.muted ? 'SOUND OFF' : 'MUSIC OFF'), GW - 44, H - 18, 12, '#9aa3c7', { align: 'right', lw: 3 });

  if (G.countdown > 0) {
    const n = Math.ceil(G.countdown / 60), k = 1 - (G.countdown % 60) / 60;
    ctx.save();
    ctx.globalAlpha = 1 - k * 0.6;
    ctx.translate(GW / 2, 270);
    ctx.scale(1.4 - k * 0.5, 1.4 - k * 0.5);
    text(String(n), 0, 0, 110, '#ffffff', { lw: 14, cache: false });
    ctx.restore();
  }
}

function band(w, h, edge, a, fill = 0.7) {
  const sk = 12;
  ctx.globalAlpha = a * fill;
  ctx.fillStyle = '#06040e';
  ctx.beginPath(); ctx.moveTo(-w / 2 + sk, -h / 2); ctx.lineTo(w / 2 + sk, -h / 2); ctx.lineTo(w / 2 - sk, h / 2); ctx.lineTo(-w / 2 - sk, h / 2); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = a * 0.9;
  ctx.strokeStyle = edge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-w / 2 + sk + 6, -h / 2); ctx.lineTo(w / 2 + sk - 6, -h / 2); ctx.moveTo(-w / 2 - sk + 6, h / 2); ctx.lineTo(w / 2 - sk - 6, h / 2); ctx.stroke();
  ctx.globalAlpha = a;
}

function drawAnnounce() {
  const a = G.announce;
  if (!a) return;
  const t = a.t, inK = Math.min(1, t / 9), out = t > a.dur - 22 ? (t - a.dur + 22) / 22 : 0, pal = a.pal || EMBERS[0];
  const alpha = clamp(inK * 1.5, 0, 1) * (1 - out);
  const slam = (1 + (1 - inK) * (1 - inK) * 1.6) * (t >= 9 && t < 17 ? 1 + Math.sin((t - 9) / 8 * Math.PI) * 0.07 : 1);
  ctx.save();
  ctx.translate(GW / 2, (a.y || 200) - out * 24);
  band((UI_W - 120) * Math.min(1, t / 10), 72, pal[1], alpha);
  ctx.save();
  ctx.scale(slam, slam);
  const fill = ctx.createLinearGradient(0, -28, 0, 28);
  fill.addColorStop(0, pal[0]); fill.addColorStop(0.55, pal[1]); fill.addColorStop(1, pal[2]);
  text(a.word, 0, 0, a.word.length > 9 ? 50 : 60, fill, { lw: 11, max: UI_W - 130 });
  ctx.restore();
  const count = clamp((t - 10) / 26, 0, 1), shown = Math.round(a.pts * (1 - Math.pow(1 - count, 3)));
  text(T('{0} FLOORS', a.floors), 0, 50, 17, pal[0], { lw: 5, font: BODY, weight: 800 });
  text(`+${num(shown)}`, 0, 75, 26, '#ffffff', { lw: 6, cache: count >= 1 });
  ctx.restore();
}

function drawBanners() {
  let y = G.bannerY;
  for (const b of G.banners) {
    const k = Math.min(1, b.t / 12);
    const alpha = clamp(b.t > b.dur - 20 ? (b.dur - b.t) / 20 : 1, 0, 1);
    if (b.flash && b.t % 16 < 5) { y += 70; continue; }
    ctx.save();
    ctx.translate(GW / 2 + (1 - easeOutBack(k)) * -260, y);
    band(UI_W - 100, b.sub ? 70 : 52, b.color, alpha * k, 0.5);
    ctx.globalAlpha = alpha;
    text(b.text, 0, b.sub ? -8 : 0, 42, b.color, { lw: 9, max: UI_W - 120 });
    if (b.sub) text(b.sub, 0, 22, 15, '#eef6ff', { lw: 4, font: BODY, weight: 800, max: UI_W - 116 });
    ctx.restore();
    y += 78;
  }
}
