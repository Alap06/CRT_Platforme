import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, HandHeart, FolderKanban, TrendingUp, Clock, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from '../DashboardSidebar';
import statsApi from '../../api/statsApi';
import { SkeletonDashboard } from '../UI/Skeleton';

const StatCard = ({ title, value, icon: Icon, color, delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center">
            <div className={`p-3 rounded-xl ${color}`}><Icon size={24} className="text-white" /></div>
            <div className="ml-4"><p className="text-sm font-medium text-gray-500">{title}</p><p className="text-2xl font-bold text-gray-900 mt-1">{value}</p></div>
        </div>
    </motion.div>
);

const ActivityItem = ({ user, action, time, delay = 0 }) => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} className="flex items-start p-4 rounded-lg hover:bg-gray-50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-medium text-sm">
            {user.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-900">{user}</p>
            <p className="text-sm text-gray-600">{action}</p>
        </div>
        <span className="text-xs text-gray-400 flex items-center"><Clock size={12} className="mr-1" />{time}</span>
    </motion.div>
);

export const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await statsApi.getDashboard();
                setStats(response.data.data);
            } catch (err) {
                setStats({ users: { total: 358, pending: 12, activeVolunteers: 245 }, activities: { total: 89, upcoming: 8 }, donations: { total: 156, amount: 105420 }, projects: { active: 24 }, contacts: { pending: 5 } });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const recentActivities = [
        { user: 'Sarah Ahmed', action: 'a ajouté un nouveau bénévole', time: 'il y a 2h' },
        { user: 'Mehdi Ben Ali', action: "a mis à jour l'objectif de donation", time: 'il y a 5h' },
        { user: 'Leila Karoui', action: 'a créé un nouveau projet', time: 'il y a 1j' },
    ];

    if (loading) return <div className="flex min-h-screen bg-gray-50"><DashboardSidebar role="admin" /><main className="flex-1 p-6 lg:p-8"><SkeletonDashboard /></main></div>;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar role="admin" />
            <main className="flex-1 p-6 lg:p-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bonjour, {user?.firstName || 'Administrateur'} 👋</h1>
                    <p className="text-gray-600 mt-2">Voici un aperçu des activités du Croissant Rouge Tozeur</p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Bénévoles Actifs" value={stats?.users?.activeVolunteers || 0} icon={Users} color="bg-gradient-to-br from-blue-500 to-blue-600" delay={0.1} />
                    <StatCard title="Activités" value={stats?.activities?.total || 0} icon={Calendar} color="bg-gradient-to-br from-green-500 to-green-600" delay={0.2} />
                    <StatCard title="Donations (TND)" value={(stats?.donations?.amount || 0).toLocaleString()} icon={HandHeart} color="bg-gradient-to-br from-red-500 to-red-600" delay={0.3} />
                    <StatCard title="Projets Actifs" value={stats?.projects?.active || 0} icon={FolderKanban} color="bg-gradient-to-br from-purple-500 to-purple-600" delay={0.4} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Clock size={20} className="text-blue-500" />Activité Récente</h2>
                        </div>
                        <div className="divide-y divide-gray-100">{recentActivities.map((a, i) => <ActivityItem key={i} {...a} delay={0.6 + i * 0.1} />)}</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100"><h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><FileText size={20} className="text-purple-500" />Tâches en Attente</h2></div>
                        <div className="p-4 space-y-3">
                            {[{ title: 'Utilisateurs en attente', count: stats?.users?.pending || 0, type: 'warning' }, { title: 'Messages non lus', count: stats?.contacts?.pending || 0, type: 'info' }, { title: 'Activités à venir', count: stats?.activities?.upcoming || 0, type: 'success' }].map((task, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                                    <div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${task.type === 'warning' ? 'bg-yellow-500' : task.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} /><span className="text-sm text-gray-700">{task.title}</span></div>
                                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${task.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : task.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{task.count}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
