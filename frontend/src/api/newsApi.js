import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: `${API_URL}/news`, withCredentials: true });
api.interceptors.request.use((c) => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = `Bearer ${t}`; return c; });

export default {
    getAll: (params = {}) => api.get('/', { params }),
    get: (idOrSlug) => api.get(`/${idOrSlug}`),
    getFeatured: (limit = 5) => api.get('/featured', { params: { limit } }),
    getRecent: (limit = 10, category) => api.get('/recent', { params: { limit, category } }),
    create: (data) => api.post('/', data),
    update: (id, data) => api.put(`/${id}`, data),
    delete: (id) => api.delete(`/${id}`),
    publish: (id) => api.patch(`/${id}/publish`)
};
