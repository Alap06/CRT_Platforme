import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HandHeart, Calendar, CreditCard, Gift } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from '../DashboardSidebar';
import donationApi from '../../api/donationApi';
import { SkeletonDashboard } from '../UI/Skeleton';

const DonationCard = ({ donation, delay = 0 }) => {
    const date = new Date(donation.date);
    const typeColors = { money: 'green', goods: 'blue', blood: 'red' };
    const color = typeColors[donation.type] || 'gray';
    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} className="flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-gray-50">
            <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center`}>
                {donation.type === 'money' ? <CreditCard className={`text-${color}-600`} size={24} /> : <Gift className={`text-${color}-600`} size={24} />}
            </div>
            <div className="flex-1">
                <p className="font-medium text-gray-900">{donation.type === 'money' ? `${donation.amount} TND` : donation.type}</p>
                <p className="text-sm text-gray-500">{date.toLocaleDateString('fr-FR')}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${donation.status === 'received' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {donation.status === 'received' ? 'Reçu' : 'En attente'}
            </span>
        </motion.div>
    );
};

export const DonorDashboard = () => {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [summary, setSummary] = useState({ count: 0, totalDonated: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await donationApi.getMyDonations();
                setDonations(res.data.data || []);
                setSummary(res.data.summary || { count: 0, totalDonated: 0 });
            } catch (err) {
                setDonations([{ _id: '1', type: 'money', amount: 500, date: new Date(), status: 'received' }]);
                setSummary({ count: 1, totalDonated: 500 });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex min-h-screen bg-gray-50"><DashboardSidebar role="donateur" /><main className="flex-1 p-6"><SkeletonDashboard /></main></div>;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar role="donateur" />
            <main className="flex-1 p-6 lg:p-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Merci, {user?.firstName || 'Donateur'} 💖</h1>
                    <p className="text-gray-600 mt-2">Votre générosité fait la différence</p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white">
                        <p className="text-red-100 text-sm">Total donné</p><p className="text-3xl font-bold mt-1">{summary.totalDonated.toLocaleString()} TND</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                        <p className="text-blue-100 text-sm">Nombre de dons</p><p className="text-3xl font-bold mt-1">{summary.count}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
                        <p className="text-green-100 text-sm">Impact estimé</p><p className="text-3xl font-bold mt-1">{Math.round(summary.totalDonated / 50)} familles</p>
                    </motion.div>
                </div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><HandHeart className="text-red-500" size={20} />Faire un don</h2>
                    <div className="flex flex-wrap gap-3">
                        {[50, 100, 200, 500].map(amount => <button key={amount} className="px-6 py-3 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium">{amount} TND</button>)}
                        <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Autre montant</button>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="p-6 border-b"><h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Calendar className="text-blue-500" size={20} />Historique des dons</h2></div>
                    <div className="divide-y">{donations.length > 0 ? donations.map((d, i) => <DonationCard key={d._id} donation={d} delay={0.1 * i} />) : <div className="p-8 text-center text-gray-500">Aucun don enregistré</div>}</div>
                </motion.div>
            </main>
        </div>
    );
};

export default DonorDashboard;
