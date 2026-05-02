import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

export function useArtworkReviews(artworkId: string) {
  const [rating, setRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  useEffect(() => {
    if (!artworkId) return;
    supabase
      .from('artwork_reviews')
      .select('rating')
      .eq('artwork_id', artworkId)
      .then(({ data, error }) => {
        if (error) {
          logger.error('useArtworkReviews fetch error', error);
          return;
        }
        if (data && data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setRating(Math.round(avg * 10) / 10);
          setReviewCount(data.length);
        }
      });
  }, [artworkId]);

  async function submitReview(ratingValue: number, comment?: string) {
    const sessionId = localStorage.getItem('session_id') || Math.random().toString(36).slice(2);
    localStorage.setItem('session_id', sessionId);

    const { error } = await supabase.from('artwork_reviews').insert({
      artwork_id: artworkId,
      session_id: sessionId,
      rating: ratingValue,
      comment,
    });

    if (error) {
      logger.error('submitReview error', error);
      return false;
    }

    // Update local state optimistically
    setRating(prev => (prev * reviewCount + ratingValue) / (reviewCount + 1));
    setReviewCount(prev => prev + 1);
    return true;
  }

  return { rating, reviewCount, submitReview };
}