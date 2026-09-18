import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface LegalNoticeProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: LegalNoticeProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Legal Notice | L'Hermine et le Vair Paris"
      : "Mentions Légales | L'Hermine et le Vair Paris",
    description: isEn
      ? "Company information, publisher identification, and hosting provider for L'Hermine et le Vair."
      : "Informations légales, éditeur du site et hébergement de la Maison L'Hermine et le Vair.",
    alternates: generateAlternates('/legal/mentions-legales', locale),
  };
}

export default async function LegalNoticePage({ params }: LegalNoticeProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Legal Notice' : 'Mentions Légales', href: `/${locale}/legal/mentions-legales` },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-4 pt-4">
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-wide">
            {isEn ? 'Legal Notice' : 'Mentions Légales'}
          </h1>
        </header>

        <div className="prose prose-lg max-w-none text-muted font-light space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-xl text-primary font-normal">
              {isEn ? '1. Site Publisher' : '1. Éditeur du Site'}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              <strong>L’Hermine et le Vair SAS</strong>
              <br />
              Société par Actions Simplifiée au capital de 250 000 €<br />
              Siège social : 15 Rue de la Paix, 75002 Paris, France
              <br />
              RCS Paris B 892 411 092 · N° TVA Intracommunautaire : FR 48 892411092
              <br />
              Directeur de la publication : Direction Générale
              <br />
              Courriel : concierge@lhermineetlevair.com · Tél : +33 (0)1 42 68 00 00
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-primary font-normal">
              {isEn ? '2. Hosting' : '2. Hébergement'}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Ce site est hébergé par Netlify Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, USA.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-primary font-normal">
              {isEn ? '3. Intellectual Property' : '3. Propriété Intellectuelle'}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              L’ensemble des éléments graphiques, photographies, textes et modèles présentés sur ce site constituent des œuvres protégées par le droit d’auteur et la propriété industrielle de la Maison L’Hermine et le Vair. Toute reproduction intégrale ou partielle sans accord préalable est strictement interdite.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
