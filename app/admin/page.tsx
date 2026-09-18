import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Clock,
  Euro,
  PlusCircle,
  Tag,
  Star,
} from 'lucide-react';
import { getAdminDashboardMetrics } from '@/lib/supabase/queries/admin';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetrics();

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-indigo-600 font-semibold">
            Atelier Parisien · 15 Rue de la Paix
          </span>
          <h1 className="font-sans font-bold text-2xl text-slate-900 tracking-tight mt-1">
            Tableau de Bord Exécutif
          </h1>
        </div>

        {/* Quick Create Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase tracking-widest font-medium rounded-sm shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nouveau Produit</span>
          </Link>

          <Link
            href="/admin/marketing/discounts"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs uppercase tracking-widest font-medium hover:border-slate-300 hover:bg-slate-50 rounded-sm shadow-xs transition-colors"
          >
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Créer Code</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              Chiffre d’Affaires
            </span>
            <Euro className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-mono tabular-nums text-2xl sm:text-3xl text-slate-900 font-semibold">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
              metrics.totalRevenue
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>Paiements capturés via Stripe</span>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              Commandes Totales
            </span>
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-mono tabular-nums text-2xl sm:text-3xl text-slate-900 font-semibold">
            {metrics.totalOrders}
          </div>
          <div className="text-xs text-slate-500">
            <span className="text-amber-600 font-semibold">{metrics.pendingOrders}</span> en attente de préparation
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              Panier Moyen (AOV)
            </span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-mono tabular-nums text-2xl sm:text-3xl text-slate-900 font-semibold">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
              metrics.averageOrderValue
            )}
          </div>
          <div className="text-xs text-slate-500">
            Positionnement Haute Fourrure
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              Alertes Stock Faible
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-mono tabular-nums text-2xl sm:text-3xl text-slate-900 font-semibold">
            {metrics.lowStockItemsCount}
          </div>
          <div className="text-xs text-amber-600 font-medium">
            {metrics.lowStockItemsCount > 0 ? 'Pièces rares à réapprovisionner' : 'Stock nominal'}
          </div>
        </div>
      </div>

      {/* Main Two-Column Section: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-sans font-semibold text-xs uppercase tracking-widest text-slate-700">
              Dernières Commandes Clients
            </h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-widest text-[10px] bg-slate-50/50">
                  <th className="py-2.5 px-3 font-medium">Réf.</th>
                  <th className="py-2.5 px-3 font-medium">Client</th>
                  <th className="py-2.5 px-3 font-medium text-right">Total</th>
                  <th className="py-2.5 px-3 font-medium">Statut</th>
                  <th className="py-2.5 px-3 text-right font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-medium">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-slate-900 hover:text-indigo-600 transition-colors font-mono font-semibold"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-sans truncate max-w-[180px]">
                      {order.email}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-mono text-slate-900 font-semibold">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                        Number(order.total) || 0
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge type="order" value={order.status} />
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 font-sans whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Inventory Watch & Quick Review (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Vigilance Box */}
          <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Vigilance Stocks Atelier</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pièces avec moins de 3 unités restantes en stock atelier.
            </p>

            <div className="space-y-2.5 pt-1">
              {metrics.lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-sm"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                      {p.slug}
                    </div>
                  </div>
                  <StatusBadge type="stock" value={String(p.stock)} />
                </div>
              ))}
            </div>

            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors pt-2 w-full text-center"
            >
              <span>Gérer les Stocks Produits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Review Moderation Card */}
          <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-900 font-semibold">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Avis Clients</span>
              </div>
              <StatusBadge type="review" value="pending" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Des retours d'expérience de clients vérifiés sont en attente de modération avant publication sur le storefront.
            </p>
            <Link
              href="/admin/reviews"
              className="block w-full text-center px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs uppercase tracking-widest font-semibold text-slate-700 rounded-sm transition-colors"
            >
              Consulter la File de Modération
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
