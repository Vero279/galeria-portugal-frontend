import { useState, useEffect } from 'react';
import { Palette, Eye, Upload } from 'lucide-react';
import ArtworkCard from '../components/common/ArtworkCard';
import WallVisualizer from '../components/common/WallVisualizer';
import { useAllArtworks } from '../hooks/useAllArtworks';
import type { Artwork } from '../lib/types';

export default function WallPage() {
  const { artworks, loading } = useAllArtworks();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleArtworkSelect = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseVisualizer = () => {
    setSelectedArtwork(null);
  };

  if (isLoading && artworks.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center pt-40">
        <div className="flex flex-col items-center gap-4">
          <div className="w-px h-16 bg-white/10 animate-pulse" />
          <p className="text-white/30 text-xs tracking-widest uppercase">A carregar...</p>
        </div>
      </div>
    );
  }

  if (selectedArtwork) {
    return (
      <WallVisualizer
        artwork={selectedArtwork}
        onClose={handleCloseVisualizer}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-40 pb-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
              <Eye size={20} className="text-amber-400" />
            </div>
            <h1 className="text-white text-5xl md:text-6xl font-light tracking-wider">
              Parede Virtual
            </h1>
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl mb-8">
            Visualize como as obras de arte se enquadram no seu espaço. Seleccione uma obra, carregue uma foto do seu ambiente e veja a obra sobreposada em tempo real.
          </p>

          <div className="flex flex-wrap gap-6 text-white/40 text-xs">
            <div className="flex items-center gap-2">
              <Upload size={14} />
              <span>Carregue sua parede</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette size={14} />
              <span>Posicione e dimensione</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={14} />
              <span>Visualize em tempo real</span>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white text-2xl font-light tracking-wider">
              Escolha uma Obra
            </h2>
            <div className="text-white/40 text-xs tracking-widest uppercase">
              {artworks.length} obra{artworks.length !== 1 ? 's' : ''} disponível{artworks.length !== 1 ? 's' : ''}
            </div>
          </div>

          {artworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map(artwork => (
                <div
                  key={artwork.id}
                  className="group cursor-pointer"
                  onClick={() => handleArtworkSelect(artwork)}
                >
                  <ArtworkCard
                    artwork={artwork}
                    onExperiment={() => handleArtworkSelect(artwork)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette size={24} className="text-white/20" />
              </div>
              <p className="text-white/40 text-sm mb-2">Nenhuma obra disponível</p>
              <p className="text-white/20 text-xs">Volte mais tarde para explorar novas obras</p>
            </div>
          )}
        </div>

        {artworks.length > 0 && (
          <div className="border-t border-white/10 pt-8 mt-16">
            <div className="text-center">
              <p className="text-white/30 text-xs tracking-widest uppercase mb-2">
                Como funciona
              </p>
              <p className="text-white/40 text-sm max-w-md mx-auto">
                Clique em qualquer obra para abrir o visualizador. Carregue uma foto da sua parede e veja como a obra fica no seu espaço.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}