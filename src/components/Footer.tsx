import React from 'react';
import { BookOpen, ShieldCheck, FileText, ExternalLink } from 'lucide-react';
import { CATEGORY_HUBS } from '../data/hubs.ts';
import { getPopularSheets } from '../data/cheatsheets.ts';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const topSheets = getPopularSheets(5);

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                HOORVIA<span className="text-cyan-400">.NET</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Hoorvia is an authoritative digital reference library and printable cheat sheet collection. 
              Designed with a zero-duplicate SEO architecture, 1,027 structured guides provide instant clarity 
              for home cooks, crafters, developers, homeowners, and researchers worldwide.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% AdSense Policy Compliant</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>1,027 Unique Guides</span>
              </span>
            </div>
          </div>

          {/* Category Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
              Category Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORY_HUBS.map((hub) => (
                <li key={hub.id}>
                  <button
                    onClick={() => onNavigate('hub', hub.id)}
                    className="hover:text-cyan-400 transition-colors text-left flex items-center justify-between w-full"
                  >
                    <span>{hub.name}</span>
                    <span className="text-slate-600 font-mono text-[10px]">{hub.sheetCount}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Top 5 Popular Sheets */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
              Popular Resources
            </h4>
            <ul className="space-y-2 text-xs">
              {topSheets.map((sheet) => (
                <li key={sheet.slug}>
                  <button
                    onClick={() => onNavigate('sheet', sheet.slug)}
                    className="hover:text-cyan-400 transition-colors text-left line-clamp-1"
                    title={sheet.title}
                  >
                    <span className="font-mono text-cyan-400 mr-1.5 text-[11px]">{sheet.id}</span>
                    <span>{sheet.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('legal', 'about')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  About Hoorvia
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal', 'contact')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal', 'privacy-policy')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal', 'terms-of-service')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal', 'disclaimer')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Disclaimer & Permissions
                </button>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  <span>XML Sitemap</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Hoorvia.net. All rights reserved. Precision Reference & Printable Knowledge Base.</p>
          <div className="flex items-center gap-4">
            <span>Canonical Domain: <strong className="text-slate-400 font-normal">hoorvia.net</strong></span>
            <span>·</span>
            <span>Zero-Cannibalization SEO Blueprint</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
