import React from 'react';
import { BarChart, Calendar, Users, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { logout } = useAuth();

  // Sample statistics data
  const stats = [
    { title: 'Total Volunteers', value: '358', change: '+12%', icon: <Users size={20} className="text-blue-500" />, color: 'bg-blue-50' },
    { title: 'Active Projects', value: '24', change: '+3', icon: <Calendar size={20} className="text-green-500" />, color: 'bg-green-50' },
    { title: 'Partners', value: '47', change: '+5', icon: <Users size={20} className="text-purple-500" />, color: 'bg-purple-50' },
    { title: 'Total Donations', value: '105,420 TND', change: '+8.5%', icon: <BarChart size={20} className="text-red-500" />, color: 'bg-red-50' },
  ];

  // Recent activity data
  const recentActivities = [
    { id: 1, user: 'Sarah Ahmed', action: 'added a new volunteer', time: '2 hours ago' },
    { id: 2, user: 'Mehdi Ben Ali', action: 'updated the donation goal', time: '5 hours ago' },
    { id: 3, user: 'Leila Karoui', action: 'created a new project', time: '1 day ago' },
    { id: 4, user: 'Ahmed Trabelsi', action: 'approved partner request', time: '2 days ago' },
  ];

  // Recent documents
  const recentDocuments = [
    { id: 1, name: 'Annual Report 2024', type: 'PDF', size: '2.4 MB', updated: '2 days ago' },
    { id: 2, name: 'Q2 Financial Statement', type: 'XLSX', size: '1.8 MB', updated: '1 week ago' },
    { id: 3, name: 'Project Proposal Template', type: 'DOCX', size: '540 KB', updated: '2 weeks ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Overview of all operations and metrics</p>
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
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-transparent"
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
            <div className="bg-gray-50 px-6 py-3">
              <div className="text-sm">
                <span className={`font-medium ${parseInt(stat.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar size={24} className="mr-3 text-blue-500" />
                Recent Activity
              </h3>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                View all
              </a>
            </div>
            <div className="mt-6 space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {activity.user.split(' ').map(name => name[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user}
                      </p>
                      <span className="text-xs text-gray-400">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText size={24} className="mr-3 text-purple-500" />
                Recent Documents
              </h3>
              <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-800">
                View all
              </a>
            </div>
            <div className="mt-6 space-y-4">
              {recentDocuments.map((doc) => (
                <div 
                  key={doc.id} 
                  className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FileText size={18} className="text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {doc.type} · {doc.size}
                    </p>
                  </div>
                  <div className="ml-4 text-xs text-gray-400">
                    {doc.updated}
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

export default AdminDashboard;