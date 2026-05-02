import { useState, useEffect } from 'react';
import { strapiAPI, getStrapiImageUrl } from '../services/strapi';
import type { City } from '../lib/types';
import { logger } from '../utils/logger';

function mapCity(item: any): City {
  return {
    id: String(item.id),
    name: item.name,
    slug: item.slug,
    image_url: getStrapiImageUrl(item.image_url),
    description: item.description,
    is_published: item.is_published === true,
    created_at: item.createdAt,
  };
}

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    strapiAPI.getCollection<any>('cities', {}, '')
      .then(items => {
        setCities(items.map(mapCity));
        setLoading(false);
      })
      .catch(err => {
        // Only log if it's not a 403 (unauthorized) – because public access will be fixed
        if (err.message !== 'Forbidden') {
          logger.error('useCities error', err);
        }
        setLoading(false);
      });
  }, []);

  return { cities, loading };
}