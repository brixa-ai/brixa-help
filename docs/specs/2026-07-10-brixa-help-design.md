# brixa-help — Knowledge Base Design

Date: 2026-07-10
Status: Approved

## Purpose

Public knowledge base for hotel staff using Brixa. This repository is the **source of truth** for all knowledge base content. It serves three consumers, in order of delivery:

1. **GitHub Pages site** — browsable help center: categories → article lists → articles.
2. **Crisp one-click import** — Crisp's "import your previous knowledge base" crawler pointed at the Pages URL.
3. **Crisp API sync** (future) — `scripts/crisp-sync.js` upserts categories/articles into Crisp via its Helpdesk REST API, keeping Crisp in lockstep with this repo.

## Constraints (from product owner)

- Exactly **one level** of hierarchy: categories, then articles. No subcategories.
- Article format is **basic HTML**.
- Multilingual eventually (en, it, es, …) but **English only** at launch.
- On every new Brixa feature, this repo is reviewed and updated — it is the living documentation of the product for end users.

## Repository structure

```
brixa-help/
├── README.md                        how it works, how to add/edit articles, Crisp plans
├── AGENTS.md                        instructions for AI sessions: update KB when features ship
├── taxonomy.json                    categories: slug, name, description, order (drives listing pages)
├── content/
│   └── en/                          locale prefix from day one; it/, es/ added later without URL breakage
│       └── <category-slug>/<article-slug>.html
├── scripts/
│   ├── build.js                     static site generator — Node, zero npm dependencies
│   └── crisp-sync.js                placeholder with design notes (future work)
├── docs/specs/                      design docs (this file)
├── .github/workflows/pages.yml     build + deploy to GitHub Pages on push to main
└── dist/                            generated site output — gitignored
```

## Categories and articles

Taken from the pre-existing `knowledge-base-category-taxonomy.md` (11 categories, ~3 subcategories each). Each **subcategory becomes one article** (~33 articles). Dense topics (e.g. Quote Statuses) are one article with `<h2>` sections rather than multiple articles.

Categories (order = display order):
1. `getting-started` — Getting Started
2. `inbox-and-conversations` — Inbox and Conversations
3. `quotes-and-offers` — Quotes and Offers
4. `guest-booking-actions` — Guest Booking Actions
5. `reservations` — Reservations
6. `escalations-and-human-intervention` — Escalations and Human Intervention
7. `channels-and-messaging` — Channels and Messaging
8. `hotel-setup` — Hotel Setup
9. `pms-and-integrations` — PMS and Integrations
10. `troubleshooting` — Troubleshooting
11. `account-and-team-management` — Account and Team Management

## Article format

Each article is a **plain HTML fragment**:

- First element is `<h1>` — the article title.
- Immediately after, one `<p>` that works standalone as the excerpt/summary.
- Body uses only: `h2`, `h3`, `p`, `ul`, `ol`, `li`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `strong`, `em`, `a`.
- No classes, ids, styles, scripts, or page chrome.

Rationale: pastes cleanly into Crisp (crawler and API both), trivially editable, renderable inside any shell.

Voice: written for **hotel staff** — task-oriented, plain language, no internal jargon (no pipeline phases, queue names, or entity names). Source material: `clock-be/docs/` architecture docs and project knowledge, translated to user-facing behavior.

## Site generation

`node scripts/build.js` reads `taxonomy.json` + `content/` and writes `dist/`:

- `index.html` — meta-refresh + link redirect to `en/`
- `en/index.html` — home page: category cards (name + description + article count)
- `en/<category>/index.html` — category page: article list (title + excerpt)
- `en/<category>/<article>.html` — article wrapped in shell: breadcrumb (Home › Category), shared minimal CSS, prev/next within category optional (omitted at v1 — YAGNI)

The shell is a template embedded in `build.js`. Styling is a single embedded stylesheet — clean, readable, Brixa-neutral. Build extracts `<h1>` for titles and first `<p>` for excerpts; it fails loudly if an article lacks an `<h1>`.

GitHub Action (`pages.yml`): on push to main → run build → upload artifact → deploy via `actions/deploy-pages`. Base path `/brixa-help/` handled with relative links only, so the site works at any origin.

## Publishing

- Public repo `brixa-ai/brixa-help` created via `gh`.
- GitHub Pages enabled with Actions source.
- Site URL: `https://brixa-ai.github.io/brixa-help/`.

## Crisp integration plan (future)

- Import v0: point Crisp's website importer at the Pages URL.
- Sync v1: `crisp-sync.js` uses Crisp Helpdesk REST API — resolve/create locale, upsert categories by slug, upsert articles by slug, publish. Idempotent; repo is authoritative; articles removed from repo are flagged (not auto-deleted) at first.

## Testing / verification

- Build script run locally; output inspected (index, one category page, one article page).
- Link check: every generated page's internal links resolve within `dist/`.
- HTML sanity: every article has exactly one `<h1>` and a leading `<p>` (enforced by build).

## Maintenance workflow

`AGENTS.md` instructs future sessions: when a feature changes user-visible behavior, find affected articles (grep by topic), update content, keep the one-`<h1>`-plus-excerpt contract, never add a second folder level, add new categories via `taxonomy.json`.
