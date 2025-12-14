import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { isAuthenticated, clearTokens } from '../api/openapi-client';
import { getProfile, login as apiLogin, logout as apiLogout } from '../api/auth';
import type { User, TokenObtainPairRequest } from '../api/auth';
import { AuthContext } from './auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (isAuthenticated()) {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        clearTokens();
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      await refreshUser();
      if (isMounted) {
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [refreshUser]);

  const login = useCallback(async (credentials: TokenObtainPairRequest) => {
    await apiLogin(credentials);
    await refreshUser();
  }, [refreshUser]);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
