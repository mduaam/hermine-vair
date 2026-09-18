import React from 'react';
import Link from 'next/link';
import { Star, MessageSquare, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { getAdminReviewsList } from '@/lib/supabase/queries/admin';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ReviewActions } from '@/components/admin/ReviewActions';

export const metadata = {
  title: 'Modération des Avis | Administration',
};

export const dynamic = 'force-dynamic';

interface AdminReviewsPageProps {
  searchParams: { status?: string };
}

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  const currentTab = searchParams.status || 'all';
  const reviews = await getAdminReviewsList(currentTab);

  const tabs = [
    { id: 'all', label: 'Tous les avis' },
    { id: 'pending', label: 'En attente' },
    { id: 'approved', label: 'Approuvés' },
    { id: 'rejected', label: 'Rejetés' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-1">
            <MessageSquare className="w-3.5 h-3.5 text-gold" />
            <span>Preuve Sociale & Avis Vérifiés</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl text-primary font-normal tracking-wide">
            Modération des Témoignages
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Contrôle des retours d'expérience clients, validation des achats vérifiés et mise en vedette.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-border/60 overflow-x-auto text-xs pb-px">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={`/admin/reviews${tab.id === 'all' ? '' : `?status=${tab.id}`}`}
              className={`px-4 py-2 border-b-2 font-medium tracking-wide transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-surface border border-border/60 p-12 text-center text-xs text-muted-foreground">
            Aucun avis trouvé dans cette catégorie.
          </div>
        ) : (
          reviews.map((rev: any) => (
            <div
              key={rev.id}
              className={`bg-surface border p-6 shadow-sm space-y-4 transition-colors ${
                rev.is_featured ? 'border-gold/50 bg-gold/[0.02]' : 'border-border/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/40 pb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-gold text-gold' : 'text-border fill-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-serif font-medium text-sm text-foreground">
                    {rev.title || 'Sans titre'}
                  </span>
                  <StatusBadge type="review" status={rev.status} />
                  {rev.is_featured && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-medium text-gold bg-gold/10 px-2 py-0.5 border border-gold/30">
                      <Star className="w-2.5 h-2.5 fill-gold" /> Mis en avant
                    </span>
                  )}
                </div>

                <ReviewActions
                  reviewId={rev.id}
                  currentStatus={rev.status}
                  isFeatured={Boolean(rev.is_featured)}
                />
              </div>

              {/* Review Body */}
              <p className="text-xs text-foreground/90 font-sans leading-relaxed">
                "{rev.body}"
              </p>

              {/* Footer Meta */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/20">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">{rev.customer_name}</span>
                  {rev.is_verified_purchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700">
                      <ShieldCheck className="w-3 h-3" /> Achat Vérifié
                    </span>
                  )}
                  <span>•</span>
                  <span>
                    {new Date(rev.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {rev.product && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-muted-foreground mr-1.5">Pièce :</span>
                    <span className="text-xs font-medium text-foreground">
                      {rev.product.name_fr || rev.product.name_en}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
