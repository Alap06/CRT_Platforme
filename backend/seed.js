const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Activity = require('./models/Activity');
const Donation = require('./models/Donation');
const Project = require('./models/Project');
const Committee = require('./models/Committee');
const News = require('./models/News');
const Contact = require('./models/Contact');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/CRT_Touzer')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Seed Data
const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Activity.deleteMany({}),
            Donation.deleteMany({}),
            Project.deleteMany({}),
            Committee.deleteMany({}),
            News.deleteMany({}),
            Contact.deleteMany({})
        ]);
        console.log('✓ Cleared existing data');

        // Create Users - password will be hashed by User model's pre-save hook
        const password = 'password123';
        const users = await User.create([
            { firstName: 'Admin', lastName: 'CRT', email: 'admin@crt-tozeur.tn', password, role: 'admin', status: 'approved', phone: '76123456', cin: '12345678' },
            { firstName: 'Mohamed', lastName: 'Ben Ali', email: 'benevole1@crt-tozeur.tn', password, role: 'benevole', status: 'approved', phone: '76234567', cin: '23456789' },
            { firstName: 'Fatma', lastName: 'Trabelsi', email: 'benevole2@crt-tozeur.tn', password, role: 'benevole', status: 'approved', phone: '76345678', cin: '34567890' },
            { firstName: 'Ahmed', lastName: 'Karoui', email: 'benevole3@crt-tozeur.tn', password, role: 'benevole', status: 'approved', phone: '76456789', cin: '45678901' },
            { firstName: 'Leila', lastName: 'Mansouri', email: 'donateur1@crt-tozeur.tn', password, role: 'donateur', status: 'approved', phone: '76567890', cin: '56789012' },
            { firstName: 'Karim', lastName: 'Bouazizi', email: 'donateur2@crt-tozeur.tn', password, role: 'donateur', status: 'approved', phone: '76678901', cin: '67890123' },
            { firstName: 'Sara', lastName: 'Jebali', email: 'partenaire1@crt-tozeur.tn', password, role: 'partenaire', status: 'approved', phone: '76789012', cin: '78901234' },
            { firstName: 'Youssef', lastName: 'Hamdi', email: 'partenaire2@crt-tozeur.tn', password, role: 'partenaire', status: 'approved', phone: '76890123', cin: '89012345' },
            { firstName: 'Nadia', lastName: 'Ammar', email: 'benevole4@crt-tozeur.tn', password, role: 'benevole', status: 'pending', phone: '76901234', cin: '90123456' },
            { firstName: 'Slim', lastName: 'Ben Salem', email: 'benevole5@crt-tozeur.tn', password, role: 'benevole', status: 'pending', phone: '76012345', cin: '01234567' },
        ]);
        console.log(`✓ Created ${users.length} users`);

        const admin = users[0];
        const volunteers = users.filter(u => u.role === 'benevole');
        const donors = users.filter(u => u.role === 'donateur');
        const partners = users.filter(u => u.role === 'partenaire');

        // Create Committee
        const committee = await Committee.create({
            name: 'Comité Régional Tozeur',
            type: 'regional',
            governorate: 'Tozeur',
            city: 'Tozeur',
            status: 'active',
            president: admin._id,
            members: volunteers.slice(0, 3).map(v => ({ user: v._id, role: 'Membre actif' })),
            contact: { address: 'Avenue Habib Bourguiba, Tozeur', phone: '76450123', email: 'contact@crt-tozeur.tn' },
            foundedAt: new Date('1999-03-15'),
            description: 'Comité régional du Croissant Rouge Tunisien pour le gouvernorat de Tozeur'
        });
        console.log('✓ Created committee');

        // Create Activities
        const activities = await Activity.create([
            {
                title: 'Formation Premiers Secours PSC1',
                description: 'Formation complète aux gestes de premiers secours pour les nouveaux bénévoles. Apprenez à réagir face aux situations d\'urgence.',
                type: 'formation',
                status: 'planned',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
                location: { address: 'Centre de formation CRT', city: 'Tozeur', governorate: 'Tozeur' },
                organizer: admin._id,
                committee: committee._id,
                volunteers: [{ user: volunteers[0]._id, status: 'confirmed' }, { user: volunteers[1]._id, status: 'registered' }],
                maxVolunteers: 20,
                requirements: ['Carte d\'identité', 'Tenue confortable'],
                isPublic: true
            },
            {
                title: 'Collecte de Sang - Hôpital Régional',
                description: 'Grande campagne de don de sang en partenariat avec l\'hôpital régional. Venez sauver des vies !',
                type: 'sante',
                status: 'planned',
                date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                location: { address: 'Hôpital Régional', city: 'Tozeur', governorate: 'Tozeur' },
                organizer: admin._id,
                committee: committee._id,
                volunteers: [{ user: volunteers[2]._id, status: 'registered' }],
                maxVolunteers: 15,
                isPublic: true,
                beneficiaries: { count: 100, description: 'Patients nécessitant des transfusions' }
            },
            {
                title: 'Distribution de Paniers Ramadan',
                description: 'Distribution de paniers alimentaires aux familles dans le besoin pendant le mois sacré de Ramadan.',
                type: 'social',
                status: 'planned',
                date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                location: { city: 'Tozeur', governorate: 'Tozeur' },
                organizer: volunteers[0]._id,
                committee: committee._id,
                maxVolunteers: 25,
                isPublic: true,
                beneficiaries: { count: 200, description: 'Familles défavorisées' }
            },
            {
                title: 'Sensibilisation aux Dangers de la Route',
                description: 'Campagne de sensibilisation auprès des jeunes conducteurs sur les dangers de la route.',
                type: 'sensibilisation',
                status: 'ongoing',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                location: { address: 'Place de l\'Indépendance', city: 'Tozeur', governorate: 'Tozeur' },
                organizer: admin._id,
                committee: committee._id,
                isPublic: true
            },
            {
                title: 'Intervention d\'urgence - Inondations Nefta',
                description: 'Mobilisation des équipes d\'intervention suite aux inondations dans la région de Nefta.',
                type: 'urgence',
                status: 'completed',
                date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                location: { city: 'Nefta', governorate: 'Tozeur' },
                organizer: admin._id,
                committee: committee._id,
                volunteers: volunteers.map(v => ({ user: v._id, status: 'attended' })),
                isPublic: true,
                beneficiaries: { count: 150, description: 'Familles sinistrées' }
            }
        ]);
        console.log(`✓ Created ${activities.length} activities`);

        // Create Donations
        const donations = await Donation.create([
            { type: 'money', donor: donors[0]._id, amount: 500, status: 'received', paymentMethod: 'transfer', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), receivedBy: admin._id, receivedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), committee: committee._id },
            { type: 'money', donor: donors[1]._id, amount: 1000, status: 'received', paymentMethod: 'cash', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), receivedBy: admin._id, receivedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), committee: committee._id },
            { type: 'money', donor: donors[0]._id, amount: 250, status: 'received', paymentMethod: 'card', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), receivedBy: admin._id, receivedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), committee: committee._id },
            { type: 'goods', donor: donors[1]._id, goods: { description: 'Vêtements d\'hiver', quantity: 50, unit: 'pièces', estimatedValue: 800 }, status: 'received', date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), committee: committee._id },
            { type: 'blood', donor: volunteers[0]._id, blood: { bloodType: 'O+', quantity: 450 }, status: 'received', date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), committee: committee._id },
            { type: 'money', anonymousDonor: { isAnonymous: true }, amount: 2000, status: 'received', paymentMethod: 'transfer', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), receivedBy: admin._id, receivedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), committee: committee._id },
            { type: 'money', donor: donors[0]._id, amount: 150, status: 'pending', paymentMethod: 'online', date: new Date(), committee: committee._id },
            { type: 'goods', anonymousDonor: { isAnonymous: false, name: 'Société ABC', email: 'contact@abc.tn' }, goods: { description: 'Fournitures scolaires', quantity: 200, unit: 'kits', estimatedValue: 3000 }, status: 'received', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), committee: committee._id }
        ]);
        console.log(`✓ Created ${donations.length} donations`);

        // Create Projects
        const projects = await Project.create([
            {
                title: 'Aide aux Familles Défavorisées 2024',
                description: 'Programme annuel de soutien aux familles dans le besoin incluant distribution alimentaire, aide financière et accompagnement social.',
                shortDescription: 'Soutien complet aux familles vulnérables de la région',
                category: 'social',
                status: 'active',
                manager: admin._id,
                committee: committee._id,
                team: [{ user: volunteers[0]._id, role: 'Coordinateur' }, { user: volunteers[1]._id, role: 'Logistique' }],
                objectives: [{ title: 'Distribuer 500 paniers', achieved: false }, { title: 'Aider 200 familles', achieved: true }],
                budget: { planned: 50000, spent: 25000 },
                timeline: { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') },
                progress: 52,
                beneficiaries: { target: 500, reached: 280, description: 'Familles défavorisées' },
                location: { city: 'Tozeur', governorate: 'Tozeur' },
                isPublic: true,
                isFeatured: true
            },
            {
                title: 'Campagne de Vaccination Rurale',
                description: 'Campagne de vaccination dans les zones rurales du gouvernorat en partenariat avec le ministère de la santé.',
                shortDescription: 'Vaccinations dans les zones reculées',
                category: 'health',
                status: 'active',
                manager: volunteers[0]._id,
                committee: committee._id,
                team: [{ user: volunteers[2]._id, role: 'Médecin' }],
                budget: { planned: 30000, spent: 12000 },
                timeline: { startDate: new Date('2024-03-01'), endDate: new Date('2024-09-30') },
                progress: 40,
                beneficiaries: { target: 2000, reached: 800 },
                location: { governorate: 'Tozeur', areas: ['Degache', 'Hazoua', 'Tameghza'] },
                isPublic: true,
                isFeatured: true
            },
            {
                title: 'Formation des Jeunes Secouristes',
                description: 'Programme de formation des jeunes aux techniques de secourisme et aux valeurs humanitaires.',
                category: 'education',
                status: 'planned',
                manager: admin._id,
                committee: committee._id,
                budget: { planned: 15000, spent: 0 },
                timeline: { startDate: new Date('2024-09-01'), endDate: new Date('2025-06-30') },
                progress: 0,
                beneficiaries: { target: 100 },
                isPublic: true
            },
            {
                title: 'Rénovation du Centre Local Nefta',
                description: 'Travaux de rénovation et d\'équipement du centre local de Nefta.',
                category: 'infrastructure',
                status: 'completed',
                manager: admin._id,
                committee: committee._id,
                budget: { planned: 80000, spent: 75000 },
                timeline: { startDate: new Date('2023-06-01'), endDate: new Date('2023-12-15'), actualEndDate: new Date('2023-12-10') },
                progress: 100,
                isPublic: true
            }
        ]);
        console.log(`✓ Created ${projects.length} projects`);

        // Create News
        const news = await News.create([
            {
                title: 'Succès de la Campagne de Don de Sang',
                slug: 'succes-campagne-don-sang-2024',
                summary: 'Plus de 150 donneurs ont participé à notre campagne de don de sang ce week-end.',
                content: 'Notre campagne de don de sang organisée en partenariat avec l\'hôpital régional a été un véritable succès. Plus de 150 donneurs volontaires ont répondu à l\'appel, permettant de collecter des poches de sang qui sauveront de nombreuses vies.\n\nLe directeur de l\'hôpital a salué l\'engagement des bénévoles du Croissant Rouge et a souligné l\'importance de ces campagnes régulières pour maintenir les réserves de sang à un niveau suffisant.\n\nNous remercions tous les participants et nous vous donnons rendez-vous pour la prochaine campagne prévue en mars.',
                author: admin._id,
                category: 'news',
                status: 'published',
                featured: true,
                publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                tags: ['don de sang', 'santé', 'bénévolat']
            },
            {
                title: 'Formation aux Premiers Secours - Session de Janvier',
                summary: 'Inscrivez-vous à notre prochaine session de formation PSC1.',
                content: 'Le Croissant Rouge de Tozeur organise une nouvelle session de formation aux premiers secours (PSC1) le samedi 20 janvier 2024.\n\nCette formation intensive d\'une journée vous permettra d\'acquérir les gestes qui sauvent et de pouvoir intervenir efficacement en cas d\'urgence.\n\nPlaces limitées à 20 participants. Inscription gratuite pour les membres.',
                author: admin._id,
                category: 'event',
                status: 'published',
                publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                tags: ['formation', 'premiers secours']
            },
            {
                title: 'Bilan Annuel 2023 - Une Année Riche en Actions',
                summary: 'Retour sur les réalisations du Croissant Rouge Tozeur en 2023.',
                content: 'L\'année 2023 a été marquée par de nombreuses actions humanitaires menées par notre comité régional.\n\n**En chiffres:**\n- 1500 familles aidées\n- 45 formations organisées\n- 320 nouveaux bénévoles formés\n- 8 interventions d\'urgence\n\nNous tenons à remercier tous nos bénévoles, donateurs et partenaires qui rendent ces actions possibles.',
                author: admin._id,
                category: 'announcement',
                status: 'published',
                featured: true,
                publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                tags: ['bilan', '2023', 'réalisations']
            },
            {
                title: 'Appel aux Dons - Hiver Solidaire',
                summary: 'Aidez les familles démunies à affronter l\'hiver.',
                content: 'Avec l\'arrivée de l\'hiver, de nombreuses familles de notre région font face à des difficultés pour se chauffer et s\'habiller.\n\nLe Croissant Rouge lance un appel aux dons pour sa campagne "Hiver Solidaire".\n\n**Nous collectons:**\n- Vêtements chauds (toutes tailles)\n- Couvertures\n- Produits alimentaires non périssables\n- Dons financiers\n\nPoint de collecte : Siège du Croissant Rouge, Avenue Habib Bourguiba',
                author: admin._id,
                category: 'campaign',
                status: 'published',
                publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                tags: ['dons', 'hiver', 'solidarité']
            }
        ]);
        console.log(`✓ Created ${news.length} news articles`);

        // Create Contact Messages
        const contacts = await Contact.create([
            { name: 'Ali Ben Ammar', email: 'ali.benammar@email.com', phone: '76111222', subject: 'Demande d\'information sur le bénévolat', message: 'Bonjour, je souhaite devenir bénévole au Croissant Rouge. Quelles sont les démarches à suivre ? Merci.', category: 'volunteer', status: 'new', priority: 'normal' },
            { name: 'Société XYZ', email: 'contact@xyz.tn', phone: '76333444', subject: 'Proposition de partenariat', message: 'Notre société souhaite établir un partenariat avec le Croissant Rouge pour des actions sociales. Pouvons-nous organiser une réunion ?', category: 'partnership', status: 'in_progress', priority: 'high', assignedTo: admin._id },
            { name: 'Amel Cherif', email: 'amel.cherif@email.com', subject: 'Remerciements', message: 'Je tiens à remercier les bénévoles qui sont venus en aide à ma famille lors des inondations. Votre soutien a été précieux.', category: 'general', status: 'read', priority: 'low' },
            { name: 'Anonyme', email: 'anonyme@email.com', subject: 'Signalement famille en difficulté', message: 'Je souhaite signaler une famille dans le besoin habitant au quartier El Hamma. Ils ont besoin d\'aide alimentaire urgente.', category: 'other', status: 'new', priority: 'urgent' },
            { name: 'Mohamed Sassi', email: 'mohamed.sassi@email.com', phone: '76555666', subject: 'Don de médicaments', message: 'J\'ai des médicaments non périmés à donner. Comment puis-je procéder ?', category: 'donation', status: 'new', priority: 'normal' }
        ]);
        console.log(`✓ Created ${contacts.length} contact messages`);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📋 Test Credentials:');
        console.log('─────────────────────────────────────');
        console.log('Admin:      admin@crt-tozeur.tn / password123');
        console.log('Bénévole:   benevole1@crt-tozeur.tn / password123');
        console.log('Donateur:   donateur1@crt-tozeur.tn / password123');
        console.log('Partenaire: partenaire1@crt-tozeur.tn / password123');
        console.log('─────────────────────────────────────\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
