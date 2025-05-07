import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authApi from '../api/authApi';
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
          
          // Vérifier que le token est toujours valide (non expiré)
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp < currentTime) {
            console.log('Token expiré, déconnexion');
            clearAuth();
          } else {
            setUser(decoded);
            // Redirect to dashboard if on login page
            if (location.pathname === '/login') {
              navigate('/dashboard');
            }
          }
        }
      } catch (err) {
        console.error('Erreur de vérification du token:', err);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem('token');
    setError(null);
  };

  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await authApi.login(email, password);
        
        if (!data.token) {
          throw new Error('Token non reçu du serveur');
        }
        
        localStorage.setItem('token', data.token);

        try {
          const decoded = jwtDecode(data.token);
          setUser(decoded);
          
          // Redirection basée sur le rôle
          if (decoded.role === 'admin') {
            navigate('/dashboard');
          } else {
            // Ajouter d'autres redirections basées sur le rôle si nécessaire
            navigate('/dashboard');
          }
          
          return true;
        } catch (decodeError) {
          console.error('Erreur de décodage du token:', decodeError);
          throw new Error('Token invalide reçu');
        }
      } catch (err) {
        console.error('Erreur de connexion:', err);
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
        
        // Si l'API retourne un token, nous l'utilisons pour connecter l'utilisateur
        if (data?.token) {
          localStorage.setItem('token', data.token);
          
          try {
            const decoded = jwtDecode(data.token);
            setUser(decoded);
            
            // Redirection basée sur le rôle
            switch(decoded.role) {
              case 'admin':
                navigate('/AdminDashboard');
                break;
              case 'benevole':
                navigate('/VolunteerDashboard');
                break;
              case 'donateur':
                navigate('/DonorDashboard');
                break;
              case 'partenaire':
                navigate('/PartnerDashboard');
                break;
              default:
                navigate('/dashboard');
            }
            
            return true;
          } catch (decodeError) {
            console.error('Erreur de décodage du token:', decodeError);
            throw new Error('Token invalide reçu');
          }
        } else {
          // Si aucun token n'est retourné, on considère que l'inscription est réussie
          // mais l'utilisateur doit se connecter manuellement
          navigate('/login');
          return true;
        }
      } catch (err) {
        console.error('Erreur d\'inscription:', err);
        setError(err.response?.data?.message || err.message || "Échec de l'inscription");
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