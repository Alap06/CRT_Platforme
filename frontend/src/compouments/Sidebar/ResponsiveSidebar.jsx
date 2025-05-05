import { useState } from 'react';
import { Menu, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { navigationConfig } from './NavigationConfig';
import { NavItem, MobileNavItem } from './NavItem';
import { MainContent } from './MainContent';

// Role selector for demo purposes
const RoleSelector = () => {
  const { userRole, setUserRole } = useSidebar();
  
  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
  };
  
  return (
    <div className="px-4 py-3 border-t border-gray-200">
      <label htmlFor="role-select" className="block text-xs font-medium text-gray-500 mb-1">
        Demo: Switch Role
      </label>
      <select
        id="role-select"
        value={userRole}
        onChange={handleRoleChange}
        className="block w-full rounded-md text-sm border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
      >
        <option value="admin">Admin</option>
        <option value="volunteer">Volunteer</option>
        <option value="partner">Partner</option>
        <option value="donor">Donor</option>
      </select>
    </div>
  );
};

// Menu toggle button for mobile
const MenuToggle = () => {
  const { mobileMenuOpen, setMobileMenuOpen } = useSidebar();
  
  return (
    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
      aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
    >
      {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};

// Desktop sidebar component
const DesktopSidebar = () => {
  const { collapsed, setCollapsed, userRole } = useSidebar();
  
  // Get navigation items for current role
  const roleConfig = navigationConfig.find(config => config.role === userRole);
  const navItems = roleConfig?.items || [];
  
  return (
    <aside 
      className={`bg-white shadow-sm hidden md:flex md:flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 flex justify-end">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <nav className="mt-2 px-2 space-y-1 flex-grow">
        {navItems.map(item => (
          <NavItem 
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            notificationCount={item.notifications}
          />
        ))}
      </nav>
      
      {!collapsed && <RoleSelector />}
    </aside>
  );
};

// Mobile sidebar overlay
const MobileSidebar = () => {
  const { mobileMenuOpen, setMobileMenuOpen, userRole } = useSidebar();
  
  // Get navigation items for current role
  const roleConfig = navigationConfig.find(config => config.role === userRole);
  const navItems = roleConfig?.items || [];
  
  if (!mobileMenuOpen) return null;
  
  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div 
        className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
        onClick={() => setMobileMenuOpen(false)}
      ></div>
      
      <div className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-white shadow-xl">
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-red-600">CRT Tozeur</h2>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <MobileNavItem 
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              notificationCount={item.notifications}
            />
          ))}
        </nav>
        
        <RoleSelector />
      </div>
    </div>
  );
};

// Header component
const Header = () => {
  const userName = "John Doe"; // In a real app, this would come from auth context
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <MenuToggle />
            <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
              <h1 className="text-xl font-bold text-red-600">CRT Tozeur</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-sm text-gray-700">{userName}</span>
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-medium text-sm">
                {userName.split(' ').map(name => name[0]).join('')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Main sidebar component that wraps everything
const ResponsiveSidebarContent = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <DesktopSidebar />
        <MobileSidebar />
        
        <main className="flex-1 overflow-auto bg-gray-50">
          <MainContent />
        </main>
      </div>
    </div>
  );
};

// Export the sidebar with its provider
export default function ResponsiveSidebar({ initialRole = 'admin' }) {
  return (
    <SidebarProvider initialRole={initialRole}>
      <ResponsiveSidebarContent />
    </SidebarProvider>
  );
}