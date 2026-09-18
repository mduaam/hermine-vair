'use client';
// CLIENT: interactive order fulfillment and status transitions with audit confirmation

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Truck, PackageCheck, RotateCcw, Loader2 } from 'lucide-react';

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
}

export function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    const confirmMessage =
      newStatus === 'refunded'
        ? 'Confirmez-vous le remboursement de cette commande ? Cette opération sera tracée dans le journal d’audit.'
        : `Passer le statut de la commande à "${newStatus}" ?`;

    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors de la mise à jour.');
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {currentStatus === 'paid' && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleStatusChange('fulfilled')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-xs uppercase tracking-wider font-medium hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PackageCheck className="w-3.5 h-3.5" />}
            <span>Préparer la Pièce</span>
          </button>
        )}

        {(currentStatus === 'fulfilled' || currentStatus === 'paid') && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleStatusChange('shipped')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-xs uppercase tracking-wider font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />}
            <span>Confier au Transporteur</span>
          </button>
        )}

        {currentStatus === 'shipped' && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleStatusChange('delivered')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-xs uppercase tracking-wider font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>Confirmer la Livraison</span>
          </button>
        )}

        {currentStatus !== 'refunded' && currentStatus !== 'cancelled' && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleStatusChange('refunded')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-rose-500/40 text-rose-400 text-xs uppercase tracking-wider font-medium hover:bg-rose-950/40 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
            <span>Rembourser</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
          {error}
        </div>
      )}
    </div>
  );
}
