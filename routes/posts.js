import express from "express";
import {
  getAllPosts,
  getPostBySlug,
  createPost,
} from "../controllers/PostController.js";

const router = express.Router();

/**
 * GET /posts
 */
router.get("/", getAllPosts);

/**
 * POST /posts
 */
router.post("/", createPost);

/**
 * GET /posts/slug/:slug
 */
router.get("/slug/:slug", (req, res) => {
  // espelha o comportamento da Vercel (req.query)
  req.query.slug = req.params.slug;
  return getPostBySlug(req, res);
});

export default router;
