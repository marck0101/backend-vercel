import "dotenv/config";
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

async function run() {
  await client.connect();
  const db = client.db("blog_project");
  const posts = await db.collection("blogposts").find().toArray();
  console.log(posts);
  process.exit();
}

run();
