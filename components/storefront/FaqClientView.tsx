'use client';
// CLIENT: interactive search and accordion toggles for FAQ

import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import type { FallbackFaqItem } from '@/lib/sanity/fallback-data';

interface FaqClientViewProps {
  faqs: FallbackFaqItem[];
  locale: string;
}

export function FaqClientView({ faqs, locale }: FaqClientViewProps) {
  const isEn = locale === 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = faqs.filter((faq) => {
    const q = (isEn ? faq.question.en : faq.question.fr).toLowerCase();
    const a = (isEn ? faq.answer.en : faq.answer.fr).toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    return !query || q.includes(query) || a.includes(query);
  });

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isEn
              ? 'Search questions (e.g. shipping, sizing, cold storage)...'
              : 'Rechercher une question (ex. livraison, gardiennage, tailles)...'
          }
          className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border text-sm text-primary placeholder:text-muted/60 focus:outline-none focus:border-gold transition-colors font-sans"
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {filteredFaqs.map((faq) => {
          const isOpen = Boolean(openItems[faq.id]);
          const question = isEn ? faq.question.en : faq.question.fr;
          const answer = isEn ? faq.answer.en : faq.answer.fr;

          return (
            <div
              key={faq.id}
              className="bg-surface border border-border transition-colors duration-200"
            >
              <button
                type="button"
                onClick={() => toggleItem(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-serif text-lg text-primary font-normal pr-4">
                  {question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 border-t border-border/40">
                  <p className="font-sans text-sm sm:text-base text-muted leading-relaxed font-light">
                    {answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 bg-surface border border-border">
            <p className="font-serif text-lg text-muted">
              {isEn
                ? 'No matching answers found. Our concierge remains at your disposal.'
                : 'Aucune réponse correspondante. Notre conciergerie demeure à votre écoute.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
