import { NextRequest, NextResponse } from 'next/server';
import { withAudit } from '@/lib/admin/with-audit';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name_fr, slug, name_en, slug_en, parent_id, kind = 'type', position = 1 } = body;

    // Strict validation of Dual-Language Mandate
    if (!name_fr || !slug || !name_en || !slug_en) {
      return NextResponse.json(
        { error: 'Mandat Bilingue Incomplet: Le nom et le slug doivent être renseignés en Français et en Anglais.' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const auditResult = await withAudit({
      action: 'CREATE_CATEGORY',
      resourceType: 'category',
      resourceId: slug,
      requiredRoles: ['owner', 'admin', 'product_specialist'],
      before: null,
      execute: async () => {
        const { data: newCategory, error } = await adminClient
          .from('categories')
          .insert({
            name_fr,
            slug,
            name_en,
            slug_en,
            parent_id: parent_id ? parent_id : null,
            kind,
            position: Number(position) || 1,
          })
          .select()
          .single();

        if (error) throw error;
        return newCategory;
      },
    });

    if (!auditResult.success) {
      return NextResponse.json({ error: auditResult.error }, { status: 403 });
    }

    return NextResponse.json({ success: true, category: auditResult.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
