import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Package, LogOut, User, Settings } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../lib/constants';

export default function CustomerPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { orders } = useOrders();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cart' | 'orders' | 'profile' | 'settings'>('profile');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    delivery_address: '',
    delivery_city: '',
    delivery_postal: '',
  });

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const handleCheckoutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutData.customer_name || !checkoutData.customer_email || !checkoutData.delivery_address) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    alert('Pedido criado com sucesso! Referência: #' + Math.random().toString(36).slice(2, 10).toUpperCase());
    setShowCheckout(false);
    clearCart();
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <main className="pt-20 pb-12 bg-[#0d0d0d] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light mb-2">Minha Conta</h1>
            <p className="text-gray-400">Bem-vindo, {user?.name}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8 border-b border-white/10 overflow-x-auto">
          {(['profile', 'cart', 'orders', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-light text-sm uppercase tracking-widest transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-amber-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'profile' && (
                <>
                  <User size={18} />
                  Perfil
                </>
              )}
              {tab === 'cart' && (
                <>
                  <ShoppingBag size={18} />
                  Carrinho ({cartItems.length})
                </>
              )}
              {tab === 'orders' && (
                <>
                  <Package size={18} />
                  Pedidos ({orders.length})
                </>
              )}
              {tab === 'settings' && (
                <>
                  <Settings size={18} />
                  Configurações
                </>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
              <h2 className="text-2xl font-light mb-6">Informações Pessoais</h2>
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
                <p className="text-gray-400 text-sm mb-2">PEDIDOS TOTAL</p>
                <p className="text-4xl font-light text-white">{orders.length}</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">GASTO TOTAL</p>
                <p className="text-4xl font-light text-amber-400">
                  €{orders.reduce((sum, order) => sum + (order.final_amount || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {cartItems.length === 0 ? (
                <div className="p-12 text-center bg-white/5 border border-white/10 rounded-lg">
                  <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400 text-lg">Seu carrinho está vazio</p>
                  <p className="text-gray-500 text-sm mt-2">Adicione produtos na loja para começar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-lg"
                    >
                      {item.product?.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product?.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}

                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.product?.title || 'Produto'}</h3>
                        <p className="text-gray-400 text-sm mb-2">€{item.product?.price.toFixed(2) || '0.00'}</p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-white/10 rounded transition"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white/10 rounded transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-amber-400 font-light text-lg mb-2">
                          €{((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 hover:bg-red-500/20 rounded transition text-red-400"
                          title="Remover"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      if (confirm('Tem a certeza que quer limpar o carrinho?')) {
                        clearCart();
                      }
                    }}
                    className="w-full px-4 py-2 bg-white/5 text-red-400 rounded hover:bg-red-500/20 transition"
                  >
                    Limpar Carrinho
                  </button>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="lg:col-span-1">
                <div className="p-6 bg-white/5 border border-white/10 rounded-lg sticky top-24">
                  <h3 className="text-lg font-light mb-4">Resumo</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>€{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Envio:</span>
                      <span>€5.00</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between text-amber-400 font-light text-lg">
                      <span>Total:</span>
                      <span>€{(cartTotal + 5).toFixed(2)}</span>
                    </div>
                  </div>

                  {!showCheckout ? (
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full py-2 bg-amber-500 text-black rounded hover:bg-amber-600 transition font-medium"
                    >
                      Prosseguir para Pagamento
                    </button>
                  ) : (
                    <form onSubmit={handleCheckout} className="space-y-3">
                      <h4 className="font-medium">Dados de Entrega</h4>
                      <input
                        type="text"
                        name="customer_name"
                        placeholder="Nome completo"
                        value={checkoutData.customer_name}
                        onChange={handleCheckoutChange}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500"
                        required
                      />
                      <input
                        type="email"
                        name="customer_email"
                        placeholder="Email"
                        value={checkoutData.customer_email}
                        onChange={handleCheckoutChange}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500"
                        required
                      />
                      <input
                        type="tel"
                        name="customer_phone"
                        placeholder="Telefone"
                        value={checkoutData.customer_phone}
                        onChange={handleCheckoutChange}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        name="delivery_address"
                        placeholder="Endereço"
                        value={checkoutData.delivery_address}
                        onChange={handleCheckoutChange}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          name="delivery_city"
                          placeholder="Cidade"
                          value={checkoutData.delivery_city}
                          onChange={handleCheckoutChange}
                          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          name="delivery_postal"
                          placeholder="Código Postal"
                          value={checkoutData.delivery_postal}
                          onChange={handleCheckoutChange}
                          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium text-sm"
                      >
                        Finalizar Compra
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCheckout(false)}
                        className="w-full py-2 bg-white/5 text-white rounded hover:bg-white/10 transition font-medium text-sm"
                      >
                        Cancelar
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-white/5 border border-white/10 rounded-lg">
                <Package size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400 text-lg">Nenhum pedido ainda</p>
                <p className="text-gray-500 text-sm mt-2">Seus pedidos aparecerão aqui</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-gray-400">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-gray-300 font-light">
                          {new Date(order.created_at).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-400 font-light text-lg">€{order.final_amount?.toFixed(2) || '0.00'}</p>
                        <span className={`text-xs px-2 py-1 rounded
                          ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {order.status === 'delivered' ? 'Entregue' : 'Em Processamento'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{order.delivery_address}, {order.delivery_city}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-xl font-light mb-4">Notificações por Email</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-white/80">Notificações de novos produtos</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-white/80">Atualizações de pedidos</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-white/80">Ofertas e promoções</span>
                </label>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-xl font-light mb-4">Privacidade e Segurança</h3>
              <button className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium text-sm rounded transition">
                Alterar Palavra-passe
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}