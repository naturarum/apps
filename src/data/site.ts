// Site-wide settings. The masthead, the index sheet and the colophon all read from here and
// from apps.ts / covers.ts, so a new department or product is a data change, not a page edit.

// Covers move in later (the printed.cover project). Until then the tab, the index column and
// the covers legal line stay hidden. Flip this when the covers pages are ready.
export const SHOW_COVERS = false;

export const SITE = {
  name: 'naturarum',
  tagline: SHOW_COVERS
    ? 'Instruments and tools for iPad, iPhone and Mac, and covers for the hardware beside them.'
    : 'Instruments and tools for iPad, iPhone and Mac.',
  description:
    'Instruments and tools for iPad, iPhone and Mac: Hexatone, Pond, Anima, VoltageControl, BBD Lab, Datum and Re-deemer.',
  // Web3Forms relay: the access key is public by design; the address it delivers to never
  // appears in the page.
  web3formsKey: '81eadc19-b4fa-4e97-a57d-eba120b42ce5',
  goatcounter: 'https://naturarum.goatcounter.com/count',
  coversLegal:
    'Covers: independent project, not affiliated with or endorsed by Torso Electronics, Elektron, Teenage Engineering or Chase Bliss. Product names are used only to say what each cover fits.',
};

export type Tab = { n: string; label: string; href: string; match: string };

export const TABS: Tab[] = [
  { n: '01', label: 'News', href: '/', match: 'news' },
  { n: '02', label: 'Apps', href: '/apps/', match: 'apps' },
  ...(SHOW_COVERS ? [{ n: '03', label: 'Covers', href: '/covers/', match: 'covers' }] : []),
  { n: SHOW_COVERS ? '04' : '03', label: 'Contact', href: '/contact/', match: 'contact' },
];

// The "Also" column of the index sheet and the colophon.
export const ALSO = [
  { name: 'News', kind: 'Releases, works in progress, press', href: '/' },
  { name: 'SFZ Builder', kind: 'Web tool for Hexatone', href: '/tools/sfz-builder/' },
  { name: 'Contact', kind: 'One form for everything', href: '/contact/' },
  { name: 'Feed', kind: 'RSS, for any reader', href: '/news/feed.xml' },
];
