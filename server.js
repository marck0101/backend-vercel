import express from "express";
import cors from "cors";
import "dotenv/config";
import postsRoutes from "./routes/posts.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/posts", postsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
