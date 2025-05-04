import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../../public/images/logo-croissant-rouge.png';

// Composant Bouton Connexion
const LoginButton = ({ onClick, className = '' }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null; // Ne pas afficher le bouton Connexion si déjà connecté
  }

  return (
    <Link to="/login">
      <button
        onClick={onClick}
        className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 ${className}`}
      >
        Connexion
      </button>
    </Link>
  );
};

// Composant Bouton Inscription
const RegisterButton = ({ onClick, className = '' }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null; // Ne pas afficher le bouton Inscription si déjà connecté
  }

  return (
    <Link to="/register">
      <button
        onClick={onClick}
        className={`border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${className}`}
      >
        Inscription
      </button>
    </Link>
  );
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLoginClick = () => {
    console.log('Navigation vers login');
  };

  const handleRegisterClick = () => {
    console.log('Navigation vers register');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img 
              src={Logo}
              alt="Logo Croissant Rouge" 
              className="h-10 w-auto"
            />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#accueil" className="text-gray-700 hover:text-red-600 px-3 py-2 font-medium transition-colors duration-200">
              Accueil
            </a>
            <a href="#association" className="text-gray-700 hover:text-red-600 px-3 py-2 font-medium transition-colors duration-200">
              Association
            </a>
            <a href="#activites" className="text-gray-700 hover:text-red-600 px-3 py-2 font-medium transition-colors duration-200">
              Activités
            </a>
            <a href="#news" className="text-gray-700 hover:text-red-600 px-3 py-2 font-medium transition-colors duration-200">
              Actualités
            </a>
            <a href="#contact" className="text-gray-700 hover:text-red-600 px-3 py-2 font-medium transition-colors duration-200">
              Contact
            </a>
            <div className="flex space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 font-medium"
                  >
                    <span>{user?.firstName || 'Utilisateur'}</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-red-50">
                        Tableau de bord
                      </Link>
                      <Link to="/volunteers" className="block px-4 py-2 text-gray-700 hover:bg-red-50">
                        Volontaires
                      </Link>
                      <Link to="/activities" className="block px-4 py-2 text-gray-700 hover:bg-red-50">
                        Activités
                      </Link>
                      {user && user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-red-50">
                          Administration
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <LoginButton 
                    onClick={handleLoginClick}
                    className="min-w-[100px] text-center"
                  />
                  <RegisterButton 
                    onClick={handleRegisterClick}
                    className="min-w-[100px] text-center"
                  />
                </>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-lg">
          <ul className="space-y-2">
            <li>
              <a href="#accueil" className="block text-gray-700 hover:text-red-600 px-3 py-2 font-medium">
                Accueil
              </a>
            </li>
            <li>
              <a href="#association" className="block text-gray-700 hover:text-red-600 px-3 py-2 font-medium">
                Association
              </a>
            </li>
            <li>
              <a href="#activites" className="block text-gray-700 hover:text-red-600 px-3 py-2 font-medium">
                Activités
              </a>
            </li>
            <li>
              <a href="#news" className="block text-gray-700 hover:text-red-600 px-3 py-2 font-medium">
                Actualités
              </a>
            </li>
            <li>
              <a href="#contact" className="block text-gray-700 hover:text-red-600 px-3 py-2 font-medium">
                Contact
              </a>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" className="block text-gray-700 hover:text-red-600 px-3 py-2 font-medium">
                    Tableau de bord
                  </Link>
                </li>
                <li>
                  <Link to="/volunteers" className="block text-gray-700 hover:text-red-600 px-3 py-2 font-medium">
                    Volontaires
                  </Link>
                </li>
                <li>
                  <Link to="/activities" className="block text-gray-700 hover:text-red-600 px-3 py-2 font-medium">
                    Activités
                  </Link>
                </li>
                {user && user.role === 'admin' && (
                  <li>
                    <Link to="/reports" className="block text-gray-700 hover:text-red-600 px-3 py-2 font-medium">
                      Rapports
                    </Link>
                  </li>
                )}
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 font-medium"
                  >
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-700 hover:text-red-600 px-3 py-2 font-medium"
                  >
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-700 hover:text-red-600 px-3 py-2 font-medium"
                  >
                    Inscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;