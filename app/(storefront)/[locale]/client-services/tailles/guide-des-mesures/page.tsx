import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Ruler } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface GuideMesuresPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: GuideMesuresPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "How to Take Your Measurements | Silhouette Guide | L'Hermine et le Vair"
      : "Comment Prendre Vos Mesures | Guide Silhouette | L'Hermine et le Vair",
    description: isEn
      ? "Step-by-step instructions on measuring your bust, waist, hips, and sleeve length for fine outerwear."
      : "Instructions pas à pas pour mesurer votre tour de poitrine, taille, bassin et longueur de manche pour une silhouette parfaite.",
    alternates: generateAlternates('/client-services/tailles/guide-des-mesures', locale),
  };
}

export default async function GuideMesuresPage({ params }: GuideMesuresPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Client Services' : 'Services Clientèle', href: `/${locale}/client-services` },
    { label: isEn ? 'Size Guide' : 'Guide des Tailles', href: `/${locale}/client-services/tailles` },
    { label: isEn ? 'Measurements Guide' : 'Guide des Mesures', href: `/${locale}/client-services/tailles/guide-des-mesures` },
  ];

  const steps = [
    {
      title: isEn ? '1. Bust / Chest' : '1. Tour de Poitrine',
      desc: isEn
        ? 'Place the measuring tape horizontally around the fullest part of your bust, keeping the tape straight across the back shoulder blades.'
        : 'Passez le mètre ruban horizontalement à l’endroit le plus fort de la poitrine, en veillant à ce qu’il reste bien droit dans le dos.',
    },
    {
      title: isEn ? '2. Natural Waist' : '2. Tour de Taille',
      desc: isEn
        ? 'Measure around the narrowest natural indentation of your waist, slightly above the navel, without pulling tight.'
        : 'Mesurez au creux naturel de la taille, juste au-dessus du nombril, en conservant une aisance naturelle sans serrer.',
    },
    {
      title: isEn ? '3. Hips & Seat' : '3. Tour de Bassin',
      desc: isEn
        ? 'Standing with heels together, measure around the fullest point of your hips and buttocks.'
        : 'Debout, pieds joints, faites passer le ruban autour de la partie la plus généreuse des hanches et fessiers.',
    },
    {
      title: isEn ? '4. Sleeve Length' : '4. Longueur de Manche',
      desc: isEn
        ? 'From the tip of the shoulder bone down along the outer arm to just past the wrist bone.'
        : 'De la pointe de l’épaule jusqu’au niveau du poignet, le bras légèrement fléchi.',
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <Link
          href={`/${locale}/client-services/tailles`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? 'Back to Size Guide' : 'Retour au Guide des Tailles'}</span>
        </Link>

        <header className="space-y-4 text-center max-w-2xl mx-auto pt-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Artisan Precision' : 'Précision d’Atelier'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'How to Take Your Measurements' : 'Comment Prendre Vos Mesures'}
          </h1>
        </header>

        <div className="space-y-6 pt-4">
          {steps.map((st, i) => (
            <div key={i} className="p-6 bg-surface border border-border space-y-2">
              <h2 className="font-serif text-lg text-primary font-normal">{st.title}</h2>
              <p className="font-sans text-sm text-muted font-light leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
