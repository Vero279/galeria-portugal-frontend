import { useState } from 'react';
import { Search, ShoppingCart, Filter } from 'lucide-react';
import { useStoreArtworks } from '../hooks/useStoreArtworks';
import { useCart } from '../hooks/useCart';
import type { Artwork } from '../lib/types';
import { renderBlocks, renderRichText } from '../utils/richTextRenderer';

export default function ShopPage() {
  const { artworks, loading } = useStoreArtworks();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const categories = ['all', ...new Set(artworks.map(a => a.medium).filter(Boolean))];
  const maxPrice = Math.max(...artworks.map(a => a.price), 1000);

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || artwork.medium === selectedCategory;
    const matchesPrice = artwork.price >= priceRange[0] && artwork.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const updateQuantity = (artworkId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [artworkId]: quantity }));
  };

  const handleAddToCart = (artwork: Artwork) => {
    const quantity = quantities[artwork.id] || 1;
    addToCart(artwork.id, quantity);
    setQuantities(prev => ({ ...prev, [artwork.id]: 1 }));
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">A carregar...</div>;
  }

  return (
    <main className="pt-32 pb-12 bg-[#0d0d0d] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-light mb-2">Loja de Arte</h1>
        <p className="text-gray-400 mb-8">Adquira obras originais dos nossos artistas</p>

        {/* Filtros e pesquisa (igual ao original, mas sem categorias pré-definidas) */}
        <div className="mb-6 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Procure por título ou artista..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
            <Filter size={20} />
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm uppercase tracking-widest mb-3">Técnica</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded text-sm ${selectedCategory === cat ? 'bg-amber-500 text-black' : 'bg-white/10'}`}>
                      {cat === 'all' ? 'Todas' : cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest mb-3">Preço máx.: €{priceRange[1]}</h3>
                <input type="range" min="0" max={maxPrice} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtworks.map(artwork => (
            <div key={artwork.id} className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col">
              <div className="relative overflow-hidden h-56">
                <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium mb-1">{artwork.title}</h3>
                <p className="text-xs text-gray-400 mb-2">{artwork.artist?.name}</p>
                {artwork.description && (
                  <div className="text-xs text-gray-400 line-clamp-2">
                    {typeof artwork.description === 'string' 
                      ? renderRichText(artwork.description)
                      : renderBlocks(artwork.description)}
                  </div>
                )}
                <div className="mt-auto">
                  <p className="text-2xl font-light text-amber-400 mb-4">€{artwork.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-400">Qtd:</span>
                    <div className="flex items-center border border-white/10 rounded">
                      <button onClick={() => updateQuantity(artwork.id, Math.max(1, (quantities[artwork.id] || 1) - 1))} className="px-2 py-1">−</button>
                      <input type="number" min="1" value={quantities[artwork.id] || 1} onChange={(e) => updateQuantity(artwork.id, Math.max(1, parseInt(e.target.value) || 1))} className="w-10 text-center bg-transparent outline-none" />
                      <button onClick={() => updateQuantity(artwork.id, (quantities[artwork.id] || 1) + 1)} className="px-2 py-1">+</button>
                    </div>
                  </div>
                  <button onClick={() => handleAddToCart(artwork)} className="w-full py-2 bg-amber-500 text-black rounded flex items-center justify-center gap-2">
                    <ShoppingCart size={18} /> Carrinho
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredArtworks.length === 0 && <p className="text-center py-12 text-gray-400">Nenhuma obra disponível.</p>}
      </div>
    </main>
  );
}