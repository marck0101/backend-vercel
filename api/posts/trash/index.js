import { getTrashedPosts } from "../../../controllers/PostController.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  return getTrashedPosts(req, res);
}
