// Loads page content written as JSON under src/data/content/.
const serviceFiles = import.meta.glob('./content/services*.json', { eager: true, import: 'default' });
const areaFile = import.meta.glob('./content/areas.json', { eager: true, import: 'default' });
const blogFiles = import.meta.glob('./content/blog/*.json', { eager: true, import: 'default' });
const insightFiles = import.meta.glob('./content/insights/*.json', { eager: true, import: 'default' });

export const services = Object.values(serviceFiles).flat();
export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
export const areaPages = Object.values(areaFile)[0] ?? [];
export const areaBySlug = Object.fromEntries(areaPages.map((a) => [a.slug, a]));

const newest = (a, b) => (b.dateModified || b.datePublished || '').localeCompare(a.dateModified || a.datePublished || '');
export const blogPosts = Object.values(blogFiles).sort(newest);
export const insights = Object.values(insightFiles).sort(newest);
export const allArticles = [...blogPosts, ...insights].sort(newest);
export const articleUrl = (a) => `/${a.kind === 'insights' ? 'insights' : 'blog'}/${a.slug}`;

// First paragraph of an article as plain text, for cards and fallbacks.
export function excerpt(a, max = 170) {
  const src = a.lede || (a.html.match(/<p>(.*?)<\/p>/s)?.[1] ?? '');
  const t = src.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').trim();
  return t.length > max ? t.slice(0, t.lastIndexOf(' ', max)) + '…' : t;
}
