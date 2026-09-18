import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface CGVProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: CGVProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "General Terms & Conditions of Sale | L'Hermine et le Vair"
      : "Conditions Générales de Vente | L'Hermine et le Vair",
    description: isEn
      ? "General terms and conditions of sale for bespoke and haute fourrure creations by L'Hermine et le Vair."
      : "Conditions Générales de Vente applicables aux commandes passées auprès de la Maison L'Hermine et le Vair.",
    alternates: generateAlternates('/legal/cgv', locale),
  };
}

export default async function CGVPage({ params }: CGVProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'Terms of Sale' : 'Conditions de Vente', href: `/${locale}/legal/cgv` },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <header className="space-y-4 pt-4">
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-wide">
            {isEn ? 'General Terms and Conditions of Sale' : 'Conditions Générales de Vente'}
          </h1>
        </header>

        <div className="prose prose-lg max-w-none text-muted font-light space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-xl text-primary font-normal">
              {isEn ? '1. Scope of Application' : '1. Champ d’Application'}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Les présentes Conditions Générales de Vente (CGV) régissent sans réserve l’ensemble des ventes de pièces de haute fourrure et créations d’exception conclues entre la Maison L’Hermine et le Vair et ses clients sur le site officiel ou par le canal de sa conciergerie privée.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-primary font-normal">
              {isEn ? '2. Prices & Delivered Duty Paid (DDP)' : '2. Prix & Droits de Douane'}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Les prix sont exprimés en Euros (€), toutes taxes comprises (TTC) pour les pays de l’Union Européenne, et en Rendu Droits Acquittés (DDP) pour les destinations internationales éligibles (USA, Royaume-Uni, Suisse, etc.).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-primary font-normal">
              {isEn ? '3. Right of Withdrawal & 30-Day Returns' : '3. Droit de Rétractation & Retours sous 30 Jours'}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Conformément à la législation européenne, le client dispose d’un délai de rétractation de 30 jours calendaires à compter de la réception de sa commande pour solliciter un retour gracieux auprès de la conciergerie, sous condition expresse que la pièce soit retournée dans son état d’origine, avec tous ses scellés de sécurité intacts et dans son coffret protecteur d’art.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
