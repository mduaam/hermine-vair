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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-indigo-600 font-semibold mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Preuve Sociale & Avis Vérifiés</span>
          </div>
          <h1 className="font-sans font-bold text-2xl text-slate-900 tracking-tight">
            Modération des Témoignages
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Contrôle des retours d'expérience clients, validation des achats vérifiés et mise en vedette.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto text-xs pb-px">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={`/admin/reviews${tab.id === 'all' ? '' : `?status=${tab.id}`}`}
              className={`px-4 py-2 border-b-2 font-medium tracking-wide transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
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
          <div className="bg-white border border-slate-200 rounded-md p-12 text-center text-xs text-slate-500">
            Aucun avis trouvé dans cette catégorie.
          </div>
        ) : (
          reviews.map((rev: any) => (
            <div
              key={rev.id}
              className={`bg-white border p-6 rounded-md shadow-xs space-y-4 transition-colors ${
                rev.is_featured ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-sans font-semibold text-sm text-slate-900">
                    {rev.title || 'Sans titre'}
                  </span>
                  <StatusBadge type="review" status={rev.status} />
                  {rev.is_featured && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded-sm">
                      <Star className="w-2.5 h-2.5 fill-amber-500" /> Mis en avant
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
              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                "{rev.body}"
              </p>

              {/* Footer Meta */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">{rev.customer_name}</span>
                  {rev.is_verified_purchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
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
                    <span className="text-[10px] uppercase text-slate-400 mr-1.5 font-medium">Pièce :</span>
                    <span className="text-xs font-semibold text-slate-900">
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
