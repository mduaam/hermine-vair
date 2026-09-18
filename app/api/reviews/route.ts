import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const ReviewSubmitSchema = z.object({
  productId: z.string().uuid(),
  orderItemId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(150),
  body: z.string().min(10).max(1500),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId parameter' }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data: reviews, error } = await supabase
    .from('product_reviews')
    .select(`
      id, product_id, rating, title, body, helpful_count, is_featured, created_at,
      customer:customer_profiles ( first_name, last_name )
    `)
    .eq('product_id', productId)
    .eq('status', 'approved')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }

  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  try {
    const supabaseUserClient = createServerClient();
    const { data: { user } } = await supabaseUserClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to submit a review.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = ReviewSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { productId, orderItemId, rating, title, body: reviewBody } = parsed.data;

    // Verify ownership of the order_item and order status (must be paid/delivered/fulfilled)
    const adminClient = createAdminClient();
    const { data: orderItem, error: itemError } = await adminClient
      .from('order_items')
      .select(`
        id,
        order:orders ( id, customer_id, status )
      `)
      .eq('id', orderItemId)
      .single();

    const order = (orderItem as any)?.order;
    if (itemError || !order || order.customer_id !== user.id) {
      return NextResponse.json(
        { error: 'Verified purchase required. This item does not belong to your account.' },
        { status: 403 }
      );
    }

    // Insert into product_reviews (starts in 'pending' moderation status)
    const { data: review, error: insertError } = await adminClient
      .from('product_reviews')
      .insert({
        product_id: productId,
        order_item_id: orderItemId,
        customer_id: user.id,
        rating,
        title,
        body: reviewBody,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'A review has already been submitted for this purchase.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message:
        'Votre avis a été soumis avec succès et sera publié dès validation par notre équipe de modération.',
      review,
    });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
