'use client';
// CLIENT: Dynamic filter and sort state synchronizing with URL searchParams

import React, { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

interface FilterBarProps {
  totalCount: number;
  locale?: string;
  materials?: string[];
  sizes?: string[];
}

export function FilterBar({
  totalCount,
  locale = 'fr',
  materials = ['vison', 'renard', 'chinchilla', 'cachemire', 'laine'],
  sizes = ['34', '36', '38', '40', '42', '44'],
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isEn = locale === 'en';

  const currentSort = searchParams.get('sort') || 'newest';
  const currentMaterial = searchParams.get('material') || 'all';
  const currentSize = searchParams.get('size') || 'all';

  function updateFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || !value) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  function resetFilters() {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }

  const hasActiveFilters = currentMaterial !== 'all' || currentSize !== 'all' || currentSort !== 'newest';

  const materialLabels: Record<string, { fr: string; en: string }> = {
    vison: { fr: 'Vison', en: 'Mink' },
    renard: { fr: 'Renard', en: 'Fox' },
    chinchilla: { fr: 'Chinchilla', en: 'Chinchilla' },
    cachemire: { fr: 'Cachemire', en: 'Cashmere' },
    laine: { fr: 'Laine', en: 'Wool' },
  };

  return (
    <div className="border-y border-charcoal/15 py-4 mb-8 bg-ivory/50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-charcoal font-medium mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest">{isEn ? 'Filter by:' : 'Filtrer par :'}</span>
          </div>

          {/* Material Select */}
          <div className="relative">
            <select
              value={currentMaterial}
              onChange={(e) => updateFilter('material', e.target.value)}
              aria-label={isEn ? 'Filter by material' : 'Filtrer par matière'}
              className="appearance-none bg-ivory border border-charcoal/20 px-3 py-1.5 pr-7 text-black text-xs uppercase tracking-wider hover:border-black focus:outline-none focus:border-black cursor-pointer transition-colors"
            >
              <option value="all">{isEn ? 'All Materials' : 'Toutes Matières'}</option>
              {materials.map((mat) => (
                <option key={mat} value={mat}>
                  {isEn ? materialLabels[mat]?.en || mat : materialLabels[mat]?.fr || mat}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal text-[10px]">
              ▼
            </span>
          </div>

          {/* Size Select */}
          <div className="relative">
            <select
              value={currentSize}
              onChange={(e) => updateFilter('size', e.target.value)}
              aria-label={isEn ? 'Filter by size' : 'Filtrer par taille'}
              className="appearance-none bg-ivory border border-charcoal/20 px-3 py-1.5 pr-7 text-black text-xs uppercase tracking-wider hover:border-black focus:outline-none focus:border-black cursor-pointer transition-colors"
            >
              <option value="all">{isEn ? 'All Sizes' : 'Toutes Tailles'}</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  FR {s}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal text-[10px]">
              ▼
            </span>
          </div>

          {/* Reset Filters CTA */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-charcoal hover:text-black transition-colors underline underline-offset-4 ml-2"
            >
              <X className="w-3 h-3" />
              {isEn ? 'Reset' : 'Réinitialiser'}
            </button>
          )}
        </div>

        {/* Right: Count & Sort */}
        <div className="flex items-center gap-4 text-xs">
          <span className="text-charcoal font-serif italic text-sm">
            {totalCount} {isEn ? (totalCount > 1 ? 'creations' : 'creation') : (totalCount > 1 ? 'pièces' : 'pièce')}
          </span>

          <div className="relative flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-charcoal" />
            <select
              value={currentSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              aria-label={isEn ? 'Sort products' : 'Trier les créations'}
              className="appearance-none bg-ivory border border-charcoal/20 px-3 py-1.5 pr-7 text-black text-xs uppercase tracking-wider hover:border-black focus:outline-none focus:border-black cursor-pointer transition-colors"
            >
              <option value="newest">{isEn ? 'New Arrivals' : 'Nouveautés'}</option>
              <option value="price_asc">{isEn ? 'Price: Low to High' : 'Prix : Croissant'}</option>
              <option value="price_desc">{isEn ? 'Price: High to Low' : 'Prix : Décroissant'}</option>
              <option value="best_selling">{isEn ? 'Best Sellers' : 'Sélection Iconique'}</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal text-[10px]">
              ▼
            </span>
          </div>
        </div>
      </div>

      {isPending && (
        <div className="h-0.5 w-full bg-gold/30 mt-2 overflow-hidden">
          <div className="h-full bg-gold animate-pulse w-1/3" />
        </div>
      )}
    </div>
  );
}
