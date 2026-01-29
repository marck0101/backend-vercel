import { ObjectId } from "mongodb";
import { getDb } from "../lib/mongodb.js";
import { buildPostPayload } from "../models/PostModel.js";

function isValidId(id) {
  return ObjectId.isValid(id);
}

/**
 * POST /posts
 */
export async function createPost(req, res) {
  try {
    const db = await getDb();
    const payload = buildPostPayload(req.body);

    if (!payload.title || !payload.slug || !payload.content) {
      return res.status(400).json({ error: "Título, slug e conteúdo são obrigatórios" });
    }

    const exists = await db.collection("blogposts").findOne({
      slug: payload.slug,
      deletedAt: null,
    });

    if (exists) {
      return res.status(409).json({ error: "Slug já em uso" });
    }

    const result = await db.collection("blogposts").insertOne(payload);
    console.log(`→ Post criado: ID ${result.insertedId}`);

    return res.status(201).json({
      success: true,
      postId: result.insertedId,
    });
  } catch (err) {
    console.error('Erro em createPost:', err.message || err);
    return res.status(500).json({
      error: "Erro ao criar post",
      details: err.message
    });
  }
}

/**
 * GET /posts
 */
export async function getAllPosts(req, res) {
  try {
    const db = await getDb();
    console.log('→ Buscando posts publicados...');

    const posts = await db
      .collection("blogposts")
      .find({ published: true, deletedAt: null })
      .sort({ publishedAt: -1 })
      .limit(50) // segurança
      .toArray();

    console.log(`→ Encontrados ${posts.length} posts`);
    return res.status(200).json(posts);
  } catch (err) {
    console.error('Erro em getAllPosts:', err.message || err);
    return res.status(500).json({
      error: "Erro ao buscar posts",
      details: err.message
    });
  }
}

/**
 * GET /posts/:id
 */
export async function getPostById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const db = await getDb();

    const post = await db.collection("blogposts").findOne({
      _id: new ObjectId(id),
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

/**
 * GET /posts/slug/:slug
 */
export async function getPostBySlug(req, res) {
  try {
    const { slug } = req.params;
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
