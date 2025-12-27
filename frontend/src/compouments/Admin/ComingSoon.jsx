import React from 'react';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardSidebar from '../DashboardSidebar';

const ComingSoon = ({ title, role = 'admin' }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar role={role} />
            <main className="flex-1 flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}
                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                        <Construction size={48} className="text-red-600" />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{title || 'Page en Construction'}</h1>
                    <p className="text-gray-600 mb-6">Cette fonctionnalité sera bientôt disponible. Nous travaillons activement sur son développement.</p>
                    <Link to={role === 'admin' ? '/AdminDashboard' : role === 'benevole' ? '/VolunteerDashboard' : role === 'donateur' ? '/DonorDashboard' : '/PartnerDashboard'}>
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                            <ArrowLeft size={20} />Retour au tableau de bord
                        </button>
                    </Link>
                </motion.div>
            </main>
        </div>
    );
};

export default ComingSoon;
