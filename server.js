import express from "express";
import cors from "cors";
import "dotenv/config";

import postsRoutes from "./routes/posts.js";

const app = express();
const PORT = process.env.PORT || 3333;

/**
 * Middlewares
 */
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://blog.marck0101.com.br",
    ],
  })
);

/**
 * Health check
 */
app.get("/status", (req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "backend-express",
    timestamp: new Date().toISOString(),
  });
});

/**
 * API ROUTES (🔥 AQUI ESTAVA O PROBLEMA)
 */
app.use("/api/posts", postsRoutes);

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
