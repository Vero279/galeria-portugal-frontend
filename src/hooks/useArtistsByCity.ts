// src/hooks/useArtistsByCity.ts
import { useState, useEffect } from 'react';
import { strapiAPI, getStrapiImageUrl } from '../services/strapi';
import type { Artist, City } from '../lib/types';
import { logger } from '../utils/logger';

export function useArtistsByCity(citySlug: string) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!citySlug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Buscar a cidade pelo slug
        const cityData = await strapiAPI.getBySlug<City>('cities', citySlug, 'slug', '');
        if (!cityData) {
          setLoading(false);
          return;
        }
        setCity({
          ...cityData,
          image_url: getStrapiImageUrl(cityData.image_url),
        });

        // Buscar artistas com city_id = cityData.id
        const artistsData = await strapiAPI.getCollection<Artist>(
          'artists',
          {
            'filters[city][id][$eq]': cityData.id,
            'filters[isPublished][$eq]': 'true',
          },
          'city',
          true
        );
        const mapped = artistsData.map(artist => ({
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
        logger.error('useArtistsByCity error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [citySlug]);

  return { artists, city, loading };
}