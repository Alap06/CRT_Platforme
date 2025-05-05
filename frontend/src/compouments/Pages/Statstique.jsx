import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { mockActivities, mockVolunteers } from '../../services/mockData';
import Layout from '../layout';

const Statstique = () => {
  const { user } = useAuth();
  const [activeChart, setActiveChart] = useState('monthly');
  
  // Filtre les activités à venir
  const upcomingActivities = mockActivities
    .filter(activity => new Date(activity.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  // Données pour les graphiques
  const chartData = {
    monthly: [
      { name: 'Jan', activities: 12, volunteers: 28 },
      { name: 'Feb', activities: 19, volunteers: 33 },
      { name: 'Mar', activities: 15, volunteers: 29 },
      { name: 'Apr', activities: 18, volunteers: 35 },
      { name: 'May', activities: 22, volunteers: 42 },
    ],
    skills: [
      { skill: 'Medical', count: 12 },
      { skill: 'Logistics', count: 18 },
      { skill: 'Education', count: 8 },
      { skill: 'Technical', count: 15 },
      { skill: 'Languages', count: 25 },
    ],
    types: [
      { name: 'Health', value: 35, color: 'bg-red-600' },
      { name: 'Education', value: 20, color: 'bg-gray-900' },
      { name: 'Environment', value: 15, color: 'bg-gray-500' },
      { name: 'Disaster Relief', value: 10, color: 'bg-gray-300' },
      { name: 'Others', value: 20, color: 'bg-gray-100' },
    ]
  };

  // Statistiques
  const stats = [
    { title: "Total Volunteers", value: mockVolunteers.length, change: "+2 this week", icon: "👥" },
    { title: "Ongoing Activities", value: mockActivities.filter(a => a.status === "in-progress").length, change: "+1 today", icon: "📌" },
    { title: "Planned Activities", value: mockActivities.filter(a => a.status === "planned").length, change: "Upcoming", icon: "🗓️" },
    { title: "Coverage Rate", value: "83%", change: "+5% from last month", icon: "📊" }
  ];

  // Animation de hover
  const hoverAnimation = "transition-all duration-300 hover:shadow-lg hover:-translate-y-1";

  return (
    <Layout>

    
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-500 mt-1">
              Here's what's happening at CRT Tozeur today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg ${hoverAnimation}`}>
              <span>🗓️</span>
              <span>Today's Calendar</span>
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg ${hoverAnimation}`}>
              <span>📌</span>
              <span>New Activity</span>
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`bg-white p-4 rounded-xl shadow-sm ${hoverAnimation}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Graphique principal */}
          <div className="bg-white p-4 rounded-xl shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Monthly Activities Overview</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveChart('monthly')}
                  className={`px-3 py-1 text-sm rounded-md ${activeChart === 'monthly' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setActiveChart('skills')}
                  className={`px-3 py-1 text-sm rounded-md ${activeChart === 'skills' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
                >
                  By Skills
                </button>
              </div>
            </div>
            
            <div className="h-64">
              {activeChart === 'monthly' ? (
                <div className="flex flex-col h-full">
                  <div className="flex-1 grid grid-cols-5 gap-2 items-end h-48">
                    {chartData.monthly.map((month, i) => (
                      <div key={i} className="flex flex-col items-center h-full">
                        <div className="flex items-end h-full w-full gap-1">
                          <div 
                            className="w-full bg-red-600 rounded-t-sm transition-all duration-500"
                            style={{ height: `${(month.activities / 22) * 100}%` }}
                          />
                          <div 
                            className="w-full bg-gray-900 rounded-t-sm transition-all duration-500"
                            style={{ height: `${(month.volunteers / 42) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs mt-1">{month.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
                      <span className="text-xs">Activities</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-900 rounded-sm"></div>
                      <span className="text-xs">Volunteers</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex-1 grid grid-cols-5 gap-4 items-end h-48">
                    {chartData.skills.map((skill, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div 
                          className="w-full bg-red-600 rounded-t-sm transition-all duration-500"
                          style={{ height: `${(skill.count / 25) * 100}%` }}
                        />
                        <span className="text-xs mt-1 text-center">{skill.skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Graphique secondaire */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Activities by Type</h2>
            <div className="h-64 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 mb-4">
                {chartData.types.map((type, i) => {
                  const radius = 40;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDasharray = `${(type.value / 100) * circumference} ${circumference}`;
                  
                  return (
                    <div key={i} className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={i === 0 ? 0 : -chartData.types.slice(0, i).reduce((acc, t) => acc + (t.value / 100) * circumference, 0)}
                          className={`text-${type.color.split('-')[1]}-${type.color.split('-')[2]}`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">100%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                {chartData.types.map((type, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${type.color}`}></div>
                    <span className="text-xs">{type.name} ({type.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activités à venir */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Activities</h2>
            <Link 
              to="/activities" 
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              View all activities →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingActivities.map((activity) => (
              <div 
                key={activity.id} 
                className={`border rounded-lg p-4 ${hoverAnimation}`}
              >
                <h3 className="font-bold text-lg mb-1">{activity.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                  {activity.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span>📍</span>
                    <span>{activity.location.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>🗓️</span>
                    <span>
                      {new Date(activity.startDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>⏰</span>
                    <span>
                      {new Date(activity.startDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {' - '}
                      {new Date(activity.endDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                
                <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Statstique;