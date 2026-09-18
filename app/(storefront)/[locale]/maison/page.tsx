import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Sparkles, Feather } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';
import { buildBreadcrumbJsonLd, buildAboutPageJsonLd } from '@/lib/seo/jsonld';

interface MaisonPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: MaisonPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  const title = isEn
    ? "La Maison | Haute Fourrure Parisienne, Heritage & Ethics | L'Hermine et le Vair"
    : "La Maison | Haute Fourrure Parisienne, Héritage & Éthique | L'Hermine et le Vair";

  const description = isEn
    ? "Discover the spirit of L'Hermine et le Vair: master craftsmanship, Furmark® ethical traceability, and centuries of Parisian heritage."
    : "Découvrez l'âme de L'Hermine et le Vair : savoir-faire d'exception de nos maîtres fourreurs, traçabilité Furmark® et héritage séculaire.";

  return {
    title,
    description,
    alternates: generateAlternates('/maison', locale),
  };
}

export default async function MaisonPage({ params }: MaisonPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'The Maison' : 'La Maison', href: `/${locale}/maison` },
  ];

  const aboutJsonLd = buildAboutPageJsonLd({
    name: isEn ? "La Maison L'Hermine et le Vair" : "La Maison L'Hermine et le Vair",
    description: isEn
      ? "Parisian haute fourrure atelier dedicated to master craftsmanship, ethical pelt traceability, and timeless luxury."
      : "Maison parisienne de haute fourrure dédiée à l'artisanat d'art, à la traçabilité éthique et au luxe intemporel.",
    url: `/${locale}/maison`,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  const pillars = [
    {
      title: isEn ? 'Master Craftsmanship' : 'Savoir-Faire d’Exception',
      subtitle: isEn ? 'The Parisian Atelier' : 'L’Atelier Parisien',
      description: isEn
        ? 'From pelt sorting beneath natural light to millimeter stranding and bespoke Lyon silk linings, discover the precision of French artisans.'
        : 'De l’assortiment des peaux à la lumière du nord jusqu’au galonnage et aux soieries lyonnaises façonnées à la main.',
      href: `/${locale}/maison/savoir-faire`,
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85',
      icon: Sparkles,
    },
    {
      title: isEn ? 'Ethics & Traceability' : 'Éthique & Traçabilité',
      subtitle: isEn ? 'Furmark® Certification' : 'Certification Furmark®',
      description: isEn
        ? 'Uncompromising standards of animal welfare, Furmark® certified global supply chains, and transparent international compliance.'
        : 'Exigence absolue en matière de bien-être animal, chaîne d’approvisionnement certifiée Furmark® et totale transparence réglementaire.',
      href: `/${locale}/maison/ethique`,
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
      icon: ShieldCheck,
    },
    {
      title: isEn ? 'Heritage & Legacy' : 'Héritage & Histoire',
      subtitle: isEn ? 'The Royal Fur Tradition' : 'L’Héraldique Royale',
      description: isEn
        ? 'Tracing the symbolic lineage of ermine and vair from medieval heraldry to contemporary Parisian couture.'
        : 'L’épopée poétique de l’hermine et du petit-gris à travers les siècles, des manteaux de sacre aux silhouettes modernes de la Place Vendôme.',
      href: `/${locale}/maison/heritage`,
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
      icon: Feather,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Banner */}
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-surface border border-border">
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85"
            alt="Atelier L'Hermine et le Vair Paris"
            fill
            className="object-cover brightness-75"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-background/80 via-transparent to-transparent">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3">
              {isEn ? 'Paris • Rue de la Paix' : 'Paris • Rue de la Paix'}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-primary font-normal tracking-wide">
              {isEn ? 'The Maison' : 'La Maison'}
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted max-w-xl mt-4 font-light leading-relaxed">
              {isEn
                ? 'Where centuries of French craft meet contemporary silhouette design.'
                : 'L’alliance sacrée entre haute tradition fourreur et pureté architecturale contemporaine.'}
            </p>
          </div>
        </div>

        {/* Three Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="group flex flex-col justify-between bg-surface border border-border overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-background">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 p-2.5 bg-background/90 backdrop-blur-sm border border-border/50 text-gold">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-widest text-gold font-medium">
                      {pillar.subtitle}
                    </p>
                    <h2 className="font-serif text-2xl text-primary font-normal group-hover:text-gold transition-colors">
                      <Link href={pillar.href}>{pillar.title}</Link>
                    </h2>
                    <p className="font-sans text-sm text-muted leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-border/60">
                    <Link
                      href={pillar.href}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-medium group-hover:text-gold transition-colors"
                    >
                      <span>{isEn ? 'Discover Pillar' : 'Explorer'}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quote Block */}
        <div className="text-center max-w-3xl mx-auto py-16 px-4 space-y-4">
          <blockquote className="font-serif text-2xl sm:text-3xl text-primary font-light italic leading-snug">
            {isEn
              ? '“Every pelt tells a story of nature; every stitch honors the hands that shaped it.”'
              : '« Chaque peau raconte le secret de la nature ; chaque point de couture rend hommage aux mains qui l’ont façonnée. »'}
          </blockquote>
          <p className="text-xs uppercase tracking-widest text-gold font-medium">
            {isEn ? 'Master Artisan, L’Hermine et le Vair' : 'Maître Fourreur de la Maison'}
          </p>
        </div>
      </div>
    </div>
  );
}
