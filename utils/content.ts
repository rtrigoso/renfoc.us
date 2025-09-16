import { Dirent, readdirSync, statSync } from "fs";
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
}

export function GetContentDirFullPath () {
    if (!process.env.PWD) throw new Error('process.env.PWD is not set');

    return resolve(process.env.PWD, 'content');
}

export function PrintContentReadableCreationTime (filename: string) : string {
    const postsDir = GetContentDirFullPath();
    resolve(postsDir, filename);

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

export async function GetPostDescription(slug: string) {
    let data = '';
    if (process.env.PWD) {
        data = await readDataContent(slug, process.env.PWD);
        const firstIndex = data.indexOf(".", 50);
        const lastIndex = data.indexOf(".", firstIndex + 50);
        data = `...${data.replace('#', '').slice(firstIndex + 1, lastIndex)}...`;
    }

    return data;
}

export async function GetLinksDataFromContent(): Promise<PostItem[]> {
    const files = await ReadContentDirectory();
    const dataPromise = files
        .map(async f => {
            const filename = parse(f.name).name
            const title = f.name.split('-')[1].replaceAll('_', ' ').replace('.md', '')
            const creationDate = parseInt(f.name.split('-')[0]) * 1000;
            const creationDateString = PrintContentReadableCreationTime(f.name);
            const description = await GetPostDescription(f?.name?.split('.')?.at(0) || '')

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
        });
    });

    writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
}
