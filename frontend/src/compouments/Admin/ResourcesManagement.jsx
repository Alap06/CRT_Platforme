import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Plus, Search, Edit2, Trash2, X, Upload, AlertTriangle, TrendingUp, TrendingDown,
    ArrowUpCircle, ArrowDownCircle, ChevronLeft, ChevronRight, Filter, BarChart3
} from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import resourceApi from '../../api/resourceApi';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

const resourceTypes = [
    { value: 'medical', label: 'Médical', icon: '🏥', color: 'bg-blue-100 text-blue-700' },
    { value: 'money', label: 'Argent', icon: '💰', color: 'bg-green-100 text-green-700' },
    { value: 'clothing', label: 'Vêtements', icon: '👕', color: 'bg-purple-100 text-purple-700' },
    { value: 'food', label: 'Nourriture', icon: '🍞', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'vehicle', label: 'Véhicules', icon: '🚗', color: 'bg-red-100 text-red-700' },
    { value: 'equipment', label: 'Équipement', icon: '🔧', color: 'bg-gray-100 text-gray-700' },
    { value: 'other', label: 'Autre', icon: '📦', color: 'bg-pink-100 text-pink-700' }
];

const statusColors = {
    available: 'bg-green-100 text-green-700',
    low: 'bg-yellow-100 text-yellow-700',
    out_of_stock: 'bg-red-100 text-red-700',
    reserved: 'bg-blue-100 text-blue-700'
};

const ResourcesManagement = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showMovementModal, setShowMovementModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [selectedResource, setSelectedResource] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '', type: 'equipment', category: '', description: '', quantity: 0, unit: 'unité',
        alertThreshold: 10, value: '', location: { warehouse: '', shelf: '' }, images: []
    });
    const [movementData, setMovementData] = useState({ type: 'in', quantity: 1, reason: '', notes: '' });
    const [previewImages, setPreviewImages] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchResources();
        fetchStatistics();
        fetchAlerts();
    }, [pagination.page, typeFilter, statusFilter, searchTerm]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = { page: pagination.page, limit: pagination.limit };
            if (searchTerm) params.search = searchTerm;
            if (typeFilter) params.type = typeFilter;
            if (statusFilter) params.status = statusFilter;

            const response = await resourceApi.getResources(params);
            let resourcesData = response.data?.data || response.data?.resources || response.data || [];
            if (!Array.isArray(resourcesData)) resourcesData = [];
            setResources(resourcesData);
            if (response.data?.pagination) {
                setPagination(prev => ({ ...prev, ...response.data.pagination }));
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await resourceApi.getStatistics();
            setStatistics(response.data?.data || response.data || null);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setStatistics(null);
        }
    };

    const fetchAlerts = async () => {
        try {
            const response = await resourceApi.getAlerts();
            let alertsData = response.data?.data || response.data || [];
            if (!Array.isArray(alertsData)) alertsData = [];
            setAlerts(alertsData);
        } catch (error) {
            console.error('Error fetching alerts:', error);
            setAlerts([]);
        }
    };

    const handleOpenModal = (resource = null) => {
        if (resource) {
            setEditingResource(resource);
            setFormData({
                name: resource.name || '',
                type: resource.type || 'equipment',
                category: resource.category || '',
                description: resource.description || '',
                quantity: resource.quantity || 0,
                unit: resource.unit || 'unité',
                alertThreshold: resource.alertThreshold || 10,
                value: resource.value || '',
                location: resource.location || { warehouse: '', shelf: '' },
                images: []
            });
            setPreviewImages(resource.images?.map(img => ({
                url: img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`,
                isExisting: true,
                _id: img._id
            })) || []);
        } else {
            setEditingResource(null);
            setFormData({
                name: '', type: 'equipment', category: '', description: '', quantity: 0, unit: 'unité',
                alertThreshold: 10, value: '', location: { warehouse: '', shelf: '' }, images: []
            });
            setPreviewImages([]);
        }
        setShowModal(true);
    };

    const handleOpenMovementModal = (resource) => {
        setSelectedResource(resource);
        setMovementData({ type: 'in', quantity: 1, reason: '', notes: '' });
        setShowMovementModal(true);
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            file,
            isExisting: false
        }));
        setPreviewImages(prev => [...prev, ...newPreviews]);
        setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    };

    const handleRemoveImage = async (index) => {
        const image = previewImages[index];
        if (image.isExisting && editingResource) {
            try {
                await resourceApi.deleteImage(editingResource._id, image._id);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingResource) {
                await resourceApi.updateResource(editingResource._id, formData);
            } else {
                await resourceApi.createResource(formData);
            }
            setShowModal(false);
            fetchResources();
            fetchStatistics();
        } catch (error) {
            console.error('Error saving resource:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleMovementSubmit = async (e) => {
        e.preventDefault();
        try {
            await resourceApi.addMovement(selectedResource._id, movementData);
            setShowMovementModal(false);
            fetchResources();
            fetchStatistics();
            fetchAlerts();
        } catch (error) {
            console.error('Error adding movement:', error);
            alert(error.response?.data?.message || 'Erreur');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) return;
        try {
            await resourceApi.deleteResource(id);
            fetchResources();
            fetchStatistics();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const getTypeInfo = (type) => resourceTypes.find(t => t.value === type) || resourceTypes[6];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar role="admin" />
            <main className="flex-1 p-6 lg:p-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Package className="text-red-500" /> Gestion des Ressources
                            </h1>
                            <p className="text-gray-600 mt-1">Gérez le stock et les mouvements des ressources</p>
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                            <Plus size={20} /> Nouvelle Ressource
                        </motion.button>
                    </div>
                </motion.div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-blue-100">
                                <Package className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Ressources</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics?.total || 0}</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-yellow-100">
                                <AlertTriangle className="text-yellow-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Stock Faible</p>
                                <p className="text-2xl font-bold text-yellow-600">{statistics?.lowStock || 0}</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-red-100">
                                <TrendingDown className="text-red-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Rupture de Stock</p>
                                <p className="text-2xl font-bold text-red-600">{statistics?.criticalCount || 0}</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-green-100">
                                <BarChart3 className="text-green-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Types</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics?.byType?.length || 0}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Alerts */}
                {alerts.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="text-yellow-600" size={20} />
                            <h3 className="font-semibold text-yellow-800">Alertes de stock ({alerts.length})</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {alerts.slice(0, 5).map(alert => (
                                <span key={alert._id} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                    {getTypeInfo(alert.type).icon} {alert.name}: {alert.quantity} {alert.unit}
                                </span>
                            ))}
                            {alerts.length > 5 && (
                                <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm">
                                    +{alerts.length - 5} autres
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Filters */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input type="text" placeholder="Rechercher une ressource..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                        </div>
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                            <option value="">Tous types</option>
                            {resourceTypes.map(type => <option key={type.value} value={type.value}>{type.icon} {type.label}</option>)}
                        </select>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                            <option value="">Tous statuts</option>
                            <option value="available">Disponible</option>
                            <option value="low">Stock faible</option>
                            <option value="out_of_stock">Rupture</option>
                        </select>
                    </div>
                </motion.div>

                {/* Resources Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Ressource</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Quantité</th>
                                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Seuil</th>
                                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Statut</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16 mx-auto" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12 mx-auto" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20 mx-auto" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24 ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : resources.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12">
                                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                            <p className="text-gray-500">Aucune ressource trouvée</p>
                                        </td>
                                    </tr>
                                ) : (
                                    resources.map((resource) => {
                                        const typeInfo = getTypeInfo(resource.type);
                                        return (
                                            <tr key={resource._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {resource.images?.[0] ? (
                                                            <img src={resource.images[0].url.startsWith('http') ? resource.images[0].url : `${API_BASE}${resource.images[0].url}`}
                                                                alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                                                                {typeInfo.icon}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-900">{resource.name}</p>
                                                            {resource.category && <p className="text-xs text-gray-500">{resource.category}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                                                        {typeInfo.icon} {typeInfo.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`font-semibold ${resource.quantity <= resource.alertThreshold ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {resource.quantity}
                                                    </span>
                                                    <span className="text-gray-500 text-sm ml-1">{resource.unit}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-500">{resource.alertThreshold}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[resource.status]}`}>
                                                        {resource.status === 'available' ? 'Disponible' :
                                                            resource.status === 'low' ? 'Stock faible' :
                                                                resource.status === 'out_of_stock' ? 'Rupture' : 'Réservé'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button onClick={() => handleOpenMovementModal(resource)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Entrée">
                                                            <ArrowUpCircle size={18} />
                                                        </button>
                                                        <button onClick={() => { setMovementData(m => ({ ...m, type: 'out' })); handleOpenMovementModal(resource); }}
                                                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg" title="Sortie">
                                                            <ArrowDownCircle size={18} />
                                                        </button>
                                                        <button onClick={() => handleOpenModal(resource)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Modifier">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button onClick={() => handleDelete(resource._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">
                                {pagination.total} ressource(s) au total
                            </span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 1}
                                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50">
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="px-4 py-2 text-sm text-gray-600">
                                    Page {pagination.page} sur {pagination.pages}
                                </span>
                                <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page === pagination.pages}
                                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Resource Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowModal(false)}>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                                onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {editingResource ? 'Modifier la ressource' : 'Nouvelle ressource'}
                                    </h2>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                                                <input type="text" required value={formData.name}
                                                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                                                <select value={formData.type} onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                                                    {resourceTypes.map(type => <option key={type.value} value={type.value}>{type.icon} {type.label}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea value={formData.description} rows={2}
                                                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
                                                <input type="number" min="0" required value={formData.quantity}
                                                    onChange={(e) => setFormData(p => ({ ...p, quantity: parseInt(e.target.value) || 0 }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
                                                <input type="text" value={formData.unit}
                                                    onChange={(e) => setFormData(p => ({ ...p, unit: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Seuil d'alerte</label>
                                                <input type="number" min="0" value={formData.alertThreshold}
                                                    onChange={(e) => setFormData(p => ({ ...p, alertThreshold: parseInt(e.target.value) || 0 }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Entrepôt</label>
                                                <input type="text" value={formData.location.warehouse}
                                                    onChange={(e) => setFormData(p => ({ ...p, location: { ...p.location, warehouse: e.target.value } }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Étagère/Emplacement</label>
                                                <input type="text" value={formData.location.shelf}
                                                    onChange={(e) => setFormData(p => ({ ...p, location: { ...p.location, shelf: e.target.value } }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                            </div>
                                        </div>

                                        {/* Images */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-red-300"
                                                onClick={() => fileInputRef.current?.click()}>
                                                <Upload size={24} className="mx-auto text-gray-400 mb-1" />
                                                <p className="text-sm text-gray-600">Ajouter des images</p>
                                                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} />
                                            </div>
                                            {previewImages.length > 0 && (
                                                <div className="grid grid-cols-4 gap-2 mt-3">
                                                    {previewImages.map((img, index) => (
                                                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                            <button type="button" onClick={() => handleRemoveImage(index)}
                                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100">
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                        <button type="button" onClick={() => setShowModal(false)}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                            Annuler
                                        </button>
                                        <button type="submit" disabled={saving}
                                            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50">
                                            {saving ? 'Enregistrement...' : 'Enregistrer'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Movement Modal */}
                <AnimatePresence>
                    {showMovementModal && selectedResource && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowMovementModal(false)}>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                                onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Mouvement de stock
                                    </h2>
                                    <button onClick={() => setShowMovementModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleMovementSubmit} className="p-6">
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="font-medium text-gray-900">{selectedResource.name}</p>
                                        <p className="text-sm text-gray-500">Stock actuel: {selectedResource.quantity} {selectedResource.unit}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <button type="button"
                                                className={`flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${movementData.type === 'in' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200'
                                                    }`}
                                                onClick={() => setMovementData(m => ({ ...m, type: 'in' }))}>
                                                <ArrowUpCircle size={20} /> Entrée
                                            </button>
                                            <button type="button"
                                                className={`flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${movementData.type === 'out' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200'
                                                    }`}
                                                onClick={() => setMovementData(m => ({ ...m, type: 'out' }))}>
                                                <ArrowDownCircle size={20} /> Sortie
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
                                            <input type="number" min="1" required value={movementData.quantity}
                                                onChange={(e) => setMovementData(m => ({ ...m, quantity: parseInt(e.target.value) || 1 }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                                            <input type="text" value={movementData.reason}
                                                onChange={(e) => setMovementData(m => ({ ...m, reason: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                                placeholder="Ex: Activité humanitaire, Réapprovisionnement..." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                            <textarea value={movementData.notes} rows={2}
                                                onChange={(e) => setMovementData(m => ({ ...m, notes: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button type="button" onClick={() => setShowMovementModal(false)}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                            Annuler
                                        </button>
                                        <button type="submit"
                                            className={`px-6 py-2 text-white rounded-lg hover:shadow-lg ${movementData.type === 'in'
                                                ? 'bg-gradient-to-r from-green-500 to-green-600'
                                                : 'bg-gradient-to-r from-orange-500 to-orange-600'
                                                }`}>
                                            Confirmer
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ResourcesManagement;
