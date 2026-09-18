import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FaqClientView } from '@/components/storefront/FaqClientView';
import { getFaqs } from '@/lib/sanity/client';
import { generateAlternates } from '@/lib/seo/hreflang';
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from '@/lib/seo/jsonld';

interface FaqPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: FaqPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Frequently Asked Questions | Concierge & Care | L'Hermine et le Vair"
      : "Foire Aux Questions | Conciergerie & Soin | L'Hermine et le Vair",
    description: isEn
      ? "Answers to frequently asked questions on insured delivery, bespoke fittings, summer vault storage, and secure payment."
      : "Toutes les réponses concernant la livraison haute sécurité, les rendez-vous privés, le gardiennage estival et nos créations.",
    alternates: generateAlternates('/client-services/faq', locale),
  };
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const faqs = await getFaqs(locale);

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Client Services' : 'Services Clientèle', href: `/${locale}/client-services` },
    { label: isEn ? 'FAQ' : 'Questions Fréquentes', href: `/${locale}/client-services/faq` },
  ];

  const faqJsonLd = buildFaqJsonLd({
    items: faqs.map((f) => ({
      question: isEn ? f.question.en : f.question.fr,
      answer: isEn ? f.answer.en : f.answer.fr,
    })),
    url: `/${locale}/client-services/faq`,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <div className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-4 text-center max-w-2xl mx-auto pt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Concierge Assistance' : 'Assistance Conciergerie'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'Frequently Asked Questions' : 'Questions Fréquentes'}
          </h1>
          <p className="font-sans text-base text-muted font-light leading-relaxed">
            {isEn
              ? 'Find answers regarding bespoke orders, insured white-glove transit, and fine fur preservation.'
              : 'Retrouvez les réponses essentielles concernant vos commandes, la livraison sécurisée et l’entretien de vos pièces.'}
          </p>
        </header>

        <FaqClientView faqs={faqs} locale={locale} />

        {/* Contact CTA */}
        <div className="p-8 bg-surface border border-gold/40 text-center max-w-xl mx-auto space-y-4">
          <h2 className="font-serif text-xl text-primary font-normal">
            {isEn ? 'Have a Specific Request?' : 'Une Question Particulière ?'}
          </h2>
          <p className="font-sans text-sm text-muted font-light leading-relaxed">
            {isEn
              ? 'Our private concierge is available 7 days a week to accompany your requests.'
              : 'Notre conciergerie privée se tient à votre entière disposition pour tout conseil personnalisé.'}
          </p>
          <Link
            href={`/${locale}/client-services/contact`}
            className="inline-block px-8 py-3.5 bg-primary text-background text-xs uppercase tracking-widest font-medium hover:bg-gold hover:text-primary transition-colors"
          >
            {isEn ? 'Contact the Concierge' : 'Contacter la Conciergerie'}
          </Link>
        </div>
      </div>
    </div>
  );
}
