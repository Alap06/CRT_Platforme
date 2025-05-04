// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Fonction supplémentaire pour vérifier les permissions
  const hasRole = (requiredRole) => {
    if (!context.user) return false;
    return context.user.role === requiredRole;
  };

  return {
    ...context,
    hasRole
  };
}