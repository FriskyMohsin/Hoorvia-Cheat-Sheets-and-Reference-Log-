import React, { useState } from 'react';
import { Search, Menu, X, BookOpen, Compass, Utensils, Scissors, Code2, HeartHandshake, ShieldCheck } from 'lucide-react';
import { CATEGORY_HUBS } from '../data/hubs.ts';
import { HubId } from '../types/cheatsheet.ts';

interface NavbarProps {
  currentHub?: HubId | 'home' | 'sheet' | 'legal' | 'audit';
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentHub = 'home', onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getHubIcon = (id: HubId) => {
    switch (id) {
      case 'kitchen': return <Utensils className="w-4 h-4" />;
      case 'crafting': return <Scissors className="w-4 h-4" />;
      case 'tech': return <Code2 className="w-4 h-4" />;
      case 'home-health': return <HeartHandshake className="w-4 h-4" />;
      case 'reference': return <Compass className="w-4 h-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 md:gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center text-cyan-400 font-bold shadow-sm shadow-slate-900/10 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-950 font-display leading-none">
                  HOORVIA<span className="text-cyan-500">.</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase mt-0.5">
                  1,027 Cheat Sheets
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Primary Nav Links (5 Hubs) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-600">
            {CATEGORY_HUBS.map((hub) => {
              const isActive = currentHub === hub.id;
              return (
                <button
                  key={hub.id}
                  onClick={() => onNavigate('hub', hub.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-xs xl:text-sm ${
                    isActive
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-600' : 'text-slate-400'}>
                    {getHubIcon(hub.id)}
                  </span>
                  <span>{hub.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Search Trigger & Audit Inspector) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100/80 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-all hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              title="Search all 1,027 cheat sheets"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Search 1,027 sheets...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => onNavigate('audit')}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                currentHub === 'audit'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
              }`}
              title="View Central SEO Database & Audit Report"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SEO Audit</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
            Category Hubs
          </div>
          {CATEGORY_HUBS.map((hub) => (
            <button
              key={hub.id}
              onClick={() => {
                onNavigate('hub', hub.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                currentHub === hub.id
                  ? 'bg-slate-100 text-slate-950 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-slate-500">{getHubIcon(hub.id)}</span>
                <span>{hub.name}</span>
              </div>
              <span className="text-xs font-mono text-slate-400">{hub.sheetCount} sheets</span>
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onNavigate('audit');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SEO Audit & Verification Report</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
