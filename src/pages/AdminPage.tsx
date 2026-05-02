import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../lib/constants';
import type { Product } from '../lib/types';

export default function AdminPage() {
  const { products } = useProducts();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'artwork',
    image_url: '',
    stock_quantity: '999',
    is_available: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit product:', formData);
    // TODO: Implement product creation/editing with Strapi
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'artwork',
      image_url: '',
      stock_quantity: '999',
      is_available: true,
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity.toString(),
      is_available: product.is_available,
    });
    setShowForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log('Delete product:', productId);
    // TODO: Implement product deletion with Strapi
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <main className="pt-20 pb-12 bg-[#0d0d0d] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light mb-2">Painel Administrativo</h1>
            <p className="text-gray-400">Gerencie produtos, pedidos e configurações</p>
          </div>
          {/* Botão de logout removido do cabeçalho – será adicionado no canto inferior direito */}
        </div>

        <div className="flex gap-4 mb-8 border-b border-white/10">
          {(['products', 'orders', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-light text-sm uppercase tracking-widest transition ${
                activeTab === tab
                  ? 'border-b-2 border-amber-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'products' && 'Produtos'}
              {tab === 'orders' && 'Pedidos'}
              {tab === 'settings' && 'Configurações'}
            </button>
          ))}
        </div>

        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-light">Gestão de Produtos</h2>
                <p className="text-gray-400 text-sm mt-1">Total: {products.length} produtos</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    title: '',
                    description: '',
                    price: '',
                    category: 'artwork',
                    image_url: '',
                    stock_quantity: '999',
                    is_available: true,
                  });
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600 transition font-medium"
              >
                <Plus size={20} />
                Novo Produto
              </button>
            </div>

            {showForm && (
              <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="text-xl font-light mb-4">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Título</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Preço (€)</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Categoria</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="artwork">Artwork</option>
                      <option value="merchandise">Merchandise</option>
                      <option value="print">Print</option>
                      <option value="original">Original</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Stock</label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-300">URL da Imagem</label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-300">Descrição</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-300">Disponível</label>
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600 transition font-medium"
                    >
                      {editingProduct ? 'Atualizar' : 'Criar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                      }}
                      className="flex-1 px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-400">Título</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-400">Categoria</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-400">Preço</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-400">Stock</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-400">Status</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-400">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-4 py-3">{product.title}</td>
                      <td className="px-4 py-3 text-gray-400">{product.category}</td>
                      <td className="px-4 py-3">€{product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">{product.stock_quantity}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.is_available
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {product.is_available ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-1 hover:bg-white/10 rounded transition"
                            title="Editar"
                          >
                            <Edit2 size={16} className="text-amber-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1 hover:bg-white/10 rounded transition"
                            title="Apagar"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-light mb-4">Gestão de Pedidos</h2>
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg text-center">
              <p className="text-gray-400">Funcionalidade de pedidos em desenvolvimento</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-light mb-4">Configurações</h2>
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg text-center">
              <p className="text-gray-400">Configurações em desenvolvimento</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}