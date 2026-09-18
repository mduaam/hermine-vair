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
  let bgClass = 'bg-slate-100 border-slate-200 text-slate-700';

  if (type === 'order') {
    switch (actualValue) {
      case 'paid':
        label = 'Payee';
        bgClass = 'bg-emerald-50 border-emerald-200 text-emerald-700';
        break;
      case 'fulfilled':
        label = 'Preparee';
        bgClass = 'bg-sky-50 border-sky-200 text-sky-700';
        break;
      case 'shipped':
        label = 'Expediee';
        bgClass = 'bg-indigo-50 border-indigo-200 text-indigo-700';
        break;
      case 'delivered':
        label = 'Livree';
        bgClass = 'bg-emerald-100 border-emerald-300 text-emerald-800';
        break;
      case 'pending':
        label = 'En attente';
        bgClass = 'bg-amber-50 border-amber-200 text-amber-700';
        break;
      case 'refunded':
        label = 'Remboursee';
        bgClass = 'bg-rose-50 border-rose-200 text-rose-700';
        break;
      case 'cancelled':
        label = 'Annulee';
        bgClass = 'bg-rose-50 border-rose-200 text-rose-700';
        break;
      default:
        break;
    }
  } else if (type === 'stock') {
    const qty = parseInt(actualValue, 10);
    if (isNaN(qty) || qty <= 0) {
      label = 'Rupture';
      bgClass = 'bg-rose-50 border-rose-200 text-rose-700';
    } else if (qty <= 2) {
      label = `Faible (${qty})`;
      bgClass = 'bg-amber-50 border-amber-200 text-amber-700';
    } else {
      label = `En Stock (${qty})`;
      bgClass = 'bg-emerald-50 border-emerald-200 text-emerald-700';
    }
  } else if (type === 'review') {
    switch (actualValue) {
      case 'approved':
        label = 'Approuve';
        bgClass = 'bg-emerald-50 border-emerald-200 text-emerald-700';
        break;
      case 'rejected':
        label = 'Rejete';
        bgClass = 'bg-rose-50 border-rose-200 text-rose-700';
        break;
      case 'featured':
        label = 'En Vedette';
        bgClass = 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium';
        break;
      case 'pending':
      default:
        label = 'A Moderer';
        bgClass = 'bg-amber-50 border-amber-200 text-amber-700';
        break;
    }
  } else if (type === 'role') {
    switch (actualValue) {
      case 'owner':
        label = 'Proprietaire';
        bgClass = 'bg-amber-50 border-amber-300 text-amber-800 font-semibold';
        break;
      case 'admin':
        label = 'Administrateur';
        bgClass = 'bg-purple-50 border-purple-200 text-purple-700';
        break;
      case 'product_specialist':
        label = 'Spec. Produit';
        bgClass = 'bg-sky-50 border-sky-200 text-sky-700';
        break;
      case 'order_manager':
        label = 'Resp. Commandes';
        bgClass = 'bg-cyan-50 border-cyan-200 text-cyan-700';
        break;
      case 'content_editor':
        label = 'Editeur Contenu';
        bgClass = 'bg-emerald-50 border-emerald-200 text-emerald-700';
        break;
      case 'support_agent':
        label = 'Conciergerie';
        bgClass = 'bg-slate-100 border-slate-200 text-slate-700';
        break;
      default:
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] tabular-nums tracking-wide uppercase border font-medium ${bgClass}`}
    >
      {label}
    </span>
  );
}