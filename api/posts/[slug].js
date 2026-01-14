import { getPostBySlug } from "../../controllers/PostController.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  return getPostBySlug(req, res);
}
