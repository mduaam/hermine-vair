'use client';
// CLIENT: interactive dual-language tab switcher — mobile tabs, lg: side-by-side hint

import React from 'react';

interface DualLanguageTabsProps {
  activeLocale: 'fr' | 'en';
  onLocaleChange?: (locale: 'fr' | 'en') => void;
  onSelectLocale?: (locale: 'fr' | 'en') => void;
  frFilled?: boolean;
  enFilled?: boolean;
}

export function DualLanguageTabs({
  activeLocale,
  onLocaleChange,
  onSelectLocale,
  frFilled = true,
  enFilled = true,
}: DualLanguageTabsProps) {
  const handleLocaleChange = (locale: 'fr' | 'en') => {
    if (onLocaleChange) onLocaleChange(locale);
    if (onSelectLocale) onSelectLocale(locale);
  };

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-2 mb-6 rounded-t-sm">
      <div className="flex items-center gap-0">
        <button
          type="button"
          onClick={() => handleLocaleChange('fr')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-medium transition-all border-b-2 ${
            activeLocale === 'fr'
              ? 'border-indigo-600 text-slate-900 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${frFilled ? 'bg-emerald-500' : 'bg-amber-500'}`}
            title={frFilled ? 'Champs complets' : 'Champs incomplets'}
          />
          FR Francais
        </button>

        <button
          type="button"
          onClick={() => handleLocaleChange('en')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-medium transition-all border-b-2 ${
            activeLocale === 'en'
              ? 'border-indigo-600 text-slate-900 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${enFilled ? 'bg-emerald-500' : 'bg-amber-500'}`}
            title={enFilled ? 'Champs complets' : 'Champs incomplets'}
          />
          EN English
        </button>
      </div>

      <div className="text-[10px] tracking-widest uppercase text-amber-600 font-medium px-3 hidden sm:block">
        Mandat FR &amp; EN requis
      </div>
    </div>
  );
}