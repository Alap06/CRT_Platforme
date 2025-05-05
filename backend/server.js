const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2/promise'); // Utilisation de mysql2 avec promesses
require('dotenv').config();
 
// Import des routes
const apiRoutes = require('./routes/index');

// Configuration de la connexion MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_volontaire',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Vérification de la connexion à MySQL
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connexion à MySQL établie avec succès');
    connection.release();
  } catch (err) {
    console.error('Erreur de connexion à MySQL:', err);
    process.exit(1);
  }
}
testConnection();

// Initialisation de l'app Express
const app = express();

// Middleware pour injecter la connexion DB dans les requêtes
app.use(async (req, res, next) => {
  try {
    req.db = await pool.getConnection();
    next();
  } catch (err) {
    console.error('Erreur lors de l\'obtention de la connexion:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur de connexion à la base de données'
    });
  }
});

// Middleware pour libérer la connexion après chaque requête
app.use((req, res, next) => {
  if (req.db) req.db.release();
  next();
});

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
const corsOptions = {
  origin: [process.env.CLIENT_URL, process.env.CORS_ORIGIN],
  credentials: true ,// Important si vous utilisez withCredentials: true
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite de 100 requêtes par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

// Middleware de base
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Montage des routes principales
app.use('/api', limiter, apiRoutes);

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    code: 'ROUTE_NOT_FOUND'
  });
});

// Gestion des erreurs serveur
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Libérer la connexion en cas d'erreur
  if (req.db) req.db.release();
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Erreur serveur',
    code: err.code || 'SERVER_ERROR',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Fermeture propre du pool à l'arrêt de l'application
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Pool MySQL fermé proprement');
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de la fermeture du pool MySQL:', err);
    process.exit(1);
  }
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;