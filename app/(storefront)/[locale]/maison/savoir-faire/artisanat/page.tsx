import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface ArtisanatPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ArtisanatPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Ancestral Furrier Artistry | Tools & Techniques | L'Hermine et le Vair"
      : "L'Artisanat d'Art Fourreur | Gestes & Outils | L'Hermine et le Vair",
    description: isEn
      ? "Discover the rare hand tools, brass gauges, and historic gestures that shape high fur into timeless silhouettes."
      : "Découvrez les outils d'artisanat d'art, compas de laiton et gestes séculaires qui sculptent la haute fourrure.",
    alternates: generateAlternates('/maison/savoir-faire/artisanat', locale),
  };
}

export default async function ArtisanatPage({ params }: ArtisanatPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'The Maison' : 'La Maison', href: `/${locale}/maison` },
    { label: isEn ? 'Savoir-Faire' : 'Savoir-Faire', href: `/${locale}/maison/savoir-faire` },
    { label: isEn ? 'Artisanship' : 'Artisanat d’Art', href: `/${locale}/maison/savoir-faire/artisanat` },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <Link
          href={`/${locale}/maison/savoir-faire`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? 'Back to Savoir-Faire' : 'Retour au Savoir-Faire'}</span>
        </Link>

        <header className="space-y-4 text-center max-w-2xl mx-auto pt-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Living Heritage' : 'Patrimoine Vivant'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'Ancestral Gestures & Tools' : 'Gestes & Outils Ancestraux'}
          </h1>
        </header>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface border border-border">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=85"
            alt="Outils de maître fourreur"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <div className="prose prose-lg max-w-none text-muted font-light space-y-6">
          <p className="text-base sm:text-lg leading-relaxed">
            {isEn
              ? 'Unlike standard apparel manufacturing, high fur remains entirely sculpted by hand. The furrier works with curved blades stropped on leather, bone folders, and antique brass needles designed to guide natural fibers without ever puncturing the skin prematurely.'
              : 'À l’opposé de la confection textile sérielle, la haute fourrure demeure intégralement sculptée à la main. Le fourreur manie le tranchet au tranchant rasoir entretenu au cuir, le plioir en os et des aiguilles d’acier poli qui guident la matière sans jamais meurtrir le duvet.'}
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            {isEn
              ? 'The master artisan develops an instinctive tactile memory. Blindfolded, they can discern the geographical origin and density of a pelt solely through the tip of their fingers. This irreplaceable human mastery is what defines true luxury.'
              : 'Le maître artisan développe une mémoire tactile instinctive. Les yeux fermés, il est capable de distinguer l’origine géographique et la souplesse d’une peau par le seul effleurement de ses doigts. Cette maestria humaine irremplaçable constitue l’essence même du luxe véritable.'}
          </p>
        </div>
      </div>
    </div>
  );
}
