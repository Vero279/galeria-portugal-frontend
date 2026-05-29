// src/hooks/useArtworkReviews.ts
import { useState, useEffect } from 'react';
import { strapiAPI } from '../services/strapi';
import { logger } from '../utils/logger';

export function useArtworkReviews(artworkId: string) {
  const [rating, setRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  useEffect(() => {
    if (!artworkId) return;

    const fetchReviews = async () => {
      try {
        const reviews = await strapiAPI.getCollection<any>(
          'artwork-reviews',
          { 'filters[artwork][id][$eq]': artworkId },
          '',
          true
        );
        if (reviews.length > 0) {
          const total = reviews.reduce((sum, r) => sum + r.rating, 0);
          const avg = total / reviews.length;
          setRating(Math.round(avg * 10) / 10);
          setReviewCount(reviews.length);
        } else {
          setRating(0);
          setReviewCount(0);
        }
      } catch (err) {
        logger.error('useArtworkReviews fetch error', err);
      }
    };
    fetchReviews();
  }, [artworkId]);

  async function submitReview(ratingValue: number, comment?: string) {
    const sessionId = localStorage.getItem('session_id') || Math.random().toString(36).slice(2);
    localStorage.setItem('session_id', sessionId);

    try {
      await strapiAPI.create('artwork-reviews', {
        artwork: artworkId,
        session_id: sessionId,
        rating: ratingValue,
        comment: comment || null,
      });

      // Actualizar localmente a média (optimista)
      const newTotalRating = rating * reviewCount + ratingValue;
      const newCount = reviewCount + 1;
      setRating(Math.round((newTotalRating / newCount) * 10) / 10);
      setReviewCount(newCount);
      return true;
    } catch (err) {
      logger.error('submitReview error', err);
      return false;
    }
  }

  return { rating, reviewCount, submitReview };
}