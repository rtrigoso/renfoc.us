import { Dirent, readdirSync } from "fs";
import { parse, resolve } from "path";
import { promises as fs, writeFileSync } from "fs";
import RSS from 'rss';
import { SITE_URL, SITE_TAGLINE, HEADER_IMAGE } from './config';

class ExtendedDirent extends Dirent {
    creationTime: number = 0
}

export interface PostItem {
    path: string
    creationDateString: string
    title: string
    creationDate: number
    description?: string
}

export function getPWD(): string {
    if (!process.env.PWD) throw new Error('process.env.PWD is not set');
    return process.env.PWD;
}

export function GetContentDirFullPath() {
    return resolve(getPWD(), 'content');
}

export function getTimestampMsFromFilename(filename: string): number {
    return parseInt(filename.split('-')[0]) * 1000;
}

export function getTitleFromSlug(slug: string): string {
    const match = slug.match(/^\d+-(.+)$/);
    return match ? match[1].replaceAll('_', ' ') : slug;
}

export function PrintContentReadableCreationTime(filename: string): string {
    const creationDate = new Date(getTimestampMsFromFilename(filename));
    const creationDateString = new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    }).format(creationDate);

    return creationDateString;
}

export async function ReadContentDirectory(): Promise<ExtendedDirent[]> {
    let initialValue: ExtendedDirent[] = []

    const postsDir = GetContentDirFullPath();
    const files = readdirSync(postsDir, { withFileTypes: true });
    if (!files) return initialValue;

    const mdFiles = files.reduce((total, curr) => {
        if (!curr) return total;
        if (curr.isDirectory()) return total;

        const d: ExtendedDirent = Object.create(curr, { 'creationTime': {
            writable: false,
            configurable: false,
            value: PrintContentReadableCreationTime(curr.name)
        }});

        total.push(d)

        return total;
    }, initialValue);

    return mdFiles;
}

export async function readDataContent(slug: string, currentPath: string): Promise<string> {
    const filename = `${slug}.md`;
    const fp = resolve(currentPath, `content/${filename}`);
    const data = await fs.readFile(fp, 'utf8');

    return data;
}

export async function GetPostDescription(slug: string): Promise<string> {
    const raw = await readDataContent(slug, getPWD());
    // Strip markdown headings, then extract the first complete sentence
    const text = raw.replace(/^#{1,6}\s+.+$/gm, '').trim();
    const first = text.indexOf('. ');
    if (first === -1) return '';
    const second = text.indexOf('. ', first + 1);
    const excerpt = text.slice(first + 2, second === -1 ? undefined : second + 1).trim();

    return `...${excerpt}...`;
}

export async function GetLinksDataFromContent(): Promise<PostItem[]> {
    const files = await ReadContentDirectory();
    const dataPromise = files
        .map(async f => {
            const filename = parse(f.name).name
            const title = getTitleFromSlug(filename);
            const creationDate = getTimestampMsFromFilename(f.name);
            const creationDateString = PrintContentReadableCreationTime(f.name);
            const description = await GetPostDescription(filename)

            return ({
                path: `/posts/${filename}`,
                title: title,
                creationDateString,
                creationDate,
                description
            });
        });
    const data = await Promise.all(dataPromise)
    data.sort((a, b) => b.creationDate - a.creationDate)

    return data;
}

export function generateRSSFeed(posts: PostItem[]): void {
    const feedOptions = {
        title: "ren focus | RSS Feed",
        description: SITE_TAGLINE,
        site_url: SITE_URL,
        feed_url: `${SITE_URL}/rss.xml`,
        image_url: `${SITE_URL}${HEADER_IMAGE}`,
        pubDate: new Date(),
        copyright: `All rights reserved ${new Date().getFullYear()}`,
    };

    const feed = new RSS(feedOptions);

    posts.map((post) => {
        feed.item({
            title: post.title,
            description: post.description || '',
            url: `${SITE_URL}${post.path}`,
            date: new Date(post.creationDate),
        });
    });

    writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
}
