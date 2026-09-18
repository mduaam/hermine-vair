import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/supabase/queries/catalog';

export interface CustomerProfile {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  locale: string;
  preferred_currency: string;
  marketing_opt_in: boolean;
  stripe_customer_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Address {
  id: string;
  customer_id: string;
  label?: string | null;
  full_name: string;
  line1: string;
  line2?: string | null;
  city: string;
  region?: string | null;
  postal_code: string;
  country: string;
  is_default_shipping: boolean;
  is_default_billing: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  product_name_snapshot: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string | null;
  email: string;
  locale: string;
  currency: string;
  status: 'pending' | 'paid' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  shipping_total: number;
  duties_estimate: number;
  tax_total: number;
  total: number;
  shipping_address_id?: string | null;
  billing_address_id?: string | null;
  payment_provider?: string | null;
  payment_reference?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  shipping_address?: Address | null;
}

export interface WishlistItem {
  id: string;
  customer_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export async function getCustomerProfile(userId: string): Promise<CustomerProfile | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching customer profile:', error);
      return null;
    }
    return data as CustomerProfile | null;
  } catch (err) {
    console.error('Error in getCustomerProfile:', err);
    return null;
  }
}

export async function updateCustomerProfile(
  userId: string,
  updates: Partial<Omit<CustomerProfile, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('customer_profiles')
      .upsert({
        id: userId,
        ...updates,
      });

    if (error) {
      console.error('Error updating customer profile:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error in updateCustomerProfile:', err);
    return false;
  }
}

export async function getCustomerOrders(userId: string): Promise<Order[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (*),
        shipping_address:addresses (*)
      `)
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    return (data || []) as unknown as Order[];
  } catch (err) {
    console.error('Error in getCustomerOrders:', err);
    return [];
  }
}

export async function getCustomerAddresses(userId: string): Promise<Address[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('customer_id', userId)
      .order('is_default_shipping', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }
    return (data || []) as Address[];
  } catch (err) {
    console.error('Error in getCustomerAddresses:', err);
    return [];
  }
}

export async function saveAddress(address: Partial<Address> & { customer_id: string }): Promise<Address | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('addresses')
      .upsert(address)
      .select()
      .single();

    if (error) {
      console.error('Error saving address:', error);
      return null;
    }
    return data as Address;
  } catch (err) {
    console.error('Error in saveAddress:', err);
    return null;
  }
}

export async function deleteAddress(addressId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId);

    return !error;
  } catch (err) {
    console.error('Error in deleteAddress:', err);
    return false;
  }
}

export async function getCustomerWishlist(userId: string): Promise<WishlistItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        id, customer_id, product_id, created_at,
        product:products (
          id, slug, name_fr, name_en, price_amount, price_currency, material,
          images:product_images (url, alt_text_fr, alt_text_en)
        )
      `)
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
    return (data || []) as unknown as WishlistItem[];
  } catch (err) {
    console.error('Error in getCustomerWishlist:', err);
    return [];
  }
}

export async function toggleWishlistItem(userId: string, productId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    // Check if exists
    const { data } = await supabase
      .from('wishlists')
      .select('id')
      .eq('customer_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (data) {
      const { error } = await supabase.from('wishlists').delete().eq('id', data.id);
      return !error;
    } else {
      const { error } = await supabase.from('wishlists').insert({
        customer_id: userId,
        product_id: productId,
      });
      return !error;
    }
  } catch (err) {
    console.error('Error in toggleWishlistItem:', err);
    return false;
  }
}
