'use client';
// CLIENT: Stripe PaymentElement mounting, client-side payment confirmation and 3DS handling

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StripePaymentSectionProps {
  locale: string;
  orderNumber: string;
  orderId: string;
  totalAmount: number;
  currency: string;
}

export function StripePaymentSection({
  locale,
  orderNumber,
  orderId,
  totalAmount,
  currency,
}: StripePaymentSectionProps) {
  const stripe = useStripe();
  const elements = useElements();
  const isEn = locale === 'en';

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedTotal = new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: currency || 'EUR',
    maximumFractionDigits: 0,
  }).format(totalAmount);

  async function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const returnUrl = `${window.location.origin}/${locale}/checkout/return?orderId=${orderId}&orderNumber=${orderNumber}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    // If stripe.confirmPayment resolves, it means there was an immediate error (e.g. card declined)
    // Otherwise it redirects the browser to return_url
    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setErrorMessage(error.message || (isEn ? 'Payment failed.' : 'Paiement refusé.'));
      } else {
        setErrorMessage(
          isEn
            ? 'An unexpected error occurred with the payment provider.'
            : 'Une erreur inattendue est survenue avec le prestataire de paiement.'
        );
      }
      setIsProcessing(false);
    }
  }

  return (
    <form onSubmit={handlePaymentSubmit} className="space-y-6">
      <div className="border border-charcoal/20 bg-ivory p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal/10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-black">
            <Lock className="w-4 h-4 text-gold" />
            <span>{isEn ? 'Encrypted Payment' : 'Paiement Sécurisé & Chiffré'}</span>
          </div>
          <span className="text-[11px] text-charcoal/60">PCI-DSS Level 1</span>
        </div>

        {/* Stripe Payment Element (Renders Cards, Apple Pay, Google Pay, Klarna automatically) */}
        <div className="min-h-[200px]">
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        loading={isProcessing}
        className="w-full py-4 tracking-widest uppercase text-xs flex items-center justify-center gap-2"
      >
        <Lock className="w-3.5 h-3.5" />
        <span>
          {isProcessing
            ? isEn
              ? 'Authenticating Payment...'
              : 'Vérification bancaire en cours...'
            : isEn
            ? `Authorize Payment · ${formattedTotal}`
            : `Régler la Commande · ${formattedTotal}`}
        </span>
      </Button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-charcoal/60 text-center">
        <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
        <span>
          {isEn
            ? '3D Secure 2.0 authentication. Your banking details are never stored.'
            : 'Authentification 3D Secure 2.0. Vos coordonnées bancaires ne sont jamais enregistrées.'}
        </span>
      </div>
    </form>
  );
}
