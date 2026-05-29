import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../lib/constants';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const cartItemsCount = 0; // TODO: integrate with useCart

  const publicLinks = [
    { label: 'Galeria', path: ROUTES.ARTWORKS },
    { label: 'Artistas', path: ROUTES.ARTISTS },
    { label: 'Eventos', path: ROUTES.EVENTS },
    { label: 'Testes', path: ROUTES.QUIZZES },
    { label: 'Parede Virtual', path: ROUTES.WALL },
    { label: 'Loja', path: ROUTES.SHOP },
    { label: 'Sobre', path: ROUTES.ABOUT },
    { label: 'Contacto', path: ROUTES.CONTACT },
  ];

  const dashboardLink = (() => {
    if (!isAuthenticated || !user) return null;
    if (user.role === 'admin') return { label: 'Admin', path: ROUTES.ADMIN };
    if (user.role === 'artist') return { label: 'Minha Área', path: ROUTES.ARTIST_DASHBOARD };
    if (user.role === 'customer') return { label: 'Minha Conta', path: ROUTES.CUSTOMER };
    return null;
  })();

  const hideBackRoutes = ['/', '/artistas', '/obras', '/eventos', '/testes', '/parede-virtual', '/loja', '/sobre', '/contacto', '/entrar', '/registar'];
  const showBack = !hideBackRoutes.includes(currentPath) && currentPath !== '';

  const handleVoltar = () => navigate(-1);
  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    setShowMenu(false);
    setShowUserDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user display name and avatar initial
  const userDisplayName = user?.name || '';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d] border-b border-white/10">
      <div className="flex items-center justify-between px-3 sm:px-8 py-3 sm:py-4">
        {/* Left side: back button (if visible) */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-[40px] sm:min-w-0">
          {showBack && (
            <button
              onClick={handleVoltar}
              className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors text-xs sm:text-sm tracking-widest uppercase font-medium"
              title="Voltar"
            >
              ← <span className="hidden sm:inline">Voltar</span>
            </button>
          )}
        </div>

        {/* Centered logo – responsive sizing */}
        <Link
          to={ROUTES.HOME}
          className="absolute left-1/2 -translate-x-1/2 text-white font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[10px] sm:text-sm whitespace-nowrap hover:text-amber-400 transition-colors"
        >
          Galeria Portugal
        </Link>

        {/* Right side: cart, user area, mobile menu */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Cart button */}
          <button
            onClick={() => navigate(isAuthenticated ? ROUTES.CUSTOMER : ROUTES.ENTRAR)}
            className="relative p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Carrinho"
          >
            <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-amber-500 text-black text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            // Desktop & mobile: user dropdown (avatar only on mobile)
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1 sm:gap-2 px-1 sm:px-3 py-1 sm:py-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-medium text-xs sm:text-sm">
                  {userInitial}
                </div>
                <span className="hidden sm:inline text-sm">{userDisplayName}</span>
                <ChevronDown size={14} className="hidden sm:block transition-transform sm:w-4 sm:h-4" />
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="py-1">
                    {dashboardLink && (
                      <Link
                        to={dashboardLink.path}
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:bg-white/10 transition-colors"
                      >
                        <User size={16} />
                        {dashboardLink.label}
                      </Link>
                    )}
                    <Link
                      to={ROUTES.CONTACT}
                      state={{ name: user?.name, email: user?.email }}
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:bg-white/10 transition-colors"
                    >
                      <Settings size={16} />
                      Ajuda
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Not authenticated: show Entrar / Registar buttons
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to={ROUTES.ENTRAR}
                className="px-3 py-2 text-xs tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                Entrar
              </Link>
              <Link
                to={ROUTES.REGISTAR}
                className="px-3 py-2 text-xs tracking-widest uppercase text-amber-400 border border-amber-400/50 rounded hover:bg-amber-400/10 transition-colors"
              >
                Registar
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
            title={showMenu ? 'Fechar menu' : 'Abrir menu'}
          >
            {showMenu ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer menu (no changes needed besides responsive adjustments already present) */}
      {showMenu && (
        <div className="md:hidden border-t border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col py-2">
            {publicLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setShowMenu(false)}
                className={`px-6 py-3 text-left text-sm tracking-widest uppercase font-medium transition-colors ${
                  currentPath === link.path
                    ? 'text-amber-400 bg-white/5 border-l-2 border-amber-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {dashboardLink && (
              <Link
                to={dashboardLink.path}
                onClick={() => setShowMenu(false)}
                className={`px-6 py-3 text-left text-sm tracking-widest uppercase font-medium transition-colors ${
                  currentPath === dashboardLink.path
                    ? 'text-amber-400 bg-white/5 border-l-2 border-amber-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {dashboardLink.label}
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-6 py-3 text-left text-sm tracking-widest uppercase font-medium text-red-400 hover:bg-white/5 border-l-2 border-transparent hover:border-red-400 transition-colors"
              >
                Terminar Sessão
              </button>
            ) : (
              <>
                <Link
                  to={ROUTES.ENTRAR}
                  onClick={() => setShowMenu(false)}
                  className="px-6 py-3 text-left text-sm tracking-widest uppercase font-medium text-white/60 hover:text-white hover:bg-white/5"
                >
                  Entrar
                </Link>
                <Link
                  to={ROUTES.REGISTAR}
                  onClick={() => setShowMenu(false)}
                  className="px-6 py-3 text-left text-sm tracking-widest uppercase font-medium text-amber-400 hover:bg-white/5"
                >
                  Registar
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Desktop bottom navigation links */}
      <div className="hidden md:flex px-8 py-3 border-t border-white/10 justify-center gap-6">
        {publicLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-xs tracking-widest uppercase font-medium transition-colors ${
              currentPath === link.path ? 'text-amber-400' : 'text-white/60 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
        {dashboardLink && (
          <Link
            to={dashboardLink.path}
            className={`text-xs tracking-widest uppercase font-medium transition-colors ${
              currentPath === dashboardLink.path ? 'text-amber-400' : 'text-white/60 hover:text-white'
            }`}
          >
            {dashboardLink.label}
          </Link>
        )}
      </div>
    </nav>
  );
}