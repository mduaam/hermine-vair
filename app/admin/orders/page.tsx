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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-indigo-600 font-semibold">
            Gestion Commerciale & Expéditions
          </span>
          <h1 className="font-sans font-bold text-2xl text-slate-900 tracking-tight mt-1">
            Commandes Clients
          </h1>
        </div>

        <div className="text-xs text-slate-500">
          <span className="text-slate-900 font-semibold">{orders.length}</span> commande(s) répertoriée(s)
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-4">
        {statusTabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.id === 'all' ? '/admin/orders' : `/admin/orders?status=${tab.id}`}
            className={`px-3.5 py-1.5 text-xs font-medium tracking-wide rounded-sm transition-colors ${
              currentStatus === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-widest text-[10px]">
                <th className="py-2.5 px-4 font-medium">Numéro</th>
                <th className="py-2.5 px-4 font-medium">Date</th>
                <th className="py-2.5 px-4 font-medium">Client</th>
                <th className="py-2.5 px-4 font-medium">Articles</th>
                <th className="py-2.5 px-4 font-medium text-right">Total</th>
                <th className="py-2.5 px-4 font-medium">Statut</th>
                <th className="py-2.5 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-900">
                    <div className="truncate max-w-[200px] font-medium">{order.email}</div>
                    {order.shipping_address?.full_name && (
                      <div className="text-[11px] text-slate-500 truncate">
                        {order.shipping_address.full_name}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {order.items && order.items.length > 0 ? (
                      <span className="line-clamp-1">
                        {order.items[0]?.product_name_snapshot}
                        {order.items.length > 1 && ` (+${order.items.length - 1})`}
                      </span>
                    ) : (
                      '1 création'
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-slate-900 text-right whitespace-nowrap">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: order.currency || 'EUR',
                    }).format(Number(order.total) || 0)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge type="order" value={order.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 hover:text-indigo-600 rounded-sm transition-colors"
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
          <div className="text-center py-16 text-slate-500">
            <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 mb-3" />
            <p className="font-sans text-sm text-slate-500">Aucune commande répertoriée dans cette vue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
