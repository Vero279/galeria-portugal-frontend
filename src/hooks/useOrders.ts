import { useState, useEffect, useCallback } from 'react';
import { strapiAPI } from '../services/strapi';
import type { Order } from '../lib/types';
import { logger } from '../utils/logger';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const getSessionId = () => {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2);
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  const loadOrders = useCallback(async () => {
    const sessionId = getSessionId();
    setLoading(true);
    try {
      const data = await strapiAPI.getCollection<Order>('orders', { 'filters[session_id][$eq]': sessionId }, 'order_items', true);
      setOrders(data);
    } catch (err) {
      logger.error('loadOrders error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'session_id' | 'created_at' | 'updated_at'>) => {
    const sessionId = getSessionId();
    try {
      const newOrder = await strapiAPI.create<Order>('orders', { ...orderData, session_id: sessionId });
      await loadOrders();
      return newOrder;
    } catch (err) {
      logger.error('createOrder error', err);
      return null;
    }
  };

  return { orders, loading, createOrder, loadOrders };
}