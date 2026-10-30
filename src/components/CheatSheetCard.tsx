import React from 'react';
import { ArrowRight, FileDown, Table, CheckCircle2, Clock } from 'lucide-react';
import { CheatSheet } from '../types/cheatsheet.ts';

interface CheatSheetCardProps {
  sheet: CheatSheet;
  onSelect: (slug: string) => void;
  onRequestPdf?: (sheet: CheatSheet) => void;
}

export const CheatSheetCard: React.FC<CheatSheetCardProps> = ({ sheet, onSelect, onRequestPdf }) => {
  return (
    <div
      onClick={() => onSelect(sheet.slug)}
      className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between p-5 cursor-pointer hover:-translate-y-0.5"
    >
      <div>
        {/* Top Metadata: ID & Subcategory */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/70">
              {sheet.id}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="truncate max-w-[150px] sm:max-w-[180px] font-medium text-slate-600">
              {sheet.subCategory}
            </span>
          </div>

          {sheet.pdfStatus === 'available' ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>PDF Ready</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              <Clock className="w-3 h-3 text-sky-600" />
              <span>PDF In Queue</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-2 leading-snug">
          {sheet.title}
        </h3>

        {/* Short Summary */}
        <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
          {sheet.shortIntro}
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Table className="w-3.5 h-3.5 text-slate-400" />
          <span>{sheet.tableData.rows.length} Data Rows</span>
        </div>

        <div className="flex items-center gap-2">
          {sheet.pdfStatus === 'available' ? (
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium group-hover:text-cyan-700">
              <span>View & Download</span>
              <FileDown className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium group-hover:text-cyan-700">
              <span>View Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
