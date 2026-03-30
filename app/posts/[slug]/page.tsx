import { GetPostDescription, ReadContentDirectory, getTitleFromSlug, getPWD, readDataContent } from "@/utils/content";
import { capitalizeFirst } from "@/utils/string";
import { MDXRemote } from 'next-mdx-remote/rsc'
import { parse } from "path";

interface PostsParams {
    params: Promise<{ slug: string, creationDate: string }>
}

export async function generateMetadata({ params }: PostsParams) {
    const { slug } = await params;
    const title = getTitleFromSlug(slug);
    const data = await GetPostDescription(slug)

    return {
        title: capitalizeFirst(title),
        description: data,
        'twitter:title': data,
        'og:title': capitalizeFirst(title)
    }
}

export default async function Posts({ params }: PostsParams) {
    const { slug, creationDate } = await params

    const data = await readDataContent(slug, getPWD());

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
