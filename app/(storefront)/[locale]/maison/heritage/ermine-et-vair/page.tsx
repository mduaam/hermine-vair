import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface ErmineEtVairPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ErmineEtVairPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "The Legend of Ermine & Vair | Heraldry & Literature | L'Hermine et le Vair"
      : "La Légende de l'Hermine et du Vair | Héraldique & Poésie | L'Hermine et le Vair",
    description: isEn
      ? "Unraveling the poetic origins: from Cinderella's slipper of vair to the ermine coats of Anne of Brittany."
      : "Aux origines poétiques : de la pantoufle de vair de Cendrillon aux manteaux d'hermine d'Anne de Bretagne.",
    alternates: generateAlternates('/maison/heritage/ermine-et-vair', locale),
  };
}

export default async function ErmineEtVairPage({ params }: ErmineEtVairPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'The Maison' : 'La Maison', href: `/${locale}/maison` },
    { label: isEn ? 'Heritage' : 'Héritage', href: `/${locale}/maison/heritage` },
    { label: isEn ? 'Ermine & Vair' : 'L’Hermine et le Vair', href: `/${locale}/maison/heritage/ermine-et-vair` },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <Link
          href={`/${locale}/maison/heritage`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? 'Back to Heritage' : 'Retour à l’Héritage'}</span>
        </Link>

        <header className="space-y-4 text-center max-w-2xl mx-auto pt-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Poetics & Heraldry' : 'Poétique & Héraldique'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'The Legend of Ermine & Vair' : 'L’Hermine et le Vair'}
          </h1>
        </header>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface border border-border">
          <Image
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=85"
            alt="Légende de l'Hermine et du Vair"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <div className="prose prose-lg max-w-none text-muted font-light space-y-6">
          <p className="text-base sm:text-lg leading-relaxed">
            {isEn
              ? 'L’Hermine (Ermine) and le Vair are two emblematic furs steeped in European myth. Ermine, celebrated by the motto of the Duchy of Brittany (“Potius mori quam foedari” — Rather death than dishonor), stands for untarnished integrity because the stoat supposedly chose death over dirtying its pristine winter coat.'
              : 'L’Hermine et le Vair incarnent deux sommets de la symbolique européenne. L’hermine, immortalisée par la devise bretonne « Plutôt la mort que la souillure », représente l’intégrité absolue : selon la légende, l’animal préférait périr plutôt que de salir la blancheur immaculée de son pelage hivernal.'}
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            {isEn
              ? 'Le Vair, the delicate blue-grey and white pelt of the northern squirrel, was woven into literary history through Charles Perrault’s original fairytale, where Cinderella wore slippers of genuine vair—a luxurious fur fitting for a queen before later transcriptions transformed it into glass.'
              : 'Le Vair, précieux pelage aux reflets gris-bleutés et blancs de l’écureuil nordique petit-gris, a traversé l’histoire littéraire à travers le conte originel de Charles Perrault : Cendrillon y portait des pantoufles de vair, symbole d’un luxe aristocratique réservé aux princes, avant que la tradition populaire ne confonde le vair et le verre.'}
          </p>
        </div>
      </div>
    </div>
  );
}
