import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductCard } from '@/components/storefront/ProductCard';
import { generateAlternates } from '@/lib/seo/hreflang';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from '@/lib/seo/jsonld';
import { getCategories, getProducts } from '@/lib/supabase/queries/catalog';

interface CollectionsHubProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: CollectionsHubProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  const title = isEn
    ? "High Fur & Haute Couture Collections | L'Hermine et le Vair"
    : "Collections de Haute Fourrure & Couture | L'Hermine et le Vair";
  const description = isEn
    ? "Discover the collections of coats, jackets, capes, and bespoke fur creations crafted by French master artisans at L'Hermine et le Vair."
    : "Découvrez nos collections de manteaux, vestes, capes et créations sur-mesure en haute fourrure confectionnées par nos maîtres artisans français.";

  return {
    title,
    description,
    alternates: generateAlternates('/collections', locale),
  };
}

export default async function CollectionsHubPage({ params }: CollectionsHubProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const categories = await getCategories();
  const topCategories = categories.filter((c) => c.kind === 'type' && !c.parent_id);
  const featuredProducts = await getProducts({ sortBy: 'best_selling' });

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Collections' : 'Collections', href: `/${locale}/collections` },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: isEn ? 'All Collections' : 'Toutes les Collections',
    description: isEn
      ? "Discover the collections of coats, jackets, capes, and bespoke fur creations."
      : "Découvrez nos collections de manteaux, vestes, capes et créations sur-mesure.",
    url: `/${locale}/collections`,
  });

  const categoryImages: Record<string, string> = {
    'manteau-fourrure-femme': 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop',
    'veste-fourrure-femme': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop',
    'gilet-fourrure-femme': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    'doudoune-fourrure-femme': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
    'parka-fourrure-femme': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    'blouson-fourrure-femme': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    'bolero-en-fourrure': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    'cape-fourrure-femme': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop',
    'chapeau-fourrure-femme': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    'toque-fourrure-femme': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    'bandeau-en-fourrure': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop',
    'bonnet-fourrure-femme': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
    'chapka-fourrure-femme': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop',
    'accessoires': 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1200&auto=format&fit=crop',
    'manteaux': 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop',
    'gilets': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    'capes': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop',
  };

  const mainCategorySlugs = [
    'manteau-fourrure-femme',
    'veste-fourrure-femme',
    'gilet-fourrure-femme',
    'doudoune-fourrure-femme',
    'parka-fourrure-femme',
    'blouson-fourrure-femme',
    'bolero-en-fourrure',
    'cape-fourrure-femme',
  ];

  const accessoryCategorySlugs = [
    'chapeau-fourrure-femme',
    'toque-fourrure-femme',
    'bandeau-en-fourrure',
    'bonnet-fourrure-femme',
    'chapka-fourrure-femme',
  ];

  const mainCats = categories.filter((c) => mainCategorySlugs.includes(c.slug));
  const accessoryCats = categories.filter((c) => accessoryCategorySlugs.includes(c.slug));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div className="bg-ivory min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Editorial Page Header */}
          <div className="max-w-3xl mb-12 md:mb-16 space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
              {isEn ? 'Haute Fourrure & Couture Parisienne' : 'Haute Fourrure & Couture Parisienne'}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-black font-normal leading-tight">
              {isEn ? 'The Collections' : 'Les Collections'}
            </h1>
            <p className="text-sm md:text-base text-charcoal leading-relaxed font-light">
              {isEn
                ? 'From timeless floor-length mink coats to supple fox jackets, cashmere capes, and rare headwear, each piece reflects French sartorial heritage and uncompromising luxury.'
                : 'Du manteau long en vison impérial aux vestes en renard soyeux, capes de cachemire et coiffes de maître, chaque pièce incarne l’excellence du geste artisanal et la noblesse des matières rares.'}
            </p>
          </div>

          {/* Section 1: Main Haute Fur Garments */}
          <div className="mb-16">
            <h2 className="text-xs uppercase font-sans tracking-[0.22em] text-gold font-semibold mb-6">
              {isEn ? 'Haute Fur Collections' : 'Les Collections d’Apparat'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mainCats.map((cat) => {
                const catName = isEn ? cat.name_en : cat.name_fr;
                const catTargetSlug = isEn && cat.slug_en ? cat.slug_en : cat.slug;
                const catImage: string =
                  categoryImages[cat.slug] ||
                  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop';

                return (
                  <Link
                    key={cat.id}
                    href={`/${locale}/collections/${catTargetSlug}`}
                    className="group relative block aspect-[3/4] overflow-hidden bg-charcoal/10 border border-charcoal/15"
                  >
                    <Image
                      src={catImage}
                      alt={catName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-ivory space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                        {isEn ? 'Collection' : 'Collection'}
                      </p>
                      <h3 className="font-serif text-lg sm:text-xl text-ivory group-hover:text-gold transition-colors">
                        {catName}
                      </h3>
                      <span className="inline-block text-xs uppercase tracking-widest text-ivory/80 pt-1 underline underline-offset-4 decoration-gold/60">
                        {isEn ? 'Explore' : 'Découvrir'}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 2: Rare Accessories & Headwear */}
          <div className="mb-20">
            <h2 className="text-xs uppercase font-sans tracking-[0.22em] text-gold font-semibold mb-6">
              {isEn ? 'Rare Accessories & Headwear' : 'Coiffes & Accessoires Rares'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {accessoryCats.map((cat) => {
                const catName = isEn ? cat.name_en : cat.name_fr;
                const catTargetSlug = isEn && cat.slug_en ? cat.slug_en : cat.slug;
                const catImage: string =
                  categoryImages[cat.slug] ||
                  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop';

                return (
                  <Link
                    key={cat.id}
                    href={`/${locale}/collections/${catTargetSlug}`}
                    className="group relative block aspect-[3/4] overflow-hidden bg-charcoal/10 border border-charcoal/15"
                  >
                    <Image
                      src={catImage}
                      alt={catName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-ivory space-y-1">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-gold">
                        {isEn ? 'Accessory' : 'Accessoire'}
                      </p>
                      <h3 className="font-serif text-sm sm:text-base text-ivory group-hover:text-gold transition-colors">
                        {catName}
                      </h3>
                      <span className="inline-block text-[10px] uppercase tracking-widest text-ivory/80 pt-0.5 underline underline-offset-4 decoration-gold/60">
                        {isEn ? 'View' : 'Voir'}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Iconic Creations Spotlight */}
          <div className="space-y-8">
            <div className="border-t border-charcoal/15 pt-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-taupe font-medium mb-1">
                  {isEn ? 'Iconic Silhouettes' : 'Silhouettes Iconiques'}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl text-black">
                  {isEn ? 'Masterpieces of the Season' : 'Chefs-d’œuvre de la Saison'}
                </h2>
              </div>
              <p className="text-xs text-charcoal max-w-md">
                {isEn
                  ? 'Selected iconic designs crafted in limited editions with individually numbered traceability tags.'
                  : 'Sélection de pièces iconiques éditées en séries très limitées et dotées d’un certificat numéroté.'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.slice(0, 4).map((product) => {
                const subCat = categories.find((c) => c.id === product.category_id);
                const parentCat = subCat?.parent_id
                  ? categories.find((c) => c.id === subCat.parent_id)
                  : subCat;
                const catSlug = parentCat?.slug || 'manteaux';
                const subCatSlug = subCat?.slug || 'manteaux-de-fourrure';
                const productHref = `/${locale}/collections/${catSlug}/${subCatSlug}/${product.slug}`;

                const formattedPrice = new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
                  style: 'currency',
                  currency: product.price_currency,
                  maximumFractionDigits: 0,
                }).format(product.price_amount);

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    href={productHref}
                    locale={locale as 'fr' | 'en'}
                    name={isEn ? product.name_en : product.name_fr}
                    price={formattedPrice}
                    imageUrl={product.images[0]?.url || '/images/products/placeholder.webp'}
                    imageAlt={
                      (isEn ? product.images[0]?.alt_text_en : product.images[0]?.alt_text_fr) ||
                      product.name_fr
                    }
                    hoverImageUrl={product.images[1]?.url}
                    isBestSeller={product.is_best_seller}
                    material={product.material}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
