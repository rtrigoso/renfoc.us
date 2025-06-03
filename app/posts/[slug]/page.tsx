import { ReadContentDirectory } from "@/utils/content";
import { promises as fs } from "fs";
import { MDXRemote } from 'next-mdx-remote/rsc'
import { parse, resolve } from "path";

interface PostsParams {
    params: Promise<{ slug: string, creationDate: string }>
}

async function readDataContent(slug: string, currentPath: string): Promise<string> {
    const filename = `${slug}.md`;
    const fp = resolve(currentPath, `content/${filename}`);
    const data = await fs.readFile(fp, 'utf8');

    return data;
}

export async function generateMetadata({ params }: PostsParams) {
    const { slug } = await params;
    const title = slug.split('-')[1].split('_').join(' ');

    let data;
    if (process.env.PWD) {
        data = await readDataContent(slug, process.env.PWD);
        data = `...${data.replace('#', '').slice(50, 150)}...`;
    }

    return {
        title: title[0].toUpperCase() + title.slice(1),
        description: data
    }
}

export default async function Posts({ params }: PostsParams) {
    const { slug, creationDate } = await params

    if (!process.env.PWD) return <></>;

    const data = await readDataContent(slug, process.env.PWD);
 
    return (
        <article>
            <time dateTime={creationDate}>{creationDate}</time>
            <MDXRemote source={`${data}`} />
        </article>
    )
}  
   
export async function generateStaticParams() {
    const files = await ReadContentDirectory();

    return files.map(f => ({ slug: parse(f.name).name }));
}

export const dynamicParams = false