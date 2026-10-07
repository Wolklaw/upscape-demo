'use strict';

Object.assign(LEAD_SOUNDS, {
  chip: { waves: ['square'], detune: 0, cutoff: 5200 },
  flute: { waves: ['triangle', 'sine'], detune: 3, cutoff: 3600, attack: 0.05, vib: 20, vibRate: 5.4 },
  brass: { waves: ['sawtooth', 'square'], detune: 5, cutoff: 2100, attack: 0.03, vib: 10, vibRate: 5.8 },
  choir: { waves: ['sine', 'triangle'], detune: 4, cutoff: 1800, attack: 0.22, vib: 22, vibRate: 4.6 },
  synth: { waves: ['sawtooth', 'sawtooth'], detune: 11, cutoff: 3400 },
});

const OFFBEAT = [[2, 0, 2], [6, 7, 2], [10, 0, 2], [14, 7, 2]];
const OOMPAH = [[0, 0, 2], [4, 12, 2], [8, 0, 2], [12, 12, 2]];
const BOUNCE = [[0, 0, 2], [2, 12, 2], [4, 0, 2], [6, 12, 2], [8, 0, 2], [10, 12, 2], [12, 0, 2], [14, 12, 2]];
const CHUG = [[0, 0, 2], [2, 0, 2], [4, 0, 2], [6, 0, 2], [8, 0, 2], [10, 0, 2], [12, 0, 2], [14, 0, 2]];
const HELD = [[0, 0, 8], [8, 0, 8]];

Object.assign(SONGS, {
  dunes: composeSong({
    title: 'Dune Road', bpm: 78, bpmStep: 2, swing: 0, lead: 'flute', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Dm Bb F C Dm Gm C A',
      melody: 'A4:8 D5:4 C5:4 | Bb4:6 C5:2 D5:8 | C5:4 A4:4 F4:8 | G4:6 E4:2 G4:8 | A4:8 D5:4 E5:4 | F5:6 D5:2 Bb4:8 | E5:4 G5:4 E5:4 C5:4 | C#5:8 E5:4 A4:4',
    },
    B: {
      chords: 'F C Dm Bb F C Gm A',
      melody: 'C5:4 F5:4 A5:8 | G5:6 E5:2 G5:8 | F5:4 A5:4 D6:8 | C6:6 Bb5:2 F5:8 | A5:4 G5:4 F5:4 C5:4 | E5:6 G5:2 C6:8 | Bb5:6 A5:2 G5:4 D5:4 | C#5:4 E5:4 A5:8',
    },
    bass: HELD,
    drums: { kick: [0, 10], snare: [], open: [], soft: true, fill: false, noHats: true },
    arp: { div: 2, seq: [0, 1, 2, 1], oct: 24, wave: 'harp' },
    mix: { lead: 0.07, bass: 0.12, pad: 0.03, arp: 0.04, stab: 0, drums: 0.5 },
  }),
  grove: composeSong({
    title: 'Moonlit Grove', minor: 'C', bpm: 104, bpmStep: 4, swing: 0.1, lead: 'flute', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'C G Am F C G F G',
      melody: 'G4:2 C5:4 E5:2 G5:4 E5:2 C5:2 | D5:4 B4:2 G4:4 B4:2 D5:4 | E5:2 A5:4 G5:2 E5:4 C5:4 | A4:4 C5:2 F5:6 E5:2 C5:2 | G4:2 C5:4 E5:2 G5:4 C6:4 | B5:4 A5:2 G5:4 D5:6 | A5:4 G5:2 F5:4 C5:4 A4:2 | B4:4 D5:4 G5:8',
    },
    B: {
      chords: 'Am F C G Am Dm G C',
      melody: 'A5:4 C6:4 B5:2 A5:2 E5:4 | F5:4 A5:4 G5:2 F5:2 C5:4 | E5:4 G5:4 C6:8 | D6:4 B5:4 G5:8 | C6:4 E6:4 D6:2 C6:2 A5:4 | D6:4 F6:4 E6:2 D6:2 A5:4 | B5:4 D6:4 G6:4 F6:2 D6:2 | C6:12 G5:4',
    },
    bass: [[0, 0, 2], [4, 7, 2], [8, 0, 2], [12, 7, 2]],
    drums: { kick: [0, 8], snare: [12], open: [], soft: true, fill: false },
    arp: { div: 2, seq: [0, 1, 2, 1], oct: 24, wave: 'harp' },
    mix: { lead: 0.075, bass: 0.12, pad: 0.02, arp: 0.04, stab: 0, drums: 0.8 },
  }),
  peak: composeSong({
    title: 'Lilac Peak', bpm: 118, bpmStep: 4, swing: 0, lead: 'soft', pad: true, octaveUp: false,
    A: {
      chords: 'Em C G D Em C D D',
      melody: 'B4:2 E5:2 G5:4 F#5:2 E5:2 B4:4 | C5:2 E5:2 G5:4 E5:2 C5:2 G4:4 | D5:2 G5:2 B5:4 A5:2 G5:2 D5:4 | F#5:4 A5:4 D6:4 A5:2 F#5:2 | G5:2 B5:2 E6:4 D6:2 B5:2 G5:4 | E6:4 C6:4 G5:4 E5:4 | F#5:2 A5:2 D6:4 C#6:2 A5:2 F#5:4 | D5:8 A4:4 D5:4',
    },
    B: {
      chords: 'G D Em C G D C D',
      melody: 'B5:4 D6:4 G6:8 | A5:4 D6:4 F#6:8 | G6:4 E6:4 B5:8 | E6:4 G6:2 E6:2 C6:8 | D6:2 G6:2 B6:4 A6:2 G6:2 D6:4 | A5:2 D6:2 F#6:4 E6:2 D6:2 A5:4 | G5:4 C6:4 E6:4 G6:4 | F#6:8 D6:4 A5:4',
    },
    bass: [[0, 0, 4], [6, 0, 2], [8, 7, 4], [14, 12, 2]],
    drums: { kick: [0, 8], snare: [12], open: [], soft: true },
    stab: { steps: [0, 6, 10], oct: 24, wave: 'piano' },
    arp: { div: 2, seq: [0, 1, 2, 1], oct: 36, wave: 'piano' },
    mix: { lead: 0.07, bass: 0.13, pad: 0.016, arp: 0.03, stab: 0.025, drums: 0.7 },
  }),
  nord: composeSong({
    title: 'Wyrm Pass', bpm: 74, bpmStep: 2, swing: 0, lead: 'choir', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Dm Dm Bb C Dm F C Dm',
      melody: 'D5:8 F5:4 E5:4 | D5:6 A4:2 C5:8 | D5:8 F5:4 D5:4 | E5:6 D5:2 C5:8 | A5:8 G5:4 F5:4 | A5:6 G5:2 F5:8 | G5:4 E5:4 C5:4 D5:4 | D5:12 A4:4',
    },
    B: {
      chords: 'Bb F C Dm Bb Gm A Dm',
      melody: 'D6:8 Bb5:4 D6:4 | C6:6 A5:2 F5:8 | E6:8 D6:4 C6:4 | D6:6 A5:2 F5:8 | F6:8 D6:4 Bb5:4 | G6:6 F6:2 D6:8 | E6:4 C#6:4 A5:4 E5:4 | D6:12 A5:4',
    },
    bass: HELD,
    drums: { kick: [0, 6], snare: [], open: [], fill: false, noHats: true },
    arp: { div: 4, seq: [0, 1, 2, 1], oct: 36, wave: 'bell' },
    mix: { lead: 0.07, bass: 0.15, pad: 0.03, arp: 0.045, stab: 0, drums: 0.9 },
  }),
  cubic: composeSong({
    title: 'Patchwork Plains', minor: 'C', bpm: 68, bpmStep: 2, swing: 0, lead: 'soft', pad: true, octaveUp: false,
    A: {
      chords: 'C Am F G C Em F G',
      melody: 'E5:4 -:4 G5:4 E5:4 | E5:4 C5:4 A4:8 | F5:4 -:4 A5:4 G5:4 | D5:8 B4:8 | G5:4 E5:4 C5:4 -:4 | B4:4 E5:4 G5:8 | A5:4 G5:4 F5:4 C5:4 | D5:12 -:4',
    },
    B: {
      chords: 'C G Am Em F C Dm G',
      melody: 'C6:8 G5:4 E5:4 | D6:8 B5:4 G5:4 | C6:6 B5:2 A5:8 | B5:4 G5:4 E5:8 | A5:8 C6:4 F6:4 | E6:8 C6:4 G5:4 | F6:6 E6:2 D6:8 | B5:8 D6:4 G5:4',
    },
    bass: [[0, 0, 8], [8, 7, 8]],
    drums: { kick: [], snare: [], open: [], fill: false, noHats: true },
    stab: { steps: [0, 6, 10], oct: 24, wave: 'piano', always: true },
    arp: { div: 4, seq: [0, 2, 1, 2], oct: 36, wave: 'bell' },
    mix: { lead: 0.075, bass: 0.1, pad: 0.024, arp: 0.038, stab: 0.045, drums: 0 },
  }),
  hollow: composeSong({
    title: 'Lantern Depths', bpm: 64, bpmStep: 2, swing: 0, lead: 'voice', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Am F Dm E Am F G E',
      melody: 'E5:8 C5:4 D5:4 | C5:6 A4:2 C5:8 | D5:8 F5:4 A5:4 | G#4:6 B4:2 E5:8 | C6:8 B5:4 A5:4 | A5:6 G5:2 F5:8 | D5:6 G5:2 B5:8 | G#5:8 E5:8',
    },
    B: {
      chords: 'F G Am C Dm F E E',
      melody: 'A5:8 C6:4 A5:4 | B5:8 D6:4 B5:4 | C6:6 B5:2 A5:8 | E6:8 D6:4 C6:4 | D6:8 A5:4 F5:4 | C6:6 A5:2 F5:8 | B5:6 G#5:2 E5:8 | G#5:8 B5:8',
    },
    bass: [[0, 0, 16]],
    drums: { kick: [0], snare: [], open: [], soft: true, fill: false, noHats: true, pulse: true },
    arp: { div: 4, seq: [0, 1, 2, 1], oct: 36, wave: 'piano' },
    mix: { lead: 0.065, bass: 0.12, pad: 0.03, arp: 0.04, stab: 0, drums: 0.5 },
  }),
  barrel: composeSong({
    title: 'Girder Rush', minor: 'C', bpm: 138, bpmStep: 5, swing: 0.1, lead: 'chip', pad: false, octaveUp: false,
    A: {
      chords: 'C C F F C G C G',
      melody: 'C5:2 E5:2 G5:2 E5:2 C5:2 E5:2 G5:4 | A5:2 G5:2 E5:2 C5:2 D5:2 E5:2 G5:4 | F5:2 A5:2 C6:2 A5:2 F5:2 A5:2 C6:4 | D6:2 C6:2 A5:2 F5:2 G5:2 A5:2 C6:4 | E5:2 G5:2 C6:2 G5:2 E5:2 G5:2 C6:4 | D6:2 B5:2 G5:2 B5:2 D6:2 B5:2 G5:4 | C6:2 G5:2 E5:2 G5:2 C6:2 E6:2 G6:4 | F6:2 D6:2 B5:2 G5:2 A5:2 B5:2 D6:4',
    },
    B: {
      chords: 'Am Am Dm G C F G C',
      melody: 'A5:2 C6:2 E6:2 C6:2 A5:2 C6:2 E6:4 | D6:2 C6:2 A5:2 E5:2 A5:2 C6:2 A5:4 | D6:2 F6:2 D6:2 A5:2 F5:2 A5:2 D6:4 | G5:2 B5:2 D6:2 G6:2 D6:2 B5:2 G5:4 | E6:2 D6:2 C6:2 D6:2 E6:2 G6:2 C6:4 | C6:2 A5:2 F5:2 A5:2 C6:2 F6:2 A5:4 | B5:2 D6:2 G6:2 D6:2 B5:2 D6:2 G6:4 | C6:8 G5:4 E5:2 C5:2',
    },
    bass: OOMPAH,
    drums: { kick: [0, 8], snare: [4, 12], open: [14] },
    stab: { steps: [2, 6, 10, 14], oct: 24, wave: 'square' },
    mix: { lead: 0.055, bass: 0.14, pad: 0, arp: 0, stab: 0.022, drums: 1 },
  }),
  hell: composeSong({
    title: 'Hell Gate', bpm: 152, bpmStep: 4, swing: 0, lead: 'saw', pad: false,
    A: {
      chords: 'E5 E5 F5 E5 E5 G5 F5 E5',
      melody: 'E4:3 E4:3 G4:2 E4:3 F4:3 E4:2 | E4:3 E4:3 B4:2 E4:3 A4:3 G4:2 | F4:3 F4:3 A4:2 F4:3 G4:3 F4:2 | E4:3 E4:3 G4:2 B4:3 E5:5 | E4:3 E4:3 G4:2 E4:3 F4:3 E4:2 | G4:3 G4:3 Bb4:2 G4:3 A4:3 G4:2 | F4:3 F4:3 C5:2 F4:3 E5:3 D5:2 | E4:3 E4:3 E5:4 D5:2 B4:2 E4:2',
    },
    B: {
      chords: 'C5 D5 E5 E5 C5 D5 F5 E5',
      melody: 'C5:4 E5:4 G5:8 | D5:4 F5:4 A5:8 | E5:4 G5:4 B5:8 | B5:6 A5:2 G5:4 E5:4 | C6:4 B5:4 G5:8 | A5:4 D6:4 A5:8 | C6:4 A5:4 F5:4 E5:4 | E5:8 E4:4 E4:2 E4:2',
    },
    bass: CHUG,
    drums: { kick: [0, 2, 6, 8, 10, 14], snare: [4, 12], open: [14], hat16: true },
    stab: { steps: [0, 3, 6, 10], oct: 24, wave: 'power', always: true },
    mix: { lead: 0.048, bass: 0.115, pad: 0, arp: 0, stab: 0.03, drums: 0.85 },
  }),
  match: composeSong({
    title: 'Gem Grid', minor: 'G', bpm: 126, bpmStep: 4, swing: 0.18, lead: 'soft', pad: false, octaveUp: false,
    A: {
      chords: 'G Em C D G Em C D',
      melody: 'B5:2 D6:2 G6:4 D6:2 B5:2 G5:4 | G5:2 B5:2 E6:4 B5:2 G5:2 E5:4 | C6:2 E6:2 G6:4 E6:2 C6:2 G5:4 | A5:2 D6:2 F#6:4 D6:2 A5:2 F#5:4 | G5:2 B5:2 D6:2 G6:2 D6:2 B5:2 G5:4 | E6:2 B5:2 G5:2 B5:2 E6:2 G6:2 E6:4 | E6:2 G6:2 C6:2 E6:2 G5:2 C6:2 E6:4 | D6:2 C6:2 B5:2 A5:2 F#5:2 A5:2 D6:4',
    },
    B: {
      chords: 'C G Am D C G D G',
      melody: 'E6:4 G6:4 E6:4 C6:4 | D6:4 G6:4 D6:4 B5:4 | E6:4 C6:4 A5:4 C6:4 | F#6:4 D6:4 A5:4 D6:4 | G6:4 E6:4 C6:4 E6:4 | B5:4 D6:4 G6:4 D6:4 | A5:4 D6:4 F#6:4 D6:4 | G5:8 B5:4 D6:4',
    },
    bass: [[0, 0, 2], [4, 7, 2], [8, 0, 2], [12, 7, 2]],
    drums: { kick: [0, 6, 8, 12], snare: [4, 12], open: [14] },
    stab: { steps: [2, 6, 10, 14], oct: 24, wave: 'triangle' },
    arp: { div: 2, seq: [0, 1, 2, 1], oct: 36, wave: 'marimba' },
    mix: { lead: 0.07, bass: 0.14, pad: 0, arp: 0.045, stab: 0.03, drums: 1 },
  }),
  stack: composeSong({
    title: 'Block Stack', bpm: 140, bpmStep: 5, swing: 0, lead: 'chip', pad: false, octaveUp: false,
    A: {
      chords: 'Cm Ab Eb Bb Cm Eb Fm G',
      melody: 'G5:2 Eb5:2 C5:2 Eb5:2 G5:4 F5:2 Eb5:2 | Ab5:2 F5:2 C5:2 F5:2 Ab5:4 G5:4 | Bb5:2 G5:2 Eb5:2 G5:2 Bb5:4 Ab5:2 G5:2 | F5:4 D5:4 G5:8 | C6:2 Bb5:2 G5:2 Bb5:2 C6:4 D6:4 | Eb6:4 D6:2 C6:2 Bb5:4 G5:4 | Ab5:2 C6:2 F6:4 Eb6:2 C6:2 Ab5:4 | G5:8 -:4 G5:2 Bb5:2',
    },
    B: {
      chords: 'Eb Ab Bb Gm Cm Fm G Cm',
      melody: 'Eb5:2 G5:2 Bb5:4 Eb6:4 Bb5:4 | Ab5:2 C6:2 Eb6:4 C6:4 Ab5:4 | Bb5:2 D6:2 F6:4 D6:4 Bb5:4 | G5:4 Bb5:4 D6:8 | C6:2 Eb6:2 G6:4 Eb6:4 C6:4 | Ab5:2 C6:2 F6:4 C6:4 Ab5:4 | G5:2 B5:2 D6:4 G6:4 F6:4 | Eb6:8 C6:4 G5:4',
    },
    bass: OOMPAH,
    drums: { kick: [0, 8], snare: [4, 12], open: [] },
    stab: { steps: [2, 6, 10, 14], oct: 24, wave: 'square' },
    mix: { lead: 0.062, bass: 0.15, pad: 0, arp: 0, stab: 0.026, drums: 1 },
  }),
  hills: composeSong({
    title: 'Seaside Dash', minor: 'D', bpm: 154, bpmStep: 4, swing: 0, lead: 'brass', pad: false, octaveUp: false,
    A: {
      chords: 'D A Bm G D A G A',
      melody: 'F#5:2 A5:2 D6:4 C#6:2 A5:2 F#5:4 | E5:2 A5:2 C#6:4 B5:2 A5:2 E5:4 | D5:2 F#5:2 B5:4 A5:2 F#5:2 D5:4 | D5:2 G5:2 B5:4 A5:2 G5:2 B5:4 | F#5:2 A5:2 D6:2 F#6:2 E6:2 D6:2 A5:4 | E6:2 C#6:2 A5:2 C#6:2 E6:4 C#6:4 | D6:2 B5:2 G5:2 B5:2 D6:4 B5:4 | C#6:4 E6:4 A5:8',
    },
    B: {
      chords: 'G D A Bm G D A A',
      melody: 'B5:4 D6:4 G6:8 | A5:4 D6:4 F#6:8 | E6:4 C#6:4 A5:8 | D6:4 F#6:4 B5:4 D6:4 | B5:2 D6:2 G6:4 F#6:2 E6:2 D6:4 | D6:2 F#6:2 A5:4 D6:2 F#6:2 A5:4 | E6:4 C#6:2 A5:2 E5:4 A5:4 | C#6:4 E6:4 D6:4 C#6:4',
    },
    bass: [[0, 0, 2], [3, 12, 1], [6, 0, 2], [8, 0, 2], [11, 12, 1], [14, 7, 2]],
    drums: { kick: [0, 6, 8, 14], snare: [4, 12], open: [10], hat16: true },
    stab: { steps: [2, 10], oct: 24, wave: 'square' },
    mix: { lead: 0.06, bass: 0.15, pad: 0, arp: 0, stab: 0.02, drums: 1 },
  }),
  warp: composeSong({
    title: 'Pipe Works Stroll', minor: 'C', bpm: 142, bpmStep: 4, swing: 0.08, lead: 'chip', pad: false, octaveUp: false,
    A: {
      chords: 'C C F C G F C G',
      melody: 'G5:2 -:2 G5:2 E5:2 -:2 G5:2 C6:4 | B5:2 A5:2 G5:2 E5:2 G5:2 A5:2 G5:4 | F5:2 A5:2 C6:2 A5:2 F5:2 A5:2 C6:4 | E5:2 G5:2 C6:2 G5:2 E5:2 G5:2 C6:4 | D6:2 -:2 D6:2 B5:2 -:2 G5:2 B5:4 | C6:2 A5:2 F5:2 A5:2 C6:2 E6:2 D6:4 | E6:2 D6:2 C6:2 G5:2 E5:2 G5:2 C6:4 | B5:2 D6:2 G6:2 F6:2 D6:2 B5:2 G5:4',
    },
    B: {
      chords: 'Am Em F G C Am Dm G',
      melody: 'E6:2 C6:2 A5:2 C6:2 E6:4 C6:4 | E6:2 B5:2 G5:2 B5:2 E6:4 G6:4 | F6:2 C6:2 A5:2 C6:2 F6:4 C6:4 | D6:2 B5:2 G5:2 B5:2 D6:4 G5:4 | C6:2 E6:2 G6:4 E6:2 C6:2 G5:4 | A5:2 C6:2 E6:4 C6:2 A5:2 E5:4 | F5:2 A5:2 D6:4 A5:2 F5:2 D5:4 | G5:4 B5:4 D6:4 B5:4',
    },
    bass: OFFBEAT,
    drums: { kick: [0, 4, 8, 12], snare: [4, 12], open: [14] },
    stab: { steps: [0, 8], oct: 24, wave: 'square' },
    mix: { lead: 0.055, bass: 0.14, pad: 0, arp: 0, stab: 0.02, drums: 0.9 },
  }),
  dream: composeSong({
    title: 'Cotton Heights', minor: 'F', bpm: 122, bpmStep: 4, swing: 0.12, lead: 'flute', pad: true, octaveUp: false,
    A: {
      chords: 'F C Dm Bb F C Bb C',
      melody: 'A5:2 C6:2 F6:4 E6:2 D6:2 C6:4 | G5:2 C6:2 E6:4 D6:2 C6:2 G5:4 | A5:2 D6:2 F6:4 E6:2 D6:2 A5:4 | Bb5:2 D6:2 F6:4 D6:2 Bb5:2 F5:4 | C6:2 F6:2 A5:2 C6:2 F6:4 C6:4 | E6:2 G6:2 C6:2 E6:2 G5:4 C6:4 | D6:2 F6:2 Bb5:2 D6:2 F6:4 D6:4 | E6:4 G6:4 C6:8',
    },
    B: {
      chords: 'Bb C Am Dm Bb C F C',
      melody: 'D6:4 F6:4 D6:4 Bb5:4 | E6:4 G6:4 E6:4 C6:4 | C6:4 E6:4 C6:4 A5:4 | D6:4 F6:4 A5:4 D6:4 | F6:2 D6:2 Bb5:2 D6:2 F6:4 D6:4 | G6:2 E6:2 C6:2 E6:2 G6:4 E6:4 | C6:2 F6:2 C6:4 A5:4 F5:4 | G5:4 C6:4 E6:4 G5:4',
    },
    bass: [[0, 0, 2], [4, 12, 2], [8, 0, 2], [12, 7, 2]],
    drums: { kick: [0, 8], snare: [4, 12], open: [], soft: true },
    stab: { steps: [2, 6, 10, 14], oct: 24, wave: 'triangle' },
    arp: { div: 2, seq: [0, 1, 2, 1], oct: 36, wave: 'marimba' },
    mix: { lead: 0.07, bass: 0.13, pad: 0.016, arp: 0.04, stab: 0.025, drums: 0.8 },
  }),
  grace: composeSong({
    title: 'Golden Boughs', bpm: 62, bpmStep: 2, swing: 0, lead: 'choir', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Em C G D Em C D Em',
      melody: 'B4:8 E5:4 G5:4 | G5:6 E5:2 C5:8 | B4:8 D5:4 G5:4 | F#5:8 A5:4 F#5:4 | E5:6 G5:2 B5:8 | C6:8 B5:4 G5:4 | A5:6 F#5:2 D5:8 | E5:12 B4:4',
    },
    B: {
      chords: 'C G D Em C G D Em',
      melody: 'E6:8 G6:4 E6:4 | D6:8 B5:4 G5:4 | F#6:8 D6:4 A5:4 | E6:8 B5:4 G5:4 | G6:8 E6:4 C6:4 | B5:8 D6:4 G6:4 | F#6:6 E6:2 D6:8 | E6:12 B5:4',
    },
    bass: [[0, 0, 16]],
    drums: { kick: [0], snare: [], open: [], fill: false, noHats: true },
    stab: { steps: [0], oct: 24, wave: 'piano', always: true },
    arp: { div: 4, seq: [0, 1, 2, 1], oct: 36, wave: 'bell' },
    mix: { lead: 0.07, bass: 0.13, pad: 0.032, arp: 0.04, stab: 0.03, drums: 0.7 },
  }),
  prelude: composeSong({
    title: 'Crystal Choir', minor: 'Bb', bpm: 92, bpmStep: 2, swing: 0, lead: 'flute', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Bb Gm Eb F Bb Gm Eb F',
      melody: 'D5:4 F5:4 Bb5:8 | D5:4 G5:4 Bb5:4 G5:4 | Eb5:4 G5:4 Bb5:4 G5:4 | C5:4 F5:4 A5:8 | D6:8 Bb5:4 F5:4 | D6:6 C6:2 Bb5:8 | G5:4 Bb5:4 Eb6:8 | C6:6 A5:2 F5:8',
    },
    B: {
      chords: 'Eb Bb Cm F Eb F Gm F',
      melody: 'G5:4 Bb5:4 Eb6:8 | F6:6 D6:2 Bb5:8 | Eb6:4 G6:4 C6:8 | A5:4 C6:4 F6:8 | Eb6:8 Bb5:4 G5:4 | F6:8 C6:4 A5:4 | D6:6 Bb5:2 G5:8 | F5:4 A5:4 C6:8',
    },
    bass: HELD,
    drums: { kick: [], snare: [], open: [], fill: false, noHats: true },
    arp: { div: 2, seq: [0, 1, 2, 1], oct: 24, wave: 'harp' },
    mix: { lead: 0.07, bass: 0.1, pad: 0.03, arp: 0.045, stab: 0, drums: 0 },
  }),
  waka: composeSong({
    title: 'Neon Maze', bpm: 136, bpmStep: 5, swing: 0, lead: 'chip', pad: false, octaveUp: false,
    A: {
      chords: 'Em Em C D Em Em C B7',
      melody: 'E5:2 -:2 E5:2 G5:2 B5:2 -:2 G5:2 E5:2 | E5:2 -:2 E5:2 G5:2 B5:4 A5:2 G5:2 | C5:2 -:2 C5:2 E5:2 G5:2 -:2 E5:2 C5:2 | D5:2 -:2 D5:2 F#5:2 A5:2 -:2 F#5:2 D5:2 | G5:2 B5:2 E6:4 D6:2 B5:2 G5:4 | E6:2 D6:2 B5:2 G5:2 B5:2 D6:2 E6:4 | C6:2 G5:2 E5:2 G5:2 C6:4 B5:2 A5:2 | B5:2 D#6:2 F#6:4 D#6:2 B5:2 A5:4',
    },
    B: {
      chords: 'C D Em B7 C D G B7',
      melody: 'E6:4 G6:2 E6:2 C6:4 G5:4 | F#6:4 D6:2 F#6:2 A5:4 D6:4 | G6:4 E6:2 G6:2 B5:4 E6:4 | D#6:4 F#6:4 B5:4 A5:4 | C6:2 E6:2 G6:2 E6:2 C6:2 E6:2 G5:4 | D6:2 F#6:2 A5:2 F#6:2 D6:2 F#6:2 A5:4 | B5:2 D6:2 G6:2 D6:2 B5:2 D6:2 G5:4 | F#5:4 B5:4 D#6:4 F#6:4',
    },
    bass: BOUNCE,
    drums: { kick: [0, 8], snare: [4, 12], open: [] },
    mix: { lead: 0.055, bass: 0.13, pad: 0, arp: 0, stab: 0, drums: 0.9 },
  }),
  rhythm: composeSong({
    title: 'Beat Boulevard', bpm: 140, bpmStep: 4, swing: 0, lead: 'saw', pad: false,
    A: {
      chords: 'Am Am C D Am Am F G',
      melody: 'A4:2 C5:2 A4:2 E5:2 D5:2 C5:2 A4:4 | A4:2 C5:2 A4:2 G5:2 E5:2 D5:2 C5:4 | C5:2 E5:2 G5:4 E5:2 C5:2 G4:4 | D5:2 F#5:2 A5:4 F#5:2 D5:2 A4:4 | A4:2 C5:2 A4:2 E5:2 D5:2 C5:2 A4:4 | E5:2 G5:2 A5:4 G5:2 E5:2 D5:4 | F5:2 A5:2 C6:4 A5:2 F5:2 C5:4 | G5:2 B5:2 D6:4 B5:2 G5:2 D5:4',
    },
    B: {
      chords: 'F C G Am F C D E',
      melody: 'A5:4 C6:4 F6:8 | G5:4 C6:4 E6:8 | D6:4 B5:4 G5:8 | E6:4 C6:4 A5:8 | A5:2 C6:2 F6:4 E6:2 C6:2 A5:4 | G5:2 C6:2 E6:4 D6:2 C6:2 G5:4 | A5:2 D6:2 F#6:4 E6:2 D6:2 A5:4 | G#5:2 B5:2 E6:4 B5:2 G#5:2 E5:4',
    },
    bass: CHUG,
    drums: { kick: [0, 8, 10], snare: [4, 12], open: [14] },
    stab: { steps: [0, 6, 8, 14], oct: 24, wave: 'power', always: true },
    mix: { lead: 0.06, bass: 0.14, pad: 0, arp: 0, stab: 0.035, drums: 1 },
  }),
  chamber: composeSong({
    title: 'Clean Room', bpm: 96, bpmStep: 3, swing: 0, lead: 'soft', pad: true, octaveUp: false,
    A: {
      chords: 'Am FM7 C G Am FM7 Dm E',
      melody: 'E5:4 -:4 A5:4 -:4 | C5:4 -:4 F5:4 E5:4 | G5:4 -:4 E5:4 -:4 | D5:4 B4:4 G4:8 | E5:4 -:4 A5:4 C6:4 | A5:4 -:4 F5:4 E5:4 | D5:4 F5:4 A5:4 F5:4 | G#4:4 B4:4 E5:8',
    },
    B: {
      chords: 'FM7 G Am C FM7 G Dm E',
      melody: 'A5:2 C6:2 E6:4 C6:4 A5:4 | B5:2 D6:2 G5:4 D6:4 B5:4 | C6:2 E6:2 A5:4 E6:4 C6:4 | E6:2 G6:2 C6:4 G6:4 E6:4 | A5:2 C6:2 E6:4 C6:4 A5:4 | B5:2 D6:2 G5:4 D6:4 B5:4 | D6:4 F6:4 A5:4 D6:4 | E6:4 G#5:4 B5:8',
    },
    bass: [[0, 0, 2], [6, 0, 2], [8, 0, 2], [14, 0, 1]],
    drums: { kick: [0, 8], snare: [], open: [], soft: true, fill: false },
    arp: { div: 2, seq: [0, 2, 1, 2], oct: 36, wave: 'marimba' },
    mix: { lead: 0.078, bass: 0.15, pad: 0.024, arp: 0.056, stab: 0, drums: 0.75 },
  }),
  insert: composeSong({
    title: 'Insert Coin', bpm: 124, bpmStep: 4, swing: 0, lead: 'chip', pad: false, octaveUp: false,
    A: {
      chords: 'Cm Bb Ab G Cm Bb Ab G',
      melody: 'C5:2 Eb5:2 G5:2 Eb5:2 C5:2 Eb5:2 G5:4 | D5:2 F5:2 Bb5:2 F5:2 D5:2 F5:2 Bb5:4 | C5:2 Eb5:2 Ab5:2 Eb5:2 C5:2 Eb5:2 Ab5:4 | B4:2 D5:2 G5:2 D5:2 B4:2 D5:2 G5:4 | G5:2 C6:2 Eb6:2 C6:2 G5:2 C6:2 Eb6:4 | F5:2 Bb5:2 D6:2 Bb5:2 F5:2 Bb5:2 D6:4 | Eb5:2 Ab5:2 C6:2 Ab5:2 Eb5:2 Ab5:2 C6:4 | D5:2 G5:2 B5:2 G5:2 D5:2 G5:2 B5:4',
    },
    B: {
      chords: 'Fm Cm Fm G Ab Eb G G',
      melody: 'C6:4 Ab5:4 F5:8 | Eb6:4 C6:4 G5:8 | Ab5:4 C6:4 F6:8 | D6:4 B5:4 G5:8 | C6:4 Eb6:4 C6:8 | Bb5:4 Eb6:4 G6:8 | B5:4 D6:4 G6:8 | F6:4 D6:4 B5:4 G5:4',
    },
    bass: [[0, 0, 3], [4, 0, 3], [8, 0, 3], [12, 0, 3]],
    drums: { kick: [0, 8], snare: [4, 12], open: [14], hat16: true },
    stab: { steps: [2, 6, 10, 14], oct: 24, wave: 'square' },
    mix: { lead: 0.055, bass: 0.14, pad: 0, arp: 0, stab: 0.02, drums: 0.9 },
  }),
  glitch: composeSong({
    title: 'Corrupted Save', bpm: 150, bpmStep: 5, swing: 0, lead: 'chip', pad: false, octaveUp: false,
    A: {
      chords: 'C Db D Eb E Eb D Db',
      melody: 'C5:2 E5:2 G5:2 C6:2 G5:2 E5:2 C5:2 E5:2 | Db5:2 F5:2 Ab5:2 Db6:2 Ab5:2 F5:2 Db5:2 F5:2 | D5:2 F#5:2 A5:2 D6:2 A5:2 F#5:2 D5:2 F#5:2 | Eb5:2 G5:2 Bb5:2 Eb6:2 Bb5:2 G5:2 Eb5:2 G5:2 | E5:2 G#5:2 B5:2 E6:2 B5:2 G#5:2 E5:2 G#5:2 | Eb5:2 G5:2 Bb5:2 Eb6:2 Bb5:2 G5:2 Eb5:2 G5:2 | D5:2 F#5:2 A5:2 D6:2 A5:2 F#5:2 D5:2 F#5:2 | Db5:2 F5:2 Ab5:2 Db6:2 Ab5:2 F5:2 Db5:2 F5:2',
    },
    B: {
      chords: 'C F# C F# Eb A Eb G',
      melody: 'C6:4 G5:4 E5:4 C5:4 | F#5:4 C#6:4 A#5:4 F#5:4 | E6:4 C6:4 G5:4 E5:4 | F#6:4 C#6:4 A#5:4 C#6:4 | Eb6:4 Bb5:4 G5:4 Eb5:4 | A5:4 E6:4 C#6:4 A5:4 | G6:4 Eb6:4 Bb5:4 G5:4 | B5:4 D6:4 G6:4 D6:4',
    },
    bass: [[0, 0, 2], [3, 0, 1], [6, 12, 2], [8, 0, 2], [11, 7, 1], [14, 12, 2]],
    drums: { kick: [0, 3, 8, 11], snare: [5, 13], open: [7, 15], hat16: true },
    stab: { steps: [1, 7, 12], oct: 24, wave: 'square' },
    mix: { lead: 0.05, bass: 0.13, pad: 0, arp: 0, stab: 0.025, drums: 0.9 },
  }),
  academy: composeSong({
    title: 'Arcane Academy', bpm: 88, bpmStep: 2, swing: 0, lead: 'flute', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Dm Bb Gm A Dm F Gm Dm',
      melody: 'D5:4 -:2 F5:2 A5:4 G5:4 | F5:6 E5:2 D5:8 | Bb4:4 D5:4 F5:4 E5:4 | C#5:8 E5:4 A4:4 | D5:4 F5:4 A5:4 C6:4 | Bb5:6 A5:2 G5:8 | F5:4 G5:4 A5:4 E5:4 | D5:12 -:4',
    },
    B: {
      chords: 'F C Am D Bb Gm A A',
      melody: 'F5:4 A5:4 C6:8 | G5:4 C6:4 E6:8 | E5:4 A5:4 C6:8 | D6:6 C#6:2 A5:8 | Bb5:4 D6:4 F6:8 | E6:4 D6:4 C6:4 A5:4 | G5:4 E5:4 A5:4 G5:4 | A5:8 C#5:8',
    },
    bass: HELD,
    drums: { kick: [0, 10], snare: [], open: [], soft: true, fill: false, noHats: true },
    arp: { div: 2, seq: [0, 2, 1, 2], oct: 36, wave: 'bell' },
    mix: { lead: 0.07, bass: 0.12, pad: 0.03, arp: 0.05, stab: 0, drums: 0.6 },
  }),
});

// The second wave of themed tiers. Every tune is newly written; none borrows a melody, motif or rhythm from the worlds they nod to.
const WALTZ = [[0, 0, 4], [4, 12, 2], [8, 12, 2]];
Object.assign(SONGS, {
  beacon: composeSong({
    title: 'Beacon Peaks', bpm: 86, bpmStep: 2, swing: 0, lead: 'brass', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Em C G D Em C D B',
      melody: 'B4:4 E5:4 G5:6 F#5:2 | E5:4 C5:4 G4:8 | B4:4 D5:4 G5:4 A5:4 | F#5:12 D5:4 | E5:4 G5:4 B5:6 A5:2 | G5:4 E5:4 C5:8 | D5:4 F#5:4 A5:4 G5:4 | F#5:8 D#5:8',
    },
    B: {
      chords: 'C G D Em C G B B',
      melody: 'E6:8 D6:4 C6:4 | B5:8 G5:4 D5:4 | A5:6 B5:2 C6:4 A5:4 | B5:12 G5:4 | C6:4 E6:4 G6:6 F#6:2 | E6:4 D6:4 B5:8 | D#6:4 F#6:4 B5:4 A5:4 | B5:16',
    },
    bass: HELD,
    drums: { kick: [0, 3, 8, 11], snare: [], open: [], fill: false, noHats: true },
    arp: { div: 2, seq: [0, 1, 2, 1], oct: 24, wave: 'harp' },
    mix: { lead: 0.06, bass: 0.14, pad: 0.03, arp: 0.04, stab: 0, drums: 0.85 },
  }),
  watch: composeSong({
    title: 'Wall of Ice', bpm: 66, bpmStep: 2, swing: 0, lead: 'fiddle', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Am Am F F Dm Dm E E',
      melody: 'A4:12 C5:4 | E5:8 D5:4 C5:4 | F4:12 A4:4 | C5:8 B4:4 A4:4 | D5:12 F5:4 | E5:8 D5:4 C5:4 | B4:8 G#4:4 E4:4 | E4:16',
    },
    B: {
      chords: 'F G Am Am F G E E',
      melody: 'A5:8 G5:4 F5:4 | G5:8 F5:4 E5:4 | E5:12 C5:4 | A4:16 | C5:4 F5:4 A5:6 G5:2 | B5:4 G5:4 D5:8 | E5:4 G#5:4 B5:4 D6:4 | B5:8 G#5:8',
    },
    bass: [[0, 0, 16]],
    drums: { kick: [0], snare: [], open: [], soft: true, fill: false, noHats: true, pulse: true },
    arp: { div: 4, seq: [0, 1, 2, 1], oct: 36, wave: 'piano' },
    mix: { lead: 0.06, bass: 0.13, pad: 0.032, arp: 0.035, stab: 0, drums: 0.6 },
  }),
  atomic: composeSong({
    title: 'Wasteland', bpm: 60, bpmStep: 2, swing: 0, steps: 12, lead: 'voice', pad: true, octaveUp: false,
    A: {
      chords: 'Am F Dm E Am F Dm E',
      melody: 'E5:3 E5:3 C5:3 A4:3 | F5:6 E5:3 C5:3 | D5:3 F5:3 A5:3 G5:3 | G#5:9 E5:3 | E5:3 A5:3 C6:3 B5:3 | A5:6 F5:3 C5:3 | D5:3 E5:3 F5:3 D5:3 | E5:12',
    },
    B: {
      chords: 'Dm Am Dm E F C Dm E',
      melody: 'F5:6 A5:3 D6:3 | C6:6 A5:3 E5:3 | D6:3 C6:3 A5:3 F5:3 | B5:9 G#5:3 | A5:3 C6:3 F6:3 E6:3 | E6:6 C6:3 G5:3 | F5:3 A5:3 D6:3 C6:3 | B5:6 G#5:6',
    },
    bass: [[0, 0, 3], [3, 7, 3], [6, 12, 3], [9, 7, 3]],
    drums: { kick: [0, 6], snare: [3, 9], open: [], soft: true, fill: false, noHats: true },
    stab: { steps: [3, 9], oct: 24, wave: 'piano', always: true },
    arp: { div: 3, seq: [0, 1, 2, 1], oct: 36, wave: 'bell' },
    mix: { lead: 0.07, bass: 0.13, pad: 0.018, arp: 0.025, stab: 0.035, drums: 0.7 },
  }),
  cocoa: composeSong({
    title: 'Chocolate Falls', bpm: 132, bpmStep: 3, swing: 0, steps: 12, lead: 'flute', pad: false, octaveUp: false,
    A: {
      chords: 'Cm Ab Fm G Cm Ab Bb G',
      melody: 'G5:4 C6:2 Bb5:2 G5:4 | Ab5:8 Eb5:4 | F5:2 G5:2 Ab5:4 C6:4 | B5:8 D5:4 | G5:4 Eb6:2 D6:2 C6:4 | C6:4 Ab5:4 Eb5:4 | D5:2 Eb5:2 F5:4 Bb5:4 | G5:12',
    },
    B: {
      chords: 'Fm Cm Ab G Fm Cm D G',
      melody: 'Ab5:4 C6:4 F6:4 | Eb6:8 C6:4 | C6:4 Ab5:4 Eb5:4 | D5:4 G5:4 B5:4 | C6:2 D6:2 Eb6:4 F6:4 | G6:8 Eb6:4 | F#5:4 A5:4 C6:4 | B5:8 G5:4',
    },
    bass: WALTZ,
    drums: { kick: [0], snare: [4, 8], open: [], soft: true, fill: false, noHats: true },
    stab: { steps: [4, 8], oct: 24, wave: 'marimba', always: true },
    arp: { div: 2, seq: [0, 1, 2, 1], oct: 36, wave: 'bell' },
    mix: { lead: 0.07, bass: 0.12, pad: 0, arp: 0.03, stab: 0.035, drums: 0.55 },
  }),
  isle: composeSong({
    title: 'Floating Isle', bpm: 108, bpmStep: 2, swing: 0, steps: 12, lead: 'voice', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Em C G D Em C Am B',
      melody: 'B4:4 E5:4 F#5:4 | G5:8 E5:4 | D5:4 G5:4 B5:4 | A5:8 F#5:4 | G5:4 B5:4 E6:4 | E6:4 C6:4 G5:4 | A5:4 C6:4 E6:4 | D#6:12',
    },
    B: {
      chords: 'C D Bm Em Am D B B',
      melody: 'G5:4 E6:4 D6:4 | A5:4 F#6:4 E6:4 | D6:8 B5:4 | G5:4 B5:4 E6:4 | C6:4 E6:4 A6:4 | F#6:6 E6:2 D6:4 | D#6:4 F#6:4 B6:4 | B5:12',
    },
    bass: [[0, 0, 4], [4, 7, 4], [8, 12, 4]],
    drums: { kick: [0], snare: [], open: [], soft: true, fill: false, noHats: true },
    arp: { div: 2, seq: [0, 1, 2, 1], oct: 36, wave: 'piano' },
    mix: { lead: 0.065, bass: 0.11, pad: 0.03, arp: 0.04, stab: 0, drums: 0.5 },
  }),
  cloudline: composeSong({
    title: 'Sunset Colony', bpm: 100, bpmStep: 3, swing: 0, lead: 'soft', pad: true, octaveUp: false,
    A: {
      chords: 'Gm Eb Bb F Gm Eb Cm D',
      melody: 'D5:4 G5:4 Bb5:6 A5:2 | G5:4 Eb5:4 Bb4:8 | D5:4 F5:4 Bb5:4 C6:4 | A5:12 F5:4 | Bb5:4 D6:4 G6:6 F6:2 | Eb6:4 D6:4 Bb5:8 | C6:4 Bb5:4 G5:4 Eb5:4 | F#5:16',
    },
    B: {
      chords: 'Eb Bb Cm Gm Eb F D D',
      melody: 'G5:8 Bb5:4 Eb6:4 | D6:8 Bb5:4 F5:4 | Eb5:4 G5:4 C6:6 Bb5:2 | Bb5:12 G5:4 | G5:4 Bb5:4 Eb6:4 G6:4 | F6:8 C6:4 A5:4 | A5:4 C6:4 F#6:4 D6:4 | D6:16',
    },
    bass: [[0, 0, 6], [6, 7, 2], [8, 0, 6], [14, 12, 2]],
    drums: { kick: [0, 10], snare: [8], open: [], soft: true },
    arp: { div: 2, seq: [0, 2, 1, 2], oct: 36, wave: 'bell' },
    mix: { lead: 0.07, bass: 0.12, pad: 0.024, arp: 0.035, stab: 0, drums: 0.6 },
  }),
  hoard: composeSong({
    title: "Dragon's Hoard", bpm: 64, bpmStep: 2, swing: 0, lead: 'choir', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Cm Cm Ab Ab Fm Fm G G',
      melody: 'C5:8 Eb5:4 D5:4 | C5:12 G4:4 | Ab4:8 C5:4 Eb5:4 | F5:12 Eb5:4 | D5:8 F5:4 Ab5:4 | G5:8 F5:4 Eb5:4 | D5:8 B4:8 | G4:16',
    },
    B: {
      chords: 'Ab Eb Fm Cm Ab Bb G G',
      melody: 'C6:8 Ab5:4 Eb5:4 | G5:8 Bb5:4 Eb6:4 | F5:8 Ab5:4 C6:4 | Eb6:12 C6:4 | C6:4 Eb6:4 Ab6:8 | F6:4 D6:4 Bb5:8 | B5:8 D6:4 F6:4 | G6:16',
    },
    bass: HELD,
    drums: { kick: [0, 8, 9], snare: [], open: [], fill: false, noHats: true },
    arp: { div: 4, seq: [0, 1, 2, 1], oct: 36, wave: 'harp' },
    mix: { lead: 0.065, bass: 0.15, pad: 0.03, arp: 0.04, stab: 0, drums: 0.9 },
  }),
  idol: composeSong({
    title: 'Idol Temple', bpm: 126, bpmStep: 4, swing: 0, lead: 'brass', pad: false, octaveUp: false,
    A: {
      chords: 'Cm Cm Ab Bb Cm Cm F G',
      melody: 'G4:2 C5:2 Eb5:2 G5:6 F5:2 Eb5:2 | D5:4 C5:4 G4:8 | Ab4:2 C5:2 Eb5:2 Ab5:6 G5:2 F5:2 | F5:4 D5:4 Bb4:8 | G4:2 C5:2 Eb5:2 G5:6 Bb5:2 G5:2 | C6:8 G5:8 | A5:4 C6:4 F5:4 A5:4 | B5:8 D6:8',
    },
    B: {
      chords: 'Ab Eb Fm G Ab Eb Fm G',
      melody: 'C6:6 Bb5:2 Ab5:8 | G5:6 F5:2 Eb5:8 | F5:4 Ab5:4 C6:4 F6:4 | D6:12 B5:4 | Eb6:6 D6:2 C6:8 | Bb5:6 Ab5:2 G5:8 | Ab5:4 C6:4 F6:4 Ab6:4 | G6:8 D6:4 B5:4',
    },
    bass: OOMPAH,
    drums: { kick: [0, 8], snare: [4, 12, 14], open: [] },
    stab: { steps: [2, 10], oct: 24, wave: 'piano' },
    mix: { lead: 0.06, bass: 0.14, pad: 0, arp: 0, stab: 0.03, drums: 0.85 },
  }),
  deep: composeSong({
    title: 'Deep Halls', bpm: 92, bpmStep: 3, swing: 0, lead: 'choir', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Em Em C C Am Am B B',
      melody: 'E5:8 G5:4 F#5:4 | E5:8 B4:8 | C5:8 E5:4 G5:4 | A5:8 G5:4 E5:4 | A4:8 C5:4 E5:4 | D5:8 C5:4 B4:4 | B4:8 D#5:4 F#5:4 | B5:16',
    },
    B: {
      chords: 'C G Am Em C D B B',
      melody: 'G5:8 C6:4 E6:4 | D6:8 B5:4 G5:4 | C6:8 A5:4 E5:4 | G5:8 B5:8 | E6:8 C6:4 G5:4 | F#6:8 D6:4 A5:4 | B5:4 D#6:4 F#6:4 A6:4 | F#6:8 D#6:8',
    },
    bass: [[0, 0, 4], [8, 0, 4]],
    drums: { kick: [0, 2, 8], snare: [], open: [], fill: false, noHats: true },
    arp: { div: 4, seq: [0, 1, 2, 1], oct: 24, wave: 'harp' },
    mix: { lead: 0.065, bass: 0.15, pad: 0.03, arp: 0.035, stab: 0, drums: 1 },
  }),
  shrine: composeSong({
    title: 'Forest Shrine', bpm: 104, bpmStep: 3, swing: 0, steps: 12, lead: 'flute', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Am F C G Am F E E',
      melody: 'A5:6 E5:2 C5:2 E5:2 | F5:6 A5:6 | G5:2 E5:2 C5:2 G5:6 | D5:12 | A5:6 C6:2 B5:2 A5:2 | F5:4 A5:2 C6:6 | B5:2 G#5:2 E5:2 B5:6 | E5:12',
    },
    B: {
      chords: 'F G Am Am Dm Em F E',
      melody: 'C6:6 A5:6 | D6:6 B5:6 | E6:4 D6:2 C6:2 B5:2 A5:2 | E5:12 | F5:2 A5:2 D6:2 F6:6 | E6:2 B5:2 G5:2 E6:6 | D6:4 C6:2 A5:6 | G#5:12',
    },
    bass: [[0, 0, 6], [6, 7, 6]],
    drums: { kick: [0], snare: [6], open: [], soft: true, fill: false, noHats: true },
    arp: { div: 2, seq: [0, 1, 2, 1], oct: 36, wave: 'harp' },
    mix: { lead: 0.07, bass: 0.11, pad: 0.022, arp: 0.04, stab: 0, drums: 0.5 },
  }),
  twosuns: composeSong({
    title: 'Twin Suns', bpm: 70, bpmStep: 2, swing: 0, lead: 'brass', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Am Am F F Dm Dm E E',
      melody: 'E5:12 A5:4 | G5:6 E5:2 C5:8 | F5:12 E5:4 | D5:6 C5:2 A4:8 | D5:8 F5:4 A5:4 | C6:8 B5:4 A5:4 | G#5:8 B5:4 E5:4 | E5:16',
    },
    B: {
      chords: 'F G C Am Dm E Am E',
      melody: 'A5:8 C6:4 F6:4 | D6:12 B5:4 | C6:8 G5:4 E5:4 | A5:12 C6:4 | D6:8 F6:4 A6:4 | G#6:8 E6:8 | A6:12 E6:4 | B5:16',
    },
    bass: HELD,
    drums: { kick: [0], snare: [], open: [], soft: true, fill: false, noHats: true, pulse: true },
    arp: { div: 4, seq: [0, 1, 2, 1], oct: 36, wave: 'harp' },
    mix: { lead: 0.055, bass: 0.13, pad: 0.032, arp: 0.04, stab: 0, drums: 0.55 },
  }),
  future: composeSong({
    title: 'Year 3000', bpm: 124, bpmStep: 4, swing: 0.14, lead: 'synth', pad: false, octaveUp: false,
    A: {
      chords: 'Dm7 G7 Dm7 G7 Bb C A A',
      melody: 'A5:2 -:2 A5:2 C6:2 D6:4 C6:2 A5:2 | G5:4 F5:2 G5:2 B5:8 | A5:2 -:2 A5:2 C6:2 D6:4 F6:2 E6:2 | D6:4 C6:2 A5:2 G5:8 | F5:2 G5:2 Bb5:2 D6:2 F6:4 D6:4 | E6:2 C6:2 G5:2 E5:2 C6:8 | C#6:4 E6:4 A6:4 G6:2 E6:2 | C#6:8 A5:8',
    },
    B: {
      chords: 'Gm C F Dm Gm C A A',
      melody: 'Bb5:4 D6:4 G6:8 | E6:4 C6:4 G5:8 | A5:2 C6:2 F6:4 E6:4 C6:4 | D6:8 A5:8 | Bb5:2 D6:2 G6:4 F6:2 D6:2 Bb5:4 | C6:2 E6:2 G6:4 E6:4 C6:4 | C#6:4 E6:4 G6:4 E6:4 | A6:8 E6:8',
    },
    bass: BOUNCE,
    drums: { kick: [0, 8, 10], snare: [4, 12], open: [14], hat16: true },
    stab: { steps: [2, 6, 10, 14], oct: 24, wave: 'square' },
    arp: { div: 2, seq: [0, 2, 1, 2], oct: 36, wave: 'triangle' },
    mix: { lead: 0.055, bass: 0.14, pad: 0, arp: 0.025, stab: 0.02, drums: 0.9 },
  }),
  ring: composeSong({
    title: 'Orbital Ring', bpm: 76, bpmStep: 3, swing: 0, lead: 'choir', pad: true, padSound: 'strings', octaveUp: false,
    A: {
      chords: 'Em D C Em Em G A Em',
      melody: 'B4:4 E5:4 B5:8 | A5:6 F#5:2 D5:8 | C5:4 E5:4 G5:4 C6:4 | B5:12 A5:4 | E5:4 B5:4 D6:6 C#6:2 | B5:4 G5:4 D5:8 | F#5:4 A5:4 C#6:4 F#5:4 | E5:16',
    },
    B: {
      chords: 'C D Em Em C D B B',
      melody: 'E6:8 G6:4 E6:4 | F#6:8 D6:4 A5:4 | B5:4 E6:4 G6:8 | E6:16 | C6:4 E6:4 G6:4 E6:4 | D6:4 F#6:4 A6:8 | F#6:4 D#6:4 B5:4 F#5:4 | B5:16',
    },
    bass: [[0, 0, 8], [8, 7, 8]],
    drums: { kick: [0, 6, 8], snare: [12], open: [] },
    arp: { div: 4, seq: [0, 2, 1, 2], oct: 36, wave: 'bell' },
    mix: { lead: 0.065, bass: 0.14, pad: 0.03, arp: 0.04, stab: 0, drums: 0.75 },
  }),
});
