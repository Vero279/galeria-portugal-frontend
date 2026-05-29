// src/hooks/useArtistQuiz.ts
import { useState, useEffect } from 'react';
import { strapiAPI } from '../services/strapi';
import type { Quiz, QuizQuestion } from '../lib/types';
import { logger } from '../utils/logger';

export function useArtistQuiz(artistSlug: string) {
  const [quizData, setQuizData] = useState<(Quiz & { quiz_questions?: QuizQuestion[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artistSlug) return;

    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const artistData = await strapiAPI.getBySlug<any>('artists', artistSlug, 'slug', '');
        if (!artistData) {
          setLoading(false);
          return;
        }
        const quizzes = await strapiAPI.getCollection<Quiz & { quiz_questions?: QuizQuestion[] }>(
          'artist-quizzes',
          { 'filters[artist][id][$eq]': artistData.id, 'filters[isPublished][$eq]': 'true' },
          ['quiz_questions'],
          true
        );
        if (quizzes.length === 0) {
          setQuizData(null);
          setLoading(false);
          return;
        }
        setQuizData(quizzes[0]);
      } catch (err) {
        logger.error('useArtistQuiz error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [artistSlug]);

  async function submitQuizAnswers(quizId: string, answers: Record<string, string>) {
    const sessionId = localStorage.getItem('session_id') || Math.random().toString(36).slice(2);
    localStorage.setItem('session_id', sessionId);

    try {
      const questions = await strapiAPI.getCollection<QuizQuestion>(
        'quiz-questions',
        { 'filters[artist_quiz][id][$eq]': quizId },
        '',
        true
      );
      if (!questions.length) return null;

      let score = 0;
      for (const q of questions) {
        if (answers[q.id] === q.correct_answer) score++;
      }

      const result = await strapiAPI.create('quiz-answers', {
        artist_quiz: quizId,
        session_id: sessionId,
        score,
        total_questions: questions.length,
      });

      if (score === questions.length && result) {
        const discountCode = `ARTIST${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        const quizData = await strapiAPI.getById<any>('artist-quizzes', quizId, 'artist');
        const artistId = quizData?.artist?.id;
        if (artistId) {
          await strapiAPI.create('user-discounts', {
            session_id: sessionId,
            artist: artistId,
            discount_code: discountCode,
            discount_percentage: 15,
          });
        }
      }

      return { score, total: questions.length };
    } catch (err) {
      logger.error('submitQuizAnswers error', err);
      return null;
    }
  }

  return { quizData, loading, submitQuizAnswers };
}