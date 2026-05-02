import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Artwork } from '../lib/types';
import { logger } from '../utils/logger';
import type { ArtworkWithDescription } from './useArtist';

export function useAllArtworks() {
  const [artworks, setArtworks] = useState<ArtworkWithDescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false })
      .then(async ({ data, error }) => {
        if (error) {
          logger.error('useAllArtworks error', error);
          setLoading(false);
          return;
        }
        if (data) {
          const withDescriptions = await Promise.all(
            data.map(async (artwork) => {
              const { data: descData, error: descError } = await supabase
                .from('artwork_descriptions')
                .select('description')
                .eq('artwork_id', artwork.id)
                .maybeSingle();
              if (descError) {
                logger.warn(`Description fetch error for artwork ${artwork.id}`, descError);
              }
              return { ...artwork, description: descData?.description };
            })
          );
          setArtworks(withDescriptions);
        }
        setLoading(false);
      });
  }, []);

  return { artworks, loading };
}