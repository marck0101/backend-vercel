import {
  getAllPosts,
  createPost,
} from "../../controllers/PostController.js";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://blog.marck0101.com.br",
];

export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return getAllPosts(req, res);
  }

  if (req.method === "POST") {
    return createPost(req, res);
  }

  return res.status(405).end();
}
