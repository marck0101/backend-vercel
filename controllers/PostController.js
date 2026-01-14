import { ObjectId } from "mongodb";
import { getDb } from "../lib/mongodb.js";
import { buildPostPayload } from "../models/PostModel.js";

function isValidId(id) {
  return ObjectId.isValid(id);
}

/**
 * POST /api/posts
 * Criar post (rascunho ou publicado)
 */
export async function createPost(req, res) {
  try {
    const db = await getDb();
    const payload = buildPostPayload(req.body);

    // validações mínimas
    if (!payload.title || !payload.slug || !payload.content) {
      return res.status(400).json({
        error: "Título, slug e conteúdo são obrigatórios",
      });
    }

    // slug único
    const exists = await db.collection("blogposts").findOne({
      slug: payload.slug,
      deletedAt: null,
    });

    if (exists) {
      return res.status(409).json({ error: "Slug já em uso" });
    }

    const result = await db.collection("blogposts").insertOne(payload);

    return res.status(201).json({
      success: true,
      postId: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar post" });
  }
}

/**
 * GET /api/posts
 */
export async function getAllPosts(req, res) {
  try {
    const db = await getDb();

    const posts = await db
      .collection("blogposts")
      .find({
        published: true,
        deletedAt: null,
      })
      .sort({ publishedAt: -1 })
      .toArray();

    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar posts" });
  }
}

/**
 * GET /api/posts/slug/:slug
 */
export async function getPostBySlug(req, res) {
  try {
    const { slug } = req.query;
    const db = await getDb();

    const post = await db.collection("blogposts").findOne({
      slug,
      published: true,
      deletedAt: null,
    });

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar post" });
  }
}
