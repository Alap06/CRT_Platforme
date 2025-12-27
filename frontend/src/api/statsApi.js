import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: `${API_URL}/stats`, withCredentials: true });
api.interceptors.request.use((c) => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = `Bearer ${t}`; return c; });

export default {
    getDashboard: () => api.get('/dashboard'),
    getActivities: () => api.get('/activities'),
    getDonations: (params = {}) => api.get('/donations', { params }),
    getVolunteers: () => api.get('/volunteers'),
    getProjects: () => api.get('/projects')
};
