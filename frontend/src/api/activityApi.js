import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: `${API_URL}/activities`, withCredentials: true });
api.interceptors.request.use((c) => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = `Bearer ${t}`; return c; });

export default {
    getActivities: (params = {}) => api.get('/', { params }),
    getActivity: (id) => api.get(`/${id}`),
    getUpcoming: (limit = 5) => api.get('/upcoming', { params: { limit } }),
    getMyActivities: () => api.get('/user/my-activities'),
    create: (data) => api.post('/', data),
    update: (id, data) => api.put(`/${id}`, data),
    delete: (id) => api.delete(`/${id}`),
    register: (id) => api.post(`/${id}/register`),
    unregister: (id) => api.delete(`/${id}/register`),
    updateVolunteerStatus: (activityId, volunteerId, status) => api.patch(`/${activityId}/volunteers/${volunteerId}`, { status })
};
