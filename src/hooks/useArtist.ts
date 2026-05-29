import { useState, useEffect } from 'react';
import { strapiAPI, getStrapiImageUrl } from '../services/strapi';
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

    const fetchArtist = async () => {
      setLoading(true);
      try {
        // Buscar artista pelo slug (populando city)
        const artistData = await strapiAPI.getBySlug<Artist & { city?: any }>(
          'artists',
          artistSlug,
          'slug',
          'city'
        );
        if (!artistData) {
          setArtist(null);
          setArtworks([]);
          setLoading(false);
          return;
        }
        const mappedArtist: Artist = {
          ...artistData,
          profile_image: getStrapiImageUrl(artistData.profile_image),
          cover_image: getStrapiImageUrl(artistData.cover_image),
          city: artistData.city ? { ...artistData.city, image_url: getStrapiImageUrl(artistData.city.image_url) } : undefined,
        };
        setArtist(mappedArtist);

        // Buscar obras do artista – agora sem artwork_description e com filtro is_published
        const artworksData = await strapiAPI.getCollection<Artwork>(
          'artworks',
          {
            'filters[artist][slug][$eq]': artistSlug,
            'filters[isPublished][$eq]': 'true',   // ← adicionar o filtro manualmente
          },
          'artist',   // ← só precisa de popular o artista, não artwork_description
          true
        );
        const mappedArtworks: ArtworkWithDescription[] = artworksData.map(aw => ({
          ...aw,
          image_url: getStrapiImageUrl(aw.image_url),
          description: aw.description, // directo
        }));
        setArtworks(mappedArtworks);
      } catch (err) {
        logger.error('useArtist error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistSlug]);

  return { artist, artworks, loading };
}