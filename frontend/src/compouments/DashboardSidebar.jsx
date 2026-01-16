import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Calendar, HandHeart, FolderKanban, Building2, Newspaper, Mail, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, Menu, X, Package, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../images/logo-croissant-rouge.png';

const menuItems = {
    admin: [
        { icon: LayoutDashboard, label: 'Tableau de bord', path: '/AdminDashboard' },
        { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
        { icon: Calendar, label: 'Activités', path: '/admin/activities' },
        { icon: FileText, label: 'Rapports', path: '/admin/reports' },
        { icon: Package, label: 'Ressources', path: '/admin/resources' },
        { icon: HandHeart, label: 'Donations', path: '/admin/donations' },
        { icon: FolderKanban, label: 'Projets', path: '/admin/projects' },
        { icon: Building2, label: 'Comités', path: '/admin/committees' },
        { icon: Newspaper, label: 'Actualités', path: '/admin/news' },
        { icon: Mail, label: 'Messages', path: '/admin/contacts' },
        { icon: BarChart3, label: 'Statistiques', path: '/stat' },
        { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
    ],

    benevole: [
        { icon: LayoutDashboard, label: 'Tableau de bord', path: '/VolunteerDashboard' },
        { icon: Calendar, label: 'Mes Activités', path: '/volunteer/activities' },
        { icon: FolderKanban, label: 'Projets', path: '/volunteer/projects' },
        { icon: Settings, label: 'Mon Profil', path: '/volunteer/profile' },
    ],
    donateur: [
        { icon: LayoutDashboard, label: 'Tableau de bord', path: '/DonorDashboard' },
        { icon: HandHeart, label: 'Mes Donations', path: '/donor/donations' },
        { icon: FolderKanban, label: 'Projets', path: '/donor/projects' },
        { icon: Settings, label: 'Mon Profil', path: '/donor/profile' },
    ],
    partenaire: [
        { icon: LayoutDashboard, label: 'Tableau de bord', path: '/PartnerDashboard' },
        { icon: FolderKanban, label: 'Nos Projets', path: '/partner/projects' },
        { icon: Calendar, label: 'Activités', path: '/partner/activities' },
        { icon: Settings, label: 'Mon Profil', path: '/partner/profile' },
    ]
};

const DashboardSidebar = ({ role = 'admin' }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const items = menuItems[role] || menuItems.benevole;
    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <>
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-lg">
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <AnimatePresence>{isMobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}</AnimatePresence>
            <motion.aside initial={false} animate={{ width: isCollapsed ? 80 : 260 }} transition={{ duration: 0.3 }}
                className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={Logo} alt="CRT" className="w-10 h-10 object-contain" />
                        {!isCollapsed && <span className="font-bold text-gray-800">CRT Tozeur</span>}
                    </Link>
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100">
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
                <div className={`p-4 border-b border-gray-100 ${isCollapsed ? 'px-2' : ''}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold">
                            {user?.firstName?.[0] || 'U'}
                        </div>
                        {!isCollapsed && <div><p className="font-medium text-gray-800 truncate">{user?.firstName || 'Utilisateur'}</p><p className="text-xs text-gray-500 capitalize">{role}</p></div>}
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <ul className="space-y-1">
                        {items.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <motion.li key={item.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                                    <Link to={item.path} onClick={() => setIsMobileOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'} ${isCollapsed ? 'justify-center' : ''}`}>
                                        <Icon size={20} className={isActive ? 'text-red-600' : ''} />
                                        {!isCollapsed && <span className="font-medium">{item.label}</span>}
                                    </Link>
                                </motion.li>
                            );
                        })}
                    </ul>
                </nav>
                <div className="p-3 border-t border-gray-100">
                    <button onClick={handleLogout} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 ${isCollapsed ? 'justify-center' : ''}`}>
                        <LogOut size={20} />{!isCollapsed && <span className="font-medium">Déconnexion</span>}
                    </button>
                </div>
            </motion.aside>
            <div className={`hidden lg:block ${isCollapsed ? 'w-20' : 'w-[260px]'} transition-all duration-300`} />
        </>
    );
};

export default DashboardSidebar;
