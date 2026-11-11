// Use relative URLs when running in browser against localhost to leverage Vite's dev proxy and prevent CORS issues
const envUrl = import.meta.env.VITE_HTTP_URL;
const BASE_URL =
  typeof window !== 'undefined' && (!envUrl || envUrl === 'http://localhost:3000')
    ? ''
    : (envUrl || '');

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = (): string | null => {
  if (authToken) return authToken;
  const saved = localStorage.getItem('metaverse_session');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed.token || null;
    } catch {
      return null;
    }
  }
  return null;
};

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = true, headers = {}, ...rest } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network connection failed. Please ensure the backend is running.',
      0
    );
  }
}

