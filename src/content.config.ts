import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    cover: z.string().optional(),
    slug: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { posts };
