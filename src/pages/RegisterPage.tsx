import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { registerWithRole } from '../services/strapi';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'visitor' as 'visitor' | 'artist',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('Preencha todos os campos');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Register with Strapi and assign role
      await registerWithRole(formData.username, formData.email, formData.password, formData.role);
      // After successful registration, redirect to login page
      navigate('/entrar');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no registo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-light text-white mb-2">CRIAR CONTA</h1>
          <p className="text-gray-400 text-sm">Escolha o tipo de perfil</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-300 mb-2">NOME DE UTILIZADOR</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-2">EMAIL</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-2">PALAVRA-PASSE</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-2">TIPO DE CONTA</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white"
              >
                <option value="visitor">Visitante</option>
                <option value="artist">Artista</option>
              </select>
            </div>
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-medium text-sm uppercase rounded"
            >
              {isLoading ? 'A registar...' : 'REGISTAR'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/entrar')} className="text-gray-400 text-sm hover:text-white">
              Já tem conta? Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}