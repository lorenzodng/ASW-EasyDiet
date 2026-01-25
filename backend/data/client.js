import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI;

//crea un client (temporaneo) mongoDB
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export { client };