import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ArtistEvent } from '../lib/types'; // define in types.ts later
import { logger } from '../utils/logger';

// Extend type if needed (original had ArtistEvent interface)
export interface ArtistEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
  city_id?: string;
  artist_id?: string;
  city?: any;
  artist?: any;
}

export function useArtistEvents(citySlug: string) {
  const [events, setEvents] = useState<ArtistEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!citySlug) return;
    supabase
      .from('cities')
      .select('id')
      .eq('slug', citySlug)
      .maybeSingle()
      .then(({ data: city, error: cityError }) => {
        if (cityError) {
          logger.error('useArtistEvents city fetch error', cityError);
          setLoading(false);
          return;
        }
        if (!city) {
          setLoading(false);
          return;
        }
        supabase
          .from('artist_events')
          .select('*')
          .eq('city_id', city.id)
          .order('event_date', { ascending: true })
          .then(({ data, error }) => {
            if (error) {
              logger.error('useArtistEvents events fetch error', error);
            } else if (data) {
              setEvents(data);
            }
            setLoading(false);
          });
      });
  }, [citySlug]);

  return { events, loading };
}