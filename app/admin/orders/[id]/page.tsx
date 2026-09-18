import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, CreditCard, MapPin, User, ShieldCheck } from 'lucide-react';
import { getAdminOrderById } from '@/lib/supabase/queries/admin';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { OrderActions } from '@/components/admin/OrderActions';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  const shipping = order.shipping_address;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour aux Commandes</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-sans font-bold text-2xl text-slate-900 tracking-tight font-mono">
              {order.order_number}
            </h1>
            <StatusBadge type="order" value={order.status} />
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Fulfillment Status Actions */}
        <OrderActions orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Order Items & Payment (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Items Card */}
          <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-4">
            <h2 className="font-sans font-semibold text-xs uppercase tracking-widest text-slate-700 border-b border-slate-100 pb-3">
              Articles Confectionnés & Commandés
            </h2>

            <div className="divide-y divide-slate-100">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-slate-900">
                      {item.product_name_snapshot}
                    </div>
                    <div className="text-xs text-slate-500">
                      Quantité: <span className="font-semibold text-slate-900">{item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold font-mono tabular-nums text-slate-900 whitespace-nowrap">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: order.currency || 'EUR',
                    }).format(Number(item.total) || Number(item.unit_price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals Summary */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Sous-total HT/TTC</span>
                <span className="font-mono text-slate-800">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: order.currency || 'EUR' }).format(
                    Number(order.subtotal) || Number(order.total)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Transport Haute Sécurité</span>
                <span className="font-mono text-slate-800">
                  {Number(order.shipping_total) === 0
                    ? 'Offert'
                    : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: order.currency || 'EUR' }).format(
                        Number(order.shipping_total)
                      )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-mono tabular-nums font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Réglé</span>
                <span className="text-indigo-600">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: order.currency || 'EUR' }).format(
                    Number(order.total)
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline of Order Events */}
          <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-4">
            <h2 className="font-sans font-semibold text-xs uppercase tracking-widest text-slate-700 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Historique & Événements</span>
            </h2>

            <div className="space-y-4 pt-1">
              {order.events && order.events.length > 0 ? (
                order.events.map((evt: any) => (
                  <div key={evt.id} className="flex gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <div className="space-y-0.5">
                      <div className="text-slate-900 font-semibold">{evt.message}</div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(evt.created_at).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500">Aucun événement additionnel enregistré.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-900 font-semibold border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Client</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="text-slate-900 font-semibold">{shipping?.full_name || 'Client Privé'}</div>
              <div className="text-slate-600 font-mono">{order.email}</div>
              {shipping?.phone && <div className="text-slate-500">{shipping.phone}</div>}
              <div className="pt-2 text-[11px] text-indigo-600 uppercase tracking-wider font-semibold">
                Langue de Commande: {order.locale === 'en' ? 'Anglais (EN)' : 'Français (FR)'}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-900 font-semibold border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Adresse de Livraison</span>
            </div>
            {shipping ? (
              <div className="text-xs text-slate-600 leading-relaxed space-y-0.5">
                <div className="text-slate-900 font-semibold">{shipping.full_name}</div>
                <div>{shipping.line1}</div>
                {shipping.line2 && <div>{shipping.line2}</div>}
                <div>
                  {shipping.postal_code} {shipping.city}
                </div>
                <div className="text-slate-900 font-semibold uppercase tracking-wider mt-1">
                  {shipping.country}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500">Adresse non renseignée.</div>
            )}
          </div>

          {/* Payment Details */}
          <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-900 font-semibold border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Règlement Sécurisé</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Opérateur:</span>
                <span className="text-slate-900 font-semibold capitalize">
                  {order.payment_provider || 'Stripe'}
                </span>
              </div>
              {order.payment_reference && (
                <div className="space-y-1">
                  <span className="text-slate-500 block">ID Transaction:</span>
                  <span className="font-mono text-[11px] text-slate-700 break-all block bg-slate-50 p-2 border border-slate-200 rounded-xs">
                    {order.payment_reference}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium pt-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Paiement chiffré & conforme PCI-DSS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
