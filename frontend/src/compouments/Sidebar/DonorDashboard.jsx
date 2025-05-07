
export const DonorDashboard = () => {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Donor Dashboard</h2>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donation History */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Your Donations</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((donation) => (
                  <div key={donation} className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="font-medium text-green-600">Donation #{donation}</p>
                    <p className="text-sm text-gray-600 mt-1">May {5 + donation}, 2023</p>
                    <p className="text-sm font-medium mt-1">$50.00</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Impact Summary */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Your Impact</h3>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">$1,250</p>
                <p className="text-sm text-gray-600 mt-2">You've helped 25 families this year</p>
              </div>
              
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-sm text-gray-600">Favorite Cause</p>
                <p className="text-lg font-medium text-purple-600 mt-1">Children's Education</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DonorDashboard;