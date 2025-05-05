import React, { useState, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { 
      ChevronDown, 
      Filter,
      MoreHorizontal,
      PlusCircle,
      Search,
      UserPlus,
      X,
      AlertCircle,
      ChevronRight
    } from 'lucide-react';
    import Layout from '../layout';
    
    // Mock data - normalement ceci viendrait d'une API
    const mockVolunteers = [
      {
        id: 1,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        phone: '06 12 34 56 78',
        availability: 'Weekends',
        skills: [
          { id: 1, name: 'Premiers secours', category: 'Médical' },
          { id: 2, name: 'Administration', category: 'Bureau' }
        ]
      },
      {
        id: 2,
        firstName: 'Marie',
        lastName: 'Laurent',
        email: 'marie.laurent@email.com',
        phone: '07 23 45 67 89',
        availability: 'Soirs',
        skills: [
          { id: 3, name: 'Traduction', category: 'Langues' },
          { id: 4, name: 'Cuisine', category: 'Alimentation' },
          { id: 5, name: 'Photographie', category: 'Médias' }
        ]
      },
      {
        id: 3,
        firstName: 'Ahmed',
        lastName: 'Benmoussa',
        email: 'ahmed.b@email.com',
        phone: '06 98 76 54 32',
        availability: 'Temps plein',
        skills: [
          { id: 6, name: 'Logistique', category: 'Opérations' },
          { id: 7, name: 'Conduite', category: 'Transport' }
        ]
      },
      {
        id: 4,
        firstName: 'Sophie',
        lastName: 'Martin',
        email: 'sophie.m@email.com',
        phone: '07 45 67 89 01',
        availability: 'Flexible',
        skills: [
          { id: 8, name: 'Design graphique', category: 'Médias' },
          { id: 9, name: 'Communication', category: 'Relations' },
          { id: 10, name: 'Réseaux sociaux', category: 'Médias' }
        ]
      }
    ];
    
    const VolunteersPage = () => {
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedSkills, setSelectedSkills] = useState([]);
      const [isFilterOpen, setIsFilterOpen] = useState(false);
      const [isAddModalOpen, setIsAddModalOpen] = useState(false);
      const [volunteers, setVolunteers] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
    
      // Simuler le chargement des données
      useEffect(() => {
        setTimeout(() => {
          setVolunteers(mockVolunteers);
          setIsLoading(false);
        }, 800);
      }, []);
    
      // Extraire toutes les catégories de compétences uniques
      const allSkills = Array.from(
        new Set(
          mockVolunteers.flatMap(volunteer => 
            volunteer.skills.map(skill => skill.category)
          )
        )
      );
    
      // Filtrer les volontaires
      const filteredVolunteers = volunteers.filter(volunteer => {
        const matchesSearch = 
          searchTerm === '' ||
          volunteer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          volunteer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesSkills = 
          selectedSkills.length === 0 ||
          volunteer.skills.some(skill => 
            selectedSkills.includes(skill.category)
          );
          
        return matchesSearch && matchesSkills;
      });
    
      const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
          setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
          setSelectedSkills([...selectedSkills, skill]);
        }
      };
    
      return (
        <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Gestion des Volontaires</h1>
              </div>
              <nav className="flex space-x-4">
                <a href="#" className="text-gray-900 font-medium hover:text-red-600 transition-colors">Tableau de bord</a>
                <a href="#" className="text-red-600 font-medium">Volontaires</a>
                <a href="#" className="text-gray-900 font-medium hover:text-red-600 transition-colors">Événements</a>
                <a href="#" className="text-gray-900 font-medium hover:text-red-600 transition-colors">Rapports</a>
              </nav>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {/* Header Section */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
              >
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900">Volontaires</h2>
                  <p className="text-gray-500">
                    Gérez votre base de données de volontaires et suivez leurs compétences
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter un Volontaire
                </motion.button>
              </motion.div>
    
              {/* Main Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Base de données des Volontaires</h3>
                  <p className="text-sm text-gray-500">
                    Vous avez {volunteers.length} volontaires enregistrés
                  </p>
                </div>
                
                <div className="p-6">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher des volontaires..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
    
                    <div className="relative">
                      <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        <span>Filtrer</span>
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </button>
                      
                      {isFilterOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1 border-b border-gray-100 px-4 py-2">
                            <p className="text-sm font-medium text-gray-700">Filtrer par compétence</p>
                          </div>
                          <div className="max-h-60 overflow-y-auto py-1">
                            {allSkills.map(skill => (
                              <div
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                              >
                                <span className="text-sm text-gray-700">{skill}</span>
                                {selectedSkills.includes(skill) && (
                                  <div className="h-2 w-2 bg-red-600 rounded-full" />
                                )}
                              </div>
                            ))}
                          </div>
                          {selectedSkills.length > 0 && (
                            <div className="py-1 border-t border-gray-100">
                              <div
                                onClick={() => setSelectedSkills([])}
                                className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer text-center"
                              >
                                Effacer les filtres
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
    
                  {/* Selected Filters */}
                  <AnimatePresence>
                    {selectedSkills.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2 mb-4 overflow-hidden"
                      >
                        {selectedSkills.map(skill => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {skill}
                            <button
                              onClick={() => toggleSkill(skill)}
                              className="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-gray-200"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </motion.span>
                        ))}
                        <button
                          onClick={() => setSelectedSkills([])}
                          className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                        >
                          Tout effacer
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
    
                  {/* Table */}
                  <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nom
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Téléphone
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Compétences
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                          Array(4).fill(0).map((_, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-1">
                                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                              </td>
                            </tr>
                          ))
                        ) : filteredVolunteers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center">
                                <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-gray-500 text-sm font-medium">Aucun volontaire trouvé.</p>
                                <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos critères de recherche</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredVolunteers.map((volunteer) => (
                            <motion.tr 
                              key={volunteer.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{volunteer.firstName} {volunteer.lastName}</div>
                                <div className="text-xs text-gray-500">Disponibilité: {volunteer.availability}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {volunteer.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {volunteer.phone}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                  {volunteer.skills.slice(0, 2).map((skill) => (
                                    <span 
                                      key={skill.id} 
                                      className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                                    >
                                      {skill.name}
                                    </span>
                                  ))}
                                  {volunteer.skills.length > 2 && (
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                                      +{volunteer.skills.length - 2}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="relative group">
                                  <button className="text-gray-400 hover:text-gray-500 focus:outline-none">
                                    <MoreHorizontal className="h-5 w-5" />
                                  </button>
                                  <div className="hidden group-hover:block absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                    <div className="py-1">
                                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Voir le profil
                                      </a>
                                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Modifier les détails
                                      </a>
                                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Voir la disponibilité
                                      </a>
                                      <div className="border-t border-gray-100"></div>
                                      <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                        Désactiver
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {!isLoading && filteredVolunteers.length > 0 && (
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div>
                        Affichage de {filteredVolunteers.length} sur {volunteers.length} volontaires
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                          Précédent
                        </button>
                        <span className="px-2 py-1 bg-red-600 text-white rounded-md">1</span>
                        <button className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                          Suivant
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </main>
          
          {/* Modal pour ajouter un volontaire */}
          <AnimatePresence>
            {isAddModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50"
                onClick={() => setIsAddModalOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Ajouter un nouveau volontaire</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Prénom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Nom"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="email@exemple.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="06 XX XX XX XX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <option>Choisir une disponibilité</option>
                        <option>Temps plein</option>
                        <option>Weekends</option>
                        <option>Soirs</option>
                        <option>Flexible</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Compétences</label>
                      <div className="p-3 border border-gray-300 rounded-md min-h-12 bg-gray-50">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                            Premiers secours
                            <button className="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-gray-300">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        </div>
                        <button className="text-sm text-red-600 hover:text-red-700 flex items-center">
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Ajouter une compétence
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Annuler
                      </button>
                      <button
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </Layout>
      );
    };

    export default VolunteersPage;  // Au lieu de juste "export VolunteersPage"