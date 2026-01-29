import { getDb } from "../../lib/mongodb.js";

export default async function handler(req, res) {
  // ===== CORS FIXO =====
  res.setHeader("Access-Control-Allow-Origin", "https://blog.marck0101.com.br");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = await getDb();

    const posts = await db
      .collection("blogposts")
      .find({ published: true, deletedAt: null })
      .sort({ publishedAt: -1 })
      .limit(50)
      .toArray();

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return res.status(500).json({ error: "Erro ao buscar posts" });
  }
}
