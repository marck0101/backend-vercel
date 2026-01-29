import express from "express";
import "dotenv/config";

// Rotas
import postsRoutes from "./routes/posts.js";

const app = express();

/**
 * === DEFINITIVO PARA VERCEL + CORS ===
 * - Remove 304 (ETag off)
 * - Força CORS em TODAS as respostas
 * - Vary: Origin (evita cache quebrar CORS)
 * - Cache-Control: no-store (evita edge/browser devolver 304 sem headers)
 */

app.set("etag", false); // impede 304 Not Modified

app.use(express.json());

// Lista de origens permitidas
const ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "http://localhost:3000",
  "https://blog.marck0101.com.br",
  "https://www.blog.marck0101.com.br",
]);

function getAllowedOrigin(origin) {
  // Se não houver Origin (curl/navegador abrindo direto), não bloqueia.
  if (!origin) return "https://blog.marck0101.com.br";
  if (ALLOWED_ORIGINS.has(origin)) return origin;
  return null;
}

// Middleware CORS + anti-cache (ANTES de tudo)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigin = getAllowedOrigin(origin);

  // Sempre variar por Origin para cache não “misturar” headers
  res.setHeader("Vary", "Origin");

  // Anti-cache agressivo para impedir 304/caching no caminho
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Preflight sempre responde aqui (não deixa cair em rota/cors lib)
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Se veio Origin e não está permitido, bloqueia explicitamente
  if (origin && !allowedOrigin) {
    return res.status(403).json({
      error: "CORS blocked",
      origin,
    });
  }

  next();
});

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

// IMPORTANTE: mantendo /posts (como você já estava usando)
app.use("/posts", postsRoutes);

/* ================= SERVER LOCAL ================= */

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
}

export default app;
