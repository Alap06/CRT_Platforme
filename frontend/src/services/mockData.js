// src/services/mockData.js

export const mockVolunteers = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '06 12 34 56 78',
      skills: ['First Aid', 'Logistics'],
      status: 'active',
      joinDate: '2023-01-15'
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Laurent',
      email: 'marie.laurent@email.com',
      phone: '07 23 45 67 89',
      skills: ['Translation', 'Teaching'],
      status: 'active',
      joinDate: '2023-02-20'
    },
    // Ajoutez 8 autres volontaires...
    {
      id: 10,
      firstName: 'Ahmed',
      lastName: 'Benmoussa',
      email: 'ahmed.b@email.com',
      phone: '06 98 76 54 32',
      skills: ['Driving', 'Construction'],
      status: 'pending',
      joinDate: '2023-05-10'
    }
  ];
  
  export const mockActivities = [
    {
      id: 1,
      title: 'Medical Camp in Nefta',
      description: 'Free medical checkups and basic treatments for local community',
      startDate: '2023-06-15T09:00:00',
      endDate: '2023-06-15T17:00:00',
      location: {
        name: 'Nefta Community Center',
        address: 'Rue de la République, Nefta'
      },
      requiredSkills: ['First Aid', 'Nursing'],
      status: 'planned',
      volunteersAssigned: [1, 3, 5]
    },
    {
      id: 2,
      title: 'School Renovation Project',
      description: 'Painting and minor repairs for local primary school',
      startDate: '2023-06-20T08:00:00',
      endDate: '2023-06-22T16:00:00',
      location: {
        name: 'El Hamma Primary School',
        address: 'Avenue Habib Bourguiba, El Hamma'
      },
      requiredSkills: ['Construction', 'Painting'],
      status: 'in-progress',
      volunteersAssigned: [2, 4, 7]
    },
    // Ajoutez 8 autres activités...
    {
      id: 10,
      title: 'Food Distribution',
      description: 'Monthly food distribution to families in need',
      startDate: '2023-07-05T10:00:00',
      endDate: '2023-07-05T14:00:00',
      location: {
        name: 'Tozeur Central Mosque',
        address: 'Place de la République, Tozeur'
      },
      requiredSkills: ['Organization', 'Communication'],
      status: 'completed',
      volunteersAssigned: [1, 2, 3, 8]
    }
  ];
  
  export const mockUser = {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@croissantrouge.tn',
    role: 'admin',
    lastLogin: '2023-06-10T14:30:00'
  };
  
  // Données pour les graphiques
  export const chartData = {
    monthlySummary: [
      { name: 'Jan', activities: 12, volunteers: 28 },
      { name: 'Feb', activities: 19, volunteers: 33 },
      { name: 'Mar', activities: 15, volunteers: 29 },
      { name: 'Apr', activities: 18, volunteers: 35 },
      { name: 'May', activities: 22, volunteers: 42 },
    ],
    volunteersBySkill: [
      { skill: 'Medical', count: 12 },
      { skill: 'Logistics', count: 18 },
      { skill: 'Education', count: 8 },
      { skill: 'Technical', count: 15 },
      { skill: 'Languages', count: 25 },
    ],
    activityTypes: [
      { name: 'Health', value: 35 },
      { name: 'Education', value: 20 },
      { name: 'Environment', value: 15 },
      { name: 'Disaster Relief', value: 10 },
      { name: 'Others', value: 20 },
    ]
  };
  
  // Statistiques synthétiques
  export const statistics = {
    totalVolunteers: 124,
    activeVolunteers: 98,
    upcomingActivities: 7,
    completedActivitiesThisMonth: 15
  };