import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Scissors, Eye, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';
import { buildBreadcrumbJsonLd, buildAboutPageJsonLd } from '@/lib/seo/jsonld';

interface SavoirFairePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: SavoirFairePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  const title = isEn
    ? "Savoir-Faire & Artisanat d'Art | Haute Fourrure | L'Hermine et le Vair"
    : "Savoir-Faire & Artisanat d'Art | Haute Fourrure | L'Hermine et le Vair";

  const description = isEn
    ? "Explore Parisian furrier craftsmanship: pelt matching, the stranding technique, and bespoke hand-stitching in our Rue de la Paix atelier."
    : "Découvrez les secrets de l'artisanat fourreur parisien : assortiment des peaux, galonnage en allongé et confection sur-mesure.";

  return {
    title,
    description,
    alternates: generateAlternates('/maison/savoir-faire', locale),
  };
}

export default async function SavoirFairePage({ params }: SavoirFairePageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'The Maison' : 'La Maison', href: `/${locale}/maison` },
    { label: isEn ? 'Savoir-Faire' : 'Savoir-Faire', href: `/${locale}/maison/savoir-faire` },
  ];

  const steps = [
    {
      num: '01',
      title: isEn ? 'The Sorting & Light Examination' : 'L’Assortiment & La Lumière du Nord',
      desc: isEn
        ? 'Under constant northern skylight, master artisans examine hundreds of pelts to find the exact tone, density, and nap length that will form a single uniform canvas.'
        : 'Sous la verrière orientée au nord, nos artisans examinent des centaines de peaux pour sélectionner celles dont la nuance, la hauteur de poil et la souplesse sont rigoureusement identiques.',
      icon: Eye,
    },
    {
      num: '02',
      title: isEn ? 'Precision Cutting & Stranding' : 'Le Galonnage & La Coupe en Allongé',
      desc: isEn
        ? 'The furrier cuts each pelt into millimeter-wide diagonal ribbons, which are repositioned and re-stitched with silk thread to yield unbroken, liquid fluid silhouettes.'
        : 'La peau est découpée en biseaux de quelques millimètres, puis réassemblée à la main avec un fil de soie pour donner au manteau une fluidité incomparable, sans rupture visuelle.',
      icon: Scissors,
    },
    {
      num: '03',
      title: isEn ? 'Haute Couture Finishing & Lyon Silk' : 'Le Montage & La Soie Lyonnaise',
      desc: isEn
        ? 'Each piece is shaped over bespoke body canvases and hand-lined with heavy silk woven in Lyon, finished with invisible hand-sewn button loops.'
        : 'Chaque création est montée sur mesure et doublée de crêpe de soie lourd tissé à Lyon, avec des boutonnières façon cordonnet confectionnées à l’aiguille.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-4 text-center max-w-3xl mx-auto pt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Handcrafted in Paris' : 'Façonné à la Main à Paris'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'Master Furrier Craftsmanship' : 'Le Savoir-Faire d’Exception'}
          </h1>
          <p className="font-sans text-base text-muted font-light leading-relaxed">
            {isEn
              ? 'Over eighty hours of patient handwork are devoted to every creation, preserving ancestral Parisian techniques recognized as living cultural heritage.'
              : 'Plus de quatre-vingts heures d’ouvrage patient président à chaque pièce, perpétuant des gestes centenaires d’artisanat d’art.'}
          </p>
        </header>

        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface border border-border">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=85"
            alt="Atelier Parisien"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Steps */}
        <div className="space-y-8 pt-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 p-8 bg-surface border border-border items-start"
              >
                <div className="md:col-span-2 flex items-center gap-3">
                  <span className="font-serif text-3xl text-gold font-light">{step.num}</span>
                  <div className="p-2 bg-background border border-border text-gold">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="md:col-span-10 space-y-2">
                  <h2 className="font-serif text-xl sm:text-2xl text-primary font-normal">
                    {step.title}
                  </h2>
                  <p className="font-sans text-sm sm:text-base text-muted leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sub-silo Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          <Link
            href={`/${locale}/maison/savoir-faire/atelier`}
            className="p-6 bg-surface border border-border hover:border-gold transition-colors space-y-2 group"
          >
            <h3 className="font-serif text-lg text-primary group-hover:text-gold flex items-center justify-between">
              <span>{isEn ? 'The Rue de la Paix Atelier' : 'L’Atelier Rue de la Paix'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="font-sans text-xs text-muted font-light">
              {isEn
                ? 'Step behind closed doors into our historic Paris workshop.'
                : 'Pénétrez dans l’intimité de nos ateliers historiques parisiens.'}
            </p>
          </Link>

          <Link
            href={`/${locale}/maison/savoir-faire/artisanat`}
            className="p-6 bg-surface border border-border hover:border-gold transition-colors space-y-2 group"
          >
            <h3 className="font-serif text-lg text-primary group-hover:text-gold flex items-center justify-between">
              <span>{isEn ? 'Ancestral Gestures & Tools' : 'Les Outils & Gestes Ancestraux'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="font-sans text-xs text-muted font-light">
              {isEn
                ? 'Wooden forms, brass calipers, and hand-ground blades.'
                : 'Formes de bois, compas de laiton et lames affûtées au cuir.'}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
