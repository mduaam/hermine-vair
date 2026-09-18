import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Crown, Scroll, Landmark } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface HeritagePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: HeritagePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Heritage & Origins | L'Hermine et le Vair"
      : "Héritage & Histoire | L'Hermine et le Vair",
    description: isEn
      ? "The legacy of L'Hermine et le Vair: from medieval royal heraldry and coronation robes to modern Parisian haute fourrure."
      : "L'histoire séculaire de L'Hermine et le Vair : des armoiries royales et manteaux de sacre à la haute fourrure parisienne.",
    alternates: generateAlternates('/maison/heritage', locale),
  };
}

export default async function HeritagePage({ params }: HeritagePageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'The Maison' : 'La Maison', href: `/${locale}/maison` },
    { label: isEn ? 'Heritage & History' : 'Héritage & Histoire', href: `/${locale}/maison/heritage` },
  ];

  const chapters = [
    {
      icon: Crown,
      era: isEn ? 'Middle Ages & Renaissance' : 'Moyen Âge & Renaissance',
      title: isEn ? 'The Royal Fur Heraldry' : 'L’Héraldique des Manteaux Royaux',
      desc: isEn
        ? 'In royal heraldry, ermine (ermine fur with black tail tips) and vair (the silver-grey squirrel fur) were the supreme symbols of sovereignty, dignity, and purity, reserved exclusively for the coronation cloaks of monarchs.'
        : 'Dans l’héraldique médiévale, l’hermine et le vair (fourrure d’écureuil petit-gris) constituaient les fourrures souveraines par excellence, parant les manteaux de sacre des souverains français et européens comme symbole de pureté et d’incorruptibilité.',
    },
    {
      icon: Scroll,
      era: isEn ? '19th Century Belle Époque' : 'Belle Époque & Années Folles',
      title: isEn ? 'The Rise of Paris Haute Fourrure' : 'La Naissance de la Haute Fourrure Parisienne',
      desc: isEn
        ? 'As Paris established itself as the global capital of haute couture, master furriers on Rue de la Paix and Place Vendôme transformed protective winter garments into fluid works of architectural art.'
        : 'Tandis que Paris s’affirme comme la capitale mondiale de l’élégance, les fourreurs de la Rue de la Paix et de la Place Vendôme métamorphosent le vêtement de protection hivernal en une parure architecturale d’une infinie légèreté.',
    },
    {
      icon: Landmark,
      era: isEn ? 'Today & Beyond' : 'Aujourd’hui',
      title: isEn ? 'Contemporary Parisian Legacy' : 'Une Élégance Perpétuée',
      desc: isEn
        ? 'Today, L’Hermine et le Vair bridges this majestic history with contemporary silhouettes, serving clients who treasure timeless beauty and artisanal mastery.'
        : 'Aujourd’hui, notre Maison perpétue cet héritage glorieux à travers des coupes pures et épurées, au service d’une clientèle sensible aux œuvres pérennes.',
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-4 text-center max-w-3xl mx-auto pt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Centuries of Elegance' : 'Des Siècles d’Élégance'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'Heritage & Legacy' : 'L’Héritage & L’Histoire'}
          </h1>
          <p className="font-sans text-base text-muted font-light leading-relaxed">
            {isEn
              ? 'From the legendary coats of Brittany and royal coronations to the grand salons of Paris, discover the origins of our Maison.'
              : 'Des armoiries ducales de Bretagne aux manteaux de sacre et aux salons feutrés de Paris, explorez la genèse de notre Maison.'}
          </p>
        </header>

        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface border border-border">
          <Image
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=85"
            alt="Héritage et histoire de L'Hermine et le Vair"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <div className="space-y-8">
          {chapters.map((ch, idx) => {
            const Icon = ch.icon;
            return (
              <div key={idx} className="p-8 bg-surface border border-border space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-background border border-border text-gold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-gold font-medium">
                    {ch.era}
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-primary font-normal">{ch.title}</h2>
                <p className="font-sans text-sm sm:text-base text-muted leading-relaxed font-light">
                  {ch.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Sub-silo Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <Link
            href={`/${locale}/maison/heritage/histoire`}
            className="p-6 bg-surface border border-border hover:border-gold transition-colors space-y-2 group"
          >
            <h3 className="font-serif text-lg text-primary group-hover:text-gold flex items-center justify-between">
              <span>{isEn ? 'Chronicle of the Maison' : 'La Chronique Historique'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="font-sans text-xs text-muted font-light">
              {isEn
                ? 'From foundation to modern collection launches.'
                : 'De la fondation de l’atelier aux collections contemporaines.'}
            </p>
          </Link>

          <Link
            href={`/${locale}/maison/heritage/ermine-et-vair`}
            className="p-6 bg-surface border border-border hover:border-gold transition-colors space-y-2 group"
          >
            <h3 className="font-serif text-lg text-primary group-hover:text-gold flex items-center justify-between">
              <span>{isEn ? 'The Legend of Ermine & Vair' : 'La Légende de l’Hermine et du Vair'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="font-sans text-xs text-muted font-light">
              {isEn
                ? 'Poetics, fairytales, and heraldic symbolism.'
                : 'Poétique, contes et symbolisme héraldique.'}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
