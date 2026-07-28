import Card from "./Card"
import { getFeedPosts, getFirstEmbed } from "@/utils/blueskyFeed"

export default async function BlueskyFeed() {
    const posts = await getFeedPosts('ren-rocks.bsky.social');

    return (
        <ul id="bluesky_feed">
            {
                posts.map(({ avatar, displayName, content, createdAt, embeds, link, externalUri }) => {
                    const { embedAlt, embedLink, embedAspectRatio } = getFirstEmbed(embeds);

                    return (
                        <Card
                            key={`bluesky_post_${createdAt.getUTCDate()}_${encodeURI(link)}`}
                            postURL={link}
                            avatarURL={avatar}
                            username={displayName}
                            content={content}
                            date={createdAt}
                            embedAlt={embedAlt}
                            embedImgURL={embedLink}
                            embedAspectRatio={embedAspectRatio}
                            embedExternalUri={externalUri}
                        />
                    )
                })
            }
        </ul>
    );
}
