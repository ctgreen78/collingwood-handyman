// Structured data for a real local business (Collingwood Handyman, owner Keith Diver).
// HomeAndConstructionBusiness with the address and hours published on the live site.
// No AggregateRating or Review markup until Keith confirms the reviews.
import { site, areas } from '../data/site.js';

const ORG_ID = `${site.url}/#business`;
const SITE_ID = `${site.url}/#website`;

export function business() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': ORG_ID,
    name: site.name,
    url: `${site.url}/`,
    logo: `${site.url}/media/collingwood-handyman-logo.png`,
    image: `${site.url}${site.ogImage}`,
    telephone: site.phoneHref,
    email: site.email,
    founder: { '@type': 'Person', name: site.owner },
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postal,
      addressCountry: 'CA',
    },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00', closes: '18:00',
    }],
    areaServed: areas.map(([name]) => ({ '@type': 'City', name: `${name}, ON` })),
  };
}

export function website() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': SITE_ID, name: site.name, url: `${site.url}/`, publisher: { '@id': ORG_ID } };
}

export function webPage({ path, title, description }) {
  const url = `${site.url}${path === '/' ? '/' : path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url, name: title, description,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
  };
}

export function breadcrumbs(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${site.url}${it.href}` })),
  };
}

export function service({ name, path, description, area = 'Collingwood' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${name} in ${area}`,
    serviceType: name,
    url: `${site.url}${path}`,
    description,
    areaServed: areas.map(([n]) => ({ '@type': 'City', name: `${n}, ON` })),
    provider: { '@id': ORG_ID },
  };
}

export function faqPage(faqs) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function article({ a, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.seoDescription,
    url: `${site.url}${path}`,
    mainEntityOfPage: `${site.url}${path}`,
    datePublished: a.datePublished || undefined,
    dateModified: a.dateModified || a.datePublished || undefined,
    author: { '@type': 'Person', name: site.owner, url: `${site.url}/about` },
    publisher: { '@id': ORG_ID },
  };
}
