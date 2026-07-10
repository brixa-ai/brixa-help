const fs = require('node:fs');
const path = require('node:path');

const CSS = `
:root{color-scheme:light dark}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#1a202c;background:#fff}
a{color:#0b62d6}
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
