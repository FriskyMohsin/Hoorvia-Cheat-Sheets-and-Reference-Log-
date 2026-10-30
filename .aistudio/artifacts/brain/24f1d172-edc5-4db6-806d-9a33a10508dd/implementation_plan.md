# Hoorvia.net – Master Inventory Audit & Corrected Technical Implementation Plan

Comprehensive architectural blueprint to upgrade **[hoorvia.net](https://hoorvia.net)** into a high-authority digital reference library and printable cheat sheet platform. This plan incorporates static prerendering for search engine crawlers, unique on-page SEO metadata for all 1,027 sheets, authentic interactive HTML reference tables, transparent PDF queue states, and an exact reconciliation of the master inventory.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following mandatory corrections are integrated into the core architecture:
> - **Static Prerendering / SSR (Zero Client-Side Reliance for SEO)**: All 1,027 individual cheat sheets, 5 category hubs, and legal pages will be prerendered into complete, crawlable semantic HTML with full `<head>` tags, Open Graph cards, JSON-LD, breadcrumbs, and complete `<table>` bodies. This ensures 100% indexability on static GitHub Pages hosting and zero soft-404 / client-hydration lag for Googlebot.
> - **Authentic HTML Reference Tables**: Every single sheet features a domain-accurate, interactive HTML reference table (temperatures, ratios, formulas, shortcuts, conversions, or specifications). Zero placeholder or empty tables.
> - **Transparent PDF Queue Status (Sheets 041–1027)**: Sheets 041–1027 clearly indicate `PDF In Progress (Interactive Web Table Active · Printable Sheet in Queue)` with a "Print Web Table" and "Notify / Request PDF" affordance. No fake or broken download links. Sheets 001–040 preserve their direct PDF download paths.
> - **Strict Development Sandbox Isolation**: All code, prerendered pages, sitemaps, and assets remain within this development environment. Nothing is committed or pushed to production GitHub without explicit approval.

---

## 1. Master Inventory Reconciliation & Category Audit

A line-by-line reconciliation of the 1,027 cheat sheet catalog was performed against the master architecture document (`Hoorvia_1027_Cheat_Sheet_Architecture___Navigation_Plan_2c713903.pdf`):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MASTER CATALOG RECONCILIATION SUMMARY                           │
├──────────────────────┬────────────┬─────────────┬─────────────┬────────────────────────┤
│ Category Hub         │ Base IDs   │ New IDs     │ Total Pills │ Total Verified Sheets  │
├──────────────────────┼────────────┼─────────────┼─────────────┼────────────────────────┤
│ 1. Kitchen & Cooking │ #001–#100  │ #1001–#1060 │ 14 Pills    │ 160 Sheets             │
│ 2. Crafting & DIY    │ #201–#298  │ #1061–#1140 │ 14 Pills    │ 178 Sheets             │
│ 3. Tech & Software   │ #397–#676  │ #1141–#1210 │ 22 Pills    │ 350 Sheets             │
│ 4. Home & Health     │ #802–#901  │ #1211–#1285 │ 13 Pills    │ 175 Sheets             │
│ 5. Reference Charts  │ #902–#1000 │ #1286–#1350 │ 13 Pills    │ 164 Sheets             │
├──────────────────────┼────────────┼─────────────┼─────────────┼────────────────────────┤
│ TOTALS               │ 677 Base   │ 350 New     │ 76 (65 Core)│ 1,027 Total Unique     │
└──────────────────────┴────────────┴─────────────┴─────────────┴────────────────────────┘
```

### Critical Inventory Audit Findings:
1. **Zero-Cannibalization Exclusions**: Exactly 323 redundant "- Quick Reference" duplicate IDs from the legacy 1,000 concept list (#101–#200, #299–#396, #677–#801) were intentionally pruned in the master plan to prevent internal keyword cannibalization.
2. **Base vs. New Allocation**:
   - **Base Sheets**: 677 unique sheets (#001–#100, #201–#298, #397–#676, #802–#901, #902–#1000).
   - **New Unique Sheets**: 350 new high-demand sheets (#1001–#1350).
   - **Net Total**: Exactly **1,027 unique indexable cheat sheets**.
3. **Existing PDFs (001–040)**:
   - All belong to Hub 1 (Kitchen & Cooking): Air Fryer (#001–#010), Baking & Pastry (#011–#020), Meat Temps (#021–#030), and Rice/Grains (#031–#040). These have active PDF download paths and full preview metadata.

---

## 2. Technical Architecture: Static Prerendering & Build Pipeline

Because `hoorvia.net` is deployed via GitHub repository with static web hosting (GitHub Pages / CDN), search engine crawlers (Googlebot, Bingbot) must receive complete static HTML files rather than an empty client-side root container.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       STATIC PRERENDERING WORKFLOW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  1. Master Schema Engine (src/data/cheatsheets.ts)                          │
│     └── 1,027 Strongly Typed Records with real table rows & SEO tags       │
│                                                                             │
│  2. Build & Prerender Script (scripts/prerender.ts)                         │
│     ├── Generates /index.html (Homepage with full static markup)            │
│     ├── Generates /kitchen/index.html (Hub 1 + initial table snapshot)      │
│     ├── Generates /crafting/index.html (Hub 2 + initial table snapshot)     │
│     ├── Generates /tech/index.html (Hub 3 + initial table snapshot)         │
│     ├── Generates /home-health/index.html (Hub 4 + initial table snapshot)  │
│     ├── Generates /reference/index.html (Hub 5 + initial table snapshot)    │
│     ├── Generates 1,027 static sheet pages: /sheet/[slug]/index.html        │
│     ├── Generates /sitemap.xml (Validated 1,033 real URL entries)           │
│     └── Generates /robots.txt (Crawler rules + sitemap pointer)             │
│                                                                             │
│  3. Progressive Client Hydration (Vite + React 19)                          │
│     └── Provides instant live search, instant JS pill filtering, and copy   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Advanced On-Page SEO & Metadata Specification

Every individual page will have pre-baked HTML tags adhering to:

| Metadata Field | Specification & Format | Example (Sheet #001) |
| :--- | :--- | :--- |
| **SEO Title** | 50–60 chars, keyword-first, branded | `Air Fryer Cooking Times Chart & Temp Guide \| Hoorvia` |
| **Meta Description** | 140–160 chars, compelling with format & action | `Complete air fryer cooking times and temperature chart for meat, veggies, and frozen food. Interactive reference table and printable PDF.` |
| **Primary Keyword** | One high-intent primary search phrase | `air fryer cooking times chart` |
| **Secondary Keywords** | 3–8 supporting semantic search terms | `air fryer temp guide, air fryer times pdf, basket cooking temp` |
| **Canonical URL** | Explicit self-referencing canonical tag | `https://hoorvia.net/sheet/air-fryer-cooking-times/` |
| **Open Graph** | `og:title`, `og:description`, `og:image`, `og:url` | Full social card tags matching page content |
| **Image ALT Text** | Keyword-rich descriptive preview ALT | `Printable Air Fryer Cooking Times and Temperature Reference Chart` |
| **Schema.org** | JSON-LD `TechArticle` / `HowTo` / `WebApplication` | Pre-rendered structured data block in `<head>` |

---

## 4. UI/UX Design System (Digital Knowledge Library)

- **Canvas & Atmosphere**: Soft off-white canvas (`#F8FAFC`) with pure white card surfaces (`#FFFFFF`) and slate borders (`#E2E8F0`).
- **Brand Tokens**: Deep obsidian text (`#0B132B` / `#0F172A`), electric cyan (`#06B6D4`), and deep royal indigo (`#1E3A8A`).
- **Zero-Pill Metadata**: Metadata rendered with natural typographic separators (`·` or `/`). Subcategory toggles styled as clean segmented controls with active state indicator.
- **Top Bar Contract**: Sticky single-row layout with Brand Wordmark, 5 Hub Links (`Kitchen`, `Crafting`, `Tech`, `Home & Health`, `Reference`), and Quick Search trigger.
- **Internal Linking Silo**: Every sheet template contains *"Related Printable Cheat Sheets in This Category"* linking to exactly 6 sibling sheets from the same subcategory pill + 1 link back to the parent Category Hub.

---

## 5. Development Phases

- **Phase 1: Master Dataset & SEO Database Compilation**
  - Implement `src/data/cheatsheets.ts` containing the reconciled 1,027 entries with authentic table rows, formulas, and verified SEO metadata.
  - Compile `seo-database.json` for validation and auditing.
- **Phase 2: Modern Responsive Layout & Navigation**
  - Build `Header`, `Footer`, `SearchModal`, and design system tokens.
- **Phase 3: Category Hubs & JS Subcategory Filtering**
  - Implement `/kitchen/`, `/crafting/`, `/tech/`, `/home-health/`, and `/reference/` with live search and zero-reload subcategory pills.
- **Phase 4: Individual Cheat Sheet Templates**
  - Implement interactive HTML data tables, copy/print actions, breadcrumbs, and sibling linking silos.
- **Phase 5: Static Prerendering & Sitemap Generation**
  - Configure the static prerendering script to produce fully crawlable HTML for all hubs and 1,027 sheets.
  - Generate and validate `sitemap.xml` and `robots.txt`.
- **Phase 6: Quality Assurance & Audit Report**
  - Execute automated link checking, verify 100% metadata presence, compile with `compile_applet`, and deliver the final report.
