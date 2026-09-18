'use client';
// CLIENT: interactive dual-language tab switcher for back-office entity forms

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
    <div className="flex items-center justify-between border-b border-border bg-surface/50 p-2 mb-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleLocaleChange('fr')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-medium transition-all ${
            activeLocale === 'fr'
              ? 'bg-primary text-background shadow-sm'
              : 'text-muted hover:text-primary hover:bg-surface'
          }`}
        >
          <span>🇫🇷 Français</span>
          {!frFilled && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Champs incomplets" />}
        </button>

        <button
          type="button"
          onClick={() => handleLocaleChange('en')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-medium transition-all ${
            activeLocale === 'en'
              ? 'bg-primary text-background shadow-sm'
              : 'text-muted hover:text-primary hover:bg-surface'
          }`}
        >
          <span>🇬🇧 English</span>
          {!enFilled && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Champs incomplets" />}
        </button>
      </div>

      <div className="text-[11px] tracking-wider uppercase text-gold font-medium px-3 hidden sm:block">
        Mandat Bilingue Requis (FR & EN)
      </div>
    </div>
  );
}
