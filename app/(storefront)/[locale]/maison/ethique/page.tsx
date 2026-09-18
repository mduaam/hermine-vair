import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, FileCheck, Globe, Scale } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface EthiquePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: EthiquePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Ethics, Furmark® & International Compliance | L'Hermine et le Vair"
      : "Éthique, Traçabilité Furmark® & Réglementations | L'Hermine et le Vair",
    description: isEn
      ? "Our uncompromising commitment to animal welfare, Furmark® certified natural furs, and transparent international legal compliance."
      : "Notre engagement absolu pour le bien-être animal, la traçabilité Furmark® et la conformité légale internationale.",
    alternates: generateAlternates('/maison/ethique', locale),
  };
}

export default async function EthiquePage({ params }: EthiquePageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'The Maison' : 'La Maison', href: `/${locale}/maison` },
    { label: isEn ? 'Ethics & Traceability' : 'Éthique & Traçabilité', href: `/${locale}/maison/ethique` },
  ];

  const commitments = [
    {
      title: isEn ? 'Furmark® Global Certification' : 'Certification Mondiale Furmark®',
      desc: isEn
        ? '100% of our natural pelts carry Furmark® certification, ensuring strict, science-based animal welfare standards, independent third-party audits, and complete digital blockchain traceability from origin to finished coat.'
        : '100% de nos fourrures naturelles sont certifiées Furmark®, garantissant les protocoles scientifiques les plus stricts en matière de bien-être animal, des audits tiers indépendants et une traçabilité numérique intégrale.',
      icon: ShieldCheck,
    },
    {
      title: isEn ? 'Eco-Conscious Dressing & Biodegradability' : 'Tannage Écologique & Biodégradabilité',
      desc: isEn
        ? 'Unlike petroleum-based synthetic faux-furs that shed microplastics and persist for centuries in landfills, genuine natural fur is an organic, fully biodegradable material treated with non-toxic, eco-responsible vegetable dressing.'
        : 'À l’opposé des matières synthétiques issues de la pétrochimie qui polluent les océans de microplastiques, la vraie fourrure est une matière naturelle 100% biodégradable, traitée selon des procédés de tannage végétal éco-responsables.',
      icon: FileCheck,
    },
    {
      title: isEn ? 'CITES & Legal Transparency' : 'Conformité CITES & Législation',
      desc: isEn
        ? 'We rigorously enforce international conventions (CITES) and comply fully with national regulations worldwide, including regional restrictions across specific jurisdictions.'
        : 'Nous respectons scrupuleusement la convention de Washington (CITES) et appliquons les réglementations spécifiques de chaque juridiction internationale avec une transparence totale.',
      icon: Scale,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-4 text-center max-w-3xl mx-auto pt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Responsibility & Transparency' : 'Responsabilité & Transparence'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'Ethics & Traceability' : 'Éthique, Traçabilité & Engagements'}
          </h1>
          <p className="font-sans text-base text-muted font-light leading-relaxed">
            {isEn
              ? 'True luxury demands unwavering integrity. Discover how L’Hermine et le Vair champions scientific welfare protocols and verified sustainable sourcing.'
              : 'L’élégance authentique repose sur une intégrité sans faille. Découvrez les standards scientifiques stricts et la traçabilité intégrale qui régissent chaque création.'}
          </p>
        </header>

        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface border border-border">
          <Image
            src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=85"
            alt="Éthique et traçabilité de la fourrure"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Commitments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {commitments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-8 bg-surface border border-border space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="p-3 bg-background border border-border text-gold w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl text-primary font-normal">
                    {item.title}
                  </h2>
                  <p className="font-sans text-sm text-muted leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sub-silo Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          <Link
            href={`/${locale}/maison/ethique/approvisionnement-responsable`}
            className="p-6 bg-surface border border-border hover:border-gold transition-colors space-y-2 group"
          >
            <h3 className="font-serif text-lg text-primary group-hover:text-gold flex items-center justify-between">
              <span>{isEn ? 'Responsible Sourcing Protocols' : 'Approvisionnement Responsable'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="font-sans text-xs text-muted font-light">
              {isEn
                ? 'Saga Furs, Kopenhagen Fur archives, and European farm welfare certifications.'
                : 'Filières Saga Furs, élevages européens certifiés et audits vétérinaires tiers.'}
            </p>
          </Link>

          <Link
            href={`/${locale}/maison/ethique/reglementation-fourrure`}
            className="p-6 bg-surface border border-border hover:border-gold transition-colors space-y-2 group"
          >
            <h3 className="font-serif text-lg text-primary group-hover:text-gold flex items-center justify-between">
              <span>{isEn ? 'International Fur Regulations' : 'Réglementation Internationale'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="font-sans text-xs text-muted font-light">
              {isEn
                ? 'Legal transparency: US California AB 44, UK standards, and CITES guidelines.'
                : 'Transparence juridique : loi californienne AB 44, normes UE et conventions CITES.'}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
