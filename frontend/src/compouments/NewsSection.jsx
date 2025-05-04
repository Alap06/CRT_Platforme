import React from 'react';

const NewsSection = () => {
  const news = [
    {
      title: "Nouvelle campagne de vaccination",
      date: "15 Mars 2023",
      excerpt: "La Croissant Rouge lance une campagne de vaccination dans les régions rurales.",
      image: "/news1.jpg"
    },
    {
      title: "Intervention d'urgence après les inondations",
      date: "2 Février 2023",
      excerpt: "Nos équipes sont mobilisées pour aider les victimes des récentes inondations.",
      image: "/news2.jpg"
    },
    {
      title: "Formation aux premiers secours",
      date: "10 Janvier 2023",
      excerpt: "Session de formation gratuite ouverte à tous les bénévoles intéressés.",
      image: "/news3.jpg"
    }
  ];

  return (
    <section id="news" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Actualités</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{item.date}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.excerpt}</p>
                <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                  Lire la suite →
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium">
            Voir toutes les actualités
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;