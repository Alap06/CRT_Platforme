import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: `${API_URL}/projects`, withCredentials: true });
api.interceptors.request.use((c) => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = `Bearer ${t}`; return c; });

export default {
    getAll: (params = {}) => api.get('/', { params }),
    get: (id) => api.get(`/${id}`),
    getFeatured: (limit = 6) => api.get('/featured', { params: { limit } }),
    getMyProjects: () => api.get('/user/my-projects'),
    create: (data) => api.post('/', data),
    update: (id, data) => api.put(`/${id}`, data),
    delete: (id) => api.delete(`/${id}`),
    addTeamMember: (id, userId, role) => api.post(`/${id}/team`, { userId, role }),
    removeTeamMember: (id, userId) => api.delete(`/${id}/team/${userId}`),
    addUpdate: (id, title, content) => api.post(`/${id}/updates`, { title, content }),
    updateProgress: (id, progress) => api.patch(`/${id}/progress`, { progress })
};
