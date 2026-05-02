import { useState } from 'react';
import { LogOut, Upload, Image, MessageSquare, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useArtistContent } from '../hooks/useArtistContent';
import type { View } from '../lib/types';

interface ArtistDashboardPageProps {
  onNavigate: (view: View) => void;
}

export default function ArtistDashboardPage({ onNavigate }: ArtistDashboardPageProps) {
  const { user, logout } = useAuth();
  const { contents, addContent, deleteContent } = useArtistContent();
  const [activeTab, setActiveTab] = useState<'gallery' | 'content' | 'profile' | 'settings'>('gallery');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    type: 'artwork' as 'artwork' | 'text',
    imageFile: null as File | null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData(prev => ({ ...prev, imageFile: file }));
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadData.title || !uploadData.imageFile) {
      alert('Por favor, preencha o título e selecione uma imagem');
      return;
    }

    addContent({
      type: uploadData.type,
      title: uploadData.title,
      description: uploadData.description,
      imageUrl: previewImage || undefined,
    });

    setShowUploadModal(false);
    setUploadData({
      title: '',
      description: '',
      type: 'artwork',
      imageFile: null,
    });
    setPreviewImage(null);
    alert('Conteúdo enviado com sucesso!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem a certeza que deseja deletar este conteúdo?')) {
      deleteContent(id);
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate({ name: 'home' });
  };

  return (
    <main className="pt-20 pb-12 bg-[#0d0d0d] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light mb-2">Bem-vindo, {user?.name}</h1>
            <p className="text-gray-400">Gerencie seu perfil, obras e conteúdos</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium text-sm tracking-widest uppercase rounded transition-colors"
          >
            <LogOut size={18} />
            Terminar Sessão
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 overflow-x-auto">
          {(['gallery', 'content', 'profile', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-light text-sm uppercase tracking-widest transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-amber-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'gallery' && (
                <>
                  <Image size={18} />
                  Galeria ({contents.length})
                </>
              )}
              {tab === 'content' && (
                <>
                  <MessageSquare size={18} />
                  Gestor de Conteúdos
                </>
              )}
              {tab === 'profile' && 'Perfil'}
              {tab === 'settings' && 'Configurações'}
            </button>
          ))}
        </div>

        {/* Gallery Tab - Ver Obras */}
        {activeTab === 'gallery' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-light">Minhas Obras</h2>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium text-sm rounded transition"
              >
                <Upload size={18} />
                Enviar Obra
              </button>
            </div>

            {contents.length === 0 ? (
              <div className="p-12 text-center bg-white/5 border border-white/10 rounded-lg">
                <Image size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400 text-lg">Nenhuma obra adicionada ainda</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium text-sm rounded transition"
                >
                  + Adicionar Primeira Obra
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contents.map(content => (
                  <div
                    key={content.id}
                    className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition"
                  >
                    {content.imageUrl && (
                      <div className="relative h-48 overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
                        <img
                          src={content.imageUrl}
                          alt={content.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="text-white font-light text-lg mb-1">{content.title}</h3>
                      <p className="text-white/50 text-xs mb-3">{content.type === 'artwork' ? 'Obra de Arte' : 'Texto'}</p>
                      {content.description && (
                        <p className="text-white/60 text-sm mb-3 line-clamp-2">{content.description}</p>
                      )}
                      <p className="text-white/40 text-xs mb-4">
                        {new Date(content.createdAt).toLocaleDateString('pt-PT')}
                      </p>

                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs transition">
                          <Eye size={14} />
                          Ver
                        </button>
                        <button
                          onClick={() => handleDelete(content.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs transition"
                        >
                          <Trash2 size={14} />
                          Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Manager Tab - Gestor de Conteúdos */}
        {activeTab === 'content' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-light">Gestor de Conteúdos</h2>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium text-sm rounded transition"
              >
                <Upload size={18} />
                Novo Conteúdo
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upload Card */}
              <div
                onClick={() => setShowUploadModal(true)}
                className="lg:col-span-1 p-8 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-500/5 transition flex flex-col items-center justify-center text-center"
              >
                <Upload size={48} className="mb-4 text-gray-400" />
                <h3 className="text-white font-light text-lg mb-1">Enviar Conteúdo</h3>
                <p className="text-gray-400 text-sm">Clique para fazer upload de imagens ou textos</p>
              </div>

              {/* Conteúdos */}
              {contents.map(content => (
                <div key={content.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  {content.imageUrl && (
                    <img
                      src={content.imageUrl}
                      alt={content.title}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  <h4 className="text-white font-light mb-1">{content.title}</h4>
                  <p className="text-white/50 text-xs mb-2">{content.type === 'artwork' ? 'Obra de Arte' : 'Texto'}</p>
                  {content.description && (
                    <p className="text-white/60 text-sm mb-3 line-clamp-2">{content.description}</p>
                  )}
                  <button
                    onClick={() => handleDelete(content.id)}
                    className="w-full px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs transition"
                  >
                    Deletar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-xl font-light mb-4">Informações do Artista</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">NOME</p>
                  <p className="text-white text-lg">{user?.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">EMAIL</p>
                  <p className="text-white text-lg">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">TOTAL DE OBRAS</p>
                <p className="text-4xl font-light text-white">{contents.length}</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">AVALIAÇÃO MÉDIA</p>
                <p className="text-4xl font-light text-amber-400">—</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-xl font-light mb-4">Notificações por Email</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-white/80">Notificações de vendas</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-white/80">Novos comentários nas obras</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-white/80">Mensagens de contacto</span>
                </label>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-xl font-light mb-4">Segurança</h3>
              <button className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium text-sm rounded transition">
                Alterar Palavra-passe
              </button>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-black border border-white/10 rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-light mb-6">Novo Conteúdo</h2>

              <form onSubmit={handleUpload} className="space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">Título</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={e => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título da obra"
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">Descrição</label>
                  <textarea
                    value={uploadData.description}
                    onChange={e => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva a obra..."
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500 resize-none"
                    rows={3}
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">Tipo de Conteúdo</label>
                  <select
                    value={uploadData.type}
                    onChange={e => setUploadData(prev => ({ ...prev, type: e.target.value as 'artwork' | 'text' }))}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="artwork">Obra de Arte</option>
                    <option value="text">Texto / Descrição</option>
                  </select>
                </div>

                {/* Upload de Imagem */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">Imagem</label>
                  <div className="border-2 border-dashed border-white/20 rounded p-4 text-center cursor-pointer hover:border-amber-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                      required
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="w-full h-24 object-cover rounded" />
                      ) : (
                        <div className="py-4">
                          <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                          <p className="text-gray-400 text-sm">Clique para selecionar imagem</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded transition"
                  >
                    Enviar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setPreviewImage(null);
                      setUploadData({
                        title: '',
                        description: '',
                        type: 'artwork',
                        imageFile: null,
                      });
                    }}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
