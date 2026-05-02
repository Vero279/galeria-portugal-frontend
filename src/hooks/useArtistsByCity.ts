import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Artist, City } from '../lib/types';
import { logger } from '../utils/logger';

export function useArtistsByCity(citySlug: string) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!citySlug) return;
    supabase
      .from('cities')
      .select('*')
      .eq('slug', citySlug)
      .maybeSingle()
      .then(({ data: cityData, error: cityError }) => {
        if (cityError) {
          logger.error('useArtistsByCity city fetch error', cityError);
          setLoading(false);
          return;
        }
        if (!cityData) {
          setLoading(false);
          return;
        }
        setCity(cityData);
        supabase
          .from('artists')
          .select('*')
          .eq('city_id', cityData.id)
          .eq('is_published', true)
          .then(({ data, error }) => {
            if (error) {
              logger.error('useArtistsByCity artists fetch error', error);
            } else if (data) {
              setArtists(data);
            }
            setLoading(false);
          });
      });
  }, [citySlug]);

  return { artists, city, loading };
}