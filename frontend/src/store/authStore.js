import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Mock inicial
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('nexum_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (fakeUser) => {
    localStorage.setItem('nexum_token', 'fake-jwt-token');
    localStorage.setItem('nexum_user', JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  const logout = () => {
    localStorage.removeItem('nexum_token');
    localStorage.removeItem('nexum_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
