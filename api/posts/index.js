// import { getAllPosts, createPost } from "../../controllers/PostController.js";

// export default async function handler(req, res) {
//   if (req.method === "GET") return getAllPosts(req, res);
//   if (req.method === "POST") return createPost(req, res);
//   return res.status(405).end();
// }


import { getAllPosts, createPost } from "../../controllers/PostController.js";

export default async function handler(req, res) {
  if (req.method === "GET") return getAllPosts(req, res);
  if (req.method === "POST") return createPost(req, res);
  return res.status(405).json({ error: "Method not allowed" });
}