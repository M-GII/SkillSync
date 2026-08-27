import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
    throw new Error("MONGO_URI is not defined");
}

const globalForMongo = globalThis as typeof globalThis & {
    mongoClient?: MongoClient;
};

export const mongoClient =
    globalForMongo.mongoClient ?? new MongoClient(uri);

globalForMongo.mongoClient = mongoClient;