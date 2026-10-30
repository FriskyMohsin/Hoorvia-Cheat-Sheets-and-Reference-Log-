import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, FileText, CheckCircle2, Clock } from 'lucide-react';
import { ALL_CHEAT_SHEETS } from '../data/cheatsheets.ts';
import { CATEGORY_HUBS } from '../data/hubs.ts';
import { CheatSheet, HubId } from '../types/cheatsheet.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSheet: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectSheet }) => {
  const [query, setQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState<HubId | 'all'>('all');
  const [results, setResults] = useState<CheatSheet[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedHub('all');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    let filtered = ALL_CHEAT_SHEETS;

    if (selectedHub !== 'all') {
      filtered = filtered.filter(s => s.hubId === selectedHub);
    }

    if (!trimmed) {
      // Show default top picks if no query
      setResults(filtered.slice(0, 8));
      return;
    }

    const matched = filtered.filter(sheet => {
      const matchId = sheet.id.toLowerCase().includes(trimmed) || String(sheet.numId).includes(trimmed);
      const matchTitle = sheet.title.toLowerCase().includes(trimmed);
      const matchSub = sheet.subCategory.toLowerCase().includes(trimmed);
      const matchKey = sheet.primaryKeyword.toLowerCase().includes(trimmed);
      const matchSec = sheet.secondaryKeywords.some(k => k.toLowerCase().includes(trimmed));
      return matchId || matchTitle || matchSub || matchKey || matchSec;
    });

    setResults(matched.slice(0, 16));
  }, [query, selectedHub]);

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150 no-print"
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by topic, keyword, formula, or ID (e.g. 'Air Fryer', 'Excel', '#001')..."
            className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-md shadow-2xs"
          >
            ESC
          </button>
        </div>

        {/* Hub Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-white overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedHub('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedHub === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All (1,027)
          </button>
          {CATEGORY_HUBS.map(hub => (
            <button
              key={hub.id}
              onClick={() => setSelectedHub(hub.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedHub === hub.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {hub.name} ({hub.sheetCount})
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 flex-1">
          {results.length > 0 ? (
            results.map(sheet => (
              <button
                key={sheet.slug}
                onClick={() => {
                  onSelectSheet(sheet.slug);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left transition-colors group"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700 shrink-0 border border-slate-200/60">
                    {sheet.id}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{sheet.subCategory}</span>
                      <span>·</span>
                      <span className="capitalize">{sheet.hubId}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors truncate mt-0.5">
                      {sheet.title}
                    </div>
                    <div className="text-xs text-slate-400 truncate mt-0.5">
                      Keyword: {sheet.primaryKeyword}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {sheet.pdfStatus === 'available' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>PDF Ready</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60">
                      <Clock className="w-3 h-3" />
                      <span>In Queue</span>
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </button>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-700">No cheat sheets found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for keywords like "Air Fryer", "Python", or "Military Time".</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {results.length} of 1,027 total cheat sheets</span>
          <span className="hidden sm:inline">Use ↑↓ to navigate · Enter to select</span>
        </div>
      </div>
    </div>
  );
};
