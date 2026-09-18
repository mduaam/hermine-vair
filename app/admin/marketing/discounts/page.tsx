import React from 'react';
import Link from 'next/link';
import { Tag, Plus, CheckCircle2, XCircle, Calendar, Percent, ShieldCheck } from 'lucide-react';
import { getAdminDiscountsList } from '@/lib/supabase/queries/admin';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Codes Privilèges & Remises | Administration',
};

export const dynamic = 'force-dynamic';

export default async function AdminDiscountsPage() {
  const discounts = await getAdminDiscountsList();

  return (
    <div className="space-y-8">      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-indigo-600 font-semibold mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Marketing & Programmes Privilège</span>
          </div>
          <h1 className="font-sans font-bold text-2xl text-slate-900 tracking-tight">
            Codes Promotionnels & Privilèges
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestion des avantages exclusifs avec libellés bilingues obligatoires (FR / EN).
          </p>
        </div>

        <Link
          href="/admin/marketing/discounts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase tracking-widest font-medium rounded-sm shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau Code Privilège</span>
        </Link>
      </div>

      {/* Discounts Table */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-widest text-[10px]">
                <th className="py-2.5 px-4 font-medium">Code Privilège</th>
                <th className="py-2.5 px-4 font-medium">Type & Avantage</th>
                <th className="py-2.5 px-4 font-medium">Description Bilingue</th>
                <th className="py-2.5 px-4 font-medium">Min. Commande</th>
                <th className="py-2.5 px-4 font-medium">Période de Validité</th>
                <th className="py-2.5 px-4 font-medium text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {discounts.map((disc: any) => (
                <tr key={disc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-900 px-2 py-0.5 tracking-wider rounded-sm">
                        {disc.code}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    {disc.type === 'percentage' && (
                      <span className="font-semibold text-slate-900">-{disc.value}% sur le panier</span>
                    )}
                    {disc.type === 'fixed' && (
                      <span className="font-semibold text-slate-900">-{formatPrice(disc.value, 'EUR')}</span>
                    )}
                    {disc.type === 'free_shipping' && (
                      <span className="font-semibold text-indigo-600">Livraison Concierge Offerte</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-sans text-xs max-w-xs space-y-1">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[9px] uppercase px-1 py-0.2 bg-slate-100 text-slate-600 border border-slate-200 shrink-0 font-semibold rounded-xs">
                        FR
                      </span>
                      <span className="text-slate-900 line-clamp-1">{disc.description_fr || '—'}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[9px] uppercase px-1 py-0.2 bg-slate-100 text-slate-600 border border-slate-200 shrink-0 font-semibold rounded-xs">
                        EN
                      </span>
                      <span className="text-slate-500 line-clamp-1">{disc.description_en || '—'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-900 font-medium">
                    {disc.min_order_amount && disc.min_order_amount > 0
                      ? formatPrice(disc.min_order_amount, 'EUR')
                      : 'Aucun minimum'}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-500 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>
                        {disc.starts_at ? new Date(disc.starts_at).toLocaleDateString('fr-FR') : 'Dès création'}
                        {' → '}
                        {disc.ends_at ? new Date(disc.ends_at).toLocaleDateString('fr-FR') : 'Illimitée'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    {disc.active ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                        <CheckCircle2 className="w-3 h-3" /> Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm">
                        <XCircle className="w-3 h-3" /> Désactivé
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
