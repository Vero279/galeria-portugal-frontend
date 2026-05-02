import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Artist, Artwork } from '../lib/types';
import { logger } from '../utils/logger';

export interface ArtworkWithDescription extends Artwork {
  description?: string;
}

export function useArtist(artistSlug: string) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<ArtworkWithDescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artistSlug) return;
    supabase
      .from('artists')
      .select('*')
      .eq('slug', artistSlug)
      .maybeSingle()
      .then(({ data: artistData, error: artistError }) => {
        if (artistError) {
          logger.error('useArtist artist fetch error', artistError);
          setLoading(false);
          return;
        }
        if (!artistData) {
          setLoading(false);
          return;
        }
        setArtist(artistData);
        supabase
          .from('artworks')
          .select('*')
          .eq('artist_id', artistData.id)
          .order('year', { ascending: false })
          .then(async ({ data: artworksData, error: artworksError }) => {
            if (artworksError) {
              logger.error('useArtist artworks fetch error', artworksError);
              setLoading(false);
              return;
            }
            if (artworksData) {
              const withDescriptions = await Promise.all(
                artworksData.map(async (artwork) => {
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
      });
  }, [artistSlug]);

  return { artist, artworks, loading };
}