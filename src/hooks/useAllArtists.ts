import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Artist } from '../lib/types';
import { logger } from '../utils/logger';

export function useAllArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('artists')
      .select('*')
      .eq('is_published', true)
      .order('name')
      .then(({ data, error }) => {
        if (error) {
          logger.error('useAllArtists error', error);
        } else if (data) {
          setArtists(data);
        }
        setLoading(false);
      });
  }, []);

  return { artists, loading };
}