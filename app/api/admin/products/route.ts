import { NextRequest, NextResponse } from 'next/server';
import { withAudit } from '@/lib/admin/with-audit';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
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

    const auditResult = await withAudit({
      action: 'CREATE_PRODUCT',
      resourceType: 'product',
      resourceId: slug,
      requiredRoles: ['owner', 'admin', 'product_specialist'],
      before: null,
      execute: async () => {
        // Insert product
        const { data: newProd, error: prodErr } = await adminClient
          .from('products')
          .insert({
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
          })
          .select()
          .single();

        if (prodErr) throw prodErr;

        // Insert images
        if (images.length > 0) {
          const imageRows = images.map((img: any, idx: number) => ({
            product_id: newProd.id,
            url: img.url,
            alt_text_fr: img.alt_text_fr || name_fr,
            alt_text_en: img.alt_text_en || name_en,
            position: idx + 1,
          }));
          await adminClient.from('product_images').insert(imageRows);
        }

        // Insert variants
        if (variants.length > 0) {
          const variantRows = variants.map((v: any) => ({
            product_id: newProd.id,
            size: v.size,
            sku: v.sku,
            stock_quantity: v.stock_quantity,
          }));
          await adminClient.from('product_variants').insert(variantRows);
        }

        return newProd;
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
