import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/types';
import { logger } from '../utils/logger';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          logger.error('useProducts error', error);
        } else if (data) {
          setProducts(data);
        }
        setLoading(false);
      });
  }, []);

  return { products, loading };
}