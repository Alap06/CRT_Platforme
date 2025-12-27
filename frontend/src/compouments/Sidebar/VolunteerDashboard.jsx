import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from '../DashboardSidebar';
import activityApi from '../../api/activityApi';
import { SkeletonDashboard } from '../UI/Skeleton';

const ActivityCard = ({ activity, onRegister, onUnregister, delay = 0 }) => {
    const date = new Date(activity.date);
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${activity.type === 'formation' ? 'bg-blue-100 text-blue-700' : activity.type === 'urgence' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{activity.type}</span>
                    <span className={`px-2 py-1 rounded text-xs ${activity.status === 'planned' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{activity.status === 'planned' ? 'Planifié' : 'En cours'}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{activity.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2"><Calendar size={16} /><span>{date.toLocaleDateString('fr-FR')}</span></div>
                    <div className="flex items-center gap-2"><MapPin size={16} /><span>{activity.location?.city || 'Non spécifié'}</span></div>
                    <div className="flex items-center gap-2"><Users size={16} /><span>{activity.volunteersCount || 0} / {activity.maxVolunteers || '∞'}</span></div>
                </div>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t">
                {activity.isUserRegistered ? (
                    <button onClick={() => onUnregister(activity._id)} className="w-full flex items-center justify-center gap-2 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"><XCircle size={18} />Se désinscrire</button>
                ) : (
                    <button onClick={() => onRegister(activity._id)} className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><CheckCircle size={18} />S'inscrire</button>
                )}
            </div>
        </motion.div>
    );
};

export const VolunteerDashboard = () => {
    const { user } = useAuth();
    const [activities, setActivities] = useState([]);
    const [myActivities, setMyActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [upcomingRes, myRes] = await Promise.all([activityApi.getUpcoming(6), activityApi.getMyActivities()]);
                setActivities(upcomingRes.data.data || []);
                setMyActivities(myRes.data.data || []);
            } catch (err) {
                setActivities([{ _id: '1', title: 'Formation Premiers Secours', type: 'formation', status: 'planned', date: new Date(Date.now() + 86400000 * 3), location: { city: 'Tozeur' }, volunteersCount: 12, maxVolunteers: 20 }]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleRegister = async (id) => {
        try { await activityApi.register(id); setActivities(p => p.map(a => a._id === id ? { ...a, isUserRegistered: true, volunteersCount: (a.volunteersCount || 0) + 1 } : a)); } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
    };

    const handleUnregister = async (id) => {
        try { await activityApi.unregister(id); setActivities(p => p.map(a => a._id === id ? { ...a, isUserRegistered: false, volunteersCount: Math.max(0, (a.volunteersCount || 1) - 1) } : a)); } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
    };

    if (loading) return <div className="flex min-h-screen bg-gray-50"><DashboardSidebar role="benevole" /><main className="flex-1 p-6"><SkeletonDashboard /></main></div>;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar role="benevole" />
            <main className="flex-1 p-6 lg:p-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bienvenue, {user?.firstName || 'Bénévole'} 👋</h1>
                    <p className="text-gray-600 mt-2">Découvrez les activités à venir et inscrivez-vous</p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                        <p className="text-blue-100 text-sm">Mes inscriptions</p><p className="text-3xl font-bold mt-1">{myActivities.length}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
                        <p className="text-green-100 text-sm">Activités à venir</p><p className="text-3xl font-bold mt-1">{activities.length}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                        <p className="text-purple-100 text-sm">Heures bénévolat</p><p className="text-3xl font-bold mt-1">24h</p>
                    </motion.div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Activités à venir</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map((activity, i) => <ActivityCard key={activity._id} activity={activity} onRegister={handleRegister} onUnregister={handleUnregister} delay={0.1 * i} />)}
                </div>
            </main>
        </div>
    );
};

export default VolunteerDashboard;
