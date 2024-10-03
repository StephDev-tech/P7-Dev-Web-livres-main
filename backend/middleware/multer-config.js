// Importation de 'multer' et de 'diskStorage' pour gérer l'upload de fichiers.
import multer, { diskStorage } from 'multer';

// Déclaration des types MIME autorisés avec leur extension respective
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration de l'emplacement de stockage et du nom des fichiers
const storage = diskStorage({
  // Définition du répertoire où les fichiers seront stockés
  destination: (req, file, callback) => {
    // 'images' est le répertoire cible où seront enregistrées les images
    callback(null, 'images');
  },
  
  // Génération du nom du fichier enregistré
  filename: (req, file, callback) => {
    // Remplace les espaces dans le nom original par des underscores (_)
    const name = file.originalname.split(' ').join('_');
    
    // Récupère l'extension appropriée selon le type MIME du fichier
    const extension = MIME_TYPES[file.mimetype];
    
    // Crée le nom final du fichier en ajoutant un timestamp unique pour éviter les doublons
    callback(null, name + Date.now() + '.' + extension);
  }
});

export default multer({storage: storage}).single('image');
