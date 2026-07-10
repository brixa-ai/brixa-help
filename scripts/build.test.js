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

function collectPages(dist) {
  const pages = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (p.endsWith('.html')) pages.push(p);
    }
  })(dist);
  return pages;
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
  assert.match(cat, /Brixa answers guests for you\./);
  const art = fs.readFileSync(path.join(dist, 'en', 'getting-started', 'what-brixa-does.html'), 'utf8');
  assert.match(art, /<h1>What Brixa Does<\/h1>/);
  assert.match(art, /<a href="\.\.\/index\.html">/);
});

test('build generates support page with ticket form and header links', () => {
  const root = makeFixture();
  build(root);
  const support = fs.readFileSync(path.join(root, 'dist', 'en', 'support.html'), 'utf8');
  assert.match(support, /<form id="ticket">/);
  assert.match(support, /mailto:support@brixa\.ai/);
  assert.match(support, /id="urgency"/);
  const home = fs.readFileSync(path.join(root, 'dist', 'en', 'index.html'), 'utf8');
  assert.match(home, /https:\/\/status\.brixa\.ai/);
  assert.match(home, /id="status-dot"/);
  assert.match(home, /href="support\.html"/);
});

test('build fails loudly on article without h1', () => {
  const root = makeFixture();
  fs.writeFileSync(path.join(root, 'content', 'en', 'getting-started', 'broken.html'), '<p>No title.</p>');
  assert.throws(() => build(root), /missing <h1>/);
});

test('all internal links in fixture dist resolve to files', () => {
  const root = makeFixture();
  build(root);
  for (const page of collectPages(path.join(root, 'dist'))) {
    const html = fs.readFileSync(page, 'utf8');
    for (const [, href] of html.matchAll(/href="([^"#]+)"/g)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(href)) continue; // skip external schemes (https:, mailto:, ...)
      const target = path.resolve(path.dirname(page), href);
      assert.ok(fs.existsSync(target), `${page} -> broken link ${href}`);
    }
  }
});

test('real repo content builds and all internal links resolve', () => {
  const repoRoot = path.join(__dirname, '..');
  if (!fs.existsSync(path.join(repoRoot, 'content', 'en'))) return; // no content yet
  const dist = build(repoRoot);
  for (const page of collectPages(dist)) {
    const html = fs.readFileSync(page, 'utf8');
    for (const [, href] of html.matchAll(/href="([^"#]+)"/g)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(href)) continue; // skip external schemes (https:, mailto:, ...)
      const target = path.resolve(path.dirname(page), href);
      assert.ok(fs.existsSync(target), `${page} -> broken link ${href}`);
    }
  }
});
