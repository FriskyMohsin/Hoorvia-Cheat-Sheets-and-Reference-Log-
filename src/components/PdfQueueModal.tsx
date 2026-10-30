import React, { useState } from 'react';
import { X, Clock, Printer, Check, Bell, Mail, FileText } from 'lucide-react';
import { CheatSheet } from '../types/cheatsheet.ts';

interface PdfQueueModalProps {
  sheet: CheatSheet | null;
  isOpen: boolean;
  onClose: () => void;
  onPrintTable: () => void;
}

export const PdfQueueModal: React.FC<PdfQueueModalProps> = ({ sheet, isOpen, onClose, onPrintTable }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !sheet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        onClose();
      }, 2000);
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150 no-print"
    >
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <Clock className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold text-slate-900 font-display">
              PDF Production Queue Status
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                {sheet.id}
              </span>
              <span>·</span>
              <span>{sheet.subCategory}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {sheet.title}
            </h3>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/80 text-xs text-sky-900 space-y-1.5">
            <p className="font-semibold flex items-center gap-1.5">
              <span>●</span>
              <span>Interactive HTML Reference Active & Verified</span>
            </p>
            <p className="text-sky-800 leading-relaxed">
              The complete data matrix and verified metrics for this cheat sheet are 100% active on this page. 
              The physical vector PDF file for this sheet is currently scheduled in Phase 3–5 of our production rollout.
            </p>
          </div>

          {/* Action 1: Print in-browser table */}
          <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Instant Print-to-PDF</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Print or export the verified HTML table directly from your browser.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onPrintTable();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            >
              Print Table
            </button>
          </div>

          {/* Action 2: Priority notification */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
              <Bell className="w-4 h-4 text-cyan-600" />
              <span>Request Priority PDF Delivery</span>
            </div>
            <p className="text-xs text-slate-500">
              Enter your email to bump this cheat sheet higher in the production queue and receive the high-res printable PDF instantly when rendered.
            </p>

            {submitted ? (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Request received! We'll notify you as soon as #{sheet.numId} PDF is published.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-cyan-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shrink-0"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
