import React from 'react';
import Imghero from '../images/heroimage.jpeg';

const HeroSection = () => {
  return (
    <section className="relative bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Croissant Rouge <span className="text-red-600">Humanitaire</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Nous œuvrons chaque jour pour venir en aide aux personnes vulnérables et promouvoir les valeurs humanitaires.
            </p>
            <div className="flex space-x-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium">
                Découvrir nos actions
              </button>
              <button className="border border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-md font-medium">
                Faire un don
              </button>
            </div>
          </div>
          <div>
            <img 
              src={Imghero}
              alt="Action humanitaire" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;