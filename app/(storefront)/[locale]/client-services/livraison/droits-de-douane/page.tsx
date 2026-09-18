import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Shield } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface DouanePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: DouanePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Customs Duties & Taxes (DDP) | L'Hermine et le Vair"
      : "Droits de Douane & DDP | L'Hermine et le Vair",
    description: isEn
      ? "Clear explanation of our Delivered Duty Paid (DDP) service: zero surprise tariffs, all international taxes included at checkout."
      : "Explication de notre service DDP : formalités douanières prises en charge, aucune taxe surprise à la livraison.",
    alternates: generateAlternates('/client-services/livraison/droits-de-douane', locale),
  };
}

export default async function DouanePage({ params }: DouanePageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Client Services' : 'Services Clientèle', href: `/${locale}/client-services` },
    { label: isEn ? 'Shipping' : 'Livraison', href: `/${locale}/client-services/livraison` },
    { label: isEn ? 'Customs Duties' : 'Droits de Douane', href: `/${locale}/client-services/livraison/droits-de-douane` },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <Link
          href={`/${locale}/client-services/livraison`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? 'Back to Shipping' : 'Retour aux Expéditions'}</span>
        </Link>

        <header className="space-y-4 text-center max-w-2xl mx-auto pt-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Transparent Pricing' : 'Transparence Absolue'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'Customs Duties & Taxes (DDP)' : 'Droits de Douane & DDP'}
          </h1>
        </header>

        <div className="p-8 bg-surface border border-gold/40 space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <Shield className="w-6 h-6" />
            <h2 className="font-serif text-xl text-primary font-normal">
              {isEn ? 'Delivered Duty Paid (DDP) Guarantee' : 'Garantie Rendu Droits Acquittés (DDP)'}
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-muted font-light leading-relaxed">
            {isEn
              ? 'L’Hermine et le Vair ships on a DDP (Delivered Duty Paid) basis to the United States, United Kingdom, Switzerland, Canada, Japan, and the UAE. This means that all applicable customs import duties, federal taxes, and local VAT are fully calculated and included in the final price at checkout. The carrier will never ask you for additional payment upon delivery.'
              : 'Notre Maison expédie en modalité DDP (Rendu Droits Acquittés) vers les États-Unis, le Royaume-Uni, la Suisse, le Canada, le Japon et les Émirats. Tous les droits de douane et taxes d’importation sont acquittés lors de votre paiement. Vous n’aurez absolument aucun frais supplémentaire à régler lors de la réception de votre colis.'}
          </p>
        </div>
      </div>
    </div>
  );
}
