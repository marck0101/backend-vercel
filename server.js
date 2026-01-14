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
      "http://localhost:5173", // frontend local
      "http://localhost:3000",
    ],
  })
);

/**
 * Health check (igual à Vercel)
 */
app.get("/status", async (req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "backend-express",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Posts
 */
app.use("/posts", postsRoutes);

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`🚀 API local rodando em http://localhost:${PORT}`);
});
