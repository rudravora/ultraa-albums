// Blog posts. The posts live in blog.json, using the same fields as Parmar's Supabase
// `posts` table (snake_case), and every page reads them only through the functions
// below. When the admin panel arrives, point these at its database or API; the pages
// do not change. Post text is Markdown (paragraphs, lists, tables, bold, links).
import data from "@/content/blog.json";

export type PostSection = { id: string; order: number; title: string; paragraphs: string[] };

/** One row as stored (Parmar's PostRow, plus audience and read_time). */
export type PostRow = {
  id: string;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  excerpt: string;
  image_url: string;
  image_alt: string;
  category: string | null;
  audience: string;
  read_time: string;
  featured: boolean;
  status: "draft" | "published" | string;
  grid_order: number;
  seo_title: string | null;
  seo_description: string | null;
  intro: string[];
  sections: PostSection[];
};

export type BlogPost = PostRow & { href: string };

const today = () => new Date().toISOString().slice(0, 10);

/** Published posts, newest first. A post dated in the future stays hidden until its date. */
export const getPosts = (): BlogPost[] =>
  (data.posts as PostRow[])
    .filter((p) => p.status === "published" && p.date <= today())
    .sort((a, b) => b.date.localeCompare(a.date) || a.grid_order - b.grid_order)
    .map((p) => ({ ...p, href: `/blog/${p.slug}` }));

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);

/** Featured posts first, then by grid order (Parmar's home section ordering). */
export const getPreviewPosts = (count = 3) =>
  [...getPosts()].sort((a, b) => Number(b.featured) - Number(a.featured) || a.grid_order - b.grid_order).slice(0, count);

/** Up to three other posts, same category first, then the newest. */
export const getMorePosts = (post: BlogPost, count = 3) => {
  const others = getPosts().filter((p) => p.slug !== post.slug);
  return [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, count);
};

export const getCategories = () => [...new Set(getPosts().map((p) => p.category).filter((c): c is string => !!c))].sort();

export const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
