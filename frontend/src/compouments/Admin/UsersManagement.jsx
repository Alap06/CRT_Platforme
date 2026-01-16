import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, UserPlus, Check, X, MoreVertical, Mail, Phone, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import { SkeletonTable } from '../UI/Skeleton';
import adminApi from '../../api/adminApi';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminApi.getAllUsers();
            // Ensure we always get an array
            let userData = response.data?.data || response.data?.users || response.data || [];
            if (!Array.isArray(userData)) {
                userData = [];
            }
            setUsers(userData);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Impossible de charger les utilisateurs');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleApprove = async (userId) => {
        try {
            await adminApi.updateUserStatus(userId, 'approved');
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: 'approved' } : u));
        } catch (err) {
            console.error('Error approving user:', err);
        }
    };

    const handleReject = async (userId) => {
        try {
            await adminApi.updateUserStatus(userId, 'suspended');
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: 'suspended' } : u));
        } catch (err) {
            console.error('Error rejecting user:', err);
        }
    };

    // Safety check: ensure users is always an array
    const safeUsers = Array.isArray(users) ? users : [];

    const filteredUsers = safeUsers.filter(user => {
        const matchesSearch = `${user.firstName || ''} ${user.lastName || ''} ${user.email || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });


    const getRoleBadge = (role) => {
        const colors = { admin: 'bg-purple-100 text-purple-700', benevole: 'bg-blue-100 text-blue-700', donateur: 'bg-green-100 text-green-700', partenaire: 'bg-red-100 text-red-700' };
        const labels = { admin: 'Admin', benevole: 'Bénévole', donateur: 'Donateur', partenaire: 'Partenaire' };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[role] || 'bg-gray-100 text-gray-700'}`}>{labels[role] || role}</span>;
    };

    const getStatusBadge = (status) => {
        const colors = { approved: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', suspended: 'bg-red-100 text-red-700', banned: 'bg-gray-100 text-gray-700' };
        const labels = { approved: 'Approuvé', pending: 'En attente', suspended: 'Suspendu', banned: 'Banni' };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{labels[status] || status}</span>;
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar role="admin" />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Users className="text-red-600" />Gestion des Utilisateurs
                            </h1>
                            <p className="text-gray-600 mt-1">{users.length} utilisateurs au total</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={fetchUsers} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
                                <RefreshCw size={18} />Actualiser
                            </button>
                            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg shadow hover:shadow-lg">
                                <UserPlus size={20} />Ajouter
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
                        <AlertCircle size={20} />{error}
                        <button onClick={fetchUsers} className="ml-auto text-sm underline">Réessayer</button>
                    </div>
                )}

                {/* Filters */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input type="text" placeholder="Rechercher par nom ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500">
                            <option value="all">Tous les rôles</option>
                            <option value="admin">Admin</option>
                            <option value="benevole">Bénévole</option>
                            <option value="donateur">Donateur</option>
                            <option value="partenaire">Partenaire</option>
                        </select>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500">
                            <option value="all">Tous les statuts</option>
                            <option value="approved">Approuvé</option>
                            <option value="pending">En attente</option>
                            <option value="suspended">Suspendu</option>
                        </select>
                    </div>
                </motion.div>

                {/* Users Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? <SkeletonTable /> : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Utilisateur</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Contact</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Rôle</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Statut</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">Inscrit le</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((user, index) => (
                                        <motion.tr key={user._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
                                            className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-medium">
                                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                                                        <p className="text-sm text-gray-500 md:hidden">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-600 flex items-center gap-1"><Mail size={14} />{user.email}</p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1"><Phone size={14} />{user.phone}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                            <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Clock size={14} />{new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {user.status === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleApprove(user._id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approuver"><Check size={18} /></button>
                                                            <button onClick={() => handleReject(user._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Rejeter"><X size={18} /></button>
                                                        </>
                                                    )}
                                                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><MoreVertical size={18} /></button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">Aucun utilisateur trouvé</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default UsersManagement;
