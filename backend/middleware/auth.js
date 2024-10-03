// Importation de 'jsonwebtoken' pour gérer les tokens JWT
// Remarque : la syntaxe utilisée ici pour éviter une erreur en console est la déstructuration d'un package complet (pkg)
import pkg from 'jsonwebtoken';
const { verify } = pkg;  // Extraction de la fonction 'verify' pour vérifier les tokens JWT

// Importation de 'dotenv' pour charger les variables d'environnement depuis un fichier .env
import dotenv from 'dotenv'; 

// Chargement des variables d'environnement à partir du fichier .env
dotenv.config();

// Récupération de la clé secrète JWT depuis les variables d'environnement
// eslint-disable-next-line no-undef
const jwtSecret = process.env.JWT_SECRET;

// Middleware d'authentification
export default (req, res, next) => {
    try {
        // Récupération du token d'authentification depuis les en-têtes de la requête
        const token = req.headers.authorization.split(' ')[1];

        // Vérification et décodage du token à l'aide de la clé secrète (jwtSecret)
        const decodedToken = verify(token, jwtSecret);

        // Extraction de l'ID utilisateur (userId) depuis le token décodé
        const userId = decodedToken.userId;

        // Ajout de l'ID utilisateur dans l'objet 'req.auth' pour l'utiliser dans les prochaines middlewares ou routes
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        // En cas d'erreur (ex : token invalide ou inexistant), renvoyer une réponse 401 (Non autorisé)
        res.status(401).json({ error });
    }
};
