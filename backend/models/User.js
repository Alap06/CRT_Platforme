const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { promisify } = require('util');

class User {
  constructor(db) {
    this.db = db;
  }

  // Méthode pour hacher un mot de passe
  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  // Méthode pour comparer les mots de passe
  static async comparePasswords(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  // Méthode pour créer un token de réinitialisation
  static createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    return { resetToken, hashedToken, resetExpires };
  }

  // Trouver un utilisateur par email
  async findByEmail(email) {
    const [rows] = await this.db.execute(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );
    return rows[0] || null;
  }

  // Trouver un utilisateur par ID
  async findById(id) {
    const [rows] = await this.db.execute(
      'SELECT * FROM users WHERE id = ?', 
      [id]
    );
    return rows[0] || null;
  }

  // Créer un nouvel utilisateur
  async create(userData) {
    const hashedPassword = await User.hashPassword(userData.password);
    
    const [result] = await this.db.execute(
      `INSERT INTO users 
      (first_name, last_name, email, phone, password, cin, governorate, city, postal_code, role, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phone,
        hashedPassword,
        userData.cin,
        userData.governorate,
        userData.city,
        userData.postalCode,
        userData.role || 'benevole',
        userData.status || 'pending'
      ]
    );

    return this.findById(result.insertId);
  }

  // Mettre à jour un utilisateur
  async update(id, updateData) {
    if (updateData.password) {
      updateData.password = await User.hashPassword(updateData.password);
      updateData.password_changed_at = new Date();
    }

    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      // Convertir camelCase en snake_case pour les noms de colonnes
      const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      fields.push(`${dbKey} = ?`);
      values.push(value);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    await this.db.execute(query, values);
    return this.findById(id);
  }

  // Vérifier si le mot de passe a été changé après une date donnée
  changedPasswordAfter(JWTTimestamp, passwordChangedAt) {
    if (passwordChangedAt) {
      const changedTimestamp = Math.floor(passwordChangedAt.getTime() / 1000);
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  }
}

module.exports = User;