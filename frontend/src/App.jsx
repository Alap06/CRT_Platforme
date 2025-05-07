import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './compouments/Navbar';
import HomePage from './compouments/Pages/HomePage';
import LoginPage from './compouments/Pages/LoginPage';
import RegisterPage from './compouments/Pages/RegisterPage';
import VolunteersPage from './compouments/Pages/VolunteersPage';
import Statstique from './compouments/Pages/Statstique';
import Layout from './compouments/layout';
import Footer from './compouments/Footer';
import AdminDashboard from './compouments/Sidebar/AdminDashboard';
import VolunteerDashboard from './compouments/Sidebar/VolunteerDashboard';
import PartnerDashboard from './compouments/Sidebar/PartnerDashboard';
import DonorDashboard from './compouments/Sidebar/DonorDashboard';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/volunteers" element={<VolunteersPage />} />
            <Route path="/stat" element={<Statstique />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/donor-dashboard" element={<DonorDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;