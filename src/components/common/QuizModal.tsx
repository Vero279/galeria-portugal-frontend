import { useState, useMemo } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { useArtistQuiz } from '../../hooks/useArtistQuiz';

interface QuizModalProps {
  artistSlug: string;
  onClose: () => void;
}

export default function QuizModal({ artistSlug, onClose }: QuizModalProps) {
  const { quizData, loading, submitQuizAnswers } = useArtistQuiz(artistSlug);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = useMemo(() => quizData?.quiz_questions || [], [quizData]);
  const currentQ = questions[currentQuestion];
  const options = currentQ ? [
    { text: currentQ.option_a, key: 'a' },
    { text: currentQ.option_b, key: 'b' },
    { text: currentQ.option_c, key: 'c' },
    { text: currentQ.option_d, key: 'd' },
  ] : [];

  async function handleFinish() {
    if (!quizData?.id) return;
    setIsSubmitting(true);
    const res = await submitQuizAnswers(quizData.id, answers);
    if (res) setResult(res);
    setIsSubmitting(false);
  }

  if (loading) {
    return (
      <div className="bg-black border border-white/10 rounded-lg p-8 max-w-xl w-full flex items-center justify-center py-12">
        <div className="w-px h-16 bg-white/20 animate-pulse" />
      </div>
    );
  }

  if (!quizData || questions.length === 0) {
    return (
      <div className="bg-black border border-white/10 rounded-lg p-8 max-w-xl w-full text-center">
        <p className="text-white/30 mb-6">Quiz não disponível para este artista</p>
        <button
          onClick={onClose}
          className="px-6 py-2 border border-white/20 text-white/60 text-xs tracking-widest uppercase hover:border-white/50 transition-colors"
        >
          Fechar
        </button>
      </div>
    );
  }

  if (result) {
    const isPerfect = result.score === result.total;
    return (
      <div className="bg-black border border-white/10 rounded-lg p-8 max-w-xl w-full text-center">
        <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${isPerfect ? 'bg-green-500/20 border-2 border-green-500' : 'bg-blue-500/20 border-2 border-blue-500'}`}>
          {isPerfect ? (
            <Check size={32} className="text-green-400" />
          ) : (
            <AlertCircle size={32} className="text-blue-400" />
          )}
        </div>

        <h3 className="text-white text-xl font-light tracking-widest mb-2">
          {isPerfect ? 'Parabéns!' : 'Resultado'}
        </h3>

        <p className="text-white/60 mb-6">
          Obtiveste <span className="text-amber-400 font-medium">{result.score}/{result.total}</span> respostas corretas
        </p>

        {isPerfect && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded">
            <p className="text-green-400 text-sm tracking-wider font-light">
              🎉 Ganhaste 15% de desconto! Usa o código que recebeste na próxima compra.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-white/10 text-white/70 text-xs tracking-widest uppercase hover:bg-white/20 hover:text-white rounded transition-colors font-medium"
        >
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black border border-white/10 rounded-lg p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-white font-light tracking-[0.15em] uppercase">
          {quizData.title}
        </h2>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/60 text-sm">
            Pergunta {currentQuestion + 1} de {questions.length}
          </p>
          <div className="h-px flex-1 mx-4 bg-white/10" />
          <div className="flex gap-1">
            {[...Array(questions.length)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === currentQuestion ? 'bg-amber-500' : i < currentQuestion ? 'bg-green-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {currentQ && (
        <div>
          <h3 className="text-white text-lg font-light mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-3 mb-8">
            {options.map(({ text, key }) => (
              <button
                key={key}
                onClick={() => {
                  setAnswers(prev => ({ ...prev, [currentQ.id]: key }));
                  if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(prev => prev + 1);
                  }
                }}
                className={`w-full p-4 text-left border rounded transition-all ${
                  answers[currentQ.id] === key
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                }`}
              >
                <p className="text-white font-light">{text}</p>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="flex-1 px-6 py-3 border border-white/20 text-white/60 text-xs tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/50 transition-colors"
            >
              ← Anterior
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleFinish}
                disabled={isSubmitting || Object.keys(answers).length !== questions.length}
                className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black text-xs tracking-widest uppercase font-medium rounded transition-colors disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'A processar...' : 'Terminar'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                className="flex-1 px-6 py-3 bg-white/10 text-white/70 text-xs tracking-widest uppercase hover:bg-white/20 hover:text-white rounded transition-colors"
              >
                Próximo →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}