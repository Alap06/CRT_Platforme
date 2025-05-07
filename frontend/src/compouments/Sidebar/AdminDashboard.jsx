import React from 'react';
import { BarChart, Calendar, Users, FileText } from 'lucide-react';

export const AdminDashboard = () => {
  // Sample statistics data
  const stats = [
    { title: 'Total Volunteers', value: '358', change: '+12%', icon: <Users size={20} className="text-blue-500" /> },
    { title: 'Active Projects', value: '24', change: '+3', icon: <Calendar size={20} className="text-green-500" /> },
    { title: 'Partners', value: '47', change: '+5', icon: <Users size={20} className="text-purple-500" /> },
    { title: 'Total Donations', value: '105,420 TND', change: '+8.5%', icon: <BarChart size={20} className="text-red-500" /> },
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
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of all operations and metrics</p>
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
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="font-medium text-green-600 hover:text-green-900">
                  {stat.change} from last month
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Calendar size={20} className="mr-2" />
              Recent Activity
            </h3>
            <div className="mt-5 flow-root">
              <ul className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-red-600 font-medium text-sm">
                            {activity.user.split(' ').map(name => name[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.user}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {activity.action}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a href="#" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View all activity
              </a>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <FileText size={20} className="mr-2" />
              Recent Documents
            </h3>
            <div className="mt-5 flow-root">
              <ul className="divide-y divide-gray-200">
                {recentDocuments.map((doc) => (
                  <li key={doc.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileText size={24} className="text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.type} · {doc.size}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="text-sm text-gray-400">{doc.updated}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a href="#" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View all documents
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;