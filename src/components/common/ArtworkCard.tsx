import { useState } from 'react';
import { Star } from 'lucide-react';
import { useArtworkReviews } from '../../hooks/useArtworkReviews';
import type { Artwork } from '../../lib/types';
import { renderBlocks, renderRichText } from '../../utils/richTextRenderer';

interface ArtworkCardProps {
  artwork: Artwork & { description?: string };
  onExperiment?: () => void;
}

export default function ArtworkCard({ artwork, onExperiment }: ArtworkCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const { rating, reviewCount, submitReview } = useArtworkReviews(artwork.id);

  async function handleSubmitReview() {
    const success = await submitReview(reviewRating, reviewComment);
    if (success) {
      setShowReview(false);
      setReviewRating(5);
      setReviewComment('');
    }
  }

  return (
    <div className="group relative overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-0 bg-black/70 flex flex-col justify-between p-6 transition-opacity duration-300 z-10"
        style={{ opacity: showDetails ? 1 : 0, pointerEvents: showDetails ? 'auto' : 'none' }}
      >
        <div>
          <p className="text-white font-light text-lg tracking-wide">{artwork.title}</p>
          <p className="text-white/50 text-xs tracking-widest mt-1">{artwork.year} · {artwork.medium}</p>
          <p className="text-white/40 text-xs mt-0.5">{artwork.dimensions}</p>

          {artwork.description && (
            <div className="text-white/60 text-xs mt-4 leading-relaxed">
              {typeof artwork.description === 'string' 
                ? renderRichText(artwork.description)
                : renderBlocks(artwork.description)}
            </div>
          )}

          <div className="flex items-center gap-2 mt-4">
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-white/30'}
                    />
                  ))}
                </div>
                <span className="text-white/50 text-xs">{rating} ({reviewCount})</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          {artwork.price && (
            <p className="text-amber-400/90 text-sm font-light">
              €{artwork.price.toFixed(2)}
            </p>
          )}
          <div className="flex gap-2 flex-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReview(!showReview);
              }}
              className="flex-1 px-3 py-2 bg-white/10 text-white/70 text-xs tracking-widest uppercase hover:bg-white/20 hover:text-white rounded transition-colors font-medium"
            >
              Avaliar
            </button>
            {onExperiment && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExperiment();
                }}
                className="flex-1 px-3 py-2 bg-amber-500 text-black text-xs tracking-[0.2em] uppercase hover:bg-amber-600 rounded transition-colors font-medium"
              >
                Testar
              </button>
            )}
          </div>
        </div>

        {showReview && (
          <div className="mt-4 p-3 bg-black/60 rounded border border-white/10 space-y-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="transition-colors"
                >
                  <Star
                    size={14}
                    className={star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-white/30'}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Deixa um comentário..."
              className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs placeholder-white/40 focus:outline-none focus:border-white/30 resize-none"
              rows={2}
            />
            <button
              onClick={handleSubmitReview}
              className="w-full px-2 py-1 bg-amber-500 text-black text-xs tracking-widest uppercase hover:bg-amber-600 transition-colors font-medium rounded"
            >
              Enviar
            </button>
          </div>
        )}
      </div>

      <div
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => { setShowDetails(false); setShowReview(false); }}
        className="absolute inset-0 cursor-pointer z-0"
      />
    </div>
  );
}