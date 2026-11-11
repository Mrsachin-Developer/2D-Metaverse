import { request, setAuthToken } from './api';
import type { SigninRequest, SigninResponse, SignupRequest, SignupResponse, UserSession } from '../types/api';

const SESSION_KEY = 'metaverse_session';

function decodeJwt(token: string): { userId?: string; role?: 'Admin' | 'User'; exp?: number } {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return {};
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode JWT:', e);
    return {};
  }
}

export const authService = {
  async signup(data: SignupRequest): Promise<SignupResponse> {
    return request<SignupResponse>('/api/v1/signup', {
      method: 'POST',
      body: JSON.stringify({
        username: data.username.trim(),
        password: data.password,
        type: data.type || 'user',
      }),
      requiresAuth: false,
    });
  },

  async signin(data: SigninRequest): Promise<UserSession> {
    const res = await request<SigninResponse>('/api/v1/signin', {
      method: 'POST',
      body: JSON.stringify({
        username: data.username.trim(),
        password: data.password,
      }),
      requiresAuth: false,
    });

    const decoded = decodeJwt(res.token);
    const session: UserSession = {
      token: res.token,
      userId: decoded.userId || '',
      username: data.username.trim(),
      role: (decoded.role as 'Admin' | 'User') || 'User',
    };

    this.saveSession(session);
    setAuthToken(session.token);
    return session;
  },

  saveSession(session: UserSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setAuthToken(session.token);
  },

  getSession(): UserSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const session: UserSession = JSON.parse(raw);
      if (!session.token || !session.userId) return null;
      // Check expiration if present
      const decoded = decodeJwt(session.token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        this.clearSession();
        return null;
      }
      setAuthToken(session.token);
      return session;
    } catch {
      this.clearSession();
      return null;
    }
  },

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    setAuthToken(null);
  },
};

