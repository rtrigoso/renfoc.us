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

interface BlueskyFeedEntry {
    post: BlueskyPost
}

export interface PostCardEmbed {
    alt: string
    type: 'image'
    link: string
    aspectRatio: string
}

export interface PostCardPost {
    avatar: string
    displayName: string
    content: string
    createdAt: Date
    embeds: PostCardEmbed[]
    link: string
    externalUri?: string
}

export interface FirstEmbedProps {
    embedAlt?: string
    embedLink?: string
    embedAspectRatio?: string
}

async function fetchAuthorFeed(username: string): Promise<BlueskyFeedEntry[]> {
    const res = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${username}&limit=3&filter=posts_no_replies`);
    if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
    }

    const feed = await res.json();
    return feed.feed;
}

function formatDisplayName(displayName: string): string {
    const withoutEmoji = displayName.replace(/\p{Emoji}/gu, '').replace(/\bthe\b/i, '').trim();
    const displayNameArr = withoutEmoji.split(/\s/);

    if (displayNameArr.length > 2) {
        const acronymArr = displayNameArr.map(d => `${d.at(0)}.`);
        return acronymArr.length > 3
            ? `${acronymArr.slice(0, 3).join('')}\n${acronymArr.slice(3).join('')}`
            : acronymArr.join('');
    }

    return displayNameArr.slice(0, 1).join('');
}

function isGifExternal(external?: BlueskyExternal): boolean {
    return Boolean(external?.uri && external.uri.includes('gif'));
}

function buildGifEmbed(external: BlueskyExternal): BlueskyImage {
    const params = new URL(external.uri as string).searchParams;
    const hh = params.get('hh');
    const ww = params.get('ww');

    return {
        alt: external.alt,
        thumb: external.uri as string,
        aspectRatio: {
            width: parseInt(ww || '4', 10),
            height: parseInt(hh || '3', 10)
        }
    };
}

function buildPostLink(uri: string): string {
    return `https://bsky.app/profile/ren-rocks.bsky.social/post/${uri.split('/').at(-1)}`;
}

function normalizeAvatarURL(avatar: string): string {
    return avatar.includes('@') ? avatar : `${avatar}@jpeg`;
}

function mapEmbed(image: BlueskyImage): PostCardEmbed {
    return {
        alt: image.alt,
        type: 'image',
        aspectRatio: `${image.aspectRatio.width}/${image.aspectRatio.height}`,
        link: image.thumb
    };
}

function transformPost(post: BlueskyPost): PostCardPost {
    const embeds = [...(post.embed?.images || [])];
    const external = post.embed?.external;

    if (external && isGifExternal(external)) {
        embeds.push(buildGifEmbed(external));
    }

    return {
        link: buildPostLink(post.uri),
        avatar: normalizeAvatarURL(post.author.avatar),
        displayName: formatDisplayName(post.author.displayName),
        content: post.record.text,
        createdAt: new Date(post.indexedAt),
        embeds: embeds.map(mapEmbed),
        externalUri: external?.uri
    };
}

export async function getFeedPosts(username: string): Promise<PostCardPost[]> {
    const feed = await fetchAuthorFeed(username);
    return feed.map(({ post }) => transformPost(post));
}

export function getFirstEmbed(embeds: PostCardEmbed[]): FirstEmbedProps {
    const firstEmbed = embeds?.at(0);
    if (!firstEmbed) {
        return {};
    }

    return {
        embedAlt: firstEmbed.alt,
        embedLink: firstEmbed.link,
        embedAspectRatio: firstEmbed.aspectRatio
    };
}
