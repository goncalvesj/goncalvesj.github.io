import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import config from '../config';
import { getExcerpt, getPostSlug, sortPosts } from '../lib/posts';

export async function GET(context) {
  const posts = sortPosts(await getCollection('posts'));

  return rss({
    title: config.siteTitle,
    description: config.siteDescription,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: getExcerpt(post),
      link: `/${getPostSlug(post)}`
    }))
  });
}
