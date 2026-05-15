import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Palette, Star } from 'lucide-react';
import FullscreenSlider from '../components/common/FullscreenSlider';
import QuizModal from '../components/common/QuizModal';
import WallVisualizer from '../components/common/WallVisualizer';
import { useArtist } from '../hooks/useArtist';
import { useArtistQuiz } from '../hooks/useArtistQuiz';
import { ROUTES } from '../lib/constants';
import type { Artwork } from '../lib/types';

export default function ArtistPage() {
  const { artistSlug } = useParams<{ artistSlug: string }>();
  const navigate = useNavigate();
  const { artist, artworks, loading } = useArtist(artistSlug || '');
  const { quizData } = useArtistQuiz(artistSlug || '');
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [currentArtworkId, setCurrentArtworkId] = useState<string | null>(null);

  // Build slides from the artist's artworks
  const slides = artworks.map((artwork: Artwork) => ({
    id: artwork.id,
    title: artwork.title,
    subtitle: artwork.medium,
    image_url: artwork.image_url,
  }));

  // Find the current artwork object from the id
  const currentArtwork = artworks.find(a => a.id === currentArtworkId);

  const handleCurrentSlideChange = (slideId: string) => {
    setCurrentArtworkId(slideId);
  };

  const handleOpenWallVisualizer = () => {
    if (currentArtwork) {
      setSelectedArtwork(currentArtwork);
    }
  };

  // If there are no artworks, show fallback
  if (!loading && (!artist || artworks.length === 0)) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <p className="text-white/30 tracking-widest">
          {!artist ? 'Artista não encontrado' : 'Nenhuma obra disponível'}
        </p>
      </div>
    );
  }

  // Custom bottom content: artist's hero information
  const heroContent = artist && (
    <div className="px-8 md:px-16 pb-12 flex flex-col md:flex-row md:items-end gap-8">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
        <img
          src={artist.profile_image}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-white text-4xl md:text-6xl font-light tracking-wider">
            {artist.name}
          </h1>
          {(artist.rating || 0) > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < Math.floor(artist.rating || 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-white/30'
                    }
                  />
                ))}
              </div>
              <span className="text-white/50 text-xs ml-1">{artist.rating}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-white/50 text-xs tracking-widest uppercase mb-4">
          <span className="flex items-center gap-1.5">
            <Palette size={12} />
            {artist.medium}
          </span>
          <button
            onClick={() =>
              navigate(ROUTES.CITY.replace(':citySlug', artist.city?.slug || ''))
            }
            className="text-amber-400/70 hover:text-amber-400 transition-colors"
          >
            Ver todos os artistas de {artist.city?.name}
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {quizData && (
            <button
              onClick={() => setShowQuiz(true)}
              className="px-6 py-2 bg-amber-500 text-black font-medium text-xs tracking-[0.2em] uppercase hover:bg-amber-600 rounded transition-colors"
            >
              Fazer Quiz
            </button>
          )}
          <button
            onClick={handleOpenWallVisualizer}
            className="pointer-events-auto px-10 py-2 border border-white/40 text-white/80 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 rounded"
          >
            Parede Virtual
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <FullscreenSlider
        slides={slides}
        loading={loading}
        onSelect={(artworkId) => {
          // Optional: navigate to artwork detail or open modal
          console.log('Selected artwork:', artworkId);
        }}
        onCurrentSlideChange={handleCurrentSlideChange}
        customBottomContent={heroContent}
      />
      {showQuiz && artistSlug && (
        <QuizModal
          artistSlug={artistSlug}
          onClose={() => setShowQuiz(false)}
        />
      )}
      {selectedArtwork && (
        <WallVisualizer
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </>
  );
}