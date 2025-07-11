import { GetPostDescription, ReadContentDirectory, readDataContent } from "@/utils/content";
import { MDXRemote } from 'next-mdx-remote/rsc'
import { parse } from "path";

interface PostsParams {
    params: Promise<{ slug: string, creationDate: string }>
}

export async function generateMetadata({ params }: PostsParams) {
    const { slug } = await params;
    const title = slug.split('-')[1].split('_').join(' ');
    const data = GetPostDescription(slug)

    return {
        title: title[0].toUpperCase() + title.slice(1),
        description: data,
        'twitter:title': data,
        'og:title': title[0].toUpperCase() + title.slice(1)
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