// src/hooks/useAllArtists.ts
import { useState, useEffect } from 'react';
import { strapiAPI, getStrapiImageUrl } from '../services/strapi';
import type { Artist } from '../lib/types';
import { logger } from '../utils/logger';

export function useAllArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const data = await strapiAPI.getCollection<Artist>(
          'artists',
          { 'filters[isPublished][$eq]': 'true' },
          'city', // popular a cidade para ter city.name e city.slug
          true
        );
        const mapped = data.map(artist => ({
          ...artist,
          profile_image: getStrapiImageUrl(artist.profile_image),
          cover_image: getStrapiImageUrl(artist.cover_image),
          city: artist.city ? {
            ...artist.city,
            image_url: getStrapiImageUrl(artist.city.image_url),
          } : undefined,
        }));
        setArtists(mapped);
      } catch (err) {
        logger.error('useAllArtists error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  return { artists, loading };
}