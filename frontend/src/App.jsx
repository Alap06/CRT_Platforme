import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './compouments/Navbar';
import HomePage from './compouments/Pages/HomePage';
import LoginPage from './compouments/Pages/LoginPage';
import RegisterPage from './compouments/Pages/RegisterPage';
import VolunteersPage from './compouments/Pages/VolunteersPage';
import Statstique from './compouments/Pages/Statstique';
import Footer from './compouments/Footer';
import AdminDashboard from './compouments/Sidebar/AdminDashboard';
import VolunteerDashboard from './compouments/Sidebar/VolunteerDashboard';
import PartnerDashboard from './compouments/Sidebar/PartnerDashboard';
import DonorDashboard from './compouments/Sidebar/DonorDashboard';
import UsersManagement from './compouments/Admin/UsersManagement';
import ActivitiesManagement from './compouments/Admin/ActivitiesManagement';
import NewsManagement from './compouments/Admin/NewsManagement';
import ResourcesManagement from './compouments/Admin/ResourcesManagement';
import ActivityReportsManagement from './compouments/Admin/ActivityReportsManagement';
import ComingSoon from './compouments/Admin/ComingSoon';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Layout for regular pages with Navbar and Footer
const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

// Layout for dashboard pages without Navbar and Footer
const DashboardLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <main className="flex-grow">{children}</main>
  </div>
);

// Protected Route component with role-based access
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, hasRole } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
        <Route path="/volunteers" element={<MainLayout><VolunteersPage /></MainLayout>} />
        <Route path="/stat" element={<MainLayout><Statstique /></MainLayout>} />

        {/* Admin Dashboard Routes */}
        <Route path="/AdminDashboard" element={<ProtectedRoute requiredRole="admin"><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><DashboardLayout><UsersManagement /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/activities" element={<ProtectedRoute requiredRole="admin"><DashboardLayout><ActivitiesManagement /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><DashboardLayout><ActivityReportsManagement /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/resources" element={<ProtectedRoute requiredRole="admin"><DashboardLayout><ResourcesManagement /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/news" element={<ProtectedRoute requiredRole="admin"><DashboardLayout><NewsManagement /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/donations" element={<ProtectedRoute requiredRole="admin"><DashboardLayout><ComingSoon title="Gestion des Donations" role="admin" /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute requiredRole="admin"><DashboardLayout><ComingSoon title="Gestion des Projets" role="admin" /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/committees" element={<ProtectedRoute requiredRole="admin"><DashboardLayout><ComingSoon title="Gestion des Comités" role="admin" /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/contacts" element={<ProtectedRoute requiredRole="admin"><DashboardLayout><ComingSoon title="Gestion des Messages" role="admin" /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><DashboardLayout><ComingSoon title="Paramètres" role="admin" /></DashboardLayout></ProtectedRoute>} />

        {/* Volunteer Dashboard Routes */}
        <Route path="/VolunteerDashboard" element={<ProtectedRoute requiredRole="benevole"><DashboardLayout><VolunteerDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/volunteer/activities" element={<ProtectedRoute requiredRole="benevole"><DashboardLayout><ComingSoon title="Mes Activités" role="benevole" /></DashboardLayout></ProtectedRoute>} />
        <Route path="/volunteer/projects" element={<ProtectedRoute requiredRole="benevole"><DashboardLayout><ComingSoon title="Projets" role="benevole" /></DashboardLayout></ProtectedRoute>} />
        <Route path="/volunteer/profile" element={<ProtectedRoute requiredRole="benevole"><DashboardLayout><ComingSoon title="Mon Profil" role="benevole" /></DashboardLayout></ProtectedRoute>} />

        {/* Donor Dashboard Routes */}
        <Route path="/DonorDashboard" element={<ProtectedRoute requiredRole="donateur"><DashboardLayout><DonorDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/donor/donations" element={<ProtectedRoute requiredRole="donateur"><DashboardLayout><ComingSoon title="Mes Donations" role="donateur" /></DashboardLayout></ProtectedRoute>} />
        <Route path="/donor/projects" element={<ProtectedRoute requiredRole="donateur"><DashboardLayout><ComingSoon title="Projets" role="donateur" /></DashboardLayout></ProtectedRoute>} />
        <Route path="/donor/profile" element={<ProtectedRoute requiredRole="donateur"><DashboardLayout><ComingSoon title="Mon Profil" role="donateur" /></DashboardLayout></ProtectedRoute>} />

        {/* Partner Dashboard Routes */}
        <Route path="/PartnerDashboard" element={<ProtectedRoute requiredRole="partenaire"><DashboardLayout><PartnerDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/partner/projects" element={<ProtectedRoute requiredRole="partenaire"><DashboardLayout><ComingSoon title="Nos Projets" role="partenaire" /></DashboardLayout></ProtectedRoute>} />
        <Route path="/partner/activities" element={<ProtectedRoute requiredRole="partenaire"><DashboardLayout><ComingSoon title="Activités" role="partenaire" /></DashboardLayout></ProtectedRoute>} />
        <Route path="/partner/profile" element={<ProtectedRoute requiredRole="partenaire"><DashboardLayout><ComingSoon title="Mon Profil" role="partenaire" /></DashboardLayout></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
