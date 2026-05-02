// App-wide constants
export const APP_NAME = 'Galeria Portugal';
export const DEFAULT_TITLE = 'Galeria Portugal - Arte Portuguesa Digital';
export const DEFAULT_DESCRIPTION = 'Explore artistas, obras e eventos culturais portugueses.';

// Routes
export const ROUTES = {
  HOME: '/',
  CITY: '/cidade/:citySlug',
  ARTIST: '/artista/:artistSlug',
  ARTISTS: '/artistas',
  ARTWORKS: '/obras',
  EVENTS: '/eventos',
  QUIZZES: '/testes',
  WALL: '/parede-virtual',
  SHOP: '/loja',
  ABOUT: '/sobre',
  CONTACT: '/contacto',
  ENTRAR: '/entrar',
  REGISTAR: '/registar',
  ADMIN: '/admin',
  ARTIST_DASHBOARD: '/artista/dashboard',
  CUSTOMER: '/cliente/conta',
  CART: '/cliente/conta?activeTab==\'cart\'',
} as const;

// Role-based default redirects
export const ROLE_HOME: Record<string, string> = {
  admin: ROUTES.ADMIN,
  artist: ROUTES.ARTIST_DASHBOARD,
  customer: ROUTES.CUSTOMER,
};