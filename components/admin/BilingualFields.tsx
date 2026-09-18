'use client';
// CLIENT: side-by-side FR/EN field wrapper — 2-col on lg:, stacked on mobile with tab toggle

import React, { useState } from 'react';

interface BilingualFieldsProps {
  frFilled: boolean;
  enFilled: boolean;
  frContent: React.ReactNode;
  enContent: React.ReactNode;
}

function CompletionDot({ filled }: { filled: boolean }) {
  return (
    <span
      className={`w-2 h-2 rounded-full shrink-0 ${filled ? 'bg-emerald-400' : 'bg-amber-400'}`}
      title={filled ? 'Champs complets' : 'Champs incomplets'}
    />
  );
}

export function BilingualFields({ frFilled, enFilled, frContent, enContent }: BilingualFieldsProps) {
  const [mobileTab, setMobileTab] = useState<'fr' | 'en'>('fr');

  return (
    <>
      {/* Mobile: tab toggle (hidden on lg) */}
      <div className="lg:hidden">
        <div className="flex border-b border-slate-200 mb-5">
          <button
            type="button"
            onClick={() => setMobileTab('fr')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors ${
              mobileTab === 'fr'
                ? 'border-b-2 border-indigo-600 text-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CompletionDot filled={frFilled} />
            FR Francais
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('en')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors ${
              mobileTab === 'en'
                ? 'border-b-2 border-indigo-600 text-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CompletionDot filled={enFilled} />
            EN English
          </button>
          <div className="ml-auto self-center pr-4 text-[10px] uppercase tracking-widest text-amber-600 font-medium">
            Mandat FR &amp; EN requis
          </div>
        </div>
        {mobileTab === 'fr' ? frContent : enContent}
      </div>

      {/* Desktop: side-by-side split (hidden on mobile) */}
      <div className="hidden lg:grid grid-cols-2 gap-6">
        {/* FR Column */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-slate-200">
            <CompletionDot filled={frFilled} />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-700">
              Version Francaise
            </span>
          </div>
          {frContent}
        </div>

        {/* EN Column */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-slate-200">
            <CompletionDot filled={enFilled} />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-700">
              English Version
            </span>
          </div>
          {enContent}
        </div>
      </div>
    </>
  );
}