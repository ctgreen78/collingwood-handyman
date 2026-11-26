// ============================================================
// COLLINGWOOD HANDYMAN: shared site settings
// Real business: Collingwood Handyman, owned by Keith Diver. Copy may say Keith does the work.
// Trust claims below were confirmed by Keith through Chris on 2026-11-25.
// Reviews: only Mike's quote is shown until Keith confirms the rest are real customer reviews.
// No AI image may show a person presented as Keith. Use real job photos or AI scenes without people.
// ============================================================

export const site = {
  name: 'Collingwood Handyman',
  owner: 'Keith Diver',
  url: 'https://collingwoodhandyman.ca',

  phone: '705-795-4009',
  phoneHref: '+17057954009',
  email: 'info@collingwoodhandyman.ca',
  address: { street: '4-115 First St', city: 'Collingwood', region: 'ON', postal: 'L9Y 4W3' },
  hours: 'Monday to Saturday, 8am to 6pm',

  // Confirmed by Keith (2026-11-25). The 4.9/5 rating stays off until the reviews are confirmed.
  claims: {
    years: '30+ years experience',
    licensed: 'Licensed & insured',
    guarantee: '100% satisfaction guaranteed',
    warranty: 'Workmanship warranty',
  },

  // Preview mode: every page carries noindex. Set to false only at launch on collingwoodhandyman.ca.
  preview: true,
  // Live forms: false = the form shows a "Preview only" notice and sends nothing.
  formsLive: false,
  turnstileSiteKey: null,
  showImageCaptions: false,
  formDisclosure: 'Keith uses your details only to reply to your request.',

  // Google Analytics on the current site. Add at launch, not on the test link.
  ga4: 'G-E2FND02JEW',

  ogImage: '/media/collingwood-handyman-logo.png',
};

// Primary navigation (mockup A)
export const nav = [
  { label: 'Services', href: '/services', menu: 'services' },
  { label: 'About Keith', href: '/about' },
  { label: 'Service Areas', href: '/service-areas', menu: 'areas' },
  { label: 'Reviews', href: '/reviews' },
];

// Service groups. Every link is a URL on the live site (sitemap 2026-11-25).
export const serviceGroups = [
  {
    id: 'home-repairs', title: 'Home repairs', icon: 'hammer',
    blurb: 'Fixes, replacements and general upkeep to keep your home in great shape.',
    services: [
      ['Home repair', '/services/home-repair'],
      ['General repairs', '/services/general-repairs'],
      ['Drywall repair', '/services/drywall-repair'],
      ['Carpentry', '/services/carpentry'],
      ['Installations', '/services/installations'],
      ['TV mounting', '/services/tv-mounting'],
      ['Ceiling fan installation', '/services/ceiling-fan-installation'],
      ['Electrical & plumbing', '/services/electrical-and-plumbing'],
      ['Plumbing fixture install', '/services/plumbing-fixture-install'],
      ['Dryer vent cleaning', '/services/dryer-vent-cleaning'],
    ],
  },
  {
    id: 'renovations', title: 'Bathrooms & renovations', icon: 'bath',
    blurb: 'Upgrades and refreshes to create a clean, functional space.',
    services: [
      ['Bathroom renovation', '/services/bathroom-renovation'],
      ['Kitchen remodel', '/services/kitchen-remodel'],
      ['Basement renovation', '/services/basement-renovation'],
      ['Renovations', '/services/renovations'],
      ['Tiling', '/services/tiling'],
      ['Flooring', '/services/flooring'],
      ['Shower & tub caulking', '/services/shower-tub-caulking'],
      ['General contractor', '/services/general-contractor'],
    ],
  },
  {
    id: 'outdoor', title: 'Decks & fences', icon: 'fence',
    blurb: 'Repair, build and maintain decks and fences that work for your home.',
    services: [
      ['Deck repair & new decks', '/services/deck-repair'],
      ['Fence repair', '/services/fence-repair'],
      ['Pressure washing', '/services/pressure-washing'],
    ],
  },
  {
    id: 'painting', title: 'Painting & finishing', icon: 'paint-roller',
    blurb: 'Rooms, cabinets and trim with a clean finish.',
    services: [
      ['Painting', '/services/painting'],
      ['Painting & finishing', '/services/painting-and-finishing'],
      ['Kitchen cabinet painting', '/services/kitchen-cabinet-painting'],
    ],
  },
  {
    id: 'cottage', title: 'Cottage maintenance', icon: 'house',
    blurb: 'Reliable seasonal and ongoing care to keep your cottage ready to enjoy.',
    services: [
      ['Cottage maintenance', '/services/cottage-maintenance'],
      ['Cottage opening', '/services/cottage-open'],
      ['Cottage closing', '/services/cottage-closing'],
    ],
  },
  {
    id: 'property', title: 'Property maintenance', icon: 'key-round',
    blurb: 'Upkeep for homes and rental properties.',
    services: [
      ['Home maintenance', '/services/home-maintenance'],
      ['Property maintenance', '/services/property-maintenance'],
      ['Property manager maintenance', '/services/property-manager-maintenance'],
      ['Tenant placement', '/services/tenant-placement'],
    ],
  },
];

// Area pages on the live site. Elmvale, Angus and Cottage Country are named on the live home page
// but have no page yet (decide in the full rollout).
export const areas = [
  ['Collingwood', '/service-areas/collingwood'],
  ['Wasaga Beach', '/service-areas/wasaga-beach'],
  ['Stayner', '/service-areas/stayner'],
  ['Barrie', '/service-areas/barrie'],
  ['Innisfil', '/service-areas/innisfil'],
  ['Orillia', '/service-areas/orillia'],
  ['New Tecumseth', '/service-areas/new-tecumseth'],
  ['Oro-Medonte', '/service-areas/oro-medonte'],
];

// Towns named in the home page band (mockup A).
export const bandTowns = ['Collingwood', 'Wasaga Beach', 'Stayner', 'Elmvale', 'Barrie', 'Cottage Country'];

export const allServices = serviceGroups.flatMap((g) => g.services.map(([name]) => name));
