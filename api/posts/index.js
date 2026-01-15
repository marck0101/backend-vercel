import {
  getAllPosts,
  createPost,
} from "../../controllers/PostController.js";

export default async function handler(req, res) {
  // 🔴 CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
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
