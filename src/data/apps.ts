// Every app on the site. The index sheet, the colophon, the apps list and each product page
// are drawn from this file. Product pages share one order: film, name and specs, the idea,
// the panel, three points, screenshots, the manual, coverage, news, questions.
// Facts come from the manuals in the vault (they are newer than the old pages) and the store
// copy. No prices anywhere: the App Store shows them.

export type Status = 'out' | 'dev' | 'beta';
export type Visual = { kind: 'device' | 'icon' | 'reels'; src?: string; ar?: number; alt?: string };
export type PanelItem = { name: string; gloss?: string; dot?: string };
export type App = {
  slug: string;
  name: string;
  kind: string;
  platforms: string;
  status: Status;
  accent: string;
  accentLight: string;
  icon?: string;
  line: string;
  external?: string;
  store?: string;
  cta?: { label: string; href: string };
  privacy?: boolean;
  manual?: { pdfDark?: boolean; chapters: string[] };
  film?: Visual & { caption?: string; video?: { href: string; label: string } };
  thumb: Visual;
  specs?: [string, string][];
  statement?: string;
  paragraphs?: string[];
  panel?: { title: string; intro: string; groups: { title: string; items: PanelItem[] }[] };
  points?: { title: string; text: string }[];
  shots?: { src: string; alt: string; caption: string }[];
  seen?: { who: string; date: string; href: string }[];
  faq?: { q: string; a: string }[];
};

const A = (slug: string, file: string) => `/apps/${slug}/img/${file}`;

// Anima's control families, as the app colours them.
const SAND = '#d8c49c', CLAY = '#c98e70', OCHRE = '#cfa24e', HEATHER = '#ab9cc2', DENIM = '#8199b6', BONE = '#e3ddcf', SAGE = '#9db59b';

export const APPS: App[] = [
  {
    slug: 'hexatone',
    name: 'Hexatone',
    kind: 'Microtonal keyboard',
    platforms: 'iPad',
    status: 'out',
    accent: '#ffa9c9',
    accentLight: '#c42a64',
    icon: A('hexatone', 'icon.png'),
    line: 'An isomorphic hexagonal keyboard and microtonal instrument for iPad. Every interval keeps the same shape anywhere on the grid, in any tuning.',
    store: 'https://apps.apple.com/app/id6775283069',
    manual: {
      chapters: ['Welcome', 'Quick start', 'The main screen', 'Core ideas in one minute', 'Playing', 'Sound: built-in voices and the sampler', 'Scales and tunings', 'Layouts', 'Appearance and key options', 'Using Hexatone with other apps', 'Settings reference', 'Uninterrupted playing', 'Troubleshooting', 'FAQ', 'Privacy', 'Support and links'],
    },
    film: { kind: 'device', src: A('hexatone', 'v12-01-microtonal.jpg'), ar: 0.75, alt: 'Hexatone on iPad: a hexagonal keyboard in a microtonal tuning', caption: 'A microtonal layout. Hue shows pitch class, brightness shows octave.', video: { href: 'https://www.youtube.com/shorts/nB9aX6HUDzI', label: 'Watch the promo' } },
    thumb: { kind: 'device', src: A('hexatone', 'v12-01-microtonal.jpg'), ar: 0.75 },
    specs: [
      ['Runs on', 'iPad'],
      ['Formats', 'Standalone · AUv3 · AUv3 MIDI'],
      ['Tunings', 'Any equal temperament, Scala (.scl) files'],
      ['Sound', 'Bell and glass voices, a sampler (SFZ)'],
      ['Output', 'MPE pitch, MIDI'],
      ['Layouts', 'Eight, including Custom'],
    ],
    statement: 'Every interval keeps its shape anywhere on the grid, so a chord learned once plays the same everywhere, <em class="s">in any tuning.</em>',
    paragraphs: [
      'Any equal temperament, 12, 19, 22, 24, 31, 53 and beyond, or your own scales as Scala files, with keys that show their ratios. Octave, concert pitch and key density adjust to fit.',
      'It makes its own sound, in tune: a struck bell and a sustaining glass tone are built in, or load a single sample or a whole multisample instrument. It can send MIDI to an MPE synth at the same time.',
    ],
    panel: {
      title: 'In the app',
      intro: 'Layouts, sound, playing aids and looks, named as the app names them.',
      groups: [
        { title: 'LAYOUTS', items: [{ name: 'Bosanquet' }, { name: 'Wicki-Hayden' }, { name: 'Harmonic Table' }, { name: 'Fourths' }, { name: 'Accordion' }, { name: 'Park' }, { name: 'Gerhard' }, { name: 'Custom', gloss: 'your own, every interval keeps its shape' }] },
        { title: 'SOUND', items: [
          { name: 'Bell', gloss: 'a struck voice, built in' },
          { name: 'Glass', gloss: 'a sustaining tone, built in' },
          { name: 'Sampler', gloss: 'one sample or a multisample SFZ, as a folder or .zip' },
          { name: 'Library', gloss: 'name, rename and manage your instruments' },
        ] },
        { title: 'PLAYING', items: [
          { name: 'Arpeggiator', gloss: 'five patterns, 1/4 to 1/32 with triplets' },
          { name: 'Octaves', gloss: 'up to four, in the tuning\'s own octave' },
          { name: 'Hold', gloss: 'sustains chords after you lift' },
          { name: 'Panic', gloss: 'silences everything in one tap' },
          { name: 'Velocity', gloss: 'a curve, and the pitch-bend range' },
        ] },
        { title: 'LOOK', items: [
          { name: 'Palettes', gloss: 'Pastel, Inferno, Turquoise, Campfire, Signal' },
          { name: 'Hue', gloss: 'shows pitch class' },
          { name: 'Brightness', gloss: 'shows octave' },
        ] },
      ],
    },
    points: [
      { title: 'Same shape, any key', text: 'Isomorphic layouts keep every interval\'s shape across the grid, so scales and chords transpose by moving your hand.' },
      { title: 'In tune by itself', text: 'The built-in voices and the sampler play each note at its exact microtonal frequency. No other app needed.' },
      { title: 'Hands-free', text: 'Hold a chord, lift your hands, and the arpeggiator plays it, transposed by the tuning\'s own octave so it stays in tune.' },
    ],
    shots: [
      { src: A('hexatone', 'v12-01-microtonal.jpg'), alt: 'A microtonal layout on the hexagonal keyboard', caption: 'Microtonal layouts' },
      { src: A('hexatone', 'v12-02-sampler.jpg'), alt: 'The sampler in Hexatone', caption: 'The sampler' },
      { src: A('hexatone', 'v12-03-midi.jpg'), alt: 'MIDI and MPE settings', caption: 'MIDI and MPE' },
    ],
    faq: [
      { q: 'Does it make sound on its own?', a: 'Yes. Two built-in voices and a sampler, all in tune. It can send MIDI at the same time.' },
      { q: 'Which hosts does the plugin work in?', a: 'AUM, Logic Pro, GarageBand, Cubasis, Loopy Pro, Drambo and more. A second plugin, Hexatone MIDI, is the same keyboard as a pure MIDI effect, for hosts that only take MIDI from their MIDI slots.' },
      { q: 'How does it send microtonal pitch?', a: 'Over MPE: each note plays on its own channel with its own pitch bend, so any MPE-capable synth sounds every interval in tune.' },
      { q: 'Does it send pressure and timbre?', a: 'Not yet. Hexatone sends the per-note pitch dimension; the Y (timbre, CC74) and Z (pressure) dimensions of touch controllers are not sent, because a flat screen can\'t sense them natively. Richer touch expression is on the roadmap.' },
      { q: 'Which synths does it pair well with?', a: 'Any synth with an MPE or per-note pitch-bend mode. On iPad, for example: Audio Damage Continua and Phosphor 3, Moog Animoog Z and Model 15, Zeeon by BeepStreet, and Anima.' },
    ],
  },
  {
    slug: 'pond',
    name: 'Pond',
    kind: 'Ripple sequencer',
    platforms: 'iPad',
    status: 'out',
    accent: '#9ee6e6',
    accentLight: '#0094a6',
    icon: A('pond', 'icon.png'),
    line: 'A ripple sequencer for iPad: drop a stone in the water and let the wave play the notes.',
    store: 'https://apps.apple.com/app/pond-ripple-sequencer/id6779643312',
    manual: { chapters: ['Thirty seconds to first sound', 'Reading the pond', 'Gestures', 'The drawer, top to bottom', 'Pond and MIDI', 'Recipes', 'If something\'s quiet'] },
    film: { kind: 'device', src: A('pond', '01_hero.jpg'), ar: 0.75, alt: 'Pond on iPad: ripples crossing a grid of note cells', caption: 'Every lit band is a wave front. The cells it crosses are the notes.' },
    thumb: { kind: 'device', src: A('pond', '01_hero.jpg'), ar: 0.75 },
    specs: [
      ['Runs on', 'iPad'],
      ['Formats', 'Standalone · AUv3 MIDI processor'],
      ['MIDI', 'Out to apps and hardware, clock in and out'],
      ['Sound', 'A built-in 32-voice pluck'],
      ['Scales', 'Fifteen, in any key'],
      ['Patterns', '48 slots, switchable while playing'],
    ],
    statement: 'Every cell holds a note, and a ripple sounds each one it crosses. Where you tap and how the waves overlap, <em class="s">that\'s the composition.</em>',
    paragraphs: [
      'Tap anywhere and a wave expands from your finger. Switch on interference and the ripples behave like water: crests add, troughs cancel, and notes grow louder or softer where waves meet.',
      'Hold a finger still to plant an emitter, a spring that keeps dropping ripples in time. Up to eight of them make evolving polyrhythms, and with quantize off every note lands the instant the wave touches it.',
    ],
    panel: {
      title: 'In the drawer',
      intro: 'The controls, top to bottom, as the drawer names them.',
      groups: [
        { title: 'TEMPO', items: [
          { name: 'BPM', gloss: '20 to 300, with Division, sets the wave speed' },
          { name: 'Quantize', gloss: 'off, or ½ down to 1/128' },
        ] },
        { title: 'EMITTERS', items: [
          { name: 'Drip rate', gloss: 'per emitter, for polyrhythms' },
          { name: 'Channel', gloss: 'each emitter can send on its own' },
          { name: 'MIDI trigger', gloss: 'play the emitters from a keyboard' },
        ] },
        { title: 'SCALE', items: [
          { name: 'Scale', gloss: 'fifteen, in any key' },
          { name: 'Transpose', gloss: 'shifts every note in the pond' },
          { name: 'Octave range', gloss: 'bounds every note' },
          { name: 'Generate', gloss: 'deals a fresh pond' },
          { name: 'Density', gloss: '0.1% to 100%' },
        ] },
        { title: 'PHYSICS AND SOUND', items: [
          { name: 'Wall reflections', gloss: 'waves bounce back off the edges' },
          { name: 'Interference', gloss: 'crests add, troughs cancel' },
          { name: 'Falloff', gloss: 'quieter farther from the splash' },
          { name: 'Sustain', gloss: '1 to 1000 ms, plucks to washes' },
          { name: 'Built-in sound', gloss: 'a soft 32-voice pluck' },
        ] },
        { title: 'MIDI', items: [
          { name: 'Send to', gloss: 'USB, Bluetooth, network or another app' },
          { name: 'Sync', gloss: 'follows external MIDI clock' },
          { name: 'Send clock', gloss: 'Pond becomes the master' },
        ] },
      ],
    },
    points: [
      { title: 'Real wave physics', text: 'Overlapping waves add where crests meet and cancel where a crest meets a trough, like rings from two stones.' },
      { title: 'Springs that keep time', text: 'Emitters drip ripples on their own, each at its own rate, locked to the tempo. Up to eight at once.' },
      { title: 'Patterns you can perform', text: '48 slots in any order and a switcher right on the pond: play one, switch, play the next.' },
    ],
    shots: [
      { src: A('pond', '01_hero.jpg'), alt: 'Ripples crossing the pond', caption: 'The pond' },
      { src: A('pond', '02_emitters.jpg'), alt: 'Emitters dropping ripples in time', caption: 'Emitters' },
      { src: A('pond', '03_interference.jpg'), alt: 'Interfering waves drawn in cyan and slate', caption: 'Interference' },
      { src: A('pond', '04_control.jpg'), alt: 'The drawer of controls', caption: 'The drawer' },
    ],
    faq: [
      { q: 'Does Pond make sound on its own?', a: 'Yes, a soft built-in pluck so it sings the moment you open it. Turn it off when another synth or your DAW is making the sound.' },
      { q: 'Does it work in my host?', a: 'As an AUv3 MIDI processor in AUM, Logic, Cubasis and others: the full pond, freely resizable, following the host\'s tempo and transport.' },
      { q: 'Can it drive hardware?', a: 'Yes. Send to a USB interface or synth, a Bluetooth or network device, or another app, and sync to MIDI clock or send it.' },
      { q: 'Do my patterns carry into the plugin?', a: 'Yes. The app and the AUv3 share your patterns.' },
    ],
  },
  {
    slug: 'anima',
    name: 'Anima',
    kind: 'Physical-modeling synth',
    platforms: 'iPad, iPhone',
    status: 'out',
    accent: '#d69a56',
    accentLight: '#955320',
    icon: A('anima', 'icon.png'),
    line: 'A breath excites a resonating object, and it rings out into a room that morphs from delay to reverb. For iPad and iPhone.',
    store: 'https://apps.apple.com/us/app/anima-synthesizer/id6780281462',
    manual: { pdfDark: true, chapters: ['What Anima is', 'The control language', 'ENERGY', 'OBJECT', 'ROOM', 'Presets', 'The ribbon', 'MIDI and MPE', 'AUv3', 'Sound-design recipes', 'Knobs that talk to each other', 'Inside the engine'] },
    film: { kind: 'device', src: A('anima', 'surface.jpg'), ar: 1.646, alt: 'The Anima surface in landscape: ENERGY, OBJECT and ROOM rows of glyph controls', caption: 'The surface: ENERGY, OBJECT and ROOM, read left to right.', video: { href: 'https://www.youtube.com/watch?v=pys0AsFg4ro', label: 'Watch Anima 1.2' } },
    thumb: { kind: 'device', src: A('anima', 'hero.jpg'), ar: 0.75 },
    specs: [
      ['Runs on', 'iPad and iPhone, one purchase'],
      ['Formats', 'Standalone · AUv3'],
      ['Play', 'Ribbon, keys, MIDI and MPE, sustain pedal'],
      ['Voices', '1 to 64'],
      ['Presets', '55, with banks by Red Sky Lullaby and Hoavi'],
      ['Data', 'No accounts, nothing collected'],
    ],
    statement: 'A breath excites an object, the object rings out into a room. <em class="s">That is the whole interface.</em>',
    paragraphs: [
      'Each voice is a modal resonator: twenty-four coupled resonances computed from the note. Make it wood, glass or metal, stretch its partials from strings into bells, and push Inertia far enough that the note sings on its own breath.',
      'Every control is a glyph whose shape is its value, so the panel is a picture of the current sound. Load a preset and the whole surface morphs to the new one.',
    ],
    panel: {
      title: 'On the panel',
      intro: '29 controls in three rows, named as the panel labels them. The colour of the dot is the family it belongs to.',
      groups: [
        { title: 'ENERGY', items: [
          { name: 'Envelope', gloss: 'the ADSR, drawn with three handles', dot: SAND },
          { name: 'Curve', gloss: 'exponential, straight or logarithmic', dot: SAND },
          { name: 'Force', gloss: 'how hard the energy drives the object', dot: SAND },
          { name: 'Noise', gloss: 'what the breath is made of', dot: SAND },
          { name: 'Flutter', gloss: 'breath instability, rate and depth', dot: SAND },
          { name: 'Strike', gloss: 'the mallet, soft felt to hard wood', dot: CLAY },
          { name: 'Edge', gloss: 'the brightness of the contact', dot: OCHRE },
          { name: 'Peak', gloss: 'resonance at the Edge frequency', dot: OCHRE },
          { name: 'Edge Env', gloss: 'the envelope opens the brightness', dot: OCHRE },
        ] },
        { title: 'OBJECT', items: [
          { name: 'Ring Time', gloss: '50 ms of dead wood to 25 s of bell', dot: HEATHER },
          { name: 'Rigidity', gloss: 'soft wood to glass and metal', dot: HEATHER },
          { name: 'Harmonics', gloss: 'from strings into bells', dot: HEATHER },
          { name: 'Density', gloss: '4 partials to all 24', dot: HEATHER },
          { name: 'Tone', gloss: 'dark felt to glassy presence', dot: HEATHER },
          { name: 'Twin', gloss: 'a second, detuned object', dot: HEATHER },
          { name: 'Bloom', gloss: 'energy climbing the partials', dot: HEATHER },
          { name: 'Contact', gloss: 'where the object is touched', dot: CLAY },
          { name: 'Inertia', gloss: 'around 70 percent, it sings', dot: SAND },
          { name: 'Level', gloss: 'the voice, before the room', dot: BONE },
        ] },
        { title: 'ROOM', items: [
          { name: 'Mix', gloss: 'dry against room, level-matched', dot: BONE },
          { name: 'Pre-delay', gloss: '0 to 200 ms before the room answers', dot: DENIM },
          { name: 'Size', gloss: 'the space and the echo time', dot: DENIM },
          { name: 'Regen', gloss: 'slapback to singing feedback', dot: DENIM },
          { name: 'Decay', gloss: 'the tail, 0.2 to about 16 s', dot: DENIM },
          { name: 'Blur', gloss: 'bare delay to reverb wash', dot: SAGE },
          { name: 'Diffusion', gloss: 'how fast reflections smear', dot: SAGE },
          { name: 'Dark', gloss: 'damping, down to a felt curtain', dot: SAGE },
          { name: 'Width', gloss: 'notes placed across the image', dot: SAGE },
          { name: 'Color', gloss: 'bucket-brigade haze on the repeats', dot: SAGE },
        ] },
      ],
    },
    points: [
      { title: 'Pitch is computed, never sampled', text: 'Anima plays any tuning an MPE controller can send. Route Hexatone into it and per-note microtuning works with nothing to set up.' },
      { title: 'Past 70 percent, it sings', text: 'Inertia crosses into self-oscillation at the same point for every material, tuning and register, and it can\'t run away.' },
      { title: 'The same panel on a phone', text: 'On iPhone the surface shows one section at a time. Swipe sideways between ENERGY, OBJECT and ROOM; the ribbon stays put.' },
    ],
    shots: [
      { src: A('anima', 'keys.jpg'), alt: 'Anima in portrait with the keys', caption: 'Portrait, with the keys' },
      { src: A('anima', 'presets.jpg'), alt: 'The presets panel', caption: 'Presets, in banks' },
      { src: A('anima', 'ribbon.jpg'), alt: 'Notes held on the ribbon', caption: 'Notes on the ribbon' },
      { src: A('anima', 'bloom.jpg'), alt: 'Another preset on the surface', caption: 'Another sound, another picture' },
    ],
    seen: [
      { who: 'Jade Starr Music', date: '2026-08-17', href: 'https://www.youtube.com/watch?v=F5v6nTdYUvc' },
      { who: 'The Sound Test Room', date: '2026-08-16', href: 'https://www.youtube.com/watch?v=sDOgQ3WhILw' },
      { who: 'e y l v y', date: '2026-08-07', href: 'https://www.youtube.com/watch?v=kiO_hetcEC4' },
      { who: 'Red Sky Lullaby', date: '2026-07-26', href: 'https://www.youtube.com/watch?v=_WlcEMwoeuE' },
    ],
    faq: [
      { q: 'Does one purchase cover iPad and iPhone?', a: 'Yes. One price, no in-app purchases and no subscription.' },
      { q: 'Does it run inside my host?', a: 'As an AUv3 in AUM, Logic Pro, GarageBand, Cubasis and other hosts, and as a standalone app.' },
      { q: 'Can it play microtonal tunings?', a: 'Yes, per note over MPE. Pitch is computed, so any tuning your controller sends is played exactly. Hexatone drives it with nothing to configure.' },
      { q: 'Can I play it from hardware?', a: 'Any MIDI or MPE controller works. A fixed CC map reaches every control and Glide, in the app and in the plugin, and a sustain pedal is supported.' },
      { q: 'Does it collect data?', a: 'No accounts and no data collected.' },
    ],
  },
  {
    slug: 'voltagecontrol',
    name: 'VoltageControl',
    kind: 'Eurorack-style touch sequencer',
    platforms: 'iPad',
    status: 'out',
    accent: '#e6c25a',
    accentLight: '#8a6a12',
    icon: A('voltagecontrol', 'icon.png'),
    line: 'A Eurorack-style touch sequencer for iPad, standalone and in your DAW. It makes no sound of its own; it sends MIDI.',
    store: 'https://apps.apple.com/us/app/voltagecontrol/id6792703258',
    privacy: true,
    film: { kind: 'device', src: A('voltagecontrol', '01-ping-pong.jpg'), ar: 0.75, alt: 'VoltageControl on iPad: eight plates, four knob rows and a patch bay with cables', caption: 'A ping-pong patch: the step gates wired back into the sequencer\'s own inputs.' },
    thumb: { kind: 'device', src: A('voltagecontrol', '01-ping-pong.jpg'), ar: 0.75 },
    specs: [
      ['Runs on', 'iPad'],
      ['Formats', 'Standalone · AUv3'],
      ['Steps', 'Eight, with four knob rows'],
      ['Output', 'MIDI notes, bend, clock, CC'],
      ['Presets', 'Factory patches, your own as files'],
      ['Data', 'Nothing collected'],
    ],
    statement: 'Every output is a control voltage and every input listens for one. <em class="s">The way you patch it is the way you program it.</em>',
    paragraphs: [
      'Eight steps and four knob rows: pitch, force, time and glide. The plates are position sensitive, so each one is also a fifth lane you play by touch, and tapping a plate jumps the sequence there.',
      'There are no modes and no menus of behaviours. Drag step 8\'s gate into Stop and the sequence halts at the end of a phrase; into Reset, and touching a plate sets where the loop restarts.',
    ],
    panel: {
      title: 'On the panel',
      intro: 'Knob rows, touch plates, the patch bay, and what goes out as MIDI.',
      groups: [
        { title: 'KNOB ROWS', items: [
          { name: 'Pitch', gloss: 'the note of each step' },
          { name: 'Force', gloss: 'velocity, rests and ties' },
          { name: 'Time', gloss: 'stretches or squeezes each step' },
          { name: 'Glide', gloss: 'portamento into the step' },
        ] },
        { title: 'TOUCH', items: [
          { name: 'Plates', gloss: 'position sensitive, low to high' },
          { name: 'CV lane', gloss: 'a fifth lane, drawn by touch' },
          { name: 'Tap', gloss: 'jumps the sequence to that step' },
        ] },
        { title: 'PATCH BAY', items: [
          { name: 'Step gates', gloss: 'one out for every step' },
          { name: 'Stop', gloss: 'halts the sequence' },
          { name: 'Reset', gloss: 'sets where the loop restarts' },
          { name: 'Clock', gloss: 'every gate advances one step' },
          { name: 'Hub', gloss: 'stacks gates and mults, six ports' },
        ] },
        { title: 'MIDI OUT', items: [
          { name: 'Notes', gloss: 'velocity from the Force row' },
          { name: 'Pitch', gloss: 'unquantized on the bend, or chromatic' },
          { name: 'Clock', gloss: 'in and out, with Start and Stop' },
          { name: 'Gates', gloss: 'as notes on their own channel' },
          { name: 'CV and envelope', gloss: 'mod wheel and CC 11' },
        ] },
      ],
    },
    points: [
      { title: 'The sequencer programs itself', text: 'Patch the step gates into Stop, Reset and Clock and the same eight steps become one-shot phrases, ping-pong or a loop you set by touch.' },
      { title: 'Ratcheting is a feature', text: 'While the sequence is stopped, the clock keeps firing the gate and envelope. That is not a bug; that is ratcheting.' },
      { title: 'In your host', text: 'As an AUv3 it follows the host tempo and transport, and the Speed knob becomes a clock ratio: divide by 2, 3 or 4, or multiply.' },
    ],
    shots: [
      { src: A('voltagecontrol', '01-ping-pong.jpg'), alt: 'A ping-pong patch', caption: 'Ping-pong' },
      { src: A('voltagecontrol', '02-one-shot.jpg'), alt: 'A one-shot phrase patch', caption: 'A one-shot phrase' },
      { src: A('voltagecontrol', '05-presets.jpg'), alt: 'Presets in the title bar', caption: 'Presets in the title bar' },
    ],
    faq: [
      { q: 'Does it make sound?', a: 'No. It sends MIDI. Connect any synth app (it appears as the MIDI source "VoltageControl Out") or load the AUv3 in a host next to your synth.' },
      { q: 'Which hosts does it run in?', a: 'Hosts such as AUM and Loopy Pro. It follows the host tempo and transport, and saves with your session.' },
      { q: 'Does the app keep playing in the background?', a: 'The standalone plays while it is on screen and pauses when you switch apps. The AUv3 is how you run it alongside your synth.' },
      { q: 'Can I share patches?', a: 'Yes. Your presets save as files you can share, and every patching move can be undone.' },
      { q: 'Does it collect data?', a: 'No. Nothing leaves your iPad.' },
    ],
  },
  {
    slug: 'bbd-lab',
    name: 'BBD Lab',
    kind: 'Bucket-brigade delay',
    platforms: 'iPad',
    status: 'dev',
    accent: '#ff6a55',
    accentLight: '#c2321f',
    icon: A('bbd-lab', 'icon.png'),
    line: 'A bucket-brigade delay for iPad, simulated chip by chip. In development now.',
    cta: { label: 'Get notified', href: '/contact/?about=bbd-lab' },
    film: { kind: 'device', src: A('bbd-lab', 'panel.jpg'), ar: 1.44, alt: 'The BBD Lab panel, work in progress', caption: 'The panel, work in progress. The details are still moving.' },
    thumb: { kind: 'device', src: A('bbd-lab', 'panel.jpg'), ar: 1.44 },
    specs: [
      ['Runs on', 'iPad'],
      ['Formats', 'AUv3 · Standalone'],
      ['Status', 'In development'],
    ],
    statement: 'Your sound is handed from bucket to bucket one clock tick at a time, <em class="s">and the delay is the clock.</em>',
    points: [
      { title: 'A delay, bucket by bucket', text: 'The classic analog delays passed audio along a chain of tiny capacitors. BBD Lab simulates that chain one transfer at a time, instead of painting an analog sound on top of a digital delay.' },
      { title: 'The delay is the clock', text: 'Slow the clock and the echoes grow longer and darker. The hiss and the faint whine come from the circuit, right where the hardware keeps them.' },
      { title: 'Be the designer', text: 'An analog pedal gives you the circuit its designer chose. Here the bench is open: change the circuit and hear what every part of it does.' },
    ],
  },
  {
    slug: 'datum',
    name: 'Datum',
    kind: 'Tag editor',
    platforms: 'Mac, iPad',
    status: 'beta',
    accent: '#7d7bf0',
    accentLight: '#4a48c4',
    icon: A('datum', 'icon.png'),
    line: 'A native tag editor for your music library, on Mac and iPad. Open a folder, edit the metadata across your tracks, and save only when you decide to.',
    cta: { label: 'Write in', href: '/contact/?about=datum' },
    privacy: true,
    film: { kind: 'icon', src: A('datum', 'icon.png'), alt: 'The Datum icon', caption: 'In beta now. The App Store is next.' },
    thumb: { kind: 'icon', src: A('datum', 'icon.png') },
    specs: [
      ['Runs on', 'Mac and iPad, one download'],
      ['Formats', 'FLAC, ALAC, AAC, MP3, OGG, Opus, WAV, AIFF'],
      ['Status', 'In beta, App Store next'],
      ['Data', 'No accounts, analytics, ads or SDKs'],
    ],
    statement: 'No library to import, no database, no cloud account. <em class="s">Your files stay exactly where they are.</em>',
    paragraphs: [
      'Select a FLAC, an MP3 and an M4A together and edit them in one go. Fields with the same value are ready to edit; fields that differ are marked, so nothing gets overwritten by accident.',
      'Datum edits metadata in place. It never re-encodes your audio, and tags it doesn\'t display, like ReplayGain, MusicBrainz IDs or lyrics, are kept exactly as they were.',
    ],
    panel: {
      title: 'What it covers',
      intro: 'Formats, editing, and what each platform adds.',
      groups: [
        { title: 'FORMATS', items: [
          { name: 'FLAC' }, { name: 'Apple Lossless and AAC', gloss: 'M4A and MP4' }, { name: 'MP3' }, { name: 'OGG Vorbis and Opus' }, { name: 'WAV' }, { name: 'AIFF' },
        ] },
        { title: 'EDITING', items: [
          { name: 'Batch', gloss: 'several tracks at once, mixed formats' },
          { name: 'Cover art', gloss: 'view, replace and extract' },
          { name: 'Manual save', gloss: 'nothing changes until you save' },
        ] },
        { title: 'ON THE MAC', items: [
          { name: 'Numbering', gloss: 'auto-number tracks in sequence' },
          { name: 'Search', gloss: 'across your loaded files' },
          { name: 'Undo', gloss: 'anything' },
        ] },
        { title: 'ON THE IPAD', items: [
          { name: 'Files', gloss: 'open folders from the Files app' },
          { name: 'iCloud Drive', gloss: 'the same careful editing, by touch' },
        ] },
      ],
    },
    points: [
      { title: 'Several tracks at once', text: 'Datum shows what the selected tracks share. Change one field and it applies to every selected track on save.' },
      { title: 'Safe with your files', text: 'Tags are edited in place. Audio is never re-encoded and files are never rewritten from a template.' },
      { title: 'Artwork included', text: 'Drop an image on the editor and it applies to the whole selection, in every supported format, OGG included.' },
    ],
    faq: [
      { q: 'When is it out?', a: 'It is in beta now, and the App Store is next.' },
      { q: 'Mac or iPad?', a: 'Both, native on each, and one download covers both.' },
      { q: 'Does it collect anything?', a: 'No. No accounts, no analytics, no ads, no third-party SDKs.' },
    ],
  },
  {
    slug: 're-deemer',
    name: 'Re-deemer',
    kind: 'Tape echo plug-in',
    platforms: 'VST3, CLAP, AU',
    status: 'out',
    accent: '#ffbd82',
    accentLight: '#b8651a',
    line: 'A cassette tape echo, a faithful build of the TE-2 that never shipped. Lives on its own site, and is coming to iPad.',
    external: 'https://naturarum.github.io/re-deemer/',
    thumb: { kind: 'reels' },
  },
];

export const appBySlug = (slug: string) => APPS.find((a) => a.slug === slug);
export const STATUS_LABEL: Record<Status, string> = { out: 'Out now', dev: 'In development', beta: 'In beta' };
