import { client } from './client.js';
import { insertData } from './data.js';

async function main() {
    try {
        await client.connect();
        await insertData();
    } catch (err) {
        console.error(err);
    } finally {
        await client.close(); 
    }
}

main().catch(console.dir);