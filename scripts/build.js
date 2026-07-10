const fs = require('node:fs');
const path = require('node:path');

// Design tokens mirror brixa-site (Inter body, Fraunces display standing in for
// the licensed Recoleta, ink/cyan/green palette, green->blue brand gradient).
const CSS = `
:root{--ink:#0b0f12;--cyan:#40a4ff;--light-blue:#5bccff;--green:#44d600;--amber:#f5a623;--red:#e5484d;--line:#e4e7eb;--surface:#f2f4f6;--white:#fff;--muted:#5b6673;--body:#242b33;--grad:linear-gradient(135deg,#44d600,#5bccff);--sh-card:0 10px 26px rgba(11,15,18,.08);--sh-brand:0 12px 28px rgba(64,164,255,.26),0 4px 8px rgba(68,214,0,.16);--r-pill:999px;--r-lg:12px;--r-md:8px;--font-b:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;--font-d:"Fraunces",Georgia,serif;--ease:cubic-bezier(.2,.8,.2,1)}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;display:flex;flex-direction:column;font-family:var(--font-b);font-size:15px;line-height:1.6;color:var(--ink);background:var(--white)}
h1,h2,h3{font-family:var(--font-d);font-weight:500;letter-spacing:-.02em;line-height:1.15;color:var(--ink)}
a{color:var(--cyan)}
header{border-bottom:1px solid var(--line)}
.header-inner{max-width:960px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink);font-weight:700;font-size:18px}
.brand img{height:24px;display:block}
.brand span{font-size:13px;font-weight:500;color:var(--muted);border-left:1px solid var(--line);padding-left:10px;margin-left:2px;letter-spacing:.02em}
.header-nav{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.header-cta{display:inline-flex;align-items:center;gap:8px;border:1.5px solid var(--line);color:var(--ink);padding:8px 18px;border-radius:var(--r-pill);font-size:14px;font-weight:500;text-decoration:none;transition:border-color .2s}
.header-cta:hover{border-color:var(--cyan)}
.header-cta-primary{background:var(--grad);color:#fff;border:none;font-weight:600;box-shadow:var(--sh-brand)}
.header-cta-primary:hover{opacity:.92}
.dot{width:8px;height:8px;border-radius:50%;background:#c3cad2;display:inline-block}
.dot.up{background:var(--green)}
.dot.degraded{background:var(--amber)}
.dot.down{background:var(--red)}
main{flex:1;width:100%;max-width:960px;margin:0 auto;padding:40px 24px 72px}
nav.crumbs{font-size:13.5px;margin-bottom:28px;color:var(--muted)}
nav.crumbs a{color:var(--muted);text-decoration:none}
nav.crumbs a:hover{color:var(--cyan)}
.tag{display:inline-block;background:var(--grad);color:#fff;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:5px 14px;border-radius:var(--r-pill)}
.hero h1{font-size:44px;margin:16px 0 10px}
.hero p{color:var(--muted);font-size:16.5px;margin:0 0 40px;max-width:560px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;padding:0;list-style:none;margin:0}
.cards li{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:var(--r-lg);padding:22px 24px;background:var(--white);transition:transform .2s var(--ease),box-shadow .2s,border-color .2s}
.cards li:hover{transform:translateY(-3px);border-color:var(--light-blue);box-shadow:var(--sh-card)}
.cards a{font-weight:600;font-size:17px;color:var(--ink);text-decoration:none}
.cards a:hover{color:var(--cyan)}
.cards p{margin:8px 0 0;font-size:14px;color:var(--muted)}
.cards .count{align-self:flex-start;margin-top:16px;background:var(--surface);color:var(--muted);font-size:12.5px;font-weight:600;padding:3px 12px;border-radius:var(--r-pill)}
.cat-head h1{font-size:36px;margin:0 0 8px}
.cat-head p{color:var(--muted);font-size:16px;margin:0;max-width:620px}
ul.articles{list-style:none;padding:0;margin:28px 0 0}
ul.articles li{padding:18px 0;border-bottom:1px solid var(--line)}
ul.articles a{font-weight:600;font-size:17px;color:var(--ink);text-decoration:none}
ul.articles a:hover{color:var(--cyan)}
ul.articles p{margin:6px 0 0;font-size:14.5px;color:var(--muted)}
article{max-width:720px}
article h1{font-size:36px;margin:0 0 12px}
article h1+p{font-size:17px;color:var(--muted)}
article h2{font-size:24px;margin:38px 0 12px}
article h3{font-family:var(--font-b);font-weight:600;font-size:17px;margin:26px 0 8px}
article p,article li{font-size:15.5px;color:var(--body)}
article li{margin:4px 0}
article a{color:var(--cyan);text-decoration:underline;text-underline-offset:2px}
article strong{color:var(--ink)}
article table{border-collapse:collapse;width:100%;margin:18px 0;font-size:14.5px}
article th{background:var(--surface);font-weight:600}
article th,article td{border:1px solid var(--line);padding:10px 12px;text-align:left;vertical-align:top;color:var(--body)}
.support{max-width:640px}
.support h1{font-size:36px;margin:0 0 10px}
.support>p{color:var(--muted);font-size:16px;margin:0 0 32px}
.support label{display:block;font-weight:600;font-size:14px;margin:20px 0 6px}
.support label em{font-style:normal;font-weight:400;color:var(--muted)}
.support input,.support select,.support textarea{width:100%;font-family:var(--font-b);font-size:15px;color:var(--ink);background:var(--white);border:1.5px solid var(--line);border-radius:var(--r-md);padding:10px 12px;transition:border-color .2s}
.support input:focus,.support select:focus,.support textarea:focus{outline:none;border-color:var(--cyan)}
.support textarea{min-height:140px;resize:vertical}
.support button{display:inline-flex;align-items:center;gap:8px;background:var(--grad);color:#fff;padding:14px 30px;border-radius:var(--r-pill);font-family:var(--font-b);font-size:15px;font-weight:600;border:none;cursor:pointer;box-shadow:var(--sh-brand);margin-top:28px;transition:opacity .2s}
.support button:hover{opacity:.92}
.support .hint{font-size:13px;color:var(--muted);margin-top:12px}
footer{background:var(--ink);color:rgba(255,255,255,.72)}
.footer-inner{max-width:960px;margin:0 auto;padding:32px 24px;display:flex;align-items:center;gap:16px;font-size:13.5px}
footer img{height:28px;display:block}
@media(max-width:640px){.hero h1{font-size:34px}article h1,.cat-head h1,.support h1{font-size:29px}main{padding-top:28px}.brand span{display:none}}
`.trim();

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap" rel="stylesheet">`;

const STATUS_URL = 'https://raw.githubusercontent.com/brixa-ai/status/HEAD/history/summary.json';

// Colors the header status dot from Upptime's summary.json:
// any service down -> red, any degraded -> yellow, all up -> green, fetch error -> neutral gray.
const STATUS_SCRIPT = `<script>
(function(){var d=document.getElementById('status-dot');if(!d)return;
fetch('${STATUS_URL}').then(function(r){return r.json()}).then(function(s){
var st='up';for(var i=0;i<s.length;i++){if(s[i].status==='down'){st='down';break}if(s[i].status==='degraded'){st='degraded'}}
d.className='dot '+st}).catch(function(){})})();
</script>`;

const SUPPORT_SCRIPT = `<script>
document.getElementById('ticket').addEventListener('submit',function(e){
e.preventDefault();
var v=function(id){return document.getElementById(id).value.trim()};
var subject='[Support]['+v('urgency')+'] '+v('subject')+' \\u2014 '+v('hotel');
var body='Hotel: '+v('hotel')+'\\nName: '+v('name')+'\\nEmail: '+v('email')+'\\nTopic: '+v('topic')+'\\nUrgency: '+v('urgency')+'\\nReference: '+(v('reference')||'-')+'\\n\\nWhat happened:\\n'+v('description')+'\\n\\n\\u2014 Sent from the Brixa Help Center';
window.location.href='mailto:support@brixa.ai?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
});
</script>`;

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

function page({ title, homeHref, assetPrefix, hasAssets, crumbs, body, extraScript }) {
  const crumbHtml = crumbs.length
    ? `<nav class="crumbs">${crumbs.map(c => c.href ? `<a href="${c.href}">${esc(c.label)}</a>` : esc(c.label)).join(' › ')}</nav>`
    : '';
  const favicon = hasAssets ? `\n<link rel="icon" type="image/svg+xml" href="${assetPrefix}assets/brand/favicon.svg">` : '';
  const brandInner = hasAssets
    ? `<img src="${assetPrefix}assets/brand/brixa-wordmark.png" alt="Brixa"><span>Help Center</span>`
    : 'Brixa Help Center';
  const footerLogo = hasAssets ? `<img src="${assetPrefix}assets/brand/brixa-isologo-white.png" alt="Brixa">` : '';
  const supportHref = homeHref.replace('index.html', 'support.html');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>${favicon}
${FONTS}
<style>${CSS}</style>
</head>
<body>
<header><div class="header-inner"><a class="brand" href="${homeHref}">${brandInner}</a><nav class="header-nav"><a class="header-cta" href="https://status.brixa.ai"><span class="dot" id="status-dot"></span>View Status</a><a class="header-cta" href="${supportHref}">Contact Support</a><a class="header-cta header-cta-primary" href="https://app.brixa.ai">Open Brixa</a></nav></div></header>
<main>
${crumbHtml}
${body}
</main>
<footer><div class="footer-inner">${footerLogo}<p>Brixa — AI assistant for hotel guest communication.</p></div></footer>
${STATUS_SCRIPT}${extraScript || ''}
</body>
</html>
`;
}

function supportBody() {
  return `<div class="support">
<h1>Contact Support</h1>
<p>Tell us what's going on and we'll get back to you. Submitting this form opens a pre-filled email to support@brixa.ai in your email app — review it and hit send.</p>
<form id="ticket">
<label for="hotel">Hotel name</label>
<input id="hotel" type="text" required>
<label for="name">Your name</label>
<input id="name" type="text" required>
<label for="email">Work email</label>
<input id="email" type="email" required>
<label for="topic">Topic</label>
<select id="topic">
<option>Question about using Brixa</option>
<option>Problem or bug</option>
<option>Messaging or channels</option>
<option>Quotes and bookings</option>
<option>Reservations and PMS</option>
<option>Access and account</option>
<option>Other</option>
</select>
<label for="urgency">Urgency</label>
<select id="urgency">
<option>Low</option>
<option selected>Normal</option>
<option>High — a guest is waiting</option>
</select>
<label for="subject">Subject</label>
<input id="subject" type="text" required>
<label for="description">What happened?</label>
<textarea id="description" required placeholder="What you did, what you expected, and what you saw instead."></textarea>
<label for="reference">Conversation, quote, or guest reference <em>(optional)</em></label>
<input id="reference" type="text">
<button type="submit">Open email to support</button>
<p class="hint">Prefer to write it yourself? Email us directly at support@brixa.ai.</p>
</form>
</div>`;
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

  const assetsSrc = path.join(root, 'assets');
  const hasAssets = fs.existsSync(assetsSrc);
  if (hasAssets) fs.cpSync(assetsSrc, path.join(dist, 'assets'), { recursive: true });

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
      return `<li><a href="${c.slug}/index.html">${esc(c.name)}</a><p>${esc(c.description)}</p><span class="count">${count} article${count === 1 ? '' : 's'}</span></li>`;
    }).join('\n');
    fs.writeFileSync(path.join(localeDist, 'index.html'), page({
      title: 'Brixa Help Center', homeHref: 'index.html', assetPrefix: '../', hasAssets, crumbs: [],
      body: `<div class="hero"><span class="tag">Help Center</span>\n<h1>How can we help?</h1>\n<p>Guides and answers for hotel teams working with Brixa — conversations, quotes, reservations, and more.</p></div>\n<ul class="cards">\n${cards}\n</ul>`,
    }));

    fs.writeFileSync(path.join(localeDist, 'support.html'), page({
      title: 'Contact Support — Brixa Help Center', homeHref: 'index.html', assetPrefix: '../', hasAssets,
      crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Contact Support' }],
      body: supportBody(), extraScript: SUPPORT_SCRIPT,
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
          title: `${title} — Brixa Help Center`, homeHref: '../index.html', assetPrefix: '../../', hasAssets,
          crumbs: [{ label: 'Home', href: '../index.html' }, { label: cat.name, href: 'index.html' }],
          body: `<article>\n${html.trim()}\n</article>`,
        }));
      }
      fs.writeFileSync(path.join(catDist, 'index.html'), page({
        title: `${cat.name} — Brixa Help Center`, homeHref: '../index.html', assetPrefix: '../../', hasAssets,
        crumbs: [{ label: 'Home', href: '../index.html' }, { label: cat.name }],
        body: `<div class="cat-head"><h1>${esc(cat.name)}</h1>\n<p>${esc(cat.description)}</p></div>\n<ul class="articles">\n${items.join('\n')}\n</ul>`,
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
