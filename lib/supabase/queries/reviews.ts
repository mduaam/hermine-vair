import { createClient } from '@/lib/supabase/client';
import { createAdminClient } from '@/lib/supabase/admin';

export interface ProductReview {
  id: string;
  product_id: string;
  order_item_id?: string | null;
  customer_id?: string | null;
  rating: number;
  title: string;
  body: string;
  status: 'pending' | 'approved' | 'rejected';
  helpful_count: number;
  is_featured: boolean;
  created_at: string;
  customer_name?: string;
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  distribution: { [star: number]: number };
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  if (!productId || !UUID_REGEX.test(productId)) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }

    return (data || []) as ProductReview[];
  } catch (err) {
    console.error('Error in getProductReviews:', err);
    return [];
  }
}

export async function getProductRatingSummary(productId: string): Promise<RatingSummary> {
  const reviews = await getProductReviews(productId);

  if (reviews.length === 0) {
    return {
      averageRating: 5.0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const distribution: { [star: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  reviews.forEach((r) => {
    sum += r.rating;
    const current = distribution[r.rating];
    if (typeof current === 'number') {
      distribution[r.rating] = current + 1;
    }
  });

  const averageRating = Number((sum / reviews.length).toFixed(1));

  return {
    averageRating,
    totalReviews: reviews.length,
    distribution,
  };
}

export async function checkCanReview(
  userId: string,
  productId: string
): Promise<{ canReview: boolean; orderItemId?: string; reason?: string }> {
  try {
    const supabase = createClient();

    // Look for delivered or fulfilled orders for this customer containing this product
    const { data: orderItems, error } = await supabase
      .from('order_items')
      .select(`
        id,
        order:orders!inner (
          customer_id,
          status
        ),
        variant:product_variants!inner (
          product_id
        )
      `)
      .eq('order.customer_id', userId)
      .in('order.status', ['delivered', 'fulfilled', 'paid'])
      .eq('variant.product_id', productId);

    if (error || !orderItems || orderItems.length === 0) {
      return {
        canReview: false,
        reason: 'Seuls les clients ayant acquis cette pièce peuvent déposer un avis vérifié.',
      };
    }

    // Check if review already exists for any of these order items
    const orderItemIds = orderItems.map((oi) => oi.id);
    const { data: existingReviews } = await supabase
      .from('product_reviews')
      .select('order_item_id')
      .in('order_item_id', orderItemIds);

    const reviewedOrderItemIds = new Set(existingReviews?.map((r) => r.order_item_id));
    const availableOrderItem = orderItems.find((oi) => !reviewedOrderItemIds.has(oi.id));

    if (!availableOrderItem) {
      return {
        canReview: false,
        reason: 'Vous avez déjà déposé un avis pour chaque exemplaire acquis.',
      };
    }

    return {
      canReview: true,
      orderItemId: availableOrderItem.id,
    };
  } catch (err) {
    console.error('Error checking canReview:', err);
    return { canReview: false };
  }
}

export async function voteReviewHelpful(reviewId: string, voterId: string): Promise<boolean> {
  try {
    const supabase = createClient();

    // 1. Insert into review_votes
    const { error: voteError } = await supabase.from('review_votes').insert({
      review_id: reviewId,
      voter_id: voterId,
    });

    if (voteError) {
      // User likely already voted (primary key collision)
      return false;
    }

    // 2. Increment helpful count
    await supabase.rpc('increment_review_helpful', { p_review_id: reviewId });
    return true;
  } catch (err) {
    console.error('Error voting review helpful:', err);
    return false;
  }
}
