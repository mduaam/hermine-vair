import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface PrivacyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "Privacy Policy & GDPR Compliance | L'Hermine et le Vair"
      : "Politique de Confidentialité & RGPD | L'Hermine et le Vair",
    description: isEn
      ? "Privacy policy, data protection, and GDPR rights for clients of L'Hermine et le Vair."
      : "Protection des données personnelles, conformité RGPD et gestion des cookies par L'Hermine et le Vair.",
    alternates: generateAlternates('/legal/confidentialite', locale),
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Privacy Policy' : 'Confidentialité', href: `/${locale}/legal/confidentialite` },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-4 pt-4">
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-wide">
            {isEn ? 'Privacy & Data Protection Policy' : 'Politique de Confidentialité & RGPD'}
          </h1>
        </header>

        <div className="prose prose-lg max-w-none text-muted font-light space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-xl text-primary font-normal">
              {isEn ? '1. Collection of Personal Data' : '1. Collecte des Données'}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              La Maison L’Hermine et le Vair attache la plus haute importance à la confidentialité de ses clients. Les informations collectées lors de vos commandes ou prises de rendez-vous (nom, adresses, email, téléphone) sont exclusivement destinées au traitement sécurisé de vos achats et au service de conciergerie personnalisé.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-primary font-normal">
              {isEn ? '2. Payment Security (PCI-DSS)' : '2. Sécurité des Règlements'}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Aucune coordonnée bancaire complète n’est stockée sur nos serveurs. L’intégralité des transactions est cryptée et déléguée à notre partenaire de paiement certifié PCI-DSS Niveau 1 (Stripe Inc.).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-primary font-normal">
              {isEn ? '3. Your GDPR Rights' : '3. Vos Droits Informatique & Libertés'}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d’un droit d’accès, de rectification, de portabilité et de suppression de l’ensemble de vos données en adressant une simple demande à notre Délégué à la Protection des Données : privacy@lhermineetlevair.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
