import React from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, ShieldCheck, Sparkles, Smartphone, Award } from 'lucide-react';
import { HeroCarousel, type HeroSlide } from '@/components/storefront/HeroCarousel';
import { CategoryTile } from '@/components/storefront/CategoryTile';
import { ProductCard } from '@/components/storefront/ProductCard';
import { SplitStoryModule } from '@/components/storefront/SplitStoryModule';
import { LookbookGallery, type LookbookImage } from '@/components/storefront/LookbookGallery';
import { NewsletterBand } from '@/components/storefront/NewsletterBand';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/lib/seo/jsonld';

interface HomePageProps {
  params: { locale: string };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  const isFr = locale === 'fr';
  const tTrust = await getTranslations({ locale: locale as 'fr' | 'en', namespace: 'trust' });

  // 1. Curated Hero Slides (warm, neutral luxury palette)
  const heroSlides: HeroSlide[] = [
    {
      imageUrl:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=2000&q=85',
      imageAlt: isFr
        ? 'Manteau long en vison naturel dans un salon parisien d’exception'
        : 'Long natural mink coat in an exceptional Parisian private salon',
      eyebrowLabel: isFr ? "Fourrures d'Exception" : 'Fine Fur & Rare Silhouettes',
      heading: isFr
        ? "L'Élégance Pure, le Savoir-Faire d'Atelier"
        : 'Pure Elegance, Atelier Craftsmanship',
      subheading: isFr
        ? 'Découvrez une collection sculptée dans les matières les plus nobles, façonnée à la main par nos maîtres fourreurs parisiens.'
        : 'Discover bespoke creations tailored in the finest noble materials by our Parisian master craftsmen.',
      ctaLabel: isFr ? 'Découvrir la Collection' : 'Explore The Collection',
      ctaHref: `/${locale}/collections/manteaux`,
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2000&q=85',
      imageAlt: isFr
        ? 'Veste cintrée en renard argenté et soie naturelle'
        : 'Tailored silver fox and natural silk jacket',
      eyebrowLabel: isFr ? 'Haute Confection' : 'Haute Tailoring',
      heading: isFr
        ? 'Silhouettes Intemporelles & Matières Rares'
        : 'Timeless Silhouettes & Rare Textures',
      subheading: isFr
        ? 'Une vision moderne de la noblesse française. Des coupes structurées conçues pour traverser les générations.'
        : 'A contemporary expression of French heritage. Structured cuts designed to transcend generations.',
      ctaLabel: isFr ? 'Voir le Lookbook' : 'View Lookbook',
      ctaHref: `/${locale}/lookbook`,
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85',
      imageAlt: isFr
        ? 'Cape drapée en cachemire double face et col chinchilla'
        : 'Draped double-face cashmere cape with chinchilla collar',
      eyebrowLabel: isFr ? 'Série Limitée' : 'Limited Editions',
      heading: isFr
        ? 'Le Raffinement dans le Moindre Détail'
        : 'Refinement in Every Detail',
      subheading: isFr
        ? 'Chaque pièce est une œuvre unique numérotée, issue d’élevages certifiés aux normes éthiques les plus strictes.'
        : 'Each creation is an individually numbered piece sourced from certified ateliers adhering to the strictest ethical standards.',
      ctaLabel: isFr ? 'Explorer la Maison' : 'Discover The Maison',
      ctaHref: `/${locale}/maison`,
    },
  ];

  // 2. Category Tiles
  const categories = [
    {
      imageUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
      imageAlt: isFr ? 'Manteaux de Fourrure' : 'Fur Coats',
      label: isFr ? 'Manteaux de Fourrure' : 'Fur Coats',
      href: `/${locale}/collections/manteaux`,
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
      imageAlt: isFr ? 'Gilets & Vestes' : 'Vests & Jackets',
      label: isFr ? 'Gilets & Vestes' : 'Vests & Jackets',
      href: `/${locale}/collections/gilets`,
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
      imageAlt: isFr ? 'Capes & Étoles' : 'Capes & Stoles',
      label: isFr ? 'Capes & Étoles' : 'Capes & Stoles',
      href: `/${locale}/collections/capes`,
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
      imageAlt: isFr ? 'Accessoires d’Exception' : 'Rare Accessories',
      label: isFr ? 'Accessoires d’Exception' : 'Rare Accessories',
      href: `/${locale}/collections/accessoires`,
    },
  ];

  // 3. Best Sellers Products
  const bestSellers = [
    {
      id: 'prod-001',
      slug: 'manteau-vison-noir-long',
      categorySlug: 'manteaux',
      name: isFr ? 'Manteau Long en Vison Noir' : 'Long Black Mink Coat',
      price: '€ 14 500',
      material: isFr ? 'Vison Élevage Certifié' : 'Certified Mink',
      imageUrl:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      hoverImageUrl:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      imageAlt: isFr ? 'Manteau long en vison noir' : 'Long black mink coat',
      isBestSeller: true,
      stockStatus: 'in_stock' as const,
    },
    {
      id: 'prod-002',
      slug: 'gilet-renard-argente',
      categorySlug: 'gilets',
      name: isFr ? 'Gilet Court en Renard Argenté' : 'Silver Fox Cropped Vest',
      price: '€ 6 800',
      material: isFr ? 'Renard Argenté & Soie' : 'Silver Fox & Silk',
      imageUrl:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      imageAlt: isFr ? 'Gilet court en renard argenté' : 'Silver fox vest',
      isBestSeller: true,
      stockStatus: 'low_stock' as const,
    },
    {
      id: 'prod-003',
      slug: 'cape-cachemire-col-chinchilla',
      categorySlug: 'capes',
      name: isFr ? 'Cape Cachemire & Col Chinchilla' : 'Cashmere Cape with Chinchilla Collar',
      price: '€ 9 200',
      material: isFr ? 'Cachemire Double Face' : 'Double-Face Cashmere',
      imageUrl:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      imageAlt: isFr ? 'Cape cachemire avec col chinchilla' : 'Cashmere cape',
      isBestSeller: false,
      stockStatus: 'in_stock' as const,
    },
    {
      id: 'prod-004',
      slug: 'manteau-chinchilla-imperial',
      categorySlug: 'manteaux',
      name: isFr ? 'Manteau Impérial en Chinchilla' : 'Imperial Chinchilla Coat',
      price: '€ 28 000',
      material: isFr ? 'Chinchilla Royal' : 'Royal Chinchilla',
      imageUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      imageAlt: isFr ? 'Manteau impérial en chinchilla' : 'Imperial chinchilla coat',
      isBestSeller: true,
      stockStatus: 'in_stock' as const,
    },
  ];

  // 4. Lookbook Images
  const lookbookImages: LookbookImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
      alt: isFr ? 'Silhouette Hiver - Manteau Vison' : 'Winter Silhouette - Mink Coat',
      campaign: 'Hiver 2026',
      title: isFr ? 'L’Allure Parisienne' : 'The Parisian Allure',
      linkedCollectionSlug: 'manteaux',
    },
    {
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
      alt: isFr ? 'Atelier - Façonnage des peaux' : 'Atelier - Skin tailoring',
      campaign: 'Artisanat d’Art',
      title: isFr ? 'L’Héritage des Maîtres' : 'Master Craftsmen',
    },
    {
      url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
      alt: isFr ? 'Cape en mouvement' : 'Cape in motion',
      campaign: 'Hiver 2026',
      title: isFr ? 'Légèreté & Noblesse' : 'Lightness & Nobility',
      linkedCollectionSlug: 'capes',
    },
    {
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
      alt: isFr ? 'Portrait étole renard' : 'Fox stole portrait',
      campaign: 'Accessoires',
      title: isFr ? 'Douceur Réfractée' : 'Refracted Softness',
      linkedCollectionSlug: 'accessoires',
    },
  ];

  const orgJsonLd = buildOrganizationJsonLd();
  const websiteJsonLd = buildWebSiteJsonLd();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <main id="main-content" className="flex-1">
        {/* 1. Hero Carousel */}
        <HeroCarousel slides={heroSlides} />

        {/* 2. Key Features Trust Row (from approved mockup §8) */}
        <section
          aria-label="Engagements de la Maison"
          className="border-y border-charcoal/10 bg-ivory/60 py-10 px-6 md:px-10 lg:px-16"
        >
          <div className="max-w-site mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start space-x-4">
              <div className="p-2 border border-taupe/30 text-taupe mt-1 bg-ivory">
                <Smartphone className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-serif text-sm md:text-base font-medium text-black">
                  {tTrust('responsive')}
                </h3>
                <p className="text-xs text-charcoal mt-1 leading-relaxed">
                  {tTrust('responsiveDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 border border-taupe/30 text-taupe mt-1 bg-ivory">
                <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-serif text-sm md:text-base font-medium text-black">
                  {tTrust('secure')}
                </h3>
                <p className="text-xs text-charcoal mt-1 leading-relaxed">
                  {tTrust('secureDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 border border-taupe/30 text-taupe mt-1 bg-ivory">
                <Award className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-serif text-sm md:text-base font-medium text-black">
                  {tTrust('craftsmanship')}
                </h3>
                <p className="text-xs text-charcoal mt-1 leading-relaxed">
                  {tTrust('craftsmanshipDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 border border-taupe/30 text-taupe mt-1 bg-ivory">
                <Sparkles className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-serif text-sm md:text-base font-medium text-black">
                  {tTrust('service')}
                </h3>
                <p className="text-xs text-charcoal mt-1 leading-relaxed">
                  {tTrust('serviceDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Category Tiles Grid */}
        <section
          aria-label="Nos Catégories"
          className="py-16 md:py-24 max-w-site mx-auto px-6 md:px-10 lg:px-16"
        >
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <p className="text-eyebrow uppercase tracking-[0.24em] text-taupe font-medium">
              {isFr ? 'L’Art de la Coupe' : 'The Art of Silhouettes'}
            </p>
            <h2 className="font-serif text-2xl-serif md:text-4xl text-black font-normal">
              {isFr ? 'Nos Collections d’Exception' : 'Exceptional Collections'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {categories.map((cat) => (
              <CategoryTile
                key={cat.href}
                imageUrl={cat.imageUrl}
                imageAlt={cat.imageAlt}
                label={cat.label}
                ctaLabel={isFr ? 'Découvrir' : 'Explore'}
                href={cat.href}
              />
            ))}
          </div>
        </section>

        {/* 4. Best Sellers Product Grid */}
        <section
          aria-label="Nos Best Sellers"
          className="py-16 md:py-24 bg-ivory/50 border-t border-charcoal/10"
        >
          <div className="max-w-site mx-auto px-6 md:px-10 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div className="space-y-2">
                <p className="text-eyebrow uppercase tracking-[0.24em] text-taupe font-medium">
                  {isFr ? 'Pièces Iconiques' : 'Iconic Creations'}
                </p>
                <h2 className="font-serif text-2xl-serif md:text-3xl text-black">
                  {isFr ? 'Les Créations Signature' : 'Signature Masterpieces'}
                </h2>
              </div>

              <Link
                href={`/${locale}/collections`}
                className="text-xs uppercase tracking-[0.16em] font-semibold text-black hover:text-taupe flex items-center gap-1 transition-colors"
              >
                <span>{isFr ? 'Voir toutes les pièces' : 'View All Creations'}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[1.5]" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  categorySlug={product.categorySlug}
                  locale={locale as 'fr' | 'en'}
                  name={product.name}
                  price={product.price}
                  material={product.material}
                  imageUrl={product.imageUrl}
                  hoverImageUrl={product.hoverImageUrl}
                  imageAlt={product.imageAlt}
                  isBestSeller={product.isBestSeller}
                  stockStatus={product.stockStatus}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 5. Split Story Module (Notre Maison) */}
        <SplitStoryModule
          imageUrl="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85"
          imageAlt={isFr ? "Atelier de haute fourrure à Paris" : "Bespoke Parisian fur atelier"}
          eyebrowLabel={isFr ? "Héritage & Noblesse" : "Heritage & Nobility"}
          heading={isFr ? "La Pureté du Vair, la Rareté de l’Hermine" : "The Purity of Vair, the Rarity of Ermine"}
          body={
            isFr
              ? "Depuis nos origines, L’Hermine et le Vair perpétue la tradition séculaire des maîtres fourreurs de Paris. Chaque pièce incarne un dialogue intime entre les matières naturelles les plus précieuses et une recherche obsessionnelle de tombé, de légèreté et de distinction."
              : "Since our founding, L’Hermine et le Vair has upheld the storied tradition of Parisian master furriers. Each garment embodies an intimate dialogue between rare, ethically-sourced noble pelts and an exacting pursuit of lightness, drape, and timeless distinction."
          }
          ctaLabel={isFr ? "Découvrir la Maison" : "Discover The Maison"}
          ctaHref={`/${locale}/maison`}
          imagePosition="right"
        />

        {/* 6. Lookbook Gallery */}
        <LookbookGallery images={lookbookImages} locale={locale as 'fr' | 'en'} />

        {/* 7. Newsletter Band */}
        <NewsletterBand locale={locale as 'fr' | 'en'} />
      </main>
    </>
  );
}
