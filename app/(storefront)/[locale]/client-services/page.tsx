import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, HelpCircle, Mail, Truck, Ruler, Shield, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface ClientServicesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ClientServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Client Services & Concierge | L'Hermine et le Vair"
      : "Services Clientèle & Conciergerie | L'Hermine et le Vair",
    description: isEn
      ? "Experience our bespoke client services: private Paris salon appointments, high-security insured shipping, sizing guide, and care assistance."
      : "Nos services d'exception : conciergerie privée, expéditions internationales sécurisées, guide des tailles et assistance personnalisée.",
    alternates: generateAlternates('/client-services', locale),
  };
}

export default async function ClientServicesPage({ params }: ClientServicesPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Client Services' : 'Services Clientèle', href: `/${locale}/client-services` },
  ];

  const sections = [
    {
      icon: HelpCircle,
      title: isEn ? 'Frequently Asked Questions' : 'Foire Aux Questions',
      desc: isEn
        ? 'Find comprehensive answers regarding care, payment options, vault storage, and returns.'
        : 'Retrouvez toutes les réponses sur nos confections, moyens de règlement, gardiennage et retours.',
      href: `/${locale}/client-services/faq`,
    },
    {
      icon: Mail,
      title: isEn ? 'Private Concierge & Salons' : 'Conciergerie & Salons Privés',
      desc: isEn
        ? 'Book an exclusive fitting at our Rue de la Paix salons or submit a special bespoke commission.'
        : 'Réservez un salon privé à Paris ou adressez-nous votre projet de création sur-mesure.',
      href: `/${locale}/client-services/contact`,
    },
    {
      icon: Truck,
      title: isEn ? 'Shipping, Customs & Delivery' : 'Livraison, Douanes & Retours',
      desc: isEn
        ? 'White-glove armored courier transit, DDP duty pre-clearance, and 30-day return policy.'
        : 'Transport sécurisé haute valeur, droits de douane DDP inclus et politique de retours sous 30 jours.',
      href: `/${locale}/client-services/livraison`,
    },
    {
      icon: Ruler,
      title: isEn ? 'Size & Measurements Guide' : 'Guide des Tailles & Mesures',
      desc: isEn
        ? 'Precision sizing tables and instructions on how to measure your silhouette for haute fourrure.'
        : 'Tableaux comparatifs et conseils pour prendre vos mensurations avec une précision de haute couture.',
      href: `/${locale}/client-services/tailles`,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-4 text-center max-w-2xl mx-auto pt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'At Your Service' : 'À Votre Écoute'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'Client Services' : 'Les Services de la Maison'}
          </h1>
          <p className="font-sans text-base text-muted font-light leading-relaxed">
            {isEn
              ? 'Devoted to providing an impeccable, serene experience across every step of your journey.'
              : 'Une attention sur-mesure dédiée à faire de chaque instant une expérience d’exception.'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <Link
                key={idx}
                href={sec.href}
                className="group p-8 bg-surface border border-border hover:border-gold transition-colors space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="p-3 bg-background border border-border text-gold w-fit group-hover:bg-gold group-hover:text-primary transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl text-primary font-normal group-hover:text-gold transition-colors flex items-center justify-between">
                    <span>{sec.title}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-gold" />
                  </h2>
                  <p className="font-sans text-sm text-muted font-light leading-relaxed">
                    {sec.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
