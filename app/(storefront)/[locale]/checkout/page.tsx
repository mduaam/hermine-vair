'use client';
// CLIENT: Multi-step luxury checkout flow with address collection, fur check and Stripe Elements

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Elements } from '@stripe/react-stripe-js';
import {
  Lock,
  Truck,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Tag,
  CheckCircle2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getStripe } from '@/lib/stripe/client';
import { StripePaymentSection } from '@/components/checkout/StripePaymentSection';
import { Button } from '@/components/ui/Button';

interface CheckoutPageProps {
  params: { locale: string };
}

export default function CheckoutPage({ params: { locale } }: CheckoutPageProps) {
  const { cart, isLoading: isCartLoading } = useCart();
  const isEn = locale === 'en';

  const [step, setStep] = useState<'details' | 'payment'>('details');

  // Customer & Shipping state
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('FR');

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<string | null>(null);

  // Stripe Session State
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shippingCost = 0; // Complimentary white-glove courier
  const total = subtotal + shippingCost;

  const formattedSubtotal = new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: cart?.currency || 'EUR',
    maximumFractionDigits: 0,
  }).format(subtotal);

  const formattedTotal = new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: cart?.currency || 'EUR',
    maximumFractionDigits: 0,
  }).format(total);

  async function handleProceedToPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!cart?.id) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: cart.id,
          email,
          locale,
          currency: 'eur',
          discountCode: discountApplied || discountCode || undefined,
          shippingAddress: {
            fullName,
            line1,
            line2: line2 || null,
            city,
            postalCode,
            country,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'fur_restricted') {
          setErrorMessage(
            data.message ||
              (isEn
                ? 'Fur items cannot be delivered to the selected country.'
                : 'La livraison de fourrures naturelles est interdite dans ce pays.')
          );
        } else if (data.code === 'out_of_stock') {
          setErrorMessage(
            data.message ||
              (isEn
                ? 'One or more pieces in your bag are no longer in stock.'
                : 'Une pièce de votre panier n’est plus disponible dans cette taille.')
          );
        } else {
          setErrorMessage(
            data.error?.message ||
              (typeof data.error === 'string' ? data.error : null) ||
              (isEn ? 'Failed to initiate payment session.' : 'Échec de l’initialisation du paiement.')
          );
        }
        setIsSubmitting(false);
        return;
      }

      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setOrderNumber(data.orderNumber);
      setStep('payment');
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage(
        isEn
          ? 'Network error. Please check your connection and try again.'
          : 'Erreur de connexion. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCartLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-taupe" />
        <p className="text-xs uppercase tracking-widest text-charcoal">
          {isEn ? 'Preparing your private checkout...' : 'Chargement de votre salon de paiement...'}
        </p>
      </div>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full border border-charcoal/20 flex items-center justify-center mx-auto text-taupe">
          <Lock className="w-6 h-6 stroke-[1.2]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl text-black">
            {isEn ? 'Your Shopping Bag is Empty' : 'Votre Panier est Vide'}
          </h1>
          <p className="text-xs text-charcoal leading-relaxed">
            {isEn
              ? 'Please select a piece from our haute fourrure collections before proceeding to checkout.'
              : 'Veuillez sélectionner une création de notre catalogue avant de finaliser votre commande.'}
          </p>
        </div>
        <Link
          href={`/${locale}/collections`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-black bg-gold hover:bg-gold/90 px-6 py-3 transition-colors"
        >
          <span>{isEn ? 'Discover Collections' : 'Découvrir les Collections'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const stripePromise = getStripe();

  return (
    <div className="max-w-site mx-auto px-6 md:px-10 lg:px-16 py-10">
      {/* Checkout Progress Bar */}
      <div className="border-b border-charcoal/15 pb-6 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href={`/${locale}/collections`}
            className="inline-flex items-center gap-2 text-xs text-charcoal hover:text-black mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Return to boutique' : 'Retour à la boutique'}</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl text-black">
            {isEn ? 'Private Secure Checkout' : 'Salon de Règlement Sécurisé'}
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs uppercase tracking-wider">
          <span
            className={`font-semibold ${
              step === 'details' ? 'text-gold underline underline-offset-4' : 'text-charcoal'
            }`}
          >
            1. {isEn ? 'Delivery' : 'Livraison'}
          </span>
          <span className="text-charcoal/30">→</span>
          <span
            className={`font-semibold ${
              step === 'payment' ? 'text-gold underline underline-offset-4' : 'text-charcoal'
            }`}
          >
            2. {isEn ? 'Payment' : 'Paiement'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-7 space-y-8">
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-8">
              {/* Section 1: Customer Contact */}
              <div className="space-y-4">
                <h2 className="font-serif text-lg text-black border-b border-charcoal/10 pb-2 flex items-center justify-between">
                  <span>{isEn ? 'Contact Information' : 'Coordonnées du Client'}</span>
                  <span className="text-[11px] text-taupe font-sans tracking-widest uppercase">
                    {isEn ? 'Confidential' : 'Confidentiel'}
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider font-medium text-black">
                      {isEn ? 'Email Address (for order tracking)' : 'Adresse Courriel (suivi de commande)'}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="madame@haute-fourrure.com"
                      className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider font-medium text-black">
                      {isEn ? 'Telephone (for courier appointment)' : 'Téléphone (prise de rendez-vous livreur)'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+33 6 00 00 00 00"
                      className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Insured Delivery Address */}
              <div className="space-y-4">
                <h2 className="font-serif text-lg text-black border-b border-charcoal/10 pb-2 flex items-center justify-between">
                  <span>{isEn ? 'Insured Shipping Address' : 'Adresse de Livraison Scellée'}</span>
                  <span className="text-[11px] text-taupe font-sans tracking-widest uppercase">
                    {isEn ? 'White Glove Delivery' : 'Remise en main propre'}
                  </span>
                </h2>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs uppercase tracking-wider font-medium text-black">
                      {isEn ? 'Recipient Full Name' : 'Nom & Prénom du Destinataire'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Madame la Comtesse de..."
                      className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs uppercase tracking-wider font-medium text-black">
                      {isEn ? 'Street Address' : 'Adresse (Numéro et Voie)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      placeholder="12 Place Vendôme"
                      className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs uppercase tracking-wider font-medium text-black">
                      {isEn ? 'Apartment, Suite, Concierge' : 'Bâtiment, Étage, Conciergerie (Optionnel)'}
                    </label>
                    <input
                      type="text"
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      placeholder="Hôtel Particulier, Concierge"
                      className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs uppercase tracking-wider font-medium text-black">
                        {isEn ? 'Postal Code' : 'Code Postal'}
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="75001"
                        className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs uppercase tracking-wider font-medium text-black">
                        {isEn ? 'City' : 'Ville'}
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Paris"
                        className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs uppercase tracking-wider font-medium text-black">
                        {isEn ? 'Country' : 'Pays'}
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
                      >
                        <option value="FR">France</option>
                        <option value="MC">Monaco</option>
                        <option value="CH">Suisse</option>
                        <option value="BE">Belgique</option>
                        <option value="GB">United Kingdom</option>
                        <option value="US">United States</option>
                        <option value="AE">United Arab Emirates</option>
                        <option value="CA">Canada</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courier Trust Banner */}
              <div className="bg-charcoal/5 border border-charcoal/15 p-4 flex items-center gap-3 text-xs text-charcoal">
                <Truck className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="font-semibold text-black uppercase tracking-wider text-[11px]">
                    {isEn ? 'Specialized Insured Courier Included' : 'Transporteur Spécialisé Assuré Offert'}
                  </p>
                  <p className="text-charcoal mt-0.5">
                    {isEn
                      ? 'Discrete sealed packaging, temperature-controlled transit, and direct hand delivery.'
                      : 'Emballage scellé inviolable, transit sous atmosphère contrôlée et remise contre signature.'}
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full py-4 tracking-widest uppercase text-xs flex items-center justify-center gap-2"
              >
                <span>{isEn ? 'Continue to Secure Payment' : 'Continuer vers le Paiement Sécurisé'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {step === 'payment' && clientSecret && orderId && orderNumber && (
            <div className="space-y-6">
              <div className="bg-ivory border border-charcoal/15 p-4 flex justify-between items-center text-xs">
                <div>
                  <span className="text-charcoal uppercase tracking-wider text-[10px] block">
                    {isEn ? 'Shipping to:' : 'Expédié à :'}
                  </span>
                  <span className="font-medium text-black">{fullName}</span> ·{' '}
                  <span className="text-charcoal">
                    {line1}, {postalCode} {city} ({country})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-taupe hover:text-black underline uppercase tracking-wider"
                >
                  {isEn ? 'Edit' : 'Modifier'}
                </button>
              </div>

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'flat',
                    variables: {
                      colorPrimary: '#C89B5C',
                      colorBackground: '#F3EFE8',
                      colorText: '#1C1917',
                      colorDanger: '#b91c1c',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      borderRadius: '0px',
                    },
                  },
                }}
              >
                <StripePaymentSection
                  locale={locale}
                  orderId={orderId}
                  orderNumber={orderNumber}
                  totalAmount={total}
                  currency={cart.currency || 'EUR'}
                />
              </Elements>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <div className="lg:col-span-5">
          <div className="bg-ivory border border-charcoal/20 p-6 space-y-6 sticky top-28">
            <h2 className="font-serif text-lg text-black border-b border-charcoal/10 pb-3">
              {isEn ? 'Order Summary' : 'Récapitulatif de Commande'}
            </h2>

            {/* Items List */}
            <div className="divide-y divide-charcoal/10 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => {
                const product = item.variant?.product;
                const title = isEn ? product?.name_en : product?.name_fr;
                const imageUrl =
                  product?.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6';
                const formattedItemPrice = new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
                  style: 'currency',
                  currency: product?.price_currency || 'EUR',
                  maximumFractionDigits: 0,
                }).format(Number(item.unit_price) * item.quantity);

                return (
                  <div key={item.id} className="py-3 flex gap-3 first:pt-0">
                    <div className="w-16 h-20 relative bg-charcoal/5 border border-charcoal/15 shrink-0 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={title || 'L’Hermine et le Vair'}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <h3 className="font-serif font-medium text-black line-clamp-1">{title}</h3>
                        <p className="text-[11px] text-taupe uppercase tracking-wider mt-0.5">
                          {isEn ? 'Size:' : 'Taille :'} {item.variant?.size} · Qté: {item.quantity}
                        </p>
                      </div>
                      <span className="font-serif font-medium text-black">{formattedItemPrice}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Voucher Code */}
            <div className="pt-2 border-t border-charcoal/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder={isEn ? 'Privilege code' : 'Code Privilège'}
                  className="flex-1 bg-ivory border border-charcoal/30 px-3 py-2 text-xs uppercase tracking-wider text-black placeholder:text-charcoal/40 focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setDiscountApplied(discountCode)}
                  className="px-4 py-2 border border-charcoal text-black hover:bg-black hover:text-ivory text-xs uppercase tracking-wider transition-colors"
                >
                  {isEn ? 'Apply' : 'Appliquer'}
                </button>
              </div>
              {discountApplied && (
                <p className="text-xs text-gold flex items-center gap-1.5 mt-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? `Code "${discountApplied}" applied` : `Code "${discountApplied}" validé`}</span>
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-charcoal/10 pt-4 text-xs">
              <div className="flex justify-between text-charcoal">
                <span>{isEn ? 'Subtotal' : 'Sous-total'}</span>
                <span className="font-serif text-black">{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between text-charcoal">
                <span>{isEn ? 'Insured Specialized Courier' : 'Livraison Haute Sécurité Scellée'}</span>
                <span className="text-gold font-medium uppercase tracking-wider text-[11px]">
                  {isEn ? 'Complimentary' : 'Offerte'}
                </span>
              </div>
              <div className="flex justify-between text-charcoal">
                <span>{isEn ? 'Taxes & International Customs' : 'TVA & Frais de Douane Inclus'}</span>
                <span className="font-serif text-black">{isEn ? 'Included' : 'Inclus'}</span>
              </div>

              <div className="flex justify-between items-baseline border-t border-charcoal/15 pt-3 text-sm">
                <span className="font-semibold uppercase tracking-wider text-black">
                  {isEn ? 'Total Due' : 'Montant Total'}
                </span>
                <span className="font-serif text-2xl font-semibold text-black">
                  {formattedTotal}
                </span>
              </div>
            </div>

            {/* Guarantee note */}
            <div className="text-[11px] text-charcoal/70 bg-charcoal/5 p-3 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-black">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>{isEn ? 'Atelier Guarantees' : 'Engagements d’Atelier'}</span>
              </div>
              <p>
                {isEn
                  ? 'Complimentary 30-day returns and exchanges. Certified Furmark® animal welfare traceability included with your creation.'
                  : 'Retours et échanges gracieux pendant 30 jours. Certificat de traçabilité Furmark® joint à votre pièce.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
