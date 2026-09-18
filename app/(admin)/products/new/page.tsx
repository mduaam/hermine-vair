import React from 'react';
import { getAdminCategoriesList } from '@/lib/supabase/queries/admin';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function AdminNewProductPage() {
  const categories = await getAdminCategoriesList();

  return (
    <div className="space-y-6">
      <ProductForm categories={categories} />
    </div>
  );
}
