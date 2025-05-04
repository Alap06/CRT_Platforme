import React from 'react';

const AboutSection = () => {
  return (
    <section id="association" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Association</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Qui sommes-nous ?</h3>
            <p className="text-gray-600 mb-6">
              Fondée en [année], la Croissant Rouge est une organisation humanitaire engagée dans l'aide aux populations vulnérables. 
              Nos valeurs de solidarité, d'impartialité et de neutralité guident chacune de nos actions.
            </p>
            <p className="text-gray-600 mb-6">
              Avec plus de [nombre] bénévoles à travers le pays, nous intervenons dans les domaines de la santé, 
              de l'éducation et de l'urgence humanitaire.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium">
              En savoir plus
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 p-6 rounded-lg">
              <div className="text-red-600 text-4xl font-bold mb-2">150+</div>
              <div className="text-gray-700">Bénévoles actifs</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-gray-800 text-4xl font-bold mb-2">25+</div>
              <div className="text-gray-700">Projets annuels</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-gray-800 text-4xl font-bold mb-2">10K+</div>
              <div className="text-gray-700">Personnes aidées</div>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <div className="text-red-600 text-4xl font-bold mb-2">15+</div>
              <div className="text-gray-700">Années d'expérience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;