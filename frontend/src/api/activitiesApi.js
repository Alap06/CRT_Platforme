import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const activitiesApi = axios.create({
  baseURL: `${API_URL}/activities`,
  withCredentials: true
});

export default {
  /**
   * Récupère toutes les activités
   * @param {Object} params - Paramètres de filtrage/pagination
   */
  getAllActivities(params = {}) {
    return activitiesApi.get('', { params });
  },

  /**
   * Crée une nouvelle activité
   * @param {Object} activityData - Données de l'activité
   */
  createActivity(activityData) {
    return activitiesApi.post('', activityData);
  },

  /**
   * Récupère une activité spécifique
   * @param {number} id - ID de l'activité
   */
  getActivityById(id) {
    return activitiesApi.get(`/${id}`);
  },

  /**
   * Met à jour une activité
   * @param {number} id - ID de l'activité
   * @param {Object} updates - Données à mettre à jour
   */
  updateActivity(id, updates) {
    return activitiesApi.patch(`/${id}`, updates);
  },

  /**
   * Supprime une activité
   * @param {number} id - ID de l'activité
   */
  deleteActivity(id) {
    return activitiesApi.delete(`/${id}`);
  },

  /**
   * Inscrit un utilisateur à une activité
   * @param {number} activityId - ID de l'activité
   * @param {number} userId - ID de l'utilisateur
   */
  registerToActivity(activityId, userId) {
    return activitiesApi.post(`/${activityId}/register`, { userId });
  },

  /**
   * Annule l'inscription à une activité
   * @param {number} activityId - ID de l'activité
   */
  cancelRegistration(activityId) {
    return activitiesApi.delete(`/${activityId}/register`);
  },

  /**
   * Récupère les participants d'une activité
   * @param {number} activityId - ID de l'activité
   */
  getActivityParticipants(activityId) {
    return activitiesApi.get(`/${activityId}/participants`);
  }
};