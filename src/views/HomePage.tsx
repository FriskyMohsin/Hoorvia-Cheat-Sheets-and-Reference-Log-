import React, { useState } from 'react';
import { Search, BookOpen, Utensils, Scissors, Code2, HeartHandshake, Compass, ArrowRight, ShieldCheck, Zap, Download, Layers, CheckCircle2, Clock } from 'lucide-react';
import { CATEGORY_HUBS } from '../data/hubs.ts';
import { getPopularSheets, getRecentSheets } from '../data/cheatsheets.ts';
import { CheatSheetCard } from '../components/CheatSheetCard.tsx';
import { HubId } from '../types/cheatsheet.ts';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const popularSheets = getPopularSheets(8);
  const recentSheets = getRecentSheets(6);

  const getHubIcon = (id: HubId) => {
    switch (id) {
      case 'kitchen': return <Utensils className="w-5 h-5 text-orange-600" />;
      case 'crafting': return <Scissors className="w-5 h-5 text-emerald-600" />;
      case 'tech': return <Code2 className="w-5 h-5 text-sky-600" />;
      case 'home-health': return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'reference': return <Compass className="w-5 h-5 text-purple-600" />;
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-slate-200/80 bg-gradient-to-b from-slate-100/70 via-slate-50/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top trust pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>1,027 Verified Printable Cheat Sheets</span>
              <span className="text-slate-400">·</span>
              <span className="text-cyan-300">Zero-Duplicate Architecture</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 font-display tracking-tight leading-[1.15]">
              Instant reference clarity for cooks, makers, and coders.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-body max-w-2xl mx-auto">
              Hoorvia is a free digital reference library hosting 1,027 structured cheat sheets across cooking, crafting, programming, home maintenance, and conversion charts.
            </p>

            {/* Main Interactive Search Box */}
            <div className="pt-2 max-w-2xl mx-auto">
              <div 
                onClick={onOpenSearch}
                className="group flex items-center justify-between p-2 sm:p-2.5 bg-white rounded-2xl border-2 border-slate-200/90 hover:border-slate-400 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 pl-3 text-slate-400 flex-1 min-w-0">
                  <Search className="w-5 h-5 text-slate-500 group-hover:text-cyan-600 transition-colors shrink-0" />
                  <span className="text-sm sm:text-base text-slate-500 truncate">
                    Search 1,027 cheat sheets (e.g. Air Fryer, Excel, USDA Temps)...
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
                    ⌘K
                  </kbd>
                  <button className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-900 group-hover:bg-cyan-700 rounded-xl transition-colors">
                    Find Sheet
                  </button>
                </div>
              </div>

              {/* Quick Jump Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Trending:</span>
                {[
                  { name: 'Air Fryer Times', slug: 'air-fryer-cooking-times' },
                  { name: 'Baking Substitutions', slug: 'baking-substitutions-guide' },
                  { name: 'Meat Temps', slug: 'usda-meat-internal-temperatures' },
                  { name: 'Excel Formulas', slug: 'excel-formulas-shortcuts-cheat-sheet' },
                  { name: 'Metric Conversions', slug: 'metric-to-imperial-conversion-table' },
                ].map(item => (
                  <button
                    key={item.slug}
                    onClick={() => onNavigate('sheet', item.slug)}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-300 hover:text-slate-900 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 2. FIVE CATEGORY HUBS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-cyan-600 uppercase tracking-wider font-display mb-1">
              Structured Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 font-display">
              Explore the 5 Category Hubs
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Organized into 5 high-authority hubs with 65 interactive JavaScript subcategory filter modules for zero thin URLs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_HUBS.map((hub) => (
            <div
              key={hub.id}
              onClick={() => onNavigate('hub', hub.id)}
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getHubIcon(hub.id)}
                  </div>
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800">
                    {hub.sheetCount} Sheets
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-950 group-hover:text-cyan-700 transition-colors font-display">
                  {hub.name}
                </h3>

                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {hub.description}
                </p>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>{hub.subCategoryCount} Interactive Subcategories</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 group-hover:text-cyan-700 transition-colors">
                  Open Hub Directory
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}

          {/* 6th Card: Master Inventory & SEO Audit */}
          <div
            onClick={() => onNavigate('audit')}
            className="group bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Audit Verified
                </span>
              </div>

              <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                Master 1,027 Database & SEO Audit
              </h3>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Inspect our central database registry, XML sitemap, canonical mappings, and zero-cannibalization verification report.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300">
                View Central SEO Report
              </span>
              <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>
      </section>


      {/* 3. POPULAR CHEAT SHEETS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-cyan-600 uppercase tracking-wider font-display mb-1">
              Top Rated Resources
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 font-display">
              Popular Printable Cheat Sheets
            </h2>
          </div>
          <button
            onClick={onOpenSearch}
            className="text-xs font-semibold text-slate-700 hover:text-cyan-700 flex items-center gap-1.5"
          >
            <span>View All 1,027 Sheets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularSheets.map(sheet => (
            <CheatSheetCard
              key={sheet.slug}
              sheet={sheet}
              onSelect={slug => onNavigate('sheet', slug)}
            />
          ))}
        </div>
      </section>


      {/* 4. RECENT ADDITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-bold text-cyan-600 uppercase tracking-wider font-display mb-1">
              Latest Additions
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 font-display">
              Recently Cataloged Cheat Sheets
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentSheets.map(sheet => (
            <CheatSheetCard
              key={sheet.slug}
              sheet={sheet}
              onSelect={slug => onNavigate('sheet', slug)}
            />
          ))}
        </div>
      </section>


      {/* 5. WHY HOORVIA / AD SENSE POLICY TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-display">
              High-Precision Knowledge Standards
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display leading-tight">
              Why professional creators and cooks rely on Hoorvia.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-body">
              Unlike cluttered blog posts filled with personal stories and aggressive advertising, 
              Hoorvia provides instant, clean tabular reference data and print-ready sheets within 3 clicks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="space-y-2 border-l border-cyan-500/40 pl-4">
                <div className="text-xl font-bold text-cyan-400 font-display">100% Free</div>
                <p className="text-xs text-slate-400">All HTML tables and printable sheets are publicly accessible without paywalls.</p>
              </div>
              <div className="space-y-2 border-l border-cyan-500/40 pl-4">
                <div className="text-xl font-bold text-cyan-400 font-display">Zero Duplicates</div>
                <p className="text-xs text-slate-400">Every single URL targets a distinct primary search intent with zero cannibalization.</p>
              </div>
              <div className="space-y-2 border-l border-cyan-500/40 pl-4">
                <div className="text-xl font-bold text-cyan-400 font-display">Print-Optimized</div>
                <p className="text-xs text-slate-400">Clean CSS media print styles allow direct browser printing without headers or clutter.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 6. NEWSLETTER & NEW SHEET ALERTS */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-950 font-display">
          Stay Updated on New Cheat Sheets
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          We publish new verified cheat sheets in 20-sheet cluster batches. Receive notifications when new modules in your favorite categories go live.
        </p>

        {newsletterSubscribed ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you for subscribing! You will receive batch rollout updates.</span>
          </div>
        ) : (
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </section>

    </div>
  );
};
