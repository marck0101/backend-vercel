import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI não definida");
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = {
    client: null,
    db: null,
  };
}

export async function getDb() {
  if (cached.db) {
    return cached.db;
  }

  const client = new MongoClient(uri);
  await client.connect();

  cached.client = client;
  cached.db = client.db(dbName);

  return cached.db;
}
