import React from 'react';
import { SubCategory } from '../types/cheatsheet.ts';

interface SubcategoryFilterPillsProps {
  subcategories: SubCategory[];
  activeSubcategory: string | 'all';
  onSelectSubcategory: (subcatId: string) => void;
  totalSheetsCount: number;
}

export const SubcategoryFilterPills: React.FC<SubcategoryFilterPillsProps> = ({
  subcategories,
  activeSubcategory,
  onSelectSubcategory,
  totalSheetsCount,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-2 mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Filter by Subcategory ({subcategories.length} Modules)
        </span>
        <span className="text-xs text-slate-400 font-mono">
          Zero-Reload Instant Filter
        </span>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {/* 'All' Button */}
        <button
          onClick={() => onSelectSubcategory('all')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeSubcategory === 'all'
              ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
              : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <span>All Modules</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
            activeSubcategory === 'all' ? 'bg-slate-800 text-cyan-300' : 'bg-slate-100 text-slate-500'
          }`}>
            {totalSheetsCount}
          </span>
        </button>

        {/* Subcategory Pills */}
        {subcategories.map((subcat) => {
          const isActive = activeSubcategory === subcat.name;
          return (
            <button
              key={subcat.id}
              onClick={() => onSelectSubcategory(subcat.name)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span>{subcat.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isActive ? 'bg-slate-800 text-cyan-300' : 'bg-slate-100 text-slate-500'
              }`}>
                {subcat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
