import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('eec_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('eec_admin');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('eec_user', JSON.stringify(user));
    else localStorage.removeItem('eec_user');
  }, [user]);

  useEffect(() => {
    if (admin) localStorage.setItem('eec_admin', JSON.stringify(admin));
    else localStorage.removeItem('eec_admin');
  }, [admin]);

  const login = async (email, password) => {
    // This is for admin login
    const res = await api.adminLogin({ email, password });
    setAdmin(res.data);
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.registerUser(userData);
    setUser(res.data);
    return res.data;
  };

  const googleAuth = async (userData) => {
    const res = await api.googleAuth(userData);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      isAuthenticated: !!user,
      isAdmin: !!admin,
      login,
      register,
      googleAuth,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
