import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const bookSchema = Schema({
    userId:{type: String, required: true},
    title: { type: String, required: true},
    author: { type: String, required: true},
    imageUrl: { type: String, required: true},
    year: { type: Number, required: true},
    genre: { type: String, required: true},
    ratings:[
        {
            userId: { type: String, required: true},
            grade: { type: Number, required: true, min: 0, max: 5 }  // Limite le grade entre 0 et 5
        }
    ],
    averageRating: { type: Number, default: 0, required: true }  // Valeur par défaut à 0
})

const Book = mongoose.model('Book', bookSchema);

export default Book;