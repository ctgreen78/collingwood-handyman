// ============================================================
// Images: the same illustrative set as Wasaga Beach Handyman (Chris 2026-11-26).
// services/: AI scenes named by service slug (Wasaga's services and categories folders).
// cottage-deck-hero.jpg: Unsplash photo (Clay Banks), the Wasaga home hero.
// Rank-and-rent rule: images are illustrative, never presented as a customer project
// or as the service provider. Captions stay hidden while site.showImageCaptions is false.
// The real job photos from the old site were removed 2026-11-26.
// ============================================================

import cottageHero from '../assets/cottage-deck-hero.jpg';

const svc = import.meta.glob('../assets/services/*.jpg', { eager: true, import: 'default' });

export const AI_CAPTION = 'Illustrative image created with AI. Not a completed customer project.';

export const homeHero = {
  src: cottageHero,
  alt: 'Wooden cottage deck with a dining table, chairs and a barbecue among tall trees',
};

const alts = {
  'home-repair': 'White six-panel interior door in a bright hallway, with a red toolbox on a drop cloth',
  'drywall-repair': 'Fresh drywall patch on a grey living room wall, with a mud pan and taping knife on a drop cloth',
  carpentry: 'Pine mudroom bench with a coat hook shelf above and rubber boots underneath',
  'tv-mounting': 'Flat screen TV mounted on a living room wall above a wooden media console',
  'ceiling-fan-installation': 'White ceiling fan with wood tone blades and a light kit in a cottage bedroom',
  'plumbing-fixture-install': 'Brushed nickel faucet on a white bathroom vanity sink',
  'dryer-vent-cleaning': 'White louvered dryer vent hood on beige vinyl siding',
  'deck-repair': 'Wood deck with black metal balusters and a patio table beside a house',
  'fence-repair': 'Wooden privacy fence with a new section of boards beside older weathered panels',
  'pressure-washing': 'Concrete patio half cleaned with a pressure washer, showing the dirty and clean sections',
  painting: 'Paint roller applying navy blue paint to a white wall, with a paint tray on a drop cloth',
  'kitchen-cabinet-painting': 'Kitchen base cabinets partly painted navy blue over natural oak, with a roller and tray',
  flooring: 'Vinyl plank flooring partly installed over underlay, with a tapping block, mallet and tape measure',
  tiling: 'Gloved hands setting white subway tile on a wall, with a trowel, level and tile spacers',
  'bathroom-renovation': 'Renovated bathroom with a glass walk-in shower, grey tile and a wood vanity',
  'kitchen-remodel': 'Renovated kitchen with white shaker cabinets, a navy island and wooden stools',
  'basement-renovation': 'Finished basement family room with a sectional sofa, wall mounted TV and pot lights',
  'shower-tub-caulking': 'Fresh white caulk bead where a white bathtub meets subway tile, beside a chrome tub spout',
  'cottage-open': 'Small wooden cottage in early spring with open shutters, a screen door and a dock on a calm lake',
  'cottage-closing': 'Cottage deck in fall with a covered barbecue and fallen leaves, lake and dock behind',
  'cottage-maintenance': 'Ladder and toolbox on a cottage deck beside grey siding, with a lake view',
  'property-maintenance': 'Ladder against a house beside garden beds, with a lawn mower on a striped lawn',
  'property-manager-maintenance': 'Apartment building walkway with a maintenance cart holding cleaning supplies and a checklist',
  'general-contractor': 'Wood framed home addition under construction, with a hard hat and plans on a table',
  'electrical-and-plumbing': 'Laundry room utility sink with a chrome pull-down faucet, a wall outlet and a ceiling light',
  'home-maintenance': 'Side of a grey bungalow with clean eavestroughs, a downspout, a hose reel and a small wood deck',
  'painting-and-finishing': 'Dining room being repainted, with painter\'s tape on a beige wall, new oak flooring and a covered table',
  'general-repairs': 'Tool bag, cordless drill and screws by a doorway with a patched wall',
  installations: 'Family room with a wall mounted TV, electric fireplace and lit built-in shelves',
  renovations: 'Open concept kitchen renovation with new plank flooring being installed',
};

// Pages without their own image borrow the closest one.
const aliases = { 'tenant-placement': 'painting-and-finishing' };

export function serviceImage(slug) {
  const key = svc[`../assets/services/${slug}.jpg`] ? slug : aliases[slug];
  const src = key && svc[`../assets/services/${key}.jpg`];
  return src ? { src, alt: alts[key] ?? '', caption: AI_CAPTION } : null;
}

// Articles reuse the closest service image. First matching rule wins.
const articleRules = [
  [/fence/, 'fence-repair'],
  [/deck/, 'deck-repair'],
  [/drywall/, 'drywall-repair'],
  [/pressure-washing/, 'pressure-washing'],
  [/caulk/, 'shower-tub-caulking'],
  [/tile|tiling/, 'tiling'],
  [/vanity|bathroom/, 'bathroom-renovation'],
  [/cabinet/, 'kitchen-cabinet-painting'],
  [/kitchen/, 'kitchen-remodel'],
  [/basement/, 'basement-renovation'],
  [/flooring/, 'flooring'],
  [/dryer-vent/, 'dryer-vent-cleaning'],
  [/tv|shelving|furniture/, 'tv-mounting'],
  [/electrical|light-fixtures|ceiling-fan/, 'ceiling-fan-installation'],
  [/faucet|plumbing|pipes/, 'plumbing-fixture-install'],
  [/siding|soffit|eavestrough|gutter|window/, 'home-maintenance'],
  [/turnover|painting/, 'painting'],
  [/cottage/, 'cottage-maintenance'],
  [/rental|landlord|tenant|property-manager/, 'property-manager-maintenance'],
  [/maintenance/, 'property-maintenance'],
  [/contractor|renovation/, 'renovations'],
];
export function articleImage(slug) {
  const hit = articleRules.find(([re]) => re.test(slug));
  return serviceImage(hit ? hit[1] : 'general-repairs') ?? serviceImage('home-repair');
}
