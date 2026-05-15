import { useState, useEffect, useCallback } from 'react';
import { strapiAPI, getStrapiImageUrl } from '../services/strapi';
import type { CartItem } from '../lib/types';
import { logger } from '../utils/logger';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    try {
      const items = await strapiAPI.getCollection<CartItem>(
        'cart-items',
        { 'filters[session_id][$eq]': sessionId },
        'artwork',
        true
      );
      const mapped = items.map(item => ({
        ...item,
        artwork: item.artwork ? {
          ...item.artwork,
          image_url: getStrapiImageUrl((item.artwork as any).image_url),
        } : undefined,
      }));
      setCartItems(mapped);
    } catch (err) {
      logger.error('loadCart error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (artworkId: string, quantity: number = 1) => {
    const sessionId = getSessionId();
    const existing = cartItems.find(item => item.artwork_id === artworkId);
    try {
      if (existing) {
        await strapiAPI.update('cart-items', existing.id, { quantity: existing.quantity + quantity });
      } else {
        await strapiAPI.create('cart-items', { session_id: sessionId, artwork: artworkId, quantity });
      }
      await loadCart();
    } catch (err) {
      logger.error('addToCart error', err);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      await strapiAPI.delete('cart-items', cartItemId);
      await loadCart();
    } catch (err) {
      logger.error('removeFromCart error', err);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }
    try {
      await strapiAPI.update('cart-items', cartItemId, { quantity });
      await loadCart();
    } catch (err) {
      logger.error('updateQuantity error', err);
    }
  };

  const clearCart = async () => {
    const sessionId = getSessionId();
    try {
      const items = await strapiAPI.getCollection<CartItem>('cart-items', { 'filters[session_id][$eq]': sessionId }, '', true);
      for (const item of items) {
        await strapiAPI.delete('cart-items', item.id);
      }
      await loadCart();
    } catch (err) {
      logger.error('clearCart error', err);
    }
  };

  return { cartItems, loading, addToCart, removeFromCart, updateQuantity, clearCart };
}