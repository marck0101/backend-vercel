import { getDb } from "../../lib/mongodb.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    // Testa conexão com o Mongo
    const db = await getDb();
    await db.command({ ping: 1 });

    return res.status(200).json({
      status: "ok",
      service: "backend-vercel",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      service: "backend-vercel",
      database: "disconnected",
    });
  }
}
