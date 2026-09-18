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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-indigo-600 font-semibold">
            Atelier Haute Fourrure & Cachemire
          </span>
          <h1 className="font-sans font-bold text-2xl text-slate-900 tracking-tight mt-1">
            Catalogue &amp; Pièces d'Exception
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs uppercase tracking-widest font-medium hover:border-slate-300 hover:bg-slate-50 rounded-sm shadow-xs transition-colors"
          >
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Catégories</span>
          </Link>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase tracking-widest font-medium rounded-sm shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nouveau Produit</span>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-widest text-[10px]">
                <th className="py-2.5 px-4 font-medium w-16">Visuel</th>
                <th className="py-2.5 px-4 font-medium">Nom (FR &amp; EN)</th>
                <th className="py-2.5 px-4 font-medium">Slugs Bilingues</th>
                <th className="py-2.5 px-4 font-medium">Matière</th>
                <th className="py-2.5 px-4 font-medium text-right">Prix</th>
                <th className="py-2.5 px-4 font-medium">Stock</th>
                <th className="py-2.5 px-4 font-medium">Statut</th>
                <th className="py-2.5 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((prod: any) => {
                const totalStock =
                  prod.variants?.reduce(
                    (sum: number, v: any) => sum + (v.stock_quantity || 0),
                    0
                  ) ?? 0;
                const heroImg = prod.images?.[0]?.url;

                return (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-14 bg-slate-100 border border-slate-200 rounded-xs overflow-hidden">
                        {heroImg ? (
                          <Image
                            src={heroImg}
                            alt={prod.name_fr || prod.name_en}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                            —
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="text-slate-900 font-semibold">{prod.name_fr}</div>
                      <div className="text-slate-500 text-[11px] italic">{prod.name_en}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] space-y-0.5">
                      <div className="text-slate-800 font-medium">{prod.slug}</div>
                      <div className="text-indigo-600">{prod.slug_en || '—'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 capitalize">
                      {prod.material || 'Fourrure'}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-slate-900 text-right whitespace-nowrap">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: prod.price_currency || 'EUR',
                      }).format(Number(prod.price_amount) || 0)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge type="stock" value={String(totalStock)} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {prod.status || 'Actif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/products/${prod.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 hover:text-indigo-600 rounded-sm transition-colors"
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
