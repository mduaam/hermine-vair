import { NextRequest, NextResponse } from 'next/server';
import { withAudit } from '@/lib/admin/with-audit';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const {
      name_fr,
      slug,
      description_fr,
      care_instructions_fr,
      meta_title_fr,
      meta_description_fr,
      name_en,
      slug_en,
      description_en,
      care_instructions_en,
      meta_title_en,
      meta_description_en,
      sku,
      category_id,
      material,
      price_amount,
      price_currency = 'EUR',
      is_best_seller = false,
      status = 'active',
      origin_atelier,
      images = [],
      variants = [],
    } = body;

    // Strict validation of Dual-Language Mandate
    if (!name_fr || !slug || !description_fr || !name_en || !slug_en || !description_en) {
      return NextResponse.json(
        { error: 'Mandat Bilingue Incomplet: Le nom, le slug et la description doivent être renseignés en Français et en Anglais.' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Fetch before state for audit
    const { data: beforeProd } = await adminClient
      .from('products')
      .select('*, variants:product_variants(*)')
      .eq('id', id)
      .maybeSingle();

    const auditResult = await withAudit({
      action: 'UPDATE_PRODUCT',
      resourceType: 'product',
      resourceId: id,
      requiredRoles: ['owner', 'admin', 'product_specialist'],
      before: beforeProd,
      execute: async () => {
        // Update product table
        const { data: updatedProd, error: prodErr } = await adminClient
          .from('products')
          .update({
            name_fr,
            slug,
            description_fr,
            care_instructions_fr,
            meta_title_fr,
            meta_description_fr,
            name_en,
            slug_en,
            description_en,
            care_instructions_en,
            meta_title_en,
            meta_description_en,
            sku,
            category_id,
            material,
            price_amount,
            price_currency,
            is_best_seller,
            status,
            origin_atelier,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (prodErr) throw prodErr;

        // Sync variants: delete and re-insert or upsert
        if (variants.length > 0) {
          await adminClient.from('product_variants').delete().eq('product_id', id);
          const variantRows = variants.map((v: any) => ({
            product_id: id,
            size: v.size,
            sku: v.sku,
            stock_quantity: v.stock_quantity,
          }));
          await adminClient.from('product_variants').insert(variantRows);
        }

        return updatedProd;
      },
    });

    if (!auditResult.success) {
      return NextResponse.json({ error: auditResult.error }, { status: 403 });
    }

    return NextResponse.json({ success: true, product: auditResult.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
