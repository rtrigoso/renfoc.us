import BlueskyFeed from "@/composites/BlueskyFeed";
import LinkList from "@/composites/PostsList";
import ProjectList from "@/composites/ProjectsList";
import { GetLinksDataFromContent, generateRSSFeed } from "@/utils/content";
import Link from "next/link";
import Synthesizer from "@/composites/Synthesizer"; 

export default async function Home() {
  const posts = await GetLinksDataFromContent();
  await generateRSSFeed(posts);

  return (
    <>
      <section>
        <Synthesizer />
      </section>
      <section>
        <h3>Latest Posts</h3>
        <LinkList content={posts.slice(0, 4)} />
        <div>
          <Link href={'/posts'}>{`>> `}view all posts</Link>
        </div>
      </section>
      <section>
        <h3>Active Projects</h3>
        <ProjectList />
        {/* <Link href={'/projects'}>{`>> `}view all projects</Link> */}
      </section>
      <section>
        <h3>Bluesky Feed</h3>
        <BlueskyFeed />
        <Link target="_BLANK" href={'https://bsky.app/profile/ren-rocks.bsky.social'}>{`>> `}go to bsky feed</Link>
      </section>
    </>
  );
}
