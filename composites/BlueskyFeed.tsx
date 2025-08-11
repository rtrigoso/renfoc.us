import Card from "./Card"

interface BlueskyRecord {
    text: string,
    displayName: string
}

interface BlueskyImageAspectRatio {
    width: number
    height: number
}

interface BlueskyImage {
    alt: string
    aspectRatio: BlueskyImageAspectRatio
    thumb: string
}

interface BlueskyEmbed {
    images: BlueskyImage[]
}

interface BlueskyAuthor {
    avatar: string,
    displayName: string
}

interface BlueskyPost {
    uri: string
    author: BlueskyAuthor
    indexedAt: string
    record: BlueskyRecord
    embed: BlueskyEmbed
}

interface BlueskyFeed {
    post: BlueskyPost
}

async function GetFeedPosts(username: string): Promise<PostCardPost[]> {
    const res = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${username}&limit=3`);
    if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
    }

    const feed = await res.json();

    return feed.feed.map(({ post }: BlueskyFeed) => {
        return {
            link: `https://bsky.app/profile/ren-rocks.bsky.social/post/${post.uri.split('/').at(-1)}`,
            avatar: post.author.avatar,
            displayName: post.author.displayName,
            content: post.record.text,
            createdAt: new Date(post.indexedAt),
            embeds: post.embed?.images?.map(image => ({
                alt: image.alt,
                aspectRatio: `${image.aspectRatio.width}/${image.aspectRatio.height}`,
                link: image.thumb
            }))
        }
    });
}

interface PostCardEmbed {
    alt: string
    type: 'image'
    link: string
    aspectRatio: string
}

interface PostCardPost {
    avatar: string
    displayName: string
    content: string
    createdAt: Date
    embeds: PostCardEmbed[]
    link: string
}

export default async function BlueskyFeed() {
    const posts: PostCardPost[] = await GetFeedPosts('ren-rocks.bsky.social');

    return (
        <>
            {
                posts.map(({ avatar, displayName, content, createdAt, embeds, link }) => {
                    const firstEmbed = embeds?.at(0);

                    let embedAlt, embedLink, embedAspectRatio;
                    if (firstEmbed) {
                        embedAlt = firstEmbed.alt;
                        embedLink = firstEmbed.link;
                        embedAspectRatio = firstEmbed.aspectRatio;
                    }

                    return (
                        <Card
                            key={`bluesky_post_${createdAt.getUTCDate()}`}
                            postURL={link}
                            avatarURL={avatar}
                            username={displayName}
                            content={content}
                            date={createdAt}
                            embedAlt={embedAlt}
                            embedImgURL={embedLink}
                            embedAspectRatio={embedAspectRatio}
                        />
                    )
                })
            }
        </>
    );
}
