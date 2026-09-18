import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default function middleware(req: NextRequest) {
  const response = intlMiddleware(req);

  // Pass through country code if available from Netlify edge headers
  const country = req.headers.get('x-country') || req.headers.get('x-nf-country-code');
  if (country) {
    response.headers.set('x-user-country', country);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - /api, /_next, /_vercel, /admin, /studio
    // - static files with extensions (e.g. favicon.ico, images)
    '/((?!api|_next|_vercel|admin|studio|.*\\..*).*)',
  ],
};
