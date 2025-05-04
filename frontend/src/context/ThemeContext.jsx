// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Récupère le thème stocké ou utilise le préférence système
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Applique le thème au document HTML
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Mémorisation pour optimiser les performances
  const value = useMemo(() => ({
    isDarkMode,
    toggleTheme: () => setIsDarkMode(prev => !prev),
    setTheme: (mode) => setIsDarkMode(mode === 'dark')
  }), [isDarkMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}