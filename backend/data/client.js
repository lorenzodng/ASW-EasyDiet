import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://easydiet:easydietpsw@dietdb.tfpxquz.mongodb.net/?appName=dietDb";

//crea un client (temporaneo) mongoDB
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export {client};