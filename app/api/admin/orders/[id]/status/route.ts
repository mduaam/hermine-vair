import { NextRequest, NextResponse } from 'next/server';
import { withAudit } from '@/lib/admin/with-audit';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params;

  try {
    const body = await req.json();
    const { status } = body;

    const validStatuses = ['pending', 'paid', 'fulfilled', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Fetch current state
    const { data: currentOrder } = await adminClient
      .from('orders')
      .select('id, status, order_number')
      .eq('id', orderId)
      .single();

    const auditResult = await withAudit({
      action: 'UPDATE_ORDER_STATUS',
      resourceType: 'order',
      resourceId: orderId,
      requiredRoles: ['owner', 'admin', 'order_manager'],
      before: currentOrder,
      execute: async () => {
        const { data, error } = await adminClient
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId)
          .select()
          .single();

        if (error) throw error;

        // Log timeline event in order_events
        await adminClient.from('order_events').insert({
          order_id: orderId,
          type: `status_changed_to_${status}`,
          message: `Le statut de la commande a été modifié pour: "${status}".`,
        });

        return data;
      },
    });

    if (!auditResult.success) {
      return NextResponse.json({ error: auditResult.error }, { status: 403 });
    }

    return NextResponse.json({ success: true, order: auditResult.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur interne' }, { status: 500 });
  }
}
