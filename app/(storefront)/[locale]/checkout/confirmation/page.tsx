'use client';
// CLIENT: Post-purchase luxury order confirmation, atelier timeline and concierge contact

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Package, Sparkles, Truck, ShieldCheck, ArrowRight, Phone, Loader2 } from 'lucide-react';

interface ConfirmationPageProps {
  params: { locale: string };
}

function ConfirmationContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const isEn = locale === 'en';

  const orderNumber = searchParams.get('orderNumber') || 'HV-CONFIRMED';
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24 text-center space-y-10">
      {/* Top Crest / Check */}
      <div className="space-y-4">
        <div className="w-16 h-16 rounded-full border border-gold bg-gold/10 flex items-center justify-center mx-auto text-gold">
          <Sparkles className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-mono tracking-widest text-taupe uppercase block">
            {isEn ? 'Official Haute Couture Receipt' : 'Récépissé Officiel de Haute Fourrure'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-black">
            {isEn ? 'Thank you for your acquisition' : 'Nous vous remercions pour votre confiance'}
          </h1>
          <p className="text-xs text-charcoal max-w-lg mx-auto leading-relaxed pt-1">
            {isEn
              ? 'Your commission has been officially confirmed and transmitted to our master furriers in Paris.'
              : 'Votre commande a été confirmée et transmise à nos maîtres artisans fourreurs au sein de nos ateliers parisiens.'}
          </p>
        </div>

        {/* Order Reference Card */}
        <div className="inline-block bg-ivory border border-charcoal/20 px-6 py-3 mt-2 shadow-xs">
          <span className="text-[10px] text-charcoal/60 uppercase tracking-widest block">
            {isEn ? 'Order Reference' : 'Numéro de Commande'}
          </span>
          <span className="font-mono text-base font-semibold text-black tracking-wider">
            {orderNumber}
          </span>
        </div>
      </div>

      {/* Atelier Timeline */}
      <div className="bg-ivory border border-charcoal/20 p-6 sm:p-8 text-left space-y-6">
        <h2 className="font-serif text-lg text-black border-b border-charcoal/10 pb-3 flex items-center justify-between">
          <span>{isEn ? 'Atelier Confection & Delivery Timeline' : 'Étapes de Préparation & Livraison'}</span>
          <span className="text-[11px] text-taupe font-sans tracking-widest uppercase">
            {isEn ? 'White Glove Protocol' : 'Protocole Haute Sécurité'}
          </span>
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              ✓
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-black">
                {isEn ? 'Payment Confirmed & Authenticated' : 'Règlement Confirmé & Authentifié'}
              </h3>
              <p className="text-xs text-charcoal mt-0.5">
                {isEn
                  ? 'Your transaction has been securely processed. A formal digital invoice has been sent to your email.'
                  : 'Votre transaction a été validée. La facture d’acquisition détaillée a été expédiée à votre adresse courriel.'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full border border-charcoal/30 bg-ivory text-black flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-black">
                {isEn ? 'Atelier Quality Inspection & Certificate' : 'Inspection d’Atelier & Certificat Furmark®'}
              </h3>
              <p className="text-xs text-charcoal mt-0.5">
                {isEn
                  ? 'Our master furrier inspects every pelt, lining, and seam, and seals the individual traceability passport.'
                  : 'Notre maître artisan inspecte minutieusement chaque peau, doublure et finition, et appose le sceau de traçabilité.'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full border border-charcoal/30 bg-ivory text-black flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-black">
                {isEn ? 'Insured Specialized Hand Delivery' : 'Expédition Scellée & Remise en Main Propre'}
              </h3>
              <p className="text-xs text-charcoal mt-0.5">
                {isEn
                  ? 'Delivered in discreet, climate-protected packaging by dedicated courier with direct appointment.'
                  : 'Acheminement dans une housse de protection scellée par transporteur dédié avec prise de rendez-vous préalable.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Concierge Direct Line */}
      <div className="bg-charcoal/5 border border-charcoal/15 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal">
        <div className="flex items-center gap-3 text-left">
          <Phone className="w-5 h-5 text-gold shrink-0" />
          <div>
            <span className="font-semibold text-black uppercase tracking-wider text-[11px] block">
              {isEn ? 'Private Concierge Direct Line' : 'Ligne Directe Conciergerie Privée'}
            </span>
            <span className="text-charcoal">+33 1 42 68 00 00 · concierge@lhermineetlevair.com</span>
          </div>
        </div>
        <Link
          href={`/${locale}/contact?order=${encodeURIComponent(orderNumber)}`}
          className="text-black font-semibold uppercase tracking-wider text-[11px] hover:underline whitespace-nowrap"
        >
          {isEn ? 'Inquire about your order' : 'Poser une question'}
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {orderId && (
          <Link
            href={`/${locale}/account/orders`}
            className="w-full sm:w-auto py-3.5 px-6 text-xs uppercase tracking-widest bg-gold text-black hover:bg-gold/90 font-semibold transition-colors text-center"
          >
            {isEn ? 'View My Orders' : 'Consulter Mon Compte'}
          </Link>
        )}

        <Link
          href={`/${locale}/collections`}
          className="w-full sm:w-auto py-3.5 px-6 text-xs uppercase tracking-widest border border-charcoal text-black hover:border-black hover:bg-black/5 font-medium transition-colors text-center"
        >
          {isEn ? 'Continue Exploring Collections' : 'Poursuivre la Visite des Collections'}
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutConfirmationPage({ params: { locale } }: ConfirmationPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-taupe" />
        </div>
      }
    >
      <ConfirmationContent locale={locale} />
    </Suspense>
  );
}
