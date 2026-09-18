import React from 'react';
import Link from 'next/link';

export interface FooterProps {
  locale: 'fr' | 'en';
}

export function Footer({ locale }: FooterProps) {
  const isFr = locale === 'fr';

  return (
    <footer className="bg-black text-ivory pt-16 pb-24 md:pb-16 border-t border-charcoal/30 w-full max-w-full overflow-x-clip">
      <div className="max-w-site mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-ivory/10">
          {/* Col 1: Brand & Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl tracking-wider text-ivory">
              L’Hermine et le Vair
            </h3>
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-taupe">
              Paris · Haute Fourrure d’Exception
            </p>
            <p className="text-xs text-ivory/70 leading-relaxed max-w-sm pt-2">
              {isFr
                ? "Maison parisienne dédiée à la haute confection de pièces rares et précieuses. L'harmonie parfaite entre noblesse des matières, savoir-faire d'atelier et élégance intemporelle."
                : 'Parisian luxury house dedicated to the bespoke tailoring of rare and precious garments. A timeless synthesis of noble materials, artisanal craftsmanship, and quiet refinement.'}
            </p>
            <div className="pt-2 text-xs text-ivory/60 space-y-1">
              <p>Atelier Privé: 15 Rue de la Paix, 75002 Paris</p>
              <p>Concierge: concierge@lhermineetlevair.com</p>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-[0.18em] text-gold font-semibold">
              {isFr ? 'Collections' : 'Collections'}
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/80">
              <li>
                <Link
                  href={`/${locale}/collections/${isFr ? 'manteau-fourrure-femme' : 'womens-fur-coat'}`}
                  className="hover:text-gold transition-colors"
                >
                  {isFr ? 'Manteau Fourrure Femme' : "Women's Fur Coat"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/collections/${isFr ? 'veste-fourrure-femme' : 'womens-fur-jacket'}`}
                  className="hover:text-gold transition-colors"
                >
                  {isFr ? 'Veste Fourrure Femme' : "Women's Fur Jacket"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/collections/${isFr ? 'cape-fourrure-femme' : 'womens-fur-cape'}`}
                  className="hover:text-gold transition-colors"
                >
                  {isFr ? 'Cape Fourrure Femme' : "Women's Fur Cape"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/collections/${isFr ? 'chapka-fourrure-femme' : 'womens-fur-chapka'}`}
                  className="hover:text-gold transition-colors"
                >
                  {isFr ? 'Chapka Fourrure Femme' : "Women's Fur Chapka"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/collections`}
                  className="hover:text-gold transition-colors"
                >
                  {isFr ? 'Toutes les collections' : 'All Collections'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Maison & Heritage */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-[0.18em] text-gold font-semibold">
              {isFr ? 'La Maison' : 'The Maison'}
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/80">
              <li>
                <Link href={`/${locale}/maison/histoire`} className="hover:text-gold transition-colors">
                  {isFr ? 'Notre Histoire' : 'Our Story'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/maison/savoir-faire`} className="hover:text-gold transition-colors">
                  {isFr ? "Savoir-Faire d'Atelier" : 'Atelier Craftsmanship'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/maison/ethique`} className="hover:text-gold transition-colors">
                  {isFr ? 'Éthique & Traçabilité' : 'Ethics & Traceability'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/journal`} className="hover:text-gold transition-colors">
                  {isFr ? 'Le Journal' : 'The Journal'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/lookbook`} className="hover:text-gold transition-colors">
                  {isFr ? 'Lookbook' : 'Lookbook'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Services Clients */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-[0.18em] text-gold font-semibold">
              {isFr ? 'Services Clients' : 'Client Care'}
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/80">
              <li>
                <Link href={`/${locale}/client-services/livraison`} className="hover:text-gold transition-colors">
                  {isFr ? 'Livraison Sécurisée' : 'Bespoke Delivery'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/client-services/tailles`} className="hover:text-gold transition-colors">
                  {isFr ? 'Guide des Tailles' : 'Size Guide'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/client-services/entretien`} className="hover:text-gold transition-colors">
                  {isFr ? 'Conservation & Entretien' : 'Fur Care & Storage'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/client-services/faq`} className="hover:text-gold transition-colors">
                  {isFr ? 'Foire Aux Questions' : 'FAQ'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-gold transition-colors">
                  {isFr ? 'Contact & Rendez-vous' : 'Contact & Appointments'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Badges and Legal Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-ivory/60">
          <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-wider">
            <Link href={`/${locale}/legal/mentions-legales`} className="hover:text-ivory transition-colors">
              {isFr ? 'Mentions Légales' : 'Legal Notice'}
            </Link>
            <span aria-hidden="true" className="text-ivory/20">·</span>
            <Link href={`/${locale}/legal/confidentialite`} className="hover:text-ivory transition-colors">
              {isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}
            </Link>
            <span aria-hidden="true" className="text-ivory/20">·</span>
            <Link href={`/${locale}/legal/cgv`} className="hover:text-ivory transition-colors">
              {isFr ? 'Conditions Générales de Vente' : 'Terms & Conditions'}
            </Link>
            <span aria-hidden="true" className="text-ivory/20">·</span>
            <Link href={`/${locale}/legal/cookies`} className="hover:text-ivory transition-colors">
              {isFr ? 'Gestion des Cookies' : 'Cookies'}
            </Link>
          </div>

          {/* Payment Method Badges (from spec) */}
          <div className="flex items-center space-x-3 text-[10px] tracking-wider text-ivory/50">
            <span>PAIEMENTS SÉCURISÉS:</span>
            <span className="px-2 py-0.5 border border-ivory/20 font-medium text-ivory/80">VISA</span>
            <span className="px-2 py-0.5 border border-ivory/20 font-medium text-ivory/80">MASTERCARD</span>
            <span className="px-2 py-0.5 border border-ivory/20 font-medium text-ivory/80">AMEX</span>
            <span className="px-2 py-0.5 border border-ivory/20 font-medium text-ivory/80">APPLE PAY</span>
            <span className="px-2 py-0.5 border border-ivory/20 font-medium text-ivory/80">KLARNA</span>
          </div>

          <div>
            © {new Date().getFullYear()} L’Hermine et le Vair. {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}
          </div>
        </div>
      </div>
    </footer>
  );
}
