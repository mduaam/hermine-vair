'use client';
// CLIENT: Hero carousel state, auto-slide timer, pause on hover/focus, touch swipe gestures, responsive images, and keyboard navigation

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export interface HeroSlide {
  imageUrl: string;
  imageMobileUrl?: string;
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

export function HeroCarousel({ slides, autoPlayMs = 6000 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlayMs > 0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Touch swipe state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Honor prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setIsPlaying(false);
      }
    }
  }, []);

  // Keyboard navigation (ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Is playback currently paused by interaction?
  const isPaused = !isPlaying || isHovered || isFocused || isUserInteracting;

  // Auto-play timer loop
  useEffect(() => {
    if (isPaused || autoPlayMs <= 0 || total <= 1) return;

    const timer = setTimeout(() => {
      nextSlide();
    }, autoPlayMs);

    return () => clearTimeout(timer);
  }, [isPaused, autoPlayMs, total, current, nextSlide]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) {
      touchStartX.current = touch.clientX;
      touchEndX.current = null;
      setIsUserInteracting(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) {
      touchEndX.current = touch.clientX;
    }
  };

  const handleTouchEnd = () => {
    setIsUserInteracting(false);
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!slides || slides.length === 0) return null;

  const activeSlide = slides[current] ?? slides[0];
  if (!activeSlide) return null;

  return (
    <section
      aria-label="Sélection Exclusive"
      aria-roledescription="carousel"
      aria-live={isPaused ? 'polite' : 'off'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-[75vh] md:min-h-[88vh] flex items-center bg-black overflow-hidden select-none"
    >
      <style>{`
        @keyframes hero-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

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
            {slide.imageMobileUrl ? (
              <>
                {/* Desktop High-Res Image */}
                <div className="hidden md:block absolute inset-0">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.imageAlt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover object-center brightness-90"
                  />
                </div>
                {/* Mobile Tailored Vertical Image */}
                <div className="block md:hidden absolute inset-0">
                  <Image
                    src={slide.imageMobileUrl}
                    alt={slide.imageAlt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover object-center brightness-90"
                  />
                </div>
              </>
            ) : (
              <Image
                src={slide.imageUrl}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center brightness-90"
              />
            )}

            {/* Luxury dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/40" />
          </div>
        );
      })}

      {/* Content Container (Aligned over active slide) */}
      <div className="relative z-20 max-w-site mx-auto px-4 sm:px-6 md:px-10 lg:px-16 w-full py-20 text-center">
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
              className="inline-flex items-center justify-center px-8 py-4 bg-gold text-black text-xs font-semibold uppercase tracking-[0.18em] hover:bg-gold/90 transition-all transform hover:-translate-y-0.5 shadow-lg"
            >
              {activeSlide.ctaLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls (Desktop Arrows) */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Diapositive précédente"
            className="hidden md:flex absolute left-6 z-30 p-3 text-ivory/70 hover:text-ivory bg-black/30 hover:bg-black/60 backdrop-blur-xs transition-colors rounded-full"
          >
            <ChevronLeft className="w-6 h-6 stroke-[1.5]" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Diapositive suivante"
            className="hidden md:flex absolute right-6 z-30 p-3 text-ivory/70 hover:text-ivory bg-black/30 hover:bg-black/60 backdrop-blur-xs transition-colors rounded-full"
          >
            <ChevronRight className="w-6 h-6 stroke-[1.5]" />
          </button>

          {/* Bottom Luxury Pagination: Fraction + Animated Progress Bars + Play/Pause */}
          <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center space-x-4 sm:space-x-6 text-ivory/80">
            {/* Fraction counter (e.g. 01 / 03) */}
            <span className="text-xs font-mono font-medium tracking-widest text-ivory/90">
              0{current + 1} <span className="text-ivory/40">/</span> 0{total}
            </span>

            {/* Modern Linear Progress Indicators */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {slides.map((_, i) => {
                const isActive = i === current;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-label={`Aller à la diapositive ${i + 1}`}
                    aria-current={isActive ? 'true' : 'false'}
                    className="group relative h-6 flex items-center justify-center cursor-pointer p-0.5"
                  >
                    <div className="w-8 sm:w-14 h-[2px] bg-ivory/25 overflow-hidden relative rounded-full">
                      {isActive ? (
                        <div
                          key={`progress-${current}-${isPaused}`}
                          className="h-full bg-gold rounded-full"
                          style={{
                            width: isPaused ? '100%' : undefined,
                            animation: !isPaused && autoPlayMs > 0
                              ? `hero-progress ${autoPlayMs}ms linear forwards`
                              : undefined,
                            backgroundColor: '#C89B5C',
                          }}
                        />
                      ) : (
                        <div className="h-full w-0 group-hover:w-full bg-ivory/50 transition-all duration-300 rounded-full" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Accessible Play/Pause Toggle */}
            {autoPlayMs > 0 && (
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Mettre en pause le défilement automatique' : 'Reprendre le défilement automatique'}
                className="p-1.5 text-ivory/70 hover:text-ivory bg-black/20 hover:bg-black/50 rounded-full transition-colors"
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
