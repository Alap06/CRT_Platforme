import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authApi from '../api/authApi';  // Importation par défaut, sans accolades
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
    async (credentials) => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await authApi.login(credentials.email, credentials.password);
        const token = data.token;
        localStorage.setItem('token', token);

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

        const { data } = await authApi.register(userData);
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

  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: hasRole('admin'),
    login,
    logout,
    register,
    hasRole,
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