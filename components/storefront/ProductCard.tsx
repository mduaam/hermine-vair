'use client';
// CLIENT: Wishlist heart toggle interaction and client hover effects

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  id: string;
  slug: string;
  categorySlug?: string;
  href?: string;
  locale: 'fr' | 'en';
  name: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
  hoverImageUrl?: string;
  isWishlisted?: boolean;
  isBestSeller?: boolean;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  material?: string;
  onWishlistToggle?: (id: string) => void;
  className?: string;
}

export function ProductCard({
  id,
  slug,
  categorySlug = 'manteaux',
  href,
  locale,
  name,
  price,
  imageUrl,
  imageAlt,
  hoverImageUrl,
  isWishlisted = false,
  isBestSeller = false,
  stockStatus = 'in_stock',
  material,
  onWishlistToggle,
  className,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [isHovered, setIsHovered] = useState(false);

  function handleHeartClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !wishlisted;
    setWishlisted(nextState);
    if (onWishlistToggle) {
      onWishlistToggle(id);
    }
  }

  const isFr = locale === 'fr';
  const productHref = href || `/${locale}/collections/${categorySlug}/${slug}`;


  return (
    <div
      className={cn('group relative flex flex-col select-none bg-ivory', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal/10 border border-charcoal/10">
        <Link href={productHref} className="block w-full h-full relative">
          <Image
            src={isHovered && hoverImageUrl ? hoverImageUrl : imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-103"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {isBestSeller && <Badge variant="bestseller" label={isFr ? 'Best Seller' : 'Best Seller'} />}
          {stockStatus === 'low_stock' && (
            <Badge variant="stock-low" label={isFr ? 'Dernière pièce' : 'Low Stock'} />
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={
            wishlisted
              ? `${isFr ? 'Retirer des favoris' : 'Remove from wishlist'}: ${name}`
              : `${isFr ? 'Ajouter aux favoris' : 'Add to wishlist'}: ${name}`
          }
          className="absolute top-3 right-3 z-20 p-2 text-black hover:text-taupe bg-ivory/80 backdrop-blur-xs transition-colors"
        >
          <Heart
            className={cn(
              'w-4 h-4 stroke-[1.5] transition-colors',
              wishlisted ? 'fill-black text-black' : 'text-black'
            )}
          />
        </button>

        {/* Quick View Button (Desktop Hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden md:block z-10">
          <Link
            href={productHref}
            className="w-full py-2.5 bg-ivory/95 hover:bg-gold text-black text-[11px] uppercase tracking-[0.16em] font-semibold text-center block transition-colors shadow-xs"
          >
            {isFr ? 'Découvrir la pièce' : 'View Creation'}
          </Link>
        </div>
      </div>

      {/* Details Under Image */}
      <div className="pt-3 pb-2 space-y-1">
        {material && (
          <p className="text-[10px] uppercase tracking-[0.18em] text-taupe font-medium">
            {material}
          </p>
        )}

        <h3 className="font-serif text-sm md:text-base text-black group-hover:text-taupe transition-colors line-clamp-1">
          <Link href={productHref}>{name}</Link>
        </h3>

        <p className="font-sans text-xs md:text-sm font-medium text-black tracking-wide">
          {price}
        </p>
      </div>
    </div>
  );
}
