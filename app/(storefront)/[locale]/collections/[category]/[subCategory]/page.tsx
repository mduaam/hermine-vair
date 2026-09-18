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
  getCategoryBySlug,
  getSubCategories,
  getProducts,
  type ProductFilters,
} from '@/lib/supabase/queries/catalog';

interface SubCategoryPageProps {
  params: Promise<{
    locale: string;
    category: string;
    subCategory: string;
  }>;
  searchParams: Promise<{
    material?: string;
    size?: string;
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'best_selling';
  }>;
}

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const { locale, category: categorySlug, subCategory: subCategorySlug } = await params;
  const isEn = locale === 'en';

  const category = await getCategoryBySlug(categorySlug);
  const subCategory = await getCategoryBySlug(subCategorySlug);
  if (!category || !subCategory) return {};

  const name = isEn ? subCategory.name_en : subCategory.name_fr;
  const parentName = isEn ? category.name_en : category.name_fr;

  const title = isEn
    ? `${name} | ${parentName} | L'Hermine et le Vair`
    : `${name} | ${parentName} | L'Hermine et le Vair`;
  const description = isEn
    ? `Discover our exclusive collection of ${name.toLowerCase()} in fine furs and materials, crafted in France.`
    : `Découvrez notre collection d'exception de ${name.toLowerCase()} en haute fourrure et matières nobles, confectionnée en France.`;

  return {
    title,
    description,
    alternates: generateAlternates(`/collections/${categorySlug}/${subCategorySlug}`, locale),
  };
}

export default async function SubCategoryPage({ params, searchParams }: SubCategoryPageProps) {
  const { locale, category: categorySlug, subCategory: subCategorySlug } = await params;
  const search = await searchParams;
  const isEn = locale === 'en';

  const category = await getCategoryBySlug(categorySlug);
  const subCategory = await getCategoryBySlug(subCategorySlug);

  if (!category || !subCategory) {
    notFound();
  }

  const siblingSubCategories = await getSubCategories(category.id);

  const filters: ProductFilters = {
    subCategorySlug: subCategory.slug,
    material: search.material,
    size: search.size,
    sortBy: search.sort,
  };

  const products = await getProducts(filters);

  const parentName = isEn ? category.name_en : category.name_fr;
  const subName = isEn ? subCategory.name_en : subCategory.name_fr;

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Collections' : 'Collections', href: `/${locale}/collections` },
    { label: parentName, href: `/${locale}/collections/${category.slug}` },
    { label: subName, href: `/${locale}/collections/${category.slug}/${subCategory.slug}` },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: subName,
    description: isEn
      ? `Explore our collection of ${subName.toLowerCase()} by L'Hermine et le Vair.`
      : `Explorez notre collection de ${subName.toLowerCase()} par la Maison L'Hermine et le Vair.`,
    url: `/${locale}/collections/${category.slug}/${subCategory.slug}`,
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

          {/* Subcategory Header */}
          <div className="max-w-3xl mb-8 space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
              {parentName}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-black font-normal leading-tight">
              {subName}
            </h1>
            <p className="text-xs md:text-sm text-charcoal leading-relaxed font-light">
              {isEn
                ? `Pieces of refined luxury within the ${subName.toLowerCase()} collection. Cut with impeccable proportion and assembled with time-honored artisanal precision.`
                : `Des pièces d'exception au sein de la ligne ${subName.toLowerCase()}. Une coupe magistrale alliée à l’exigence de notre atelier de haute fourrure.`}
            </p>
          </div>

          {/* Sibling Subcategory Chips */}
          {siblingSubCategories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
              <span className="text-xs uppercase tracking-wider text-charcoal font-medium mr-2 shrink-0">
                {isEn ? 'Other lines:' : 'Autres lignes :'}
              </span>
              {siblingSubCategories.map((sibling) => {
                const isCurrent = sibling.slug === subCategory.slug;
                const sibName = isEn ? sibling.name_en : sibling.name_fr;
                return (
                  <Link
                    key={sibling.id}
                    href={`/${locale}/collections/${category.slug}/${sibling.slug}`}
                    className={`shrink-0 px-4 py-1.5 border text-xs uppercase tracking-wider transition-colors ${
                      isCurrent
                        ? 'border-black bg-black text-ivory font-medium'
                        : 'border-charcoal/20 bg-ivory/60 hover:bg-black hover:text-ivory text-black'
                    }`}
                  >
                    {sibName}
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
                const productHref = `/${locale}/collections/${category.slug}/${subCategory.slug}/${prod.slug}`;

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
                href={`/${locale}/collections/${category.slug}/${subCategory.slug}`}
                className="inline-block px-6 py-2.5 bg-black text-ivory text-xs uppercase tracking-widest hover:bg-gold hover:text-black transition-colors"
              >
                {isEn ? 'Reset Filters' : 'Réinitialiser les filtres'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
