import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI não está definida nas variáveis de ambiente");
}

const uri = process.env.MONGODB_URI;

const options = {
  connectTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
  maxPoolSize: 10,
  minPoolSize: 0
};

let cachedClient = global._mongoClient;
let cachedDb = global._mongoDb;
let cachedPromise = global._mongoPromise;

if (!cachedPromise) {
  const client = new MongoClient(uri, options);
  cachedPromise = client.connect();
  global._mongoPromise = cachedPromise;
  global._mongoClient = client;
}

export async function getDb() {
  if (cachedDb) return cachedDb;

  const client = await cachedPromise;
  const dbName = process.env.MONGODB_DB || "blog_project";
  const db = client.db(dbName);

  // Ping opcional (ajuda a diagnosticar), mas não reconecta
  await db.command({ ping: 1 });

  cachedClient = client;
  cachedDb = db;
  global._mongoDb = db;

  return db;
}
