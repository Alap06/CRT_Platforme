import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Shield, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Logo from '../images/logo-croissant-rouge.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, error, user, clearErrors } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && user) {
      const routes = { admin: '/AdminDashboard', benevole: '/VolunteerDashboard', partenaire: '/PartnerDashboard', donateur: '/DonorDashboard' };
      navigate(routes[user.role] || '/');
    }
    clearErrors && clearErrors();
  }, [isAuthenticated, user, navigate, clearErrors]);

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await login(formData.email, formData.password, formData.rememberMe);
      } catch (err) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-red-100 rounded-full opacity-50 blur-3xl" />
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }} transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-100 rounded-full opacity-50 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-md">
        {/* Logo & Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-center mb-8">
          <Link to="/" className="inline-block">
            <motion.img whileHover={{ scale: 1.05 }} src={Logo} alt="Croissant Rouge Tunisien"
              className="mx-auto h-20 w-20 object-contain drop-shadow-md" />
          </Link>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Bienvenue</h2>
          <p className="mt-2 text-gray-600">Connectez-vous à votre compte CRT Tozeur</p>
        </motion.div>

        {/* Login Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            <Shield size={16} />
            <span>Connexion sécurisée SSL</span>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={onChange}
                  placeholder="exemple@email.com"
                  className={`block w-full pl-10 pr-4 py-3 border ${formErrors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-red-500 focus:border-red-500'} rounded-xl bg-gray-50/50 placeholder-gray-400 transition-all focus:bg-white`} />
              </div>
              {formErrors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{formErrors.email}</motion.p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                  value={formData.password} onChange={onChange} placeholder="••••••••"
                  className={`block w-full pl-10 pr-12 py-3 border ${formErrors.password ? 'border-red-300' : 'border-gray-200'} rounded-xl bg-gray-50/50 placeholder-gray-400 transition-all focus:bg-white focus:ring-red-500 focus:border-red-500`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.password && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{formErrors.password}</motion.p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={onChange}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                <span className="text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-red-600 hover:text-red-500">Mot de passe oublié ?</Link>
            </div>

            {/* Submit Button */}
            <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}>
              {isSubmitting ? (<><Loader2 className="animate-spin" size={20} />Connexion en cours...</>) : (<>Se connecter<ArrowRight size={18} /></>)}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-4 text-sm text-gray-500">Nouveau membre ?</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Register Link */}
          <Link to="/register">
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full py-3 px-4 border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all">
              Créer un compte
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Croissant Rouge Tunisien - Tozeur
        </p>
      </motion.div>
    </div>
  );
};

export default Login;