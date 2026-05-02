import { logger } from '../utils/logger';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const ADMIN_TOKEN = import.meta.env.VITE_STRAPI_ADMIN_TOKEN;
const PUBLIC_TOKEN = import.meta.env.VITE_STRAPI_PUBLIC_TOKEN;

// Helper to get full image URL
export function getStrapiImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// Authentication token management
function getAuthToken(): string | null {
  return localStorage.getItem('strapi_jwt');
}

function setAuthToken(token: string) {
  localStorage.setItem('strapi_jwt', token);
}

export function clearAuthToken() {
  localStorage.removeItem('strapi_jwt');
}

// Core fetch wrapper
async function fetchStrapi<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = false
): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (!requireAuth && PUBLIC_TOKEN) {
    headers['Authorization'] = `Bearer ${PUBLIC_TOKEN}`;
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorMessage = `Strapi error ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.error?.message || errorMessage;
    } catch {
      // ignore
    }
    logger.error(`fetchStrapi failed: ${endpoint}`, { status: response.status, errorMessage });
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.data as T;
}

// Authentication endpoints
export const strapiAuth = {
  async register(username: string, email: string, password: string) {
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Registration failed');
    }
    const result = await response.json();
    setAuthToken(result.jwt);
    return result;
  },

  async login(identifier: string, password: string) {
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Login failed');
    }
    const result = await response.json();
    setAuthToken(result.jwt);
    return result;
  },

  logout() {
    clearAuthToken();
  },

  async getMe() {
    // Use fetch directly to get user with role populated
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');
    
    const response = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch user');
    }
    const userData = await response.json();
    return userData;
  },
};

// Function to assign role to a user using admin token
export async function assignUserRole(userId: number, roleName: string) {
  if (!ADMIN_TOKEN) {
    throw new Error('Admin token not configured. Set VITE_STRAPI_ADMIN_TOKEN in .env');
  }

  // Fetch all roles to get role ID
  const rolesRes = await fetch(`${STRAPI_URL}/api/users-permissions/roles`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  if (!rolesRes.ok) throw new Error('Failed to fetch roles');
  const rolesData = await rolesRes.json();
  const role = rolesData.roles.find((r: any) => r.name === roleName);
  if (!role) throw new Error(`Role "${roleName}" not found`);

  // Update user's role
  const updateRes = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify({ role: role.id }),
  });
  if (!updateRes.ok) {
    const err = await updateRes.json();
    throw new Error(err.error?.message || 'Failed to assign role');
  }
  return await updateRes.json();
}

// Combined registration with role assignment
export async function registerWithRole(
  username: string,
  email: string,
  password: string,
  roleType: 'visitor' | 'artist'
) {
  // Step 1: Register the user
  const registerResult = await strapiAuth.register(username, email, password);
  const userId = registerResult.user.id;

  // Step 2: Assign the chosen role (Customer for visitor, Artist for artist)
  const roleName = roleType === 'artist' ? 'Artist' : 'Customer';
  await assignUserRole(userId, roleName);

  // Step 3: Clear the auto-login token (so user must log in explicitly)
  strapiAuth.logout();

  return registerResult;
}

// Generic CRUD helpers 
export const strapiAPI = {
  async getCollection<T = any>(
    contentType: string,
    filters: Record<string, any> = {},
    populate = '*',
    publicOnly = true // New flag
  ): Promise<T[]> {
    const queryParams = new URLSearchParams();
    if (populate) queryParams.append('populate', populate);
    queryParams.append('filters[is_published][$eq]', 'true');
    for (const [key, value] of Object.entries(filters)) {
      queryParams.append(key, String(value));
    }
    const endpoint = `/${contentType}?${queryParams.toString()}`;
    try {
      return await fetchStrapi<T[]>(endpoint);
    } catch (err) {
      if (publicOnly && (err as any).message === 'Forbidden') {
        logger.warn(`Public access denied for ${contentType}, returning empty array`);
        return [];
      }
      throw err;
    }
  },

  async getBySlug<T = any>(
    contentType: string,
    slug: string,
    field = 'slug',
    populate = '*'
  ): Promise<T | null> {
    const query = new URLSearchParams({
      populate,
      [`filters[${field}][$eq]`]: slug,
      'filters[is_published][$eq]': 'true',
    });
    const endpoint = `/${contentType}?${query.toString()}`;
    const results = await fetchStrapi<T[]>(endpoint);
    return results.length ? results[0] : null;
  },

  async getById<T = any>(contentType: string, id: string | number, populate = '*'): Promise<T | null> {
    const query = new URLSearchParams({ populate });
    const endpoint = `/${contentType}/${id}?${query.toString()}`;
    return fetchStrapi<T>(endpoint);
  },

  async create<T = any>(contentType: string, data: any): Promise<T> {
    return fetchStrapi<T>(`/${contentType}`, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },

  async update<T = any>(contentType: string, id: string | number, data: any): Promise<T> {
    return fetchStrapi<T>(`/${contentType}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },

  async delete(contentType: string, id: string | number): Promise<void> {
    await fetchStrapi(`/${contentType}/${id}`, { method: 'DELETE' });
  },
};