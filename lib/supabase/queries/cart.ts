import { createClient } from '@/lib/supabase/client';
import type { Product, ProductVariant, ProductImage } from '@/lib/supabase/queries/catalog';

export interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  created_at?: string;
  variant?: {
    id: string;
    size: string;
    color?: string | null;
    sku: string;
    stock_quantity: number;
    product?: {
      id: string;
      slug: string;
      name_fr: string;
      name_en: string;
      material: string;
      price_currency: string;
      category?: {
        slug: string;
        parent?: {
          slug: string;
        } | null;
      };
      images: Array<{
        url: string;
        alt_text_fr: string;
        alt_text_en: string;
      }>;
    };
  };
}

export interface Cart {
  id: string;
  customer_id?: string | null;
  session_token?: string | null;
  currency: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartWithItems extends Cart {
  items: CartItem[];
  subtotal: number;
  totalQuantity: number;
}

export async function getOrCreateCart(params: {
  sessionToken?: string | null;
  customerId?: string | null;
}): Promise<CartWithItems | null> {
  const { sessionToken, customerId } = params;
  if (!sessionToken && !customerId) return null;

  try {
    const supabase = createClient();

    // 1. Look for existing cart
    let query = supabase.from('carts').select('*');
    if (customerId) {
      query = query.eq('customer_id', customerId);
    } else if (sessionToken) {
      query = query.eq('session_token', sessionToken);
    }

    const { data: existingCarts } = await query.order('created_at', { ascending: false }).limit(1);

    let cart: Cart | null = existingCarts?.[0] || null;

    // 2. If no cart exists, create a new one
    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({
          customer_id: customerId || null,
          session_token: !customerId ? sessionToken : null,
          currency: 'EUR',
        })
        .select('*')
        .single();

      if (createError || !newCart) {
        return null;
      }
      cart = newCart as Cart;
    }

    // 3. Fetch cart items with variant and product relations
    const { data: itemsData, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        id, cart_id, variant_id, quantity, unit_price, created_at,
        variant:product_variants (
          id, size, color, sku, stock_quantity,
          product:products (
            id, slug, name_fr, name_en, material, price_currency,
            images:product_images (url, alt_text_fr, alt_text_en)
          )
        )
      `)
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: true });

    const items = (itemsData || []) as unknown as CartItem[];
    const subtotal = items.reduce((acc, item) => acc + item.quantity * Number(item.unit_price), 0);
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

    return {
      ...cart,
      items,
      subtotal,
      totalQuantity,
    };
  } catch (error) {
    console.error('Error in getOrCreateCart:', error);
    return null;
  }
}

export async function addItemToCart(params: {
  cartId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
}): Promise<boolean> {
  const { cartId, variantId, quantity, unitPrice } = params;

  try {
    const supabase = createClient();

    // Check if variant already in cart
    const { data: existingItems } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cartId)
      .eq('variant_id', variantId)
      .limit(1);

    const existing = existingItems?.[0];

    if (existing) {
      const newQty = existing.quantity + quantity;
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQty })
        .eq('id', existing.id);
      return !error;
    } else {
      const { error } = await supabase.from('cart_items').insert({
        cart_id: cartId,
        variant_id: variantId,
        quantity,
        unit_price: unitPrice,
      });
      return !error;
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return false;
  }
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<boolean> {
  try {
    const supabase = createClient();
    if (quantity <= 0) {
      const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId);
      return !error;
    } else {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);
      return !error;
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    return false;
  }
}

export async function removeCartItem(cartItemId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId);
    return !error;
  } catch (error) {
    console.error('Error removing cart item:', error);
    return false;
  }
}

export async function mergeGuestCartIntoUserCart(
  sessionToken: string,
  customerId: string
): Promise<void> {
  try {
    const supabase = createClient();

    // Find guest cart
    const { data: guestCart } = await supabase
      .from('carts')
      .select('id')
      .eq('session_token', sessionToken)
      .maybeSingle();

    if (!guestCart) return;

    // Find or create customer cart
    let customerCart = await getOrCreateCart({ customerId });
    if (!customerCart) return;

    // Get guest items
    const { data: guestItems } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', guestCart.id);

    if (guestItems && guestItems.length > 0) {
      for (const item of guestItems) {
        await addItemToCart({
          cartId: customerCart.id,
          variantId: item.variant_id,
          quantity: item.quantity,
          unitPrice: item.unit_price,
        });
      }
    }

    // Delete guest cart (cascades to items)
    await supabase.from('carts').delete().eq('id', guestCart.id);
  } catch (error) {
    console.error('Error merging guest cart on login:', error);
  }
}
