
import express from 'express';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import booksRoutes from './routes/books.js';
import userRoutes from './routes/user.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger les variables d'environnement
dotenv.config();

// Déterminer le répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Connexion à MongoDB
 // eslint-disable-next-line no-undef
 const uri = process.env.MONGODB_URI;

connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Middleware pour parser le JSON
app.use(express.json()); // Utilise directement json() de express

// Middleware pour la gestion des CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Routes
app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);

// Middleware pour servir des fichiers statiques
app.use("/images", express.static(join(__dirname, "images")));

export default app;
