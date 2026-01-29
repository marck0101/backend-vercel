import express from "express";
import cors from "cors";
import "dotenv/config";

// Import rotas
import postsRoutes from "./routes/posts.js";

// Import getDb (ESSA LINHA RESOLVE O ERRO "getDb is not defined")
import { getDb } from "./lib/mongodb.js";

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",                  // dev Vite
      "http://localhost:3000",                  // dev alternativo
      "https://blog.marck0101.com.br",          // domínio principal do blog (frontend)
      "https://www.blog.marck0101.com.br",      // variante com www, se existir
      "*"                                       // temporário para testes (depois remova)
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,                            // já adicionado, mantém
  })
);

/* ================= ROTAS DE TESTE E HEALTH ================= */
app.get('/api/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Rota de teste sem DB funcionando',
    env: process.env.NODE_ENV || 'unknown',
    uri_defined: !!process.env.MONGODB_URI,
    timestamp: new Date().toISOString()
  });
});

app.get("/status", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* ================= ROTA /api/posts (agora com getDb importado) ================= */
app.get('/api/posts', async (req, res) => {
  try {
    const db = await getDb(); // ← agora getDb está definido
    const posts = await db.collection('blogposts')
      .find({ published: true, deletedAt: null })
      .sort({ publishedAt: -1 })
      .limit(50)
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

/* ================= API PRINCIPAL ================= */
app.use("/api/posts", postsRoutes);

/* ================= NÃO LIGAR LISTEN EM PRODUÇÃO ================= */
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
  });
}

// ESSA LINHA É OBRIGATÓRIA PARA O VERCEL
export default app;