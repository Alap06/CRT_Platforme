import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const res = await axios.get(`${API_URL}/auth/user`, config);
        
        setUser(res.data);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (err) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        setError('Session expirée, veuillez vous reconnecter');
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError(null);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
      throw err;
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError(null);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur d\'inscription');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear errors
  const clearErrors = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};