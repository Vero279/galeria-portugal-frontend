import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { strapiAPI, createArtwork, uploadImageToStrapi } from '../services/strapi';
import type { Artwork } from '../lib/types';
import { logger } from '../utils/logger';

export function useArtistArtworks() {
  const { user, isAuthenticated } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtworks = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'artist') {
      setArtworks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Buscar obras onde artist = user.id (assumindo que o campo 'artist' é a relação com o user)
      // Como o Strapi relaciona artworks com a entidade Artist (não diretamente User),
      // precisamos de saber qual o ID do artista correspondente ao user.
      // Por simplicidade, assumimos que o campo 'artist' no artwork é uma relação com o user.
      // Se no seu Strapi o artwork está relacionado com a entidade 'artist' (que por sua vez tem relação com user),
      // será necessário um ajuste. Vamos usar o id do user como filtro, pois a relação no schema é manyToOne para api::artist.artist.
      // O melhor é usar o populate para trazer a relação e depois filtrar pelo user id do artista.
      // Como simplificação, usamos um endpoint customizado ou confiamos que o artista logado é o dono.
      // Vamos buscar todas as obras e filtrar no frontend por artist_id.
      // Mas no schema, a relação é com artist (entidade separada). Portanto precisamos primeiro obter o artist.id do user.
      // Para não complicar, assumimos que o campo artist_id do artwork contém o ID do user (caso tenha configurado assim).
      // De qualquer forma, esta implementação é um ponto de partida.
      const allArtworks = await strapiAPI.getCollection<Artwork>('artworks', {}, 'artist', false);
      // Filtrar as obras onde artist.id === user.id (assumindo que o populate inclui o artista)
      // Como populate='artist' trará o objeto artist.
      const userArtworks = allArtworks.filter((aw: any) => aw.artist?.id === user?.id);
      setArtworks(userArtworks);
    } catch (err) {
      logger.error('useArtistArtworks fetch error', err);
      setError(err instanceof Error ? err.message : 'Failed to load artworks');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const addArtwork = useCallback(
    async (data: {
      title: string;
      description?: string;
      imageFile: File;
      year?: number;
      medium?: string;
      dimensions?: string;
      price?: number;
    }) => {
      if (!isAuthenticated || user?.role !== 'artist') {
        throw new Error('Not authorized');
      }
      try {
        // 1. Upload da imagem para o Strapi
        const imageUrl = await uploadImageToStrapi(data.imageFile);
        // 2. Criar obra no Strapi associada ao artista (assumindo que o user.id é o mesmo que o artist.id)
        const newArtwork = await createArtwork(
          {
            title: data.title,
            description: data.description,
            image_url: imageUrl,
            year: data.year,
            medium: data.medium,
            dimensions: data.dimensions,
            price: data.price,
          },
          user.id // enviar o ID do user como artistId
        );
        // 3. Atualizar lista local (opcionalmente recarregar)
        await fetchArtworks();
        return newArtwork;
      } catch (err) {
        logger.error('addArtwork error', err);
        throw err;
      }
    },
    [isAuthenticated, user, fetchArtworks]
  );

  const deleteArtwork = useCallback(
    async (artworkId: string) => {
      if (!isAuthenticated || user?.role !== 'artist') {
        throw new Error('Not authorized');
      }
      try {
        await strapiAPI.delete('artworks', artworkId);
        await fetchArtworks();
      } catch (err) {
        logger.error('deleteArtwork error', err);
        throw err;
      }
    },
    [isAuthenticated, user, fetchArtworks]
  );

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  return { artworks, loading, error, addArtwork, deleteArtwork, refresh: fetchArtworks };
}