import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './compouments/Navbar';
import HomePage from './compouments/pages/HomePage';
import LoginPage from './compouments/pages/LoginPage';
import RegisterPage from './compouments/pages/RegisterPage';
import ValnterPage from './compouments/pages/VolunteersPage';
import Statstique from './compouments/Pages/Statstique' 
import Layout from './compouments/layout';
import Footer from './compouments/Footer';
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
          <Route path="/valnter" element={<ValnterPage />} />
          <Route path="/stat" element={<Statstique />} />
           
        </Routes>
      </main>
      <Footer />
    </div>
    </AuthProvider>
  );
}

export default App;