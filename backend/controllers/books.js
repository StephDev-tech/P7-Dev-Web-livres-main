// Importation du modèle 'Book' pour interagir avec la collection de livres dans MongoDB
import Book from "../models/Book.js";
// Importation de 'unlink' depuis 'fs' pour supprimer des fichiers du système
import { unlink } from "fs";

/**
 * Créer un nouveau livre
 * - Parse les données envoyées avec la requête (contenu du livre + fichier image)
 * - Enregistre le livre dans la base de données avec l'image associée
 */
const createBook = (req, res) => {
	const bookObject = JSON.parse(req.body.book); // Parsing du livre reçu en format JSON
	delete bookObject._id; // Supprime l'ID existant (pour en générer un nouveau via MongoDB)
	delete bookObject._userId; // Supprime l'userId pour forcer l'utilisation de celui de l'authentification
	
	const book = new Book({
		...bookObject, // Copie les données du livre
		userId: req.auth.userId, // Ajoute l'ID de l'utilisateur qui a créé le livre (depuis le token d'authentification)
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, // Construit l'URL de l'image
	});

	// Enregistre le livre dans la base de données
	book
		.save()
		.then(() => res.status(201).json({ message: "Objet enregistré !" })) // Réponse de succès
		.catch((error) => res.status(400).json({ error })); // En cas d'erreur
};

/**
 * Modifier un livre existant
 * - Vérifie si l'utilisateur est bien le créateur du livre
 * - Permet de modifier les informations et, si besoin, l'image
 */
const modifyBook = (req, res) => {
	const bookObject = req.file
		? {
				...JSON.parse(req.body.book), // Si un nouveau fichier image est envoyé, parse les données du livre
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, // Construit la nouvelle URL de l'image
		  }
		: { ...req.body }; // Sinon, copie simplement les données envoyées (sans nouvelle image)

	delete bookObject._userId; // Supprime l'userId pour éviter une modification non autorisée

	// Recherche le livre à modifier dans la base de données
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			// Vérifie si l'utilisateur authentifié est bien le créateur du livre
			if (book.userId != req.auth.userId) {
				res.status(400).json({ message: "Non-autorisé" }); // Si non, retourne une erreur
			} else {
				// Si oui, met à jour les informations du livre
				Book.updateOne(
					{ _id: req.params.id },
					{ ...bookObject, _id: req.params.id } // Conserve le même _id
				)
					.then(() => res.status(200).json({ message: "Objet modifié" })) // Réponse de succès
					.catch((error) => res.status(401).json({ error })); // En cas d'erreur
			}
		})
		.catch((error) => res.status(400).json({ error })); // En cas d'erreur de recherche du livre
};

/**
 * Supprimer un livre
 * - Vérifie si l'utilisateur est bien le créateur
 * - Supprime également l'image associée au livre du système de fichiers
 */
const deleteBook = (req, res) => {
	// Recherche le livre dans la base de données
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			// Vérifie si l'utilisateur authentifié est bien le créateur du livre
			if (book.userId != req.auth.userId) {
				res.status(401).json({ message: "Non autorisé" });
			} else {
				// Supprime le fichier image associé du système de fichiers
				const filename = book.imageUrl.split("/images/")[1];
				unlink(`images/${filename}`, () => {
					// Puis supprime le livre de la base de données
					Book.deleteOne({ _id: req.params.id })
						.then(() => res.status(200).json({ message: "Objet supprimé !" })) // Réponse de succès
						.catch((error) => res.status(401).json({ error })); // En cas d'erreur
				});
			}
		})
		.catch((error) => res.status(500).json({ error })); // En cas d'erreur de recherche du livre
};

/**
 * Obtenir un seul livre
 * - Recherche un livre par son ID et renvoie ses informations
 */
const getOneBook = (req, res) => {
	Book.findOne({ _id: req.params.id }) // Recherche le livre par ID
		.then((book) => res.status(200).json(book)) // Réponse avec les détails du livre
		.catch((error) => res.status(404).json({ error })); // En cas d'erreur ou si le livre n'existe pas
};

/**
 * Obtenir la liste de tous les livres
 * - Renvoie tous les livres stockés dans la base de données
 */
const getAllBooks = (req, res) => {
	Book.find() // Recherche tous les livres
		.then((books) => res.status(200).json(books)) // Réponse avec la liste des livres
		.catch((error) => res.status(400).json({ error })); // En cas d'erreur
};

/**
 * Noter un livre
 * - Permet à un utilisateur de noter un livre et recalculer la note moyenne
 */
const rateBook = async (req, res) => {
	const userId = req.body.userId; // ID de l'utilisateur qui note
	const grade = req.body.rating; // Note donnée
	const bookId = req.params.id; // ID du livre à noter

	// Recherche du livre par ID
	const book = await Book.findById(bookId);
	if (!book) {
		return res.status(404).json({ message: "Livre non trouvé." }); // Si le livre n'existe pas
	}

	// Vérifie si l'utilisateur a déjà noté ce livre
	const alreadyRated = book.ratings.find((objet) => objet.userId === userId);
	if (!alreadyRated) {
		book.ratings.push({ userId, grade }); // Ajoute la nouvelle note
	} else {
		return res.status(400).json({ message: "Vous avez déjà noté ce livre." }); // Si déjà noté
	}

	// Recalcul de la note moyenne
	const totalRatings = book.ratings.length;
	const sumOfGrades = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
	book.averageRating = sumOfGrades / totalRatings; // Nouvelle note moyenne

	// Sauvegarde des modifications
	book.save()
		.then(() => res.status(200).json(book)) // Réponse avec les détails du livre mis à jour
		.catch((error) => res.status(400).json({ error })); // En cas d'erreur
};

/**
 * Obtenir les livres les mieux notés
 * - Renvoie les 3 livres avec la meilleure note moyenne
 */
const bestRatedBooks = (req, res) => {
	Book.find().sort({ averageRating: -1 }).limit(3) // Tri par note moyenne décroissante et limite à 3 résultats
		.then((books) => res.status(200).json(books)) // Réponse avec les livres triés
		.catch((error) => res.status(400).json({ error })); // En cas d'erreur
};

// Exportation des fonctions pour les utiliser dans les routes
export {
	createBook,
	modifyBook,
	deleteBook,
	getOneBook,
	getAllBooks,
	rateBook,
	bestRatedBooks,
};
