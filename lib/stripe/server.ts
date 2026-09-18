import Stripe from 'stripe';
import { createHash } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

// SERVER-ONLY: Stripe SDK instance using secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
  typescript: true,
});

/**
 * Deterministic idempotency key from inputs.
 * Stripe returns the same result for the same key within 24h.
 */
export function stripeIdempotencyKey(...parts: string[]): string {
  return createHash('sha256')
    .update(parts.join(':'))
    .digest('hex')
    .slice(0, 64);
}

/**
 * Retrieves existing Stripe customer ID from customer_profiles or creates a new one in Stripe.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const supabase = createAdminClient();

  // 1. Check if we already have a Stripe Customer ID
  const { data: profile } = await supabase
    .from('customer_profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // 2. Create Stripe Customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { supabase_user_id: userId },
  });

  // 3. Persist on profile
  await supabase
    .from('customer_profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId);

  return customer.id;
}
