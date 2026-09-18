import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductCard } from '@/components/storefront/ProductCard';
import { FilterBar } from '@/components/storefront/FilterBar';
import { generateAlternates } from '@/lib/seo/hreflang';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from '@/lib/seo/jsonld';
import {
  getCategories,
  getCategoryBySlug,
  getSubCategories,
  getProducts,
  type ProductFilters,
} from '@/lib/supabase/queries/catalog';

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    category: string;
  }>;
  searchParams: Promise<{
    material?: string;
    size?: string;
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'best_selling';
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  const isEn = locale === 'en';

  const category = await getCategoryBySlug(categorySlug);
  if (!category) return {};

  const name = isEn ? category.name_en : category.name_fr;
  const title = isEn
    ? `${name} Collection | High Fur & Couture | L'Hermine et le Vair`
    : `Collection ${name} | Haute Fourrure & Couture | L'Hermine et le Vair`;
  const description = isEn
    ? `Explore our collection of luxury ${name.toLowerCase()} handcrafted by French master furriers in Paris.`
    : `Explorez notre collection d'exception de ${name.toLowerCase()} façonnée à la main par nos maîtres artisans parisiens.`;

  return {
    title,
    description,
    alternates: generateAlternates(`/collections/${categorySlug}`, locale),
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, category: categorySlug } = await params;
  const search = await searchParams;
  const isEn = locale === 'en';

  const category = await getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  const subCategories = await getSubCategories(category.id);

  const filters: ProductFilters = {
    categorySlug: category.slug,
    material: search.material,
    size: search.size,
    sortBy: search.sort,
  };

  const products = await getProducts(filters);

  const categoryName = isEn ? category.name_en : category.name_fr;
  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Collections' : 'Collections', href: `/${locale}/collections` },
    { label: categoryName, href: `/${locale}/collections/${category.slug}` },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: categoryName,
    description: isEn
      ? `Discover the ${categoryName} collection by L'Hermine et le Vair.`
      : `Découvrez la collection ${categoryName} de la Maison L'Hermine et le Vair.`,
    url: `/${locale}/collections/${category.slug}`,
  });

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
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Category Editorial Header */}
          <div className="max-w-3xl mb-8 space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
              {isEn ? 'High Fur Collection' : 'Haute Fourrure & Atelier'}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-black font-normal leading-tight">
              {categoryName}
            </h1>
            <p className="text-xs md:text-sm text-charcoal leading-relaxed font-light">
              {isEn
                ? `Discover each creation in our ${categoryName.toLowerCase()} collection. Designed to drape with timeless grandeur and hand-finished with silk and horn accents.`
                : `Découvrez l’ensemble des créations de notre ligne ${categoryName.toLowerCase()}. Une coupe irréprochable au tombé magistral, sublimée par des doublures en pure soie.`}
            </p>
          </div>

          {/* Subcategory Navigation Chips */}
          {subCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
              <span className="text-xs uppercase tracking-wider text-charcoal font-medium mr-2 shrink-0">
                {isEn ? 'Sub-collections:' : 'Sous-lignes :'}
              </span>
              {subCategories.map((sub) => {
                const subName = isEn ? sub.name_en : sub.name_fr;
                return (
                  <Link
                    key={sub.id}
                    href={`/${locale}/collections/${category.slug}/${sub.slug}`}
                    className="shrink-0 px-4 py-1.5 border border-charcoal/20 bg-ivory/60 hover:bg-black hover:text-ivory text-xs uppercase tracking-wider text-black transition-colors"
                  >
                    {subName}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Filter & Sort Bar */}
          <FilterBar totalCount={products.length} locale={locale} />

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
              {products.map((prod) => {
                const subCat = subCategories.find((s) => s.id === prod.category_id);
                const subSlug = subCat?.slug || 'manteaux-de-fourrure';
                const productHref = `/${locale}/collections/${category.slug}/${subSlug}/${prod.slug}`;

                const formattedPrice = new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
                  style: 'currency',
                  currency: prod.price_currency,
                  maximumFractionDigits: 0,
                }).format(prod.price_amount);

                return (
                  <ProductCard
                    key={prod.id}
                    id={prod.id}
                    slug={prod.slug}
                    href={productHref}
                    locale={locale as 'fr' | 'en'}
                    name={isEn ? prod.name_en : prod.name_fr}
                    price={formattedPrice}
                    imageUrl={prod.images[0]?.url || '/images/products/placeholder.webp'}
                    imageAlt={
                      (isEn ? prod.images[0]?.alt_text_en : prod.images[0]?.alt_text_fr) ||
                      prod.name_fr
                    }
                    hoverImageUrl={prod.images[1]?.url}
                    isBestSeller={prod.is_best_seller}
                    material={prod.material}
                  />
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 border border-charcoal/15 bg-charcoal/5 p-8 mb-16">
              <h2 className="font-serif text-xl text-black">
                {isEn ? 'No creations match your filters' : 'Aucune pièce ne correspond à vos critères'}
              </h2>
              <p className="text-xs text-charcoal max-w-md mx-auto">
                {isEn
                  ? 'We invite you to reset your filters or contact our concierge for bespoke requests.'
                  : 'Nous vous invitons à réinitialiser vos filtres ou à contacter notre conciergerie privée.'}
              </p>
              <Link
                href={`/${locale}/collections/${category.slug}`}
                className="inline-block px-6 py-2.5 bg-black text-ivory text-xs uppercase tracking-widest hover:bg-gold hover:text-black transition-colors"
              >
                {isEn ? 'Reset Filters' : 'Réinitialiser les filtres'}
              </Link>
            </div>
          )}

          {/* Rich Editorial Bottom Content for SEO Siloing */}
          <div className="border-t border-charcoal/15 pt-12 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-charcoal leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-serif text-base text-black font-medium">
                {isEn ? 'Atelier Expertise & Tailoring' : 'L’Excellence de l’Atelier Parisien'}
              </h3>
              <p>
                {isEn
                  ? `Each item in our ${categoryName.toLowerCase()} collection requires dozens of hours of meticulous hand-assembly by our master furriers in Paris. We work with the highest grades of natural furs sourced from ethical, certified auction houses.`
                  : `Chaque modèle de notre ligne ${categoryName.toLowerCase()} exige plusieurs dizaines d’heures de travail minutieux. Nos peaux proviennent exclusivement de filières certifiées Furmark® assurant un respect rigoureux du bien-être et de l'environnement.`}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-base text-black font-medium">
                {isEn ? 'Private Appointments & Fitting' : 'Essayages Privés & Sur-Mesure'}
              </h3>
              <p>
                {isEn
                  ? 'Would you like to try our creations in person? Our salon on Rue de la Paix welcomes you for bespoke private fittings upon appointment.'
                  : 'Vous souhaitez découvrir et essayer nos modèles dans l’intimité de nos salons privés ? Notre équipe vous accueille sur rendez-vous au 15 Rue de la Paix à Paris.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
