import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Layers, FileDown, ArrowUpDown, Filter, CheckCircle2, Clock } from 'lucide-react';
import { CategoryHub, HubId } from '../types/cheatsheet.ts';
import { SUBCATEGORIES } from '../data/hubs.ts';
import { ALL_CHEAT_SHEETS } from '../data/cheatsheets.ts';
import { SubcategoryFilterPills } from '../components/SubcategoryFilterPills.tsx';
import { CheatSheetCard } from '../components/CheatSheetCard.tsx';

interface CategoryHubPageProps {
  hub: CategoryHub;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const CategoryHubPage: React.FC<CategoryHubPageProps> = ({ hub, onNavigate, onOpenSearch }) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'title' | 'popular'>('id');

  // Filter subcategories for this hub
  const subcategories = useMemo(() => {
    return SUBCATEGORIES.filter(sub => sub.hubId === hub.id);
  }, [hub.id]);

  // Sheets belonging to this hub
  const hubSheets = useMemo(() => {
    return ALL_CHEAT_SHEETS.filter(sheet => sheet.hubId === hub.id);
  }, [hub.id]);

  // Filtered & sorted sheets
  const displayedSheets = useMemo(() => {
    let result = hubSheets;

    // Filter by subcategory
    if (activeSubcategory !== 'all') {
      result = result.filter(sheet => sheet.subCategory === activeSubcategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(sheet =>
        sheet.title.toLowerCase().includes(q) ||
        sheet.id.toLowerCase().includes(q) ||
        sheet.primaryKeyword.toLowerCase().includes(q) ||
        sheet.subCategory.toLowerCase().includes(q)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'popular') return (a.popularRank || 999) - (b.popularRank || 999);
      return a.numId - b.numId;
    });

    return result;
  }, [hubSheets, activeSubcategory, searchQuery, sortBy]);

  const availableCount = useMemo(() => {
    return hubSheets.filter(s => s.pdfStatus === 'available').length;
  }, [hubSheets]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* 1. BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-slate-900 transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">{hub.name}</span>
      </nav>

      {/* 2. CATEGORY INTRODUCTION HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
              {hub.sheetCount} Total Sheets
            </span>
            <span>·</span>
            <span className="text-slate-600 font-medium">{hub.audience}</span>
            <span>·</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200/60">
              {availableCount} Downloadable PDFs Available
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-display tracking-tight">
            {hub.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-body">
            {hub.description}
          </p>
        </div>
      </div>

      {/* 3. SUBCATEGORY FILTER PILLS (ZERO-RELOAD JS FILTERING) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <SubcategoryFilterPills
          subcategories={subcategories}
          activeSubcategory={activeSubcategory}
          onSelectSubcategory={setActiveSubcategory}
          totalSheetsCount={hubSheets.length}
        />
      </div>

      {/* 4. SEARCH & SORT TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        
        {/* Search inside Hub */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search within ${hub.name}...`}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="id">Master ID (#001–#1027)</option>
            <option value="title">Alphabetical (A–Z)</option>
            <option value="popular">Popularity</option>
          </select>
          <span className="text-slate-400 text-xs pl-2 font-mono">
            {displayedSheets.length} results
          </span>
        </div>
      </div>

      {/* 5. CHEAT SHEET CARDS GRID */}
      {displayedSheets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayedSheets.map(sheet => (
            <CheatSheetCard
              key={sheet.slug}
              sheet={sheet}
              onSelect={slug => onNavigate('sheet', slug)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center text-slate-500 space-y-3">
          <Filter className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No cheat sheets match your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your search query or selecting "All Modules" above to see all {hub.sheetCount} cheat sheets.
          </p>
          <button
            onClick={() => {
              setActiveSubcategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 6. HUB SEO CONTEXT & ADSENSE ARCHITECTURE BLOCK */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 text-xs text-slate-600 leading-relaxed">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
          About the {hub.name} Reference Collection
        </h2>
        <p>
          This hub hosts {hub.sheetCount} individual cheat sheets structured according to the Hoorvia master 
          information architecture. All sheets feature full interactive data tables for in-browser reference 
          and printable formatting. In accordance with zero-cannibalization SEO principles, each guide 
          targets a unique search intent without overlapping keyword cannibalization.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2 text-slate-400">
          <span>Canonical Hub URL: <code>https://hoorvia.net{hub.path}</code></span>
          <span>·</span>
          <span>Indexable Modules: {subcategories.length}</span>
          <span>·</span>
          <span>AdSense Ready & Certified</span>
        </div>
      </div>

    </div>
  );
};
