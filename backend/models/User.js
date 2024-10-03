// Importation de 'Schema' depuis Mongoose pour définir un schéma de base de données
import { Schema } from 'mongoose';

// Importation du plugin 'mongoose-unique-validator' pour s'assurer que certaines valeurs du schéma sont uniques (comme l'email ici)
import uniqueValidator from 'mongoose-unique-validator';

// Importation de 'mongoose' pour interagir avec MongoDB
import mongoose from 'mongoose';

// Création du schéma utilisateur (userSchema) pour définir la structure des documents dans la collection 'users'
const userSchema = Schema({
    // Champ 'email' : de type String, requis, et doit être unique dans la base de données
    email: { type: String, required: true, unique: true, maxlength: 250 },
    
    // Champ 'password' : de type String et requis (mot de passe haché pour la sécurité)
    password: { type: String, required: true, maxlength: 128 }
});

// Ajout du plugin 'uniqueValidator' au schéma pour garantir l'unicité du champ 'email'
userSchema.plugin(uniqueValidator);

// Création du modèle 'User' à partir du schéma défini, qui correspondra à la collection 'users' dans MongoDB
const User = mongoose.model('User', userSchema);

// Exportation du modèle 'User' pour l'utiliser dans d'autres parties de l'application
export default User;
