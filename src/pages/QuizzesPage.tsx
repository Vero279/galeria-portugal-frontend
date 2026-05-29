import { useState } from 'react';
import { Brain, Trophy } from 'lucide-react';
import QuizModal from '../components/common/QuizModal';
import { useAllArtists } from '../hooks/useAllArtists';
import type { Artist } from '../lib/types';

export default function QuizzesPage() {
  const { artists, loading } = useAllArtists();
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  if (loading && artists.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center pt-32">
        <div className="w-px h-16 bg-white/10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="text-white text-5xl md:text-6xl font-light tracking-wider mb-4">
            Testes de Conhecimento
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
            Testa o teu conhecimento sobre os artistas portugueses. Responde a perguntas, ganha pontos e desbloqueia descontos exclusivos nas obras de arte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map(artist => (
            <div
              key={artist.id}
              className="group bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer h-full flex flex-col"
              onClick={() => {
                setSelectedArtist(artist);
                setShowQuiz(true);
              }}
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
                <img
                  src={artist.cover_image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
              </div>

              <div className="flex-1 p-6 flex flex-col">
                <h3 className="text-white text-lg font-light tracking-wider mb-2">
                  {artist.name}
                </h3>

                <p className="text-white/50 text-xs mb-4 flex-1">
                  {artist.medium || 'Artista'}
                </p>

                <div className="space-y-2 mb-4 border-t border-white/10 pt-4">
                  {artist.rating && artist.rating > 0 && (
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                      <Trophy size={12} />
                      <span>Avaliação: {artist.rating} ★</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-white/60 text-xs">
                    <Brain size={12} />
                    <span>5 perguntas</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArtist(artist);
                    setShowQuiz(true);
                  }}
                  className="w-full px-4 py-3 bg-white text-black text-xs tracking-widest uppercase font-light hover:bg-white/90 transition-colors"
                >
                  Começar Teste
                </button>
              </div>
            </div>
          ))}
        </div>

        {artists.length === 0 && (
          <div className="text-center py-16">
            <Brain size={32} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-sm">Nenhum teste disponível</p>
          </div>
        )}

        {selectedArtist && showQuiz && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuiz(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <QuizModal
                artistSlug={selectedArtist.slug}
                onClose={() => {
                  setShowQuiz(false);
                  setSelectedArtist(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}