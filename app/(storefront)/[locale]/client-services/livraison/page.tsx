import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Globe } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface LivraisonPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: LivraisonPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Shipping, Customs & Returns Policy | L'Hermine et le Vair"
      : "Expéditions, Douanes & Retours | L'Hermine et le Vair",
    description: isEn
      ? "Detailed information on insured white-glove shipping, pre-cleared customs duties (DDP), and our 30-day return policy."
      : "Toutes les modalités d'expédition sécurisée, dédouanement DDP inclus et retours sous 30 jours.",
    alternates: generateAlternates('/client-services/livraison', locale),
  };
}

export default async function LivraisonPage({ params }: LivraisonPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Client Services' : 'Services Clientèle', href: `/${locale}/client-services` },
    { label: isEn ? 'Shipping & Returns' : 'Expéditions & Retours', href: `/${locale}/client-services/livraison` },
  ];

  const policies = [
    {
      icon: ShieldCheck,
      title: isEn ? 'High-Value Insured Transit' : 'Transport Haute Valeur Sous Scellé',
      desc: isEn
        ? 'Every garment is enclosed within an archival travel case, sealed in tamper-evident security packaging, and insured for 100% of its value during transit.'
        : 'Chaque création voyage sous housse d’art respirante et scellé de sécurité inviolable, avec une assurance tous risques intégrale pendant tout le transport.',
    },
    {
      icon: Globe,
      title: isEn ? 'Pre-Paid Duties & Customs (DDP)' : 'Droits de Douane & Taxes Inclus (DDP)',
      desc: isEn
        ? 'For international orders (USA, UK, Switzerland, Japan, etc.), import duties and taxes are calculated and collected directly at checkout. No unexpected fees will be requested upon arrival.'
        : 'Pour l’ensemble des destinations internationales, les taxes et droits de douane sont acquittés lors de votre commande. Aucun frais imprévu ne vous sera réclamé.',
    },
    {
      icon: RefreshCw,
      title: isEn ? 'Complimentary 30-Day Returns' : 'Retours Offerts sous 30 Jours',
      desc: isEn
        ? 'If your piece does not meet your expectations, we offer complimentary return pickup via our secure courier within 30 days of delivery, provided security tags remain intact.'
        : 'Si la pièce ne répondait pas à toutes vos attentes, nous organisons l’enlèvement sécurisé à votre domicile sous 30 jours, sous réserve que les scellés de sécurité soient intacts.',
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-4 text-center max-w-2xl mx-auto pt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'White-Glove Delivery' : 'Livraison Haute Sécurité'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'Shipping & Returns' : 'Expéditions & Retours'}
          </h1>
          <p className="font-sans text-base text-muted font-light leading-relaxed">
            {isEn
              ? 'Peace of mind from our Paris atelier to your residence anywhere in the world.'
              : 'Une sérénité absolue de notre atelier parisien jusqu’à votre domicile.'}
          </p>
        </header>

        <div className="space-y-6">
          {policies.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="p-8 bg-surface border border-border flex items-start gap-6">
                <div className="p-3 bg-background border border-border text-gold flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-serif text-xl text-primary font-normal">{p.title}</h2>
                  <p className="font-sans text-sm sm:text-base text-muted font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sub-silo Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <Link
            href={`/${locale}/client-services/livraison/expeditions-internationales`}
            className="p-6 bg-surface border border-border hover:border-gold transition-colors space-y-2 group"
          >
            <h3 className="font-serif text-lg text-primary group-hover:text-gold flex items-center justify-between">
              <span>{isEn ? 'International Expeditions' : 'Expéditions Internationales'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="font-sans text-xs text-muted font-light">
              {isEn ? 'Transit times and armored couriers.' : 'Délais et transporteurs spécialisés.'}
            </p>
          </Link>

          <Link
            href={`/${locale}/client-services/livraison/droits-de-douane`}
            className="p-6 bg-surface border border-border hover:border-gold transition-colors space-y-2 group"
          >
            <h3 className="font-serif text-lg text-primary group-hover:text-gold flex items-center justify-between">
              <span>{isEn ? 'Customs Duties & Taxes' : 'Droits de Douane & DDP'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="font-sans text-xs text-muted font-light">
              {isEn ? 'Breakdown of international import rules.' : 'Détail des formalités douanières.'}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
