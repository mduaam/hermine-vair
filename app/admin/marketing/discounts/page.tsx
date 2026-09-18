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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-1">
            <Tag className="w-3.5 h-3.5 text-gold" />
            <span>Marketing & Programmes Privilège</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl text-primary font-normal tracking-wide">
            Codes Promotionnels & Privilèges
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Gestion des avantages exclusifs avec libellés bilingues obligatoires (FR / EN).
          </p>
        </div>

        <Link
          href="/admin/marketing/discounts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background text-xs uppercase tracking-widest font-medium hover:bg-gold hover:text-primary transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau Code Privilège</span>
        </Link>
      </div>

      {/* Discounts Table */}
      <div className="bg-surface border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase tracking-widest text-[10px]">
                <th className="py-3.5 px-4 font-normal">Code Privilège</th>
                <th className="py-3.5 px-4 font-normal">Type & Avantage</th>
                <th className="py-3.5 px-4 font-normal">Description Bilingue</th>
                <th className="py-3.5 px-4 font-normal">Min. Commande</th>
                <th className="py-3.5 px-4 font-normal">Période de Validité</th>
                <th className="py-3.5 px-4 font-normal text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono text-[11px]">
              {discounts.map((disc: any) => (
                <tr key={disc.id} className="hover:bg-muted/10 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold bg-primary/10 border border-primary/20 px-2 py-0.5 tracking-wider">
                        {disc.code}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    {disc.type === 'percentage' && (
                      <span className="font-medium text-foreground">-{disc.value}% sur le panier</span>
                    )}
                    {disc.type === 'fixed' && (
                      <span className="font-medium text-foreground">-{formatPrice(disc.value, 'EUR')}</span>
                    )}
                    {disc.type === 'free_shipping' && (
                      <span className="font-medium text-gold">Livraison Concierge Offerte</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-xs max-w-xs space-y-1">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[9px] uppercase px-1 py-0.2 bg-muted/40 text-muted-foreground border border-border/60 shrink-0">
                        FR
                      </span>
                      <span className="text-foreground line-clamp-1">{disc.description_fr || '—'}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[9px] uppercase px-1 py-0.2 bg-muted/40 text-muted-foreground border border-border/60 shrink-0">
                        EN
                      </span>
                      <span className="text-muted-foreground line-clamp-1">{disc.description_en || '—'}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-foreground">
                    {disc.min_order_amount && disc.min_order_amount > 0
                      ? formatPrice(disc.min_order_amount, 'EUR')
                      : 'Aucun minimum'}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-muted-foreground text-[11px]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span>
                        {disc.starts_at ? new Date(disc.starts_at).toLocaleDateString('fr-FR') : 'Dès création'}
                        {' → '}
                        {disc.ends_at ? new Date(disc.ends_at).toLocaleDateString('fr-FR') : 'Illimitée'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    {disc.active ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted/30 border border-border/60 px-2 py-0.5">
                        <XCircle className="w-3 h-3" /> Inactif
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
