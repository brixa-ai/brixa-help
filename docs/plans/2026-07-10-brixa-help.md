# brixa-help Knowledge Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the brixa-help repo — 11-category / 33-article hotel-staff knowledge base as plain HTML, a zero-dependency Node static site generator, GitHub Pages deployment, published at `brixa-ai/brixa-help`.

**Architecture:** `content/en/<category>/<article>.html` plain-HTML fragments are the source of truth; `scripts/build.js` wraps them in a shell and generates home/category listing pages into `dist/`; a GitHub Action deploys `dist/` to Pages. Crisp consumes the site later (crawler import now, API sync script in a future milestone).

**Tech Stack:** Node.js ≥ 20 (built-ins only: `node:fs`, `node:path`, `node:test`), GitHub Actions, GitHub Pages.

## Global Constraints

- Spec: `docs/specs/2026-07-10-brixa-help-design.md` — read it before any task.
- Exactly ONE level under each locale: `content/en/<category-slug>/<article-slug>.html`. Never create deeper folders.
- Article format contract: first element `<h1>` (title), immediately followed by one `<p>` that reads standalone as an excerpt. Allowed tags only: `h1 h2 h3 p ul ol li table thead tbody tr th td strong em a`. No attributes except `href` on `<a>`. No classes, ids, styles, scripts, or page chrome (`<html>`, `<head>`, `<body>` forbidden in articles).
- Voice: written for hotel staff. Task-oriented, plain language. NEVER use internal jargon: no pipeline phase numbers, queue names, entity/class names, "BullMQ", "Phase 2.2", "ThreadTurn", "HITL", etc. Say what the user sees, not how it's implemented.
- Quote status naming: the status is called **"Options Presented"** (never "DiscussingOptions").
- When unsure of an exact UI label, describe the function ("the button to send the quote") rather than inventing a label.
- PMS wording is generic ("your PMS", "connected PMS") — "Mews" may be mentioned only as an example of a supported PMS.
- No npm dependencies anywhere. `package.json` has no `dependencies`/`devDependencies`.
- All generated-site links are RELATIVE (site must work under `/brixa-help/` base path).
- Commit after every task with a conventional-commit message.

---

### Task 1: Repo scaffolding — taxonomy, README, AGENTS, gitignore

**Files:**
- Create: `.gitignore`, `package.json`, `taxonomy.json`, `README.md`, `AGENTS.md`
- Already present (commit them): `docs/specs/2026-07-10-brixa-help-design.md`, `docs/plans/2026-07-10-brixa-help.md`

**Interfaces:**
- Produces: `taxonomy.json` schema consumed by Task 2's `build.js`: `{ defaultLocale: string, locales: string[], categories: [{ slug, name, description, order, articleOrder: string[] }] }`. `articleOrder` lists article slugs (no `.html`) in display order.

- [ ] **Step 1: Write `.gitignore`**

```
dist/
node_modules/
.DS_Store
```

- [ ] **Step 2: Write `package.json`**

```json
{
  "name": "brixa-help",
  "version": "1.0.0",
  "private": true,
  "description": "Brixa knowledge base — source of truth for the help center published to GitHub Pages and synced to Crisp",
  "scripts": {
    "build": "node scripts/build.js",
    "test": "node --test scripts/"
  }
}
```

- [ ] **Step 3: Write `taxonomy.json`** (verbatim; descriptions taken from the approved taxonomy)

```json
{
  "defaultLocale": "en",
  "locales": ["en"],
  "categories": [
    { "slug": "getting-started", "name": "Getting Started", "description": "Core orientation for hotel staff who are new to Brixa or need a quick refresher on the platform.", "order": 1, "articleOrder": ["what-brixa-does", "access-and-login", "daily-workflow"] },
    { "slug": "inbox-and-conversations", "name": "Inbox and Conversations", "description": "How staff manage guest conversations, review thread activity, and reply inside Brixa.", "order": 2, "articleOrder": ["viewing-conversations", "replying-to-guests", "conversation-statuses"] },
    { "slug": "quotes-and-offers", "name": "Quotes and Offers", "description": "How staff create, review, send, and track quotes throughout the guest journey.", "order": 3, "articleOrder": ["creating-and-sending-quotes", "quote-statuses", "quote-expiry-and-follow-ups"] },
    { "slug": "guest-booking-actions", "name": "Guest Booking Actions", "description": "What happens after a guest responds to a quote, including acceptance, changes, and cancellations.", "order": 4, "articleOrder": ["acceptances-and-missing-data", "modifications-and-changes", "cancellations"] },
    { "slug": "reservations", "name": "Reservations", "description": "How accepted quotes move toward reservation handling, including readiness, hold states, and confirmed outcomes.", "order": 5, "articleOrder": ["reservation-readiness", "reservation-flow", "reservation-states"] },
    { "slug": "escalations-and-human-intervention", "name": "Escalations and Human Intervention", "description": "How Brixa flags cases that need staff review or manual handling.", "order": 6, "articleOrder": ["when-brixa-escalates", "handling-intervention-cases", "blocked-or-closed-flows"] },
    { "slug": "channels-and-messaging", "name": "Channels and Messaging", "description": "How guest communication works across WhatsApp, Instagram, and related messaging constraints.", "order": 7, "articleOrder": ["channel-basics", "messaging-windows-and-limits", "delivery-and-template-issues"] },
    { "slug": "hotel-setup", "name": "Hotel Setup", "description": "How teams configure the hotel's commercial and operational information inside Brixa.", "order": 8, "articleOrder": ["hotel-profile", "rooms-products-and-amenities", "guest-categories-and-policies"] },
    { "slug": "pms-and-integrations", "name": "PMS and Integrations", "description": "How Brixa connects to external systems and what staff should know about PMS-related behavior.", "order": 9, "articleOrder": ["pms-connection-setup", "sync-behavior", "integration-errors-and-recovery"] },
    { "slug": "troubleshooting", "name": "Troubleshooting", "description": "Fast answers for when something is not working as expected in daily operations.", "order": 10, "articleOrder": ["quote-issues", "messaging-issues", "reservation-and-sync-issues"] },
    { "slug": "account-and-team-management", "name": "Account and Team Management", "description": "How teams manage access, permissions, and multi-property usage.", "order": 11, "articleOrder": ["users-and-access", "permissions", "multi-hotel-workflows"] }
  ]
}
```

- [ ] **Step 4: Write `README.md`** — sections: What this repo is (source of truth for the Brixa knowledge base); Structure (tree diagram matching the spec); Article format contract (copy the Global Constraints bullet verbatim); How to add/edit an article (edit HTML → push to main → Pages redeploys); How to add a category (add to `taxonomy.json` + create folder); Local preview (`npm run build` then open `dist/index.html`); Localization plan (locale folders under `content/`, en only today); Crisp plan (crawler import now, `scripts/crisp-sync.js` API sync later); link to spec.

- [ ] **Step 5: Write `AGENTS.md`** — instructions for future AI sessions: when a feature changes user-visible behavior, grep `content/en/` for affected topics and update articles; obey the article format contract and voice rules (copy from Global Constraints); never add a second folder level; new categories go through `taxonomy.json`; run `npm test` before committing; this repo is independent (do not commit to the Brixa root repo).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: scaffold brixa-help repo — taxonomy, README, AGENTS, spec, plan"
```

---

### Task 2: Static site generator with tests

**Files:**
- Create: `scripts/build.js`
- Test: `scripts/build.test.js`

**Interfaces:**
- Consumes: `taxonomy.json` (Task 1 schema), `content/<locale>/<category>/<slug>.html`.
- Produces: `build(rootDir)` exported from `scripts/build.js`; CLI `node scripts/build.js` builds the repo itself. Output tree: `dist/index.html` (redirect to `en/`), `dist/en/index.html`, `dist/en/<cat>/index.html`, `dist/en/<cat>/<slug>.html`.

- [ ] **Step 1: Write the failing test** `scripts/build.test.js`

```js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { build } = require('./build.js');

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'brixa-help-'));
  fs.writeFileSync(path.join(root, 'taxonomy.json'), JSON.stringify({
    defaultLocale: 'en', locales: ['en'],
    categories: [{ slug: 'getting-started', name: 'Getting Started', description: 'Basics.', order: 1, articleOrder: ['what-brixa-does'] }]
  }));
  const dir = path.join(root, 'content', 'en', 'getting-started');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'what-brixa-does.html'),
    '<h1>What Brixa Does</h1>\n<p>Brixa answers guests for you.</p>\n<h2>Details</h2>\n<p>More.</p>\n');
  return root;
}

test('build generates home, category and article pages', () => {
  const root = makeFixture();
  build(root);
  const dist = path.join(root, 'dist');
  assert.match(fs.readFileSync(path.join(dist, 'index.html'), 'utf8'), /url=en\//);
  const home = fs.readFileSync(path.join(dist, 'en', 'index.html'), 'utf8');
  assert.match(home, /Getting Started/);
  assert.match(home, /getting-started\/index\.html/);
  const cat = fs.readFileSync(path.join(dist, 'en', 'getting-started', 'index.html'), 'utf8');
  assert.match(cat, /What Brixa Does/);
  assert.match(cat, /Brixa answers guests for you\./);   // excerpt
  const art = fs.readFileSync(path.join(dist, 'en', 'getting-started', 'what-brixa-does.html'), 'utf8');
  assert.match(art, /<h1>What Brixa Does<\/h1>/);
  assert.match(art, /<a href="\.\.\/index\.html">/);      // breadcrumb home link is relative
});

test('build fails loudly on article without h1', () => {
  const root = makeFixture();
  fs.writeFileSync(path.join(root, 'content', 'en', 'getting-started', 'broken.html'), '<p>No title.</p>');
  assert.throws(() => build(root), /missing <h1>/);
});

test('all internal links in dist resolve to files', () => {
  const root = makeFixture();
  build(root);
  const dist = path.join(root, 'dist');
  const pages = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      e.isDirectory() ? walk(p) : p.endsWith('.html') && pages.push(p);
    }
  })(dist);
  for (const page of pages) {
    const html = fs.readFileSync(page, 'utf8');
    for (const [, href] of html.matchAll(/href="([^"#]+)"/g)) {
      if (/^https?:/.test(href)) continue;
      const target = path.resolve(path.dirname(page), href);
      assert.ok(fs.existsSync(target), `${page} -> broken link ${href}`);
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails** — `npm test` → FAIL (`Cannot find module './build.js'`).

- [ ] **Step 3: Write `scripts/build.js`**

```js
const fs = require('node:fs');
const path = require('node:path');

const CSS = `
:root{color-scheme:light dark}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#1a202c;background:#fff}
@media (prefers-color-scheme:dark){body{color:#e2e8f0;background:#111418}a{color:#7ab8ff}}
header{border-bottom:1px solid rgba(128,128,128,.25);padding:16px 24px}
header a{text-decoration:none;font-weight:700;color:inherit;font-size:18px}
main{max-width:760px;margin:0 auto;padding:32px 24px 64px}
nav.crumbs{font-size:14px;margin-bottom:24px}
nav.crumbs a{text-decoration:none}
h1{line-height:1.25}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;padding:0;list-style:none}
.cards li{border:1px solid rgba(128,128,128,.3);border-radius:10px;padding:16px 20px}
.cards a{font-weight:600;text-decoration:none;font-size:17px}
.cards p{margin:8px 0 0;font-size:14.5px;opacity:.85}
ul.articles{list-style:none;padding:0}
ul.articles li{padding:14px 0;border-bottom:1px solid rgba(128,128,128,.2)}
ul.articles a{font-weight:600;text-decoration:none;font-size:17px}
ul.articles p{margin:6px 0 0;font-size:14.5px;opacity:.85}
article table{border-collapse:collapse;width:100%;margin:16px 0;font-size:15px}
article th,article td{border:1px solid rgba(128,128,128,.35);padding:8px 10px;text-align:left;vertical-align:top}
footer{max-width:760px;margin:0 auto;padding:0 24px 40px;font-size:13px;opacity:.6}
`.trim();

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function extractTitle(html, file) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!m) throw new Error(`${file}: missing <h1>`);
  return m[1].replace(/<[^>]+>/g, '').trim();
}

function extractExcerpt(html, file) {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
  if (!m) throw new Error(`${file}: missing excerpt <p>`);
  return m[1].replace(/<[^>]+>/g, '').trim();
}

function page({ title, homeHref, crumbs, body }) {
  const crumbHtml = crumbs.length
    ? `<nav class="crumbs">${crumbs.map(c => c.href ? `<a href="${c.href}">${esc(c.label)}</a>` : esc(c.label)).join(' › ')}</nav>`
    : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>${CSS}</style>
</head>
<body>
<header><a href="${homeHref}">Brixa Help Center</a></header>
<main>
${crumbHtml}
${body}
</main>
<footer>Brixa — AI assistant for hotel guest communication.</footer>
</body>
</html>
`;
}

function sortedArticles(dir, articleOrder) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => f.replace(/\.html$/, ''));
  const order = articleOrder || [];
  return files.sort((a, b) => {
    const ia = order.indexOf(a), ib = order.indexOf(b);
    return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib) || a.localeCompare(b);
  });
}

function build(root) {
  const taxonomy = JSON.parse(fs.readFileSync(path.join(root, 'taxonomy.json'), 'utf8'));
  const dist = path.join(root, 'dist');
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });
  const home = `${taxonomy.defaultLocale}/`;
  fs.writeFileSync(path.join(dist, 'index.html'),
    `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${home}"><a href="${home}">Brixa Help Center</a>`);

  for (const locale of taxonomy.locales) {
    const localeSrc = path.join(root, 'content', locale);
    if (!fs.existsSync(localeSrc)) continue;
    const localeDist = path.join(dist, locale);
    fs.mkdirSync(localeDist, { recursive: true });
    const categories = [...taxonomy.categories].sort((a, b) => a.order - b.order)
      .filter(c => fs.existsSync(path.join(localeSrc, c.slug)));

    const cards = categories.map(c => {
      const count = sortedArticles(path.join(localeSrc, c.slug), c.articleOrder).length;
      return `<li><a href="${c.slug}/index.html">${esc(c.name)}</a><p>${esc(c.description)}</p><p>${count} article${count === 1 ? '' : 's'}</p></li>`;
    }).join('\n');
    fs.writeFileSync(path.join(localeDist, 'index.html'), page({
      title: 'Brixa Help Center', homeHref: 'index.html', crumbs: [],
      body: `<h1>How can we help?</h1>\n<ul class="cards">\n${cards}\n</ul>`,
    }));

    for (const cat of categories) {
      const catSrc = path.join(localeSrc, cat.slug);
      const catDist = path.join(localeDist, cat.slug);
      fs.mkdirSync(catDist, { recursive: true });
      const slugs = sortedArticles(catSrc, cat.articleOrder);
      const items = [];
      for (const slug of slugs) {
        const file = path.join(catSrc, `${slug}.html`);
        const html = fs.readFileSync(file, 'utf8');
        const title = extractTitle(html, file);
        const excerpt = extractExcerpt(html, file);
        items.push(`<li><a href="${slug}.html">${esc(title)}</a><p>${esc(excerpt)}</p></li>`);
        fs.writeFileSync(path.join(catDist, `${slug}.html`), page({
          title: `${title} — Brixa Help Center`, homeHref: '../index.html',
          crumbs: [{ label: 'Home', href: '../index.html' }, { label: cat.name, href: 'index.html' }],
          body: `<article>\n${html.trim()}\n</article>`,
        }));
      }
      fs.writeFileSync(path.join(catDist, 'index.html'), page({
        title: `${cat.name} — Brixa Help Center`, homeHref: '../index.html',
        crumbs: [{ label: 'Home', href: '../index.html' }, { label: cat.name }],
        body: `<h1>${esc(cat.name)}</h1>\n<p>${esc(cat.description)}</p>\n<ul class="articles">\n${items.join('\n')}\n</ul>`,
      }));
    }
  }
  return dist;
}

if (require.main === module) {
  const dist = build(path.join(__dirname, '..'));
  console.log(`Built ${dist}`);
}

module.exports = { build };
```

- [ ] **Step 4: Run tests to verify they pass** — `npm test` → 3 pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/ && git commit -m "feat: zero-dependency static site generator with tests"
```

---

### Task 3: GitHub Pages workflow + crisp-sync placeholder

**Files:**
- Create: `.github/workflows/pages.yml`, `scripts/crisp-sync.js`

- [ ] **Step 1: Write `.github/workflows/pages.yml`**

```yaml
name: Deploy Help Center to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm test
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Write `scripts/crisp-sync.js`** — placeholder that exits with a message; header comment documents the future design (Crisp Helpdesk REST API; upsert locale → categories by slug → articles by slug; repo authoritative; deletions flagged, not auto-applied; env vars `CRISP_IDENTIFIER`, `CRISP_KEY`, `CRISP_WEBSITE_ID`).

```js
#!/usr/bin/env node
/**
 * crisp-sync.js — NOT YET IMPLEMENTED (placeholder).
 *
 * Planned behavior (see docs/specs/2026-07-10-brixa-help-design.md):
 *   1. Read taxonomy.json + content/<locale>/ (this repo is the source of truth).
 *   2. Authenticate to the Crisp Helpdesk REST API
 *      (env: CRISP_IDENTIFIER, CRISP_KEY, CRISP_WEBSITE_ID).
 *   3. Upsert per locale: categories matched by slug, then articles matched by slug
 *      (title from <h1>, body from the article HTML), then publish.
 *   4. Idempotent. Articles present in Crisp but absent here are REPORTED, never deleted.
 */
console.error('crisp-sync is not implemented yet — see header comment for the planned design.');
process.exit(1);
```

- [ ] **Step 3: Commit**

```bash
git add .github scripts/crisp-sync.js && git commit -m "feat: GitHub Pages deploy workflow + crisp-sync placeholder"
```

---

### Tasks 4–14: Article content, one task per category

Shared instructions for every content task (repeat to each subagent verbatim, together with Global Constraints):

- Create exactly 3 files in `content/en/<category-slug>/`, named per `taxonomy.json` `articleOrder`.
- Each article: `<h1>` title, then one standalone-excerpt `<p>` (1–2 sentences, plain text), then 3–7 sections of body. Target 250–550 words per article. Use `<h2>` for sections, tables for status/state matrices, ordered lists for step-by-step tasks.
- Ground content in the listed source docs (read them), but TRANSLATE to what hotel staff experience in the product. If a source doc detail is purely internal, omit it. If unsure whether something is user-visible, describe it behaviorally and generically.
- Cross-link related articles with relative hrefs like `<a href="../quotes-and-offers/quote-statuses.html">Quote statuses</a>` (or `quote-statuses.html` within the same category).
- Verify: `npm test` passes (build enforces the h1/excerpt contract); then commit `content/en/<category-slug>/` with `docs(kb): <category name> articles`.

| Task | Category | Articles (slugs) | Primary sources to read |
|---|---|---|---|
| 4 | getting-started | what-brixa-does, access-and-login, daily-workflow | `clock-be/docs/ai-system-overview.md`; taxonomy descriptions. what-brixa-does: what Brixa is (AI assistant answering guest messages, drafting/sending replies, building quotes, handing off to staff when needed), what it does NOT do alone. access-and-login: signing in at app.brixa.ai, selecting your hotel, workspace tour at a functional level. daily-workflow: morning review → conversations needing attention → review drafts/quotes → guest responses → escalations. |
| 5 | inbox-and-conversations | viewing-conversations, replying-to-guests, conversation-statuses | `clock-be/docs/ui-message-endpoints.md`, `clock-be/docs/ai-system-overview.md`. Conversations arrive from connected channels; Brixa may auto-reply or leave a draft for review; staff can always reply manually; describe open vs closed conversations and what reopens them (new guest message). |
| 6 | quotes-and-offers | creating-and-sending-quotes, quote-statuses, quote-expiry-and-follow-ups | `clock-be/docs/quote-resource-lifecycle.md`, `clock-be/docs/quote-status-events.md`, `clock-be/docs/smart-follow-up-frontend-api.md`. quote-statuses is the dense one: table of statuses (draft, sent, Options Presented, accepted, rejected, expired, cancelled — use the doc's real lifecycle) with "what it means" + "what you can do". Follow-ups: automatic reminders before expiry, what staff can adjust. |
| 7 | guest-booking-actions | acceptances-and-missing-data, modifications-and-changes, cancellations | `clock-be/docs/quote-acceptance-notification-system.md`, `clock-be/docs/quote-status-events.md`. Acceptance may arrive with guest details still missing — Brixa collects required details before the booking can proceed; staff notified on acceptance. Modifications: guest asks to change dates/occupancy/rooms → Brixa prepares an updated quote. Cancellations: how requests are recognized and what staff should confirm. |
| 8 | reservations | reservation-readiness, reservation-flow, reservation-states | `clock-be/docs/pms-helper-contract.md`, memory notes: readiness = required guest details complete; flow = accepted quote → reservation created in connected PMS when write is enabled; states: pending/optional/confirmed/expired described behaviorally. |
| 9 | escalations-and-human-intervention | when-brixa-escalates, handling-intervention-cases, blocked-or-closed-flows | `clock-be/docs/hitl-intervention.md`. Triggers (guest asks for a human, AI uncertainty, sensitive topics, repeated failures, payment/complaint situations per doc), severity levels and notifications, how staff resolve and hand back to Brixa, what to do when automation stops for a conversation. |
| 10 | channels-and-messaging | channel-basics, messaging-windows-and-limits, delivery-and-template-issues | `INSTAGRAM_DEPLOYMENT_GUIDE.md` (root), `clock-be/docs/instagram-whatsapp-test-cheatsheet.md`. WhatsApp 24-hour customer-service window and template messages; Instagram 7-day window rules as applicable; delivery failures: what a failed send means, template rejections, and that Brixa flags failures needing staff attention. |
| 11 | hotel-setup | hotel-profile, rooms-products-and-amenities, guest-categories-and-policies | Explore `clock-be/src/entities/` briefly for real concepts (hotel, room types, products, amenities, guest categories/age bands, policies) but keep everything behavioral: what to configure, why it matters for quote accuracy (rooms/occupancy/products appear in quotes; required products included on every option). |
| 12 | pms-and-integrations | pms-connection-setup, sync-behavior, integration-errors-and-recovery | `clock-be/docs/pms-helper-contract.md`, `brixa-pms/README.md` if present. Connection: credentials from your PMS provider, what Brixa reads (availability/inventory) and writes (reservations, when enabled). Sync: reads are on-demand/cached; what is NOT synced. Errors: temporary PMS outages, what Brixa does (retries, escalates), when to contact support. Generic PMS wording; Mews only as an example. |
| 13 | troubleshooting | quote-issues, messaging-issues, reservation-and-sync-issues | Synthesize from categories 6, 10, 8/12 articles (read the already-written HTML in `content/en/`). Format each as symptom → likely cause → what to do, using `<h2>` per symptom. Link to the detailed articles. |
| 14 | account-and-team-management | users-and-access, permissions, multi-hotel-workflows | Least doc coverage — keep general and behavioral: inviting staff, roles conceptually (admin vs staff), access limited per hotel, switching hotels for multi-property teams, contacting your administrator/Brixa support for access problems. Do not invent specific role names beyond admin/staff. |

Note: Task 13 depends on Tasks 6, 8, 10, 12 being committed first. Tasks 4–12 and 14 are independent of each other.

---

### Task 15: Full build verification + publish to GitHub

**Files:**
- No new files. Runs verification, creates remote, pushes, enables Pages.

- [ ] **Step 1: Full verification** — `npm test` (includes link-resolution test over fixture) then `npm run build`; count pages: expect `dist/index.html` + `dist/en/index.html` + 11 category index pages + 33 article pages = 46 HTML files. Spot-open home, one category, one article.

- [ ] **Step 2: Create repo and push**

```bash
gh repo create brixa-ai/brixa-help --public --description "Brixa Help Center — knowledge base source of truth (GitHub Pages + Crisp)" --source . --push
```

- [ ] **Step 3: Enable Pages with Actions source**

```bash
gh api -X POST repos/brixa-ai/brixa-help/pages -f build_type=workflow
```

(If it already exists: `gh api -X PUT repos/brixa-ai/brixa-help/pages -f build_type=workflow`.)

- [ ] **Step 4: Verify deploy** — watch the Actions run (`gh run watch`), then `curl -sI https://brixa-ai.github.io/brixa-help/` expecting 200, and fetch one article URL expecting 200.

- [ ] **Step 5: Clean up the planning seed** — move root `knowledge-base-category-taxonomy.md` into `brixa-help/docs/` as the human-readable taxonomy reference, commit in brixa-help, remove from the Brixa root folder (it was untracked there).
