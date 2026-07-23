# Brixa Assistant Help Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish task-oriented HelpDesk guidance for configuring and installing the Brixa Assistant website chat.

**Architecture:** Three HTML fragments live in the existing Channels and Messaging category. `taxonomy.json` adds them in the category navigation; the existing Node build validates the article contract and link integrity.

**Tech Stack:** Basic HTML article fragments, JSON taxonomy, Node 22 test/build scripts, GitHub Pages.

## Global Constraints

- Keep articles as HTML fragments with an `h1` followed immediately by a standalone excerpt paragraph.
- Use only tags permitted by `AGENTS.md`.
- Do not include real widget keys or reveal internal platform implementation.
- Preserve the pre-existing staged `CLAUDE.md` change; it is not part of this documentation release.

---

### Task 1: Add Brixa Assistant HelpDesk articles

**Files:**
- Create: `content/en/channels-and-messaging/website-concierge-overview.html`
- Create: `content/en/channels-and-messaging/configure-website-concierge.html`
- Create: `content/en/channels-and-messaging/install-website-concierge.html`
- Modify: `taxonomy.json`

- [ ] **Step 1: Add the three article fragments and register their slugs after `channel-basics` in the existing category.**

- [ ] **Step 2: Run the HelpDesk checks.**

Run: `npm test`

Expected: all Node test cases pass, including the real-content article and internal-link validation.

- [ ] **Step 3: Review the generated articles.**

Run: `npm run build`

Expected: the generated Channels and Messaging category links to all three articles.

- [ ] **Step 4: Commit only the HelpDesk release files.**

Run: `git add taxonomy.json content/en/channels-and-messaging/website-concierge-overview.html content/en/channels-and-messaging/configure-website-concierge.html content/en/channels-and-messaging/install-website-concierge.html docs/specs/2026-07-23-brixa-assistant-help-center-design.md docs/plans/2026-07-23-brixa-assistant-help-center.md && git commit -m "docs(kb): add Brixa Assistant website setup guides"`

Expected: a documentation-only commit; the staged `CLAUDE.md` remains untouched.

- [ ] **Step 5: Push `main` to trigger the HelpDesk deployment.**

Run: `git push origin main`

Expected: GitHub Pages workflow starts from the pushed commit.
