import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const getPostSlug = (post: Post) => slugify(post.data.slug ?? post.data.title);

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  }).format(date);

export const sortPosts = (posts: Post[]) =>
  [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

export const getCategories = (posts: Post[]) => {
  const categories = new Map<string, number>();
  posts.forEach((post) => {
    post.data.categories.forEach((category) => {
      categories.set(category, (categories.get(category) ?? 0) + 1);
    });
  });
  return [...categories.entries()].map(([name, count]) => ({ name, count }));
};

export const getTags = (posts: Post[]) => {
  const tags = new Set<string>();
  posts.forEach((post) => post.data.tags.forEach((tag) => tags.add(tag)));
  return [...tags];
};

const stripMarkdown = (markdown: string) =>
  markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[[^\]]+\]\(([^)]+)\)/g, '$1')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const getExcerpt = (post: Post, maxLength = 160) => {
  const text = stripMarkdown(post.body ?? '');
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
};

export const getReadingTime = (post: Post) => {
  const words = stripMarkdown(post.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};
