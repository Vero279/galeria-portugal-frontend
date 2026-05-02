import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Palette, Star } from 'lucide-react';
import { useAllArtists } from '../hooks/useAllArtists';
import { useCities } from '../hooks/useCities';
import { ROUTES } from '../lib/constants';

export default function ArtistsPage() {
  const { artists, loading } = useAllArtists();
  const { cities } = useCities();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const filteredArtists = selectedCity === 'all'
    ? artists
    : artists.filter(artist => artist.city_id === selectedCity);

  const cityOptions = [
    { id: 'all', name: 'Todas as Cidades' },
    ...cities
  ];

  if (loading && artists.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center pt-40">
        <div className="w-px h-16 bg-white/10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-40 pb-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-16">
          <h1 className="text-white text-5xl md:text-6xl font-light tracking-wider mb-4">
            Artistas
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
            Conheça os talentosos artistas portugueses que fazem parte da nossa galeria. Explore suas obras e histórias únicas.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex flex-wrap gap-2">
            {cityOptions.map(city => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-4 py-2 text-xs tracking-wider uppercase transition-all ${
                  selectedCity === city.id
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white text-2xl font-light tracking-wider">
              {selectedCity === 'all' ? 'Todos os Artistas' : `Artistas de ${cities.find(c => c.id === selectedCity)?.name}`}
            </h2>
            <div className="text-white/40 text-xs tracking-widest uppercase">
              {filteredArtists.length} artista{filteredArtists.length !== 1 ? 's' : ''}
            </div>
          </div>

          {filteredArtists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtists.map(artist => (
                <div
                  key={artist.id}
                  onClick={() => navigate(ROUTES.ARTIST.replace(':artistSlug', artist.slug))}
                  className="group cursor-pointer"
                >
                  <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-colors">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={artist.cover_image}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-light text-lg tracking-wide mb-1">
                            {artist.name}
                          </h3>
                          <div className="flex items-center gap-2 text-white/50 text-xs">
                            <MapPin size={12} />
                            {artist.city?.name}
                          </div>
                        </div>
                        {artist.rating && artist.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={i < Math.floor(artist.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-white/30'}
                                />
                              ))}
                            </div>
                            <span className="text-white/50 text-xs ml-1">{artist.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-xs mb-4">
                        <Palette size={12} />
                        {artist.medium}
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                        {artist.bio}
                      </p>
                      <button className="mt-4 w-full px-4 py-2 bg-amber-500 text-black text-xs tracking-[0.2em] uppercase hover:bg-amber-600 rounded transition-colors font-medium">
                        Explorar Obras
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette size={24} className="text-white/20" />
              </div>
              <p className="text-white/40 text-sm mb-2">Nenhum artista encontrado</p>
              <p className="text-white/20 text-xs">Tente selecionar outra cidade</p>
            </div>
          )}
        </div>

        {filteredArtists.length > 0 && (
          <div className="border-t border-white/10 pt-8 mt-16">
            <div className="text-center">
              <p className="text-white/30 text-xs tracking-widest uppercase mb-2">
                Descubra Mais
              </p>
              <p className="text-white/40 text-sm max-w-md mx-auto">
                Cada artista tem uma história única. Clique em qualquer artista para conhecer suas obras e trajetória.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}