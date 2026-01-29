import express from "express";
import cors from "cors";
import "dotenv/config";

import postsRoutes from "./routes/posts.js";

const app = express();
const PORT = process.env.PORT || 3333;   // ← isso o Vercel já fornece

/* ================= MIDDLEWARES ================= */
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://blog.marck0101.com.br",
      "*"   // ← opcional durante testes (depois tira)
    ],
  })
);

app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Rota de teste sem DB funcionando', 
    env: process.env.NODE_ENV,
    uri_defined: !!process.env.MONGODB_URI 
  });
});

app.get('/api/posts', async (req, res) => {
  try {
    const db = await getDb();
    const posts = await db.collection('blogposts')
      .find({ published: true, deletedAt: null })
      .sort({ publishedAt: -1 })
      .limit(50) // ← limite para evitar overload em serverless
      .toArray();

    console.log(`→ Retornados ${posts.length} posts`);
    res.json(posts);
  } catch (error) {
    console.error('Erro em GET /api/posts:', error.message || error);
    res.status(500).json({
      error: 'Erro interno ao buscar posts',
      message: error.message,
    });
  }
});

/* ================= HEALTH ================= */
app.get("/status", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* ================= API ================= */
app.use("/api/posts", postsRoutes);

// NÃO COLOQUE app.listen() aqui em produção!
// Coloque condicionado só para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}



// <--- ESSA LINHA É A MAIS IMPORTANTE DE TODAS -->
export default app;