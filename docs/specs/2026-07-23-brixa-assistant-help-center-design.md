# Brixa Assistant Help Center Design

## Goal

Give hotel teams clear, safe instructions for making the Brixa Assistant available on their own website.

## Information architecture

Add three English articles to the existing `channels-and-messaging` category, immediately after the channel overview:

1. **Website Concierge Overview** — explains when to use the website chat and what staff need before starting.
2. **Configure the Website Concierge** — covers activation, permitted website origins, appearance, and the welcome screen.
3. **Install the Website Concierge on Your Website** — gives the production embed snippet, placement guidance, a safe test checklist, and recovery guidance for a regenerated key.

Using the existing channel category keeps every guest-contact option in one predictable place and avoids a new top-level category for a three-article feature.

## Content rules

Articles address hotel staff, use the visible Brixa Concierge labels, and explain tasks rather than implementation details. They do not include real widget keys or hotel-specific URLs. The installation article uses a placeholder widget key and directs readers to copy the current snippet from Brixa.

## Validation and release

The taxonomy registers all three article slugs in the intended order. `npm test` validates article structure and generated internal links. The documentation-only commit is pushed directly to `main`, which triggers the existing GitHub Pages deployment workflow.
