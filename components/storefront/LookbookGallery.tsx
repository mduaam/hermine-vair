import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LookbookImage {
  url: string;
  alt: string;
  campaign: string;
  linkedCollectionSlug?: string;
  title?: string;
}

export interface LookbookGalleryProps {
  images: LookbookImage[];
  locale: 'fr' | 'en';
  className?: string;
}

export function LookbookGallery({ images, locale, className }: LookbookGalleryProps) {
  const isFr = locale === 'fr';

  if (!images || images.length === 0) return null;

  return (
    <section
      aria-label="Galerie Lookbook"
      className={cn('py-16 md:py-24 bg-ivory/80 border-t border-charcoal/10', className)}
    >
      <div className="max-w-site mx-auto px-6 md:px-10 lg:px-16 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-eyebrow uppercase tracking-[0.22em] text-taupe font-medium">
            {isFr ? 'Série Visuelle' : 'Visual Series'}
          </p>
          <h2 className="font-serif text-2xl-serif md:text-3xl text-black">
            {isFr ? 'Le Lookbook Hiver' : 'The Winter Lookbook'}
          </h2>
        </div>

        <Link
          href={`/${locale}/lookbook`}
          className="text-xs uppercase tracking-[0.16em] font-semibold text-black hover:text-taupe flex items-center gap-1 transition-colors"
        >
          <span>{isFr ? 'Découvrir tous les looks' : 'View Full Lookbook'}</span>
          <ArrowUpRight className="w-4 h-4 stroke-[1.5]" />
        </Link>
      </div>

      {/* Gallery: Horizontal Scroll on Mobile, 4-col Grid on Desktop */}
      <div className="max-w-site mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-6 md:pb-0 scrollbar-none snap-x snap-mandatory">
          {images.map((img, idx) => {
            const href = img.linkedCollectionSlug
              ? `/${locale}/collections/${img.linkedCollectionSlug}`
              : `/${locale}/lookbook`;

            return (
              <Link
                key={`${img.url}-${idx}`}
                href={href}
                className="group relative block aspect-[3/4] min-w-[280px] md:min-w-0 flex-shrink-0 snap-center overflow-hidden bg-charcoal/10 border border-charcoal/10"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-5 text-ivory transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                    {img.campaign}
                  </p>
                  {img.title && (
                    <p className="font-serif text-sm text-ivory tracking-wide mt-1">
                      {img.title}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
