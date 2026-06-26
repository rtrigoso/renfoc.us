export function renderHashtag(part: string, i: number) {
    const match = part.match(/^(#\w+)(.*)/);
    if (!match) return null;
    const [, hashtag, rest] = match;
    return (
        <span key={i}>
            <a href={`https://bsky.app/hashtag/${hashtag.slice(1)}`} target="_blank" rel="noopener noreferrer">
                {hashtag}
            </a>
            {rest}
        </span>
    );
}

export function renderURL(part: string, i: number) {
    const match = part.match(/^(https:\/\/\S+)(.*)/);
    if (!match) return null;
    const [, url, rest] = match;
    return (
        <span key={i}>
            <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
            </a>
            {rest}
        </span>
    );
}

export function renderContent(content: string) {
    return content.split(/(\s+)/).map((part, i) => {
        const hashtag = renderHashtag(part, i);
        const url = renderURL(part, i);

        if (hashtag) return hashtag;
        if (url) return url;
        return part;
    });
}
