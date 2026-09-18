'use client';
// CLIENT: Active image index state, thumbnail selection, and zoom preview modal

import React, { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage } from '@/lib/supabase/queries/catalog';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  locale?: string;
}

export function ProductGallery({ images, productName, locale = 'fr' }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const isEn = locale === 'en';

  const fallbackImg: ProductImage = {

    id: 'placeholder',
    product_id: '',
    url: '/images/products/placeholder.webp',
    alt_text_fr: productName,
    alt_text_en: productName,
    position: 0,
  };

  const displayImages = images.length > 0 ? images : [fallbackImg];
  const currentImg: ProductImage = displayImages[activeIndex] || displayImages[0] || fallbackImg;
  const altText = isEn ? currentImg.alt_text_en : currentImg.alt_text_fr;


  function nextImage() {
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  }

  function prevImage() {
    setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  }

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative aspect-[3/4] w-full bg-ivory border border-charcoal/10 overflow-hidden group">
        <Image
          src={currentImg.url}
          alt={altText || productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Zoom trigger affordance */}
        <button
          type="button"
          onClick={() => setIsZoomed(true)}
          aria-label={isEn ? 'Enlarge image' : 'Agrandir l’image'}
          className="absolute bottom-4 right-4 p-2.5 bg-ivory/80 backdrop-blur-xs text-black border border-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-ivory"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Arrows for multi-image */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label={isEn ? 'Previous image' : 'Image précédente'}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-ivory/80 backdrop-blur-xs text-black border border-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-ivory"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label={isEn ? 'Next image' : 'Image suivante'}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-ivory/80 backdrop-blur-xs text-black border border-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-ivory"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, idx) => {
            const thumbAlt = isEn ? img.alt_text_en : img.alt_text_fr;
            const isSelected = idx === activeIndex;

            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`${isEn ? 'View image' : 'Voir l’image'} ${idx + 1}`}
                className={`relative w-20 aspect-[3/4] shrink-0 border transition-all overflow-hidden ${
                  isSelected ? 'border-black ring-1 ring-black' : 'border-charcoal/20 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.url}
                  alt={thumbAlt || `${productName} vignette ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* High-res Lightbox modal if clicked */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-4xl w-full h-[85vh]">
            <Image
              src={currentImg.url}
              alt={altText || productName}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 text-ivory text-xs uppercase tracking-widest px-4 py-2 border border-ivory/40 hover:bg-ivory hover:text-black transition-colors"
          >
            {isEn ? 'Close' : 'Fermer'}
          </button>
        </div>
      )}
    </div>
  );
}
