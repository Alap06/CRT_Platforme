import axios from 'axios';

// URL de base pour l'API d'authentification
const API_URL = 'http://localhost:3000/api';

// Création d'une instance axios avec une configuration de base
const authInstance = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true
});

// Objet contenant toutes les méthodes d'API d'authentification
export const authApi = {
  /**
   * Connexion utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise} - Promesse contenant les données de connexion
   */
  login(email, password) {
    return authInstance.post('/login', { email, password });
  },
  
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @param {string} userData.firstName - Prénom de l'utilisateur
   * @param {string} userData.lastName - Nom de l'utilisateur
   * @param {string} userData.email - Email de l'utilisateur
   * @param {string} userData.phone - Numéro de téléphone
   * @param {string} userData.password - Mot de passe
   * @param {string} userData.cin - Numéro de carte d'identité nationale
   * @param {string} userData.governorate - Gouvernorat
   * @param {string} userData.city - Ville
   * @param {string} userData.postalCode - Code postal
   * @param {string} [userData.role='benevole'] - Rôle (par défaut: 'benevole')
   * @param {string} [userData.status='pending'] - Statut (par défaut: 'pending')
   * @returns {Promise} - Promesse contenant les données de l'utilisateur créé
   */
  register(userData) {
    // S'assurer que les données sont formatées comme attendu par le backend
    const formattedData = {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email,
      phone: userData.phone || '',
      password: userData.password,
      cin: userData.cin || '',
      governorate: userData.governorate || '',
      city: userData.city || '',
      postalCode: userData.postalCode || '',
      role: userData.role || 'benevole',
      status: userData.status || 'pending'
    };
    
    return authInstance.post('/register', formattedData);
  },
  
  /**
   * Récupère les informations de l'utilisateur connecté
   * @returns {Promise} - Promesse contenant les données de l'utilisateur connecté
   */
  getCurrentUser() {
    return authInstance.get('/me');
  },
  
  /**
   * Demande de réinitialisation du mot de passe
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise} - Promesse contenant le statut de la demande
   */
  forgotPassword(email) {
    return authInstance.post('/forgot-password', { email });
  },
  
  /**
   * Réinitialisation du mot de passe avec token
   * @param {string} token - Token de réinitialisation
   * @param {string} password - Nouveau mot de passe
   * @returns {Promise} - Promesse contenant le statut de la réinitialisation
   */
  resetPassword(token, password) {
    return authInstance.post(`/reset-password/${token}`, { password });
  },
  
  /**
   * Mise à jour du mot de passe utilisateur connecté
   * @param {string} currentPassword - Mot de passe actuel
   * @param {string} newPassword - Nouveau mot de passe
   * @returns {Promise} - Promesse contenant le statut de la mise à jour
   */
  updatePassword(currentPassword, newPassword) {
    return authInstance.patch('/update-password', { 
      currentPassword, 
      newPassword 
    });
  },
  
  /**
   * Déconnexion de l'utilisateur
   * @returns {Promise} - Promesse contenant le statut de la déconnexion
   */
  logout() {
    return authInstance.post('/logout');
  }
};

// Ajout d'une exportation par défaut pour la compatibilité
export default authApi;