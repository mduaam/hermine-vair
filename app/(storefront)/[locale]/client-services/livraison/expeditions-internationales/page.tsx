import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, ShieldCheck, Truck } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface ExpeditionsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ExpeditionsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "International Expeditions & White-Glove Transit | L'Hermine et le Vair"
      : "Expéditions Internationales & Transport Sécurisé | L'Hermine et le Vair",
    description: isEn
      ? "Discover our international white-glove courier delivery times: 24h France/EU, 3-5 days North America, Middle East and Asia."
      : "Découvrez nos délais de livraison internationale sécurisée : 24h en France et Europe, 3 à 5 jours en Amérique du Nord et Asie.",
    alternates: generateAlternates('/client-services/livraison/expeditions-internationales', locale),
  };
}

export default async function ExpeditionsPage({ params }: ExpeditionsPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Client Services' : 'Services Clientèle', href: `/${locale}/client-services` },
    { label: isEn ? 'Shipping' : 'Livraison', href: `/${locale}/client-services/livraison` },
    { label: isEn ? 'International Expeditions' : 'Expéditions Internationales', href: `/${locale}/client-services/livraison/expeditions-internationales` },
  ];

  const zones = [
    {
      region: isEn ? 'France (Paris & Provinces)' : 'France (Paris & Régions)',
      time: '24h – 48h',
      carrier: isEn ? 'Private White-Glove Chauffeur / Express Security' : 'Chauffeur Privé Paris / Express Sécurisé',
    },
    {
      region: isEn ? 'European Union & Switzerland' : 'Union Européenne & Suisse',
      time: '24h – 48h',
      carrier: isEn ? 'Specialized Armored Courier (DHL Medical & High Value / Ferrari Logistics)' : 'Transporteur Spécialisé Haute Valeur (Ferrari Logistics / DHL Express)',
    },
    {
      region: isEn ? 'United States & Canada' : 'États-Unis & Canada',
      time: '2 – 4 Business Days',
      carrier: isEn ? 'FedEx Priority Priority Customs Clearance' : 'FedEx Priority avec Prédéclaration Douanière',
    },
    {
      region: isEn ? 'Middle East & Asia-Pacific' : 'Moyen-Orient & Asie-Pacifique',
      time: '3 – 5 Business Days',
      carrier: isEn ? 'Global High-Value Courier' : 'Transporteur International Haute Valeur',
    },
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
            {isEn ? 'Global White-Glove Logistics' : 'Logistique d’Exception'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'International Expeditions' : 'Expéditions Internationales'}
          </h1>
        </header>

        <div className="space-y-4 pt-4">
          {zones.map((zone, i) => (
            <div key={i} className="p-6 bg-surface border border-border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="font-serif text-lg text-primary">{zone.region}</h2>
                <p className="font-sans text-xs text-muted font-light">{zone.carrier}</p>
              </div>
              <div className="flex items-center gap-2 text-gold text-sm uppercase tracking-wider font-medium">
                <Clock className="w-4 h-4" />
                <span>{zone.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
