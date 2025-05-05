const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db'); // Import de la fonction de connexion Mongoose
require('dotenv').config();

// Import des routes
const apiRoutes = require('./routes/index');

// Import the debug middleware
const { debugRequest } = require('./middlewares/debugMiddleware');

// Connexion à MongoDB
connectDB();

// Initialisation de l'app Express
const app = express();

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
const corsOptions = {
  origin: [process.env.CLIENT_URL, process.env.CORS_ORIGIN],
  credentials: true,
  optionsSuccessStatus: 200
};

// Update CORS to be more permissive in development
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: true, // Allow any origin in development
    credentials: true
  }));
} else {
  // Use the configured CORS in production
  app.use(cors(corsOptions));
}

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

// Apply debug middleware before body parser
if (process.env.NODE_ENV === 'development') {
  app.use(debugRequest);
}

// Middleware de base
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Improve body parsing with more flexibility
app.use(express.json({ 
  limit: '10kb', 
  strict: false,
  reviver: (key, value) => value
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10kb' 
}));

app.use(cookieParser());

// Add body-parser raw for debugging
app.use((req, res, next) => {
  // Log raw body for debugging if content-type is not recognized
  if (req.method === 'POST' && !req.body && req._body === false) {
    console.log('Raw body parsing needed - content type:', req.headers['content-type']);
    
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    
    req.on('end', () => {
      console.log('Raw request body:', data);
      try {
        req.body = JSON.parse(data);
      } catch (e) {
        console.log('Failed to parse raw body');
      }
      next();
    });
  } else {
    next();
  }
});

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
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Erreur serveur',
    code: err.code || 'SERVER_ERROR',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Gestion propre des erreurs
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('Process terminated!');
    });
  }
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV || 'development'}`);
});

// Export the app directly for supertest to work properly
module.exports = app;

// Keep the object export for backward compatibility
module.exports.server = server;