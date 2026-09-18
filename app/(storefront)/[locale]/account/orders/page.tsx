'use client';
// CLIENT: Customer orders history list, status timeline, and courier tracking information

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Truck, Calendar, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getCustomerOrders, type Order } from '@/lib/supabase/queries/account';

interface OrdersPageProps {
  params: { locale: string };
}

export default function AccountOrdersPage({ params: { locale } }: OrdersPageProps) {
  const isEn = locale === 'en';
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userOrders = await getCustomerOrders(user.id);
      setOrders(userOrders);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return null;
  }

  const statusLabels: Record<string, { fr: string; en: string; color: string }> = {
    pending: { fr: 'Paiement en attente', en: 'Pending Payment', color: 'bg-amber-100 text-amber-800' },
    paid: { fr: 'Confirmée · En préparation d’atelier', en: 'Confirmed · Atelier Preparation', color: 'bg-gold/20 text-black border border-gold/40' },
    fulfilled: { fr: 'Prête pour expédition', en: 'Ready for Dispatch', color: 'bg-blue-50 text-blue-800' },
    shipped: { fr: 'Expédiée · En cours d’acheminement sécurisé', en: 'Dispatched · Insured Transit', color: 'bg-purple-50 text-purple-800' },
    delivered: { fr: 'Livrée en main propre', en: 'Delivered in Hand', color: 'bg-emerald-50 text-emerald-800' },
    cancelled: { fr: 'Annulée', en: 'Cancelled', color: 'bg-neutral-100 text-neutral-600' },
    refunded: { fr: 'Remboursée', en: 'Refunded', color: 'bg-neutral-100 text-neutral-600' },
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-charcoal/10 pb-4">
        <h2 className="font-serif text-xl sm:text-2xl text-black">
          {isEn ? 'Order History & Tracking' : 'Mes Commandes & Livraisons'}
        </h2>
        <p className="text-xs text-charcoal mt-1">
          {isEn
            ? 'Follow the progress and bespoke delivery of your high fur pieces.'
            : 'Suivez la confection et l’acheminement sécurisé de vos pièces d’exception.'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-ivory border border-charcoal/15 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border border-charcoal/20 flex items-center justify-center mx-auto text-taupe">
            <Package className="w-5 h-5 stroke-[1.2]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg text-black">
              {isEn ? 'No orders yet' : 'Aucune commande enregistrée'}
            </h3>
            <p className="text-xs text-charcoal max-w-sm mx-auto">
              {isEn
                ? 'Your future acquisitions and bespoke commissions will appear here.'
                : 'Vos acquisitions futures et confections sur-mesure seront répertoriées dans cet espace.'}
            </p>
          </div>
          <Link
            href={`/${locale}/collections`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-black bg-gold hover:bg-gold/90 px-5 py-2.5 transition-colors mt-2"
          >
            <span>{isEn ? 'Explore Collections' : 'Découvrir les Collections'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = statusLabels[order.status] || {
              fr: order.status,
              en: order.status,
              color: 'bg-charcoal/10 text-black',
            };

            const formattedDate = new Date(order.created_at).toLocaleDateString(
              isEn ? 'en-US' : 'fr-FR',
              { year: 'numeric', month: 'long', day: 'numeric' }
            );

            const formattedTotal = new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
              style: 'currency',
              currency: order.currency || 'EUR',
              maximumFractionDigits: 0,
            }).format(order.total);

            return (
              <div
                key={order.id}
                className="bg-ivory border border-charcoal/20 shadow-xs overflow-hidden"
              >
                {/* Order Top Header */}
                <div className="p-4 sm:p-5 bg-charcoal/5 border-b border-charcoal/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-charcoal/60 uppercase text-[10px] tracking-widest block">
                        {isEn ? 'Order Reference' : 'Référence'}
                      </span>
                      <span className="font-mono font-semibold text-black">{order.order_number}</span>
                    </div>

                    <div className="hidden sm:block">
                      <span className="text-charcoal/60 uppercase text-[10px] tracking-widest block">
                        {isEn ? 'Date Placed' : 'Date d’achat'}
                      </span>
                      <span className="text-charcoal">{formattedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider ${statusConfig.color}`}>
                      {isEn ? statusConfig.en : statusConfig.fr}
                    </span>

                    <span className="font-serif text-base font-semibold text-black">
                      {formattedTotal}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6 divide-y divide-charcoal/10">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id} className="py-3 flex justify-between items-center text-xs first:pt-0 last:pb-0">
                        <div>
                          <p className="font-medium text-black">{item.product_name_snapshot}</p>
                          <p className="text-charcoal text-[11px]">
                            {isEn ? 'Quantity:' : 'Quantité :'} {item.quantity}
                          </p>
                        </div>
                        <span className="font-serif text-sm text-black">
                          {new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
                            style: 'currency',
                            currency: order.currency || 'EUR',
                            maximumFractionDigits: 0,
                          }).format(item.total)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-charcoal py-2">
                      {isEn ? 'Haute Couture Piece' : 'Création de Haute Fourrure'}
                    </p>
                  )}
                </div>

                {/* Tracking & Assistance Bar */}
                <div className="px-4 sm:px-6 py-3 bg-ivory border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-charcoal">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-taupe" />
                    <span>
                      {isEn
                        ? 'Hand delivery by specialized insured courier'
                        : 'Acheminement sous pli scellé avec remise en main propre'}
                    </span>
                  </div>

                  <Link
                    href={`/${locale}/contact?order=${encodeURIComponent(order.order_number)}`}
                    className="text-black font-medium hover:underline tracking-wider uppercase text-[10px]"
                  >
                    {isEn ? 'Concierge Assistance' : 'Contacter la Conciergerie'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
