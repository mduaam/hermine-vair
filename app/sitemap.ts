import type { MetadataRoute } from 'next';
import { getCategories, getAllProductPaths } from '@/lib/supabase/queries/catalog';
import { getJournalPosts } from '@/lib/sanity/client';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lhermineetlevair.com';
const LOCALES = ['fr', 'en'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // 1. Static Core Storefront Routes
  const staticRoutes = [
    '',
    '/collections',
    '/maison',
    '/maison/savoir-faire',
    '/maison/savoir-faire/atelier',
    '/maison/savoir-faire/artisanat',
    '/maison/ethique',
    '/maison/ethique/approvisionnement-responsable',
    '/maison/ethique/reglementation-fourrure',
    '/maison/heritage',
    '/maison/heritage/histoire',
    '/maison/heritage/ermine-et-vair',
    '/journal',
    '/client-services',
    '/client-services/faq',
    '/client-services/contact',
    '/client-services/livraison',
    '/client-services/livraison/expeditions-internationales',
    '/client-services/livraison/droits-de-douane',
    '/client-services/tailles',
    '/client-services/tailles/guide-des-mesures',
    '/lookbook',
    '/legal/mentions-legales',
    '/legal/confidentialite',
    '/legal/cgv',
  ];

  for (const path of staticRoutes) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : path.startsWith('/collections') ? 0.9 : 0.8,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr${path}`,
            en: `${BASE_URL}/en${path}`,
            'x-default': `${BASE_URL}/fr${path}`,
          },
        },
      });
    }
  }

  // 2. Dynamic Categories (Collections Silo)
  try {
    const categories = await getCategories();
    for (const cat of categories) {
      const frCatPath = `/collections/${cat.slug}`;
      const enCatPath = `/collections/${cat.slug_en || cat.slug}`;

      // French entry
      entries.push({
        url: `${BASE_URL}/fr${frCatPath}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr${frCatPath}`,
            en: `${BASE_URL}/en${enCatPath}`,
            'x-default': `${BASE_URL}/fr${frCatPath}`,
          },
        },
      });

      // English entry
      entries.push({
        url: `${BASE_URL}/en${enCatPath}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr${frCatPath}`,
            en: `${BASE_URL}/en${enCatPath}`,
            'x-default': `${BASE_URL}/fr${frCatPath}`,
          },
        },
      });
    }
  } catch (err) {
    console.warn('[Sitemap] Could not fetch categories:', err);
  }

  // 3. Dynamic Products (PDPs)
  try {
    const categories = await getCategories();
    const productPaths = await getAllProductPaths();

    // Map each product to its paired French & English localized path
    const pairedProducts: Map<string, { frPath: string; enPath: string }> = new Map();

    for (const p of productPaths) {
      const isEnglish = p.category !== 'manteaux' && p.category !== 'icones' && p.category !== 'gilets' && p.category !== 'capes' && p.category !== 'accessoires'
        ? true
        : p.productSlug.includes('coat') || p.productSlug.includes('vest') || p.productSlug.includes('jacket') || p.productSlug.includes('stole') || p.productSlug.includes('cape') || p.productSlug.includes('scarf');

      // Group by canonical key
      const key = p.productSlug.replace('black-mink-coat', 'manteau-vison-noir')
        .replace('cognac-mink-coat', 'manteau-vison-cognac')
        .replace('platinum-fox-vest', 'gilet-renard-platine')
        .replace('white-fox-cape', 'cape-renard-blanc')
        .replace('chinchilla-jacket', 'veste-chinchilla')
        .replace('chinchilla-stole', 'etole-chinchilla')
        .replace('ivory-cashmere-coat', 'manteau-cachemire-ivoire')
        .replace('beige-cashmere-scarf', 'echarpe-cachemire-beige');

      if (!pairedProducts.has(key)) {
        pairedProducts.set(key, { frPath: '', enPath: '' });
      }
      const pair = pairedProducts.get(key)!;
      const fullPath = `/collections/${p.category}/${p.subCategory}/${p.productSlug}`;
      if (isEnglish) {
        pair.enPath = fullPath;
      } else {
        pair.frPath = fullPath;
      }
    }

    for (const [, paths] of pairedProducts.entries()) {
      const frPath = paths.frPath || paths.enPath;
      const enPath = paths.enPath || paths.frPath;

      entries.push({
        url: `${BASE_URL}/fr${frPath}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr${frPath}`,
            en: `${BASE_URL}/en${enPath}`,
            'x-default': `${BASE_URL}/fr${frPath}`,
          },
        },
      });

      entries.push({
        url: `${BASE_URL}/en${enPath}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr${frPath}`,
            en: `${BASE_URL}/en${enPath}`,
            'x-default': `${BASE_URL}/fr${frPath}`,
          },
        },
      });
    }
  } catch (err) {
    console.warn('[Sitemap] Could not fetch products:', err);
  }

  // 4. Dynamic Journal Articles (Journal Silo)
  try {
    const journalPosts = await getJournalPosts('fr');
    for (const post of journalPosts) {
      const frPostPath = `/journal/${post.category}/${post.slug.fr}`;
      const enPostPath = `/journal/${post.category}/${post.slug.en}`;

      entries.push({
        url: `${BASE_URL}/fr${frPostPath}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.75,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr${frPostPath}`,
            en: `${BASE_URL}/en${enPostPath}`,
            'x-default': `${BASE_URL}/fr${frPostPath}`,
          },
        },
      });

      entries.push({
        url: `${BASE_URL}/en${enPostPath}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.75,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr${frPostPath}`,
            en: `${BASE_URL}/en${enPostPath}`,
            'x-default': `${BASE_URL}/fr${frPostPath}`,
          },
        },
      });
    }
  } catch (err) {
    console.warn('[Sitemap] Could not fetch journal posts:', err);
  }

  return entries;
}
