const User = require('../models/User');

exports.getPendingUsers = async (req, res) => {
  try {
    // Récupération des utilisateurs en attente
    const users = await User.find({ status: 'pending' })
      .select('firstName lastName email phone cin governorate city postalCode createdAt');

    // Formatage de la réponse
    res.json({
      success: true,
      data: users,
      count: users.length,
      message: `${users.length} utilisateurs en attente de validation`
    });

  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validation des rôles autorisés
    const allowedRoles = ['benevole', 'donateur', 'partenaire', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rôle non autorisé',
        allowedRoles
      });
    }

    // Mise à jour du rôle et du statut
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role, status: 'approved' },
      { new: true, runValidators: true }
    ).select('firstName lastName email role status');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Rôle utilisateur mis à jour avec succès',
      data: updatedUser
    });

  } catch (err) {
    console.error('Erreur lors de la mise à jour du rôle:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du rôle',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select('firstName lastName email role status');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Statut utilisateur mis à jour avec succès',
      data: updatedUser
    });

  } catch (err) {
    console.error('Erreur lors de la mise à jour du statut:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    const approvedUsers = await User.countDocuments({ status: 'approved' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        pendingUsers,
        approvedUsers,
        suspendedUsers,
        usersByRole: usersByRole.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des statistiques:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('firstName lastName email role status createdAt');

    // Statistiques utilisateurs
    const stats = {
      total: await User.countDocuments(),
      pending: await User.countDocuments({ status: 'pending' }),
      approved: await User.countDocuments({ status: 'approved' }),
      suspended: await User.countDocuments({ status: 'suspended' })
    };

    res.json({
      success: true,
      data: {
        recentUsers,
        stats
      }
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des données du tableau de bord:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données du tableau de bord'
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status } = req.query;
    
    // Construire le filtre
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    
    // Calculer le nombre total d'utilisateurs correspondant au filtre
    const total = await User.countDocuments(filter);
    
    // Récupérer les utilisateurs paginés
    const users = await User.find(filter)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('firstName lastName email role status createdAt');
    
    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
};