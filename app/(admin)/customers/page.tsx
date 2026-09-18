import React from 'react';
import Link from 'next/link';
import { Users, Mail, Phone, Calendar, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { getAdminCustomersList } from '@/lib/supabase/queries/admin';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Répertoire Clientèle | Administration',
};

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomersList();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-1">
            <Users className="w-3.5 h-3.5 text-gold" />
            <span>Relation Clientèle Privée</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl text-primary font-normal tracking-wide">
            Clients & Profils
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Gestion des comptes clients, adresses de livraison haute sécurité et historique d'achats.
          </p>
        </div>
        <div className="text-xs text-muted-foreground bg-surface border border-border/60 px-4 py-2 self-start sm:self-auto">
          Total : <span className="font-medium text-foreground">{customers.length}</span> clients enregistrés
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-surface border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase tracking-widest text-[10px]">
                <th className="py-3.5 px-4 font-normal">Client</th>
                <th className="py-3.5 px-4 font-normal">Contact</th>
                <th className="py-3.5 px-4 font-normal">Langue / Devise</th>
                <th className="py-3.5 px-4 font-normal text-right">Commandes</th>
                <th className="py-3.5 px-4 font-normal text-right">Total Dépensé</th>
                <th className="py-3.5 px-4 font-normal">Inscrit le</th>
                <th className="py-3.5 px-4 font-normal text-right">Fiche</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono text-[11px]">
              {customers.map((c: any) => (
                <tr key={c.id} className="hover:bg-muted/10 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center font-serif text-xs">
                        {c.first_name ? c.first_name[0] : 'C'}
                      </div>
                      <div>
                        <div>{c.first_name} {c.last_name}</div>
                        {c.marketing_opt_in && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-gold tracking-tight font-sans">
                            <ShieldCheck className="w-2.5 h-2.5" /> Cercle Privé
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-sans text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-xs text-foreground">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <span>{c.email}</span>
                    </div>
                    {c.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 uppercase bg-muted/40 border border-border/60 text-[10px] text-foreground">
                        {c.locale || 'fr'}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {c.preferred_currency || 'EUR'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-sans font-medium text-foreground">
                    <div className="flex items-center justify-end gap-1">
                      <ShoppingBag className="w-3 h-3 text-muted-foreground" />
                      <span>{c.orders_count || 0}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-foreground">
                    {formatPrice(c.total_spent || 0, c.preferred_currency || 'EUR')}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground font-sans text-[11px]">
                    {new Date(c.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-foreground hover:text-gold hover:underline transition-colors"
                    >
                      <span>Consulter</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
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
