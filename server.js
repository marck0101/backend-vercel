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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://blog.marck0101.com.br");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Preflight para todas as rotas (IMPORTANTE no Vercel)
app.options("*", cors());

/* ================= HEALTHCHECK ================= */

app.get("/test", (req, res) => {
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
app.use("/posts", postsRoutes);

/* ================= SERVER LOCAL ================= */

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
  });
}

// OBRIGATÓRIO PARA VERCEL
export default app;
