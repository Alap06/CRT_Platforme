import { useSidebar } from './SidebarContext';
import { contentData } from './NavigationConfig';

const ResultItem = ({ title, description }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <h3 className="font-medium text-gray-700">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{description}</p>
  </div>
);

export const MainContent = () => {
  const { activeItem, userRole } = useSidebar();
  
  // If the content for the active item doesn't exist, fall back to statistics
  const content = contentData[activeItem] || contentData.statistics;
  
  // Generate some dynamic sample data based on the active item
  const generateSampleData = (item, role) => {
    return [
      {
        title: `${item.charAt(0).toUpperCase() + item.slice(1)} Item 1`,
        description: `Sample ${item} data for ${role} role`
      },
      {
        title: `${item.charAt(0).toUpperCase() + item.slice(1)} Item 2`,
        description: `More ${item} information related to ${role}s`
      },
      {
        title: `${item.charAt(0).toUpperCase() + item.slice(1)} Item 3`,
        description: `Additional ${item} insights for ${role}s`
      }
    ];
  };
  
  const sampleData = generateSampleData(activeItem, userRole);
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {content.title}
        </h2>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-sm font-medium text-gray-700">
                Current View: {content.title}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Account
            </span>
          </div>
          
          <p className="text-gray-600 mb-6">
            {content.content}
          </p>
          
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sampleData.map((item, index) => (
              <ResultItem 
                key={index} 
                title={item.title} 
                description={item.description} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};