import { NextRequest, NextResponse } from 'next/server';
import { withAudit } from '@/lib/admin/with-audit';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, is_featured } = body;

    const adminClient = createAdminClient();

    // Fetch before state for audit
    const { data: beforeReview } = await adminClient
      .from('product_reviews')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    const auditResult = await withAudit({
      action: 'MODERATE_REVIEW',
      resourceType: 'review',
      resourceId: id,
      requiredRoles: ['owner', 'admin', 'support_agent', 'content_editor'],
      before: beforeReview || null,
      execute: async () => {
        const updatePayload: Record<string, any> = {};
        if (status !== undefined) updatePayload.status = status;
        if (is_featured !== undefined) updatePayload.is_featured = is_featured;

        const { data: updated, error } = await adminClient
          .from('product_reviews')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return updated;
      },
    });

    if (!auditResult.success) {
      return NextResponse.json({ error: auditResult.error }, { status: 403 });
    }

    return NextResponse.json({ success: true, review: auditResult.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
