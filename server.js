import express from "express";
import cors from "cors";
import "dotenv/config";

import postsRoutes from "./routes/posts.js";

const app = express();
const PORT = process.env.PORT || 3333;

/* ================= MIDDLEWARES ================= */
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

/* ================= HEALTH ================= */
app.get("/status", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* ================= API ================= */
app.use("/api/posts", postsRoutes);

/* ================= START ================= */
app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
