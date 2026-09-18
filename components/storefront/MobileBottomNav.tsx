'use client';
// CLIENT: Mobile bottom nav pathname matching and client state

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export interface MobileBottomNavProps {
  locale: 'fr' | 'en';
  cartItemCount?: number;
  wishlistCount?: number;
}

export function MobileBottomNav({
  locale,
  cartItemCount: propCartCount,
  wishlistCount = 0,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const cartItemCount = propCartCount !== undefined ? propCartCount : itemCount;

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isSearch = pathname.startsWith(`/${locale}/search`);
  const isWishlist = pathname.startsWith(`/${locale}/wishlist`);
  const isCart = pathname.startsWith(`/${locale}/cart`);

  const isFr = locale === 'fr';

  return (
    <nav
      aria-label="Navigation Mobile Inférieure"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ivory/95 backdrop-blur-md border-t border-charcoal/15 h-16 px-4 flex items-center justify-around shadow-lg"
    >
      {/* Home */}
      <Link
        href={`/${locale}`}
        className={cn(
          'flex flex-col items-center justify-center space-y-1 py-1 w-16 transition-colors',
          isHome ? 'text-gold' : 'text-charcoal hover:text-black'
        )}
      >
        <Home className="w-5 h-5 stroke-[1.5]" />
        <span className="text-[10px] tracking-wider uppercase font-medium">
          {isFr ? 'Accueil' : 'Home'}
        </span>
      </Link>

      {/* Search */}
      <Link
        href={`/${locale}/search`}
        className={cn(
          'flex flex-col items-center justify-center space-y-1 py-1 w-16 transition-colors',
          isSearch ? 'text-gold' : 'text-charcoal hover:text-black'
        )}
      >
        <Search className="w-5 h-5 stroke-[1.5]" />
        <span className="text-[10px] tracking-wider uppercase font-medium">
          {isFr ? 'Recherche' : 'Search'}
        </span>
      </Link>

      {/* Wishlist */}
      <Link
        href={`/${locale}/wishlist`}
        className={cn(
          'flex flex-col items-center justify-center space-y-1 py-1 w-16 transition-colors relative',
          isWishlist ? 'text-gold' : 'text-charcoal hover:text-black'
        )}
      >
        <div className="relative">
          <Heart className="w-5 h-5 stroke-[1.5]" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-taupe text-ivory text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-wider uppercase font-medium">
          {isFr ? 'Favoris' : 'Wishlist'}
        </span>
      </Link>

      {/* Cart */}
      <button
        type="button"
        onClick={openCart}
        className={cn(
          'flex flex-col items-center justify-center space-y-1 py-1 w-16 transition-colors relative text-charcoal hover:text-black'
        )}
        aria-label={isFr ? 'Panier' : 'Bag'}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-gold text-black text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-wider uppercase font-medium">
          {isFr ? 'Panier' : 'Bag'}
        </span>
      </button>
    </nav>
  );
}
