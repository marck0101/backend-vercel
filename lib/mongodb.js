import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI não está definida nas variáveis de ambiente');
}

const uri = process.env.MONGODB_URI;
const options = {
  connectTimeoutMS: 30000,       // 30 segundos
  serverSelectionTimeoutMS: 30000,
  maxPoolSize: 10,               // limite conexões (evita flood)
  minPoolSize: 2,
};

let client;
let clientPromise;

let cachedClient = null;
let cachedDb = null;

if (process.env.NODE_ENV === 'development') {
  // Em dev: cache global para hot-reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect()
      .then(() => console.log('MongoDB conectado (dev cache)'))
      .catch(err => console.error('Falha inicial conexão MongoDB (dev):', err));
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Em produção: nova conexão, mas com cache simples no módulo
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect()
      .then(() => console.log('MongoDB conectado (produção)'))
      .catch(err => console.error('Falha inicial conexão MongoDB (prod):', err));
  }
  clientPromise = global._mongoClientPromise;
}

export async function getDb() {
  if (cachedDb) return cachedDb;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI não definida');
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      connectTimeoutMS: 60000,
      serverSelectionTimeoutMS: 60000,
    });

    const db = client.db(process.env.MONGODB_DB || 'blog_project');
    await db.command({ ping: 1 });

    console.log('MongoDB conectado (cache)');

    cachedClient = client;
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('ERRO MONGO:', error.message, error.stack);
    throw error;
  }
}