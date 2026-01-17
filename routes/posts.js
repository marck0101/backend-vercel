import express from "express";
import {
  getAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
} from "../controllers/PostController.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/", createPost);
router.get("/slug/:slug", getPostBySlug);
router.get("/:id", getPostById);

export default router;
