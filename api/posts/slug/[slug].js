// import { getPostBySlug } from "../../../controllers/PostController.js";

// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     return getPostBySlug(req, res);
//   }

//   return res.status(405).end();
// }


import { getPostBySlug } from "../../controllers/PostController.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  return getPostBySlug(req, res);
}