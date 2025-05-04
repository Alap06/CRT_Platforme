import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './compouments/Navbar';
import HomePage from './compouments/pages/HomePage';
import LoginPage from './compouments/pages/LoginPage';
import RegisterPage from './compouments/pages/RegisterPage';
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
        </Routes>
      </main>
      <Footer />
    </div>
    </AuthProvider>
  );
}

export default App;