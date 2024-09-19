import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const compressAndResizeImage = async (req, res, next) => {
  if (!req.file) {
    return next(); // Si aucun fichier n'a été téléchargé, passe au middleware suivant
  }

  const inputFilePath = path.resolve('images', req.file.filename); // Chemin du fichier téléchargé
  const outputFilePath = path.resolve('images', 'compressed_' + req.file.filename); // Nouveau chemin pour l'image compressée

  try {
    // Utilisation de sharp pour compresser et redimensionner
    sharp.cache(false) // Désactiver le cache global de sharp
    await sharp(inputFilePath)
      .resize(206,260)
      .jpeg({ quality: 80 }) // Compression JPEG à 80% de qualité
      .toFile(outputFilePath); // Sauvegarde l'image compressée

    // Supprimer l'image originale si nécessaire
    fs.unlinkSync(inputFilePath);

    // Mettre à jour le fichier dans req.file pour qu'il pointe vers l'image compressée
    req.file.path = outputFilePath;
    req.file.filename = 'compressed_' + req.file.filename;

    next(); // Passe au middleware suivant ou à la route
  } catch (err) {
    console.error('Erreur lors du traitement de l\'image avec sharp:', err);
    res.status(500).send('Erreur lors du traitement de l\'image.');
  }
};

export {compressAndResizeImage}