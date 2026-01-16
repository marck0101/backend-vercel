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
 * ROTAS ESPECÍFICAS PRIMEIRO
 */
router.get("/slug/:slug", getPostBySlug);

/**
 * ROTA GENÉRICA POR ÚLTIMO
 */
router.get("/:id", getPostById);

export default router;
