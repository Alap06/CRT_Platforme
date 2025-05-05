import { useSidebar } from './SidebarContext';

export const NavItem = ({ id, label, icon, notificationCount = 0, onClick }) => {
  const { activeItem, setActiveItem, collapsed, setMobileMenuOpen } = useSidebar();
  const isActive = activeItem === id;
  
  const handleClick = () => {
    setActiveItem(id);
    setMobileMenuOpen(false);
    if (onClick) onClick();
  };
  
  return (
    <button
      onClick={handleClick}
      className={`w-full relative flex items-center px-4 py-3 text-sm font-medium ${
        isActive 
          ? 'bg-red-50 text-red-600 border-r-4 border-red-600' 
          : 'text-gray-700 hover:bg-gray-100'
      } transition-colors duration-200 ease-in-out group`}
    >
      <span className="flex-shrink-0">{icon}</span>
      
      {!collapsed && (
        <span className="ml-3 flex-grow">{label}</span>
      )}
      
      {notificationCount > 0 && (
        collapsed ? (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {notificationCount}
          </span>
        ) : (
          <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {notificationCount}
          </span>
        )
      )}
      
      {collapsed && (
        <span className="absolute left-full ml-2 p-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50 whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
};

export const MobileNavItem = ({ id, label, icon, notificationCount = 0, onClick }) => {
  const { activeItem, setActiveItem, setMobileMenuOpen } = useSidebar();
  const isActive = activeItem === id;
  
  const handleClick = () => {
    setActiveItem(id);
    setMobileMenuOpen(false);
    if (onClick) onClick();
  };
  
  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center px-4 py-3 rounded-md text-base font-medium ${
        isActive 
          ? 'bg-red-50 text-red-600' 
          : 'text-gray-700 hover:bg-gray-100'
      } transition-colors duration-200 ease-in-out`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
      {notificationCount > 0 && (
        <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {notificationCount}
        </span>
      )}
    </button>
  );
};