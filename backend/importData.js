import { MongoClient } from 'mongodb'; // Utilisation des imports ES6
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Déterminer le répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 // eslint-disable-next-line no-undef
 const uri = process.env.MONGODB_URI;

// Connexion à MongoDB Atlas
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function importData() {
    try {
        // Connexion à MongoDB
        await client.connect();
        console.log("Connecté à MongoDB Atlas");

        // Sélection de la base de données et de la collection
        const database = client.db("test");
        const collection = database.collection("books");

        // Construire le chemin vers le fichier JSON
        const dataPath = path.join(__dirname, '../public/data/data.json');  // Remonter d'un dossier, puis aller dans public/data

        // Lire et parser le fichier JSON
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        if (!Array.isArray(data)) {
            throw new Error("Le fichier JSON doit contenir un tableau d'objets.");
        }

        for (const item of data) {
            const existingItem = await collection.findOne({ _id: item._id });
            if (!existingItem) {
                await collection.insertOne(item);
                console.log(`Données insérées : ${item._id}`);
            } else {
                console.log(`Données déjà présentes : ${item._id}`);
            }
        }

    } catch (error) {
        console.error("Erreur lors de l'importation des données : ", error);
    } finally {
        // Fermer la connexion
        await client.close();
    }
}

importData();
