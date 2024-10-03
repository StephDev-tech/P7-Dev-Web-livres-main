// Importation de 'Schema' depuis Mongoose pour définir un schéma de base de données
import { Schema } from 'mongoose';

// Importation de 'mongoose' pour interagir avec MongoDB
import mongoose from 'mongoose';

// Création du schéma pour les livres (bookSchema) afin de définir la structure des documents dans la collection 'books'
const bookSchema = Schema({
    // Champ 'userId' : ID de l'utilisateur ayant créé le livre, de type String, et requis
    userId: { type: String, required: true },

    // Champ 'title' : Titre du livre, de type String, et requis
    title: { type: String, required: true, maxlength: 200 },

    // Champ 'author' : Auteur du livre, de type String, et requis
    author: { type: String, required: true, maxlength: 200 },

    // Champ 'imageUrl' : URL de l'image associée au livre, de type String, et requis
    imageUrl: { type: String, required: true },

    // Champ 'year' : Année de publication du livre, de type Number, et requis
    year: { type: Number, required: true },

    // Champ 'genre' : Genre du livre (ex : fiction, biographie), de type String, et requis
    genre: { type: String, required: true,  maxlength: 200 },

    // Champ 'ratings' : Tableau d'objets, chaque élément représentant une évaluation du livre par un utilisateur
    ratings: [
        {
            // 'userId' : ID de l'utilisateur ayant noté le livre, de type String, et requis
            userId: { type: String, required: true },

            // 'grade' : Note donnée au livre par l'utilisateur, de type Number, avec une valeur minimale de 0 et maximale de 5
            grade: { type: Number, required: true, min: 0, max: 5 }
        }
    ],

    // Champ 'averageRating' : Note moyenne du livre, de type Number, avec une valeur par défaut de 0 et requise
    averageRating: { type: Number, default: 0, required: true }
});

// Création du modèle 'Book' à partir du schéma défini, qui correspondra à la collection 'books' dans MongoDB
const Book = mongoose.model('Book', bookSchema);

// Exportation du modèle 'Book' pour être utilisé dans d'autres parties de l'application
export default Book;
