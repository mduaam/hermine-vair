'use client';
// CLIENT: Stripe redirect return handler, verifies payment status and routes to confirmation

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface ReturnPageProps {
  params: { locale: string };
}

function ReturnContent({ locale }: { locale: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEn = locale === 'en';

  const paymentIntentId = searchParams.get('payment_intent');
  const fallbackOrderNumber = searchParams.get('orderNumber') || '';
  const fallbackOrderId = searchParams.get('orderId') || '';

  const [status, setStatus] = useState<'loading' | 'success' | 'processing' | 'failed'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentIntentId) {
      setStatus('failed');
      setErrorMessage(isEn ? 'Missing payment reference.' : 'Référence de paiement introuvable.');
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/checkout/verify?payment_intent=${paymentIntentId}`);
        const data = await res.json();

        if (data.status === 'succeeded') {
          setStatus('success');
          const orderId = data.orderId || fallbackOrderId;
          const orderNumber = data.orderNumber || fallbackOrderNumber;
          router.replace(`/${locale}/checkout/confirmation?orderId=${orderId}&orderNumber=${orderNumber}`);
        } else if (data.status === 'processing') {
          setStatus('processing');
        } else {
          setStatus('failed');
          setErrorMessage(
            isEn
              ? 'Payment authorization was not completed. Please try again or use another payment method.'
              : 'L’autorisation bancaire n’a pu aboutir. Veuillez réessayer avec un autre moyen de paiement.'
          );
        }
      } catch (err) {
        console.error('Verify error:', err);
        setStatus('failed');
        setErrorMessage(
          isEn ? 'Unable to confirm payment status.' : 'Impossible de vérifier l’état du paiement.'
        );
      }
    }

    verify();
  }, [paymentIntentId, fallbackOrderId, fallbackOrderNumber, locale, router, isEn]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-6">
        <Loader2 className="w-8 h-8 animate-spin text-taupe" />
        <h1 className="font-serif text-2xl text-black">
          {isEn ? 'Confirming Your Payment' : 'Validation Bancaire en Cours'}
        </h1>
        <p className="text-xs text-charcoal max-w-sm">
          {isEn
            ? 'Please wait while we secure your authorization and finalize your commission with the atelier.'
            : 'Veuillez patienter pendant la validation de votre règlement et la transmission de votre commande aux ateliers.'}
        </p>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-6">
        <RefreshCw className="w-8 h-8 animate-spin text-gold" />
        <h1 className="font-serif text-2xl text-black">
          {isEn ? 'Payment Processing' : 'Paiement en Cours de Traitement'}
        </h1>
        <p className="text-xs text-charcoal max-w-sm">
          {isEn
            ? 'Your payment is currently being processed by your bank. We will notify you by email as soon as it is confirmed.'
            : 'Votre règlement est en cours d’authentification par votre établissement bancaire. Vous recevrez un courriel dès confirmation.'}
        </p>
        <Link
          href={`/${locale}/account/orders`}
          className="mt-4 inline-flex items-center justify-center font-sans uppercase tracking-[0.14em] text-xs px-4 py-2 border border-charcoal text-black hover:border-black hover:bg-black/5 font-medium transition-colors"
        >
          {isEn ? 'View My Orders' : 'Consulter Mes Commandes'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full border border-red-200 bg-red-50 flex items-center justify-center mx-auto text-red-600">
        <AlertCircle className="w-8 h-8 stroke-[1.5]" />
      </div>
      <div className="space-y-2">
        <h1 className="font-serif text-2xl text-black">
          {isEn ? 'Payment Unsuccessful' : 'Paiement Non Finalisé'}
        </h1>
        <p className="text-xs text-charcoal leading-relaxed">
          {errorMessage}
        </p>
      </div>
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/${locale}/checkout`}
          className="w-full sm:w-auto py-3 px-6 text-xs tracking-widest uppercase bg-gold text-black hover:bg-gold/90 font-semibold transition-colors text-center"
        >
          {isEn ? 'Try Again' : 'Réessayer le Règlement'}
        </Link>
        <Link
          href={`/${locale}/contact`}
          className="w-full sm:w-auto py-3 px-6 text-xs tracking-widest uppercase border border-charcoal text-black hover:border-black hover:bg-black/5 font-medium transition-colors text-center"
        >
          {isEn ? 'Contact Concierge' : 'Contacter la Conciergerie'}
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutReturnPage({ params: { locale } }: ReturnPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-taupe" />
        </div>
      }
    >
      <ReturnContent locale={locale} />
    </Suspense>
  );
}
