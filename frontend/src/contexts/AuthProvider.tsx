import { useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';
import type { User, Person } from '../types';
import { mockPeople } from '../data/mockData';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (selectedUser: User) => {
    setUser(selectedUser);
  };

  const logout = () => {
    setUser(null);
  };

  const getConnectionsForUser = (): Person[] => {
    if (!user) return [];
    return mockPeople.filter(person => user.connectionIds.includes(person.id));
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    getConnectionsForUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
