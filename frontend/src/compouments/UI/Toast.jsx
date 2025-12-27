import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const colors = { success: 'bg-green-50 border-green-200 text-green-800', error: 'bg-red-50 border-red-200 text-red-800', warning: 'bg-yellow-50 border-yellow-200 text-yellow-800', info: 'bg-blue-50 border-blue-200 text-blue-800' };
const icons = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info };

export const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
    const Icon = icons[type];
    React.useEffect(() => { if (duration > 0) { const t = setTimeout(onClose, duration); return () => clearTimeout(t); } }, [duration, onClose]);

    return (
        <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${colors[type]}`}>
            <Icon className="w-5 h-5" />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5"><X className="w-4 h-4" /></button>
        </motion.div>
    );
};

export const ToastContainer = ({ toasts, removeToast }) => (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        <AnimatePresence>{toasts.map((t) => <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />)}</AnimatePresence>
    </div>
);

export const useToast = () => {
    const [toasts, setToasts] = React.useState([]);
    const addToast = React.useCallback((message, type = 'info', duration = 5000) => { const id = Date.now(); setToasts(p => [...p, { id, message, type, duration }]); return id; }, []);
    const removeToast = React.useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);
    return { toasts, addToast, removeToast, success: (m, d) => addToast(m, 'success', d), error: (m, d) => addToast(m, 'error', d), warning: (m, d) => addToast(m, 'warning', d), info: (m, d) => addToast(m, 'info', d) };
};

export default Toast;
