import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  MapPin,
  ShoppingBag,
  ShieldAlert,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { getAdminCustomerById } from '@/lib/supabase/queries/admin';
import { formatPrice } from '@/lib/utils';
import { StatusBadge } from '@/components/admin/StatusBadge';

export const metadata = {
  title: 'Détail Client | Administration',
};

export const dynamic = 'force-dynamic';

interface CustomerDetailPageProps {
  params: { id: string };
}

interface CustomerAddress {
  id: string;
  label?: string | null;
  full_name: string;
  line1: string;
  line2?: string | null;
  postal_code: string;
  city: string;
  country: string;
  is_default_shipping?: boolean;
}

interface CustomerOrderItem {
  product_name_snapshot: string;
}

interface CustomerOrder {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  items?: CustomerOrderItem[];
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const customer = await getAdminCustomerById(params.id);

  if (!customer) {
    notFound();
  }

  const addresses = (customer.addresses || []) as CustomerAddress[];
  const orders = (customer.orders || []) as CustomerOrder[];
  const totalSpent = orders.reduce((sum: number, o: CustomerOrder) => sum + (Number(o.total) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-3 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à la liste des clients</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-sans font-semibold text-base shrink-0">
              {customer.first_name ? customer.first_name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans font-semibold text-xl text-slate-900 tracking-tight">
                  {customer.first_name || customer.last_name ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() : 'Client Anonyme'}
                </h1>
                {customer.marketing_opt_in && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Cercle Privé
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Client depuis le {new Date(customer.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Dépenses Totales</div>
              <div className="font-mono font-bold text-lg text-slate-900">
                {formatPrice(totalSpent, customer.preferred_currency || 'EUR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Orders History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h2 className="font-sans font-semibold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <span>Commandes Passées ({orders.length})</span>
              </h2>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center font-sans">
                Aucune commande enregistrée pour ce client.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="font-semibold text-slate-900 hover:text-indigo-600 hover:underline"
                        >
                          {ord.order_number}
                        </Link>
                        <StatusBadge type="order" status={ord.status} />
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(ord.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      {ord.items && ord.items.length > 0 && (
                        <div className="text-xs text-slate-600 font-sans">
                          {ord.items.map((it) => it.product_name_snapshot).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="font-mono text-sm font-semibold text-slate-900">
                        {formatPrice(ord.total, customer.preferred_currency || 'EUR')}
                      </div>
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
                      >
                        Détail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GDPR / Compliance Block */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-sans font-semibold text-xs uppercase tracking-wider border-b border-slate-200 pb-3 mb-3">
              <ShieldAlert className="w-4 h-4 text-slate-600" />
              <span>Conformité RGPD & Données Personnelles</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              En vertu de la réglementation européenne sur la protection des données (RGPD), le client dispose d'un droit d'accès, de rectification et d'effacement de ses informations personnelles.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-100 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Exporter l'archive client (JSON)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Addresses */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <h3 className="font-sans font-semibold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2.5 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Coordonnées</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold tracking-wider">Email</span>
                <span className="font-medium text-slate-900">{customer.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold tracking-wider">Téléphone</span>
                <span className="font-medium text-slate-900">{customer.phone || 'Non renseigné'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold tracking-wider">Langue</span>
                  <span className="font-semibold uppercase text-slate-900">{customer.locale || 'fr'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold tracking-wider">Devise</span>
                  <span className="font-semibold text-slate-900">{customer.preferred_currency || 'EUR'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <h3 className="font-sans font-semibold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Adresses de Livraison</span>
            </h3>

            {addresses.length === 0 ? (
              <p className="text-xs text-slate-500">Aucune adresse sauvegardée.</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{addr.label || 'Adresse principale'}</span>
                      {addr.is_default_shipping && (
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                          Défaut
                        </span>
                      )}
                    </div>
                    <div className="text-slate-600 font-sans pt-1 leading-relaxed">
                      <div className="font-medium text-slate-900">{addr.full_name}</div>
                      <div>{addr.line1}</div>
                      {addr.line2 && <div>{addr.line2}</div>}
                      <div>{addr.postal_code} {addr.city}</div>
                      <div className="font-medium text-slate-800">{addr.country}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
