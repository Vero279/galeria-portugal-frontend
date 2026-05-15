// src/hooks/useAllEvents.ts
import { useState, useEffect } from 'react';
import { strapiAPI, getStrapiImageUrl } from '../services/strapi';
import type { Event } from '../lib/types';
import { logger } from '../utils/logger';

export function useAllEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await strapiAPI.getCollection<Event>(
          'artist-events',
          { 'filters[isPublished][$eq]': 'true' },
          ['city', 'artists'],
          true
        );
        const mapped = data.map(ev => ({
          ...ev,
          image_url: getStrapiImageUrl(ev.image_url),
        }));
        mapped.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
        setEvents(mapped);
      } catch (err) {
        logger.error('useAllEvents error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return { events, loading };
}