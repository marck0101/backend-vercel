import { getPostById } from "../../controllers/PostController.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getPostById(req, res);
  }

  return res.status(405).end();
}
