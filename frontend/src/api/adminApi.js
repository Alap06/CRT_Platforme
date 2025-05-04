import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  withCredentials: true
});

export default {
  /**
   * Récupère les utilisateurs en attente de validation
   */
  getPendingUsers() {
    return adminApi.get('/pending-users');
  },

  /**
   * Met à jour le rôle d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {string} role - Nouveau rôle
   */
  updateUserRole(userId, role) {
    return adminApi.patch(`/users/${userId}/role`, { role });
  },

  /**
   * Met à jour le statut d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {string} status - Nouveau statut
   */
  updateUserStatus(userId, status) {
    return adminApi.patch(`/users/${userId}/status`, { status });
  },

  /**
   * Récupère les statistiques administratives
   */
  getAdminStats() {
    return adminApi.get('/stats');
  },

  /**
   * Récupère tous les utilisateurs avec filtres
   * @param {Object} filters - Filtres de recherche
   */
  getAllUsers(filters = {}) {
    return adminApi.get('/users', { params: filters });
  },

  /**
   * Supprime un utilisateur
   * @param {number} userId - ID de l'utilisateur
   */
  deleteUser(userId) {
    return adminApi.delete(`/users/${userId}`);
  },

  /**
   * Récupère les logs système
   * @param {Object} params - Paramètres de pagination/filtrage
   */
  getSystemLogs(params = {}) {
    return adminApi.get('/logs', { params });
  }
};