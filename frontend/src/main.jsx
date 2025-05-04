// 1. Importations optimisées
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// 2. Configuration du Router avec les Future Flags
const router = (
  <BrowserRouter future={{
    v7_startTransition: true,       // Active le nouveau système de transitions
    v7_relativeSplatPath: true      // Active le nouveau comportement des routes splat
  }}>
    <App />
  </BrowserRouter>
);

// 3. Rendu de l'application
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    {router}
  </StrictMode>
);