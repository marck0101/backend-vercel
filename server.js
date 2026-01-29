import express from "express";
import "dotenv/config";
import postsRoutes from "./routes/posts.js";

const app = express();

/* ================= CONFIG GLOBAL ================= */

// DESLIGA ETag → mata 304
app.set("etag", false);

// JSON
app.use(express.json());

// Origens permitidas
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://blog.marck0101.com.br",
  "https://www.blog.marck0101.com.br",
];

// CORS + ANTI-CACHE GLOBAL
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader(
      "Access-Control-Allow-Origin",
      origin || "https://blog.marck0101.com.br"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cache-Control"
  );

  // ANTI CACHE (ESSENCIAL)
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* ================= ROTAS ================= */

app.get("/status", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/posts", postsRoutes);

/* ================= LOCAL ================= */

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () =>
    console.log(`API rodando em http://localhost:${PORT}`)
  );
}

export default app;
