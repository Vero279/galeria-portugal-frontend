import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Quiz, QuizQuestion } from '../lib/types';
import { logger } from '../utils/logger';

export function useArtistQuiz(artistSlug: string) {
  const [quizData, setQuizData] = useState<(Quiz & { quiz_questions?: QuizQuestion[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artistSlug) return;
    supabase
      .from('artists')
      .select('id')
      .eq('slug', artistSlug)
      .maybeSingle()
      .then(({ data: artist, error: artistError }) => {
        if (artistError) {
          logger.error('useArtistQuiz artist error', artistError);
          setLoading(false);
          return;
        }
        if (!artist) {
          setLoading(false);
          return;
        }
        supabase
          .from('artist_quizzes')
          .select('*')
          .eq('artist_id', artist.id)
          .maybeSingle()
          .then(({ data: quiz, error: quizError }) => {
            if (quizError) {
              logger.error('useArtistQuiz quiz fetch error', quizError);
              setLoading(false);
              return;
            }
            if (!quiz) {
              setLoading(false);
              return;
            }
            supabase
              .from('quiz_questions')
              .select('*')
              .eq('quiz_id', quiz.id)
              .then(({ data: questions, error: qError }) => {
                if (qError) {
                  logger.error('useArtistQuiz questions error', qError);
                }
                setQuizData({ ...quiz, quiz_questions: questions || [] });
                setLoading(false);
              });
          });
      });
  }, [artistSlug]);

  async function submitQuizAnswers(quizId: string, answers: Record<string, string>) {
    const sessionId = localStorage.getItem('session_id') || Math.random().toString(36).slice(2);
    localStorage.setItem('session_id', sessionId);

    const { data: questions, error: qError } = await supabase
      .from('quiz_questions')
      .select('id, correct_answer')
      .eq('quiz_id', quizId);

    if (qError) {
      logger.error('submitQuizAnswers fetch questions error', qError);
      return null;
    }
    if (!questions) return null;

    const score = Object.entries(answers).filter(([qId, answer]) => {
      const q = questions.find((q: any) => q.id === qId);
      return q && q.correct_answer === answer;
    }).length;

    const { data: insertData, error: insertError } = await supabase
      .from('quiz_answers')
      .insert({
        quiz_id: quizId,
        session_id: sessionId,
        score,
        total_questions: questions.length,
      })
      .select()
      .maybeSingle();

    if (insertError) {
      logger.error('submitQuizAnswers insert error', insertError);
    }

    if (score === questions.length && insertData) {
      const artistId = quizData?.artist_id;
      if (artistId) {
        const discountCode = `ARTIST${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        await supabase.from('user_discounts').insert({
          session_id: sessionId,
          artist_id: artistId,
          discount_code: discountCode,
          discount_percentage: 15,
        });
      }
    }

    return { score, total: questions.length };
  }

  return { quizData, loading, submitQuizAnswers };
}