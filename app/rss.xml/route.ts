import { GetLinksDataFromContent } from "@/utils/content";
import { generateRSSFeed } from "@/utils/rss";

export const dynamic = "force-static";

export async function GET() {
    const posts = await GetLinksDataFromContent();
    const feed = generateRSSFeed(posts);

    return new Response(feed, {
        headers: { "Content-Type": "application/xml" },
    });
}
