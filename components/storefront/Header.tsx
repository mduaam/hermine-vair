'use client';
// CLIENT: Triptyque Header with centered brand name and luxury left curtain drawer (desktop & mobile)

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Search, User, Heart, ShoppingBag, ArrowRight, MapPin, Phone, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export interface CollectionCategory {
  labelFr: string;
  labelEn: string;
  hrefFr: string;
  hrefEn: string;
  descFr: string;
  descEn: string;
}

export interface HeaderProps {
  locale: 'fr' | 'en';
  cartItemCount?: number;
  wishlistCount?: number;
  isAuthenticated?: boolean;
}

export const MAIN_COLLECTIONS: CollectionCategory[] = [
  {
    labelFr: 'Manteau Fourrure Femme',
    labelEn: "Women's Fur Coat",
    hrefFr: '/collections/manteau-fourrure-femme',
    hrefEn: '/collections/womens-fur-coat',
    descFr: 'Visons impériaux, renards et manteaux longs d’apparat',
    descEn: 'Imperial mink, fox, and regal full-length statement coats',
  },
  {
    labelFr: 'Veste Fourrure Femme',
    labelEn: "Women's Fur Jacket",
    hrefFr: '/collections/veste-fourrure-femme',
    hrefEn: '/collections/womens-fur-jacket',
    descFr: 'Coupes structurées et volumes contemporains',
    descEn: 'Structured cuts, tailored lines, and modern volumes',
  },
  {
    labelFr: 'Gilet Fourrure Femme',
    labelEn: "Women's Fur Vest",
    hrefFr: '/collections/gilet-fourrure-femme',
    hrefEn: '/collections/womens-fur-vest',
    descFr: 'Silhouettes sans manches en renard platine et vison',
    descEn: 'Sleeveless silhouettes in platinum fox and sleek mink',
  },
  {
    labelFr: 'Doudoune Fourrure Femme',
    labelEn: "Women's Fur Down Jacket",
    hrefFr: '/collections/doudoune-fourrure-femme',
    hrefEn: '/collections/womens-fur-down-jacket',
    descFr: 'Duvet noble rehaussé de parures en vison impérial',
    descEn: 'Precious down insulation trimmed with imperial mink',
  },
  {
    labelFr: 'Parka Fourrure Femme',
    labelEn: "Women's Fur Parka",
    hrefFr: '/collections/parka-fourrure-femme',
    hrefEn: '/collections/womens-fur-parka',
    descFr: 'Toile technique grand froid doublée de renard argenté',
    descEn: 'Sub-zero technical shells with removable silver fox lining',
  },
  {
    labelFr: 'Blouson Fourrure Femme',
    labelEn: "Women's Fur Bomber",
    hrefFr: '/collections/blouson-fourrure-femme',
    hrefEn: '/collections/womens-fur-bomber',
    descFr: 'Bombers couture pleine peau et finitions cachemire',
    descEn: 'Full-pelt couture bombers with ribbed cashmere trims',
  },
  {
    labelFr: 'Boléro en Fourrure',
    labelEn: 'Fur Bolero',
    hrefFr: '/collections/bolero-en-fourrure',
    hrefEn: '/collections/fur-bolero',
    descFr: 'Boléros raffinés et étoles d’apparat pour le soir',
    descEn: 'Refined evening boleros and draped opera stoles',
  },
  {
    labelFr: 'Cape Fourrure Femme',
    labelEn: "Women's Fur Cape",
    hrefFr: '/collections/cape-fourrure-femme',
    hrefEn: '/collections/womens-fur-cape',
    descFr: 'Cachemire double-face et parures en renard blanc arctique',
    descEn: 'Double-face cashmere capes trimmed with Arctic white fox',
  },
];

export const ACCESSORIES_COLLECTIONS: CollectionCategory[] = [
  {
    labelFr: 'Chapeau Fourrure Femme',
    labelEn: "Women's Fur Hat",
    hrefFr: '/collections/chapeau-fourrure-femme',
    hrefEn: '/collections/womens-fur-hat',
    descFr: 'Chapeaux cloche couture et pièces de tête d’exception',
    descEn: 'Couture cloche hats and bespoke millinery headpieces',
  },
  {
    labelFr: 'Toque Fourrure Femme',
    labelEn: "Women's Fur Toque",
    hrefFr: '/collections/toque-fourrure-femme',
    hrefEn: '/collections/womens-fur-toque',
    descFr: 'Toques impériales en vison noir doublées de soie',
    descEn: 'Imperial black mink toques lined with quilted silk',
  },
  {
    labelFr: 'Bandeau en Fourrure',
    labelEn: 'Fur Headband',
    hrefFr: '/collections/bandeau-en-fourrure',
    hrefEn: '/collections/fur-headband',
    descFr: 'Bandeaux enveloppants en renard argenté et velours de soie',
    descEn: 'Plush silver fox headbands with silk velvet ribbons',
  },
  {
    labelFr: 'Bonnet Fourrure Femme',
    labelEn: "Women's Fur Beanie",
    hrefFr: '/collections/bonnet-fourrure-femme',
    hrefEn: '/collections/womens-fur-beanie',
    descFr: 'Cachemire mongol côtelé et pompons amovibles en renard',
    descEn: 'Ribbed cashmere beanies with detachable natural fox pompons',
  },
  {
    labelFr: 'Chapka Fourrure Femme',
    labelEn: "Women's Fur Chapka",
    hrefFr: '/collections/chapka-fourrure-femme',
    hrefEn: '/collections/womens-fur-chapka',
    descFr: 'Chapkas de maître en vison scandinave et cuir nappa',
    descEn: 'Authentic Scandinavian mink and supple nappa ushankas',
  },
];

export const COLLECTION_CATEGORIES: CollectionCategory[] = [
  ...MAIN_COLLECTIONS,
  ...ACCESSORIES_COLLECTIONS,
];

export const MAISON_LINKS = [
  { labelFr: 'Savoir-Faire d’Atelier', labelEn: 'Atelier Craftsmanship', href: '/maison/savoir-faire' },
  { labelFr: 'Éthique & Traçabilité Furmark®', labelEn: 'Furmark® Ethics & Sourcing', href: '/maison/ethique' },
  { labelFr: 'Héritage & Histoire', labelEn: 'Heritage & Lineage', href: '/maison/heritage' },
  { labelFr: 'Le Journal de la Maison', labelEn: 'The Maison Journal', href: '/journal' },
  { labelFr: 'Le Lookbook Saison', labelEn: 'Seasonal Lookbook', href: '/lookbook' },
];

export function Header({
  locale,
  cartItemCount: propCartCount,
  wishlistCount = 0,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const cartItemCount = propCartCount !== undefined ? propCartCount : itemCount;

  const isFr = locale === 'fr';

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    if (menuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [menuOpen]);

  const otherLocale = locale === 'fr' ? 'en' : 'fr';
  const otherLocaleLabel = locale === 'fr' ? 'EN' : 'FR';

  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
  const switchLocaleHref = `/${otherLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full max-w-full transition-all duration-300',
          scrolled
            ? 'bg-ivory/95 backdrop-blur-md shadow-xs border-b border-charcoal/10'
            : 'bg-ivory border-b border-charcoal/10'
        )}
      >
        <div className="max-w-site mx-auto px-4 sm:px-6 md:px-10 lg:px-16 h-20 sm:h-24 flex items-center justify-between relative">
          {/* Zone 1: Left — Luxury Menu Button */}
          <div className="flex items-center flex-1 justify-start z-10">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={isFr ? 'Ouvrir le menu de navigation' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              className="inline-flex items-center gap-3 p-2 -ml-2 text-black hover:text-gold transition-colors group cursor-pointer"
            >
              <div className="w-5 flex flex-col items-start gap-1.5">
                <span className="w-5 h-[1.5px] bg-black group-hover:bg-gold transition-colors" />
                <span className="w-3.5 h-[1.5px] bg-black group-hover:bg-gold transition-colors" />
              </div>
              <span className="text-xs uppercase tracking-[0.22em] font-medium hidden sm:inline-block">
                Menu
              </span>
            </button>
          </div>

          {/* Zone 2: Center — Brand Wordmark & Crest (Absolute Centering) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto z-10">
            <Link href={`/${locale}`} className="flex flex-col items-center group">
              <span className="font-serif text-lg sm:text-2xl lg:text-3xl tracking-[0.03em] sm:tracking-wide text-black group-hover:text-taupe transition-colors whitespace-nowrap leading-tight">
                L’Hermine et le Vair
              </span>
              <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.24em] uppercase text-taupe block leading-none mt-1">
                Paris · Haute Fourrure
              </span>
            </Link>
          </div>

          {/* Zone 3: Right — Utilitaires d'Exception */}
          <div className="flex items-center flex-1 justify-end space-x-3 sm:space-x-4 md:space-x-5 text-charcoal z-10">
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

      {/* Luxury Left Curtain Drawer (Slide from Left - Desktop & Mobile) */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-full sm:w-[500px] max-w-full bg-ivory h-full p-6 sm:p-10 flex flex-col justify-between overflow-y-auto border-r border-charcoal/20 shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-8">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-6 border-b border-charcoal/15">
                <div>
                  <span className="font-serif text-xl sm:text-2xl tracking-wide text-black block">
                    L’Hermine et le Vair
                  </span>
                  <span className="font-sans text-[9px] tracking-[0.22em] uppercase text-taupe block mt-0.5">
                    Paris · Haute Fourrure
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label={isFr ? 'Fermer le menu' : 'Close menu'}
                  className="p-2 -mr-2 text-charcoal hover:text-black hover:rotate-90 transition-all duration-200"
                >
                  <X className="w-6 h-6 stroke-[1.5]" />
                </button>
              </div>

              {/* Section 1: Les Collections de Haute Fourrure (8 pièces maîtresses) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-sans tracking-[0.24em] text-gold font-semibold">
                    {isFr ? 'Les Collections d’Apparat' : 'Haute Fur Collections'}
                  </span>
                  <Link
                    href={`/${locale}/collections`}
                    className="text-[11px] uppercase tracking-[0.14em] text-charcoal hover:text-black font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>{isFr ? 'Tout voir' : 'View all'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="divide-y divide-charcoal/10 border-y border-charcoal/10">
                  {MAIN_COLLECTIONS.map((cat) => {
                    const targetHref = `/${locale}${isFr ? cat.hrefFr : cat.hrefEn}`;
                    return (
                      <Link
                        key={cat.hrefFr}
                        href={targetHref}
                        className="group py-2.5 flex items-center justify-between hover:translate-x-1.5 transition-transform"
                      >
                        <div>
                          <div className="font-serif text-sm sm:text-base text-black group-hover:text-gold transition-colors">
                            {isFr ? cat.labelFr : cat.labelEn}
                          </div>
                          <p className="text-[11px] text-charcoal/70 font-sans mt-0.5">
                            {isFr ? cat.descFr : cat.descEn}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-charcoal/40 group-hover:text-gold transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Accessoires & Coiffes de Fourrure (5 pièces) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-sans tracking-[0.24em] text-gold font-semibold">
                    {isFr ? 'Coiffes & Accessoires Rares' : 'Rare Headwear & Accessories'}
                  </span>
                  <Link
                    href={`/${locale}/collections/accessoires`}
                    className="text-[11px] uppercase tracking-[0.14em] text-charcoal hover:text-black font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>{isFr ? 'Accessoires' : 'Accessories'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="divide-y divide-charcoal/10 border-y border-charcoal/10">
                  {ACCESSORIES_COLLECTIONS.map((cat) => {
                    const targetHref = `/${locale}${isFr ? cat.hrefFr : cat.hrefEn}`;
                    return (
                      <Link
                        key={cat.hrefFr}
                        href={targetHref}
                        className="group py-2.5 flex items-center justify-between hover:translate-x-1.5 transition-transform"
                      >
                        <div>
                          <div className="font-serif text-sm sm:text-base text-black group-hover:text-gold transition-colors">
                            {isFr ? cat.labelFr : cat.labelEn}
                          </div>
                          <p className="text-[11px] text-charcoal/70 font-sans mt-0.5">
                            {isFr ? cat.descFr : cat.descEn}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-charcoal/40 group-hover:text-gold transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: La Maison & Savoir-Faire */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-sans tracking-[0.24em] text-taupe font-semibold block">
                  {isFr ? 'La Maison & Savoir-Faire' : 'The Maison & Craftsmanship'}
                </span>

                <nav className="space-y-2.5">
                  {MAISON_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={`/${locale}${item.href}`}
                      className="block text-xs uppercase tracking-[0.16em] text-charcoal hover:text-black hover:translate-x-1 transition-all"
                    >
                      {isFr ? item.labelFr : item.labelEn}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Section 3: Conciergerie Privée */}
              <div className="p-4 bg-charcoal/5 border border-charcoal/10 rounded-none space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-serif font-medium text-black">
                  <Calendar className="w-4 h-4 text-gold" />
                  <span>{isFr ? 'Rendez-Vous Privé en Salon' : 'Private Salon Appointment'}</span>
                </div>
                <p className="text-[11px] text-charcoal/80 leading-relaxed font-sans">
                  {isFr
                    ? 'Essayages sur-mesure et présentation privée au salon du 15 Rue de la Paix, 75002 Paris.'
                    : 'Bespoke fittings and private collection viewing at our salon on 15 Rue de la Paix, 75002 Paris.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-4 text-xs">
                  <Link
                    href={`/${locale}/client-services/contact`}
                    className="text-black font-semibold uppercase tracking-wider text-[10px] underline underline-offset-4 hover:text-gold transition-colors"
                  >
                    {isFr ? 'Prendre rendez-vous →' : 'Book appointment →'}
                  </Link>
                  <Link
                    href={`/${locale}/client-services/tailles`}
                    className="text-charcoal hover:text-black uppercase tracking-wider text-[10px]"
                  >
                    {isFr ? 'Guide des silhouettes' : 'Size guide'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Footer */}
            <div className="pt-6 mt-6 border-t border-charcoal/15 space-y-3 text-xs tracking-wider">
              <div className="flex items-center justify-between text-charcoal text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-taupe" />
                  <span>+33 1 42 68 00 00</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-taupe" />
                  <span>Paris, Place Vendôme</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-charcoal/10">
                <span className="text-charcoal">{isFr ? 'Langue :' : 'Language:'}</span>
                <Link
                  href={switchLocaleHref}
                  className="px-3 py-1 border border-charcoal/30 text-black font-semibold uppercase tracking-wider hover:bg-black hover:text-ivory transition-colors text-[11px]"
                >
                  {otherLocaleLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
