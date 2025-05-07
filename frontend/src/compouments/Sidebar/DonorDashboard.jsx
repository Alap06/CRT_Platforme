import React from 'react';
import { Gift, Heart, Award, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DonorDashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Track your donations and impact</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <LogOut size={18} className="mr-2" />
          Déconnexion
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Donation History */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Gift size={24} className="mr-3 text-green-500" />
                  Your Donations
                </h3>
                <a href="#" className="text-sm font-medium text-green-600 hover:text-green-800">
                  View all
                </a>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((donation) => (
                  <div 
                    key={donation} 
                    className="p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-green-700">Donation #{donation}</p>
                        <p className="text-sm text-gray-600 mt-1">May {5 + donation}, 2023</p>
                      </div>
                      <p className="text-lg font-semibold text-green-800">$50.00</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Impact Summary */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Heart size={24} className="mr-3 text-red-500" />
                  Your Impact
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
                  <div className="flex items-center">
                    <TrendingUp size={20} className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Total Donations</p>
                      <p className="text-2xl font-bold text-blue-700 mt-1">$1,250</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    You've helped <span className="font-medium">25 families</span> this year
                  </p>
                </div>
                
                <div className="p-5 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors duration-200">
                  <div className="flex items-center">
                    <Award size={20} className="text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Favorite Cause</p>
                      <p className="text-xl font-semibold text-purple-700 mt-1">Children's Education</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;