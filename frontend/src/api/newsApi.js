import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: `${API_URL}/news`,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const newsApi = {
    getAll: (params = {}) => api.get('/', { params }),
    get: (idOrSlug) => api.get(`/${idOrSlug}`),
    getFeatured: (limit = 5) => api.get('/featured', { params: { limit } }),
    getRecent: (limit = 10, category) => api.get('/recent', { params: { limit, category } }),

    // Create with image support
    create: (data) => {
        if (data.images && data.images.length > 0) {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'images') {
                    data[key].forEach(file => formData.append('images', file));
                } else if (key === 'tags' && Array.isArray(data[key])) {
                    data[key].forEach(tag => formData.append('tags', tag));
                } else {
                    formData.append(key, data[key]);
                }
            });
            return api.post('/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return api.post('/', data);
    },

    // Update with image support
    update: (id, data) => {
        if (data.images && data.images.some(img => img instanceof File)) {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'images') {
                    data[key].forEach(file => {
                        if (file instanceof File) formData.append('images', file);
                    });
                } else if (key === 'tags' && Array.isArray(data[key])) {
                    data[key].forEach(tag => formData.append('tags', tag));
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

    delete: (id) => api.delete(`/${id}`),
    publish: (id) => api.patch(`/${id}/publish`),

    // Upload images to existing article
    uploadImages: (id, files, caption) => {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        if (caption) formData.append('caption', caption);
        return api.post(`/${id}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // Delete image
    deleteImage: (id, imageId) => api.delete(`/${id}/images/${imageId}`)
};

export default newsApi;

