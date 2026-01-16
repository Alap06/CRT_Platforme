import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: `${API_URL}/resources`,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const resourceApi = {
    // Get all resources with filters
    getResources: (params = {}) => api.get('/', { params }),

    // Get single resource
    getResource: (id) => api.get(`/${id}`),

    // Create resource
    createResource: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'images' && data[key]) {
                data[key].forEach(file => formData.append('images', file));
            } else if (key === 'location' && typeof data[key] === 'object') {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key, data[key]);
            }
        });
        return api.post('/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // Update resource
    updateResource: (id, data) => {
        if (data.images && data.images.some(img => img instanceof File)) {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'images') {
                    data[key].forEach(file => {
                        if (file instanceof File) formData.append('images', file);
                    });
                } else if (typeof data[key] === 'object') {
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            });
            return api.put(`/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return api.put(`/${id}`, data);
    },

    // Delete resource
    deleteResource: (id) => api.delete(`/${id}`),

    // Add stock movement
    addMovement: (id, movement) => api.post(`/${id}/movement`, movement),

    // Get low stock alerts
    getAlerts: (committeeId) => api.get('/alerts', { params: { committee: committeeId } }),

    // Get statistics
    getStatistics: (committeeId) => api.get('/statistics', { params: { committee: committeeId } }),

    // Upload images
    uploadImages: (id, files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        return api.post(`/${id}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // Delete image
    deleteImage: (id, imageId) => api.delete(`/${id}/images/${imageId}`)
};

export default resourceApi;
