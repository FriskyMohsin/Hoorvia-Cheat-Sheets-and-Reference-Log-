import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Copy, 
  Check, 
  Sparkles,
  SlidersHorizontal,
  Info,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { CheatSheet } from '../types/cheatsheet.ts';

interface PrintExportWidgetProps {
  sheet: CheatSheet;
  onPrint?: () => void;
}

export const PrintExportWidget: React.FC<PrintExportWidgetProps> = ({ sheet, onPrint }) => {
  const [copiedAction, setCopiedAction] = useState<string | null>(null);
  const [printLandscape, setPrintLandscape] = useState(sheet.tableData.columns.length > 4);

  // Helper for notification
  const notifyCopied = (actionName: string) => {
    setCopiedAction(actionName);
    setTimeout(() => setCopiedAction(null), 2500);
  };

  // 1. Native Print trigger
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  // 2. CSV Export with RFC 4180 escaping and UTF-8 BOM for Excel
  const handleExportCsv = () => {
    const escapeCsv = (val: string | number) => {
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const header = sheet.tableData.columns.map(escapeCsv).join(',');
    const rows = sheet.tableData.rows.map(row => row.map(escapeCsv).join(',')).join('\r\n');
    const csvContent = '\uFEFF' + header + '\r\n' + rows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hoorvia-Sheet-${sheet.id}-${sheet.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notifyCopied('csv');
  };

  // 3. TSV Export
  const handleExportTsv = () => {
    const header = sheet.tableData.columns.join('\t');
    const rows = sheet.tableData.rows.map(row => row.join('\t')).join('\n');
    const tsvContent = header + '\n' + rows;

    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hoorvia-Sheet-${sheet.id}-${sheet.slug}.tsv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notifyCopied('tsv');
  };

  // 4. JSON Export
  const handleExportJson = () => {
    const payload = {
      sheetId: sheet.id,
      title: sheet.title,
      h1: sheet.h1,
      category: sheet.subCategory,
      hub: sheet.hubId,
      sourceUrl: sheet.canonicalUrl,
      exportedAt: new Date().toISOString(),
      columns: sheet.tableData.columns,
      rows: sheet.tableData.rows,
      notes: sheet.tableData.notes || null,
      license: 'Free for personal, academic, and non-commercial reference with attribution to hoorvia.net'
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hoorvia-Sheet-${sheet.id}-${sheet.slug}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notifyCopied('json');
  };

  // 5. Copy Markdown table
  const handleCopyMarkdown = () => {
    const headerRow = `| ${sheet.tableData.columns.join(' | ')} |`;
    const dividerRow = `| ${sheet.tableData.columns.map(() => '---').join(' | ')} |`;
    const dataRows = sheet.tableData.rows.map(row => `| ${row.join(' | ')} |`).join('\n');
    const markdownTable = `${headerRow}\n${dividerRow}\n${dataRows}`;

    navigator.clipboard.writeText(markdownTable);
    notifyCopied('markdown');
  };

  // 6. Copy TSV to clipboard (for instant Excel/Sheets pasting)
  const handleCopyClipboard = () => {
    const text = [
      sheet.tableData.columns.join('\t'),
      ...sheet.tableData.rows.map(r => r.join('\t'))
    ].join('\n');

    navigator.clipboard.writeText(text);
    notifyCopied('clipboard');
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 no-print">
      
      {/* Header with Title and Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/60 font-mono">
              <Printer className="w-3.5 h-3.5" />
              <span>Print & Export Station</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Sheet #{sheet.id}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
            Print Clean Reference or Export Raw Data
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-body">
            Calibrated for standard Letter & A4 paper with zero navigation clutter, high-contrast monochrome typography, and instant export options.
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex flex-col sm:items-end gap-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>CSS Media Queries Configured</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {sheet.tableData.columns.length} Columns · {sheet.tableData.rows.length} Verified Rows
          </span>
        </div>
      </div>

      {/* Main Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-6">
        
        {/* Primary Action: Print Native Dialog */}
        <button
          onClick={handlePrint}
          className="group relative flex items-center gap-3.5 p-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-lg shadow-cyan-500/20 text-left hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-950 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold flex items-center gap-1.5">
              <span>Print Sheet / Save PDF</span>
            </div>
            <div className="text-[11px] text-slate-900/80 font-normal mt-0.5">
              Opens native browser print preview
            </div>
          </div>
        </button>

        {/* Action 2: Export CSV */}
        <button
          onClick={handleExportCsv}
          className="group flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-white font-medium transition-all border border-slate-700/80 text-left hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 border border-slate-700 group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-1.5">
              <span>Export CSV File</span>
              {copiedAction === 'csv' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <div className="text-[11px] text-slate-400 font-normal mt-0.5">
              {copiedAction === 'csv' ? 'Downloaded file!' : 'RFC 4180 Excel-ready format'}
            </div>
          </div>
        </button>

        {/* Action 3: Export TSV */}
        <button
          onClick={handleExportTsv}
          className="group flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-white font-medium transition-all border border-slate-700/80 text-left hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-indigo-400 flex items-center justify-center shrink-0 border border-slate-700 group-hover:scale-105 transition-transform">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-1.5">
              <span>Export TSV File</span>
              {copiedAction === 'tsv' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <div className="text-[11px] text-slate-400 font-normal mt-0.5">
              {copiedAction === 'tsv' ? 'Downloaded file!' : 'Tab-delimited text data'}
            </div>
          </div>
        </button>

        {/* Action 4: Copy Markdown Table */}
        <button
          onClick={handleCopyMarkdown}
          className="group flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-white font-medium transition-all border border-slate-700/80 text-left hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0 border border-slate-700 group-hover:scale-105 transition-transform">
            {copiedAction === 'markdown' ? <Check className="w-5 h-5 text-emerald-400" /> : <FileCode className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-1.5">
              <span>Copy Markdown Table</span>
              {copiedAction === 'markdown' && <span className="text-xs text-emerald-400 font-bold">Copied!</span>}
            </div>
            <div className="text-[11px] text-slate-400 font-normal mt-0.5">
              GitHub-ready markdown syntax
            </div>
          </div>
        </button>

        {/* Action 5: Copy TSV to Clipboard */}
        <button
          onClick={handleCopyClipboard}
          className="group flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-white font-medium transition-all border border-slate-700/80 text-left hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 border border-slate-700 group-hover:scale-105 transition-transform">
            {copiedAction === 'clipboard' ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-1.5">
              <span>Copy Data to Clipboard</span>
              {copiedAction === 'clipboard' && <span className="text-xs text-emerald-400 font-bold">Copied!</span>}
            </div>
            <div className="text-[11px] text-slate-400 font-normal mt-0.5">
              Direct paste into Google Sheets/Excel
            </div>
          </div>
        </button>

        {/* Action 6: Export Structured JSON */}
        <button
          onClick={handleExportJson}
          className="group flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-white font-medium transition-all border border-slate-700/80 text-left hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-purple-400 flex items-center justify-center shrink-0 border border-slate-700 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-1.5">
              <span>Export JSON Object</span>
              {copiedAction === 'json' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <div className="text-[11px] text-slate-400 font-normal mt-0.5">
              {copiedAction === 'json' ? 'Downloaded file!' : 'Structured schema with metadata'}
            </div>
          </div>
        </button>

      </div>

      {/* Print Optimization Advice / Tips Footer */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Browser Print Tip:</strong> Under 'Destination', select <em>Save as PDF</em> or choose your physical printer. Headers and navigation bars will automatically be removed for a clean page.
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
          <span>Recommended: {printLandscape ? 'Landscape' : 'Portrait'}</span>
          <span>Margins: Default / Minimum</span>
        </div>
      </div>

    </div>
  );
};
