import { client } from './client.js';
import accounts from './accounts.json' with { type: 'json' };
import recipes from './recipes.json' with { type: 'json' };

//aggiunge i dati al db
async function insertData() {
    try {
        const db = client.db("dietDb");

        await db.collection("accounts").insertMany(accounts);
        await db.collection("recipes").insertMany(recipes);

        console.log("Dati aggiunti al db");
    } catch (err) {
        console.error("Errore:", err);
    }
}

/*
//recupera i dati dal db
async function readData() {
    try {
        const db = client.db("dietDb");

        //recupera tutti gli utenti
        const users = await db.collection("users").find({}).toArray();
        console.log("Utenti:", users);

        //recupera tutte le ricette
        const recipes = await db.collection("recipes").find({}).toArray();
        console.log("Ricette:", recipes);

        //trova un utente specifico
        const specificUser = await db.collection("users").findOne({ nome: "Mario" });
        console.log("Utente:", specificUser);

        //filtra le ricette per categoria
        const veganRecipes = await db.collection("recipes").find({ tipo: "vegana" }).toArray();
        console.log("Ricette vegane:", veganRecipes);
    } catch (err) {
        console.error("Errore:", err);
    }
}
*/

export { insertData };
