import express from "express";
import {
  getAllPosts,
  getPostById,
  getTrashedPosts,
  trashPost,
  restorePost,
} from "../controllers/PostController.js";

const router = express.Router();

// públicos
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// trash
router.get("/trash/list", getTrashedPosts);
router.patch("/trash/:id", trashPost);
router.patch("/restore/:id", restorePost);

export default router;