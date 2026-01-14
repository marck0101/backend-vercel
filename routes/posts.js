import express from "express";
import {
  getAllPosts,
  getPostById,
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
 * GET /posts/:id
 */
router.get("/:id", getPostById);

/**
 * GET /posts/slug/:slug
 */
router.get("/slug/:slug", getPostBySlug);

export default router;
