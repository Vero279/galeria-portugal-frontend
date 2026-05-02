import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FullscreenSlider from '../components/common/FullscreenSlider';
import EventsList from '../components/common/EventsList';
import { useArtistsByCity } from '../hooks/useArtistsByCity';
import { useArtistEvents } from '../hooks/useArtistEvents';
import { ROUTES } from '../lib/constants';

export default function CityPage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const navigate = useNavigate();
  const { artists, city, loading } = useArtistsByCity(citySlug || '');
  const { events, loading: eventsLoading } = useArtistEvents(citySlug || '');
  const [showEvents, setShowEvents] = useState(false);

  const slides = artists.map(artist => ({
    id: artist.slug,
    title: artist.name,
    subtitle: artist.medium,
    image_url: artist.cover_image,
  }));

  if (showEvents) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] pt-40 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="mb-8">
            <button
              onClick={() => setShowEvents(false)}
              className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors text-xs tracking-widest uppercase font-medium mb-6"
            >
              ← Voltar aos Artistas
            </button>
            <div>
              <h1 className="text-white text-3xl sm:text-4xl font-light tracking-wider mb-2">
                Eventos em {city?.name}
              </h1>
              <p className="text-white/40 text-sm">{events.length} evento{events.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div>
            {eventsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-px h-16 bg-white/10 animate-pulse" />
              </div>
            ) : events.length > 0 ? (
              <EventsList events={events} />
            ) : (
              <div className="text-center py-12">
                <p className="text-white/40">Nenhum evento agendado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {city && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
          <p className="text-white/30 text-xs tracking-[0.5em] uppercase">Artistas de</p>
        </div>
      )}
      <FullscreenSlider
        slides={slides}
        loading={loading}
        onSelect={(slug) => navigate(ROUTES.ARTIST.replace(':artistSlug', slug))}
      />
      {events.length > 0 && (
        <button
          onClick={() => setShowEvents(true)}
          className="fixed bottom-8 right-8 px-6 py-3 bg-amber-500 text-black font-medium text-xs tracking-[0.2em] uppercase hover:bg-amber-600 rounded transition-all duration-300 z-40 shadow-lg"
        >
          Ver Eventos ({events.length})
        </button>
      )}
    </div>
  );
}