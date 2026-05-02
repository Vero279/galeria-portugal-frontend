// Authentication types
export type UserRole = 'admin' | 'artist' | 'customer' | null;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Admin user for authentication
export interface AdminUser {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'admin';
}

// Artist user for authentication
export interface ArtistUser {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'artist';
  artist_id: string;
}

// Customer user for authentication
export interface CustomerUser {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'customer';
  customer_id: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  is_published: boolean;
  created_at: string;
}

export interface Artist {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  bio: string;
  profile_image: string;
  cover_image: string;
  medium: string;
  is_published: boolean;
  rating?: number;
  total_reviews?: number;
  created_at: string;
  city?: City;
}

export interface Artwork {
  id: string;
  artist_id: string;
  title: string;
  image_url: string;
  year: number;
  medium: string;
  dimensions: string;
  price: number;
  created_at: string;
  artist?: Artist;
}

export interface Event {
  id: string;
  city_id: string;
  artist_id?: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
  created_at: string;
  city?: City;
  artist?: Artist;
}

export interface Quiz {
  id: string;
  artist_id: string;
  title: string;
  description: string;
  questions?: QuizQuestion[];
  created_at: string;
  artist?: Artist;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  correct_answer: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  created_at: string;
}

export interface Product {
  id: string;
  artist_id?: string;
  artwork_id?: string;
  title: string;
  description?: string;
  image_url: string;
  price: number;
  category: string;
  stock_quantity: number;
  is_available: boolean;
  created_at: string;
  artist?: Artist;
}

export interface CartItem {
  id: string;
  session_id: string;
  product_id: string;
  quantity: number;
  added_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  session_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  delivery_address: string;
  delivery_city: string;
  delivery_postal?: string;
  total_amount: number;
  discount_code?: string;
  discount_amount: number;
  final_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_title: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export type View =
  | { name: 'home' }
  | { name: 'city'; citySlug: string }
  | { name: 'artist'; artistSlug?: string }
  | { name: 'artists' }
  | { name: 'artworks' }
  | { name: 'events' }
  | { name: 'quizzes' }
  | { name: 'wall' }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'shop' }
  | { name: 'admin' }
  | { name: 'admin-login' }
  | { name: 'artist-login' }
  | { name: 'artist-dashboard' }
  | { name: 'customer' }
  | { name: 'customer-login' };
