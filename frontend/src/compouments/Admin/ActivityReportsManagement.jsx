import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Plus, Search, Edit2, Trash2, X, Upload, Eye, Check, XCircle,
    Calendar, Users, Package, ChevronLeft, ChevronRight, Clock, Send, CheckCircle
} from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import reportApi from '../../api/reportApi';
import activitiesApi from '../../api/activitiesApi';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

const statusConfig = {
    draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700', icon: FileText },
    submitted: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    approved: { label: 'Approuvé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-700', icon: XCircle }
};

const ActivityReportsManagement = () => {
    const [reports, setReports] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [viewingReport, setViewingReport] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        activity: '', title: '', summary: '', description: '',
        beneficiaries: { count: 0, description: '' },
        volunteers: { count: 0, hours: 0 },
        budget: { planned: 0, actual: 0 },
        challenges: '', recommendations: '', images: []
    });
    const [previewImages, setPreviewImages] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchReports();
        fetchActivities();
        fetchStatistics();
    }, [pagination.page, statusFilter, searchTerm]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const params = { page: pagination.page, limit: pagination.limit };
            if (searchTerm) params.search = searchTerm;
            if (statusFilter) params.status = statusFilter;

            const response = await reportApi.getReports(params);
            let reportsData = response.data?.data || response.data?.reports || response.data || [];
            if (!Array.isArray(reportsData)) reportsData = [];
            setReports(reportsData);
            if (response.data?.pagination) {
                setPagination(prev => ({ ...prev, ...response.data.pagination }));
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await activitiesApi.getAllActivities({ status: 'completed', limit: 100 });
            let activitiesData = response.data?.data || response.data?.activities || response.data || [];
            if (!Array.isArray(activitiesData)) activitiesData = [];
            setActivities(activitiesData);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setActivities([]);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await reportApi.getStatistics();
            setStatistics(response.data?.data || response.data || null);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setStatistics(null);
        }
    };

    const handleOpenModal = (report = null) => {
        if (report) {
            setEditingReport(report);
            setFormData({
                activity: report.activity?._id || '',
                title: report.title || '',
                summary: report.summary || '',
                description: report.description || '',
                beneficiaries: report.beneficiaries || { count: 0, description: '' },
                volunteers: report.volunteers || { count: 0, hours: 0 },
                budget: report.budget || { planned: 0, actual: 0 },
                challenges: report.challenges || '',
                recommendations: report.recommendations || '',
                images: []
            });
            setPreviewImages(report.images?.map(img => ({
                url: img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`,
                isExisting: true,
                _id: img._id
            })) || []);
        } else {
            setEditingReport(null);
            setFormData({
                activity: '', title: '', summary: '', description: '',
                beneficiaries: { count: 0, description: '' },
                volunteers: { count: 0, hours: 0 },
                budget: { planned: 0, actual: 0 },
                challenges: '', recommendations: '', images: []
            });
            setPreviewImages([]);
        }
        setShowModal(true);
    };

    const handleViewReport = (report) => {
        setViewingReport(report);
        setShowViewModal(true);
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
        if (image.isExisting && editingReport) {
            try {
                await reportApi.deleteImage(editingReport._id, image._id);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e, submit = false) => {
        e.preventDefault();
        setSaving(true);
        try {
            let report;
            if (editingReport) {
                report = await reportApi.updateReport(editingReport._id, formData);
            } else {
                report = await reportApi.createReport(formData);
            }

            if (submit && report.data.data?._id) {
                await reportApi.submitReport(report.data.data._id);
            }

            setShowModal(false);
            fetchReports();
            fetchStatistics();
        } catch (error) {
            console.error('Error saving report:', error);
            alert(error.response?.data?.message || 'Erreur');
        } finally {
            setSaving(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await reportApi.approveReport(id);
            fetchReports();
            fetchStatistics();
        } catch (error) {
            console.error('Error approving:', error);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir rejeter ce rapport ?')) return;
        try {
            await reportApi.rejectReport(id);
            fetchReports();
            fetchStatistics();
        } catch (error) {
            console.error('Error rejecting:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) return;
        try {
            await reportApi.deleteReport(id);
            fetchReports();
            fetchStatistics();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar role="admin" />
            <main className="flex-1 p-6 lg:p-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FileText className="text-red-500" /> Rapports d'Activité
                            </h1>
                            <p className="text-gray-600 mt-1">Gérez les rapports post-activité</p>
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                            <Plus size={20} /> Nouveau Rapport
                        </motion.button>
                    </div>
                </motion.div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total', value: statistics?.total || 0, color: 'blue' },
                        { label: 'Brouillons', value: statistics?.draft || 0, color: 'gray' },
                        { label: 'En attente', value: statistics?.pending || 0, color: 'yellow' },
                        { label: 'Approuvés', value: statistics?.approved || 0, color: 'green' }
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input type="text" placeholder="Rechercher un rapport..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                        </div>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                            <option value="">Tous statuts</option>
                            <option value="draft">Brouillon</option>
                            <option value="submitted">En attente</option>
                            <option value="approved">Approuvé</option>
                            <option value="rejected">Rejeté</option>
                        </select>
                    </div>
                </motion.div>

                {/* Reports List */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Rapport</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Activité</th>
                                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Bénéficiaires</th>
                                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Statut</th>
                                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16 mx-auto" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20 mx-auto" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24 mx-auto" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24 ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : reports.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12">
                                            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                                            <p className="text-gray-500">Aucun rapport trouvé</p>
                                        </td>
                                    </tr>
                                ) : (
                                    reports.map((report) => {
                                        const status = statusConfig[report.status];
                                        const StatusIcon = status.icon;
                                        return (
                                            <tr key={report._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {report.images?.[0] ? (
                                                            <img src={report.images[0].url.startsWith('http') ? report.images[0].url : `${API_BASE}${report.images[0].url}`}
                                                                alt="" className="w-12 h-12 rounded-lg object-cover" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                <FileText size={24} className="text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-900 line-clamp-1">{report.title}</p>
                                                            <p className="text-xs text-gray-500 line-clamp-1">{report.summary}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-600">{report.activity?.title || '-'}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Users size={14} className="text-gray-400" />
                                                        <span className="text-sm font-medium">{report.beneficiaries?.count || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                        <StatusIcon size={12} /> {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm text-gray-500">
                                                    {new Date(report.createdAt).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button onClick={() => handleViewReport(report)}
                                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Voir">
                                                            <Eye size={18} />
                                                        </button>
                                                        {report.status === 'submitted' && (
                                                            <>
                                                                <button onClick={() => handleApprove(report._id)}
                                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approuver">
                                                                    <Check size={18} />
                                                                </button>
                                                                <button onClick={() => handleReject(report._id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Rejeter">
                                                                    <XCircle size={18} />
                                                                </button>
                                                            </>
                                                        )}
                                                        {(report.status === 'draft' || report.status === 'rejected') && (
                                                            <button onClick={() => handleOpenModal(report)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Modifier">
                                                                <Edit2 size={18} />
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleDelete(report._id)}
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
                            <span className="text-sm text-gray-500">{pagination.total} rapport(s)</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50">
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="px-4 py-2 text-sm">Page {pagination.page} / {pagination.pages}</span>
                                <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Create/Edit Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowModal(false)}>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
                                onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {editingReport ? 'Modifier le rapport' : 'Nouveau rapport'}
                                    </h2>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                                    <div className="space-y-4">
                                        {!editingReport && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Activité *</label>
                                                <select required value={formData.activity}
                                                    onChange={(e) => setFormData(p => ({ ...p, activity: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                                                    <option value="">Sélectionner une activité</option>
                                                    {activities.map(a => (
                                                        <option key={a._id} value={a._id}>{a.title} - {new Date(a.date).toLocaleDateString('fr-FR')}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre du rapport *</label>
                                            <input type="text" required value={formData.title}
                                                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Résumé *</label>
                                            <textarea required value={formData.summary} rows={2}
                                                onChange={(e) => setFormData(p => ({ ...p, summary: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                                maxLength={500} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description détaillée *</label>
                                            <textarea required value={formData.description} rows={4}
                                                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Users size={18} className="text-blue-500" />
                                                    <span className="font-medium text-gray-700">Bénéficiaires</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <input type="number" min="0" placeholder="Nombre"
                                                        value={formData.beneficiaries.count}
                                                        onChange={(e) => setFormData(p => ({ ...p, beneficiaries: { ...p.beneficiaries, count: parseInt(e.target.value) || 0 } }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                                    <input type="text" placeholder="Description"
                                                        value={formData.beneficiaries.description}
                                                        onChange={(e) => setFormData(p => ({ ...p, beneficiaries: { ...p.beneficiaries, description: e.target.value } }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Users size={18} className="text-green-500" />
                                                    <span className="font-medium text-gray-700">Volontaires</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input type="number" min="0" placeholder="Nombre"
                                                        value={formData.volunteers.count}
                                                        onChange={(e) => setFormData(p => ({ ...p, volunteers: { ...p.volunteers, count: parseInt(e.target.value) || 0 } }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                                    <input type="number" min="0" placeholder="Heures"
                                                        value={formData.volunteers.hours}
                                                        onChange={(e) => setFormData(p => ({ ...p, volunteers: { ...p.volunteers, hours: parseInt(e.target.value) || 0 } }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Défis rencontrés</label>
                                            <textarea value={formData.challenges} rows={2}
                                                onChange={(e) => setFormData(p => ({ ...p, challenges: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Recommandations</label>
                                            <textarea value={formData.recommendations} rows={2}
                                                onChange={(e) => setFormData(p => ({ ...p, recommendations: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                                        </div>

                                        {/* Images */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Photos de l'activité</label>
                                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-red-300"
                                                onClick={() => fileInputRef.current?.click()}>
                                                <Upload size={24} className="mx-auto text-gray-400 mb-1" />
                                                <p className="text-sm text-gray-600">Ajouter des photos</p>
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
                                            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            Enregistrer brouillon
                                        </button>
                                        <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={saving}
                                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg">
                                            <Send size={18} /> Soumettre
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* View Modal */}
                <AnimatePresence>
                    {showViewModal && viewingReport && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowViewModal(false)}>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
                                onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-xl font-semibold text-gray-900">{viewingReport.title}</h2>
                                    <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                                    {/* Images Gallery */}
                                    {viewingReport.images?.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mb-6">
                                            {viewingReport.images.map((img, i) => (
                                                <img key={i}
                                                    src={img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`}
                                                    alt="" className="rounded-lg object-cover aspect-video" />
                                            ))}
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-medium text-gray-700 mb-2">Résumé</h3>
                                            <p className="text-gray-600">{viewingReport.summary}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                                            <p className="text-gray-600 whitespace-pre-wrap">{viewingReport.description}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <Users className="text-blue-500 mb-2" />
                                                <p className="text-2xl font-bold text-blue-700">{viewingReport.beneficiaries?.count || 0}</p>
                                                <p className="text-sm text-blue-600">Bénéficiaires</p>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-lg">
                                                <Users className="text-green-500 mb-2" />
                                                <p className="text-2xl font-bold text-green-700">{viewingReport.volunteers?.count || 0}</p>
                                                <p className="text-sm text-green-600">Volontaires ({viewingReport.volunteers?.hours || 0}h)</p>
                                            </div>
                                        </div>
                                        {viewingReport.challenges && (
                                            <div>
                                                <h3 className="font-medium text-gray-700 mb-2">Défis rencontrés</h3>
                                                <p className="text-gray-600">{viewingReport.challenges}</p>
                                            </div>
                                        )}
                                        {viewingReport.recommendations && (
                                            <div>
                                                <h3 className="font-medium text-gray-700 mb-2">Recommandations</h3>
                                                <p className="text-gray-600">{viewingReport.recommendations}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ActivityReportsManagement;
