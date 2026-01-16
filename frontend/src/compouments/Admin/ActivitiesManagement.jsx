import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, MapPin, Users, Clock, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import activitiesApi from '../../api/activitiesApi';

const ActivitiesManagement = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    const fetchActivities = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await activitiesApi.getAllActivities();
            // Ensure we always get an array
            let activitiesData = response.data?.data || response.data?.activities || response.data || [];
            if (!Array.isArray(activitiesData)) {
                activitiesData = [];
            }
            setActivities(activitiesData);
        } catch (err) {
            console.error('Error fetching activities:', err);
            setError('Impossible de charger les activités');
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchActivities(); }, []);

    const getTypeBadge = (type) => {
        const config = {
            formation: { color: 'bg-blue-100 text-blue-700', label: 'Formation' },
            sante: { color: 'bg-green-100 text-green-700', label: 'Santé' },
            social: { color: 'bg-purple-100 text-purple-700', label: 'Social' },
            sensibilisation: { color: 'bg-yellow-100 text-yellow-700', label: 'Sensibilisation' },
            urgence: { color: 'bg-red-100 text-red-700', label: 'Urgence' },
            collecte: { color: 'bg-pink-100 text-pink-700', label: 'Collecte' }
        };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config[type]?.color || 'bg-gray-100 text-gray-700'}`}>{config[type]?.label || type}</span>;
    };

    const getStatusBadge = (status) => {
        const config = {
            planned: { color: 'bg-blue-100 text-blue-700', label: 'Planifiée' },
            ongoing: { color: 'bg-green-100 text-green-700', label: 'En cours' },
            completed: { color: 'bg-gray-100 text-gray-700', label: 'Terminée' },
            cancelled: { color: 'bg-red-100 text-red-700', label: 'Annulée' }
        };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config[status]?.color || 'bg-gray-100 text-gray-700'}`}>{config[status]?.label || status}</span>;
    };

    // Safety check: ensure activities is always an array
    const safeActivities = Array.isArray(activities) ? activities : [];
    const filteredActivities = filter === 'all' ? safeActivities : safeActivities.filter(a => a.status === filter);


    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar role="admin" />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3"><Calendar className="text-red-600" />Gestion des Activités</h1>
                            <p className="text-gray-600 mt-1">{activities.length} activités au total</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={fetchActivities} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
                                <RefreshCw size={18} />Actualiser
                            </button>
                            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg shadow"><Plus size={20} />Nouvelle Activité</button>
                        </div>
                    </div>
                </motion.div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
                        <AlertCircle size={20} />{error}
                        <button onClick={fetchActivities} className="ml-auto text-sm underline">Réessayer</button>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {['all', 'planned', 'ongoing', 'completed'].map(s => (
                        <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === s ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                            {s === 'all' ? 'Toutes' : s === 'planned' ? 'Planifiées' : s === 'ongoing' ? 'En cours' : 'Terminées'}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-red-600" />
                    </div>
                )}

                {/* Activities Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredActivities.map((activity, i) => (
                            <motion.div key={activity._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div>{getTypeBadge(activity.type)}</div>
                                    {getStatusBadge(activity.status)}
                                </div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-3">{activity.title}</h3>
                                {activity.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{activity.description}</p>}
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p className="flex items-center gap-2"><Clock size={16} />{new Date(activity.date || activity.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                    {activity.location && <p className="flex items-center gap-2"><MapPin size={16} />{activity.location}</p>}
                                    <p className="flex items-center gap-2"><Users size={16} />{activity.volunteers?.length || 0} / {activity.maxVolunteers || 20} bénévoles</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-red-600 h-2 rounded-full transition-all" style={{ width: `${Math.min(((activity.volunteers?.length || 0) / (activity.maxVolunteers || 20)) * 100, 100)}%` }} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredActivities.length === 0 && (
                    <div className="text-center py-20">
                        <Calendar size={60} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">Aucune activité trouvée</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ActivitiesManagement;
