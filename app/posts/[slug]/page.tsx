import { GetPostDescription, ReadContentDirectory, readDataContent } from "@/utils/content";
import CustomImage from "@/composites/CustomImage";
import { capitalize } from "@/utils/strings";
import { MDXRemote } from 'next-mdx-remote/rsc'
import { parse } from "path";
import type { Metadata } from "next";

interface PostsParams {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostsParams): Promise<Metadata> {
    const { slug } = await params;
    const title = slug.split('-')[1].split('_').join(' ');
    const description = await GetPostDescription(slug)

    return {
        title: capitalize(title),
        description,
        twitter: { title: capitalize(title), description },
        openGraph: { title: capitalize(title), description }
    }
}

const components = {
    img: ({ src, alt, width, height, className }: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <a href={src} target="_blank" rel="noopener noreferrer">
            <CustomImage
                src={src ?? ''}
                alt={alt ?? ''}
                width={Number(width) || 0}
                height={Number(height) || 0}
                className={className}
            />
        </a>
    )
}

export default async function Posts({ params }: PostsParams) {
    const { slug } = await params

    if (!process.env.PWD) return <></>;

    const data = await readDataContent(slug, process.env.PWD);

    return (
        <article>
            <MDXRemote source={`${data}`} components={components} />
        </article>
    )
}  
   
export async function generateStaticParams() {
    const files = await ReadContentDirectory();

    return files.map(f => ({ slug: parse(f.name).name }));
}

export const dynamicParams = false