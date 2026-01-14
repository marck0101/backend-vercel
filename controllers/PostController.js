import { ObjectId } from "mongodb";
import { getDb } from "../lib/mongodb.js";

function isValidId(id) {
  return ObjectId.isValid(id);
}

/**
 * GET /posts
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
 * GET /posts/:id
 */
export async function getPostById(req, res) {
  try {
    const { id } = req.query;

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
 * GET /posts/trash
 */
export async function getTrashedPosts(req, res) {
  try {
    const db = await getDb();

    const posts = await db
      .collection("blogposts")
      .find({
        deletedAt: { $ne: null },
      })
      .sort({ deletedAt: -1 })
      .toArray();

    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar lixeira" });
  }
}

/**
 * PATCH /posts/trash/:id
 */
export async function trashPost(req, res) {
  try {
    const { id } = req.query;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const db = await getDb();

    await db.collection("blogposts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          deletedAt: new Date(),
          published: false,
        },
      }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao mover para lixeira" });
  }
}

/**
 * PATCH /posts/restore/:id
 */
export async function restorePost(req, res) {
  try {
    const { id } = req.query;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const db = await getDb();

    await db.collection("blogposts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          deletedAt: null,
        },
      }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao restaurar post" });
  }
}
