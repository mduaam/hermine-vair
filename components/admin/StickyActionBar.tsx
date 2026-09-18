'use client';
// CLIENT: sticky bottom save-bar for long admin forms — appears when isDirty is true

import React from 'react';
import { Loader2, Save, X } from 'lucide-react';

interface StickyActionBarProps {
  isDirty: boolean;
  isLoading: boolean;
  onDiscard: () => void;
  saveLabel?: string;
  discardLabel?: string;
}

export function StickyActionBar({
  isDirty,
  isLoading,
  onDiscard,
  saveLabel = 'Enregistrer',
  discardLabel = 'Annuler',
}: StickyActionBarProps) {
  if (!isDirty && !isLoading) return null;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 bg-white/95
        backdrop-blur-sm shadow-lg flex items-center justify-between px-4 sm:px-8 py-3
        transition-transform duration-200 ${isDirty || isLoading ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
        <span className="hidden sm:inline">Modifications non enregistrees</span>
        <span className="sm:hidden text-xs">Non enregistre</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDiscard}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium
            text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 bg-white rounded-sm transition-colors disabled:opacity-40"
        >
          <X className="w-3.5 h-3.5" />
          <span>{discardLabel}</span>
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500
            text-white text-xs font-medium tracking-wide transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>{isLoading ? 'Enregistrement...' : saveLabel}</span>
        </button>
      </div>
    </div>
  );
}