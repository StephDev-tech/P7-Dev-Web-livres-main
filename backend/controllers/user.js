// Importation des fonctions 'hash' et 'compare' depuis 'bcrypt' pour hacher et comparer les mots de passe
import { hash as _hash, compare } from 'bcrypt';

// Importation de 'jsonwebtoken' pour gérer les tokens JWT
import pkg from 'jsonwebtoken';
const { sign } = pkg;  // Extraction de la fonction 'sign' pour créer des tokens JWT

// Importation du modèle 'User' pour interagir avec la collection 'users' dans MongoDB
import User from '../models/User.js';  

// Importation de 'dotenv' pour charger les variables d'environnement depuis un fichier .env
import dotenv from 'dotenv';
dotenv.config();

// Récupération de la clé secrète JWT depuis les variables d'environnement
// eslint-disable-next-line no-undef
const jwtSecret = process.env.JWT_SECRET;

/**
 * Fonction 'signup' pour gérer l'inscription des utilisateurs
 * - Hache le mot de passe fourni avant de le stocker dans la base de données
 * - Sauvegarde le nouvel utilisateur avec l'email et le mot de passe haché
 */
const signup = (req, res) => {
    // Hachage du mot de passe avec un facteur de coût de 10
    _hash(req.body.password, 10)
    .then(hash => {
        // Création d'une nouvelle instance du modèle 'User' avec l'email et le mot de passe haché
        const user = new User({
            email: req.body.email,
            password: hash
        });

        // Sauvegarde de l'utilisateur dans la base de données
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé' }))  // Succès : utilisateur créé
        .catch(error => res.status(400).json({ error }));  // Erreur : problème lors de la sauvegarde
    })
    .catch(error => res.status(500).json({ error }));  // Erreur : problème lors du hachage du mot de passe
};

/**
 * Fonction 'login' pour gérer la connexion des utilisateurs
 * - Vérifie si l'utilisateur existe dans la base de données
 * - Compare le mot de passe fourni avec celui stocké (haché)
 * - Génère un token JWT si les informations sont valides
 */
const login = (req, res) => {
    // Recherche l'utilisateur dans la base de données par email
    User.findOne({ email: req.body.email })
    .then(user => {
        // Si l'utilisateur n'existe pas, renvoie un message d'erreur
        if (user === null) {
            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
        } else {
            // Compare le mot de passe fourni avec le mot de passe haché de l'utilisateur
            compare(req.body.password, user.password)
            .then(valid => {
                // Si le mot de passe est incorrect, renvoie un message d'erreur
                if (!valid) {
                    res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
                } else {
                    // Si le mot de passe est correct, génère un token JWT valide pour 24h
                    res.status(200).json({
                        userId: user._id,  // ID de l'utilisateur
                        token: sign(
                            { userId: user._id },  // Payload du token contenant l'ID utilisateur
                            jwtSecret,  // Utilise la clé secrète pour signer le token
                            { expiresIn: '24h' }  // Le token expire dans 24 heures
                        )
                    });
                }
            })
            .catch(error => {
                // En cas d'erreur lors de la comparaison des mots de passe
                res.status(500).json({ error });
            });
        }
    })
    .catch(error => {
        // En cas d'erreur lors de la recherche de l'utilisateur dans la base de données
        res.status(500).json({ error });
    });
};

// Exportation des fonctions 'signup' et 'login' pour les utiliser dans les routes de l'application
export { signup, login };
