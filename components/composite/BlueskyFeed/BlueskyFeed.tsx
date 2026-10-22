import Card from "./Card"
import { getFeedPosts, getFirstEmbed } from "./api"

export default async function BlueskyFeed() {
    const posts = await getFeedPosts('ren-rocks.bsky.social');

    return (
        <ul id="bluesky_feed">
            {
                posts.map(({ displayName, handle, content, createdAt, embeds, link, externalUri }) => {
                    const { embedAlt, embedLink, embedAspectRatio } = getFirstEmbed(embeds);

                    return (
                        <Card
                            key={`bluesky_post_${createdAt.getUTCDate()}_${encodeURI(link)}`}
                            postURL={link}
                            username={displayName}
                            handle={handle}
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
