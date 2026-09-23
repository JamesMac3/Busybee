// All business copy and assets live here so the page can be edited without
// touching layout code. Only verified facts belong in `business` and `team`.

export const business = {
  name: 'Busy Bee Lawn',
  phone: '615-621-5296',
  phoneHref: 'tel:+16156215296',
  email: 'Services@BusyBeeLawn.net',
  areas: ['Murfreesboro', 'Smyrna', 'Christiana'],
  region: 'Middle Tennessee',
  logo: {
    srcSet: '/images/busy-bee-lawn-logo-220.webp 1x, /images/busy-bee-lawn-logo-440.webp 2x',
    fallback: '/images/busy-bee-lawn-logo-220.png',
    width: 220,
    height: 84,
  },
};

export const nav = [
  { label: 'Services', href: '#services' },
  { label: 'Our Work', href: '#work' },
  { label: 'The Hive', href: '#about' },
];

export const hero = {
  titleLead: 'Got a grass problem?',
  titlePunch: 'Make it ours.',
  lede: 'Home lawns. Business grounds. Entire communities. From a fresh cut to ongoing landscape care, put our busy bees to work across Middle Tennessee.',
  primary: 'Let’s Fix My Yard',
  secondary: { label: 'Meet the Hive', href: '#about' },
  // Illustrative stock photo (Unsplash License) — not a Busy Bee project.
  image: {
    src: '/images/work-striped-avenue-1300.webp',
    srcSet: '/images/work-striped-avenue-700.webp 700w, /images/work-striped-avenue-1300.webp 1300w',
    sizes: '(min-width: 960px) 50vw, 100vw',
    alt: 'Expansive striped lawn framed by precisely maintained hedges and landscaped grounds',
    width: 1300,
    height: 867,
  },
};

// The "What's bugging your yard?" choices. `short` builds the contextual CTA
// ("Get a quote for mowing + garden beds") and the quote summary chips.
export const problems = [
  {
    id: 'grass',
    icon: 'grass',
    title: 'My grass is getting away from me',
    benefit: 'Regular mowing that keeps it neat without you lifting a finger.',
    short: 'mowing',
    service: 'Lawn mowing',
  },
  {
    id: 'edges',
    icon: 'shears',
    title: 'My edges and shrubs need attention',
    benefit: 'Crisp edges, tidy trim lines, and shrubs shaped back into form.',
    short: 'edging + shrubs',
    service: 'Edging, trimming & pruning',
  },
  {
    id: 'beds',
    icon: 'mulch',
    title: 'My beds need a refresh',
    benefit: 'Fresh mulch and cleaned-up beds that make the whole yard look finished.',
    short: 'garden beds',
    service: 'Mulching & garden beds',
  },
  {
    id: 'design',
    icon: 'design',
    title: 'I want a whole new look',
    benefit: 'New plantings and layouts designed around how you use your yard.',
    short: 'a new landscape',
    service: 'Landscape design & installation',
  },
  {
    id: 'seasonal',
    icon: 'leaf',
    title: 'I need seasonal cleanup',
    benefit: 'Leaves, debris, and overgrowth cleared so you can start the season fresh.',
    short: 'seasonal cleanup',
    service: 'Seasonal cleanup',
  },
  {
    id: 'unsure',
    icon: 'question',
    title: 'I’m not sure—help me decide',
    benefit: 'Tell us what’s bothering you and we’ll suggest where to start.',
    short: 'help deciding',
    service: 'Help me decide',
  },
];

export const services = [
  { icon: 'mower', title: 'Lawn Mowing', problem: 'grass', text: 'Consistent, clean cuts on a schedule that fits your yard.' },
  { icon: 'edging', title: 'Edging & Trimming', problem: 'edges', text: 'Sharp lines along drives, walks, and beds, and careful trimming where mowers can’t reach.' },
  { icon: 'mulch', title: 'Mulching & Garden Beds', problem: 'beds', text: 'Fresh mulch and tidy beds that hold moisture, keep weeds down, and frame your home.' },
  { icon: 'design', title: 'Landscape Design & Installation', problem: 'design', text: 'Planting plans and installs shaped around how you want to use your outdoor space.' },
  { icon: 'leaf', title: 'Seasonal Cleanup & Maintenance', problem: 'seasonal', text: 'Spring refreshes and fall leaf cleanups that keep your property ready for every season.' },
  { icon: 'shears', title: 'Ornamental Pruning', problem: 'edges', text: 'Thoughtful shaping that keeps shrubs and small ornamentals healthy and in proportion.' },
];

// Portfolio slots. All current photos are illustrative stock (Unsplash License).
// Replace with approved Busy Bee project photos and set `isProject: true`.
export const work = {
  eyebrow: 'Picture the possibilities',
  title: 'Less yard work. More yard pride.',
  intro: 'Clean stripes, crisp edges, and beds that look finished. Pick your next yard upgrade and let the hive get busy.',
  note: 'Landscape inspiration shown with illustrative photography, not completed Busy Bee projects.',
  items: [
    {
      key: 'stripes',
      cta: 'Make the cut!',
      problem: 'grass',
      caption: 'Lines you can see from the street',
      sub: 'Mowing',
      src: '/images/work-striped-avenue-1300.webp',
      srcSet: '/images/work-striped-avenue-700.webp 700w, /images/work-striped-avenue-1300.webp 1300w',
      alt: 'Long lawn with crisp mowing stripes between tall clipped hedges',
      isProject: false,
    },
    {
      key: 'trim',
      cta: 'Line it up!',
      problem: 'edges',
      caption: 'Trimmed where the mower can’t reach',
      sub: 'Edging & trimming',
      src: '/images/work-trimming-1100.webp',
      srcSet: '/images/work-trimming-640.webp 640w, /images/work-trimming-1100.webp 1100w',
      alt: 'String trimmer tidying grass along a fence line',
      isProject: false,
    },
    {
      key: 'shrubs',
      cta: 'Shape things up!',
      problem: 'edges',
      caption: 'Shrubs back in shape',
      sub: 'Ornamental pruning',
      src: '/images/work-shaped-shrubs-1300.webp',
      srcSet: '/images/work-shaped-shrubs-700.webp 700w, /images/work-shaped-shrubs-1300.webp 1300w',
      alt: 'Rounded, neatly pruned shrubs and a flowering azalea in front of a home',
      isProject: false,
    },
    {
      key: 'beds',
      cta: 'Give my beds a glow-up!',
      problem: 'beds',
      caption: 'Beds that look finished',
      sub: 'Garden beds',
      src: '/images/work-garden-bed-1100.webp',
      srcSet: '/images/work-garden-bed-640.webp 640w, /images/work-garden-bed-1100.webp 1100w',
      alt: 'Spring flower bed bordered with natural stone around a tree',
      isProject: false,
    },
    {
      key: 'curb',
      cta: 'Bring on the curb appeal!',
      problem: 'design',
      caption: 'Curb appeal, start to finish',
      sub: 'Landscape design',
      src: '/images/work-tudor-home-1300.webp',
      srcSet: '/images/work-tudor-home-700.webp 700w, /images/work-tudor-home-1300.webp 1300w',
      alt: 'Front yard with a neatly edged walkway and full green lawn leading to a home',
      isProject: false,
    },
  ],
};

export const process = [
  { title: 'Tell us about your yard.', text: 'Pick what’s bugging you and share a few details. It takes about a minute.' },
  { title: 'Receive a tailored quote.', text: 'We follow up with a clear quote built around your property.' },
  { title: 'Enjoy your outdoor space.', text: 'Our bees get busy. You get your weekends back.' },
];

// Portraits are the team's existing profile photos from busybeelawn.net.
export const team = {
  eyebrow: 'Meet the hive',
  title: 'One family. One hive. All buzz, no fuss.',
  copy: 'Meet John and Jared Fricke, the father and son behind the hive. Rooted in Middle Tennessee, our busy bees turn your yard’s to-do list into more time to enjoy it.',
  cta: 'Put Our Hive to Work',
  // Profiles: background-removed B&W portraits on a shared oval backdrop.
  // John and Jared are their existing photos from busybeelawn.net; Busy Bee is the logo mascot.
  members: [
    {
      name: 'John Fricke',
      role: 'Owner',
      src: '/images/team-john-cut-480.webp',
      srcSet: '/images/team-john-cut-240.webp 240w, /images/team-john-cut-480.webp 480w',
      alt: 'Portrait of John Fricke, owner of Busy Bee Lawn',
    },
    {
      name: 'Jared Fricke',
      role: 'Operations Manager',
      src: '/images/team-jared-cut-480.webp',
      srcSet: '/images/team-jared-cut-240.webp 240w, /images/team-jared-cut-480.webp 480w',
      alt: 'Portrait of Jared Fricke, operations manager at Busy Bee Lawn',
    },
    {
      name: 'Busy Bee',
      role: 'Worker Bee',
      src: '/images/team-bee-cut-480.webp',
      srcSet: '/images/team-bee-cut-240.webp 240w, /images/team-bee-cut-480.webp 480w',
      alt: 'Busy Bee, the Busy Bee Lawn mascot',
    },
  ],
};

export const quote = {
  eyebrow: 'Free quote',
  title: 'Your yard problem. Our next project.',
  lede: 'Three quick steps. No account, no obligation—just enough detail for a tailored quote.',
  previewNotice: 'Preview only — this form does not send an inquiry.',
  steps: ['Your yard', 'Your property', 'How to reach you'],
};



