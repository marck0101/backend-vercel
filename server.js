import express from "express";
import cors from "cors";
import "dotenv/config";

// Import rotas
import postsRoutes from "./routes/posts.js";

// Import getDb
import { getDb } from "./lib/mongodb.js";

const app = express();

/* ================= MIDDLEWARES ================= */

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://blog.marck0101.com.br",
        "https://www.blog.marck0101.com.br",
      ];

      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Preflight para todas as rotas (IMPORTANTE no Vercel)
app.options("*", cors());

/* ================= HEALTHCHECK ================= */

app.get("/api/test", (req, res) => {
  res.json({
    status: "ok",
    message: "API funcionando",
    env: process.env.NODE_ENV || "unknown",
    mongo_uri_defined: !!process.env.MONGODB_URI,
    timestamp: new Date().toISOString(),
  });
});

app.get("/status", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* ================= ROTAS ================= */

// TODAS as rotas de posts ficam no router
app.use("/api/posts", postsRoutes);

/* ================= SERVER LOCAL ================= */

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
  });
}

// OBRIGATÓRIO PARA VERCEL
export default app;
