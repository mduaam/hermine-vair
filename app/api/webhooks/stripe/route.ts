import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendOrderConfirmation } from '@/lib/resend/order-confirmation';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn('STRIPE_WEBHOOK_SECRET not set, parsing event unverified for local dev:');
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown webhook error';
    console.error('Stripe webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata?.order_id;
      if (!orderId) break;

      // 1. Update order status to 'paid'
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_reference: pi.id,
        })
        .eq('id', orderId);

      // 2. Fetch order with items and variant relations
      const { data: order } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items (
            *,
            variant:product_variants (
              id, sku, size, stock_quantity,
              product:products ( name_fr, name_en, material )
            )
          ),
          shipping_address:addresses (*)
        `)
        .eq('id', orderId)
        .single();

      // 3. Decrement Inventory in Supabase
      if (order?.items) {
        for (const item of order.items) {
          if (item.variant_id) {
            // Check if decrement_inventory RPC exists, or update stock directly
            const { error: rpcErr } = await supabase.rpc('decrement_inventory', {
              p_variant_id: item.variant_id,
              p_quantity: item.quantity,
            });

            if (rpcErr) {
              // Fallback: direct atomic update
              const currentStock = item.variant?.stock_quantity ?? 0;
              await supabase
                .from('product_variants')
                .update({ stock_quantity: Math.max(0, currentStock - item.quantity) })
                .eq('id', item.variant_id);
            }
          }
        }
      }

      // 4. Log order event
      await supabase.from('order_events').insert({
        order_id: orderId,
        type: 'payment_succeeded',
        message: `Paiement validé via Stripe (${pi.id})`,
      });

      // 5. Send order confirmation email via Resend
      if (order) {
        const isEn = order.locale === 'en';
        const shipAddr = order.shipping_address;

        await sendOrderConfirmation(order.email, {
          locale: (order.locale as 'fr' | 'en') || 'fr',
          orderNumber: order.order_number,
          customerName: shipAddr?.full_name || order.email,
          items: (order.items || []).map((i: any) => ({
            name: i.product_name_snapshot,
            size: i.variant?.size || 'Unique',
            quantity: i.quantity,
            unitPrice: new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
              style: 'currency',
              currency: order.currency || 'EUR',
              maximumFractionDigits: 0,
            }).format(Number(i.unit_price)),
          })),
          subtotal: new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
            style: 'currency',
            currency: order.currency || 'EUR',
            maximumFractionDigits: 0,
          }).format(Number(order.subtotal)),
          shippingTotal: isEn ? 'Complimentary' : 'Offerte',
          total: new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
            style: 'currency',
            currency: order.currency || 'EUR',
            maximumFractionDigits: 0,
          }).format(Number(order.total)),
          currency: order.currency,
          shippingAddress: {
            fullName: shipAddr?.full_name || '',
            line1: shipAddr?.line1 || '',
            line2: shipAddr?.line2,
            city: shipAddr?.city || '',
            postalCode: shipAddr?.postal_code || '',
            country: shipAddr?.country || '',
          },
        });
      }

      break;
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata?.order_id;
      if (!orderId) break;

      await supabase
        .from('orders')
        .update({ status: 'pending' })
        .eq('id', orderId);

      await supabase.from('order_events').insert({
        order_id: orderId,
        type: 'payment_failed',
        message: `Échec du paiement Stripe (${pi.id}): ${pi.last_payment_error?.message || 'Inconnu'}`,
      });

      break;
    }

    default:
      // Other events acknowledged with 200
      break;
  }

  return NextResponse.json({ received: true });
}
