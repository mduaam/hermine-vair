import React from 'react';

interface StatusBadgeProps {
  type: 'order' | 'stock' | 'review' | 'role';
  value?: string;
  status?: string;
  role?: string;
}

export function StatusBadge({ type, value, status, role }: StatusBadgeProps) {
  const actualValue = value ?? status ?? role ?? '';
  let label = actualValue;
  let bgClass = 'bg-surface border-border text-muted';

  if (type === 'order') {
    switch (actualValue) {
      case 'paid':
        label = 'Payée';
        bgClass = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400';
        break;
      case 'fulfilled':
        label = 'Préparée';
        bgClass = 'bg-blue-950/40 border-blue-500/40 text-blue-400';
        break;
      case 'shipped':
        label = 'Expédiée';
        bgClass = 'bg-indigo-950/40 border-indigo-500/40 text-indigo-400';
        break;
      case 'delivered':
        label = 'Livrée';
        bgClass = 'bg-emerald-900/60 border-emerald-400 text-emerald-300';
        break;
      case 'pending':
        label = 'En attente';
        bgClass = 'bg-amber-950/40 border-amber-500/40 text-amber-400';
        break;
      case 'refunded':
        label = 'Remboursée';
        bgClass = 'bg-rose-950/40 border-rose-500/40 text-rose-400';
        break;
      case 'cancelled':
        label = 'Annulée';
        bgClass = 'bg-zinc-800 border-zinc-700 text-zinc-400';
        break;
      default:
        break;
    }
  } else if (type === 'stock') {
    const qty = parseInt(actualValue, 10);
    if (isNaN(qty) || qty <= 0) {
      label = 'Rupture';
      bgClass = 'bg-rose-950/40 border-rose-500/40 text-rose-400';
    } else if (qty <= 2) {
      label = `Stock Faible (${qty})`;
      bgClass = 'bg-amber-950/40 border-amber-500/40 text-amber-400';
    } else {
      label = `En Stock (${qty})`;
      bgClass = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400';
    }
  } else if (type === 'review') {
    switch (value) {
      case 'approved':
        label = 'Approuvé';
        bgClass = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400';
        break;
      case 'rejected':
        label = 'Rejeté';
        bgClass = 'bg-rose-950/40 border-rose-500/40 text-rose-400';
        break;
      case 'featured':
        label = 'En Vedette';
        bgClass = 'bg-gold/20 border-gold text-gold font-medium';
        break;
      case 'pending':
      default:
        label = 'À Modérer';
        bgClass = 'bg-amber-950/40 border-amber-500/40 text-amber-400';
        break;
    }
  } else if (type === 'role') {
    switch (value) {
      case 'owner':
        label = 'Propriétaire';
        bgClass = 'bg-gold/20 border-gold text-gold font-medium';
        break;
      case 'admin':
        label = 'Administrateur';
        bgClass = 'bg-purple-950/40 border-purple-500/40 text-purple-300';
        break;
      case 'product_specialist':
        label = 'Spécialiste Produit';
        bgClass = 'bg-blue-950/40 border-blue-500/40 text-blue-300';
        break;
      case 'order_manager':
        label = 'Responsable Commandes';
        bgClass = 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300';
        break;
      case 'content_editor':
        label = 'Éditeur Contenu';
        bgClass = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300';
        break;
      case 'support_agent':
        label = 'Agent Conciergerie';
        bgClass = 'bg-zinc-800 border-zinc-600 text-zinc-300';
        break;
      default:
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs tracking-wider uppercase border ${bgClass}`}
    >
      {label}
    </span>
  );
}
