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

export { insertData };
