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

export function findExternalUriMatch(content: string, externalUri?: string): string | null {
    if (!externalUri) return null;

    let hostname: string;
    try {
        hostname = new URL(externalUri).hostname;
    } catch {
        return null;
    }

    const escapedHost = hostname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = content.match(new RegExp(`\\S*${escapedHost}\\S*`, 'i'));
    return match ? match[0] : null;
}

export function buildExternalUriLabel(externalUri: string): string {
    const label = externalUri.replace(/^https:\/\//i, '').replace(/^www\./i, '');

    const slashIndex = label.indexOf('/');
    if (slashIndex === -1) {
        return label;
    }

    const host = label.slice(0, slashIndex);
    const path = label.slice(slashIndex)
        .replace(/\/$/, '')
        .replace(/\.\w+$/, '');

    return host + path;
}

export function renderExternalUri(part: string, i: number, externalUri: string) {
    return (
        <a key={i} href={externalUri} target="_blank" rel="noopener noreferrer">
            {buildExternalUriLabel(externalUri)}
        </a>
    );
}

export function renderContent(content: string, externalUri?: string) {
    const externalMatch = findExternalUriMatch(content, externalUri);

    return content.split(/(\s+)/).map((part, i) => {
        if (externalMatch && externalUri && part === externalMatch) {
            return renderExternalUri(part, i, externalUri);
        }

        const hashtag = renderHashtag(part, i);
        const url = renderURL(part, i);

        if (hashtag) return hashtag;
        if (url) return url;
        return part;
    });
}
