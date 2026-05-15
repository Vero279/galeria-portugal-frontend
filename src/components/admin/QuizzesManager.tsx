import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { strapiAPI } from '../../services/strapi';
import type { Artist } from '../../lib/types';

interface Quiz {
  id: string;
  title: string;
  description?: string;
  isPublished: boolean;
  artist?: { id: string; name: string };
  quiz_questions?: any[];
}

export default function QuizzesManager({ artists }: { artists: Artist[] }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', artist_id: '', isPublished: true });
  const [questions, setQuestions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await strapiAPI.getCollection<Quiz>('artist-quizzes', {}, ['artist', 'quiz_questions'], false);
      setQuizzes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const resetForm = () => {
    setFormData({ title: '', description: '', artist_id: '', isPublished: true });
    setQuestions([]);
    setEditingQuiz(null);
    setShowForm(false);
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description || '',
      artist_id: quiz.artist?.id || '',
      isPublished: quiz.isPublished,
    });
    setQuestions(quiz.quiz_questions || []);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar quiz permanentemente?')) return;
    try {
      await strapiAPI.delete('artist-quizzes', id);
      setQuizzes(prev => prev.filter(q => q.id !== id));
    } catch (err) { alert('Erro ao eliminar'); }
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', correct_answer: 'a', option_a: '', option_b: '', option_c: '', option_d: '' }]);
  };

  const updateQuestion = (idx: number, field: string, value: string) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestions(updated);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.artist_id) return alert('Título e Artista obrigatórios');
    setIsSubmitting(true);
    try {
      const payload = { title: formData.title, description: formData.description || null, artist: formData.artist_id, isPublished: formData.isPublished };
      let savedQuiz;
      if (editingQuiz) {
        savedQuiz = await strapiAPI.update('artist-quizzes', editingQuiz.id, payload);
        // remove existing questions
        for (const q of questions) {
          if (q.id) await strapiAPI.delete('quiz-questions', q.id);
        }
        for (const q of questions) {
          if (q.question && q.correct_answer) {
            await strapiAPI.create('quiz-questions', {
              artist_quiz: savedQuiz.id,
              question: q.question,
              correct_answer: q.correct_answer,
              option_a: q.option_a,
              option_b: q.option_b,
              option_c: q.option_c,
              option_d: q.option_d,
            });
          }
        }
        setQuizzes(prev => prev.map(q => q.id === editingQuiz.id ? { ...savedQuiz, quiz_questions: questions } : q));
      } else {
        savedQuiz = await strapiAPI.create('artist-quizzes', payload);
        for (const q of questions) {
          await strapiAPI.create('quiz-questions', {
            artist_quiz: savedQuiz.id,
            question: q.question,
            correct_answer: q.correct_answer,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
          });
        }
        setQuizzes(prev => [{ ...savedQuiz, quiz_questions: questions }, ...prev]);
      }
      resetForm();
    } catch (err) { alert('Erro ao guardar quiz'); }
    finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="text-center py-8">A carregar quizzes...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light">Quizzes ({quizzes.length})</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded">
          <Plus size={20} /> Novo Quiz
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-lg">
          <h3 className="text-xl font-light mb-4">{editingQuiz ? 'Editar Quiz' : 'Novo Quiz'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label>Título *</label><input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2" /></div>
            <div><label>Descrição</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2" /></div>
            <div><label>Artista *</label><select value={formData.artist_id} onChange={e => setFormData({ ...formData, artist_id: e.target.value })} required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2"><option value="">Selecione</option>{artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({ ...formData, isPublished: e.target.checked })} /> Publicado</div>

            <div><label>Perguntas</label><button type="button" onClick={addQuestion} className="mb-2 text-sm text-amber-400">+ Adicionar pergunta</button>
              {questions.map((q, idx) => (
                <div key={idx} className="p-3 border border-white/10 rounded mb-2">
                  <input placeholder="Pergunta" value={q.question} onChange={e => updateQuestion(idx, 'question', e.target.value)} className="w-full mb-2 bg-black/50 border border-white/10 rounded px-3 py-1" />
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Opção A" value={q.option_a} onChange={e => updateQuestion(idx, 'option_a', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-1" />
                    <input placeholder="Opção B" value={q.option_b} onChange={e => updateQuestion(idx, 'option_b', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-1" />
                    <input placeholder="Opção C" value={q.option_c} onChange={e => updateQuestion(idx, 'option_c', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-1" />
                    <input placeholder="Opção D" value={q.option_d} onChange={e => updateQuestion(idx, 'option_d', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-1" />
                    <select value={q.correct_answer} onChange={e => updateQuestion(idx, 'correct_answer', e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-1"><option value="a">A</option><option value="b">B</option><option value="c">C</option><option value="d">D</option></select>
                    <button type="button" onClick={() => removeQuestion(idx)} className="text-red-400 text-sm">Remover</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3"><button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-amber-500 text-black rounded">{isSubmitting ? 'A guardar...' : (editingQuiz ? 'Atualizar' : 'Criar')}</button><button type="button" onClick={resetForm} className="px-6 py-2 bg-white/10 rounded">Cancelar</button></div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10"><tr><th>Título</th><th>Artista</th><th>Perguntas</th><th>Publicado</th><th>Ações</th></tr></thead>
          <tbody>
            {quizzes.map(q => (
              <tr key={q.id} className="border-b border-white/5">
                <td className="px-4 py-3">{q.title}</td>
                <td className="px-4 py-3">{q.artist?.name || '-'}</td>
                <td className="px-4 py-3">{q.quiz_questions?.length || 0}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${q.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{q.isPublished ? 'Sim' : 'Não'}</span></td>
                <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleEdit(q)}><Edit2 size={16} className="text-amber-400" /></button><button onClick={() => handleDelete(q.id)}><Trash2 size={16} className="text-red-400" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}