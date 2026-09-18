const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lhermineetlevair.com';

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: "L'Hermine et le Vair",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Maison de haute fourrure et créations d'exception. Artisanat d'art français et silhouettes intemporelles.",
    address: {
      '@type': 'PostalAddress',
      streetAddress: '15 Rue de la Paix',
      addressLocality: 'Paris',
      postalCode: '75002',
      addressCountry: 'FR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+33-1-42-68-00-00',
      contactType: 'customer service',
      availableLanguage: ['French', 'English'],
    },
    sameAs: [
      'https://www.instagram.com/lhermineetlevair',
      'https://www.pinterest.com/lhermineetlevair',
    ],
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: "L'Hermine et le Vair",
    url: BASE_URL,
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/fr/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ label: string; href: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href.startsWith('http') ? item.href : `${BASE_URL}${item.href}`,
    })),
  };
}

export function buildCollectionPageJsonLd(params: {
  name: string;
  description?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: params.name,
    description: params.description || `Découvrez la collection ${params.name} par L'Hermine et le Vair.`,
    url: params.url.startsWith('http') ? params.url : `${BASE_URL}${params.url}`,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: "L'Hermine et le Vair",
    },
  };
}

export function buildProductJsonLd(params: {
  product: {
    sku: string;
    name_fr: string;
    name_en: string;
    description_fr?: string | null;
    description_en?: string | null;
    price_amount: number;
    price_currency: string;
    images: Array<{ url: string }>;
    variants?: Array<{ stock_quantity: number }>;
  };
  locale: string;
  url: string;
  reviews?: Array<{
    rating: number;
    title: string;
    body: string;
    created_at: string;
    customer_name?: string;
  }>;
}) {
  const { product, locale, url, reviews = [] } = params;
  const isEn = locale === 'en';
  const name = isEn ? product.name_en : product.name_fr;
  const description =
    (isEn ? product.description_en : product.description_fr) ||
    "Pièce de haute fourrure confectionnée à la main dans notre atelier parisien.";

  const totalStock =
    product.variants && product.variants.length > 0
      ? product.variants.reduce((acc, v) => acc + (v.stock_quantity || 0), 0)
      : 1;

  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku: product.sku,
    image: product.images.map((img) => img.url),
    brand: {
      '@type': 'Brand',
      name: "L'Hermine et le Vair",
    },
    offers: {
      '@type': 'Offer',
      price: product.price_amount,
      priceCurrency: product.price_currency || 'EUR',
      priceValidUntil: '2027-12-31',
      availability:
        totalStock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: fullUrl,
      seller: {
        '@type': 'Organization',
        name: "L'Hermine et le Vair",
      },
    },
  };

  if (reviews.length > 0) {
    const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avg,
      reviewCount: reviews.length,
      bestRating: '5',
      worstRating: '1',
    };

    jsonLd.review = reviews.map((r) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: '5',
      },
      name: r.title,
      reviewBody: r.body,
      datePublished: r.created_at,
      author: {
        '@type': 'Person',
        name: r.customer_name || (isEn ? 'Verified Client' : 'Client Vérifié'),
      },
    }));
  }

  return jsonLd;
}

export function buildArticleJsonLd(params: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  locale?: string;
}) {
  const fullUrl = params.url.startsWith('http') ? params.url : `${BASE_URL}${params.url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    headline: params.title,
    description: params.description,
    image: params.imageUrl || `${BASE_URL}/og-journal.jpg`,
    datePublished: params.datePublished,
    dateModified: params.dateModified || params.datePublished,
    author: {
      '@type': 'Organization',
      name: params.authorName || "L'Hermine et le Vair Atelier",
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: "L'Hermine et le Vair",
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    inLanguage: params.locale || 'fr',
  };
}

export function buildFaqJsonLd(params: {
  items: Array<{ question: string; answer: string }>;
  url?: string;
}) {
  const fullUrl = params.url
    ? params.url.startsWith('http')
      ? params.url
      : `${BASE_URL}${params.url}`
    : `${BASE_URL}/fr/client-services/faq`;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: params.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    url: fullUrl,
  };
}

export function buildAboutPageJsonLd(params: {
  name: string;
  description: string;
  url: string;
}) {
  const fullUrl = params.url.startsWith('http') ? params.url : `${BASE_URL}${params.url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: params.name,
    description: params.description,
    url: fullUrl,
    publisher: {
      '@type': 'Organization',
      name: "L'Hermine et le Vair",
      url: BASE_URL,
    },
  };
}

