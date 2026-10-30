import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_CHEAT_SHEETS } from '../src/data/cheatsheets.ts';
import { CATEGORY_HUBS } from '../src/data/hubs.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

function renderBaseHtml(title: string, description: string, canonicalUrl: string, contentHtml: string, jsonLd: object): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:site_name" content="Hoorvia" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=JetBrains+Mono:wght@400..600&family=Outfit:wght@400..800&family=Plus+Jakarta+Sans:wght@400..800&display=swap" rel="stylesheet">
    <script type="application/ld+json">
    ${JSON.stringify(jsonLd, null, 2)}
    </script>
    <link rel="stylesheet" href="/src/index.css">
  </head>
  <body class="bg-[#f8fafc] text-[#0f172a] antialiased">
    <div id="root">
      ${contentHtml}
    </div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 1. Prerender 5 Category Hub pages
CATEGORY_HUBS.forEach(hub => {
  const hubDir = path.join(publicDir, hub.slug);
  if (!fs.existsSync(hubDir)) fs.mkdirSync(hubDir, { recursive: true });

  const hubSheets = ALL_CHEAT_SHEETS.filter(s => s.hubId === hub.id);

  const contentHtml = `
    <header class="bg-white border-b border-slate-200 py-4 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" class="text-xl font-bold font-display text-slate-900">HOORVIA<span class="text-cyan-500">.</span></a>
        <nav class="flex gap-4 text-xs font-semibold text-slate-600">
          <a href="/kitchen/index.html">Kitchen</a>
          <a href="/crafting/index.html">Crafting</a>
          <a href="/tech/index.html">Tech</a>
          <a href="/home-health/index.html">Home & Health</a>
          <a href="/reference/index.html">Reference</a>
        </nav>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div class="bg-white p-8 rounded-2xl border border-slate-200">
        <div class="text-xs font-mono font-bold text-slate-500 uppercase">${hub.sheetCount} Total Cheat Sheets</div>
        <h1 class="text-4xl font-extrabold text-slate-950 font-display mt-2">${escapeHtml(hub.title)}</h1>
        <p class="text-slate-600 mt-2 max-w-2xl">${escapeHtml(hub.description)}</p>
      </div>
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${hubSheets.slice(0, 18).map(s => `
          <article class="bg-white p-5 rounded-xl border border-slate-200">
            <span class="font-mono text-xs font-bold text-slate-500">${escapeHtml(s.id)}</span>
            <h2 class="text-base font-bold text-slate-900 mt-1"><a href="/sheet/${s.slug}/" class="hover:text-cyan-700">${escapeHtml(s.title)}</a></h2>
            <p class="text-xs text-slate-500 mt-1">${escapeHtml(s.shortIntro)}</p>
            <div class="mt-3 text-xs font-semibold text-cyan-700"><a href="/sheet/${s.slug}/">View Complete Reference Table &rarr;</a></div>
          </article>
        `).join('')}
      </section>
    </main>
  `;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": hub.title,
    "description": hub.description,
    "url": `https://hoorvia.net${hub.path}`
  };

  const html = renderBaseHtml(
    `${hub.name} Reference Hub (${hub.sheetCount} Sheets) | Hoorvia`,
    hub.description,
    `https://hoorvia.net${hub.path}`,
    contentHtml,
    jsonLd
  );

  fs.writeFileSync(path.join(hubDir, 'index.html'), html);
});

// 2. Prerender Sheet Pages (Core & Sampling)
let sheetPagesGenerated = 0;
ALL_CHEAT_SHEETS.forEach(sheet => {
  const sheetDir = path.join(publicDir, 'sheet', sheet.slug);
  if (!fs.existsSync(sheetDir)) fs.mkdirSync(sheetDir, { recursive: true });

  const parentHub = CATEGORY_HUBS.find(h => h.id === sheet.hubId) || CATEGORY_HUBS[0];

  const tableHtml = `
    <table class="w-full text-left border-collapse text-sm">
      <thead>
        <tr class="bg-slate-900 text-white font-semibold">
          ${sheet.tableData.columns.map(c => `<th class="p-3 border-b border-slate-800">${escapeHtml(c)}</th>`).join('')}
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        ${sheet.tableData.rows.map(r => `
          <tr class="hover:bg-slate-50">
            ${r.map(cell => `<td class="p-3 text-slate-700 font-mono">${escapeHtml(String(cell))}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  const contentHtml = `
    <header class="bg-white border-b border-slate-200 py-4 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" class="text-xl font-bold font-display text-slate-900">HOORVIA<span class="text-cyan-500">.</span></a>
        <nav class="flex gap-4 text-xs font-semibold text-slate-600">
          <a href="/kitchen/index.html">Kitchen</a>
          <a href="/crafting/index.html">Crafting</a>
          <a href="/tech/index.html">Tech</a>
          <a href="/home-health/index.html">Home & Health</a>
          <a href="/reference/index.html">Reference</a>
        </nav>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <nav class="text-xs text-slate-500 flex gap-2">
        <a href="/">Home</a> &gt; <a href="${parentHub.path}">${escapeHtml(parentHub.name)}</a> &gt; <span>${escapeHtml(sheet.subCategory)}</span> &gt; <span class="font-bold text-slate-900">${escapeHtml(sheet.id)}</span>
      </nav>
      <article class="bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
        <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">${escapeHtml(sheet.id)} · ${escapeHtml(sheet.subCategory)}</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display">${escapeHtml(sheet.h1)}</h1>
        <p class="text-slate-600 max-w-3xl">${escapeHtml(sheet.shortIntro)}</p>
        <div class="pt-4 border-t border-slate-100 flex items-center gap-3">
          ${sheet.pdfStatus === 'available'
            ? `<a href="${sheet.pdfDownloadUrl}" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold" download>Download Printable PDF</a>`
            : `<span class="px-4 py-2 bg-sky-50 text-sky-800 border border-sky-200 rounded-lg text-xs font-semibold">PDF In Production Queue (Interactive Web Table Active)</span>`
          }
        </div>
      </article>
      <section class="bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
        <h2 class="text-xl font-bold text-slate-950 font-display">Interactive Reference Table</h2>
        <div class="overflow-x-auto rounded-xl border border-slate-200">
          ${tableHtml}
        </div>
        ${sheet.tableData.notes ? `<p class="text-xs text-slate-500 mt-2"><strong>Note:</strong> ${escapeHtml(sheet.tableData.notes)}</p>` : ''}
      </section>
    </main>
  `;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": sheet.h1,
    "description": sheet.metaDescription,
    "url": sheet.canonicalUrl,
    "inLanguage": "en-US",
    "mainEntityOfPage": sheet.canonicalUrl
  };

  const html = renderBaseHtml(sheet.seoTitle, sheet.metaDescription, sheet.canonicalUrl, contentHtml, jsonLd);
  fs.writeFileSync(path.join(sheetDir, 'index.html'), html);
  sheetPagesGenerated++;
});

// 3. Prerender Legal Pages
const legalPages = [
  { slug: 'about', title: 'About Hoorvia.net – 1,027 Cheat Sheet Digital Library', desc: 'About Hoorvia.net, our zero-duplicate SEO architecture and digital reference collection.' },
  { slug: 'contact', title: 'Contact Hoorvia.net Editorial Team', desc: 'Get in touch with the Hoorvia editorial and research team for suggestions, additions, or corrections.' },
  { slug: 'privacy-policy', title: 'Privacy Policy | Hoorvia.net', desc: 'Privacy policy and user data protections for Hoorvia.net.' },
  { slug: 'terms-of-service', title: 'Terms of Service | Hoorvia.net', desc: 'Terms of use and permitted educational printing guidelines for Hoorvia.net.' },
  { slug: 'disclaimer', title: 'Disclaimer & Educational Notice | Hoorvia.net', desc: 'Disclaimer on measurements, conversions, and safety specifications on Hoorvia.net.' },
];

const legalDir = path.join(publicDir, 'legal');
if (!fs.existsSync(legalDir)) fs.mkdirSync(legalDir, { recursive: true });

legalPages.forEach(p => {
  const contentHtml = `
    <header class="bg-white border-b border-slate-200 py-4 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" class="text-xl font-bold font-display text-slate-900">HOORVIA<span class="text-cyan-500">.</span></a>
        <nav class="flex gap-4 text-xs font-semibold text-slate-600">
          <a href="/kitchen/index.html">Kitchen</a>
          <a href="/crafting/index.html">Crafting</a>
          <a href="/tech/index.html">Tech</a>
          <a href="/home-health/index.html">Home & Health</a>
          <a href="/reference/index.html">Reference</a>
        </nav>
      </div>
    </header>
    <main class="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <h1 class="text-3xl font-extrabold text-slate-950 font-display">${escapeHtml(p.title)}</h1>
      <div class="bg-white p-8 rounded-2xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
        <p>${escapeHtml(p.desc)}</p>
      </div>
    </main>
  `;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": p.title,
    "description": p.desc,
    "url": `https://hoorvia.net/legal/${p.slug}.html`
  };

  const html = renderBaseHtml(p.title, p.desc, `https://hoorvia.net/legal/${p.slug}.html`, contentHtml, jsonLd);
  fs.writeFileSync(path.join(legalDir, `${p.slug}.html`), html);
});

console.log(`✅ Static Prerendering Complete!`);
console.log(`- 5 Category Hub pages generated in /public/<hub>/index.html`);
console.log(`- ${sheetPagesGenerated} Individual Cheat Sheet pages generated in /public/sheet/<slug>/index.html`);
console.log(`- 5 Legal pages generated in /public/legal/<page>.html`);
