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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-medium">
            Atelier Parisien · 15 Rue de la Paix
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-primary font-normal tracking-wide mt-1">
            Tableau de Bord Exécutif
          </h1>
        </div>

        {/* Quick Create Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background text-xs uppercase tracking-widest font-medium hover:bg-gold hover:text-primary transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nouveau Produit</span>
          </Link>

          <Link
            href="/admin/marketing/discounts"
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border text-primary text-xs uppercase tracking-widest font-medium hover:border-gold transition-colors"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Créer Code</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-surface/80 border border-border/80 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted font-medium">
              Chiffre d’Affaires
            </span>
            <Euro className="w-4 h-4 text-gold" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-primary font-normal">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
              metrics.totalRevenue
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>Paiements capturés via Stripe</span>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-surface/80 border border-border/80 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted font-medium">
              Commandes Totales
            </span>
            <ShoppingBag className="w-4 h-4 text-gold" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-primary font-normal">
            {metrics.totalOrders}
          </div>
          <div className="text-xs text-muted">
            <span className="text-amber-400 font-medium">{metrics.pendingOrders}</span> en attente de préparation
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-surface/80 border border-border/80 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted font-medium">
              Panier Moyen (AOV)
            </span>
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-primary font-normal">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
              metrics.averageOrderValue
            )}
          </div>
          <div className="text-xs text-muted">
            Positionnement Haute Fourrure
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-surface/80 border border-border/80 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted font-medium">
              Alertes Stock Faible
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-primary font-normal">
            {metrics.lowStockItemsCount}
          </div>
          <div className="text-xs text-amber-400/90 font-medium">
            {metrics.lowStockItemsCount > 0 ? 'Pièces rares à réapprovisionner' : 'Stock nominal'}
          </div>
        </div>
      </div>

      {/* Main Two-Column Section: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-surface/60 border border-border/80 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <h2 className="font-serif text-lg text-primary font-normal">
              Dernières Commandes Clients
            </h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold hover:text-primary transition-colors"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted uppercase tracking-wider">
                  <th className="py-3 px-2">Réf.</th>
                  <th className="py-3 px-2">Client</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Statut</th>
                  <th className="py-3 px-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {metrics.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface transition-colors">
                    <td className="py-3.5 px-2 font-medium">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-primary hover:text-gold transition-colors font-mono"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="py-3.5 px-2 text-muted font-sans truncate max-w-[180px]">
                      {order.email}
                    </td>
                    <td className="py-3.5 px-2 text-primary font-medium">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                        Number(order.total) || 0
                      )}
                    </td>
                    <td className="py-3.5 px-2">
                      <StatusBadge type="order" value={order.status} />
                    </td>
                    <td className="py-3.5 px-2 text-right text-muted font-sans whitespace-nowrap">
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
          <div className="bg-surface/60 border border-border/80 p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-medium text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Vigilance Stocks Atelier</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Pièces avec moins de 3 unités restantes en stock atelier.
            </p>

            <div className="space-y-3 pt-2">
              {metrics.lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-background/60 border border-border/60"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-medium text-primary line-clamp-1">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-muted uppercase tracking-wider font-mono">
                      {p.slug}
                    </div>
                  </div>
                  <StatusBadge type="stock" value={String(p.stock)} />
                </div>
              ))}
            </div>

            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold hover:text-primary transition-colors pt-2 block text-center"
            >
              <span>Gérer les Stocks Produits</span>
              <ArrowRight className="w-3.5 h-3.5 inline" />
            </Link>
          </div>

          {/* Review Moderation Card */}
          <div className="bg-surface/60 border border-border/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-medium">
                <Star className="w-4 h-4 text-gold" />
                <span>Avis Clients</span>
              </div>
              <StatusBadge type="review" value="pending" />
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Des retours d'expérience de clients vérifiés sont en attente de modération avant publication sur le storefront.
            </p>
            <Link
              href="/admin/reviews"
              className="block w-full text-center px-4 py-2.5 bg-surface border border-border text-xs uppercase tracking-widest font-medium hover:border-gold transition-colors"
            >
              Consulter la File de Modération
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
