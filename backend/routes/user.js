import { Router } from 'express'// Importation du module 'Router' d'Express pour gérer les routes
const router = Router()// Création d'une instance de Router
import { signup, login } from '../controllers/user.js'// Importation des fonctions de contrôleur pour la gestion des utilisateurs

// Route pour l'inscription des utilisateurs
// Cette route déclenche la fonction 'signup' dans le contrôleur pour créer un nouvel utilisateur
router.post('/signup', signup)
// Route pour la connexion des utilisateurs
// Cette route déclenche la fonction 'login' dans le contrôleur pour authentifier un utilisateur existant
router.post('/login', login)

// Exportation du routeur pour qu'il soit utilisé dans d'autres parties de l'application
export default router