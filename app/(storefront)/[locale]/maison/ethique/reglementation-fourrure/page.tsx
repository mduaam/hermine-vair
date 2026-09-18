import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, CheckCircle, Globe2, ShieldAlert } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateAlternates } from '@/lib/seo/hreflang';

interface ReglementationPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ReglementationPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: isEn
      ? "International Fur Regulations & Legal Compliance | L'Hermine et le Vair"
      : "Réglementation Internationale de la Fourrure | L'Hermine et le Vair",
    description: isEn
      ? "Comprehensive legal overview: California AB 44 fur sales restrictions, EU animal welfare directives, UK trade laws, and CITES compliance."
      : "Cadre juridique international : loi californienne AB 44, directives européennes, législation britannique et conformité CITES.",
    alternates: generateAlternates('/maison/ethique/reglementation-fourrure', locale),
  };
}

export default async function ReglementationPage({ params }: ReglementationPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'The Maison' : 'La Maison', href: `/${locale}/maison` },
    { label: isEn ? 'Ethics' : 'Éthique', href: `/${locale}/maison/ethique` },
    { label: isEn ? 'Fur Regulations' : 'Réglementation Fourrure', href: `/${locale}/maison/ethique/reglementation-fourrure` },
  ];

  const regulations = [
    {
      region: isEn ? 'European Union & Switzerland' : 'Union Européenne & Suisse',
      status: 'allowed',
      title: isEn ? 'Full Compliance with WelFur & REACH' : 'Conformité WelFur & Réglementation REACH',
      details: isEn
        ? 'Fur apparel crafted from certified farmed species (such as American mink and silver fox) is completely lawful for commerce throughout the EU. All pieces conform to European Directive (EC) No 1007/2009 and REACH chemical safety standards.'
        : 'Le commerce de vêtements en fourrure certifiée d’élevage (vison, renard) est légal et encadré dans l’ensemble de l’Union Européenne. Toutes nos pièces respectent le règlement (CE) n°1007/2009 et les normes REACH.',
    },
    {
      region: isEn ? 'United States (State of California - AB 44)' : 'États-Unis (État de Californie - Loi AB 44)',
      status: 'restricted',
      title: isEn ? 'California AB 44 Fur Sales Restriction' : 'Restriction de Vente de Fourrure Neuve en Californie',
      details: isEn
        ? 'Under California Assembly Bill 44, the sale and delivery of new genuine fur apparel to shipping addresses located within the State of California is strictly prohibited. Our automated checkout system dynamically enforces this regional restriction. Orders containing pure fur items destined for California cannot be processed. Pure cashmere and wool creations remain fully eligible for delivery to California.'
        : 'Conformément à la loi californienne Assembly Bill 44, la vente et la livraison de vêtements neufs en fourrure naturelle à destination d’adresses situées dans l’État de Californie sont strictement interdites. Notre système de commande applique automatiquement ce filtre légal lors de la saisie de l’adresse de livraison. Nos créations en pur cachemire ou laine vierge restent quant à elles livrables en Californie.',
    },
    {
      region: isEn ? 'United States (All Other States)' : 'États-Unis (Autres États)',
      status: 'allowed',
      title: isEn ? 'Federal Compliance & US Fish and Wildlife' : 'Conformité Fédérale & US Fish and Wildlife',
      details: isEn
        ? 'Fur sales to 49 US States (excluding California) are fully lawful and cleared through US Fish and Wildlife Service (USFWS) import declarations, with duties pre-calculated at checkout (DDP).'
        : 'La vente de fourrures certifiées vers les 49 autres États américains est pleinement autorisée et fait l’objet de déclarations d’importation USFWS conformes avec dédouanement DDP à la commande.',
    },
    {
      region: isEn ? 'United Kingdom' : 'Royaume-Uni',
      status: 'allowed',
      title: isEn ? 'Import Compliance post-Brexit' : 'Conformité aux Normes d’Importation Post-Brexit',
      details: isEn
        ? 'Imports of certified fur garments into the United Kingdom are permitted under current UK DEFRA standards. HM Revenue & Customs declarations and import VAT are handled directly by our carrier.'
        : 'L’importation de pièces en fourrure certifiée au Royaume-Uni est autorisée sous le contrôle du DEFRA. La TVA d’importation et les formalités douanières sont intégralement prises en charge.',
    },
    {
      region: isEn ? 'State of Israel' : 'État d’Israël',
      status: 'restricted',
      title: isEn ? 'National Commercial Fur Ban' : 'Interdiction Commerciale Nationale',
      details: isEn
        ? 'Under Israeli national legislation enacted in 2021, the commercial import and sale of fur apparel is banned (with religious exemptions). In accordance with this law, L’Hermine et le Vair does not dispatch fur orders to addresses in Israel.'
        : 'En application de la loi israélienne de 2021 interdisant le commerce de la fourrure de mode, notre Maison n’expédie aucune pièce en fourrure vers le territoire israélien.',
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <Link
          href={`/${locale}/maison/ethique`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? 'Back to Ethics' : 'Retour à l’Éthique'}</span>
        </Link>

        <header className="space-y-4 text-center max-w-2xl mx-auto pt-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {isEn ? 'Legal Transparency & Compliance' : 'Transparence & Rigueur Juridique'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal tracking-wide">
            {isEn ? 'International Fur Regulations' : 'Réglementations Internationales'}
          </h1>
          <p className="font-sans text-sm sm:text-base text-muted font-light leading-relaxed">
            {isEn
              ? 'L’Hermine et le Vair enforces total legal compliance across every international territory, respecting both global conventions and local statutes.'
              : 'Notre Maison applique avec rigueur le droit international et les spécificités législatives de chaque territoire de livraison.'}
          </p>
        </header>

        <div className="space-y-6 pt-4">
          {regulations.map((reg, idx) => (
            <div
              key={idx}
              className={`p-6 bg-surface border ${
                reg.status === 'restricted' ? 'border-gold/60' : 'border-border'
              } space-y-3`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-widest text-primary font-medium flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-gold" />
                  {reg.region}
                </span>
                <span
                  className={`px-3 py-1 text-[11px] uppercase tracking-wider font-medium ${
                    reg.status === 'restricted'
                      ? 'bg-gold/20 text-gold border border-gold/40'
                      : 'bg-primary/10 text-primary border border-border'
                  }`}
                >
                  {reg.status === 'restricted'
                    ? isEn
                      ? 'Regional Restriction Enforced'
                      : 'Restriction Régionale Appliquée'
                    : isEn
                    ? 'Authorized Delivery'
                    : 'Livraison Autorisée'}
                </span>
              </div>

              <h2 className="font-serif text-lg text-primary font-normal">{reg.title}</h2>
              <p className="font-sans text-sm text-muted leading-relaxed font-light">{reg.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
