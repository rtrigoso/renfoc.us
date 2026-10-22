import LinkList from "@/components/composite/Lists/PostsList";
import { GetAllTags, GetLinksDataFromContentByTag } from "@/utils/content";
import { formatTagLabel } from "@/utils/strings";
import type { Metadata } from "next";

interface TagParams {
    params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: TagParams): Promise<Metadata> {
    const { tag } = await params;
    const title = `Posts tagged: ${tag.replace(/-/g, ' ')}`;
    return { title, openGraph: { title }, twitter: { title } };
}

export default async function TagPage({ params }: TagParams) {
    const { tag } = await params;
    const content = await GetLinksDataFromContentByTag(tag);
    const label = formatTagLabel(tag);

    return (
        <section>
            <h3>Posts tagged &ldquo;{label}&rdquo;:</h3>
            {content.length > 0
                ? <LinkList content={content} />
                : <p>No posts found for this tag.</p>
            }
        </section>
    );
}

export async function generateStaticParams() {
    const tags = await GetAllTags();
    return tags.map(tag => ({ tag }));
}

export const dynamicParams = false;
