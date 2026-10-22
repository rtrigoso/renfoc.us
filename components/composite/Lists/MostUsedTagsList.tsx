import Link from "next/link";
import { PostItem } from "@/utils/content";
import { formatTagLabel } from "@/utils/strings";

interface MostUsedTagsListParams {
    content: PostItem[]
    length?: number
}

const MAX_TAGS_SHOWN = 4;

export default async function MostUsedTagsList({ content, length = MAX_TAGS_SHOWN }: MostUsedTagsListParams) {
    const counts = new Map<string, number>();

    content.forEach(({ tags }) => {
        tags?.forEach(tag => {
            counts.set(tag, (counts.get(tag) ?? 0) + 1);
        });
    });

    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const topTags = sorted.slice(0, Math.min(length, MAX_TAGS_SHOWN));
    const maxCount = sorted[0]?.[1] ?? 0;

    const items = topTags.map(([tag, count]) => {
        const ratio = maxCount > 0 ? count / maxCount : 0;
        const id = `tag_${tag}`;

        return (
            <div className="most_used_tags_list_item" key={`tag-${tag}`}>
                <label htmlFor={id}>
                    <Link href={`/tags/${tag}`}>{formatTagLabel(tag)}</Link>
                </label>
                {' '}
                <meter id={id} value={ratio} aria-label={`${formatTagLabel(tag)}: ${Math.round(ratio * 100)}% of ${maxCount}`}>{Math.round(ratio * 100)}%</meter>
            </div>
        );
    });

    return (
        <div className="most_used_tags_list">{items}</div>
    );
}
