import { NextRequest, NextResponse } from 'next/server';
import { withAudit } from '@/lib/admin/with-audit';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      type,
      value,
      min_order_amount = 0,
      description_fr,
      description_en,
      starts_at,
      ends_at,
      active = true,
    } = body;

    // Strict validation of Dual-Language Mandate
    if (!code || !description_fr || !description_en) {
      return NextResponse.json(
        { error: 'Mandat Bilingue Incomplet: Le code et les descriptions (FR et EN) sont requis.' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const auditResult = await withAudit({
      action: 'CREATE_DISCOUNT',
      resourceType: 'discount',
      resourceId: code,
      requiredRoles: ['owner', 'admin'],
      before: null,
      execute: async () => {
        const { data: newDiscount, error } = await adminClient
          .from('discounts')
          .insert({
            code: code.toUpperCase().trim(),
            type,
            value: Number(value) || 0,
            min_order_amount: Number(min_order_amount) || 0,
            description_fr,
            description_en,
            starts_at: starts_at || new Date().toISOString(),
            ends_at: ends_at || null,
            active,
          })
          .select()
          .single();

        if (error) throw error;
        return newDiscount;
      },
    });

    if (!auditResult.success) {
      return NextResponse.json({ error: auditResult.error }, { status: 403 });
    }

    return NextResponse.json({ success: true, discount: auditResult.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
