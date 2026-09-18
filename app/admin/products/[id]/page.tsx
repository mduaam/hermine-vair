import React from 'react';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminCategoriesList } from '@/lib/supabase/queries/admin';
import { ProductForm } from '@/components/admin/ProductForm';
import { SEED_PRODUCTS } from '@/lib/supabase/queries/catalog';

interface ProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params;
  const categories = await getAdminCategoriesList();

  let product: unknown = null;

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('products')
      .select('*, images:product_images(*), variants:product_variants(*)')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      product = data;
    }
  } catch (err) {
    console.warn('[Admin Product Edit] Error fetching product from Supabase:', err);
  }

  if (!product) {
    // Fallback to seed product if exists
    product = SEED_PRODUCTS.find((p) => p.id === id || p.slug === id);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
