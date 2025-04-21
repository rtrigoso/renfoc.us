import { PrintContentReadableCreationTime, ReadContentDirectory } from "@/utils/content";
import { promises as fs } from "fs";
import { MDXRemote } from 'next-mdx-remote/rsc'
import { parse, resolve } from "path";

interface PostsParams {
    params: Promise<{ slug: string, creationDate: string }>
}

export default async function Posts({ params }: PostsParams) {
    const { slug } = await params

    if (!process.env.PWD) return <></>;

    const filename = `${slug}.md`;
    const fp = resolve(process.env.PWD, `content/${filename}`);
    const creationDate = PrintContentReadableCreationTime(filename);
    const data = await fs.readFile(fp, 'utf8');
 
    return (
        <article>
            <MDXRemote source={`${data}`} />
        </article>
    )
}  
   
export async function generateStaticParams() {
    const files = await ReadContentDirectory();

    return files.map(f => ({ slug: parse(f.name).name }));
}

export const dynamicParams = false