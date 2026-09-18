import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Sparkles, Edit, Tag } from 'lucide-react';
import { getAdminProductsList } from '@/lib/supabase/queries/admin';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default async function AdminProductsPage() {
  const products = await getAdminProductsList();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-medium">
            Atelier Haute Fourrure & Cachemire
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-primary font-normal tracking-wide mt-1">
            Catalogue & Pièces d’Exception
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border text-xs uppercase tracking-widest font-medium hover:border-gold transition-colors"
          >
            <Tag className="w-3.5 h-3.5 text-gold" />
            <span>Catégories</span>
          </Link>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background text-xs uppercase tracking-widest font-medium hover:bg-gold hover:text-primary transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nouveau Produit</span>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface/60 border border-border/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface border-b border-border text-muted uppercase tracking-wider">
                <th className="py-3.5 px-4 font-medium w-16">Visuel</th>
                <th className="py-3.5 px-4 font-medium">Nom (FR & EN)</th>
                <th className="py-3.5 px-4 font-medium">Slugs Bilingues</th>
                <th className="py-3.5 px-4 font-medium">Matière</th>
                <th className="py-3.5 px-4 font-medium">Prix</th>
                <th className="py-3.5 px-4 font-medium">Stock Total</th>
                <th className="py-3.5 px-4 font-medium">Statut</th>
                <th className="py-3.5 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {products.map((prod: any) => {
                const totalStock =
                  prod.variants?.reduce(
                    (sum: number, v: any) => sum + (v.stock_quantity || 0),
                    0
                  ) ?? 0;
                const heroImg = prod.images?.[0]?.url;

                return (
                  <tr key={prod.id} className="hover:bg-surface/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-14 bg-surface border border-border/60 overflow-hidden">
                        {heroImg ? (
                          <Image
                            src={heroImg}
                            alt={prod.name_fr || prod.name_en}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted text-[10px]">
                            —
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="text-primary font-medium">{prod.name_fr}</div>
                      <div className="text-muted text-[11px] italic">{prod.name_en}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] space-y-0.5">
                      <div className="text-primary/90">{prod.slug}</div>
                      <div className="text-gold/90">{prod.slug_en || '—'}</div>
                    </td>
                    <td className="py-3 px-4 text-muted capitalize">
                      {prod.material || 'Fourrure'}
                    </td>
                    <td className="py-3 px-4 font-medium text-primary whitespace-nowrap">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: prod.price_currency || 'EUR',
                      }).format(Number(prod.price_amount) || 0)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge type="stock" value={String(totalStock)} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-500/40">
                        {prod.status || 'Actif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/products/${prod.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border text-xs uppercase tracking-wider text-muted hover:text-gold hover:border-gold transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Modifier</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
