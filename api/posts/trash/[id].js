import { trashPost } from "../../../controllers/PostController.js";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).end();
  }

  return trashPost(req, res);
}
