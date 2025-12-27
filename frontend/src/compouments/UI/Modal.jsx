import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true, closeOnBackdrop = true }) => {
    const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

    React.useEffect(() => {
        const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) { document.addEventListener('keydown', handleEscape); document.body.style.overflow = 'hidden'; }
        return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = 'unset'; };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeOnBackdrop ? onClose : undefined} />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        className={`relative bg-white rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden`}>
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
                                {showCloseButton && <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>}
                            </div>
                        )}
                        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

Modal.Body = ({ children, className = '' }) => <div className={`px-6 py-4 ${className}`}>{children}</div>;
Modal.Footer = ({ children, className = '' }) => <div className={`px-6 py-4 border-t border-gray-100 flex justify-end gap-3 ${className}`}>{children}</div>;

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title = 'Confirmation', message = 'Êtes-vous sûr?', confirmText = 'Confirmer', cancelText = 'Annuler', variant = 'danger' }) => {
    const variants = { danger: 'bg-red-600 hover:bg-red-700', warning: 'bg-yellow-500 hover:bg-yellow-600', info: 'bg-blue-600 hover:bg-blue-700' };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <Modal.Body><p className="text-gray-600">{message}</p></Modal.Body>
            <Modal.Footer>
                <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">{cancelText}</button>
                <button onClick={() => { onConfirm(); onClose(); }} className={`px-4 py-2 text-white rounded-lg ${variants[variant]}`}>{confirmText}</button>
            </Modal.Footer>
        </Modal>
    );
};

export default Modal;
