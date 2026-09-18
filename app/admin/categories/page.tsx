import React from 'react';
import { FolderTree } from 'lucide-react';
import { getAdminCategoriesList } from '@/lib/supabase/queries/admin';
import { CategoryManager } from '@/components/admin/CategoryManager';

export const metadata = {
  title: 'Gestion des Catégories | Administration',
};

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategoriesList();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-1">
            <FolderTree className="w-3.5 h-3.5 text-gold" />
            <span>Catalogue & Silos SEO</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl text-primary font-normal tracking-wide">
            Catégories & Taxonomies
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Arborescence des collections avec slugs bilingues stricts (FR / EN).
          </p>
        </div>
      </div>

      {/* Interactive Category Manager */}
      <CategoryManager categories={categories} />
    </div>
  );
}
