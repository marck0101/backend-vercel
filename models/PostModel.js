import { getDb } from "../lib/mongodb.js";

export async function findAllPosts() {
  const db = await getDb();
  return db
    .collection("blogposts")
    .find({ published: true })
    .sort({ publishedAt: -1 })
    .toArray();
}

export async function findPostBySlug(slug) {
  const db = await getDb();
  return db.collection("blogposts").findOne({ slug });
}
