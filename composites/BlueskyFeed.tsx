import Card from "./Card"

interface BlueskyRecord {
    text: string,
    displayName: string
}

interface BlueskyImageAspectRatio {
    width: number
    height: number
}

interface BlueskyExternal {
    alt: string
    uri?: string
}

interface BlueskyImage {
    alt: string
    aspectRatio: BlueskyImageAspectRatio
    thumb: string
}

interface BlueskyEmbed {
    images: BlueskyImage[]
    external: BlueskyExternal
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
        const embeds = post.embed?.images || [];
        const external = post.embed?.external;
        const gifURL = external?.uri || '';

        if (external && gifURL.includes('gif')) {
            const params = new URL(gifURL).searchParams;
            const hh = params.get('hh');
            const ww = params.get('ww')
            embeds.push({
               alt: external.alt,
               thumb: gifURL,
               aspectRatio: {
                   width: parseInt(ww || '4', 10),
                   height: parseInt(hh || '3', 10)
               }
           });
        }
        
       return {
            link: `https://bsky.app/profile/ren-rocks.bsky.social/post/${post.uri.split('/').at(-1)}`,
            avatar: post.author.avatar,
            displayName: post.author.displayName.split(/\s/).at(0),
            content: post.record.text,
            createdAt: new Date(post.indexedAt),
            embeds: embeds?.map(image => ({
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
                            key={`bluesky_post_${createdAt.getUTCDate()}_${encodeURI(link)}`}
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
