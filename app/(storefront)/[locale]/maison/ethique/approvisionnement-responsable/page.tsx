import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface ResponsibleSourcingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ResponsibleSourcingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Responsible Fur Sourcing & Welfare Protocols | L'Hermine et le Vair"
      : "Approvisionnement Responsable & Bien-Être Animal | L'Hermine et le Vair",
    description: isEn
      ? "Discover our transparent supply chain: Saga Furs certifications, WelFur scientific standards, and ethical French dressing."
      : "Découvrez notre filière d'approvisionnement responsable : labels Saga Furs, standards scientifiques WelFur et tannage français.",
    alternates: generateAlternates('/maison/ethique/approvisionnement-responsable', locale),
  };
}

export default async function ResponsibleSourcingPage({ params }: ResponsibleSourcingPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'The Maison' : 'La Maison', href: `/${locale}/maison` },
    { label: isEn ? 'Ethics' : 'Éthique', href: `/${locale}/maison/ethique` },
    { label: isEn ? 'Responsible Sourcing' : 'Approvisionnement Responsable', href: `/${locale}/maison/ethique/approvisionnement-responsable` },
  ];

  const standards = [
    {
      title: isEn ? 'WelFur Scientific Assessment' : 'Protocole Scientifique WelFur',
      desc: isEn
        ? 'Developed by independent veterinary universities across Europe, measuring animal housing, nutrition, health, and species-appropriate behavior.'
        : 'Élaboré par des universités vétérinaires européennes indépendantes, évaluant le logement, l’alimentation, la santé et le comportement naturel des animaux.',
    },
    {
      title: isEn ? 'Saga Furs Certified Auctions' : 'Filière d’Enchères Certifiée Saga Furs',
      desc: isEn
        ? 'Pelts are strictly purchased through audited Nordic auctions guaranteeing 100% farm traceability back to origin.'
        : 'Peaux acquises exclusivement via des maisons d’enchères nordiques auditées, garantissant une traçabilité totale jusqu’à la ferme d’origine.',
    },
    {
      title: isEn ? 'Certified REACH Chemical Safety' : 'Respect Absolu des Normes REACH',
      desc: isEn
        ? 'All skin preservation and conditioning adhere to strict European REACH directives, prohibiting toxic chemicals and heavy metals.'
        : 'Tous les traitements de conservation respectent la réglementation européenne REACH, bannissant les substances toxiques et les métaux lourds.',
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <Link
          href={`/${locale}/maison/ethique`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? 'Back to Ethics' : 'Retour à l’Éthique'}</span>
        </Link>

        <header className="space-y-4 text-center max-w-2xl mx-auto pt-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Scientific Integrity' : 'Intégrité Scientifique'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'Responsible Sourcing Protocols' : 'Approvisionnement Responsable'}
          </h1>
        </header>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface border border-border">
          <Image
            src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=85"
            alt="Approvisionnement responsable fourrure"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <div className="space-y-6 pt-4">
          {standards.map((s, idx) => (
            <div key={idx} className="p-6 bg-surface border border-border flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <h2 className="font-serif text-lg text-primary font-normal">{s.title}</h2>
                <p className="font-sans text-sm text-muted font-light leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
