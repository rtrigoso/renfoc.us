import { Dirent, readdirSync } from "fs";
import { parse, resolve } from "path";
import { promises as fs, writeFileSync } from "fs";
import RSS from 'rss';

class ExtendedDirent extends Dirent {
    creationTime: number = 0
}

export interface PostItem {
    path: string
    creationDateString: string
    title: string
    creationDate: number
    description?: string
    tags?: string[]
}

export function GetContentDirFullPath () {
    if (!process.env.PWD) throw new Error('process.env.PWD is not set');

    return resolve(process.env.PWD, 'content');
}

export function PrintContentReadableCreationTime (filename: string) : string {
    const creationTimestamp = parseInt(filename.split('-')[0]);
    const creationDate = new Date(creationTimestamp * 1000);
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

function parseFilenameMeta(filename: string) {
    const slug = parse(filename).name;
    const titleMatch = filename.match(/^\d+-(.+)\.md$/);
    const title = titleMatch ? titleMatch[1].replaceAll('_', ' ') : slug;
    const creationDate = parseInt(filename.split('-')[0]) * 1000;
    const creationDateString = PrintContentReadableCreationTime(filename);

    return { slug, title, creationDate, creationDateString };
}

export function ExtractDescriptionComment(raw: string): string {
    const match = raw.match(/\{\/\*description\n([\s\S]*?)\n\*\/\}/);
    return match ? match[1].trim() : '';
}

export function ExtractTags(raw: string): string[] {
    const match = raw.match(/\{\/\*tags\n([\s\S]*?)\n\*\/\}/);
    if (!match) return [];
    return match[1].split('\n').map(t => t.trim()).filter(Boolean);
}

export async function GetPostDescription(slug: string): Promise<string> {
    if (!process.env.PWD) return '';

    const raw = await readDataContent(slug, process.env.PWD);
    return ExtractDescriptionComment(raw);
}

export async function GetLinksDataFromContent(): Promise<PostItem[]> {
    const files = await ReadContentDirectory();
    const dataPromise = files
        .map(async f => {
            const { slug, title, creationDate, creationDateString } = parseFilenameMeta(f.name);
            if (!process.env.PWD) return { path: `/posts/${slug}`, title, creationDateString, creationDate };
            const raw = await readDataContent(slug, process.env.PWD);
            const description = ExtractDescriptionComment(raw);
            const tags = ExtractTags(raw);

            return ({
                path: `/posts/${slug}`,
                title: title,
                creationDateString,
                creationDate,
                description,
                tags
            });
        });
    const data = await Promise.all(dataPromise)
    data.sort((a, b) => b.creationDate - a.creationDate)

    return data;
}

export async function GetAllTags(): Promise<string[]> {
    if (!process.env.PWD) return [];
    const files = await ReadContentDirectory();
    const tagSets = await Promise.all(
        files.map(async f => {
            const slug = parse(f.name).name;
            const raw = await readDataContent(slug, process.env.PWD!);
            return ExtractTags(raw);
        })
    );
    const unique = [...new Set(tagSets.flat())];
    return unique;
}

export async function GetLinksDataFromContentByTag(tag: string): Promise<PostItem[]> {
    if (!process.env.PWD) return [];
    const files = await ReadContentDirectory();
    const dataPromise: Promise<PostItem | null>[] = files.map(async f => {
        const { slug, title, creationDate, creationDateString } = parseFilenameMeta(f.name);
        const raw = await readDataContent(slug, process.env.PWD!);
        const tags = ExtractTags(raw);
        if (!tags.includes(tag)) return null;

        const description = ExtractDescriptionComment(raw);

        return { path: `/posts/${slug}`, title, creationDateString, creationDate, description };
    });
    const resolved = await Promise.all(dataPromise);
    const data = resolved.filter((p): p is PostItem => p !== null);
    data.sort((a, b) => b.creationDate - a.creationDate);
    return data;
}

export function generateRSSFeed(posts: PostItem[]): void {
    const site_url = process.env.NODE_ENV === 'production' ? 'https://renfoc.us' : 'https://localhost:3000';
    const feedOptions = {
        title: "ren focus | RSS Feed",
        description: "Metaphysics, tunes, and code",
        site_url: site_url,
        feed_url: `${site_url}/rss.xml`,
        image_url: `${site_url}/header.webp`,
        pubDate: new Date(),
        copyright: `All rights reserved ${new Date().getFullYear()}`,
    };

    const feed = new RSS(feedOptions);

    posts.map((post) => {
        feed.item({
            title: post.title,
            description: post.description || '',
            url: `${site_url}${post.path}`,
            date: new Date(post.creationDate),
            categories: post.tags ?? [],
        });
    });

    writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
}
