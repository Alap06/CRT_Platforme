import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: `${API_URL}/committees`, withCredentials: true });
api.interceptors.request.use((c) => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = `Bearer ${t}`; return c; });

export default {
    getAll: (params = {}) => api.get('/', { params }),
    get: (id) => api.get(`/${id}`),
    getHierarchy: (governorate) => api.get('/hierarchy', { params: { governorate } }),
    getRegional: () => api.get('/regional'),
    getLocal: (regionalId) => api.get(`/${regionalId}/local`),
    create: (data) => api.post('/', data),
    update: (id, data) => api.put(`/${id}`, data),
    delete: (id) => api.delete(`/${id}`),
    addMember: (id, userId, role) => api.post(`/${id}/members`, { userId, role }),
    removeMember: (id, userId) => api.delete(`/${id}/members/${userId}`)
};
