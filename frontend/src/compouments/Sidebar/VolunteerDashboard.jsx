import React from 'react';
import { Calendar, Clock, Activity, Award, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const VolunteerDashboard = () => {
  const { logout } = useAuth();

  // Volunteer statistics
  const stats = [
    { title: 'Hours Contributed', value: '48', icon: <Clock size={20} className="text-blue-500" />, color: 'bg-blue-50' },
    { title: 'Activities Joined', value: '12', icon: <Activity size={20} className="text-green-500" />, color: 'bg-green-50' },
    { title: 'Active Projects', value: '3', icon: <Calendar size={20} className="text-purple-500" />, color: 'bg-purple-50' },
    { title: 'Achievement Points', value: '256', icon: <Award size={20} className="text-yellow-500" />, color: 'bg-yellow-50' },
  ];

  // Upcoming activities
  const upcomingActivities = [
    { 
      id: 1, 
      title: 'Food Distribution', 
      date: 'May 12, 2025', 
      time: '10:00 AM - 2:00 PM',
      location: 'Community Center, Tozeur',
      status: 'confirmed'
    },
    { 
      id: 2, 
      title: 'Educational Workshop', 
      date: 'May 15, 2025', 
      time: '3:00 PM - 5:00 PM',
      location: 'Public Library, Tozeur',
      status: 'pending'
    },
    { 
      id: 3, 
      title: 'Health Awareness Campaign', 
      date: 'May 20, 2025', 
      time: '9:00 AM - 1:00 PM',
      location: 'City Hospital, Tozeur',
      status: 'confirmed'
    },
  ];

  // Achievements
  const achievements = [
    { id: 1, name: '10 Activities Milestone', progress: 100, points: 50 },
    { id: 2, name: '50 Hours Contributed', progress: 96, points: 100 },
    { id: 3, name: 'Team Leader', progress: 30, points: 75 },
  ];

  const getStatusColor = (status) => {
    return status === 'confirmed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Track your contributions and upcoming activities</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <LogOut size={18} className="mr-2" />
          Déconnexion
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd>
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Upcoming Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar size={24} className="mr-3 text-blue-500" />
                Upcoming Activities
              </h3>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                View calendar
              </a>
            </div>
            <div className="space-y-4">
              {upcomingActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar size={16} className="mr-2" />
                        <span>{activity.date} • {activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.location}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Award size={24} className="mr-3 text-yellow-500" />
                Achievements Progress
              </h3>
              <a href="#" className="text-sm font-medium text-yellow-600 hover:text-yellow-800">
                View all
              </a>
            </div>
            <div className="space-y-6">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {achievement.points} pts
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500" 
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{achievement.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;