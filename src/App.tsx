import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { HomePage } from './views/HomePage.tsx';
import { CategoryHubPage } from './views/CategoryHubPage.tsx';
import { CheatSheetDetailPage } from './views/CheatSheetDetailPage.tsx';
import { LegalPage } from './views/LegalPage.tsx';
import { SeoAuditView } from './views/SeoAuditView.tsx';
import { CATEGORY_HUBS } from './data/hubs.ts';
import { CHEAT_SHEETS_BY_SLUG, ALL_CHEAT_SHEETS } from './data/cheatsheets.ts';
import { HubId } from './types/cheatsheet.ts';

type ViewMode = 'home' | 'hub' | 'sheet' | 'legal' | 'audit';

export default function App() {
  const [view, setView] = useState<ViewMode>('home');
  const [currentParam, setCurrentParam] = useState<string | undefined>();
  const [searchOpen, setSearchOpen] = useState(false);

  // Parse path on initial load
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;

      if (path === '/' || path === '') {
        setView('home');
        setCurrentParam(undefined);
        return;
      }

      if (path.startsWith('/kitchen')) {
        setView('hub');
        setCurrentParam('kitchen');
        return;
      }
      if (path.startsWith('/crafting')) {
        setView('hub');
        setCurrentParam('crafting');
        return;
      }
      if (path.startsWith('/tech')) {
        setView('hub');
        setCurrentParam('tech');
        return;
      }
      if (path.startsWith('/home-health')) {
        setView('hub');
        setCurrentParam('home-health');
        return;
      }
      if (path.startsWith('/reference')) {
        setView('hub');
        setCurrentParam('reference');
        return;
      }

      if (path.startsWith('/sheet/')) {
        const slug = path.replace(/^\/sheet\//, '').replace(/\/$/, '');
        if (CHEAT_SHEETS_BY_SLUG.has(slug)) {
          setView('sheet');
          setCurrentParam(slug);
          return;
        }
      }

      if (path.startsWith('/legal/')) {
        const legalPage = path.replace(/^\/legal\//, '').replace(/\.html$/, '');
        setView('legal');
        setCurrentParam(legalPage);
        return;
      }

      if (path === '/audit') {
        setView('audit');
        setCurrentParam(undefined);
        return;
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  // Update document title, meta description, and canonical tag dynamically
  useEffect(() => {
    let title = 'Hoorvia - 1,027 Printable Cheat Sheets & Digital Reference Library';
    let description = 'Hoorvia is a premier digital reference library hosting 1,027 searchable cheat sheets and printable PDF guides across cooking, crafting, tech, home, and reference charts.';
    let canonical = 'https://hoorvia.net/';

    if (view === 'hub' && currentParam) {
      const hub = CATEGORY_HUBS.find(h => h.id === currentParam);
      if (hub) {
        title = `${hub.name} Reference Hub (1,027 Sheets) | Hoorvia`;
        description = hub.description;
        canonical = `https://hoorvia.net${hub.path}`;
      }
    } else if (view === 'sheet' && currentParam) {
      const sheet = CHEAT_SHEETS_BY_SLUG.get(currentParam);
      if (sheet) {
        title = sheet.seoTitle;
        description = sheet.metaDescription;
        canonical = sheet.canonicalUrl;
      }
    } else if (view === 'audit') {
      title = 'Master SEO Audit & 1,027 Metadata Registry | Hoorvia';
      description = 'Central SEO database and audit verification engine for all 1,027 sheets and 5 category hubs.';
      canonical = 'https://hoorvia.net/audit';
    }

    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) canonicalTag.setAttribute('href', canonical);

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view, currentParam]);

  const handleNavigate = (newView: string, param?: string) => {
    setView(newView as ViewMode);
    setCurrentParam(param);

    // Update browser URL
    let targetPath = '/';
    if (newView === 'hub' && param) {
      const hub = CATEGORY_HUBS.find(h => h.id === param);
      targetPath = hub ? hub.path : `/${param}/index.html`;
    } else if (newView === 'sheet' && param) {
      targetPath = `/sheet/${param}/`;
    } else if (newView === 'legal' && param) {
      targetPath = `/legal/${param}.html`;
    } else if (newView === 'audit') {
      targetPath = '/audit';
    }

    window.history.pushState({}, '', targetPath);
  };

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeHubId: HubId | 'home' | 'sheet' | 'legal' | 'audit' =
    view === 'hub' ? (currentParam as HubId) : view;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a]">
      {/* Sticky Navigation Header */}
      <Navbar
        currentHub={activeHubId}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {view === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenSearch={() => setSearchOpen(true)}
          />
        )}

        {view === 'hub' && currentParam && (
          <CategoryHubPage
            hub={CATEGORY_HUBS.find(h => h.id === currentParam) || CATEGORY_HUBS[0]}
            onNavigate={handleNavigate}
            onOpenSearch={() => setSearchOpen(true)}
          />
        )}

        {view === 'sheet' && currentParam && (
          <CheatSheetDetailPage
            sheet={CHEAT_SHEETS_BY_SLUG.get(currentParam) || ALL_CHEAT_SHEETS[0]}
            onNavigate={handleNavigate}
          />
        )}

        {view === 'legal' && (
          <LegalPage
            pageType={(currentParam as any) || 'about'}
            onNavigate={handleNavigate}
          />
        )}

        {view === 'audit' && (
          <SeoAuditView
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global AdSense-Compliant Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectSheet={slug => handleNavigate('sheet', slug)}
      />
    </div>
  );
}
