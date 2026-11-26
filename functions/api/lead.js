// Cloudflare Pages Function: POST /api/lead
// Receives the quote form, checks it, and emails the lead through the Emailit API.
//
// Settings (Cloudflare Pages > collingwood-handyman > Settings > Variables and secrets):
//   LEADS_ENABLED     "true" to send. Anything else = switched off (form is accepted, nothing is sent).
//   EMAILIT_API_KEY   Emailit sending key (store as a SECRET, never in code or GitHub).
//   LEAD_TO           Who receives leads, e.g. "info@collingwoodhandyman.ca" (comma-separate for several).
//   LEAD_FROM         Sender on a domain verified in Emailit, e.g. "Collingwood Handyman <leads@collingwoodhandyman.ca>".
//   LEAD_BCC          Optional copy to a second address.
//   TURNSTILE_SECRET  Optional. When set, a valid Cloudflare Turnstile token is required.
//
// Privacy: lead details are only placed in the email. Nothing is logged or stored here.

const EMAILIT_URL = 'https://api.emailit.com/v2/emails';
const MAX = { name: 100, phone: 40, town: 100, email: 200, service: 100, details: 4000, source_page: 300 };

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

function wantsJson(request) {
  return (request.headers.get('Accept') || '').includes('application/json');
}

// Browsers without JavaScript post the form normally: send them to a page instead of raw JSON.
function reply(request, ok, payload, status) {
  if (wantsJson(request)) return json(payload, status);
  const to = ok ? '/thanks' : '/contact?error=1#quote';
  return Response.redirect(new URL(to, request.url).toString(), 303);
}

async function readForm(request) {
  const type = request.headers.get('Content-Type') || '';
  if (type.includes('application/json')) return await request.json();
  const fd = await request.formData();
  return Object.fromEntries(fd.entries());
}

async function turnstileOk(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true;
  if (!token) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = await r.json().catch(() => ({}));
  return data.success === true;
}

function buildEmail(lead, when) {
  const rows = [
    ['Name', esc(lead.name)],
    ['Phone', `<a href="tel:${esc(lead.phone.replace(/[^\d+]/g, ''))}">${esc(lead.phone)}</a>`],
    ['Email', lead.email ? `<a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a>` : 'Not given'],
    ['Town or postcode', esc(lead.town)],
    ['Service', esc(lead.service || 'Not selected')],
    ['Sent from page', esc(lead.source_page || '/')],
    ['Received', esc(when)],
  ];
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#142f3a;line-height:1.5">
<h2 style="margin:0 0 12px">New quote request: ${esc(lead.service || 'Handyman work')} in ${esc(lead.town)}</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) =>
    `<tr><td style="font-weight:bold;vertical-align:top;border-bottom:1px solid #d8e1e1">${k}</td><td style="border-bottom:1px solid #d8e1e1">${v}</td></tr>`).join('')}</table>
<h3 style="margin:18px 0 6px">Project details</h3>
<p style="white-space:pre-wrap;margin:0">${esc(lead.details)}</p>
<p style="margin-top:18px;font-size:12px;color:#4a5d64">Sent by the collingwoodhandyman.ca quote form.</p>
</body></html>`;
  const text = [
    `New quote request: ${lead.service || 'Handyman work'} in ${lead.town}`,
    '',
    ...rows.map(([k]) => `${k}: ${({ Name: lead.name, Phone: lead.phone, Email: lead.email || 'Not given', 'Town or postcode': lead.town, Service: lead.service || 'Not selected', 'Sent from page': lead.source_page || '/', Received: when })[k]}`),
    '',
    'Project details:',
    lead.details,
  ].join('\n');
  return { html, text };
}

// Settings can pick up stray spaces or line breaks when pasted, so trim them all.
function settings(env) {
  const t = (v) => (typeof v === 'string' ? v.trim() : v);
  return {
    LEADS_ENABLED: (t(env.LEADS_ENABLED) || '').toLowerCase(),
    EMAILIT_API_KEY: t(env.EMAILIT_API_KEY),
    LEAD_TO: t(env.LEAD_TO),
    LEAD_FROM: t(env.LEAD_FROM),
    LEAD_BCC: t(env.LEAD_BCC),
    TURNSTILE_SECRET: t(env.TURNSTILE_SECRET),
  };
}

export async function onRequestPost({ request, env: rawEnv }) {
  const env = settings(rawEnv);
  let raw;
  try { raw = await readForm(request); } catch { return reply(request, false, { ok: false, error: 'bad_request' }, 400); }

  // Honeypot: real visitors never see or fill the "company" field.
  if (clean(raw.company, 200)) return reply(request, true, { ok: true });

  const lead = Object.fromEntries(Object.entries(MAX).map(([k, max]) => [k, clean(raw[k], max)]));
  // Only accept a site path like /services/deck-repair as the source page.
  if (!/^\/[a-z0-9\-\/]*$/i.test(lead.source_page)) lead.source_page = '/';
  const missing = ['name', 'phone', 'town', 'details'].filter((k) => !lead[k]);
  if ((lead.phone.match(/\d/g) || []).length < 10) missing.push('phone');
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) missing.push('email');
  if (missing.length) return reply(request, false, { ok: false, error: 'invalid', fields: [...new Set(missing)] }, 422);

  const ip = request.headers.get('CF-Connecting-IP');
  if (!(await turnstileOk(env, clean(raw['cf-turnstile-response'], 2048), ip))) {
    return reply(request, false, { ok: false, error: 'verification_failed' }, 403);
  }

  // Switched off: accept the request but send nothing (preview and test links).
  if (env.LEADS_ENABLED !== 'true') return reply(request, true, { ok: true, sent: false, reason: 'leads_disabled' });

  const missingSettings = ['EMAILIT_API_KEY', 'LEAD_TO', 'LEAD_FROM'].filter((k) => !env[k]);
  if (missingSettings.length) {
    // Names only, never values.
    return reply(request, false, { ok: false, error: 'not_configured', missing: missingSettings }, 503);
  }

  const when = new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto', dateStyle: 'medium', timeStyle: 'short' });
  const { html, text } = buildEmail(lead, when);
  const payload = {
    from: env.LEAD_FROM,
    to: env.LEAD_TO,
    subject: `New quote request: ${lead.service || 'Handyman work'} in ${lead.town}`,
    html,
    text,
    tracking: false,
    meta: { source: 'collingwoodhandyman.ca', page: lead.source_page || '/', service: lead.service || '' },
  };
  if (lead.email) payload.reply_to = lead.email;
  if (env.LEAD_BCC) payload.bcc = env.LEAD_BCC;

  try {
    const r = await fetch(EMAILIT_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.EMAILIT_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) return reply(request, false, { ok: false, error: 'send_failed', status: r.status }, 502);
    return reply(request, true, { ok: true, sent: true });
  } catch {
    return reply(request, false, { ok: false, error: 'send_failed' }, 502);
  }
}

// Anything other than POST gets a plain 405.
export function onRequest() {
  return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
}
