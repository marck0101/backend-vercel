export function buildPostPayload(data) {
  const now = new Date();

  return {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,

    seo: {
      title: data.seo?.title || "",
      description: data.seo?.description || "",
    },

    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    coverImage: data.coverImage || "",

    published: Boolean(data.published),
    publishedAt: data.published ? now : null,

    createdAt: now,
    updatedAt: null,
    deletedAt: null,
  };
}
