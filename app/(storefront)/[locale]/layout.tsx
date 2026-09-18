import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { playfair, inter } from '@/lib/fonts';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { MobileBottomNav } from '@/components/storefront/MobileBottomNav';
import '@/app/globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'site' });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lhermineetlevair.com'),
    title: {
      default: t('title'),
      template: `%s | ${t('brandName')}`,
    },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: '/fr',
        en: '/en',
        'x-default': '/fr',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      siteName: t('brandName'),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function StorefrontLayout({ children, params: { locale } }: RootLayoutProps) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const activeLocale = locale as 'fr' | 'en';

  return (
    <html lang={locale} className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-ivory text-black font-sans antialiased flex flex-col selection:bg-gold selection:text-black">
        <CartProvider>
          <Header locale={activeLocale} />
          <div className="flex-1 flex flex-col pb-16 md:pb-0">
            {children}
          </div>
          <Footer locale={activeLocale} />
          <MobileBottomNav locale={activeLocale} />
          <CartDrawer locale={activeLocale} />
        </CartProvider>
      </body>
    </html>
  );
}
