// src/hooks/useArtistEvents.ts
import { useState, useEffect } from 'react';
import { strapiAPI, getStrapiImageUrl } from '../services/strapi';
import type { Event } from '../lib/types';
import { logger } from '../utils/logger';

export function useArtistEvents(citySlug: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!citySlug) return;

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const cityData = await strapiAPI.getBySlug<any>('cities', citySlug, 'slug', '');
        if (!cityData) {
          setLoading(false);
          return;
        }
        const eventsData = await strapiAPI.getCollection<Event>(
          'artist-events',
          {
            'filters[city][id][$eq]': cityData.id,
            'filters[isPublished][$eq]': 'true',
          },
          ['city', 'artists'], 
          true
        );
        const mapped = eventsData.map(ev => ({
          ...ev,
          image_url: getStrapiImageUrl(ev.image_url),
          event_date: ev.event_date,
        }));
        mapped.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
        setEvents(mapped);
      } catch (err) {
        logger.error('useArtistEvents error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [citySlug]);

  return { events, loading };
}