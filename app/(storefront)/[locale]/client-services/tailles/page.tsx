import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Ruler } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SizeGuideView } from '@/components/storefront/SizeGuideView';
import { generateAlternates } from '@/lib/seo/hreflang';

interface TaillesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: TaillesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Size & Measurements Guide | Haute Fourrure | L'Hermine et le Vair"
      : "Guide des Tailles & Mesures | Haute Fourrure | L'Hermine et le Vair",
    description: isEn
      ? "International size conversion table and silhouette measurement instructions for coats, capes, and bespoke furs."
      : "Tableaux de conversion internationale et conseils de prise de mesures pour manteaux, capes et pièces de fourrure d'exception.",
    alternates: generateAlternates('/client-services/tailles', locale),
  };
}

export default async function TaillesPage({ params }: TaillesPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Client Services' : 'Services Clientèle', href: `/${locale}/client-services` },
    { label: isEn ? 'Size Guide' : 'Guide des Tailles', href: `/${locale}/client-services/tailles` },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-4 text-center max-w-2xl mx-auto pt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Silhouette & Proportion' : 'Silhouette & Proportions'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'Size & Measurements Guide' : 'Guide des Tailles & Mesures'}
          </h1>
          <p className="font-sans text-base text-muted font-light leading-relaxed">
            {isEn
              ? 'Find your ideal fit with our international size conversion chart and precision measurement tables.'
              : 'Trouvez la coupe parfaite grâce à nos correspondances internationales et mesures de référence.'}
          </p>
        </header>

        <SizeGuideView locale={locale} />

        <div className="text-center pt-4">
          <Link
            href={`/${locale}/client-services/tailles/guide-des-mesures`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:underline font-medium"
          >
            <span>{isEn ? 'How to take your measurements' : 'Comment prendre vos mesures avec précision'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
