import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ArtistEvent } from './useArtistEvents';
import { logger } from '../utils/logger';

export function useAllEvents() {
  const [events, setEvents] = useState<ArtistEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('artist_events')
      .select('*')
      .order('event_date', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          logger.error('useAllEvents error', error);
        } else if (data) {
          setEvents(data);
        }
        setLoading(false);
      });
  }, []);

  return { events, loading };
}