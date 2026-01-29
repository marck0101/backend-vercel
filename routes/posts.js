import express from "express";
import {
  getAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
} from "../controllers/PostController.js";

const router = express.Router();

/**
 * GET /api/posts (lista todos os posts publicados)
 */
router.get("/", getAllPosts);

/**
 * POST /api/posts (cria um novo post)
 */
router.post("/", createPost);

/**
 * GET /api/posts/slug/:slug (busca por slug)
 */
router.get("/slug/:slug", getPostBySlug);

/**
 * GET /api/posts/:id (busca por ID)
 */
router.get("/:id", getPostById);

export default router;