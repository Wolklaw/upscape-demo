'use strict';

const PITCH = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const accidental = a => (a === '#' ? 1 : a === 'b' ? -1 : 0);
const noteNum = n => { const m = /^([A-G])([#b]?)(\d)$/.exec(n); return PITCH[m[1]] + accidental(m[2]) + (+m[3] + 1) * 12; };
const bars = str => str.split('|').map(bar => {
  const out = [];
  let t = 0;
  for (const tok of bar.trim().split(/\s+/)) {
    const [n, len] = tok.split(':');
    if (n !== '-') out.push([t, noteNum(n), +len]);
    t += +len;
  }
  return out;
});
const CHORD_SHAPES = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10], m7: [0, 3, 7, 10], M7: [0, 4, 7, 11], 5: [0, 7, 12], dim: [0, 3, 6], sus: [0, 5, 7] };
const chords = str => str.trim().split(/\s+/).map(c => {
  const m = /^([A-G])([#b]?)(.*)$/.exec(c);
  return [PITCH[m[1]] + accidental(m[2]) + 36, CHORD_SHAPES[m[3]]];
});
const toMinor = tonic => n => ([4, 9, 11].includes(((n - tonic) % 12 + 12) % 12) ? n - 1 : n);
function composeSong(o) {
  const song = Object.assign({}, o, { chords: { A: chords(o.A.chords), B: chords(o.B.chords) }, melody: { A: bars(o.A.melody), B: bars(o.B.melody) } });
  delete song.A; delete song.B;
  if (o.minor) {
    const fix = toMinor(PITCH[o.minor[0]] + accidental(o.minor[1]));
    for (const sec of ['A', 'B']) {
      song.chords[sec] = song.chords[sec].map(([root, shape]) => {
        const tones = shape.map(i => fix(root + i));
        return [tones[0], tones.map(n => n - tones[0])];
      });
      song.melody[sec] = song.melody[sec].map(bar => bar.map(([t, n, len]) => [t, fix(n), len]));
    }
    song.fix = fix;
  }
  return song;
}

const SONGS = {
  lobby: composeSong({
    title: 'Below the Tower', bpm: 74, bpmStep: 0, swing: 0, lead: 'voice', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Dm Bb Gm A Dm F Gm A',
      melody: 'D5:6 F5:2 A5:8 | G5:6 F5:2 D5:8 | Bb4:4 D5:4 G5:4 F5:4 | E5:12 C#5:4 | D5:6 F5:2 A5:6 D6:2 | C6:8 A5:4 F5:4 | G5:4 Bb5:4 A5:4 G5:4 | A5:8 C#5:4 E5:4',
    },
    B: {
      chords: 'Bb F Gm Dm Bb C A A',
      melody: 'F5:8 D5:4 Bb4:4 | C5:8 F5:4 A5:4 | Bb5:6 A5:2 G5:8 | F5:6 E5:2 D5:8 | D6:8 C6:4 Bb5:4 | C6:6 Bb5:2 G5:8 | A5:4 G5:4 F5:4 E5:4 | C#5:8 E5:4 A4:4',
    },
    bass: [[0, 0, 16]],
    drums: { kick: [0, 3], snare: [], open: [], soft: true, fill: false, noHats: true },
    arp: { div: 4, seq: [0, 2, 1, 2], oct: 36, wave: 'bell' },
    mix: { lead: 0.07, bass: 0.13, pad: 0.03, arp: 0.045, stab: 0, drums: 0.55 },
  }),
  ascent: composeSong({
    title: 'The Long Climb', bpm: 112, bpmStep: 4, swing: 0.06, lead: 'grim', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Am G F E Am G F E',
      melody: 'E5:3 E5:1 D5:2 C5:2 E5:4 A5:4 | G5:3 F5:1 E5:2 D5:2 B4:4 G4:4 | A4:2 C5:2 F5:4 E5:2 D5:2 C5:4 | B4:4 G#4:4 E4:4 B4:4 | E5:3 E5:1 D5:2 C5:2 E5:4 A5:4 | B5:3 A5:1 G5:2 F5:2 D5:4 B4:4 | C5:2 F5:2 A5:4 G5:2 F5:2 E5:2 D5:2 | E5:8 G#5:4 B5:4',
    },
    B: {
      chords: 'Dm Am E Am F G E E',
      melody: 'D6:4 C6:2 A5:2 F5:4 A5:4 | C6:4 B5:2 A5:2 E5:4 A5:4 | B5:3 C6:1 B5:2 G#5:2 E5:4 G#5:4 | A5:8 E5:4 C5:4 | F5:2 A5:2 C6:4 B5:2 A5:2 F5:4 | G5:2 B5:2 D6:4 C6:2 B5:2 G5:4 | G#5:2 B5:2 E6:4 D6:2 B5:2 G#5:4 | E6:8 B5:4 G#5:4',
    },
    bass: [[0, 0, 2], [3, 0, 1], [4, 0, 2], [6, 12, 1], [8, 0, 2], [11, 0, 1], [12, 7, 2], [14, 12, 1]],
    drums: { kick: [0, 7, 8, 10], snare: [4, 12], open: [14] },
    stab: { steps: [2, 10], oct: 24, wave: 'square' },
    arp: { div: 2, seq: [0, 1, 2, 1], oct: 36, wave: 'triangle' },
    mix: { lead: 0.066, bass: 0.15, pad: 0.016, arp: 0.03, stab: 0.02, drums: 1 },
  }),
  breakout: composeSong({
    title: 'Breakout', bpm: 138, bpmStep: 3, swing: 0, lead: 'synth', pad: true,
    A: {
      chords: 'Em F Em D Em F G B',
      melody: 'B4:2 E5:2 G5:2 B5:2 A5:2 G5:2 F#5:2 E5:2 | F5:4 A5:4 C6:4 A5:4 | G5:2 F#5:2 E5:2 B4:2 E5:4 G5:4 | F#5:4 D5:4 A4:8 | B4:2 E5:2 G5:2 B5:2 A5:2 G5:2 F#5:2 E5:2 | A5:2 C6:2 F6:4 E6:2 C6:2 A5:4 | B5:2 D6:2 G6:4 F#6:2 D6:2 B5:4 | D#6:4 B5:4 F#5:4 D#5:4',
    },
    B: {
      chords: 'C D Em Em C D B B',
      melody: 'E6:4 G6:4 E6:4 C6:4 | F#6:4 A6:4 F#6:4 D6:4 | G6:6 F#6:2 E6:8 | B5:4 E6:4 G6:8 | C6:2 E6:2 G6:2 E6:2 C6:2 G5:2 E5:4 | D6:2 F#6:2 A6:2 F#6:2 D6:2 A5:2 F#5:4 | D#6:2 F#6:2 B6:4 A6:2 F#6:2 D#6:4 | B5:8 F#5:4 D#5:4',
    },
    bass: [[0, 0, 1], [2, 12, 1], [4, 0, 1], [6, 12, 1], [8, 0, 1], [10, 12, 1], [12, 0, 1], [14, 12, 1]],
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], open: [2, 6, 10, 14], hat16: true },
    arp: { div: 1, seq: [0, 1, 2, 1], oct: 24, wave: 'square' },
    mix: { lead: 0.056, bass: 0.14, pad: 0.012, arp: 0.02, stab: 0, drums: 1 },
  }),
  havoc: composeSong({
    title: 'Havoc', bpm: 150, bpmStep: 3, swing: 0, lead: 'saw', pad: false, octaveUp: false,
    A: {
      chords: 'D5 D5 Eb5 D5 D5 F5 E5 Eb5',
      melody: 'D5:2 D5:1 D5:1 F5:2 D5:2 G#5:2 A5:2 F5:2 D5:2 | C6:2 A5:2 G#5:2 F5:2 D5:4 D5:2 F5:2 | Eb5:2 Eb5:1 Eb5:1 G5:2 Eb5:2 A5:2 Bb5:2 G5:2 Eb5:2 | D5:4 A5:4 G#5:4 F5:4 | D6:2 C6:2 A5:2 G#5:2 A5:2 C6:2 D6:4 | F5:2 G#5:2 C6:4 B5:2 G#5:2 F5:4 | E5:2 G5:2 Bb5:4 A5:2 G5:2 E5:4 | Eb5:4 G5:4 Bb5:4 D6:4',
    },
    B: {
      chords: 'G5 Ab5 G5 F5 Bb5 A5 Ab5 A5',
      melody: 'G5:4 Bb5:2 C#6:2 D6:8 | Ab5:4 C6:2 Eb6:2 D6:8 | G6:2 F6:2 D6:2 C#6:2 D6:2 Bb5:2 G5:4 | F5:4 A5:4 C6:4 Eb6:4 | D6:2 Bb5:2 F5:2 Bb5:2 D6:2 F6:2 E6:4 | C#6:2 A5:2 E5:2 A5:2 C#6:2 E6:2 D6:4 | C6:2 Ab5:2 Eb5:2 Ab5:2 C6:2 Eb6:2 D6:4 | C#6:4 E6:4 A6:4 G#6:4',
    },
    bass: [[0, 0, 1], [1, 0, 1], [2, 12, 1], [3, 0, 1], [4, 0, 1], [6, 0, 1], [7, 1, 1], [8, 0, 1], [10, 0, 1], [11, 12, 1], [12, 0, 1], [14, 6, 1], [15, 1, 1]],
    drums: { kick: [0, 2, 3, 8, 10, 11], snare: [4, 12], open: [7, 15], hat16: true },
    stab: { steps: [0, 3, 6, 10], oct: 12, wave: 'power', always: true },
    mix: { lead: 0.05, bass: 0.12, pad: 0, arp: 0, stab: 0.034, drums: 0.9 },
  }),
  rubble: composeSong({
    title: 'Rubble and Ruin', bpm: 100, bpmStep: 4, swing: 0, lead: 'organ', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Cm Cm Ab G Cm Cm Bb Ab',
      melody: 'C5:4 Eb5:2 G5:2 C6:4 B5:2 G5:2 | Ab5:4 G5:2 Eb5:2 F5:4 D5:4 | Eb5:4 C5:2 Ab4:2 C5:4 Eb5:4 | D5:6 B4:2 G4:8 | C5:4 Eb5:2 G5:2 C6:4 D6:2 Eb6:2 | D6:4 C6:2 G5:2 Eb5:4 G5:4 | F5:4 D5:2 Bb4:2 D5:4 F5:4 | Eb5:6 D5:2 C5:4 B4:4',
    },
    B: {
      chords: 'Fm Cm G Cm Ab Bb G G',
      melody: 'F5:4 Ab5:4 C6:4 F6:4 | Eb6:6 D6:2 C6:8 | B5:4 D6:4 G6:4 F6:4 | Eb6:8 C6:4 G5:4 | Ab5:4 C6:4 Eb6:4 C6:4 | Bb5:4 D6:4 F6:4 D6:4 | G5:4 B5:4 D6:4 F6:4 | G6:8 F6:4 D6:4',
    },
    bass: [[0, 0, 3], [4, 0, 2], [6, 0, 2], [8, 0, 3], [12, 12, 2], [14, 7, 2]],
    drums: { kick: [0, 8, 10], snare: [4, 12], open: [] },
    stab: { steps: [0, 8], oct: 12, wave: 'power' },
    arp: { div: 4, seq: [0, 1, 2, 1], oct: 36, wave: 'bell' },
    mix: { lead: 0.062, bass: 0.15, pad: 0.02, arp: 0.035, stab: 0.028, drums: 1 },
  }),
};

Object.assign(SONGS, {
  ashen: {
    title: 'Ashen Hymn', bpm: 70, bpmStep: 2, swing: 0, lead: 'voice', pad: true, padSound: 'strings',
    chords: {
      A: [[38, [0, 3, 7]], [34, [0, 4, 7]], [36, [0, 4, 7]], [33, [0, 4, 7]], [38, [0, 3, 7]], [41, [0, 4, 7]], [43, [0, 3, 7]], [33, [0, 4, 7]]],
      B: [[34, [0, 4, 7]], [36, [0, 4, 7]], [38, [0, 3, 7]], [38, [0, 3, 7]], [43, [0, 3, 7]], [41, [0, 4, 7]], [43, [0, 3, 7]], [33, [0, 4, 7, 10]]],
    },
    melody: {
      A: [
        [[0, 74, 8], [8, 77, 4], [12, 76, 4]], [[0, 74, 6], [6, 72, 2], [8, 70, 8]],
        [[0, 72, 4], [4, 74, 4], [8, 76, 4], [12, 77, 4]], [[0, 76, 12], [12, 73, 4]],
        [[0, 81, 8], [8, 79, 4], [12, 77, 4]], [[0, 77, 6], [6, 76, 2], [8, 72, 8]],
        [[0, 70, 4], [4, 72, 4], [8, 74, 4], [12, 77, 4]], [[0, 76, 8], [8, 73, 8]],
      ],
      B: [
        [[0, 77, 4], [4, 74, 4], [8, 70, 8]], [[0, 72, 4], [4, 76, 4], [8, 79, 8]],
        [[0, 81, 6], [6, 79, 2], [8, 77, 4], [12, 76, 4]], [[0, 74, 16]],
        [[0, 70, 4], [4, 74, 4], [8, 79, 8]], [[0, 77, 4], [4, 76, 4], [8, 72, 8]],
        [[0, 74, 4], [4, 72, 4], [8, 70, 4], [12, 69, 4]], [[0, 73, 8], [8, 76, 8]],
      ],
    },
    bass: [[0, 0, 8], [8, 0, 8]],
    drums: { kick: [0, 8], snare: [], open: [], fill: false, noHats: true },
    arp: { div: 4, seq: [0, 1, 2, 1], oct: 36, wave: 'bell' },
    octaveUp: false,
    mix: { lead: 0.07, bass: 0.14, pad: 0.03, arp: 0.05, stab: 0, drums: 0.7 },
  },
  wolf: {
    title: 'Windswept Moor', bpm: 96, bpmStep: 3, swing: 0.08, lead: 'fiddle', pad: true, padSound: 'strings',
    chords: {
      A: [[40, [0, 3, 7]], [40, [0, 3, 7]], [38, [0, 4, 7]], [40, [0, 3, 7]], [40, [0, 3, 7]], [36, [0, 4, 7]], [38, [0, 4, 7]], [35, [0, 4, 7]]],
      B: [[45, [0, 3, 7]], [40, [0, 3, 7]], [45, [0, 3, 7]], [47, [0, 4, 7]], [36, [0, 4, 7]], [43, [0, 4, 7]], [45, [0, 3, 7]], [47, [0, 4, 7]]],
    },
    melody: {
      A: [
        [[0, 76, 3], [3, 74, 1], [4, 76, 2], [6, 79, 2], [8, 78, 2], [10, 76, 2], [12, 74, 2], [14, 71, 2]],
        [[0, 76, 6], [6, 74, 2], [8, 71, 4], [12, 69, 2], [14, 71, 2]],
        [[0, 74, 2], [2, 76, 2], [4, 78, 2], [6, 79, 2], [8, 81, 4], [12, 79, 2], [14, 78, 2]],
        [[0, 76, 12], [12, 75, 4]],
        [[0, 83, 3], [3, 81, 1], [4, 83, 2], [6, 84, 2], [8, 83, 2], [10, 81, 2], [12, 79, 2], [14, 78, 2]],
        [[0, 79, 4], [4, 76, 4], [8, 72, 4], [12, 76, 4]],
        [[0, 74, 2], [2, 76, 2], [4, 78, 4], [8, 74, 2], [10, 71, 2], [12, 74, 4]],
        [[0, 75, 4], [4, 71, 4], [8, 75, 4], [12, 78, 4]],
      ],
      B: [
        [[0, 81, 4], [4, 84, 2], [6, 83, 2], [8, 81, 4], [12, 79, 2], [14, 77, 2]],
        [[0, 76, 6], [6, 77, 2], [8, 79, 4], [12, 76, 4]],
        [[0, 81, 2], [2, 79, 2], [4, 77, 2], [6, 76, 2], [8, 77, 4], [12, 81, 4]],
        [[0, 83, 8], [8, 78, 4], [12, 75, 4]],
        [[0, 79, 4], [4, 76, 2], [6, 72, 2], [8, 76, 4], [12, 79, 4]],
        [[0, 79, 6], [6, 78, 2], [8, 74, 4], [12, 71, 4]],
        [[0, 72, 2], [2, 76, 2], [4, 81, 4], [8, 79, 2], [10, 76, 2], [12, 72, 4]],
        [[0, 71, 4], [4, 75, 4], [8, 78, 4], [12, 83, 4]],
      ],
    },
    bass: [[0, 0, 8], [8, 7, 8]],
    drums: { kick: [0, 6, 8], snare: [4, 12, 14], open: [], soft: true, fill: false, noHats: true },
    arp: { div: 2, seq: [0, 2, 1, 2], oct: 24, wave: 'triangle' },
    mix: { lead: 0.065, bass: 0.13, pad: 0.018, arp: 0.035, stab: 0, drums: 1 },
  },
  surge: {
    title: 'Power Surge', bpm: 152, bpmStep: 3, swing: 0, lead: 'saw', pad: false,
    chords: {
      A: [[45, [0, 7, 12]], [40, [0, 7, 12]], [42, [0, 7, 12]], [38, [0, 7, 12]], [45, [0, 7, 12]], [40, [0, 7, 12]], [38, [0, 7, 12]], [40, [0, 7, 12]]],
      B: [[38, [0, 7, 12]], [40, [0, 7, 12]], [45, [0, 7, 12]], [42, [0, 7, 12]], [38, [0, 7, 12]], [40, [0, 7, 12]], [43, [0, 7, 12]], [40, [0, 7, 12]]],
    },
    melody: {
      A: [
        [[0, 76, 2], [2, 78, 2], [4, 81, 4], [8, 83, 2], [10, 81, 2], [12, 78, 4]],
        [[0, 76, 4], [4, 71, 2], [6, 73, 2], [8, 76, 6], [14, 73, 2]],
        [[0, 78, 2], [2, 76, 2], [4, 73, 4], [8, 78, 2], [10, 81, 2], [12, 85, 4]],
        [[0, 83, 8], [8, 81, 4], [12, 80, 4]],
        [[0, 81, 2], [2, 83, 2], [4, 85, 4], [8, 88, 4], [12, 85, 4]],
        [[0, 83, 2], [2, 80, 2], [4, 76, 4], [8, 80, 4], [12, 83, 4]],
        [[0, 81, 4], [4, 78, 4], [8, 74, 2], [10, 76, 2], [12, 78, 4]],
        [[0, 76, 6], [6, 80, 2], [8, 83, 8]],
      ],
      B: [
        [[0, 78, 2], [2, 81, 2], [4, 86, 4], [8, 85, 2], [10, 83, 2], [12, 81, 4]],
        [[0, 80, 4], [4, 76, 4], [8, 71, 4], [12, 76, 4]],
        [[0, 81, 2], [2, 85, 2], [4, 88, 6], [10, 85, 2], [12, 81, 4]],
        [[0, 78, 4], [4, 81, 4], [8, 85, 4], [12, 90, 4]],
        [[0, 86, 2], [2, 85, 2], [4, 83, 2], [6, 81, 2], [8, 78, 4], [12, 81, 4]],
        [[0, 83, 6], [6, 80, 2], [8, 76, 8]],
        [[0, 79, 4], [4, 83, 4], [8, 86, 4], [12, 83, 4]],
        [[0, 80, 4], [4, 83, 4], [8, 88, 8]],
      ],
    },
    bass: [[0, 0, 1], [2, 0, 1], [4, 0, 1], [6, 0, 1], [8, 0, 1], [10, 0, 1], [12, 0, 1], [14, 12, 1]],
    drums: { kick: [0, 8, 10], snare: [4, 12], open: [14], hat16: true },
    stab: { steps: [0, 3, 6, 10], oct: 12, wave: 'power', always: true },
    mix: { lead: 0.06, bass: 0.15, pad: 0, arp: 0, stab: 0.045, drums: 1 },
  },
  lumiere: {
    title: 'Promenade', bpm: 132, bpmStep: 2, swing: 0.06, steps: 12, lead: 'voice', pad: true, padSound: 'strings',
    chords: {
      A: [[41, [0, 3, 7]], [37, [0, 4, 7]], [46, [0, 3, 7]], [36, [0, 4, 7]], [41, [0, 3, 7]], [44, [0, 4, 7]], [37, [0, 4, 7]], [36, [0, 4, 7, 10]]],
      B: [[44, [0, 4, 7]], [39, [0, 4, 7]], [41, [0, 3, 7]], [37, [0, 4, 7]], [46, [0, 3, 7]], [39, [0, 4, 7]], [44, [0, 4, 7]], [36, [0, 4, 7]]],
    },
    melody: {
      A: [
        [[0, 77, 8], [8, 80, 4]], [[0, 84, 6], [6, 82, 2], [8, 80, 4]], [[0, 82, 4], [4, 80, 4], [8, 77, 4]], [[0, 79, 12]],
        [[0, 77, 4], [4, 80, 4], [8, 84, 4]], [[0, 87, 8], [8, 84, 4]], [[0, 85, 4], [4, 84, 4], [8, 80, 4]], [[0, 79, 8], [8, 76, 4]],
      ],
      B: [
        [[0, 84, 8], [8, 82, 4]], [[0, 79, 6], [6, 80, 2], [8, 82, 4]], [[0, 84, 4], [4, 80, 4], [8, 77, 4]], [[0, 80, 12]],
        [[0, 82, 4], [4, 85, 4], [8, 89, 4]], [[0, 87, 6], [6, 85, 2], [8, 82, 4]], [[0, 84, 4], [4, 80, 4], [8, 75, 4]], [[0, 76, 8], [8, 79, 4]],
      ],
    },
    bass: [[0, 0, 4]],
    drums: { kick: [], snare: [], open: [], fill: false, noHats: true },
    stab: { steps: [4, 8], oct: 24, wave: 'piano', always: true },
    arp: { div: 2, seq: [0, 1, 2, 1, 2, 1], oct: 36, wave: 'piano' },
    octaveUp: false,
    mix: { lead: 0.08, bass: 0.13, pad: 0.022, arp: 0.03, stab: 0.04, drums: 0 },
  },
  gommage: {
    title: 'Farewell, Tower', bpm: 84, bpmStep: 0, swing: 0.05, steps: 12, lead: 'voice', pad: true, padSound: 'strings',
    chords: {
      A: [[44, [0, 4, 7]], [41, [0, 3, 7]], [37, [0, 4, 7]], [39, [0, 4, 7]], [44, [0, 4, 7]], [48, [0, 3, 7]], [37, [0, 4, 7]], [39, [0, 4, 7, 10]]],
      B: [[41, [0, 3, 7]], [37, [0, 4, 7]], [44, [0, 4, 7]], [39, [0, 4, 7]], [41, [0, 3, 7]], [46, [0, 3, 7]], [37, [0, 4, 7]], [39, [0, 4, 7]]],
    },
    melody: {
      A: [
        [[0, 80, 8], [8, 79, 4]], [[0, 77, 8], [8, 75, 4]], [[0, 77, 4], [4, 80, 4], [8, 84, 4]], [[0, 82, 12]],
        [[0, 84, 8], [8, 82, 4]], [[0, 79, 8], [8, 80, 4]], [[0, 77, 4], [4, 75, 4], [8, 73, 4]], [[0, 75, 12]],
      ],
      B: [
        [[0, 77, 8], [8, 80, 4]], [[0, 85, 8], [8, 84, 4]], [[0, 84, 4], [4, 80, 4], [8, 77, 4]], [[0, 79, 12]],
        [[0, 77, 4], [4, 80, 4], [8, 85, 4]], [[0, 82, 8], [8, 80, 4]], [[0, 80, 4], [4, 77, 4], [8, 73, 4]], [[0, 75, 8], [8, 80, 4]],
      ],
    },
    bass: [[0, 0, 12]],
    drums: { kick: [], snare: [], open: [], fill: false, noHats: true },
    stab: { steps: [4, 8], oct: 24, wave: 'piano', always: true },
    octaveUp: false,
    mix: { lead: 0.07, bass: 0.12, pad: 0.02, arp: 0, stab: 0.04, drums: 0 },
  },
});

const ARRANGEMENT = [
  { sec: 'A', bars: 4, layers: 'pad arp' },
  { sec: 'A', bars: 8, layers: 'pad bass drums lead' },
  { sec: 'A', bars: 8, layers: 'pad bass drums lead arp' },
  { sec: 'B', bars: 8, layers: 'pad bass drums lead arp' },
  { sec: 'B', bars: 4, layers: 'pad bass arp' },
  { sec: 'A', bars: 8, layers: 'pad bass drums lead arp', octave: 12 },
].map(s => Object.assign(s, { has: new Set(s.layers.split(' ')) }));
const LOOP_FROM = 1;

const LEAD_SOUNDS = {
  pulse: { waves: ['square', 'sawtooth'], detune: 6, cutoff: 2800 },
  saw: { waves: ['sawtooth', 'sawtooth'], detune: 9, cutoff: 2300 },
  square: { waves: ['square', 'square'], detune: 7, cutoff: 3200 },
  soft: { waves: ['triangle', 'sine'], detune: 4, cutoff: 4000 },
  fiddle: { waves: ['sawtooth', 'sawtooth'], detune: 5, cutoff: 2600, attack: 0.04, vib: 24, vibRate: 6.2 },
  voice: { waves: ['sine', 'triangle'], detune: 3, cutoff: 2000, attack: 0.12, vib: 16, vibRate: 5 },
  grim: { waves: ['sawtooth', 'square'], detune: 12, cutoff: 1700, attack: 0.015, vib: 12, vibRate: 5.2 },
  organ: { waves: ['square', 'sawtooth'], detune: 4, cutoff: 1900, attack: 0.01, vib: 7, vibRate: 6.4 },
};

const Sfx = (() => {
  let ac = null, master = null, sfxBus = null, noiseBuf = null, shaper = null;
  let muted = load('muted', false);
  let pendingSong = null;

  function init() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try { ac = new AC({ latencyHint: isTouch || IN_ANDROID ? 'balanced' : 'interactive' }); } catch (e) { ac = new AC(); }
      master = ac.createGain();
      master.gain.value = 0.4 * settings.master / 10;
      master.connect(ac.destination);
      sfxBus = ac.createGain();
      sfxBus.gain.value = settings.sfx / 10;
      sfxBus.connect(master);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      if (pendingSong) { const s = pendingSong; pendingSong = null; music.play(s); }
    }
    if (ac.state === 'suspended') ac.resume();
  }
  function out(node, pan) {
    if (pan && ac.createStereoPanner) {
      const p = ac.createStereoPanner();
      p.pan.value = pan;
      node.connect(p); p.connect(sfxBus);
    } else node.connect(sfxBus);
  }
  function tone(f0, f1, dur, type, vol, delay = 0, pan = 0) {
    if (!ac || muted) return;
    const t = ac.currentTime + delay;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); out(g, pan);
    o.start(t); o.stop(t + dur + 0.03);
  }
  function noise(dur, vol, freq, delay = 0, pan = 0) {
    if (!ac || muted) return;
    const t = ac.currentTime + delay;
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf;
    f.type = 'lowpass'; f.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); out(g, pan);
    s.start(t); s.stop(t + dur + 0.02);
  }
  const SCALE = [440, 523, 659, 831, 880, 1047, 1319, 1661];
  const STEPS = [440, 494, 523, 587, 659, 698, 831, 880, 988, 1047, 1175];

  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const musicVol = () => 0.75 * settings.music / 10;
  let mBus = null, duck = null, leadBus = null, drumBus = null, revIn = null, echo = null, conv = null, revOn = false;
  let song = SONGS.lobby, songId = null;
  let mTimer = null, mPlaying = false, mNext = 0, mLevel = 0;
  let secIdx = 0, barInSec = 0, step = 0, key = 0, zoneKey = 0;
  let musicOn = load('music', true);
  const bpm = () => song.bpm + mLevel * song.bpmStep;

  function impulse(seconds) {
    const len = (ac.sampleRate * seconds) | 0, buf = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return buf;
  }
  function send(from, amount, to) { const g = ac.createGain(); g.gain.value = amount; from.connect(g); g.connect(to); }
  function ensureBus() {
    if (mBus) return;
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.005; comp.release.value = 0.15;
    const toneF = ac.createBiquadFilter();
    toneF.type = 'lowpass'; toneF.frequency.value = 8000;
    mBus = ac.createGain(); mBus.gain.value = 0;
    mBus.connect(toneF); toneF.connect(comp); comp.connect(master);
    duck = ac.createGain(); duck.connect(mBus);
    leadBus = ac.createGain(); leadBus.connect(mBus);
    drumBus = ac.createGain(); drumBus.connect(mBus);
    conv = ac.createConvolver();
    conv.buffer = impulse(2.4);
    const revTone = ac.createBiquadFilter();
    revTone.type = 'lowpass'; revTone.frequency.value = 3200;
    conv.connect(revTone);
    revIn = ac.createGain();
    send(revTone, 0.3, mBus);
    routeReverb();
    send(leadBus, 0.75, revIn); send(duck, 0.42, revIn); send(drumBus, 0.22, revIn);
    echo = ac.createDelay(1.5);
    const fb = ac.createGain(), lp = ac.createBiquadFilter();
    fb.gain.value = 0.3; lp.type = 'lowpass'; lp.frequency.value = 2400;
    leadBus.connect(echo); echo.connect(lp); lp.connect(fb); fb.connect(echo);
    send(lp, 0.32, mBus);
  }
  function routeReverb() {
    if (!revIn || revOn === !LOW) return;
    revOn = !LOW;
    if (revOn) revIn.connect(conv); else revIn.disconnect();
  }
  function tuneEcho() { echo.delayTime.setValueAtTime(60 / bpm() * 0.75, ac.currentTime); }

  function envelope(g, t, attack, decay, sustain, release, dur, peak) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.setTargetAtTime(peak * sustain, t + attack, decay / 3);
    g.gain.setTargetAtTime(0.0001, t + Math.max(dur, attack), release / 4);
  }
  function osc(type, freq, t, end, detune = 0) {
    const o = ac.createOscillator();
    o.type = type; o.frequency.value = freq; o.detune.value = detune;
    o.start(t); o.stop(end);
    return o;
  }
  function playLead(t, m, dur, vol) {
    const p = LEAD_SOUNDS[song.lead], end = t + dur + 0.5;
    const f = ac.createBiquadFilter();
    f.type = 'lowpass'; f.Q.value = 1.4;
    f.frequency.setValueAtTime(p.cutoff * 0.35, t);
    f.frequency.exponentialRampToValueAtTime(p.cutoff, t + 0.03);
    f.frequency.setTargetAtTime(p.cutoff * 0.6, t + 0.05, 0.2);
    const g = ac.createGain();
    envelope(g, t, p.attack || 0.008, 0.15, 0.7, 0.14, dur, vol);
    f.connect(g); g.connect(leadBus);
    let vib = null;
    if (dur > 0.28 && !LOW) {
      const lfo = osc('sine', p.vibRate || 5.5, t, end);
      vib = ac.createGain();
      vib.gain.setValueAtTime(0, t);
      vib.gain.linearRampToValueAtTime(p.vib || 14, t + 0.3);
      lfo.connect(vib);
    }
    (LOW ? p.waves.slice(0, 1) : p.waves).forEach((w, i) => {
      const o = osc(w, mtof(m), t, end, LOW ? 0 : (i ? 1 : -1) * p.detune);
      if (vib) vib.connect(o.detune);
      o.connect(f);
    });
  }
  function playBass(t, m, dur, vol) {
    const end = t + dur + 0.3;
    const f = ac.createBiquadFilter();
    f.type = 'lowpass'; f.Q.value = 4;
    f.frequency.setValueAtTime(950, t);
    f.frequency.setTargetAtTime(260, t + 0.01, 0.08);
    const g = ac.createGain();
    envelope(g, t, 0.005, 0.12, 0.65, 0.06, dur, vol);
    osc('sawtooth', mtof(m), t, end).connect(f);
    const sub = ac.createGain(); sub.gain.value = 0.9;
    osc('sine', mtof(m - 12), t, end).connect(sub);
    f.connect(g); sub.connect(g); g.connect(duck);
  }
  function playPad(t, notes, dur, vol, kind) {
    const end = t + dur + 0.6;
    const strings = kind === 'strings', organ = kind === 'organ';
    const f = ac.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = strings ? 950 : organ ? 1100 : 1300; f.Q.value = 0.5;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + (organ ? 0.03 : strings ? Math.min(0.7, dur * 0.4) : Math.min(0.4, dur * 0.3)));
    g.gain.setValueAtTime(vol, t + dur * 0.85);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + (strings ? 0.5 : 0.3));
    f.connect(g); g.connect(duck);
    const detunes = LOW ? (strings ? [-8, 8] : [0]) : strings ? [-12, -4, 5, 13] : [-9, 9];
    for (const n of notes) for (const d of detunes) osc(organ ? 'square' : 'sawtooth', mtof(n), t, end, d).connect(f);
  }
  function distortion() {
    if (shaper) return shaper;
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; curve[i] = Math.tanh(x * 4); }
    shaper = curve;
    return shaper;
  }
  function playPluck(t, m, dur, vol, wave) {
    if (wave === 'bell') {
      const end = t + 2.2, g = ac.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2);
      osc('sine', mtof(m), t, end).connect(g);
      const p2 = ac.createGain(); p2.gain.value = 0.35;
      osc('sine', mtof(m) * 2.76, t, end).connect(p2); p2.connect(g);
      g.connect(duck);
      return;
    }
    if (wave === 'piano') {
      const end = t + 1.4, g = ac.createGain(), f = ac.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.setValueAtTime(3500, t); f.frequency.setTargetAtTime(1200, t + 0.01, 0.25);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.005);
      g.gain.setTargetAtTime(0.0001, t + 0.01, 0.35);
      osc('triangle', mtof(m), t, end).connect(f);
      const oct = ac.createGain(); oct.gain.value = 0.25;
      osc('sine', mtof(m + 12), t, end).connect(oct); oct.connect(f);
      f.connect(g); g.connect(duck);
      return;
    }
    if (wave === 'harp') {
      const end = t + 1.7, g = ac.createGain(), f = ac.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.setValueAtTime(5200, t); f.frequency.setTargetAtTime(1800, t + 0.01, 0.2);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.004);
      g.gain.setTargetAtTime(0.0001, t + 0.01, 0.3);
      osc('sine', mtof(m), t, end).connect(f);
      const h2 = ac.createGain(); h2.gain.value = 0.35;
      osc('triangle', mtof(m + 12), t, end).connect(h2); h2.connect(f);
      f.connect(g); g.connect(duck);
      return;
    }
    if (wave === 'marimba') {
      const end = t + 0.8, g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.003);
      g.gain.setTargetAtTime(0.0001, t + 0.004, 0.09);
      osc('sine', mtof(m), t, end).connect(g);
      const h4 = ac.createGain(); h4.gain.value = 0.28;
      osc('sine', mtof(m) * 4, t, end).connect(h4); h4.connect(g);
      g.connect(duck);
      return;
    }
    if (wave === 'power') {
      const end = t + dur + 0.3, g = ac.createGain(), ws = ac.createWaveShaper(), f = ac.createBiquadFilter();
      ws.curve = distortion();
      f.type = 'lowpass'; f.frequency.value = 2400;
      envelope(g, t, 0.004, 0.2, 0.6, 0.08, dur, vol);
      osc('sawtooth', mtof(m), t, end, -6).connect(ws);
      osc('sawtooth', mtof(m), t, end, 6).connect(ws);
      ws.connect(f); f.connect(g); g.connect(duck);
      return;
    }
    const end = t + dur + 0.3;
    const f = ac.createBiquadFilter();
    f.type = 'lowpass'; f.Q.value = 2;
    f.frequency.setValueAtTime(5000, t);
    f.frequency.setTargetAtTime(900, t + 0.005, 0.06);
    const g = ac.createGain();
    envelope(g, t, 0.004, 0.12, 0.25, 0.1, dur, vol);
    osc(wave, mtof(m), t, end).connect(f);
    f.connect(g); g.connect(duck);
  }
  function noiseHit(t, dur, vol, type, freq, q, dest) {
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf;
    f.type = type; f.frequency.value = freq; f.Q.value = q || 0.7;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || drumBus);
    s.start(t); s.stop(t + dur + 0.02);
  }
  function kick(t, v) {
    const o = osc('sine', 140, t, t + 0.42), g = ac.createGain();
    o.frequency.exponentialRampToValueAtTime(38, t + 0.16);
    g.gain.setValueAtTime(0.95 * v, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    o.connect(g); g.connect(drumBus);
    noiseHit(t, 0.014, 0.2 * v, 'highpass', 1600);
    duck.gain.setValueAtTime(0.5, t);
    duck.gain.linearRampToValueAtTime(1, t + 0.2);
  }
  function snare(t, v, soft) {
    if (soft) { noiseHit(t, 0.05, 0.12 * v, 'bandpass', 3200, 1.5); return; }
    noiseHit(t, 0.24, 0.3 * v, 'bandpass', 1450, 0.7);
    const o = osc('triangle', 170, t, t + 0.14), g = ac.createGain();
    o.frequency.exponentialRampToValueAtTime(105, t + 0.11);
    g.gain.setValueAtTime(0.22 * v, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    o.connect(g); g.connect(drumBus);
  }
  function hat(t, open, v) { noiseHit(t, open ? 0.2 : 0.035, (open ? 0.07 : 0.05) * v, 'highpass', 6800); }
  function crash(t, v) { noiseHit(t, 1.8, 0.085 * v, 'highpass', 4200); }

  function scheduleStep(t) {
    const sec = ARRANGEMENT[secIdx], has = sec.has, sd = 60 / bpm() / 4, s = step, mix = song.mix, steps = song.steps || 16;
    if (s & 1) t += sd * song.swing;
    const bar = barInSec % 8;
    const [root0, chord] = song.chords[sec.sec][bar];
    const root = root0 + key;
    const drums = has.has('drums');
    const lastBar = barInSec === sec.bars - 1;
    if (drums) {
      const d = song.drums;
      if (s === 0 && barInSec === 0) crash(t, mix.drums);
      if (d.kick.includes(s)) kick(t, mix.drums);
      const fill = lastBar && s >= steps - 4 && d.fill !== false;
      if (d.snare.includes(s) || fill) snare(t, mix.drums * (fill ? 0.55 + (s - (steps - 4)) * 0.15 : 1), d.soft);
      if (!d.noHats && (s % 2 === 0 || d.hat16 || (song.hatUp && mLevel >= 3))) hat(t, d.open.includes(s), mix.drums * (s % 4 === 2 ? 1 : 0.65));
    } else if (song.drums.pulse && s === 0 && has.has('pad')) {
      kick(t, mix.drums * 0.5);
    }
    if (s === 0 && has.has('pad') && song.pad) playPad(t, chord.map(i => root + 24 + i), sd * steps, mix.pad, song.padSound);
    if (has.has('bass')) for (const [bs, off, len] of song.bass) if (bs === s) playBass(t, (song.fix ? song.fix(root0 + off) : root0 + off) + key, sd * len * 0.92, mix.bass);
    if (song.stab && (has.has('pad') || song.stab.always) && song.stab.steps.includes(s)) for (const iv of chord) playPluck(t, root + song.stab.oct + iv, sd * 1.3, mix.stab, song.stab.wave);
    if (has.has('arp') && song.arp && s % song.arp.div === 0) {
      const a = song.arp, idx = a.seq[(s / a.div) % a.seq.length] % chord.length;
      playPluck(t, root + a.oct + chord[idx], sd * a.div * 0.9, mix.arp, a.wave);
    }
    if (has.has('lead')) {
      const up = song.octaveUp === false ? 0 : (sec.octave || 0);
      for (const [ls, note, len] of song.melody[sec.sec][bar]) if (ls === s) playLead(t, note + key + up, sd * len * 0.95, mix.lead);
    }
  }
  function advance() {
    if (++step < (song.steps || 16)) return;
    step = 0;
    key = zoneKey;
    if (++barInSec < ARRANGEMENT[secIdx].bars) return;
    barInSec = 0;
    if (++secIdx >= ARRANGEMENT.length) secIdx = LOOP_FROM;
  }
  function pump() {
    if (!mPlaying) return;
    const now = ac.currentTime;
    if (mNext < now) mNext = now + 0.02;
    const audible = musicOn && !muted;
    while (mNext < now + (LOW ? 0.45 : 0.3)) {
      if (audible) scheduleStep(mNext);
      mNext += 60 / bpm() / 4;
      advance();
    }
  }
  function fadeTo(v, time) {
    const t = ac.currentTime;
    mBus.gain.cancelScheduledValues(t);
    mBus.gain.setValueAtTime(mBus.gain.value, t);
    mBus.gain.linearRampToValueAtTime(v, t + time);
  }
  let handover = 0, queued = null;
  function begin(id, fadeIn, keepLevel) {
    songId = id; song = SONGS[id];
    secIdx = 0; barInSec = 0; step = 0; key = zoneKey = 0;
    if (!keepLevel) mLevel = 0;
    tuneEcho();
    mNext = ac.currentTime + 0.06;
    mPlaying = true;
    if (fadeIn > 0.1) { mBus.gain.cancelScheduledValues(ac.currentTime); mBus.gain.setValueAtTime(0.0001, ac.currentTime); }
    fadeTo(musicVol(), fadeIn);
    if (!mTimer) mTimer = setInterval(pump, 25);
    pump();
  }
  const music = {
    play(id, restart = true, fadeIn = 0.05) {
      if (!ac) { pendingSong = id; return; }
      ensureBus();
      if (!restart && songId === id && mPlaying) return;
      const token = ++handover;
      queued = null;
      if (fadeIn > 0.1 && mPlaying && songId) {
        const out = Math.min(1.6, fadeIn);
        fadeTo(0, out);
        setTimeout(() => {
          if (token !== handover) return;
          if (mPlaying) begin(id, fadeIn, true); else queued = { id, fadeIn };
        }, out * 1000);
        return;
      }
      begin(id, fadeIn, false);
    },
    stop() { handover++; queued = null; pendingSong = null; if (mBus) { mPlaying = false; fadeTo(0, 0.8); } },
    pause() { if (mBus) { mPlaying = false; fadeTo(0, 0.15); } },
    resume() {
      if (!mBus) return;
      if (queued) { const q = queued; queued = null; begin(q.id, q.fadeIn, true); return; }
      mPlaying = true; mNext = ac.currentTime + 0.05; fadeTo(musicVol(), 0.2);
    },
    setLevel(l) { if (l === mLevel) return; mLevel = l; if (echo) tuneEcho(); },
    setKey(semitones) { zoneKey = semitones; },
    get on() { return musicOn; },
    get title() { return songId ? SONGS[songId].title : ''; },
    get current() { return songId; },
    toggle() { musicOn = !musicOn; save('music', musicOn); },
  };

  return {
    init, music, routeReverb,
    setActive(on) {
      if (!ac) return;
      if (on) ac.resume(); else ac.suspend();
    },
    get muted() { return muted; },
    toggle() { muted = !muted; save('muted', muted); },
    applyVolumes() {
      if (!ac) return;
      master.gain.setTargetAtTime(0.4 * settings.master / 10, ac.currentTime, 0.05);
      sfxBus.gain.setTargetAtTime(settings.sfx / 10, ac.currentTime, 0.05);
      if (mBus && mPlaying) mBus.gain.setTargetAtTime(musicVol(), ac.currentTime, 0.05);
    },
    jump(p) { tone(240 + p * 220, 480 + p * 760, 0.15 + p * 0.08, 'square', 0.09); },
    land() { noise(0.07, 0.3, 700); },
    bounce() { tone(160, 520, 0.13, 'triangle', 0.28); },
    step(n) { tone(STEPS[Math.min(n, 10)], 0, 0.07, 'triangle', 0.07); tone(STEPS[Math.min(n, 10)] * 2, 0, 0.04, 'square', 0.02); },
    combo(level) {
      const n = 3 + Math.min(level, 5);
      for (let i = 0; i < n; i++) { tone(SCALE[i], 0, 0.16, 'sawtooth', 0.05, i * 0.06); tone(SCALE[i] / 2, 0, 0.16, 'triangle', 0.06, i * 0.06); }
      tone(SCALE[n - 1] / 4, 0, 0.7, 'triangle', 0.2, n * 0.06);
      noise(0.5, 0.12, 1800, n * 0.06);
    },
    hurry() {
      for (const [f, v, d] of [[98, 0.3, 1.8], [196, 0.18, 1.4], [270, 0.12, 1.1], [530, 0.06, 0.7]]) { tone(f, 0, d, 'sine', v); tone(f, 0, d * 0.8, 'sine', v * 0.6, 0.55); }
      noise(0.9, 0.12, 260);
    },
    milestone() { [440, 523, 659, 880, 831, 880].forEach((f, i) => tone(f, 0, 0.2, 'sawtooth', 0.06, i * 0.11)); },
    start() { tone(392, 784, 0.25, 'square', 0.08); },
    beep(go) { tone(go ? 1047 : 523, 0, go ? 0.35 : 0.15, 'square', 0.12); },
    finish() {
      [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, 0, 0.16, 'square', 0.09, i * 0.08));
      [1047, 1319, 1568].forEach(f => tone(f, 0, 0.9, 'triangle', 0.12, 0.55));
    },
    unlock() { [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0, 0.2, 'triangle', 0.2, i * 0.09)); },
    firework() { tone(300 + Math.random() * 500, 120, 0.3, 'triangle', 0.05); noise(0.45, 0.2, 2200, 0.25); },
    move() { tone(620, 0, 0.04, 'square', 0.05); },
    select() { tone(523, 1047, 0.12, 'square', 0.08); },
    nope() { tone(220, 150, 0.15, 'square', 0.08); },
    broken() { tone(600, 120, 0.5, 'sawtooth', 0.14); noise(0.3, 0.25, 900); },
    over() { tone(440, 90, 1.0, 'sawtooth', 0.14); noise(0.5, 0.15, 300, 0.1); },
    crash() { noise(0.22, 0.28, 520); tone(170, 60, 0.18, 'triangle', 0.14); },
    hit() { tone(360, 110, 0.32, 'square', 0.12); noise(0.2, 0.32, 1300); },
    warn() { tone(1180, 0, 0.05, 'square', 0.04); },
    goblin() { [880, 1240, 760, 1320].forEach((f, i) => tone(f, f * 0.7, 0.07, 'square', 0.05, i * 0.07)); },
    goblinKing() { [300, 240, 360, 200].forEach((f, i) => tone(f, f * 0.6, 0.18, 'sawtooth', 0.09, i * 0.16)); },
    bonk() { tone(260, 120, 0.08, 'square', 0.09); },
    gStep(n, p, k) { noise(0.04, 0.16 * n, 900 * k, 0, p); tone(150 * k, 90 * k, 0.05, 'square', 0.05 * n, 0, p); },
    gWind(n, p, k) { tone(300 * k, 190 * k, 0.09, 'square', 0.05 * n, 0, p); },
    gJump(n, p, k) { tone(240 * k, 640 * k, 0.17, 'sawtooth', 0.09 * n, 0, p); tone(480 * k, 920 * k, 0.1, 'square', 0.04 * n, 0.03, p); },
    gLand(n, p, k) { noise(0.16, 0.34 * n, 420 * k, 0, p); tone(110 * k, 45 * k, 0.2, 'sine', 0.22 * n, 0, p); },
    gBonk(n, p, k) { tone(210 * k, 90 * k, 0.09, 'square', 0.08 * n, 0, p); },
    gCackle(n, p, k) { for (let i = 0; i < 6; i++) tone(((i & 1) ? 780 : 560) * k + i * 28, ((i & 1) ? 620 : 700) * k, 0.07, 'square', 0.07 * n, i * 0.078, p); },
    gSnarl(n, p, k) { for (let i = 0; i < 4; i++) tone(96 * k + i * 6, 68 * k, 0.12, 'sawtooth', 0.1 * n, i * 0.1, p); noise(0.34, 0.08 * n, 520, 0, p); },
    twist() { tone(260, 980, 0.32, 'sawtooth', 0.07); tone(390, 1470, 0.32, 'square', 0.04, 0.05); },
  };
})();
