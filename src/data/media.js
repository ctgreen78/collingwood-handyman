// ============================================================
// Images.
// photos/: real job photos from the current collingwoodhandyman.ca site (2026-11-25).
// services/ and categories/: AI scenes Chris makes in ChatGPT later, named by page slug, no people.
// Never show an AI image of a person presented as the service provider.
// ============================================================

import shower from '../assets/photos/bathroom-walk-in-shower.jpg';
import flooring from '../assets/photos/hallway-new-flooring.jpg';

export const photos = {
  shower: { src: shower, alt: 'Walk-in shower with a frameless glass panel, grey tile walls, a niche and black fixtures', label: 'Bathroom renovation' },
  flooring: { src: flooring, alt: 'Hallway and room with new wood-look plank flooring and dark trim', label: 'Flooring' },
};

const svc = import.meta.glob('../assets/services/*.jpg', { eager: true, import: 'default' });

export const AI_CAPTION = 'Illustrative image created with AI. Not a completed customer project.';
const alts = {};

export function serviceImage(slug) {
  const src = svc[`../assets/services/${slug}.jpg`];
  return src ? { src, alt: alts[slug] ?? '', caption: AI_CAPTION } : null;
}
