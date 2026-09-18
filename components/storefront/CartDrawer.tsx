'use client';
// CLIENT: Interactive shopping bag slide-over drawer with quantity controls and checkout trigger

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  locale?: 'fr' | 'en';
}

export function CartDrawer({ locale = 'fr' }: CartDrawerProps) {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, isLoading, itemCount } = useCart();
  const isEn = locale === 'en';

  if (!isOpen) return null;

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;

  const formattedSubtotal = new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: cart?.currency || 'EUR',
    maximumFractionDigits: 0,
  }).format(subtotal);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Shopping Bag' : 'Panier d’Exception'}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory text-black shadow-2xl flex flex-col justify-between border-l border-charcoal/20 animate-slide-in-right">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-charcoal/15 flex items-center justify-between bg-ivory">
            <div>
              <h2 className="font-serif text-xl tracking-wide text-black">
                {isEn ? 'Shopping Bag' : 'Panier d’Exception'}
              </h2>
              <p className="text-xs text-taupe uppercase tracking-widest mt-0.5">
                {itemCount} {isEn ? (itemCount > 1 ? 'pieces' : 'piece') : (itemCount > 1 ? 'pièces' : 'pièce')}
              </p>
            </div>

            <button
              type="button"
              onClick={closeCart}
              aria-label={isEn ? 'Close bag' : 'Fermer le panier'}
              className="p-2 -mr-2 text-charcoal hover:text-black transition-colors"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Body / Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-16 h-16 rounded-full border border-charcoal/20 flex items-center justify-center text-taupe">
                  <Lock className="w-6 h-6 stroke-[1.2]" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg text-black">
                    {isEn ? 'Your bag is currently empty' : 'Votre panier est actuellement vide'}
                  </p>
                  <p className="text-xs text-charcoal max-w-xs leading-relaxed">
                    {isEn
                      ? 'Discover our haute fourrure creations and bespoke coats crafted by French master furriers.'
                      : 'Découvrez nos créations d’exception et manteaux de haute fourrure confectionnés dans nos ateliers parisiens.'}
                  </p>
                </div>
                <Link
                  href={`/${locale}/collections`}
                  onClick={closeCart}
                  className="mt-2 inline-flex items-center justify-center font-sans uppercase tracking-[0.14em] text-xs px-4 py-2 border border-charcoal text-black hover:border-black hover:bg-black/5 font-medium transition-colors"
                >
                  {isEn ? 'Explore Collections' : 'Explorer les Collections'}
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-charcoal/10">
                {items.map((item) => {
                  const product = item.variant?.product;
                  const productName = isEn ? product?.name_en : product?.name_fr;
                  const imageUrl = product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6';
                  const itemPrice = new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
                    style: 'currency',
                    currency: product?.price_currency || 'EUR',
                    maximumFractionDigits: 0,
                  }).format(Number(item.unit_price) * item.quantity);

                  return (
                    <div key={item.id} className="py-4 flex gap-4 first:pt-0">
                      {/* Image Thumbnail */}
                      <div className="w-20 h-26 relative bg-charcoal/5 border border-charcoal/15 shrink-0 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={productName || 'L’Hermine et le Vair'}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Info & Actions */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif text-sm font-medium text-black line-clamp-2">
                              {productName}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              aria-label={isEn ? 'Remove item' : 'Retirer l’article'}
                              className="text-charcoal/50 hover:text-black transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                            </button>
                          </div>

                          <p className="text-[11px] text-taupe uppercase tracking-wider mt-0.5">
                            {isEn ? 'Size:' : 'Taille :'} {item.variant?.size}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {/* Quantity Stepper */}
                          <div className="flex items-center border border-charcoal/20 bg-ivory">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={isLoading}
                              aria-label={isEn ? 'Decrease quantity' : 'Diminuer la quantité'}
                              className="p-1.5 text-charcoal hover:text-black disabled:opacity-40"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-mono font-medium text-black">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isLoading}
                              aria-label={isEn ? 'Increase quantity' : 'Augmenter la quantité'}
                              className="p-1.5 text-charcoal hover:text-black disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-serif text-sm font-medium text-black">
                            {itemPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-6 border-t border-charcoal/15 bg-ivory/80 backdrop-blur-xs space-y-4">
              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-[11px] text-charcoal bg-charcoal/5 px-3 py-2 border border-charcoal/10">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>
                  {isEn
                    ? 'Complimentary insured courier delivery & Furmark® certificate.'
                    : 'Livraison haute sécurité scellée offerte & certificat Furmark®.'}
                </span>
              </div>

              {/* Subtotal */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-wider text-charcoal">
                    {isEn ? 'Subtotal' : 'Sous-total'}
                  </span>
                  <span className="font-serif text-xl font-medium text-black">
                    {formattedSubtotal}
                  </span>
                </div>
                <p className="text-[11px] text-charcoal/70">
                  {isEn
                    ? 'Taxes and international duties calculated at checkout.'
                    : 'TVA incluse. Frais de douane et assurance offerts par la Maison.'}
                </p>
              </div>

              {/* Checkout Button */}
              <Link
                href={`/${locale}/checkout`}
                onClick={closeCart}
                className="w-full py-4 tracking-widest uppercase text-xs flex items-center justify-center gap-2 bg-gold text-black hover:bg-gold/90 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                <span>{isEn ? 'Proceed to Secure Checkout' : 'Procéder au Paiement Sécurisé'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[10px] text-center text-charcoal/60 tracking-wider">
                {isEn ? 'Encrypted 256-bit SSL · Stripe Protected' : 'Chiffrement SSL 256-bit · Paiement Garanti Stripe'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
