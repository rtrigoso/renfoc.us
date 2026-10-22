import RSS from 'rss';
import { PostItem } from "@/utils/content";

export function generateRSSFeed(posts: PostItem[]): string {
    const site_url = process.env.NODE_ENV === 'production' ? 'https://renfoc.us' : 'https://localhost:3000';
    const feedOptions = {
        title: "ren focus | RSS Feed",
        description: "Metaphysics, tunes, and code",
        site_url: site_url,
        feed_url: `${site_url}/rss.xml`,
        image_url: `${site_url}/header.webp`,
        pubDate: new Date(),
        copyright: `All rights reserved ${new Date().getFullYear()}`,
    };

    const feed = new RSS(feedOptions);

    posts.forEach((post) => {
        feed.item({
            title: post.title,
            description: post.description || '',
            url: `${site_url}${post.path}`,
            date: new Date(post.creationDate),
            categories: post.tags ?? [],
        });
    });

    return feed.xml({ indent: true });
}
