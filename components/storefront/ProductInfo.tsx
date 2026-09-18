'use client';
// CLIENT: Variant size selection, SizeGuideModal trigger, accordions toggle, and Add-to-Cart state

import React, { useState } from 'react';
import { ShieldCheck, Truck, RefreshCw, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SizeGuideModal } from '@/components/storefront/SizeGuideModal';
import { useCart } from '@/context/CartContext';
import type { Product, ProductVariant } from '@/lib/supabase/queries/catalog';

interface ProductInfoProps {
  product: Product;
  locale?: string;
}

export function ProductInfo({ product, locale = 'fr' }: ProductInfoProps) {
  const isEn = locale === 'en';
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.[0]?.id || ''
  );
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);

  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    care: false,
    provenance: false,
    shipping: false,
  });

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const isOutOfStock = selectedVariant ? selectedVariant.stock_quantity <= 0 : false;

  const title = isEn ? product.name_en : product.name_fr;
  const description = isEn ? product.description_en : product.description_fr;
  const careInstructions = isEn ? product.care_instructions_en : product.care_instructions_fr;

  const formattedPrice = new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: product.price_currency || 'EUR',
    maximumFractionDigits: 0,
  }).format(product.price_amount);

  const materialLabels: Record<string, { fr: string; en: string }> = {
    vison: { fr: 'Vison Régalien', en: 'Royal Mink' },
    renard: { fr: 'Renard Argenté & Polaire', en: 'Silver & Arctic Fox' },
    chinchilla: { fr: 'Chinchilla Impérial', en: 'Imperial Chinchilla' },
    cachemire: { fr: 'Pur Cachemire Double-Face', en: 'Double-Faced Cashmere' },
    laine: { fr: 'Laine Vierge Peignée', en: 'Worsted Virgin Wool' },
    autre: { fr: 'Matière d’Exception', en: 'Exceptional Material' },
  };

  const materialLabel =
    isEn ? materialLabels[product.material]?.en || product.material : materialLabels[product.material]?.fr || product.material;

  const { addItem } = useCart();

  async function handleAddToCart() {
    if (!selectedVariantId) return;
    setIsAdding(true);
    try {
      const success = await addItem({
        variantId: selectedVariantId,
        quantity: 1,
        unitPrice: product.price_amount,
      });
      if (success) {
        setAddedMessage(true);
        setTimeout(() => setAddedMessage(false), 3500);
      }
    } catch (err) {
      console.error('Failed to add item to bag:', err);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header: Title, SKU & Material Tag */}
      <div className="space-y-2 border-b border-charcoal/15 pb-6">
        <div className="flex items-center justify-between text-xs tracking-widest uppercase text-charcoal">
          <span>{materialLabel}</span>
          <span>{product.sku}</span>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-black leading-tight">
          {title}
        </h1>

        <div className="flex items-baseline gap-4 pt-1">
          <span className="text-2xl font-serif text-black">{formattedPrice}</span>
          <span className="text-xs text-charcoal">
            {isEn ? 'Taxes included • Free global insured courier' : 'TTC • Livraison haute sécurité offerte'}
          </span>
        </div>

        {product.origin_atelier && (
          <p className="text-xs text-taupe flex items-center gap-1.5 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>{product.origin_atelier}</span>
          </p>
        )}
      </div>

      {/* Size Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-black uppercase tracking-wider">
            {isEn ? 'Select Size (FR/EU)' : 'Sélectionner la Taille (FR/EU)'}
          </span>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="text-charcoal hover:text-black transition-colors underline underline-offset-4 tracking-wider uppercase text-[11px]"
          >
            {isEn ? 'Size Guide' : 'Guide des Tailles'}
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {product.variants.map((v) => {
            const isSelected = v.id === selectedVariantId;
            const isSoldOut = v.stock_quantity <= 0;

            return (
              <button
                key={v.id}
                type="button"
                disabled={isSoldOut}
                onClick={() => setSelectedVariantId(v.id)}
                className={`py-3 text-xs tracking-wider border transition-all relative ${
                  isSelected
                    ? 'border-black bg-black text-ivory font-medium'
                    : isSoldOut
                    ? 'border-charcoal/15 text-charcoal/40 bg-charcoal/5 cursor-not-allowed line-through'
                    : 'border-charcoal/25 bg-ivory text-black hover:border-black'
                }`}
              >
                {v.size}
                {v.stock_quantity === 1 && !isSoldOut && (
                  <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-gold" title={isEn ? 'Only 1 left' : 'Dernière pièce'} />
                )}
              </button>
            );
          })}
        </div>

        {selectedVariant && selectedVariant.stock_quantity === 1 && (
          <p className="text-xs text-gold font-medium">
            {isEn ? 'Rarity alert: Only 1 piece available in this size.' : 'Rareté : Une seule pièce disponible dans cette taille.'}
          </p>
        )}
      </div>

      {/* CTA Button */}
      <div className="space-y-3 pt-2">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          size="lg"
          className="w-full py-4 tracking-widest uppercase text-xs"
        >
          {isOutOfStock
            ? isEn
              ? 'Sold Out'
              : 'Épuisé'
            : isAdding
            ? isEn
              ? 'Adding to Bag...'
              : 'Ajout en cours...'
            : isEn
            ? 'Add to Shopping Bag'
            : 'Ajouter au Panier d’Exception'}
        </Button>

        {addedMessage && (
          <div className="p-3 bg-black text-ivory text-xs tracking-wider uppercase text-center animate-fade-in border border-gold/30">
            {isEn ? 'Piece successfully added to your private bag' : 'Pièce ajoutée avec succès à votre panier privé'}
          </div>
        )}

        <p className="text-[11px] text-center text-charcoal">
          {isEn
            ? 'Private concierge assistance available 24/7 for bespoke styling advice.'
            : 'Conciergerie privée disponible 24/7 pour toute demande sur-mesure.'}
        </p>
      </div>

      {/* Trust & Guarantees */}
      <div className="border-y border-charcoal/15 py-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-charcoal">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-black shrink-0" />
          <span>{isEn ? 'Insured white-glove delivery' : 'Livraison scellée & remise en main propre'}</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-black shrink-0" />
          <span>{isEn ? '30-day complimentary returns' : 'Retours & échanges offerts 30 jours'}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-black shrink-0" />
          <span>{isEn ? 'Furmark® certified traceability' : 'Traçabilité Furmark® certifiée'}</span>
        </div>
      </div>

      {/* Collapsible Editorial Accordions */}
      <div className="divide-y divide-charcoal/15 border-b border-charcoal/15">
        {/* Description Accordion */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('description')}
            className="flex items-center justify-between w-full text-left font-serif text-base text-black"
          >
            <span>{isEn ? 'Description & Silhouette' : 'Description & Silhouette'}</span>
            {openSections.description ? (
              <ChevronUp className="w-4 h-4 text-charcoal" />
            ) : (
              <ChevronDown className="w-4 h-4 text-charcoal" />
            )}
          </button>
          {openSections.description && (
            <div className="pt-3 text-xs leading-relaxed text-charcoal space-y-2">
              <p>{description}</p>
            </div>
          )}
        </div>

        {/* Care Instructions Accordion */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('care')}
            className="flex items-center justify-between w-full text-left font-serif text-base text-black"
          >
            <span>{isEn ? 'Material & Atelier Care' : 'Matière & Entretien d’Atelier'}</span>
            {openSections.care ? (
              <ChevronUp className="w-4 h-4 text-charcoal" />
            ) : (
              <ChevronDown className="w-4 h-4 text-charcoal" />
            )}
          </button>
          {openSections.care && (
            <div className="pt-3 text-xs leading-relaxed text-charcoal space-y-2">
              <p>{careInstructions || (isEn ? 'Store on a broad hanger away from direct heat and light. Annual specialized cleaning recommended.' : 'Conserver sur cintre large dans une housse respirante. Nettoyage annuel exclusif par un maître fourreur.')}</p>
            </div>
          )}
        </div>

        {/* Provenance Accordion */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('provenance')}
            className="flex items-center justify-between w-full text-left font-serif text-base text-black"
          >
            <span>{isEn ? 'Traceability & Ethics' : 'Traçabilité & Éthique'}</span>
            {openSections.provenance ? (
              <ChevronUp className="w-4 h-4 text-charcoal" />
            ) : (
              <ChevronDown className="w-4 h-4 text-charcoal" />
            )}
          </button>
          {openSections.provenance && (
            <div className="pt-3 text-xs leading-relaxed text-charcoal space-y-2">
              <p>
                {isEn
                  ? 'All furs used by L’Hermine et le Vair conform to the Furmark® global certification system, ensuring animal welfare, environmental standards, and full supply chain transparency.'
                  : 'Toutes les peaux sélectionnées par la Maison sont certifiées Furmark®, garantissant le respect le plus strict des normes internationales de bien-être animal et d’éco-responsabilité.'}
              </p>
            </div>
          )}
        </div>

        {/* Shipping & Returns Accordion */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('shipping')}
            className="flex items-center justify-between w-full text-left font-serif text-base text-black"
          >
            <span>{isEn ? 'Shipping & Returns' : 'Livraison & Retours Privés'}</span>
            {openSections.shipping ? (
              <ChevronUp className="w-4 h-4 text-charcoal" />
            ) : (
              <ChevronDown className="w-4 h-4 text-charcoal" />
            )}
          </button>
          {openSections.shipping && (
            <div className="pt-3 text-xs leading-relaxed text-charcoal space-y-2">
              <p>
                {isEn
                  ? 'Complimentary insured shipping worldwide via specialized carrier (2-4 business days). You have 30 days upon receipt to request an exchange or return.'
                  : 'Expédition haute sécurité offerte partout dans le monde via transporteur dédié (2 à 4 jours ouvrés). Vous disposez de 30 jours dès réception pour tout échange ou retour gracieux.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        locale={locale}
      />
    </div>
  );
}
