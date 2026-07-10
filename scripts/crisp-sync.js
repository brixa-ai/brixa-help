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
