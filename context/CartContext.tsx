'use client';
// CLIENT: Shopping cart global state, guest cookie session management, and slide-over drawer controls

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  getOrCreateCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  mergeGuestCartIntoUserCart,
  type CartWithItems,
} from '@/lib/supabase/queries/cart';

interface CartContextType {
  cart: CartWithItems | null;
  itemCount: number;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (params: { variantId: string; quantity?: number; unitPrice: number }) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  removeItem: (cartItemId: string) => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_SESSION_KEY = 'hermine_cart_session';

function getOrSetSessionToken(): string {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem(GUEST_SESSION_KEY);
  if (!token) {
    token = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(GUEST_SESSION_KEY, token);
    document.cookie = `${GUEST_SESSION_KEY}=${token}; path=/; max-age=2592000; SameSite=Lax`;
  }
  return token;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    try {
      const sessionToken = getOrSetSessionToken();
      const currentCart = await getOrCreateCart({
        sessionToken: !userId ? sessionToken : null,
        customerId: userId,
      });
      setCart(currentCart);
    } catch (err) {
      console.error('Failed to refresh cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Listen to Supabase auth state changes and handle merge-on-login
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user;
      if (user) {
        setUserId(user.id);
      } else {
        refreshCart();
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUserId = session?.user?.id || null;
      setUserId(newUserId);

      if (event === 'SIGNED_IN' && newUserId) {
        const guestToken = localStorage.getItem(GUEST_SESSION_KEY);
        if (guestToken) {
          await mergeGuestCartIntoUserCart(guestToken, newUserId);
          localStorage.removeItem(GUEST_SESSION_KEY);
          document.cookie = `${GUEST_SESSION_KEY}=; path=/; max-age=0;`;
        }
      }
      refreshCart();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [refreshCart]);

  useEffect(() => {
    refreshCart();
  }, [userId, refreshCart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (params: {
    variantId: string;
    quantity?: number;
    unitPrice: number;
  }): Promise<boolean> => {
    setIsLoading(true);
    const sessionToken = getOrSetSessionToken();

    let targetCart = cart;
    if (!targetCart) {
      targetCart = await getOrCreateCart({
        sessionToken: !userId ? sessionToken : null,
        customerId: userId,
      });
      setCart(targetCart);
    }

    if (!targetCart) {
      setIsLoading(false);
      return false;
    }

    const success = await addItemToCart({
      cartId: targetCart.id,
      variantId: params.variantId,
      quantity: params.quantity || 1,
      unitPrice: params.unitPrice,
    });

    if (success) {
      await refreshCart();
      openCart();
    }
    setIsLoading(false);
    return success;
  };

  const updateQuantity = async (cartItemId: string, quantity: number): Promise<boolean> => {
    const success = await updateCartItemQuantity(cartItemId, quantity);
    if (success) {
      await refreshCart();
    }
    return success;
  };

  const removeItem = async (cartItemId: string): Promise<boolean> => {
    const success = await removeCartItem(cartItemId);
    if (success) {
      await refreshCart();
    }
    return success;
  };

  const itemCount = cart?.totalQuantity || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isOpen,
        isLoading,
        openCart,
        closeCart,
        addItem,
        updateQuantity,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
