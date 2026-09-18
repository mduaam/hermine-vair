import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactClientView } from '@/components/storefront/ContactClientView';
import { generateAlternates } from '@/lib/seo/hreflang';
import { buildBreadcrumbJsonLd } from '@/lib/seo/jsonld';

interface ContactPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Private Concierge & Appointments | 15 Rue de la Paix | L'Hermine et le Vair"
      : "Conciergerie Privée & Rendez-Vous | 15 Rue de la Paix | L'Hermine et le Vair",
    description: isEn
      ? "Contact our private concierge for bespoke commissions, private Paris salon appointments, or fine fur vault storage."
      : "Contactez notre conciergerie privée pour toute commande spéciale, prise de rendez-vous en salon ou gardiennage estival.",
    alternates: generateAlternates('/client-services/contact', locale),
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Client Services' : 'Services Clientèle', href: `/${locale}/client-services` },
    { label: isEn ? 'Contact & Concierge' : 'Contact & Conciergerie', href: `/${locale}/client-services/contact` },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <div className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-4 text-center max-w-2xl mx-auto pt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Personalized Service' : 'Service d’Exception'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'Concierge & Private Appointments' : 'Conciergerie & Salons Privés'}
          </h1>
          <p className="font-sans text-base text-muted font-light leading-relaxed">
            {isEn
              ? 'Our advisors in Paris remain devoted to ensuring an effortless experience tailored to your wishes.'
              : 'Notre conciergerie de la Rue de la Paix se tient à votre disposition pour vous offrir un accompagnement sur-mesure.'}
          </p>
        </header>

        <ContactClientView locale={locale} />
      </div>
    </div>
  );
}
