import BlueskyFeed from "@/components/composite/BlueskyFeed/BlueskyFeed";
import LinkList from "@/components/composite/Lists/PostsList";
import ProjectList from "@/components/composite/Lists/ProjectsList";
import { GetLinksDataFromContent, generateRSSFeed } from "@/utils/content";
import Link from "next/link";
import ExternalLink from "@/components/basic/ExternalLink";

export default async function Home() {
  const posts = await GetLinksDataFromContent();
  generateRSSFeed(posts);

  return (
    <>
      <section>
        <h3>Latest Posts</h3>
        <LinkList content={posts.slice(0, 4)} />
        <div><Link className="nav-link" href={'/posts'}>more posts... <ExternalLink /></Link></div>
      </section>
      <section>
        <h3>Active Projects</h3>
        <ProjectList />
      </section>
      <section>
        <h3>Bluesky Feed</h3>
        <BlueskyFeed />
        <Link className="nav-link" target="_BLANK" href={'https://bsky.app/profile/ren-rocks.bsky.social'}>view feed... <ExternalLink /></Link>
      </section>
    </>
  );
}
