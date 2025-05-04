import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setUser(decoded);
          // Redirect to dashboard if on login page
          if (location.pathname === '/login') {
            navigate('/dashboard');
          }
        }
      } catch (err) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location]);

  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem('token');
    setError(null);
  };

  const login = useCallback(
    async (credentials, rememberMe = true) => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.post('/api/auth/login', credentials);
        const token = data.token;
        localStorage.setItem('token', token); // Always use localStorage for consistency

        const decoded = jwtDecode(token);
        setUser(decoded);
        navigate('/dashboard');
        return true;
      } catch (err) {
        setError(err.response?.data?.message || 'Échec de la connexion');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    clearAuth();
    navigate('/login');
  }, [navigate]);

  const register = useCallback(
    async (userData) => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.post('/api/auth/register', userData);
        const token = data.token;
        localStorage.setItem('token', token);

        const decoded = jwtDecode(token);
        setUser(decoded);
        navigate('/dashboard');
        return true;
      } catch (err) {
        setError(err.response?.data?.message || "Échec de l'inscription");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    register,
    clearErrors: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }

  return context;
};