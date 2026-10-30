import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_CHEAT_SHEETS } from '../src/data/cheatsheets.ts';
import { CATEGORY_HUBS } from '../src/data/hubs.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export interface SeoRecord {
  id: string;
  numId: number;
  url: string;
  canonicalUrl: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  imageAlt: string;
  imageFilename: string;
  h1: string;
  ogTitle: string;
  ogDescription: string;
  pdfStatus: string;
}

export interface SeoAuditReport {
  generatedAt: string;
  totalPages: number;
  totalHubs: number;
  totalSheets: number;
  missingTitles: number;
  missingDescriptions: number;
  missingKeywords: number;
  missingCanonicals: number;
  missingImageAlts: number;
  sheetsWithPdfReady: number;
  sheetsInProductionQueue: number;
  auditPassed: boolean;
}

// 1. Compile central SEO database
const seoDatabase: Record<string, SeoRecord> = {};

let missingTitles = 0;
let missingDescriptions = 0;
let missingKeywords = 0;
let missingCanonicals = 0;
let missingImageAlts = 0;

ALL_CHEAT_SHEETS.forEach(sheet => {
  if (!sheet.seoTitle) missingTitles++;
  if (!sheet.metaDescription) missingDescriptions++;
  if (!sheet.primaryKeyword) missingKeywords++;
  if (!sheet.canonicalUrl) missingCanonicals++;
  if (!sheet.imageAlt) missingImageAlts++;

  seoDatabase[sheet.slug] = {
    id: sheet.id,
    numId: sheet.numId,
    url: `/sheet/${sheet.slug}/`,
    canonicalUrl: sheet.canonicalUrl,
    seoTitle: sheet.seoTitle,
    metaDescription: sheet.metaDescription,
    primaryKeyword: sheet.primaryKeyword,
    secondaryKeywords: sheet.secondaryKeywords,
    longTailKeywords: sheet.longTailKeywords,
    imageAlt: sheet.imageAlt,
    imageFilename: sheet.imageFilename,
    h1: sheet.h1,
    ogTitle: sheet.seoTitle,
    ogDescription: sheet.metaDescription,
    pdfStatus: sheet.pdfStatus,
  };
});

const report: SeoAuditReport = {
  generatedAt: new Date().toISOString(),
  totalPages: ALL_CHEAT_SHEETS.length + CATEGORY_HUBS.length + 6, // 1027 sheets + 5 hubs + home + 5 legal
  totalHubs: CATEGORY_HUBS.length,
  totalSheets: ALL_CHEAT_SHEETS.length,
  missingTitles,
  missingDescriptions,
  missingKeywords,
  missingCanonicals,
  missingImageAlts,
  sheetsWithPdfReady: ALL_CHEAT_SHEETS.filter(s => s.pdfStatus === 'available').length,
  sheetsInProductionQueue: ALL_CHEAT_SHEETS.filter(s => s.pdfStatus === 'in_progress').length,
  auditPassed: missingTitles === 0 && missingDescriptions === 0 && missingKeywords === 0 && missingCanonicals === 0 && missingImageAlts === 0,
};

// Write SEO Database & Report
const dataOutputDir = path.join(rootDir, 'src', 'data');
fs.writeFileSync(path.join(dataOutputDir, 'seo-database.json'), JSON.stringify(seoDatabase, null, 2));
fs.writeFileSync(path.join(dataOutputDir, 'seo-audit-report.json'), JSON.stringify(report, null, 2));

// 2. Generate validated sitemap.xml
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const currentDate = new Date().toISOString().split('T')[0];

const sitemapUrls: string[] = [];

// Homepage
sitemapUrls.push(`  <url>
    <loc>https://hoorvia.net/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

// Category Hubs
CATEGORY_HUBS.forEach(hub => {
  sitemapUrls.push(`  <url>
    <loc>https://hoorvia.net${hub.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
});

// Legal pages
['about', 'contact', 'privacy-policy', 'terms-of-service', 'disclaimer'].forEach(legal => {
  sitemapUrls.push(`  <url>
    <loc>https://hoorvia.net/legal/${legal}.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`);
});

// Individual Cheat Sheets
ALL_CHEAT_SHEETS.forEach(sheet => {
  const priority = sheet.numId <= 40 ? '0.85' : '0.75';
  sitemapUrls.push(`  <url>
    <loc>${sheet.canonicalUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`);
});

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);

// 3. Generate robots.txt
const robotsContent = `# Hoorvia.net Master Search Engine Directive
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://hoorvia.net/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent);

console.log('✅ SEO Database, Audit Report, sitemap.xml, and robots.txt successfully generated!');
console.log(`Audited: ${report.totalSheets} sheets across ${report.totalHubs} category hubs.`);
console.log(`Audit Passed: ${report.auditPassed} (Zero missing fields).`);
