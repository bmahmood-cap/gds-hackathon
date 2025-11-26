import { createContext } from 'react';
import type { User, Person } from '../types';

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  getConnectionsForUser: () => Person[];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
