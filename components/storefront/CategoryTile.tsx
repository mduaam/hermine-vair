import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export interface CategoryTileProps {
  imageUrl: string;
  imageAlt: string;
  label: string;
  ctaLabel?: string;
  href: string;
  className?: string;
}

export function CategoryTile({
  imageUrl,
  imageAlt,
  label,
  ctaLabel = 'Découvrir',
  href,
  className,
}: CategoryTileProps) {
  return (
    <Link
      href={href}
      className={`group relative block aspect-[3/4] w-full overflow-hidden bg-charcoal/20 select-none ${className || ''}`}
    >
      {/* Background Image with Hover Scale */}
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-95 group-hover:brightness-90"
      />

      {/* Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />

      {/* Label and CTA at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between text-ivory">
        <div className="space-y-1">
          <h3 className="font-serif text-xl md:text-2xl text-ivory tracking-wide">
            {label}
          </h3>
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-gold font-medium flex items-center gap-1 group-hover:underline">
            <span>{ctaLabel}</span>
          </p>
        </div>

        <div className="p-2 border border-ivory/20 rounded-full text-ivory group-hover:border-gold group-hover:text-gold transition-colors">
          <ArrowUpRight className="w-4 h-4 stroke-[1.5]" />
        </div>
      </div>
    </Link>
  );
}
