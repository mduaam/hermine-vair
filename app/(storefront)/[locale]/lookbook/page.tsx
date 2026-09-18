import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface LookbookPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: LookbookPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Lookbook & Silhouettes d'Exception | L'Hermine et le Vair"
      : "Lookbook & Silhouettes d'Exception | L'Hermine et le Vair",
    description: isEn
      ? "Discover our seasonal lookbook: bespoke mink coats, silver fox capes, and imperial cashmere captured in Paris."
      : "Parcourez le lookbook de la Maison : manteaux de vison d'exception, capes en renard et silhouettes capturées à Paris.",
    alternates: generateAlternates('/lookbook', locale),
  };
}

export default async function LookbookPage({ params }: LookbookPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Lookbook' : 'Lookbook', href: `/${locale}/lookbook` },
  ];

  const looks = [
    {
      title: isEn ? 'Look I — Midnight Mink & Lyon Silk' : 'Silhouette I — Vison Minuit & Soie Lyonnaise',
      desc: isEn
        ? 'Full-length coat in deep black Saga Furs mink, paired with heavy black silk lining.'
        : 'Grand manteau en vison noir intense Saga Furs, doublure en crêpe de soie lourd.',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
      href: isEn ? '/en/collections/coats/fur-coats' : '/fr/collections/manteaux/manteaux-de-fourrure',
    },
    {
      title: isEn ? 'Look II — Silver Fox Evening Stole' : 'Silhouette II — Étole Renard Argenté du Soir',
      desc: isEn
        ? 'Voluminous silver fox stole with natural tipped contrast, draped over an evening gown.'
        : 'Étole généreuse en renard argenté naturel aux pointes contrastées sur robe de gala.',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
      href: isEn ? '/en/collections/capes' : '/fr/collections/capes',
    },
    {
      title: isEn ? 'Look III — Imperial Cashmere & Fur Trim' : 'Silhouette III — Cape Cachemire Impérial Bordée',
      desc: isEn
        ? 'Pure unbleached double-face cashmere cape with sculpted fur trim.'
        : 'Cape en pur cachemire double-face écru bordée de fourrure sculptée.',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85',
      href: isEn ? '/en/collections/coats/cashmere-coats' : '/fr/collections/manteaux/manteaux-en-cachemire',
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-4 text-center max-w-2xl mx-auto pt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Collection Parisienne' : 'Collection Parisienne'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'The Lookbook' : 'Le Lookbook d’Exception'}
          </h1>
          <p className="font-sans text-base text-muted font-light leading-relaxed">
            {isEn
              ? 'An exploration of liquid drapes, contrast textures, and timeless Parisian presence.'
              : 'Une symphonie de volumes fluides, de textures rares et de pureté architecturale.'}
          </p>
        </header>

        <div className="space-y-16">
          {looks.map((look, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-surface border border-border p-6 lg:p-10 ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-background">
                <Image
                  src={look.image}
                  alt={look.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest text-gold font-medium">
                    Look 0{i + 1}
                  </span>
                  <h2 className="font-serif text-2xl text-primary font-normal">{look.title}</h2>
                  <p className="font-sans text-sm text-muted font-light leading-relaxed">
                    {look.desc}
                  </p>
                </div>

                <Link
                  href={look.href}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background text-xs uppercase tracking-widest font-medium hover:bg-gold hover:text-primary transition-colors"
                >
                  <span>{isEn ? 'View Pieces' : 'Découvrir la Pièce'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
