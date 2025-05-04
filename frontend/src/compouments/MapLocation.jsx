// MapLocation.jsx
import React from 'react';

const MapLocation = () => {
  return (
    <div className="h-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Nous trouver</h2>
      <div className="bg-gray-200 rounded-lg overflow-hidden h-96">
        {/* Intégration de Google Maps ou autre service de cartographie */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d[LATITUDE]!2d[LONGITUDE]!3d[ZOOM]!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMjQnMzkuOSJOIDTCsDE0JzQxLjgiRQ!5e0!3m2!1sfr!2sma!4v1620000000000!5m2!1sfr!2sma" 
          width="100%" 
          height="100%" 
          style={{border:0}} 
          allowFullScreen="" 
          loading="lazy"
          title="Localisation Croissant Rouge"
        ></iframe>
      </div>
      <div className="mt-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 text-red-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-gray-700">123 Rue de l'Humanitaire, Ville, Pays</p>
          </div>
        </div>
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 text-red-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-gray-700">+123 456 7890</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 text-red-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-gray-700">contact@croissantrouge.org</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocation;