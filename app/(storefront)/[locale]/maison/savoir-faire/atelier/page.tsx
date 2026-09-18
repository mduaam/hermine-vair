import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface AtelierPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: AtelierPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "The Paris Atelier | 15 Rue de la Paix | L'Hermine et le Vair"
      : "L'Atelier Parisien | 15 Rue de la Paix | L'Hermine et le Vair",
    description: isEn
      ? "Behind the doors of our historic atelier on Rue de la Paix in Paris: where haute fourrure heirlooms are brought to life."
      : "Dans l'intimité de notre atelier de la Rue de la Paix à Paris : lieu de création où prennent vie nos pièces de haute fourrure.",
    alternates: generateAlternates('/maison/savoir-faire/atelier', locale),
  };
}

export default async function AtelierPage({ params }: AtelierPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'The Maison' : 'La Maison', href: `/${locale}/maison` },
    { label: isEn ? 'Savoir-Faire' : 'Savoir-Faire', href: `/${locale}/maison/savoir-faire` },
    { label: isEn ? 'The Atelier' : 'L’Atelier', href: `/${locale}/maison/savoir-faire/atelier` },
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
            {isEn ? '15 Rue de la Paix • Paris II' : '15 Rue de la Paix • Paris II'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'The Parisian Atelier' : 'L’Atelier Parisien'}
          </h1>
        </header>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface border border-border">
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85"
            alt="Atelier L'Hermine et le Vair Rue de la Paix"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <div className="prose prose-lg max-w-none text-muted font-light space-y-6">
          <p className="text-base sm:text-lg leading-relaxed">
            {isEn
              ? 'Perched on the top floor of an 18th-century hôtel particulier on Rue de la Paix, our workshop is bathed in constant, unfiltered northern light. Here, silence is broken only by the rhythmic hum of shears and the whispering rustle of fine Lyon silks.'
              : 'Niché sous les toits d’un hôtel particulier du XVIIIe siècle de la Rue de la Paix, notre atelier bénéficie d’une lumière constante venue du nord. Ici, le silence n’est troublé que par le souffle régulier des ciseaux et le froissement discret des soies lyonnaises.'}
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            {isEn
              ? 'Every bench is manned by artisans trained in the rarest techniques of the Parisian fur guild. Pieces are not hurried: each client commission is treated as a unique bespoke artwork, crafted with dedication to perpetuate heritage luxury.'
              : 'Chaque établi est occupé par un artisan formé aux techniques les plus rigoureuses de la corporation parisienne. Aucune création n’est précipitée : chaque commande est envisagée comme une œuvre singulière, conçue pour traverser les générations.'}
          </p>
        </div>
      </div>
    </div>
  );
}
