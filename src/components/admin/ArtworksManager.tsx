import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { strapiAPI, getStrapiImageUrl, uploadImageToStrapi } from '../../services/strapi';
import type { Artwork, Artist } from '../../lib/types';

function textToBlocks(text: string) {
  return [{ type: 'paragraph', children: [{ type: 'text', text }] }];
}

interface ArtworksManagerProps {
  artists: Artist[];
}

export default function ArtworksManager({ artists }: ArtworksManagerProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', year: '', medium: '', dimensions: '', price: '',
    artist_id: '', isPublished: true, imageFile: null as File | null, imagePreview: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const data = await strapiAPI.getCollection<Artwork>('artworks', {}, ['artist'], false);
      const mapped = data.map(aw => ({ ...aw, image_url: getStrapiImageUrl(aw.image_url) }));
      setArtworks(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArtworks(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setFormData(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', year: '', medium: '', dimensions: '', price: '', artist_id: '', isPublished: true, imageFile: null, imagePreview: '' });
    setEditingArtwork(null);
    setShowForm(false);
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      title: artwork.title,
      description: typeof artwork.description === 'string' ? artwork.description : '',
      year: artwork.year?.toString() || '',
      medium: artwork.medium || '',
      dimensions: artwork.dimensions || '',
      price: artwork.price?.toString() || '',
      artist_id: artwork.artist_id,
      isPublished: artwork.isPublished,
      imageFile: null,
      imagePreview: artwork.image_url,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar obra permanentemente?')) return;
    try {
      await strapiAPI.delete('artworks', id);
      setArtworks(prev => prev.filter(aw => aw.id !== id));
    } catch (err) { alert('Erro ao eliminar'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.artist_id) return alert('Título e Artista obrigatórios');
    setIsSubmitting(true);
    try {
      let imageUrl = formData.imagePreview;
      if (formData.imageFile) imageUrl = await uploadImageToStrapi(formData.imageFile);
      else if (!imageUrl && !editingArtwork) throw new Error('Imagem necessária');
      const payload = {
        title: formData.title,
        description: formData.description ? textToBlocks(formData.description) : null,
        image_url: imageUrl,
        year: formData.year ? parseInt(formData.year) : null,
        medium: formData.medium || null,
        dimensions: formData.dimensions || null,
        price: formData.price ? parseFloat(formData.price) : null,
        isPublished: formData.isPublished,
        artist: formData.artist_id,
      };
      if (editingArtwork) {
        const updated = await strapiAPI.update<Artwork>('artworks', editingArtwork.id, payload);
        setArtworks(prev => prev.map(aw => aw.id === editingArtwork.id ? { ...updated, image_url: getStrapiImageUrl(updated.image_url) } : aw));
      } else {
        const created = await strapiAPI.create<Artwork>('artworks', payload);
        setArtworks(prev => [{ ...created, image_url: getStrapiImageUrl(created.image_url) }, ...prev]);
      }
      resetForm();
    } catch (err) { alert('Erro ao guardar obra'); }
    finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="text-center py-8">A carregar obras...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light">Obras de Arte ({artworks.length})</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded">
          <Plus size={20} /> Nova Obra
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-lg">
          <h3 className="text-xl font-light mb-4">{editingArtwork ? 'Editar Obra' : 'Nova Obra'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm mb-1">Título *</label><input name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2" /></div>
            <div><label className="block text-sm mb-1">Artista *</label><select name="artist_id" value={formData.artist_id} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2"><option value="">Selecione</option>{artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
            <div className="md:col-span-2"><label>Descrição</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2" /></div>
            <div><label>Ano</label><input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2" /></div>
            <div><label>Técnica</label><input name="medium" value={formData.medium} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2" /></div>
            <div><label>Dimensões</label><input name="dimensions" value={formData.dimensions} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2" /></div>
            <div><label>Preço (€)</label><input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2" /></div>
            <div className="flex items-center gap-4"><label className="flex items-center gap-2"><input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={e => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))} className="w-4 h-4" /> Publicado</label></div>
            <div className="md:col-span-2"><label>Imagem</label><div className="flex gap-4">{formData.imagePreview && <img src={formData.imagePreview} className="w-24 h-24 object-cover rounded" />}<input type="file" accept="image/*" onChange={handleInputChange} className="flex-1" /></div></div>
            <div className="md:col-span-2 flex gap-3"><button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-amber-500 text-black rounded">{isSubmitting ? 'A guardar...' : (editingArtwork ? 'Atualizar' : 'Criar')}</button><button type="button" onClick={resetForm} className="flex-1 py-2 bg-white/10 rounded">Cancelar</button></div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10"><tr><th>Imagem</th><th>Título</th><th>Artista</th><th>Preço</th><th>Publicado</th><th>Ações</th></tr></thead>
          <tbody>
            {artworks.map(aw => (
              <tr key={aw.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3"><img src={aw.image_url} className="w-12 h-12 object-cover rounded" /></td>
                <td className="px-4 py-3 font-medium">{aw.title}</td>
                <td className="px-4 py-3 text-gray-400">{aw.artist?.name || '-'}</td>
                <td className="px-4 py-3">{aw.price ? `€${aw.price.toFixed(2)}` : 'Grátis'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${aw.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{aw.isPublished ? 'Sim' : 'Não'}</span></td>
                <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleEdit(aw)}><Edit2 size={16} className="text-amber-400" /></button><button onClick={() => handleDelete(aw.id)}><Trash2 size={16} className="text-red-400" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}