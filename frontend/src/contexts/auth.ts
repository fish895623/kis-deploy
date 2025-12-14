import { createContext } from 'react';
import type { User, TokenObtainPairRequest } from '../api/auth';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (credentials: TokenObtainPairRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
