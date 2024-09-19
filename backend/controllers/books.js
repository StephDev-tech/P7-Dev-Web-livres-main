import Book from "../models/Book.js";
import { unlink } from "fs";

const createBook = (req, res) => {
	const bookObject = JSON.parse(req.body.book);
	delete bookObject._id;
	delete bookObject._userId;
	console.log(req.protocole);
	const book = new Book({
		...bookObject,
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
	});
	book
		.save()
		.then(() => {
			res.status(201).json({ message: "Objet enregistré !" });
		})
		.catch((error) => {
			res.status(400).json({ error });
		});
};

const modifyBook = (req, res) => {
	const bookObject = req.file
		? {
				...JSON.parse(req.body.book),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	delete bookObject._userId;
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (book.userId != req.auth.userId) {
				res.status(400).json({ message: "Non-autorisé" });
			} else {
				Book.updateOne(
					{ _id: req.params.id },
					{ ...bookObject, _id: req.params.id }
				)
					.then(() => res.status(200).json({ message: "Objet modifié" }))
					.catch((error) => res.status(401).json({ error }));
			}
		})
		.catch((error) => res.status(400).json({ error }));
};

const deleteBook = (req, res) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (book.userId != req.auth.userId) {
				res.status(401).json({ message: "Non autorisé" });
			} else {
				const filename = book.imageUrl.split("/images/")[1];
				unlink(`images/${filename}`, () => {
					Book.deleteOne({ _id: req.params.id })
						.then(() => {
							res.status(200).json({ message: "Objet supprimé !" });
						})
						.catch((error) => res.status(401).json({ error }));
				});
			}
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
};

const getOneBook = (req, res) => {	
	Book.findOne({ _id: req.params.id })
		.then((book) => res.status(200).json(book))
		.catch((error) => res.status(404).json({ error }));
};

const getAllBooks = (req, res) => {
	Book.find()
		.then((books) => res.status(200).json(books))
		.catch((error) => res.status(400).json({ error }));
};

const rateBook = async (req, res) => {
	
	const userId = req.body.userId;
	const grade =  req.body.rating
	const bookId = req.params.id;

	const book = await Book.findById(bookId);
	if (!book) {
		return res.status(404).json({ message: "Livre non trouvé." });
	}

	// Vérifier si l'utilisateur a déjà noté ce livre
	const alreadyRated = book.ratings.find(objet => {return objet.userId === userId});
	if(!alreadyRated){
		book.ratings.push({userId,grade})
	}else{
		return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
	}

	// Recalculer la moyenne des notes
	const totalRatings = book.ratings.length;
	const sumOfGrades = book.ratings.reduce(
		(sum, rating) => sum + rating.grade,
		0
	);
	book.averageRating = sumOfGrades / totalRatings;
	// Sauvegarder les modifications
	book.save()
	.then(() => res.status(200).json(book))
	.catch(error => res.status(400).json({ error }))
}

const bestRatedBooks = (req, res) => {
	 Book.find().sort({ averageRating: -1 }).limit(3)	
	 .then((books) => res.status(200).json(books))
	 .catch((error) => res.status(400).json({ error }));
	
}

export {
	createBook,
	modifyBook,
	deleteBook,
	getOneBook,
	getAllBooks,
	rateBook,
	bestRatedBooks
};
