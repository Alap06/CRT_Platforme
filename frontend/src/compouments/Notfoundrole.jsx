import { useState, useEffect } from 'react';
import { AlertTriangle, Mail, PhoneCall } from 'lucide-react';

export default function NotFoundRole() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animation d'entrée après le montage du composant
    setIsVisible(true);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-500 p-6 flex items-center justify-center">
          <AlertTriangle className="text-white h-16 w-16 animate-pulse" />
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Accès non autorisé</h2>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">
              Vous n'avez pas le rôle requis pour accéder à cette section.
            </p>
          </div>
          
          <p className="text-gray-600 mb-6">
            Veuillez contacter l'administrateur du système pour obtenir les autorisations nécessaires ou pour résoudre ce problème d'accès.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail className="h-5 w-5 text-gray-500" />
              <span>support@entreprise.com</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-700">
              <PhoneCall className="h-5 w-5 text-gray-500" />
              <span>+33 1 23 45 67 89</span>
            </div>
          </div>
          
          <div className="mt-8">
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300 transform hover:scale-105 active:scale-95"
              onClick={() => window.location.href = "/"}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-500 animate-bounce">
        Si vous pensez qu'il s'agit d'une erreur, actualisez la page
      </p>
    </div>
  );
}