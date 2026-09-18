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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2.5">
        {currentStatus === 'paid' && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleStatusChange('fulfilled')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50"
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
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 transition-colors shadow-xs disabled:opacity-50"
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
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-md hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50"
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
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-rose-300 text-rose-700 text-xs font-semibold rounded-md hover:bg-rose-50 transition-colors shadow-xs disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
            <span>Rembourser</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
