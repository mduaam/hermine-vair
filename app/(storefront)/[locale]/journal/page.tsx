import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JournalClientView } from '@/components/storefront/JournalClientView';
import { getJournalPosts } from '@/lib/sanity/client';
import { generateAlternates } from '@/lib/seo/hreflang';
import { buildBreadcrumbJsonLd } from '@/lib/seo/jsonld';

interface JournalPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: JournalPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  const title = isEn
    ? "Le Journal | Haute Fourrure, Care Guides & Savoir-Faire | L'Hermine et le Vair"
    : "Le Journal | Haute Fourrure, Conseils d'Entretien & Savoir-Faire | L'Hermine et le Vair";

  const description = isEn
    ? "Explore our editorial magazine: master furrier techniques, couture styling inspirations, and fine fur preservation guides."
    : "Découvrez notre revue éditoriale : secrets d'ateliers, rituels de conservation des fourrures précieuses et inspirations de style parisien.";

  return {
    title,
    description,
    alternates: generateAlternates('/journal', locale),
  };
}

export default async function JournalPage({ params }: JournalPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const posts = await getJournalPosts(locale);

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'The Journal' : 'Le Journal', href: `/${locale}/journal` },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <div className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-3xl mx-auto my-12 lg:my-16 space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Editorial & Savoir-Faire' : 'Éditorial & Savoir-Faire'}
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'The Journal' : 'Le Journal de la Maison'}
          </h1>
          <p className="font-sans text-sm lg:text-base text-muted font-light leading-relaxed">
            {isEn
              ? 'Reflections on timeless craftsmanship, styling guides, and the subtle art of luxury living.'
              : 'Chroniques d’artisanat d’art, rituels d’entretien et inspirations pour célébrer l’élégance intemporelle.'}
          </p>
        </header>

        <JournalClientView posts={posts} locale={locale} />
      </div>
    </div>
  );
}
