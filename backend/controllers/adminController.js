exports.getPendingUsers = async (req, res) => {
  try {
    // 1. Récupération des utilisateurs en attente
    const [users] = await req.db.query(
      `SELECT id, firstName, lastName, email, phone, cin, governorate, city, postalCode, createdAt 
       FROM users 
       WHERE status = 'pending'`
    );

    // 2. Formatage de la réponse
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
    const { userId, role } = req.body;

    // 1. Validation des rôles autorisés
    const allowedRoles = ['benevole', 'donateur', 'partenaire', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rôle non autorisé',
        allowedRoles
      });
    }

    // 2. Vérification de l'existence de l'utilisateur
    const [userCheck] = await req.db.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (userCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // 3. Mise à jour du rôle et du statut
    await req.db.query(
      'UPDATE users SET userType = ?, status = ? WHERE id = ?',
      [role, 'approved', userId]
    );

    // 4. Récupération des données mises à jour
    const [updatedUser] = await req.db.query(
      `SELECT id, firstName, lastName, email, userType, status 
       FROM users WHERE id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Rôle utilisateur mis à jour avec succès',
      data: updatedUser[0]
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

// Nouvelle méthode pour les statistiques admin
exports.getAdminStats = async (req, res) => {
  try {
    // Exemple de statistiques
    const [[{totalUsers}]] = await req.db.query(
      'SELECT COUNT(*) as totalUsers FROM users'
    );
    
    const [[{pendingUsers}]] = await req.db.query(
      `SELECT COUNT(*) as pendingUsers FROM users WHERE status = 'pending'`
    );

    res.json({
      success: true,
      data: {
        totalUsers,
        pendingUsers,
        // Ajouter d'autres statistiques au besoin
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