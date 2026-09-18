import React from 'react';
import Link from 'next/link';
import { Users, Mail, Phone, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { getAdminCustomersList } from '@/lib/supabase/queries/admin';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Répertoire Clientèle | Administration',
};

export const dynamic = 'force-dynamic';

interface CustomerListItem {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  marketing_opt_in?: boolean;
  locale?: string;
  preferred_currency?: string;
  orders_count?: number;
  total_spent?: number;
  created_at: string;
}

export default async function AdminCustomersPage() {
  const rawCustomers = await getAdminCustomersList();
  const customers = rawCustomers as unknown as CustomerListItem[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 mb-1 font-semibold">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Relation Clientèle Privée</span>
          </div>
          <h1 className="font-sans font-semibold text-xl text-slate-900 tracking-tight">
            Clients & Profils
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestion des comptes clients, adresses de livraison haute sécurité et historique d'achats.
          </p>
        </div>
        <div className="text-xs text-slate-600 bg-white border border-slate-200 shadow-xs px-3.5 py-1.5 rounded-md self-start sm:self-auto font-medium">
          Total : <span className="font-semibold text-slate-900">{customers.length}</span> clients enregistrés
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Langue / Devise</th>
                <th className="py-3 px-4 text-right">Commandes</th>
                <th className="py-3 px-4 text-right">Total Dépensé</th>
                <th className="py-3 px-4">Inscrit le</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-sans font-semibold text-xs shrink-0">
                        {c.first_name ? c.first_name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {c.first_name || c.last_name ? `${c.first_name || ''} ${c.last_name || ''}`.trim() : 'Client Anonyme'}
                        </div>
                        {c.marketing_opt_in && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 font-sans font-medium">
                            <ShieldCheck className="w-3 h-3 text-amber-600" /> Cercle Privé
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    <div className="flex items-center gap-1.5 text-xs text-slate-900">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{c.email}</span>
                    </div>
                    {c.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 uppercase bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700 rounded">
                        {c.locale || 'fr'}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {c.preferred_currency || 'EUR'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-sans font-medium text-slate-900">
                    <div className="flex items-center justify-end gap-1">
                      <ShoppingBag className="w-3 h-3 text-slate-400" />
                      <span>{c.orders_count || 0}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-900">
                    {formatPrice(c.total_spent || 0, c.preferred_currency || 'EUR')}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-sans text-[11px]">
                    {new Date(c.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium rounded transition-colors"
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
