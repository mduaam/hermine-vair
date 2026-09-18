'use client';
// CLIENT: Hero carousel state, slide transitions, and keyboard/touch navigation

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export interface HeroSlide {
  imageUrl: string;
  imageAlt: string;
  eyebrowLabel: string;
  heading: string;
  subheading?: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlayMs?: number;
}

export function HeroCarousel({ slides, autoPlayMs = 0 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlayMs > 0);

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!isPlaying || autoPlayMs <= 0 || total <= 1) return;
    const interval = setInterval(nextSlide, autoPlayMs);
    return () => clearInterval(interval);
  }, [isPlaying, autoPlayMs, total, nextSlide]);

  if (!slides || slides.length === 0) return null;

  const activeSlide = slides[current] ?? slides[0];
  if (!activeSlide) return null;

  return (
    <section
      aria-label="Sélection Exclusive"
      aria-roledescription="carousel"
      className="relative w-full min-h-[75vh] md:min-h-[85vh] flex items-center bg-black overflow-hidden select-none"
    >
      {/* Background Slides */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={`${slide.imageUrl}-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center brightness-90"
            />
            {/* Subtle luxury gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
          </div>
        );
      })}

      {/* Content Container (Aligned over active slide) */}
      <div className="relative z-20 max-w-site mx-auto px-6 md:px-10 lg:px-16 w-full py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6 text-ivory">
          <p className="text-eyebrow uppercase tracking-[0.22em] text-gold font-sans font-medium">
            {activeSlide.eyebrowLabel}
          </p>

          {/* Accessibility rule: Exactly one H1 on the page */}
          {current === 0 ? (
            <h1 className="font-serif text-display md:text-5xl lg:text-6xl text-ivory font-normal leading-[1.15] tracking-tight">
              {activeSlide.heading}
            </h1>
          ) : (
            <p className="font-serif text-display md:text-5xl lg:text-6xl text-ivory font-normal leading-[1.15] tracking-tight">
              {activeSlide.heading}
            </p>
          )}

          {activeSlide.subheading && (
            <p className="font-sans text-sm md:text-base text-ivory/80 max-w-xl mx-auto leading-relaxed">
              {activeSlide.subheading}
            </p>
          )}

          <div className="pt-4">
            <Link
              href={activeSlide.ctaHref}
              className="inline-flex items-center justify-center px-8 py-4 bg-gold text-black text-xs font-semibold uppercase tracking-[0.18em] hover:bg-gold/90 transition-all transform hover:-translate-y-0.5"
            >
              {activeSlide.ctaLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls (Desktop) */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Slide précédente"
            className="hidden md:flex absolute left-6 z-30 p-3 text-ivory/70 hover:text-ivory bg-black/30 hover:bg-black/60 backdrop-blur-xs transition-colors"
          >
            <ChevronLeft className="w-6 h-6 stroke-[1.5]" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Slide suivante"
            className="hidden md:flex absolute right-6 z-30 p-3 text-ivory/70 hover:text-ivory bg-black/30 hover:bg-black/60 backdrop-blur-xs transition-colors"
          >
            <ChevronRight className="w-6 h-6 stroke-[1.5]" />
          </button>

          {/* Bottom Pagination: Fraction indicator + Dots + Play/Pause */}
          <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center space-x-6 text-ivory/80">
            {/* Fraction counter */}
            <span className="text-xs font-serif tracking-widest text-ivory/90">
              {current + 1} / {total}
            </span>

            {/* Dots */}
            <div className="flex items-center space-x-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Aller au slide ${i + 1}`}
                  className={`h-1.5 transition-all duration-300 ${
                    i === current ? 'w-8 bg-gold' : 'w-2 bg-ivory/40 hover:bg-ivory/70'
                  }`}
                />
              ))}
            </div>

            {/* Optional Play/Pause button */}
            {autoPlayMs > 0 && (
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Mettre en pause' : 'Reprendre la lecture'}
                className="p-1 text-ivory/70 hover:text-ivory transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
