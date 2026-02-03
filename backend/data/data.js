import { client } from './client.js';
import accounts from './accounts.json' with { type: 'json' };
import dishes from './dishes.json' with { type: 'json' };

// Insert data into the database
async function insertData() {
    try {
        const db = client.db("dietDb");

        await db.collection("accounts").insertMany(accounts);
        await db.collection("dishes").insertMany(dishes);

        console.log("Dati aggiunti al db");
    } catch (err) {
        console.error("Errore:", err);
    }
}

export { insertData };
