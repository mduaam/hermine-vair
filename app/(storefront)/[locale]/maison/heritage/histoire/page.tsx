import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface HistoirePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: HistoirePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Chronicle of the Maison | History | L'Hermine et le Vair"
      : "La Chronique de la Maison | Histoire | L'Hermine et le Vair",
    description: isEn
      ? "Journey through the milestones and heritage of L'Hermine et le Vair, preserving French artisan traditions across centuries."
      : "Retracez les grandes étapes de L'Hermine et le Vair, gardienne des traditions d'excellence de l'artisanat français.",
    alternates: generateAlternates('/maison/heritage/histoire', locale),
  };
}

export default async function HistoirePage({ params }: HistoirePageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'The Maison' : 'La Maison', href: `/${locale}/maison` },
    { label: isEn ? 'Heritage' : 'Héritage', href: `/${locale}/maison/heritage` },
    { label: isEn ? 'History' : 'Histoire', href: `/${locale}/maison/heritage/histoire` },
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
            {isEn ? 'A French Dynasty of Excellence' : 'Une Lignée d’Excellence Française'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'The Historical Chronicle' : 'La Chronique Historique'}
          </h1>
        </header>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface border border-border">
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85"
            alt="Chronique historique L'Hermine et le Vair"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <div className="prose prose-lg max-w-none text-muted font-light space-y-6">
          <p className="text-base sm:text-lg leading-relaxed">
            {isEn
              ? 'Founded on a profound passion for exceptional natural materials, L’Hermine et le Vair began as an exclusive private commission atelier in the historic heart of Paris. Generation after generation, master craftsmen passed on patterns, secret stranding cuts, and an unwavering standard of finishing.'
              : 'Née d’une passion dévouée pour les matières naturelles d’exception, L’Hermine et le Vair a vu le jour comme atelier de commandes privées dans le cœur historique de Paris. De génération en génération, les maîtres artisans se sont transmis patrons exclusifs, secrets de coupe et un sens intransigeant de la perfection.'}
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            {isEn
              ? 'Today, our creations continue to be hand-sculpted in the same atelier, uniting the heritage of royal coats with the fluid ease demanded by modern luxury collectors around the globe.'
              : 'Aujourd’hui, nos manteaux continuent d’être façonnés dans le même atelier, conjuguant la prestance des manteaux d’apparat et la fluidité décontractée recherchée par les esthètes du monde entier.'}
          </p>
        </div>
      </div>
    </div>
  );
}
