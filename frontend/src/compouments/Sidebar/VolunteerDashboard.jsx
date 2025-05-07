import React from 'react';
import { Calendar, Clock, Activity, Award } from 'lucide-react';

export const VolunteerDashboard = () => {
  // Volunteer statistics
  const stats = [
    { title: 'Hours Contributed', value: '48', icon: <Clock size={20} className="text-blue-500" /> },
    { title: 'Activities Joined', value: '12', icon: <Activity size={20} className="text-green-500" /> },
    { title: 'Active Projects', value: '3', icon: <Calendar size={20} className="text-purple-500" /> },
    { title: 'Achievement Points', value: '256', icon: <Award size={20} className="text-yellow-500" /> },
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
    return status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Volunteer Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Track your contributions and upcoming activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-md bg-gray-50">
                    {stat.icon}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Upcoming Activities */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Calendar size={20} className="mr-2" />
              Upcoming Activities
            </h3>
            <div className="mt-5 flow-root">
              <ul className="divide-y divide-gray-200">
                {upcomingActivities.map((activity) => (
                  <li key={activity.id} className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          <span>{activity.date} • {activity.time}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {activity.location}
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a href="#" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View full calendar
              </a>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Award size={20} className="mr-2" />
              Achievements Progress
            </h3>
            <div className="mt-5 flow-root">
              <ul className="space-y-5">
                {achievements.map((achievement) => (
                  <li key={achievement.id} className="py-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">{achievement.name}</div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className="text-sm font-medium text-gray-500">{achievement.points} points</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-2 bg-red-600 rounded-full" 
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                          <div>Progress</div>
                          <div>{achievement.progress}%</div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a href="#" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View all achievements
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VolunteerDashboard;
