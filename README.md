# brixa-help

**Source of truth for the Brixa knowledge base** — the help center for hotel staff using Brixa.

This repo serves three consumers:

1. **GitHub Pages** — the browsable help center at https://brixa-ai.github.io/brixa-help/
2. **Crisp one-click import** — Crisp's "import your knowledge base" crawler pointed at the Pages URL
3. **Crisp API sync** (future) — `scripts/crisp-sync.js` will upsert categories/articles into Crisp via its Helpdesk REST API

## Structure

```
brixa-help/
├── taxonomy.json                    categories: slug, name, description, order, articleOrder
├── content/
│   └── en/                          one folder per locale (en only today; it/, es/ later)
│       └── <category-slug>/         one folder per category — exactly ONE level deep
│           └── <article-slug>.html  one file per article, plain basic HTML
├── scripts/
│   ├── build.js                     static site generator (Node, zero dependencies)
│   └── crisp-sync.js                Crisp API sync (placeholder — not implemented yet)
├── docs/                            design specs and plans
├── .github/workflows/pages.yml     builds + deploys to GitHub Pages on push to main
└── dist/                            generated site (gitignored)
```

## Article format contract

Every article file must follow this contract (the build enforces the first two rules):

- The first element is `<h1>` — the article title.
- Immediately after comes one `<p>` that reads standalone as the article's excerpt/summary.
- Allowed tags only: `h1 h2 h3 p ul ol li table thead tbody tr th td strong em a`.
- No attributes except `href` on `<a>`. No classes, ids, styles, scripts, or page chrome (`<html>`, `<head>`, `<body>` are forbidden — articles are fragments).
- Written for **hotel staff**: task-oriented, plain language, no internal jargon. Describe what users see, not how it's implemented.

## Editing

- **Edit an article:** change the HTML file, push to main. The site redeploys automatically.
- **Add an article:** create `content/en/<category-slug>/<new-slug>.html` following the contract, add the slug to that category's `articleOrder` in `taxonomy.json`, push.
- **Add a category:** add an entry to `taxonomy.json` (slug, name, description, order, articleOrder) and create `content/en/<slug>/` with at least one article.
- **Never** create folders deeper than `content/<locale>/<category>/`.

## Local preview

```bash
npm test        # build contract + link checks
npm run build   # generates dist/
open dist/index.html
```

No dependencies to install — the build uses Node built-ins only (Node ≥ 20).

## Localization

`content/` is keyed by locale. English (`en`) is the only locale today. To add Italian: create `content/it/` mirroring the same category folders and article slugs, and add `"it"` to `locales` in `taxonomy.json`. URLs never change for existing locales.

## Crisp

- **Now:** use Crisp's website importer against the Pages URL — the site's clean semantic HTML and predictable URLs (`/en/<category>/<article>.html`) are shaped for it.
- **Later:** `scripts/crisp-sync.js` will make this repo authoritative over the Crisp helpdesk via API (see the file's header comment for the planned design).

## Design docs

- Spec: [docs/specs/2026-07-10-brixa-help-design.md](docs/specs/2026-07-10-brixa-help-design.md)
- Implementation plan: [docs/plans/2026-07-10-brixa-help.md](docs/plans/2026-07-10-brixa-help.md)
