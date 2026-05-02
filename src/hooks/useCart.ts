import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { CartItem } from '../lib/types';
import { logger } from '../utils/logger';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const getSessionId = () => {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2);
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  const loadCart = useCallback(async () => {
    const sessionId = getSessionId();
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId);
    if (error) {
      logger.error('loadCart error', error);
    } else if (data) {
      setCartItems(data);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    const sessionId = getSessionId();
    const existing = cartItems.find(item => item.product_id === productId);

    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);
      if (error) {
        logger.error('addToCart update error', error);
        return;
      }
      await loadCart();
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert({ session_id: sessionId, product_id: productId, quantity });
      if (error) {
        logger.error('addToCart insert error', error);
        return;
      }
      await loadCart();
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId);
    if (error) {
      logger.error('removeFromCart error', error);
      return;
    }
    await loadCart();
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }
    const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', cartItemId);
    if (error) {
      logger.error('updateQuantity error', error);
      return;
    }
    await loadCart();
  };

  const clearCart = async () => {
    const sessionId = getSessionId();
    const { error } = await supabase.from('cart_items').delete().eq('session_id', sessionId);
    if (error) {
      logger.error('clearCart error', error);
      return;
    }
    await loadCart();
  };

  return { cartItems, addToCart, removeFromCart, updateQuantity, clearCart };
}