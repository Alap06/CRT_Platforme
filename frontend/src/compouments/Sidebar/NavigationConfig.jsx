import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    Settings,
    LogOut,
    Activity,
    Send,
    Heart,
    PieChart,
    Clock
  } from 'lucide-react';
  
  // Notifications data (in a real app, this would come from an API)
  const notifications = {
    statistics: 5,
    users: 2,
    activities: 3,
    reports: 0,
    settings: 1,
    calendar: 2,
    requests: 4,
    donations: 7,
    socialCases: 3
  };
  
  export const navigationConfig = [
    {
      role: 'admin',
      items: [
        {
          id: 'statistics',
          label: 'Statistics',
          icon: <LayoutDashboard size={20} />,
          notifications: notifications.statistics
        },
        {
          id: 'users',
          label: 'User Management',
          icon: <Users size={20} />,
          notifications: notifications.users
        },
        {
          id: 'activities',
          label: 'Activities',
          icon: <Activity size={20} />,
          notifications: notifications.activities
        },
        {
          id: 'reports',
          label: 'Reports & Documents',
          icon: <FileText size={20} />,
          notifications: notifications.reports
        },
        {
          id: 'logout',
          label: 'Logout',
          icon: <LogOut size={20} />
        }
      ]
    },
    {
      role: 'volunteer',
      items: [
        {
          id: 'statistics',
          label: 'Statistics',
          icon: <PieChart size={20} />,
          notifications: notifications.statistics
        },
        {
          id: 'activities',
          label: 'Activities',
          icon: <Activity size={20} />,
          notifications: notifications.activities
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: <Calendar size={20} />,
          notifications: notifications.calendar
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings size={20} />,
          notifications: notifications.settings
        }
      ]
    },
    {
      role: 'partner',
      items: [
        {
          id: 'requests',
          label: 'Requests',
          icon: <Send size={20} />,
          notifications: notifications.requests
        },
        {
          id: 'activities',
          label: 'Activities',
          icon: <Activity size={20} />,
          notifications: notifications.activities
        }
      ]
    },
    {
      role: 'donor',
      items: [
        {
          id: 'donations',
          label: 'Donations',
          icon: <Heart size={20} />,
          notifications: notifications.donations
        },
        {
          id: 'statistics',
          label: 'Statistics',
          icon: <PieChart size={20} />,
          notifications: notifications.statistics
        },
        {
          id: 'socialCases',
          label: 'Social Cases',
          icon: <Clock size={20} />,
          notifications: notifications.socialCases
        }
      ]
    }
  ];
  
  // Content data for each navigation item
  export const contentData = {
    statistics: { 
      title: "Statistics Dashboard", 
      content: "Overview of key metrics and performance indicators" 
    },
    users: { 
      title: "User Management", 
      content: "Add, edit, and manage user accounts and permissions" 
    },
    activities: { 
      title: "Activities Calendar", 
      content: "Upcoming and past activities, events, and volunteer opportunities" 
    },
    reports: { 
      title: "Reports & Documents", 
      content: "Access and generate reports and important documentation" 
    },
    settings: { 
      title: "System Settings", 
      content: "Configure application preferences and account settings" 
    },
    calendar: { 
      title: "Calendar", 
      content: "View and manage your scheduled activities and events" 
    },
    requests: { 
      title: "Partner Requests", 
      content: "Manage incoming requests and collaborations with partners" 
    },
    donations: { 
      title: "Donations", 
      content: "Track donation history and manage contribution campaigns" 
    },
    socialCases: { 
      title: "Social Cases", 
      content: "View and manage active social assistance cases" 
    },
    logout: { 
      title: "Logout", 
      content: "You have been logged out successfully" 
    }
  };