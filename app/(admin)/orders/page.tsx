import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Eye } from 'lucide-react';
import { getAdminOrders } from '@/lib/supabase/queries/admin';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const { status } = await searchParams;
  const currentStatus = status || 'all';
  const orders = await getAdminOrders(currentStatus);

  const statusTabs = [
    { id: 'all', label: 'Toutes' },
    { id: 'paid', label: 'Payées' },
    { id: 'fulfilled', label: 'Préparées' },
    { id: 'shipped', label: 'Expédiées' },
    { id: 'delivered', label: 'Livrées' },
    { id: 'refunded', label: 'Remboursées' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-medium">
            Gestion Commerciale & Expéditions
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-primary font-normal tracking-wide mt-1">
            Commandes Clients
          </h1>
        </div>

        <div className="text-xs text-muted">
          <span className="text-primary font-medium">{orders.length}</span> commande(s) répertoriée(s)
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {statusTabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.id === 'all' ? '/admin/orders' : `/admin/orders?status=${tab.id}`}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
              currentStatus === tab.id
                ? 'bg-primary text-background font-medium'
                : 'text-muted hover:text-primary hover:bg-surface'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-surface/60 border border-border/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface border-b border-border text-muted uppercase tracking-wider">
                <th className="py-3.5 px-4 font-medium">Numéro</th>
                <th className="py-3.5 px-4 font-medium">Date</th>
                <th className="py-3.5 px-4 font-medium">Client</th>
                <th className="py-3.5 px-4 font-medium">Articles</th>
                <th className="py-3.5 px-4 font-medium">Total</th>
                <th className="py-3.5 px-4 font-medium">Statut</th>
                <th className="py-3.5 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-surface/80 transition-colors">
                  <td className="py-4 px-4 font-mono font-medium text-primary">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:text-gold transition-colors"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-muted whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-4 font-sans text-primary">
                    <div className="truncate max-w-[200px]">{order.email}</div>
                    {order.shipping_address?.full_name && (
                      <div className="text-[11px] text-muted truncate">
                        {order.shipping_address.full_name}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-muted">
                    {order.items && order.items.length > 0 ? (
                      <span className="line-clamp-1">
                        {order.items[0].product_name_snapshot}
                        {order.items.length > 1 && ` (+${order.items.length - 1})`}
                      </span>
                    ) : (
                      '1 création'
                    )}
                  </td>
                  <td className="py-4 px-4 font-medium text-primary whitespace-nowrap">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: order.currency || 'EUR',
                    }).format(Number(order.total) || 0)}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge type="order" value={order.status} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border text-xs uppercase tracking-wider text-muted hover:text-gold hover:border-gold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Détails</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-16 text-muted">
            <ShoppingBag className="w-8 h-8 mx-auto text-muted/40 mb-3" />
            <p className="font-serif text-base">Aucune commande répertoriée dans cette vue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
