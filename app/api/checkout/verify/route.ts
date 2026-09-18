import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { z } from 'zod';

const QuerySchema = z.object({
  payment_intent: z.string().startsWith('pi_'),
});

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const parsed = QuerySchema.safeParse(params);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payment_intent parameter' }, { status: 400 });
    }

    const pi = await stripe.paymentIntents.retrieve(parsed.data.payment_intent);

    return NextResponse.json({
      status: pi.status, // 'succeeded' | 'processing' | 'requires_action' | 'requires_payment_method'
      orderId: pi.metadata.order_id,
      orderNumber: pi.metadata.order_number,
    });
  } catch (error) {
    console.error('Error verifying payment intent:', error);
    return NextResponse.json({ error: 'Failed to verify payment intent' }, { status: 500 });
  }
}
