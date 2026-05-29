import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES, ROLE_HOME } from '../lib/constants';

export default function LoginPage() {
  const { login, isLoading, error, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setLocalError('Preencha todos os campos');
      return;
    }
    try {
      await login(formData.email, formData.password);
      // After login, user object is updated; redirect based on role
      if (user) {
        const redirect = ROLE_HOME[user.role] || ROUTES.HOME;
        navigate(redirect);
      }
    } catch {
      setLocalError(error || 'Falha no login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-light text-white mb-2">ENTRAR</h1>
          <p className="text-gray-400 text-sm">Aceda à sua conta</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
            {(localError || error) && (
              <div className="text-red-400 text-sm text-center">{localError || error}</div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-medium text-sm uppercase rounded"
            >
              {isLoading ? 'A processar...' : 'ENTRAR'}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Não tem conta?{' '}
            <button onClick={() => navigate('/registar')} className="text-amber-500 hover:text-amber-400">
              Registar
            </button>
          </div>
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-gray-400 text-sm hover:text-white">
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}