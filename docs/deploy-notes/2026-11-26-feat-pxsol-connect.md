# Deploy note: Connect Pxsol article

- **Change:** new article `content/en/pms-and-integrations/connect-pxsol.html`, registered in `taxonomy.json` (`pms-and-integrations`, after `connect-cloudbeds`); `pms-connection-setup.html` now links to it.
- **When:** publish at production ship of the Pxsol connect form (clock-fe, clock-be, brixa-pms). Do not merge to main before then; pushing to main redeploys the site. The connect form links to this article.
- **Open:** where the Pxsol ID is shown inside Pxsol is described generically ("property's settings", or ask Pxsol support); finalise once Pxsol confirms the exact location.
- **Verified:** `npm test`.
