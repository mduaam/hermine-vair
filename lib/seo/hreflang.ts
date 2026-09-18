import type { Metadata } from 'next';

const LOCALES = ['fr', 'en'] as const;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lhermineetlevair.com';

export function generateAlternates(
  path: string | { fr: string; en: string },
  currentLocale: string = 'fr'
): NonNullable<Metadata['alternates']> {
  if (typeof path === 'string') {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return {
      canonical: `${BASE_URL}/${currentLocale}${cleanPath}`,
      languages: {
        fr: `${BASE_URL}/fr${cleanPath}`,
        en: `${BASE_URL}/en${cleanPath}`,
        'x-default': `${BASE_URL}/fr${cleanPath}`,
      },
    };
  }

  const cleanFr = path.fr.startsWith('/') ? path.fr : `/${path.fr}`;
  const cleanEn = path.en.startsWith('/') ? path.en : `/${path.en}`;
  const currentClean = currentLocale === 'en' ? cleanEn : cleanFr;

  return {
    canonical: `${BASE_URL}/${currentLocale}${currentClean}`,
    languages: {
      fr: `${BASE_URL}/fr${cleanFr}`,
      en: `${BASE_URL}/en${cleanEn}`,
      'x-default': `${BASE_URL}/fr${cleanFr}`,
    },
  };
}

