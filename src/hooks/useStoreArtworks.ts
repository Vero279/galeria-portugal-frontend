import { useState, useEffect } from 'react';
import { strapiAPI, getStrapiImageUrl } from '../services/strapi';
import type { Artwork } from '../lib/types';
import { logger } from '../utils/logger';

export function useStoreArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const data = await strapiAPI.getCollection<Artwork>(
          'artworks',
          {
            'filters[price][$gt]': '0',
            'filters[isPublished][$eq]': 'true',
          },
          'artist',
          true
        );
        const mapped = data.map(aw => ({
          ...aw,
          image_url: getStrapiImageUrl(aw.image_url),
        }));
        setArtworks(mapped);
      } catch (err) {
        logger.error('useStoreArtworks error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  return { artworks, loading };
}