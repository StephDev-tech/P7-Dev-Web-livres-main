const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path')
require('dotenv').config(); 

const uri = process.env.MONGODB_URI

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

        // Construire le chemin vers le fichier JSON (dossier public/data)
        const dataPath = path.join(__dirname, '../public/data/data.json');  // Remonter d'un dossier, puis aller dans public/data

        // Lire et parser le fichier JSON
        const data = JSON.parse(fs.readFileSync(dataPath,'utf8'));

        // Insérer les données dans la collection
        if (Array.isArray(data)) {
            await collection.insertMany(data);
            console.log("Données insérées avec succès !");
        } else {
            await collection.insertOne(data);
            console.log("Données insérées avec succès !");
        }
    } catch (error) {
        console.error("Erreur lors de l'importation des données : ", error);
    } finally {
        // Fermer la connexion
        await client.close();
    }
}

importData();