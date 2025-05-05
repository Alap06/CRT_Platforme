import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// Icônes SVG inline pour éviter les dépendances
const Bars3Icon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XMarkIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Layout = ({ 
  children, 
  requireAuth = true, 
  requiredRoles = [] 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAuth && 
      isAuthenticated && 
      requiredRoles.length > 0 && 
      user && 
      !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header/NavBar */}
      {isAuthenticated && (
        <header className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">CRT Tozeur</h1>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center space-x-4">
                  <span className="text-gray-700">{user?.firstName} {user?.lastName}</span>
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 font-medium text-sm">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        {isAuthenticated && (
          <aside className={`bg-white shadow-sm ${collapsed ? 'w-20' : 'w-64'} hidden md:block transition-all duration-300`}>
            <div className="p-4">
              <button 
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center justify-center p-2 rounded-md hover:bg-gray-100"
              >
                {collapsed ? '»' : '« Collapse'}
              </button>
            </div>
            <nav className="mt-4">
              <NavItem collapsed={collapsed} icon="🏠" text="Dashboard" to="/" />
              <NavItem collapsed={collapsed} icon="👥" text="Volunteers" to="/volunteers" />
              <NavItem collapsed={collapsed} icon="📅" text="Activities" to="/activities" />
              <NavItem collapsed={collapsed} icon="📊" text="Reports" to="/reports" />
              {user?.role === 'admin' && (
                <NavItem collapsed={collapsed} icon="⚙️" text="Admin" to="/admin" />
              )}
            </nav>
          </aside>
        )}

        {/* Mobile Sidebar */}
        {isAuthenticated && mobileMenuOpen && isMobile && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 w-5/6 max-w-xs bg-white shadow-lg">
              <div className="p-4">
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <nav className="mt-4 px-4 space-y-2">
                <MobileNavItem icon="🏠" text="Dashboard" to="/" />
                <MobileNavItem icon="👥" text="Volunteers" to="/volunteers" />
                <MobileNavItem icon="📅" text="Activities" to="/activities" />
                <MobileNavItem icon="📊" text="Reports" to="/reports" />
                {user?.role === 'admin' && (
                  <MobileNavItem icon="⚙️" text="Admin" to="/admin" />
                )}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isAuthenticated ? 'md:ml-64' : ''} transition-all duration-300 ${collapsed && isAuthenticated ? 'md:ml-20' : ''}`}>
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Composant d'élément de navigation pour le sidebar desktop
function NavItem({ icon, text, to, collapsed }) {
  return (
    <a
      href={to}
      className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      <span className="mr-3 text-lg">{icon}</span>
      {!collapsed && <span>{text}</span>}
    </a>
  );
}

// Composant d'élément de navigation pour le menu mobile
function MobileNavItem({ icon, text, to }) {
  return (
    <a
      href={to}
      className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
    >
      <span className="mr-3 text-lg">{icon}</span>
      <span>{text}</span>
    </a>
  );
}

export default Layout;