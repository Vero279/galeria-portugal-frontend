import { useState } from 'react';
import { Search, ShoppingCart, Filter } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../lib/types';

interface ShopPageProps {
  onAddToCart?: (product: Product, quantity: number) => void;
}

export default function ShopPage({ onAddToCart }: ShopPageProps) {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const categories = ['all', 'artwork', 'merchandise', 'print', 'original'];
  const maxPrice = Math.max(...products.map(p => p.price), 1000);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const updateQuantity = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    if (onAddToCart) {
      onAddToCart(product, quantity);
      setQuantities(prev => ({
        ...prev,
        [product.id]: 1
      }));
    }
  };

  return (
    <main className="pt-32 pb-12 bg-[#0d0d0d] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-light mb-2">Loja de Artes</h1>
          <p className="text-gray-400">Adquira obras e produtos exclusivos de nossos artistas</p>
        </div>

        <div className="mb-6 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Procure por título, artista..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 flex items-center gap-2 transition"
          >
            <Filter size={20} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest text-gray-300 mb-3">Categoria</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded text-sm transition ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest text-gray-300 mb-3">
                  Preço: €{priceRange[0]} - €{priceRange[1]}
                </h3>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-400 mb-6">
          Mostrando {filteredProducts.length} de {products.length} produtos
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-amber-500 transition flex flex-col"
            >
              <div className="relative overflow-hidden bg-black h-48 sm:h-56">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {product.stock_quantity === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-medium">Esgotado</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-3">
                  <p className="text-xs text-amber-400 uppercase tracking-widest mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-white font-medium mb-1 line-clamp-2">{product.title}</h3>
                  {product.description && (
                    <p className="text-xs text-gray-400 line-clamp-2">{product.description}</p>
                  )}
                </div>

                <div className="mt-auto">
                  <p className="text-2xl font-light text-amber-400 mb-4">€{product.price.toFixed(2)}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-400">Qtd:</span>
                    <div className="flex items-center border border-white/10 rounded">
                      <button
                        onClick={() => updateQuantity(product.id, Math.max(1, (quantities[product.id] || 1) - 1))}
                        className="px-2 py-1 hover:bg-white/10 transition"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantities[product.id] || 1}
                        onChange={(e) => updateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-10 text-center bg-transparent outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(product.id, (quantities[product.id] || 1) + 1)}
                        className="px-2 py-1 hover:bg-white/10 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_quantity === 0}
                    className={`w-full py-2 rounded transitio flex items-center justify-center gap-2 font-light ${
                      product.stock_quantity === 0
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-amber-500 text-black hover:bg-amber-600'
                    }`}
                  >
                    <ShoppingCart size={18} />
                    Carrinho
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </main>
  );
}