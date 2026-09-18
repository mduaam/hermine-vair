'use client';
// CLIENT: interactive review moderation controls (approve, reject, feature)

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Star, Loader2 } from 'lucide-react';

interface ReviewActionsProps {
  reviewId: string;
  currentStatus: string;
  isFeatured: boolean;
}

export function ReviewActions({ reviewId, currentStatus, isFeatured }: ReviewActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (newStatus?: string, toggleFeatured?: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus !== undefined ? newStatus : currentStatus,
          is_featured: toggleFeatured !== undefined ? !isFeatured : isFeatured,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        alert(json.error || 'Erreur lors de la modération de l’avis.');
        return;
      }

      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Featured Star Toggle */}
      <button
        type="button"
        onClick={() => handleAction(undefined, true)}
        title={isFeatured ? 'Retirer de la mise en avant' : 'Mettre en avant sur la boutique'}
        className={`p-1.5 border rounded-sm transition-colors ${
          isFeatured
            ? 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100'
            : 'border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-300 bg-white'
        }`}
      >
        <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-amber-500' : ''}`} />
      </button>

      {/* Approve Button */}
      {currentStatus !== 'approved' && (
        <button
          type="button"
          onClick={() => handleAction('approved')}
          title="Approuver cet avis"
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-sm transition-colors"
        >
          <Check className="w-3 h-3" />
          <span>Approuver</span>
        </button>
      )}

      {/* Reject Button */}
      {currentStatus !== 'rejected' && (
        <button
          type="button"
          onClick={() => handleAction('rejected')}
          title="Rejeter cet avis"
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-sm transition-colors"
        >
          <X className="w-3 h-3" />
          <span>Rejeter</span>
        </button>
      )}
    </div>
  );
}
