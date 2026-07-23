type HastNode = {
    type: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    value?: string;
    children?: HastNode[];
};

function unwrapImageParagraphs(node: HastNode): void {
    if (!node.children) return;

    node.children = node.children.flatMap((child) => {
        const onlyChild = child.children?.length === 1 ? child.children[0] : undefined;

        if (child.type === 'element' && child.tagName === 'p' && onlyChild?.type === 'element' && onlyChild.tagName === 'img') {
            return [onlyChild];
        }

        unwrapImageParagraphs(child);
        return [child];
    });
}

/**
 * Markdown always wraps a standalone image in a <p>, but our img component
 * renders a <figure>, which isn't valid inside <p>. This lifts solo images
 * out of their paragraph before MDX compiles the tree to JSX.
 */
export function rehypeUnwrapImages() {
    return (tree: HastNode) => {
        unwrapImageParagraphs(tree);
    };
}

const YOUTUBE_URL_PATTERN = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})(?:[?&#]\S*)?$/;

/**
 * YouTube share links express the start time as either a bare number of
 * seconds ("t=29") or a "1h2m3s"-style duration ("t=1m30s").
 */
function parseYoutubeTimestamp(value: string): number | undefined {
    if (/^\d+$/.test(value)) return parseInt(value, 10);

    const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
    if (!match || !(match[1] || match[2] || match[3])) return undefined;

    const [, hours, minutes, seconds] = match;
    return parseInt(hours ?? '0', 10) * 3600 + parseInt(minutes ?? '0', 10) * 60 + parseInt(seconds ?? '0', 10);
}

function extractYoutubeStartSeconds(url: string): number | undefined {
    try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        const t = parsed.searchParams.get('t') ?? parsed.searchParams.get('start');
        return t ? parseYoutubeTimestamp(t) : undefined;
    } catch {
        return undefined;
    }
}

function extractYoutubeVideoId(url: string): string | undefined {
    return url.trim().match(YOUTUBE_URL_PATTERN)?.[1];
}

function getStandaloneUrl(paragraph: HastNode): string | undefined {
    if (paragraph.children?.length !== 1) return undefined;

    const [child] = paragraph.children;

    if (child.type === 'text' && child.value) return child.value;
    if (child.type === 'element' && child.tagName === 'a' && typeof child.properties?.href === 'string') {
        return child.properties.href;
    }

    return undefined;
}

async function fetchYoutubeTitle(videoId: string): Promise<string | undefined> {
    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`;
        const response = await fetch(oembedUrl);
        if (!response.ok) return undefined;

        const data = await response.json();
        return typeof data?.title === 'string' ? data.title : undefined;
    } catch {
        return undefined;
    }
}

function toYoutubeEmbed(videoId: string, start?: number, title?: string): HastNode {
    return {
        type: 'element',
        tagName: 'youtube-embed',
        properties: {
            'data-video-id': videoId,
            ...(start !== undefined ? { 'data-start': start } : {}),
            ...(title !== undefined ? { 'data-title': title } : {}),
        },
        children: [],
    };
}

async function embedYoutubeLinks(node: HastNode): Promise<void> {
    if (!node.children) return;

    node.children = await Promise.all(
        node.children.map(async (child) => {
            if (child.type === 'element' && child.tagName === 'p') {
                const url = getStandaloneUrl(child);
                const videoId = url ? extractYoutubeVideoId(url) : undefined;

                if (videoId) {
                    const start = url ? extractYoutubeStartSeconds(url) : undefined;
                    const title = await fetchYoutubeTitle(videoId);
                    return toYoutubeEmbed(videoId, start, title);
                }
            }

            await embedYoutubeLinks(child);
            return child;
        })
    );
}

/**
 * A YouTube link sitting alone on its own line (bare URL or autolink) becomes
 * a <p> wrapping a single text/anchor node. This swaps that paragraph for a
 * <youtube-embed> tag, rendered client-side as a click-to-load facade so the
 * video iframe never loads (or blocks the page) until the reader opts in. The
 * video's title is fetched from YouTube's oembed endpoint at render time to
 * caption the embed, mirroring how images get their alt text as a caption.
 */
export function rehypeYoutubeEmbed() {
    return async (tree: HastNode) => {
        await embedYoutubeLinks(tree);
    };
}
