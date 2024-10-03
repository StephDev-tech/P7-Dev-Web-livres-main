import { Router } from "express";// Importation du module 'Router' d'Express pour gérer les routes
const router = Router();// Création d'une instance de Router
// Importation des middlewares pour l'authentification, la gestion des fichiers et le traitement des images
import auth from '../middleware/auth.js';
import multer from '../middleware/multer-config.js';
import {compressAndResizeImage} from '../middleware/sharp.js'
import { getAllBooks, getOneBook, createBook, modifyBook, deleteBook, rateBook, bestRatedBooks} from "../controllers/books.js";// Importation des fonctions du contrôleur pour gérer les livres

router.get("/", getAllBooks);// Route pour récupérer tous les livres
router.get("/bestrating", bestRatedBooks)// Route pour récupérer les livres ayant les meilleures notes
router.get("/:id", getOneBook);// Route pour récupérer un livre spécifique par son ID
router.post("/", auth, multer, compressAndResizeImage, createBook);// Route pour créer un nouveau livre (authentification requise, gestion du fichier image, et traitement de l'image)
router.post("/:id/rating", auth, rateBook)// Route pour évaluer un livre (authentification requise)
router.put("/:id", auth, multer, compressAndResizeImage, modifyBook);// Route pour modifier un livre existant (authentification requise, gestion du fichier image, et traitement de l'image)
router.delete("/:id", auth, multer, deleteBook);// Route pour supprimer un livre (authentification requise et gestion du fichier image)

// Exportation du routeur pour qu'il soit utilisé dans d'autres parties de l'application
export default router;
