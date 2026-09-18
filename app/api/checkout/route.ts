import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe, getOrCreateStripeCustomer, stripeIdempotencyKey } from '@/lib/stripe/server';
import { createAdminClient } from '@/lib/supabase/admin';

const AddressSchema = z.object({
  fullName: z.string().min(2).max(100),
  line1: z.string().min(2).max(200),
  line2: z.string().max(200).optional().nullable(),
  city: z.string().min(2).max(100),
  region: z.string().max(100).optional().nullable(),
  postalCode: z.string().min(2).max(20),
  country: z.string().min(2).max(3),
});

const CheckoutSchema = z.object({
  cartId: z.string().uuid(),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  email: z.string().email().toLowerCase().trim(),
  locale: z.enum(['fr', 'en']).default('fr'),
  currency: z.enum(['eur', 'usd', 'gbp', 'chf']).default('eur'),
  discountCode: z.string().optional().nullable(),
  savePaymentMethod: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();

    // 1. Validate payload
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const input = parsed.data;

    // 2. Fetch cart with items, variants, and product details
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select(`
        id, customer_id, currency,
        cart_items (
          id, quantity, unit_price, variant_id,
          variant:product_variants (
            id, sku, stock_quantity,
            product:products ( id, name_fr, name_en, material, price_amount )
          )
        )
      `)
      .eq('id', input.cartId)
      .single();

    if (cartError || !cart || !cart.cart_items || cart.cart_items.length === 0) {
      return NextResponse.json({ error: 'Cart not found or empty' }, { status: 404 });
    }

    const items = (cart.cart_items || []) as unknown as Array<{
      id: string;
      quantity: number;
      unit_price: number;
      variant_id: string;
      variant: {
        id: string;
        sku: string;
        stock_quantity: number;
        product: {
          id: string;
          name_fr: string;
          name_en: string;
          material: string;
          price_amount: number;
        };
      };
    }>;

    // 3. Fur-restriction check (Legal requirement — region_rules table)
    const shippingCountry = input.shippingAddress.country.toUpperCase();
    const { data: regionRule } = await supabase
      .from('region_rules')
      .select('fur_sales_allowed, requires_cites')
      .eq('country_code', shippingCountry)
      .maybeSingle();

    const hasFurItems = items.some((item) =>
      ['vison', 'renard', 'chinchilla'].includes(item.variant?.product?.material || '')
    );

    if (hasFurItems && regionRule && regionRule.fur_sales_allowed === false) {
      return NextResponse.json(
        {
          error: 'fur_restricted',
          code: 'fur_restricted',
          message:
            input.locale === 'fr'
              ? 'La réglementation internationale interdit la livraison de fourrures naturelles dans ce pays.'
              : 'International regulations restrict the shipment of natural fur items to this destination.',
        },
        { status: 403 }
      );
    }

    // 4. Stock validation
    for (const item of items) {
      const stock = item.variant?.stock_quantity ?? 0;
      if (stock < item.quantity) {
        return NextResponse.json(
          {
            error: 'out_of_stock',
            code: 'out_of_stock',
            variantId: item.variant?.id,
            message:
              input.locale === 'fr'
                ? `La pièce sélectionnée (${item.variant?.sku}) n'est plus disponible dans la quantité souhaitée.`
                : `The selected piece (${item.variant?.sku}) is no longer available in the requested quantity.`,
          },
          { status: 422 }
        );
      }
    }

    // 5. Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.unit_price) * item.quantity,
      0
    );
    // Complimentary luxury delivery for all orders > €2,000 or as standard boutique perk
    const shippingTotal = subtotal >= 2000 ? 0 : 0;
    let discountAmount = 0;

    // 6. Discount code validation
    if (input.discountCode) {
      const { data: discount } = await supabase
        .from('discounts')
        .select('*')
        .eq('code', input.discountCode.toUpperCase().trim())
        .eq('active', true)
        .maybeSingle();

      if (discount && (!discount.min_order_amount || subtotal >= discount.min_order_amount)) {
        if (discount.type === 'percentage') {
          discountAmount = subtotal * (Number(discount.value) / 100);
        } else if (discount.type === 'fixed') {
          discountAmount = Number(discount.value);
        }
      }
    }

    const finalTotal = Math.max(0, subtotal + shippingTotal - discountAmount);

    // 7. Save shipping & billing addresses
    const { data: shippingAddr, error: shipErr } = await supabase
      .from('addresses')
      .insert({
        customer_id: cart.customer_id || '00000000-0000-0000-0000-000000000000',
        label: 'Livraison Commande',
        full_name: input.shippingAddress.fullName,
        line1: input.shippingAddress.line1,
        line2: input.shippingAddress.line2 || null,
        city: input.shippingAddress.city,
        region: input.shippingAddress.region || null,
        postal_code: input.shippingAddress.postalCode,
        country: shippingCountry,
      })
      .select('id')
      .maybeSingle();

    const orderNumber = `HV-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

    // 8. Insert Order Record (Pending)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: cart.customer_id || null,
        email: input.email,
        locale: input.locale,
        currency: input.currency.toUpperCase(),
        status: 'pending',
        subtotal,
        shipping_total: shippingTotal,
        duties_estimate: 0,
        tax_total: 0,
        total: finalTotal,
        shipping_address_id: shippingAddr?.id || null,
        payment_provider: 'stripe',
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // 9. Insert Order Items
    const orderItemsToInsert = items.map((item) => ({
      order_id: order.id,
      variant_id: item.variant_id,
      product_name_snapshot:
        input.locale === 'en'
          ? item.variant?.product?.name_en || 'Luxury Item'
          : item.variant?.product?.name_fr || 'Pièce d’Exception',
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: Number(item.unit_price) * item.quantity,
    }));

    await supabase.from('order_items').insert(orderItemsToInsert);

    // 10. Upsert Stripe Customer
    let stripeCustomerId: string | undefined = undefined;
    if (cart.customer_id) {
      try {
        stripeCustomerId = await getOrCreateStripeCustomer(
          cart.customer_id,
          input.email,
          input.shippingAddress.fullName
        );
      } catch (err) {
        console.warn('Could not upsert Stripe customer, continuing as guest:', err);
      }
    }

    // 11. Create Stripe PaymentIntent with Idempotency Key
    const idempotencyKey = stripeIdempotencyKey(order.id, 'payment-intent-create');

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: Math.round(finalTotal * 100), // Stripe expects cents
        currency: input.currency.toLowerCase(),
        customer: stripeCustomerId,
        setup_future_usage: input.savePaymentMethod && stripeCustomerId ? 'off_session' : undefined,
        payment_method_types: ['card', 'klarna', 'link'],
        metadata: {
          order_id: order.id,
          order_number: orderNumber,
          locale: input.locale,
        },
        shipping: {
          name: input.shippingAddress.fullName,
          address: {
            line1: input.shippingAddress.line1,
            line2: input.shippingAddress.line2 || '',
            city: input.shippingAddress.city,
            state: input.shippingAddress.region || '',
            postal_code: input.shippingAddress.postalCode,
            country: shippingCountry,
          },
        },
      },
      { idempotencyKey }
    );

    // 12. Save payment reference on order
    await supabase
      .from('orders')
      .update({ payment_reference: paymentIntent.id })
      .eq('id', order.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      orderNumber,
    });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred during checkout initiation.' },
      { status: 500 }
    );
  }
}
