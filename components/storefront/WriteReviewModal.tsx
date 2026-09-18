'use client';
// CLIENT: Verified review submission modal with star rating and order verification

import React, { useState } from 'react';
import { X, Star, Sparkles, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  orderItemId: string;
  productName: string;
  locale?: string;
  onSuccess?: () => void;
}

export function WriteReviewModal({
  isOpen,
  onClose,
  productId,
  orderItemId,
  productName,
  locale = 'fr',
  onSuccess,
}: WriteReviewModalProps) {
  const isEn = locale === 'en';
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          orderItemId,
          rating,
          title,
          body,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || (isEn ? 'Failed to submit review.' : 'Impossible de déposer votre avis.'));
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMessage(isEn ? 'Network error.' : 'Erreur réseau.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-ivory border border-charcoal/20 max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl animate-scale-up">
        <button
          type="button"
          onClick={onClose}
          aria-label={isEn ? 'Close' : 'Fermer'}
          className="absolute top-4 right-4 p-2 text-charcoal hover:text-black transition-colors"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="border-b border-charcoal/10 pb-4">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-taupe mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>{isEn ? 'Verified Client Review' : 'Témoignage Client Vérifié'}</span>
          </div>
          <h2 id="review-modal-title" className="font-serif text-2xl text-black">
            {isEn ? 'Share Your Experience' : 'Partager Votre Expérience'}
          </h2>
          <p className="text-xs text-charcoal line-clamp-1 mt-0.5">{productName}</p>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full border border-gold bg-gold/10 flex items-center justify-center mx-auto text-gold">
              <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg text-black">
                {isEn ? 'Thank you for your review' : 'Merci pour votre témoignage'}
              </h3>
              <p className="text-xs text-charcoal max-w-sm mx-auto leading-relaxed">
                {isEn
                  ? 'Your review has been submitted for moderation and will be published upon validation.'
                  : 'Votre avis a été transmis à notre équipe et sera publié après relecture.'}
              </p>
            </div>
            <Button onClick={onClose} size="sm" className="mt-2">
              {isEn ? 'Close' : 'Fermer'}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Star Rating Picker */}
            <div className="space-y-1.5 text-center">
              <span className="block text-xs uppercase tracking-wider text-charcoal">
                {isEn ? 'Rating' : 'Votre Appréciation'}
              </span>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating)
                          ? 'fill-gold text-gold'
                          : 'text-charcoal/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider font-medium text-black">
                {isEn ? 'Review Title' : 'Titre de votre Témoignage'}
              </label>
              <input
                type="text"
                required
                maxLength={150}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isEn ? 'An exceptional creation...' : 'Une coupe et une douceur exceptionnelles...'}
                className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2 text-sm text-black focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            {/* Body */}
            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider font-medium text-black">
                {isEn ? 'Your Impressions' : 'Vos Impressions Détaillées'}
              </label>
              <textarea
                required
                rows={4}
                maxLength={1500}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={
                  isEn
                    ? 'Describe the texture of the fur, the finish of the silk lining, and the silhouette...'
                    : 'Décrivez la texture de la fourrure, les finitions de la doublure en soie et le porté...'
                }
                className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2 text-sm text-black focus:border-gold focus:outline-none transition-colors leading-relaxed"
              />
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full py-3.5 text-xs tracking-widest uppercase mt-4"
            >
              {isEn ? 'Submit Review' : 'Déposer mon Avis'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
