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

interface PostCardProps {
    avatar: string
    displayName: string
    createdAt: Date
    content: string
    link: string
    embeds: PostCardEmbed[]
}

interface PostCardEmbed {
    alt: string
    type: 'image'
    link: string
    aspectRatio: string
}

function PostCardEmbed({ alt, link, aspectRatio, type }: PostCardEmbed) {
    switch (type) {
        case 'image':
            const w = parseInt(aspectRatio.split('/')[0]);
            const h = parseInt(aspectRatio.split('/')[1]);
            return (
                <div className="bluesky_post_embed_image">
                    <img
                        src={link}
                        alt={alt}
                        width={75}
                        height={75 * h / w}
                    />
                </div>
            )
        default:
            return null;
    }

}

function PostCard({ link, avatar, displayName, content, createdAt, embeds = [] }: PostCardProps) {
    return (
        <a href={link} target="_BLANK" className="bluesky_post_link" >
            <div className="bluesky_post">
                <div className="bluesky_post_body">
                    <div className="bluesky_post_content">
                        <div className="bluesky_post_header">
                            <img
                                src={avatar}
                                alt={`avatar for ${displayName}`}
                                width={25}
                                height={25}
                            />
                            <div>
                                <strong>{displayName}</strong>
                                {createdAt.toLocaleDateString("en-US")}
                            </div>
                        </div>
                        <div className="bluesky_post_message">{content}</div>
                    </div>
                    {
                        embeds && (
                            <div className="bluesky_post_embeds">
                                {
                                    embeds.slice(0, 1).map((embed, index) => (
                                        <PostCardEmbed
                                            key={`bluesky_post_embed_${index}_${createdAt.getUTCDate()}`}
                                            type='image'
                                            alt={embed.alt}
                                            link={embed.link}
                                            aspectRatio={embed.aspectRatio}
                                        />
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </a>
    );
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
        <div className="bluesky_posts">
            <h3>Bluesky Feed</h3>
            {
                posts.map(({ avatar, displayName, content, createdAt, embeds, link }) => (
                    <PostCard
                        key={`bluesky_post_${createdAt.getUTCDate()}`}
                        link={link}
                        avatar={avatar}
                        displayName={displayName}
                        content={content}
                        createdAt={createdAt}
                        embeds={embeds}
                    />
                ))
            }
        </div>
    );
}
