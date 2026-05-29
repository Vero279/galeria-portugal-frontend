import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface ArtistContent {
  id: string;
  type: 'artwork' | 'text';
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  createdAt: string;
  artistId?: string;
}

export function useArtistContent() {
  const { user } = useAuth();
  const [contents, setContents] = useState<ArtistContent[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar conteúdos do localStorage
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const storageKey = `artist_content_${user.id}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      setContents(JSON.parse(stored));
    } else {
      // Dados de exemplo para novo artista
      const exampleContents: ArtistContent[] = [
        {
          id: '1',
          type: 'artwork',
          title: 'Obra de Exemplo',
          description: 'Uma bela pintura de exemplo',
          imageUrl: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=400',
          createdAt: new Date().toISOString(),
          artistId: user.id,
        },
      ];
      setContents(exampleContents);
      localStorage.setItem(storageKey, JSON.stringify(exampleContents));
    }

    setLoading(false);
  }, [user?.id]);

  const addContent = (content: Omit<ArtistContent, 'id' | 'createdAt' | 'artistId'>) => {
    if (!user) return;

    const newContent: ArtistContent = {
      ...content,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      artistId: user.id,
    };

    const updated = [newContent, ...contents];
    setContents(updated);

    const storageKey = `artist_content_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const updateContent = (id: string, updates: Partial<ArtistContent>) => {
    if (!user) return;

    const updated = contents.map(c => (c.id === id ? { ...c, ...updates } : c));
    setContents(updated);

    const storageKey = `artist_content_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const deleteContent = (id: string) => {
    if (!user) return;

    const updated = contents.filter(c => c.id !== id);
    setContents(updated);

    const storageKey = `artist_content_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const getArtworks = () => contents.filter(c => c.type === 'artwork');
  const getTexts = () => contents.filter(c => c.type === 'text');

  return {
    contents,
    loading,
    addContent,
    updateContent,
    deleteContent,
    getArtworks,
    getTexts,
  };
}
