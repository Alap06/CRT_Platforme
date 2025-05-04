// ContactForm.jsx
import React from 'react';
import MapLocation from './MapLocation'; // Assurez-vous que le chemin est correct

const ContactForm = () => {
  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contactez-nous</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Objet de votre message"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  id="message" 
                  rows="4" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Votre message..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Envoyer le message
              </button>
            </form>
          </div>
          <div>
            <MapLocation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;