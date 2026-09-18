'use client';
// CLIENT: Product reviews display with verified purchase badge, helpful votes, and review modal

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, ThumbsUp, Sparkles, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  getProductReviews,
  getProductRatingSummary,
  checkCanReview,
  voteReviewHelpful,
  type ProductReview,
  type RatingSummary,
} from '@/lib/supabase/queries/reviews';
import { WriteReviewModal } from '@/components/storefront/WriteReviewModal';
import { Button } from '@/components/ui/Button';

interface ProductReviewsProps {
  productId: string;
  productName: string;
  locale?: string;
}

export function ProductReviews({
  productId,
  productName,
  locale = 'fr',
}: ProductReviewsProps) {
  const isEn = locale === 'en';

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [summary, setSummary] = useState<RatingSummary>({
    averageRating: 5.0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [orderItemId, setOrderItemId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());

  async function loadData() {
    const revs = await getProductReviews(productId);
    const summ = await getProductRatingSummary(productId);
    setReviews(revs);
    setSummary(summ);
    setLoading(false);
  }

  useEffect(() => {
    async function init() {
      await loadData();

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const check = await checkCanReview(user.id, productId);
        if (check.canReview && check.orderItemId) {
          setCanReview(true);
          setOrderItemId(check.orderItemId);
        }
      }
    }

    init();
  }, [productId]);

  async function handleVote(reviewId: string) {
    if (!userId) {
      // User must be logged in to vote
      window.location.href = `/${locale}/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    if (votedReviews.has(reviewId)) return;

    const ok = await voteReviewHelpful(reviewId, userId);
    if (ok) {
      setVotedReviews((prev) => new Set([...Array.from(prev), reviewId]));
      // Update count locally
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r))
      );
    }
  }

  return (
    <section aria-labelledby="reviews-heading" className="space-y-8 pt-12 border-t border-charcoal/15">
      {/* Header & Rating Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-charcoal/10">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-taupe mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>{isEn ? 'Atelier Client Experiences' : 'Témoignages & Avis d’Exception'}</span>
          </div>
          <h2 id="reviews-heading" className="font-serif text-2xl sm:text-3xl text-black">
            {isEn ? 'Verified Customer Reviews' : 'Avis Clients Vérifiés'}
          </h2>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex text-gold">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(summary.averageRating)
                      ? 'fill-gold text-gold'
                      : 'text-charcoal/20'
                  }`}
                />
              ))}
            </div>
            <span className="font-serif text-lg font-semibold text-black">
              {summary.averageRating.toFixed(1)} / 5
            </span>
            <span className="text-xs text-charcoal">
              ({summary.totalReviews} {isEn ? (summary.totalReviews > 1 ? 'reviews' : 'review') : (summary.totalReviews > 1 ? 'avis vérifiés' : 'avis vérifié')})
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {canReview && orderItemId ? (
            <Button
              onClick={() => setModalOpen(true)}
              size="sm"
              className="tracking-widest uppercase text-xs"
            >
              {isEn ? 'Write a Review' : 'Rédiger un Avis Vérifié'}
            </Button>
          ) : !userId ? (
            <Link
              href={`/${locale}/auth/login?redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '')}`}
              className="text-xs uppercase tracking-wider text-charcoal hover:text-black underline underline-offset-4"
            >
              {isEn ? 'Sign in to review your purchase' : 'Connectez-vous pour évaluer votre commande'}
            </Link>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-taupe">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>{isEn ? 'Reviews reserved for verified clients' : 'Avis réservés aux acquéreurs vérifiés'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="p-8 text-center bg-ivory border border-charcoal/10 space-y-2">
          <p className="font-serif text-base text-black">
            {isEn ? 'Be the first to share your impression of this piece.' : 'Soyez le premier à partager votre ressenti sur cette création.'}
          </p>
          <p className="text-xs text-charcoal max-w-sm mx-auto">
            {isEn
              ? 'All published reviews come exclusively from verified clients who acquired this piece.'
              : 'Tous les avis publiés proviennent exclusivement de clients ayant acquis cette pièce auprès de nos ateliers.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-charcoal/10">
          {reviews.map((rev) => {
            const formattedDate = new Date(rev.created_at).toLocaleDateString(
              isEn ? 'en-US' : 'fr-FR',
              { year: 'numeric', month: 'long', day: 'numeric' }
            );

            return (
              <div key={rev.id} className="py-6 first:pt-0 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex text-gold">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating ? 'fill-gold text-gold' : 'text-charcoal/20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-serif text-sm font-semibold text-black">
                      {rev.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-gold/15 text-black border border-gold/30">
                      <ShieldCheck className="w-3 h-3 text-gold" />
                      <span>{isEn ? 'Verified Purchase' : 'Achat Vérifié'}</span>
                    </span>
                    <span className="text-[11px] text-charcoal/60">{formattedDate}</span>
                  </div>
                </div>

                <p className="text-xs text-charcoal leading-relaxed max-w-3xl">
                  {rev.body}
                </p>

                {/* Helpful voting */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleVote(rev.id)}
                    disabled={votedReviews.has(rev.id)}
                    className="inline-flex items-center gap-1.5 text-[11px] text-charcoal hover:text-black transition-colors disabled:text-gold"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>
                      {isEn ? 'Helpful' : 'Utile'} ({rev.helpful_count})
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {orderItemId && (
        <WriteReviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          productId={productId}
          orderItemId={orderItemId}
          productName={productName}
          locale={locale}
          onSuccess={loadData}
        />
      )}
    </section>
  );
}
