import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Newspaper, Plus, Search, Filter, Edit2, Trash2, Eye, X, Upload, Image as ImageIcon,
    Calendar, Tag, Globe, Send, Save, ChevronLeft, ChevronRight, Clock, Star
} from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import newsApi from '../../api/newsApi';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

const categories = [
    { value: 'news', label: 'Actualité', color: 'bg-blue-100 text-blue-700' },
    { value: 'event', label: 'Événement', color: 'bg-green-100 text-green-700' },
    { value: 'announcement', label: 'Annonce', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'press', label: 'Presse', color: 'bg-purple-100 text-purple-700' },
    { value: 'success_story', label: 'Success Story', color: 'bg-pink-100 text-pink-700' },
    { value: 'campaign', label: 'Campagne', color: 'bg-red-100 text-red-700' }
];

const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-red-100 text-red-700'
};

const NewsManagement = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '', summary: '', content: '', category: 'news', tags: '',
        featured: false, images: [], existingImages: []
    });
    const [previewImages, setPreviewImages] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchNews(); }, [pagination.page, categoryFilter, statusFilter, searchTerm]);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const params = { page: pagination.page, limit: pagination.limit };
            if (searchTerm) params.search = searchTerm;
            if (categoryFilter) params.category = categoryFilter;
            if (statusFilter) params.status = statusFilter;

            const response = await newsApi.getAll(params);
            let newsData = response.data?.data || response.data?.news || response.data || [];
            if (!Array.isArray(newsData)) newsData = [];
            setNews(newsData);
            if (response.data?.pagination) {
                setPagination(prev => ({ ...prev, ...response.data.pagination }));
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (article = null) => {
        if (article) {
            setEditingArticle(article);
            setFormData({
                title: article.title || '',
                summary: article.summary || '',
                content: article.content || '',
                category: article.category || 'news',
                tags: article.tags?.join(', ') || '',
                featured: article.featured || false,
                images: [],
                existingImages: article.images || []
            });
            setPreviewImages(article.images?.map(img => ({
                url: img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`,
                isExisting: true,
                _id: img._id
            })) || []);
        } else {
            setEditingArticle(null);
            setFormData({ title: '', summary: '', content: '', category: 'news', tags: '', featured: false, images: [], existingImages: [] });
            setPreviewImages([]);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingArticle(null);
        setPreviewImages([]);
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
        if (image.isExisting && editingArticle) {
            try {
                await newsApi.deleteImage(editingArticle._id, image._id);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        if (!image.isExisting) {
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== prev.images.indexOf(image.file))
            }));
        }
    };

    const handleSubmit = async (e, publish = false) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                status: publish ? 'published' : 'draft'
            };

            if (editingArticle) {
                await newsApi.update(editingArticle._id, data);
            } else {
                await newsApi.create(data);
            }
            handleCloseModal();
            fetchNews();
        } catch (error) {
            console.error('Error saving article:', error);
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async (id) => {
        try {
            await newsApi.publish(id);
            fetchNews();
        } catch (error) {
            console.error('Error publishing:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
        try {
            await newsApi.delete(id);
            fetchNews();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const getCategoryInfo = (cat) => categories.find(c => c.value === cat) || categories[0];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar role="admin" />
            <main className="flex-1 p-6 lg:p-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Newspaper className="text-red-500" /> Gestion des Actualités
                            </h1>
                            <p className="text-gray-600 mt-1">Créez et gérez les articles et actualités</p>
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                            <Plus size={20} /> Nouvel Article
                        </motion.button>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input type="text" placeholder="Rechercher un article..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                        </div>
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                            <option value="">Toutes catégories</option>
                            {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                        </select>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                            <option value="">Tous statuts</option>
                            <option value="draft">Brouillon</option>
                            <option value="published">Publié</option>
                            <option value="archived">Archivé</option>
                        </select>
                    </div>
                </motion.div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                                </div>
                            </div>
                        ))
                    ) : news.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Aucun article trouvé</p>
                        </div>
                    ) : (
                        news.map((article, index) => (
                            <motion.div key={article._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Image */}
                                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                                    {article.images?.[0] ? (
                                        <img src={article.images[0].url.startsWith('http') ? article.images[0].url : `${API_BASE}${article.images[0].url}`}
                                            alt={article.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <ImageIcon size={48} className="text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryInfo(article.category).color}`}>
                                            {getCategoryInfo(article.category).label}
                                        </span>
                                        {article.featured && (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
                                                <Star size={12} /> À la une
                                            </span>
                                        )}
                                    </div>
                                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${statusColors[article.status]}`}>
                                        {article.status === 'draft' ? 'Brouillon' : article.status === 'published' ? 'Publié' : 'Archivé'}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{article.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{article.summary}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye size={14} /> {article.views || 0} vues
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenModal(article)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(article._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    {article.status === 'draft' && (
                                        <button onClick={() => handlePublish(article._id)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                                            <Send size={14} /> Publier
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
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
                )}

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={handleCloseModal}>
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                                onClick={(e) => e.stopPropagation()}>
                                {/* Modal Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
                                    </h2>
                                    <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                                                <input type="text" required value={formData.title}
                                                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                                    placeholder="Titre de l'article" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
                                                <textarea value={formData.summary} rows={2}
                                                    onChange={(e) => setFormData(p => ({ ...p, summary: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                                    placeholder="Résumé court de l'article" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label>
                                                <textarea required value={formData.content} rows={8}
                                                    onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                                    placeholder="Contenu de l'article..." />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                                    <select value={formData.category}
                                                        onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                                                        {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                                    <input type="text" value={formData.tags}
                                                        onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))}
                                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                                        placeholder="tag1, tag2, tag3" />
                                                </div>
                                            </div>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={formData.featured}
                                                    onChange={(e) => setFormData(p => ({ ...p, featured: e.target.checked }))}
                                                    className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500" />
                                                <span className="text-sm text-gray-700 flex items-center gap-2">
                                                    <Star size={16} className="text-yellow-500" /> Mettre à la une
                                                </span>
                                            </label>
                                        </div>

                                        {/* Right Column - Images */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">Images</label>
                                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-red-300 transition-colors"
                                                onClick={() => fileInputRef.current?.click()}>
                                                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-600">Cliquez pour ajouter des images</p>
                                                <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WEBP - Max 10MB</p>
                                                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
                                                    onChange={handleImageSelect} />
                                            </div>

                                            {previewImages.length > 0 && (
                                                <div className="grid grid-cols-3 gap-3 mt-4">
                                                    {previewImages.map((img, index) => (
                                                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                            <button type="button" onClick={() => handleRemoveImage(index)}
                                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <X size={14} />
                                                            </button>
                                                            {index === 0 && (
                                                                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded">
                                                                    Image principale
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </form>

                                {/* Modal Footer */}
                                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                                    <button type="button" onClick={handleCloseModal}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                        Annuler
                                    </button>
                                    <button type="button" onClick={(e) => handleSubmit(e, false)} disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Save size={18} /> Brouillon
                                    </button>
                                    <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={saving}
                                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all">
                                        <Send size={18} /> Publier
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default NewsManagement;
