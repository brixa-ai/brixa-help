# Instructions for AI agents working in brixa-help

This repository is the **source of truth for the Brixa knowledge base** (help center for hotel staff). It is an independent git repository — never commit its contents to the Brixa root repo or any service repo.

## When a Brixa feature ships or changes

Whenever a feature changes **user-visible behavior** in Brixa, this knowledge base must be reviewed and updated in the same breath:

1. Identify affected topics: `grep -ril "<topic keyword>" content/en/`
2. Update the affected articles (or add a new article) to match the new behavior.
3. Run `npm test` — the build enforces the article contract and link integrity.
4. Commit with `docs(kb): <what changed>`. Pushing to main redeploys the site.

## Article format contract (enforced)

- First element is `<h1>` (the title), immediately followed by one `<p>` that works standalone as the excerpt.
- Allowed tags only: `h1 h2 h3 p ul ol li table thead tbody tr th td strong em a`. No attributes except `href` on `<a>`. No page chrome — articles are HTML fragments.
- One article = one file at `content/<locale>/<category-slug>/<article-slug>.html`. **Never** create a deeper folder level.
- New categories are added in `taxonomy.json` (slug, name, description, order, articleOrder) plus a matching content folder.
- New articles must be added to their category's `articleOrder` in `taxonomy.json`.

## Voice rules

- Audience is **hotel staff**, not developers. Task-oriented, plain language.
- NEVER use internal jargon: no pipeline phases, queue names, entity/class names ("Phase 2.2", "BullMQ", "ThreadTurn", "HITL", etc.). Describe what the user sees and does.
- The quote status is called **"Options Presented"** — never "DiscussingOptions".
- PMS wording is generic ("your PMS", "connected PMS"); name specific PMS vendors only as examples.
- If unsure of an exact UI label, describe the function instead of inventing a label.

## Localization

English only today (`content/en/`). Other locales mirror the same category folders and article slugs under `content/<locale>/`. Add new locales to `locales` in `taxonomy.json`.

## Verification

`npm test` must pass before any commit. It runs the generator against a fixture and validates the h1/excerpt contract and that all internal links in the generated site resolve.
