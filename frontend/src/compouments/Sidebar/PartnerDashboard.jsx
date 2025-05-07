import React from 'react';
import { Send, Check, AlertTriangle, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PartnerDashboard = () => {
  const { logout } = useAuth();

  // Partner statistics
  const stats = [
    { title: 'Active Projects', value: '4', icon: <Check size={20} className="text-green-500" />, color: 'bg-green-50' },
    { title: 'Pending Requests', value: '2', icon: <Clock size={20} className="text-yellow-500" />, color: 'bg-yellow-50' },
    { title: 'Total Collaborations', value: '12', icon: <Send size={20} className="text-blue-500" />, color: 'bg-blue-50' },
    { title: 'Issues Requiring Attention', value: '1', icon: <AlertTriangle size={20} className="text-red-500" />, color: 'bg-red-50' },
  ];

  // Project requests status
  const requests = [
    { 
      id: 1, 
      title: 'Educational Materials Support', 
      submitted: 'April 28, 2025',
      status: 'approved',
      notes: 'Materials will be delivered next week'
    },
    { 
      id: 2, 
      title: 'Medical Supplies Request', 
      submitted: 'May 2, 2025',
      status: 'pending',
      notes: 'Awaiting committee review'
    },
    { 
      id: 3, 
      title: 'Community Event Space', 
      submitted: 'May 4, 2025',
      status: 'pending',
      notes: 'Location options being explored'
    },
  ];

  // Active collaborations
  const collaborations = [
    { 
      id: 1, 
      title: 'Youth Empowerment Initiative', 
      startDate: 'Jan 15, 2025',
      endDate: 'Dec 15, 2025',
      progress: 35,
      coordinator: 'Leila Karoui'
    },
    { 
      id: 2, 
      title: 'Public Health Campaign', 
      startDate: 'Mar 1, 2025',
      endDate: 'Aug 30, 2025',
      progress: 60,
      coordinator: 'Mohamed Ammar'
    },
    { 
      id: 3, 
      title: 'Clean Water Initiative', 
      startDate: 'Feb 10, 2025',
      endDate: 'Jul 10, 2025',
      progress: 75,
      coordinator: 'Sarah Ahmed'
    },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'pending':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Manage your collaboration requests and active projects</p>
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
        {/* Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Send size={24} className="mr-3 text-blue-500" />
                Resource Requests
              </h3>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                New request
              </a>
            </div>
            <div className="space-y-4">
              {requests.map((request) => (
                <div 
                  key={request.id} 
                  className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{request.title}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted: {request.submitted}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 italic">
                    {request.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Collaborations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Check size={24} className="mr-3 text-green-500" />
                Active Collaborations
              </h3>
              <a href="#" className="text-sm font-medium text-green-600 hover:text-green-800">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {collaborations.map((collab) => (
                <div 
                  key={collab.id} 
                  className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="mb-3">
                    <p className="font-medium text-gray-900">{collab.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {collab.startDate} - {collab.endDate}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Coordinator: {collab.coordinator}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" 
                      style={{ width: `${collab.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Progress</span>
                    <span>{collab.progress}%</span>
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

export default PartnerDashboard;