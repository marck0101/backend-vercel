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
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
  });
}

// <--- ESSA LINHA É A MAIS IMPORTANTE DE TODAS -->
export default app;