'use client';
// CLIENT: Mobile drawer menu, scroll state detection, and locale switcher interaction

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, User, Heart, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export interface NavItem {
  labelFr: string;
  labelEn: string;
  href: string;
}

export interface HeaderProps {
  locale: 'fr' | 'en';
  cartItemCount?: number;
  wishlistCount?: number;
  isAuthenticated?: boolean;
  navigationItems?: NavItem[];
}

const DEFAULT_NAV: NavItem[] = [
  { labelFr: 'Manteaux', labelEn: 'Coats', href: '/collections/manteaux' },
  { labelFr: 'Gilets & Vestes', labelEn: 'Vests & Jackets', href: '/collections/gilets' },
  { labelFr: 'Capes & Étoles', labelEn: 'Capes & Stoles', href: '/collections/capes' },
  { labelFr: 'Accessoires', labelEn: 'Accessories', href: '/collections/accessoires' },
  { labelFr: 'La Maison', labelEn: 'The Maison', href: '/maison' },
  { labelFr: 'Le Journal', labelEn: 'The Journal', href: '/journal' },
];

export function Header({
  locale,
  cartItemCount: propCartCount,
  wishlistCount = 0,
  navigationItems = DEFAULT_NAV,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const cartItemCount = propCartCount !== undefined ? propCartCount : itemCount;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const otherLocale = locale === 'fr' ? 'en' : 'fr';
  const otherLocaleLabel = locale === 'fr' ? 'EN' : 'FR';

  // Build target URL for locale switch
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
  const switchLocaleHref = `/${otherLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'bg-ivory/95 backdrop-blur-md shadow-xs border-b border-charcoal/10'
            : 'bg-ivory border-b border-charcoal/10'
        )}
      >
        <div className="max-w-site mx-auto px-6 md:px-10 lg:px-16 h-20 flex items-center justify-between">
          {/* Mobile: Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Ouvrir le menu"
              className="p-2 -ml-2 text-black hover:text-taupe transition-colors"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Brand Wordmark / Crest */}
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex flex-col items-start group">
              <span className="font-serif text-2xl md:text-3xl tracking-wide text-black group-hover:text-taupe transition-colors">
                L’Hermine et le Vair
              </span>
              <span className="font-sans text-[9px] tracking-[0.24em] uppercase text-taupe hidden sm:block">
                Paris · Haute Fourrure
              </span>
            </Link>
          </div>

          {/* Desktop Primary Navigation */}
          <nav
            aria-label="Navigation Principale"
            className="hidden lg:flex items-center space-x-7 xl:space-x-9"
          >
            {navigationItems.map((item) => {
              const label = locale === 'fr' ? item.labelFr : item.labelEn;
              const fullHref = `/${locale}${item.href}`;
              const isActive = pathname.startsWith(fullHref);

              return (
                <Link
                  key={item.href}
                  href={fullHref}
                  className={cn(
                    'text-xs uppercase tracking-[0.14em] transition-colors relative py-1',
                    isActive
                      ? 'text-black font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-gold'
                      : 'text-charcoal hover:text-black'
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5 text-charcoal">
            {/* Locale Switcher Button */}
            <Link
              href={switchLocaleHref}
              className="text-[11px] font-medium tracking-widest px-2 py-0.5 border border-charcoal/20 hover:border-black text-black transition-colors"
              aria-label={`Changer de langue vers ${otherLocaleLabel}`}
            >
              {otherLocaleLabel}
            </Link>

            <Link
              href={`/${locale}/search`}
              className="p-1 hover:text-black transition-colors hidden sm:inline-flex"
              aria-label="Recherche"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </Link>

            <Link
              href={`/${locale}/account`}
              className="p-1 hover:text-black transition-colors hidden sm:inline-flex"
              aria-label="Mon Compte"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            <Link
              href={`/${locale}/wishlist`}
              className="p-1 hover:text-black transition-colors relative hidden sm:inline-flex"
              aria-label={`Favoris (${wishlistCount})`}
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-taupe text-ivory text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="p-1 hover:text-black transition-colors relative"
              aria-label={`Panier (${cartItemCount})`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartItemCount > 0 ? (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Slide-in) */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex lg:hidden bg-black/50 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-4/5 max-w-sm bg-ivory h-full p-6 flex flex-col justify-between overflow-y-auto border-r border-charcoal/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-charcoal/10">
                <span className="font-serif text-xl tracking-wider text-black">
                  L’Hermine et le Vair
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fermer le menu"
                  className="p-1 text-charcoal hover:text-black"
                >
                  <X className="w-6 h-6 stroke-[1.5]" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col space-y-5">
                {navigationItems.map((item) => {
                  const label = locale === 'fr' ? item.labelFr : item.labelEn;
                  return (
                    <Link
                      key={item.href}
                      href={`/${locale}${item.href}`}
                      className="text-sm uppercase tracking-[0.16em] text-black hover:text-taupe transition-colors"
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-8 border-t border-charcoal/10 space-y-4 text-xs tracking-wider">
              <div className="flex items-center justify-between text-charcoal">
                <span>Langue / Language:</span>
                <Link
                  href={switchLocaleHref}
                  className="px-2 py-1 border border-charcoal/30 text-black font-semibold"
                >
                  {otherLocaleLabel}
                </Link>
              </div>
              <div className="text-charcoal/60 text-[11px]">
                Concierge: +33 1 42 68 00 00
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
