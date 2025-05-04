import React from 'react';

const ActivitiesSection = () => {
  const activities = [
    {
      title: "Aide d'urgence",
      description: "Distribution de nourriture, abris et premiers secours dans les zones sinistrées.",
      icon: "🆘"
    },
    {
      title: "Santé communautaire",
      description: "Campagnes de vaccination, sensibilisation et consultations médicales gratuites.",
      icon: "🏥"
    },
    {
      title: "Formation",
      description: "Programmes de formation aux premiers secours et à la réduction des risques.",
      icon: "🎓"
    },
    {
      title: "Soutien social",
      description: "Aide aux personnes âgées, réfugiés et populations vulnérables.",
      icon: "🤝"
    }
  ];

  return (
    <section id="activites" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Activités</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((activity, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{activity.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{activity.title}</h3>
              <p className="text-gray-600">{activity.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="border border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-md font-medium">
            Voir toutes nos activités
          </button>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;