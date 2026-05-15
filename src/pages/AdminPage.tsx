import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Image, Users, Brain, Ticket } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { strapiAPI } from '../services/strapi';
import { ROUTES } from '../lib/constants';
import type { Artist } from '../lib/types';
import ArtworksManager from '../components/admin/ArtworksManager';
import UsersManager from '../components/admin/UsersManager';
import QuizzesManager from '../components/admin/QuizzesManager';

export default function AdminPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'artworks' | 'users' | 'quizzes' | 'discounts'>('artworks');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) navigate(ROUTES.ENTRAR);
    else if (user?.role !== 'admin') navigate(ROUTES.HOME);
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [artistsData, discountsData] = await Promise.all([
          strapiAPI.getCollection<Artist>('artists', { 'filters[isPublished][$eq]': 'true' }, '', false),
          strapiAPI.getCollection<any>('user-discounts', {}, 'artist', false),
        ]);
        setArtists(artistsData);
        setDiscounts(discountsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center"><div className="w-px h-16 bg-white/10 animate-pulse" /></div>;

  return (
    <main className="pt-32 pb-12 bg-[#0d0d0d] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header com logout visível (pt-32 já afastou da navbar) */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-light mb-2">Painel Administrativo</h1>
            <p className="text-gray-400">Gestão completa da plataforma</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium text-sm tracking-widest uppercase rounded">
            <LogOut size={18} /> Sair
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto">
          {[
            { id: 'artworks', label: 'Obras', icon: Image },
            { id: 'users', label: 'Utilizadores', icon: Users },
            { id: 'quizzes', label: 'Quizzes', icon: Brain },
            { id: 'discounts', label: 'Descontos', icon: Ticket },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-light text-sm uppercase tracking-widest transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id ? 'border-b-2 border-amber-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo das tabs */}
        {activeTab === 'artworks' && <ArtworksManager artists={artists} />}
        {activeTab === 'users' && <UsersManager />}
        {activeTab === 'quizzes' && <QuizzesManager artists={artists} />}
        {activeTab === 'discounts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10"><tr><th>Código</th><th>Artista</th><th>Percentagem</th><th>Sessão</th><th>Usado</th></tr></thead>
              <tbody>
                {discounts.map(d => (
                  <tr key={d.id} className="border-b border-white/5">
                    <td className="px-4 py-3 font-mono">{d.discount_code}</td>
                    <td className="px-4 py-3">{d.artist?.name || '-'}</td>
                    <td className="px-4 py-3">{d.discount_percentage}%</td>
                    <td className="px-4 py-3 text-xs">{d.session_id?.slice(0, 8)}</td>
                    <td className="px-4 py-3">{d.used ? 'Sim' : 'Não'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}