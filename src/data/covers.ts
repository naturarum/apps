// The covers (printed.cover), for when they move in. Hidden while SHOW_COVERS is false in site.ts.
export type Cover = { slug: string; name: string; kind: string; thumb?: string };
export const COVERS: Cover[] = [
  { slug: 't1', name: 'T-1', kind: 'Algorithmic sequencer' },
  { slug: 'tonverk', name: 'Tonverk', kind: 'Multi-timbral sampler' },
  { slug: 'digi', name: 'Elektron boxes', kind: 'Digitone, Digitakt, Syntakt' },
  { slug: 's4', name: 'S-4', kind: 'Sculpting sampler' },
];
