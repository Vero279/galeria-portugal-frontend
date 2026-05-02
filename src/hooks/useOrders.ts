import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Order } from '../lib/types';
import { logger } from '../utils/logger';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

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
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });
    if (error) {
      logger.error('loadOrders error', error);
    } else if (data) {
      setOrders(data);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'session_id' | 'created_at' | 'updated_at'>) => {
    const sessionId = getSessionId();
    const { data: order, error } = await supabase
      .from('orders')
      .insert({ ...orderData, session_id: sessionId })
      .select()
      .maybeSingle();
    if (error) {
      logger.error('createOrder error', error);
      return null;
    }
    if (order) {
      await loadOrders();
    }
    return order;
  };

  return { orders, createOrder, loadOrders };
}