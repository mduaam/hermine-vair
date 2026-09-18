import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductGallery } from '@/components/storefront/ProductGallery';
import { ProductInfo } from '@/components/storefront/ProductInfo';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ProductReviews } from '@/components/storefront/ProductReviews';
import { generateAlternates } from '@/lib/seo/hreflang';
import { buildBreadcrumbJsonLd, buildProductJsonLd } from '@/lib/seo/jsonld';
import {
  getProductBySlug,
  getCategoryBySlug,
  getRelatedProducts,
  getAllProductPaths,
} from '@/lib/supabase/queries/catalog';
import { getProductReviews } from '@/lib/supabase/queries/reviews';

interface ProductPageProps {
  params: Promise<{
    locale: string;
    category: string;
    subCategory: string;
    productSlug: string;
  }>;
}

export async function generateStaticParams() {
  const paths = await getAllProductPaths();
  const locales = ['fr', 'en'];

  const staticParams: Array<{
    locale: string;
    category: string;
    subCategory: string;
    productSlug: string;
  }> = [];

  for (const locale of locales) {
    for (const path of paths) {
      staticParams.push({
        locale,
        category: path.category,
        subCategory: path.subCategory,
        productSlug: path.productSlug,
      });
    }
  }

  return staticParams;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, category, subCategory, productSlug } = await params;
  const isEn = locale === 'en';

  const product = await getProductBySlug(productSlug);
  if (!product) return {};

  const title = isEn
    ? product.meta_title_en || `${product.name_en} | High Fur | L'Hermine et le Vair`
    : product.meta_title_fr || `${product.name_fr} | Haute Fourrure | L'Hermine et le Vair`;

  const description = isEn
    ? product.meta_description_en || product.description_en || ''
    : product.meta_description_fr || product.description_fr || '';

  const canonicalPath = `/collections/${category}/${subCategory}/${productSlug}`;

  return {
    title,
    description,
    alternates: generateAlternates(canonicalPath, locale),
    openGraph: {
      title,
      description,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, category: categorySlug, subCategory: subCategorySlug, productSlug } = await params;
  const isEn = locale === 'en';

  const product = await getProductBySlug(productSlug);
  if (!product) {
    notFound();
  }

  const category = await getCategoryBySlug(categorySlug);
  const subCategory = await getCategoryBySlug(subCategorySlug);

  const parentName = category
    ? isEn
      ? category.name_en
      : category.name_fr
    : isEn
    ? 'Collection'
    : 'Collection';
  const subName = subCategory
    ? isEn
      ? subCategory.name_en
      : subCategory.name_fr
    : parentName;
  const productName = isEn ? product.name_en : product.name_fr;

  const currentPath = `/collections/${categorySlug}/${subCategorySlug}/${productSlug}`;

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Collections' : 'Collections', href: `/${locale}/collections` },
    { label: parentName, href: `/${locale}/collections/${categorySlug}` },
    { label: subName, href: `/${locale}/collections/${categorySlug}/${subCategorySlug}` },
    { label: productName, href: `/${locale}${currentPath}` },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);
  const reviews = await getProductReviews(product.id);
  const productJsonLd = buildProductJsonLd({
    product,
    locale,
    url: `/${locale}${currentPath}`,
    reviews,
  });

  // Strict Silo Linking: related products strictly within same category or material
  const relatedProducts = await getRelatedProducts(
    product.id,
    product.category_id,
    product.material
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="bg-ivory min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Product Primary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20">
            {/* Left: Gallery */}
            <div className="lg:col-span-7">
              <ProductGallery
                images={product.images}
                productName={productName}
                locale={locale}
              />
            </div>

            {/* Right: Sticky Product Info */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
              <ProductInfo product={product} locale={locale} />
            </div>
          </div>

          {/* Customer Reviews Section */}
          <ProductReviews
            productId={product.id}
            productName={productName}
            locale={locale}
          />

          {/* Related Silo Products Section */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-charcoal/15 pt-16 mt-16 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-1">
                    {isEn ? 'Harmonious Creations' : 'Harmonie & Silhouette'}
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl text-black">
                    {isEn ? 'You May Also Admire' : 'Vous Aimerez Aussi'}
                  </h2>
                </div>
                <p className="text-xs text-charcoal">
                  {isEn
                    ? 'Creations sharing the same certified material and atelier craftsmanship.'
                    : 'Sélection de pièces partageant le même travail d’atelier et noblesse de matière.'}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((rel) => {
                  const relHref = `/${locale}/collections/${categorySlug}/${subCategorySlug}/${rel.slug}`;
                  const formattedPrice = new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
                    style: 'currency',
                    currency: rel.price_currency,
                    maximumFractionDigits: 0,
                  }).format(rel.price_amount);

                  return (
                    <ProductCard
                      key={rel.id}
                      id={rel.id}
                      slug={rel.slug}
                      href={relHref}
                      locale={locale as 'fr' | 'en'}
                      name={isEn ? rel.name_en : rel.name_fr}
                      price={formattedPrice}
                      imageUrl={rel.images[0]?.url || '/images/products/placeholder.webp'}
                      imageAlt={
                        (isEn ? rel.images[0]?.alt_text_en : rel.images[0]?.alt_text_fr) ||
                        rel.name_fr
                      }
                      hoverImageUrl={rel.images[1]?.url}
                      isBestSeller={rel.is_best_seller}
                      material={rel.material}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
