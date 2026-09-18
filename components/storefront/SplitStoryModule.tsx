import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface SplitStoryModuleProps {
  imageUrl: string;
  imageAlt: string;
  eyebrowLabel: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  imagePosition?: 'left' | 'right';
  className?: string;
}

export function SplitStoryModule({
  imageUrl,
  imageAlt,
  eyebrowLabel,
  heading,
  body,
  ctaLabel,
  ctaHref,
  imagePosition = 'right',
  className,
}: SplitStoryModuleProps) {
  const isImageRight = imagePosition === 'right';

  return (
    <section
      aria-label={heading}
      className={cn('py-16 md:py-24 max-w-site mx-auto px-6 md:px-10 lg:px-16', className)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Text Column */}
        <div
          className={cn(
            'space-y-6 lg:col-span-6',
            isImageRight ? 'lg:order-1' : 'lg:order-2'
          )}
        >
          <p className="text-eyebrow uppercase tracking-[0.22em] text-taupe font-sans font-medium">
            {eyebrowLabel}
          </p>

          <h2 className="font-serif text-2xl-serif md:text-4xl text-black font-normal leading-tight">
            {heading}
          </h2>

          <div className="space-y-4 font-sans text-sm md:text-base text-charcoal leading-relaxed">
            <p>{body}</p>
          </div>

          <div className="pt-2">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center px-8 py-4 border border-black text-black text-xs font-semibold uppercase tracking-[0.16em] hover:bg-black hover:text-ivory transition-colors"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>

        {/* Image Column */}
        <div
          className={cn(
            'relative aspect-[4/5] lg:col-span-6 overflow-hidden bg-charcoal/10 border border-charcoal/10',
            isImageRight ? 'lg:order-2' : 'lg:order-1'
          )}
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
