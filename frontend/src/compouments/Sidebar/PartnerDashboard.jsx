import React from 'react';
import { Send, Check, AlertTriangle, Clock } from 'lucide-react';

export const PartnerDashboard = () => {
  // Partner statistics
  const stats = [
    { title: 'Active Projects', value: '4', icon: <Check size={20} className="text-green-500" /> },
    { title: 'Pending Requests', value: '2', icon: <Clock size={20} className="text-yellow-500" /> },
    { title: 'Total Collaborations', value: '12', icon: <Send size={20} className="text-blue-500" /> },
    { title: 'Issues Requiring Attention', value: '1', icon: <AlertTriangle size={20} className="text-red-500" /> },
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
      startDate: 'January 15, 2025',
      endDate: 'December 15, 2025',
      progress: 35,
      coordinator: 'Leila Karoui'
    },
    { 
      id: 2, 
      title: 'Public Health Campaign', 
      startDate: 'March 1, 2025',
      endDate: 'August 30, 2025',
      progress: 60,
      coordinator: 'Mohamed Ammar'
    },
    { 
      id: 3, 
      title: 'Clean Water Initiative', 
      startDate: 'February 10, 2025',
      endDate: 'July 10, 2025',
      progress: 75,
      coordinator: 'Sarah Ahmed'
    },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your collaboration requests and active projects</p>
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
        {/* Requests */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Send size={20} className="mr-2" />
              Resource Requests
            </h3>
            <div className="mt-5 flow-root">
              <ul className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <li key={request.id} className="py-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">{request.title}</p>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Submitted: {request.submitted}
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        {request.notes}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a href="#" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Submit new request
              </a>
            </div>
          </div>
        </div>

        {/* Active Collaborations */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Check size={20} className="mr-2" />
              Active Collaborations
            </h3>
            <div className="mt-5 flow-root">
              <ul className="divide-y divide-gray-200">
                {collaborations.map((collab) => (
                  <li key={collab.id} className="py-4">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-medium text-gray-900">{collab.title}</p>
                      <p className="text-sm text-gray-500">
                        {collab.startDate} - {collab.endDate}
                      </p>
                      <p className="text-xs text-gray-500">
                        Coordinator: {collab.coordinator}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-red-600 h-2.5 rounded-full" 
                          style={{ width: `${collab.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Project Progress</span>
                        <span>{collab.progress}%</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a href="#" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View all collaborations
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PartnerDashboard;