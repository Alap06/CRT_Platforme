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

  // Login user with improved request handling
  const login = async (email, password) => {
    try {
      // Clear any previous errors
      setError(null);
      
      // More robust client-side validation
      if (!email || typeof email !== 'string' || email.trim() === '') {
        const errorMsg = 'Email requis';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      
      if (!password || typeof password !== 'string' || password === '') {
        const errorMsg = 'Mot de passe requis';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log('Sending login request with:', { email: email.trim() });
      
      // Create proper payload with stringified data
      const payload = JSON.stringify({
        email: email.trim(),
        password: password
      });
      
      const res = await axios.post(
        `${API_URL}/auth/login`, 
        payload,
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true 
        }
      );
      
      if (!res.data) {
        throw new Error('No response data received');
      }
      
      // Store token and update state
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.data);
        setIsAuthenticated(true);
        return res.data;
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = 
        err.response?.data?.message || 
        err.message ||
        'Erreur de connexion';
      
      setError(errorMessage);
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