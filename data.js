import { client } from './client.js';
import users from './users.json' with { type: 'json' };
import recipes from './recipes.json' with { type: 'json' };

//aggiunge i dati al db
async function insertData() {
    try {
        const db = client.db("dietDb");

        await db.collection("users").insertMany(users);
        await db.collection("recipes").insertMany(recipes);

        console.log("Data added successfully!");
    } catch (err) {
        console.error("Error:", err);
    }
}

//recupera i dati dal db
async function readData() {
    try {
        const db = client.db("dietDb");

        //recupera tutti gli utenti
        const users = await db.collection("users").find({}).toArray();
        console.log("Users:", users);

        //recupera tutte le ricette
        const recipes = await db.collection("recipes").find({}).toArray();
        console.log("Recipes:", recipes);

        //trova un utente specifico
        const specificUser = await db.collection("users").findOne({ nome: "Mario" });
        console.log("Specific user:", specificUser);

        //filtra le ricette per categoria
        const veganRecipes = await db.collection("recipes").find({ tipo: "vegana" }).toArray();
        console.log("Vegan recipes:", veganRecipes);
    } catch (err) {
        console.error("Error:", err);
    }
}

export {insertData, readData};
