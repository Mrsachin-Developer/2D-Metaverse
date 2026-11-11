import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { UserSession, SigninRequest, SignupRequest } from '../types/api';
import { authService } from '../services/auth.service';
import { avatarService } from '../services/avatar.service';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  signin: (credentials: SigninRequest) => Promise<void>;
  signup: (credentials: SignupRequest) => Promise<void>;
  logout: () => void;
  updateUserAvatar: (avatarId: string, imageUrl?: string) => Promise<void>;
  refreshAvatar: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUserAvatar = useCallback(async (currentSession: UserSession) => {
    try {
      const res = await avatarService.getBulkMetadata([currentSession.userId]);
      const match = res.avatars.find((a) => a.userId === currentSession.userId);
      if (match && match.avatarId) {
        const updated = { ...currentSession, avatarUrl: match.avatarId };
        setUser(updated);
        authService.saveSession(updated);
      }
    } catch (e) {
      console.warn('Failed to fetch user avatar metadata:', e);
    }
  }, []);

  useEffect(() => {
    const session = authService.getSession();
    if (session) {
      setUser(session);
      loadUserAvatar(session).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [loadUserAvatar]);

  const signin = async (credentials: SigninRequest) => {
    setLoading(true);
    try {
      const session = await authService.signin(credentials);
      setUser(session);
      await loadUserAvatar(session);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (credentials: SignupRequest) => {
    setLoading(true);
    try {
      await authService.signup(credentials);
      // Automatically sign in upon successful signup
      const session = await authService.signin({
        username: credentials.username,
        password: credentials.password,
      });
      setUser(session);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.clearSession();
    setUser(null);
  };

  const updateUserAvatar = async (avatarId: string, imageUrl?: string) => {
    await avatarService.updateMetadata(avatarId);
    if (user) {
      const updated = { ...user, avatarUrl: imageUrl || user.avatarUrl };
      setUser(updated);
      authService.saveSession(updated);
    }
  };

  const refreshAvatar = async () => {
    if (user) {
      await loadUserAvatar(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signin,
        signup,
        logout,
        updateUserAvatar,
        refreshAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

