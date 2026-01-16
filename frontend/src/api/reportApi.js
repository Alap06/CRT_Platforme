import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: `${API_URL}/reports`,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const reportApi = {
    // Get all reports with filters
    getReports: (params = {}) => api.get('/', { params }),

    // Get single report
    getReport: (id) => api.get(`/${id}`),

    // Get report by activity
    getByActivity: (activityId) => api.get(`/activity/${activityId}`),

    // Get pending reports
    getPending: (committeeId) => api.get('/pending', { params: { committee: committeeId } }),

    // Get statistics
    getStatistics: () => api.get('/statistics'),

    // Create report
    createReport: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'images' && data[key]) {
                data[key].forEach(file => formData.append('images', file));
            } else if (typeof data[key] === 'object') {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key, data[key]);
            }
        });
        return api.post('/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // Update report
    updateReport: (id, data) => {
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

    // Delete report
    deleteReport: (id) => api.delete(`/${id}`),

    // Submit for approval
    submitReport: (id) => api.patch(`/${id}/submit`),

    // Approve report
    approveReport: (id) => api.patch(`/${id}/approve`),

    // Reject report
    rejectReport: (id) => api.patch(`/${id}/reject`),

    // Upload images
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

export default reportApi;
