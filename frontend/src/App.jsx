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
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <LoginPage />
            </MainLayout>
          }
        />
        <Route
          path="/register"
          element={
            <MainLayout>
              <RegisterPage />
            </MainLayout>
          }
        />
        <Route
          path="/volunteers"
          element={
            <MainLayout>
              <VolunteersPage />
            </MainLayout>
          }
        />
        <Route
          path="/stat"
          element={
            <MainLayout>
              <Statstique />
            </MainLayout>
          }
        />
        {/* Protected Dashboard Routes without Navbar and Footer */}
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/VolunteerDashboard"
          element={
            <ProtectedRoute requiredRole="benevole">
              <DashboardLayout>
                <VolunteerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/PartnerDashboard"
          element={
            <ProtectedRoute requiredRole="partenaire">
              <DashboardLayout>
                <PartnerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/DonorDashboard"
          element={
            <ProtectedRoute requiredRole="donateur">
              <DashboardLayout>
                <DonorDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;