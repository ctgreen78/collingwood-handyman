// ============================================================
// Images: the same illustrative set as Wasaga Beach Handyman (Chris 2026-11-26), moved to different pages
// so no page shows the picture Wasaga shows in that place (Chris 2026-11-26). Where no related picture fits,
// the image is mirrored instead (carpentry, ceiling fan, dryer vent, deck, fence, pressure washing,
// cottage closing, general contractor, property manager maintenance).
// services/drywall-repair.jpg: new AI image made for Collingwood 2026-11-26 (prompt in IMAGE-PROMPTS.txt).
// home-hero.jpg: AI cottage scene (was Wasaga's cottage-open image).
// services/cottage-maintenance.jpg: Unsplash photo (Clay Banks), Wasaga's home hero.
// Rank-and-rent rule: images are illustrative, never presented as a customer project
// or as the service provider. Captions stay hidden while site.showImageCaptions is false.
// The real job photos from the old site were removed 2026-11-26.
// ============================================================

import heroImg from '../assets/home-hero.jpg';

const svc = import.meta.glob('../assets/services/*.jpg', { eager: true, import: 'default' });

export const AI_CAPTION = 'Illustrative image created with AI. Not a completed customer project.';

export const homeHero = {
  src: heroImg,
  alt: 'Small wooden cottage in early spring with open shutters, a screen door and a dock on a calm lake',
};

const alts = {
  'home-repair': 'Fresh drywall patch on a grey living room wall, with a mud pan and taping knife on a drop cloth',
  'drywall-repair': 'Square drywall patch with tape and fresh joint compound on a cottage bedroom wall, with a compound bucket and drywall knife on a step stool',
  carpentry: 'Pine mudroom bench with a coat hook shelf above and rubber boots underneath',
  'tv-mounting': 'Finished basement family room with a sectional sofa, wall mounted TV and pot lights',
  'ceiling-fan-installation': 'White ceiling fan with wood tone blades and a light kit in a cottage bedroom',
  'plumbing-fixture-install': 'Laundry room utility sink with a chrome pull-down faucet, a wall outlet and a ceiling light',
  'dryer-vent-cleaning': 'White louvered dryer vent hood on beige vinyl siding',
  'deck-repair': 'Wood deck with black metal balusters and a patio table beside a house',
  'fence-repair': 'Wooden privacy fence with a new section of boards beside older weathered panels',
  'pressure-washing': 'Concrete patio half cleaned with a pressure washer, showing the dirty and clean sections',
  painting: 'Dining room being repainted, with painter\'s tape on a beige wall, new oak flooring and a covered table',
  'kitchen-cabinet-painting': 'Renovated kitchen with white shaker cabinets, a navy island and wooden stools',
  flooring: 'Open concept kitchen renovation with new plank flooring being installed',
  tiling: 'Fresh white caulk bead where a white bathtub meets subway tile, beside a chrome tub spout',
  'bathroom-renovation': 'Gloved hands setting white subway tile on a wall, with a trowel, level and tile spacers',
  'kitchen-remodel': 'Kitchen base cabinets partly painted navy blue over natural oak, with a roller and tray',
  'basement-renovation': 'Family room with a wall mounted TV, electric fireplace and lit built-in shelves',
  'shower-tub-caulking': 'Renovated bathroom with a glass walk-in shower, grey tile and a wood vanity',
  'cottage-open': 'Ladder and toolbox on a cottage deck beside grey siding, with a lake view',
  'cottage-closing': 'Cottage deck in fall with a covered barbecue and fallen leaves, lake and dock behind',
  'cottage-maintenance': 'Wooden cottage deck with a dining table, chairs and a barbecue among tall trees',
  'property-maintenance': 'Side of a grey bungalow with clean eavestroughs, a downspout, a hose reel and a small wood deck',
  'property-manager-maintenance': 'Apartment building walkway with a maintenance cart holding cleaning supplies and a checklist',
  'general-contractor': 'Wood framed home addition under construction, with a hard hat and plans on a table',
  'electrical-and-plumbing': 'Brushed nickel faucet on a white bathroom vanity sink',
  'home-maintenance': 'Ladder against a house beside garden beds, with a lawn mower on a striped lawn',
  'painting-and-finishing': 'Paint roller applying navy blue paint to a white wall, with a paint tray on a drop cloth',
  'general-repairs': 'White six-panel interior door in a bright hallway, with a red toolbox on a drop cloth',
  installations: 'Flat screen TV mounted on a living room wall above a wooden media console',
  renovations: 'Vinyl plank flooring partly installed over underlay, with a tapping block, mallet and tape measure',
};

// cottage-maintenance.jpg is a real photo (Unsplash, Clay Banks), not AI.
const captions = { 'cottage-maintenance': 'Photo: Clay Banks on Unsplash.' };

// Pages without their own image borrow the closest one.
const aliases = { 'tenant-placement': 'painting-and-finishing' };

export function serviceImage(slug) {
  const key = svc[`../assets/services/${slug}.jpg`] ? slug : aliases[slug];
  const src = key && svc[`../assets/services/${key}.jpg`];
  return src ? { src, alt: alts[key] ?? '', caption: captions[key] ?? AI_CAPTION } : null;
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
