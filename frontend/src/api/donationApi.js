import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: `${API_URL}/donations`, withCredentials: true });
api.interceptors.request.use((c) => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = `Bearer ${t}`; return c; });

export default {
    getAll: (params = {}) => api.get('/', { params }),
    get: (id) => api.get(`/${id}`),
    getRecent: (limit = 10) => api.get('/recent', { params: { limit } }),
    getMyDonations: () => api.get('/my-donations'),
    getStatistics: (params = {}) => api.get('/statistics', { params }),
    create: (data) => api.post('/', data),
    update: (id, data) => api.put(`/${id}`, data),
    delete: (id) => api.delete(`/${id}`),
    confirm: (id) => api.patch(`/${id}/confirm`)
};
