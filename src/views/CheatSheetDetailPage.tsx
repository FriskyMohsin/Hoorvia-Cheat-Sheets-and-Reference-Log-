import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  FileDown, 
  Printer, 
  Copy, 
  Check, 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Search, 
  Sparkles, 
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import { CheatSheet, HubId } from '../types/cheatsheet.ts';
import { CATEGORY_HUBS } from '../data/hubs.ts';
import { getSiblingSheets } from '../data/cheatsheets.ts';
import { PdfQueueModal } from '../components/PdfQueueModal.tsx';
import { PrintExportWidget } from '../components/PrintExportWidget.tsx';

interface CheatSheetDetailPageProps {
  sheet: CheatSheet;
  onNavigate: (view: string, param?: string) => void;
}

export const CheatSheetDetailPage: React.FC<CheatSheetDetailPageProps> = ({ sheet, onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [pdfQueueModalOpen, setPdfQueueModalOpen] = useState(false);

  // Find parent hub
  const parentHub = useMemo(() => {
    return CATEGORY_HUBS.find(h => h.id === sheet.hubId) || CATEGORY_HUBS[0];
  }, [sheet.hubId]);

  // Sibling sheets: exactly 6 from the same subcategory!
  const siblingSheets = useMemo(() => {
    return getSiblingSheets(sheet, 6);
  }, [sheet]);

  // Filter rows inside table
  const filteredRows = useMemo(() => {
    if (!tableSearch.trim()) return sheet.tableData.rows;
    const q = tableSearch.toLowerCase();
    return sheet.tableData.rows.filter(row =>
      row.some(cell => String(cell).toLowerCase().includes(q))
    );
  }, [sheet.tableData.rows, tableSearch]);

  const handleCopyTable = () => {
    const text = [
      sheet.tableData.columns.join('\t'),
      ...sheet.tableData.rows.map(r => r.join('\t'))
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* PRINT-ONLY HEADER (rendered exclusively during native printing) */}
      <div className="hidden print:block print-header text-slate-900">
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-slate-900">
          <div>
            <div className="text-xl font-black tracking-tight uppercase font-display text-slate-900">
              HOORVIA<span className="text-cyan-700">.</span>NET
            </div>
            <div className="text-[9pt] font-semibold text-slate-600 uppercase tracking-widest">
              Official Digital Reference Library · 1,027 Cheat Sheets
            </div>
          </div>
          <div className="text-right font-mono text-[9pt]">
            <div className="font-bold text-slate-900">MASTER SHEET #{sheet.id}</div>
            <div className="text-slate-600">{sheet.subCategory} · {parentHub.name}</div>
          </div>
        </div>
        <h1 className="text-lg font-bold font-display text-slate-950 mb-1 leading-snug">
          {sheet.h1}
        </h1>
        <p className="text-[8.5pt] text-slate-700 mb-2 leading-relaxed">
          {sheet.shortIntro}
        </p>
        <div className="flex items-center justify-between text-[7.5pt] text-slate-500 font-mono pt-1 border-t border-slate-200">
          <span>Reference URL: {sheet.canonicalUrl}</span>
          <span>Printed on: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* 1. BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-500 no-print">
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-slate-900 transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button
          onClick={() => onNavigate('hub', parentHub.id)}
          className="hover:text-slate-900 transition-colors"
        >
          {parentHub.name}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-600 truncate max-w-[150px] sm:max-w-none">
          {sheet.subCategory}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-none">
          {sheet.id}
        </span>
      </nav>

      {/* 2. SHEET HEADER & ACTIONS (Hidden in print; print uses specialized print-header) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-6 no-print">
        
        {/* Status & ID banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
              Master Sheet {sheet.id}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-medium text-slate-700">{sheet.subCategory}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="capitalize text-slate-500">{parentHub.name}</span>
          </div>

          <div>
            {sheet.pdfStatus === 'available' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PDF Download Ready</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Interactive Table Active · PDF In Queue</span>
              </span>
            )}
          </div>
        </div>

        {/* H1 Heading */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-display tracking-tight leading-tight">
          {sheet.h1}
        </h1>

        {/* Short Introduction */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-body max-w-3xl">
          {sheet.shortIntro}
        </p>

        {/* Download & Action Station */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {sheet.pdfStatus === 'available' ? (
              <a
                href={sheet.pdfDownloadUrl}
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm hover:shadow"
              >
                <FileDown className="w-4 h-4 text-cyan-400" />
                <span>Download Printable PDF</span>
              </a>
            ) : (
              <button
                onClick={() => setPdfQueueModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-sky-100 hover:bg-sky-200 transition-all border border-sky-300/80 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-sky-700" />
                <span>PDF in Production Queue · Request Priority</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 bg-cyan-100/80 hover:bg-cyan-200 text-cyan-950 transition-colors border border-cyan-300/80 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-700" />
              <span>Print Sheet / Clean PDF</span>
            </button>

            <button
              onClick={handleCopyTable}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/70 transition-colors border border-slate-200 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy TSV Data</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Focus: <strong className="text-slate-600 font-medium">{sheet.primaryKeyword}</strong>
          </div>
        </div>

      </div>

      {/* DEDICATED PRINT / EXPORT WIDGET */}
      <PrintExportWidget sheet={sheet} onPrint={handlePrint} />


      {/* 3. INTERACTIVE HTML DATA TABLE */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
              Interactive Reference Table
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified specifications, measurements, and calibrated reference values.
            </p>
          </div>

          {/* Search inside table */}
          <div className="relative w-full sm:w-64 no-print">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={tableSearch}
              onChange={e => setTableSearch(e.target.value)}
              placeholder="Filter table rows..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 print-table">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                {sheet.tableData.columns.map((col, idx) => (
                  <th key={idx} className="p-3 sm:p-3.5 border-b border-slate-800 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length > 0 ? (
                filteredRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                    }`}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 sm:p-3.5 text-slate-700 font-mono text-xs sm:text-sm">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={sheet.tableData.columns.length} className="p-8 text-center text-slate-400">
                    No rows match your filter. Clear search to view all data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Notes / Footnotes */}
        {sheet.tableData.notes && (
          <div className="flex items-start gap-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Usage Note:</strong> {sheet.tableData.notes}
            </p>
          </div>
        )}

        {/* PRINT-ONLY FOOTER (rendered exclusively during native printing) */}
        <div className="hidden print:block print-footer text-slate-600 font-mono text-[8pt]">
          <div className="flex items-center justify-between">
            <div>
              © {new Date().getFullYear()} Hoorvia.net — Verified reference specifications. Free for personal, academic & professional reference.
            </div>
            <div>
              Master Sheet #{sheet.id} · Primary Keyword: {sheet.primaryKeyword}
            </div>
          </div>
        </div>

      </section>



      {/* 4. MANDATORY INTERNAL LINKING SILO: RELATED PRINTABLE CHEAT SHEETS IN THIS CATEGORY */}
      <section className="space-y-6 pt-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-bold text-cyan-600 uppercase tracking-wider font-display mb-1">
              Internal Linking Silo
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
              Related Printable Cheat Sheets in This Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('hub', parentHub.id)}
            className="text-xs font-semibold text-slate-700 hover:text-cyan-700 transition-colors flex items-center gap-1"
          >
            <span>Back to {parentHub.name} Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Exactly 6 Sibling Cards from Same Subcategory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {siblingSheets.map(sibling => (
            <div
              key={sibling.slug}
              onClick={() => onNavigate('sheet', sibling.slug)}
              className="group bg-white rounded-xl border border-slate-200/90 p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {sibling.id}
                  </span>
                  <span className="text-slate-400 text-[11px] truncate">{sibling.subCategory}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-2">
                  {sibling.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1.5">
                  {sibling.shortIntro}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-cyan-700">
                <span>View Reference Table</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* 5. ON-PAGE SEO METADATA & AUDIT INSPECTOR CARD */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 text-xs text-slate-600 no-print">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
          On-Page Technical SEO Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <span className="text-slate-400 block font-mono text-[10px]">SEO TITLE</span>
            <span className="font-medium text-slate-800">{sheet.seoTitle}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[10px]">CANONICAL URL</span>
            <a href={sheet.canonicalUrl} className="font-mono text-cyan-700 underline truncate block">{sheet.canonicalUrl}</a>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[10px]">PRIMARY FOCUS KEYWORD</span>
            <span className="font-semibold text-slate-900">{sheet.primaryKeyword}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-slate-400 block font-mono text-[10px]">META DESCRIPTION</span>
            <span className="text-slate-700">{sheet.metaDescription}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[10px]">IMAGE ALT TEXT</span>
            <span className="text-slate-700">{sheet.imageAlt}</span>
          </div>
        </div>
      </section>

      {/* PDF Queue Modal */}
      <PdfQueueModal
        sheet={sheet}
        isOpen={pdfQueueModalOpen}
        onClose={() => setPdfQueueModalOpen(false)}
        onPrintTable={handlePrint}
      />

    </div>
  );
};
