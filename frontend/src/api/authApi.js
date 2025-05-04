import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = {
  login: (email, password) => 
    axios.post(`${API_URL}/auth/login`, { email, password }),
  
  register: (userData) => 
    axios.post(`${API_URL}/auth/register`, userData),
  
  getCurrentUser: () => 
    axios.get(`${API_URL}/auth/me`, { withCredentials: true })
};