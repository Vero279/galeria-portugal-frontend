import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ROUTES, ROLE_HOME } from './lib/constants';
import Navbar from './components/common/Navbar';

import HomePage from './pages/HomePage';
import CityPage from './pages/CityPage';
import ArtistPage from './pages/ArtistPage';
import ArtistsPage from './pages/ArtistsPage';
import ArtworksPage from './pages/ArtworksPage';
import EventsPage from './pages/EventsPage';
import QuizzesPage from './pages/QuizzesPage';
import WallPage from './pages/WallPage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ArtistDashboardPage from './pages/ArtistDashboardPage';
import CustomerPage from './pages/CustomerPage';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen flex items-center justify-center">
        <div className="w-px h-16 bg-white/10 animate-pulse" />
      </div>
    );
  }

  const RequireAuth = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) => {
    if (!isAuthenticated) return <Navigate to={ROUTES.ENTRAR} replace />;
    if (allowedRoles && user && !allowedRoles.includes(user.role))
      return <Navigate to={ROUTES.HOME} replace />;
    return children;
  };

  const PublicOnly = ({ children }: { children: JSX.Element }) => {
    if (isAuthenticated && user) {
      const redirect = ROLE_HOME[user.role] || ROUTES.HOME;
      return <Navigate to={redirect} replace />;
    }
    return children;
  };

  return (
    <div className="bg-[#0d0d0d] min-h-screen">
      <Navbar />
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CITY} element={<CityPage />} />
        <Route path={ROUTES.ARTIST} element={<ArtistPage />} />
        <Route path={ROUTES.ARTISTS} element={<ArtistsPage />} />
        <Route path={ROUTES.ARTWORKS} element={<ArtworksPage />} />
        <Route path={ROUTES.EVENTS} element={<EventsPage />} />
        <Route path={ROUTES.QUIZZES} element={<QuizzesPage />} />
        <Route path={ROUTES.WALL} element={<WallPage />} />
        <Route path={ROUTES.SHOP} element={<ShopPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />

        <Route
          path={ROUTES.ENTRAR}
          element={
            <PublicOnly>
              <LoginPage />
            </PublicOnly>
          }
        />
        <Route
          path={ROUTES.REGISTAR}
          element={
            <PublicOnly>
              <RegisterPage />
            </PublicOnly>
          }
        />

        <Route
          path={ROUTES.ADMIN}
          element={
            <RequireAuth allowedRoles={['admin']}>
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.ARTIST_DASHBOARD}
          element={
            <RequireAuth allowedRoles={['artist']}>
              <ArtistDashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.CUSTOMER}
          element={
            <RequireAuth allowedRoles={['customer']}>
              <CustomerPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </div>
  );
}

export default App;