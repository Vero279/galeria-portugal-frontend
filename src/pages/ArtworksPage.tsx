import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import ArtworkCard from '../components/common/ArtworkCard';
import WallVisualizer from '../components/common/WallVisualizer';
import { useAllArtworks } from '../hooks/useAllArtworks';
import type { Artwork } from '../lib/types';
import { ROUTES } from '../lib/constants';

export default function ArtworksPage() {
  const { artworks, loading } = useAllArtworks();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMedium, setFilterMedium] = useState<string>('all');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [wallVisualizerArtwork, setWallVisualizerArtwork] = useState<Artwork | null>(null);

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.artist?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMedium = filterMedium === 'all' || artwork.medium === filterMedium;
    return matchesSearch && matchesMedium;
  });

  const mediums = ['all', ...new Set(artworks.map(a => a.medium).filter(Boolean))];

  if (loading && artworks.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center pt-40">
        <div className="w-px h-16 bg-white/10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-40 pb-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="text-white text-5xl md:text-6xl font-light tracking-wider mb-2">
            Galeria de Obras
          </h1>
          <p className="text-white/40 text-sm">
            {filteredArtworks.length} obra{filteredArtworks.length !== 1 ? 's' : ''} encontrada{filteredArtworks.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mb-12 space-y-6">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Procura por obra ou artista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {mediums.map(medium => (
              <button
                key={medium}
                onClick={() => setFilterMedium(medium)}
                className={`px-4 py-2 text-xs tracking-wider uppercase transition-all ${
                  filterMedium === medium
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {medium === 'all' ? 'Todas' : medium}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredArtworks.map(artwork => (
            <div
              key={artwork.id}
              onClick={() => setSelectedArtwork(artwork)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <ArtworkCard 
                artwork={artwork} 
                onExperiment={() => setWallVisualizerArtwork(artwork)}
              />
            </div>
          ))}
        </div>

        {selectedArtwork && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedArtwork(null)}
          >
            <div
              className="bg-[#0d0d0d] max-w-2xl w-full rounded-lg overflow-hidden border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedArtwork.image_url}
                alt={selectedArtwork.title}
                className="w-full h-96 object-cover"
              />
              <div className="p-8">
                <h2 className="text-white text-2xl font-light tracking-wider mb-2">
                  {selectedArtwork.title}
                </h2>
                {selectedArtwork.artist && (
                  <p
                    className="text-white/60 cursor-pointer hover:text-white mb-4"
                    onClick={() => {
                      setSelectedArtwork(null);
                      navigate(ROUTES.ARTIST.replace(':artistSlug', selectedArtwork.artist!.slug));
                    }}
                  >
                    por {selectedArtwork.artist.name}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-white/50">
                  <div>
                    <p className="uppercase tracking-wider text-xs mb-1">Ano</p>
                    <p className="text-white">{selectedArtwork.year || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wider text-xs mb-1">Técnica</p>
                    <p className="text-white">{selectedArtwork.medium || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wider text-xs mb-1">Dimensões</p>
                    <p className="text-white">{selectedArtwork.dimensions || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wider text-xs mb-1">Preço</p>
                    <p className="text-white">{selectedArtwork.price ? `€${selectedArtwork.price.toFixed(0)}` : 'Sob consulta'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs tracking-wider uppercase transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredArtworks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40 text-sm">Nenhuma obra encontrada</p>
          </div>
        )}
      </div>

      {wallVisualizerArtwork && (
        <WallVisualizer
          artwork={wallVisualizerArtwork}
          onClose={() => setWallVisualizerArtwork(null)}
        />
      )}
    </div>
  );
}