import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Users, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from '../DashboardSidebar';
import projectApi from '../../api/projectApi';
import { SkeletonDashboard } from '../UI/Skeleton';

const ProjectCard = ({ project, delay = 0 }) => {
    const statusLabels = { active: 'En cours', completed: 'Terminé', planned: 'Planifié' };
    const statusColors = { active: 'green', completed: 'blue', planned: 'yellow' };
    const color = statusColors[project.status] || 'gray';

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700`}>{statusLabels[project.status] || project.status}</span>
                    <span className="text-sm text-gray-500">{project.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.shortDescription || project.description}</p>
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Progression</span><span className="font-medium text-gray-900">{project.progress || 0}%</span></div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress || 0}%` }} transition={{ duration: 1, delay: delay + 0.3 }}
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" />
                    </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1"><Users size={16} /><span>{project.teamCount || 0} membres</span></div>
                    <div className="flex items-center gap-1"><Calendar size={16} /><span>{project.daysRemaining || '?'} jours</span></div>
                </div>
            </div>
        </motion.div>
    );
};

export const PartnerDashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await projectApi.getMyProjects();
                setProjects(res.data.data || []);
            } catch (err) {
                setProjects([
                    { _id: '1', title: 'Aide aux familles', category: 'social', status: 'active', progress: 65, teamCount: 8, daysRemaining: 45, description: 'Distribution de paniers alimentaires' },
                    { _id: '2', title: 'Campagne vaccination', category: 'health', status: 'planned', progress: 20, teamCount: 12, daysRemaining: 90, description: 'Vaccination des enfants' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = { total: projects.length, active: projects.filter(p => p.status === 'active').length, completed: projects.filter(p => p.status === 'completed').length };

    if (loading) return <div className="flex min-h-screen bg-gray-50"><DashboardSidebar role="partenaire" /><main className="flex-1 p-6"><SkeletonDashboard /></main></div>;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar role="partenaire" />
            <main className="flex-1 p-6 lg:p-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bonjour, {user?.firstName || 'Partenaire'} 🤝</h1>
                    <p className="text-gray-600 mt-2">Suivez l'avancement de nos projets communs</p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                        <p className="text-purple-100 text-sm">Total Projets</p><p className="text-3xl font-bold mt-1">{stats.total}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
                        <p className="text-green-100 text-sm">En cours</p><p className="text-3xl font-bold mt-1">{stats.active}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                        <p className="text-blue-100 text-sm">Terminés</p><p className="text-3xl font-bold mt-1">{stats.completed}</p>
                    </motion.div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"><FolderKanban className="text-purple-500" size={24} />Nos Projets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{projects.map((p, i) => <ProjectCard key={p._id} project={p} delay={0.1 * i} />)}</div>
            </main>
        </div>
    );
};

export default PartnerDashboard;
