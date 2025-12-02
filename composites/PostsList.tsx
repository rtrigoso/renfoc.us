import { PostItem } from "@/utils/content";
import Link from "next/link";

interface LinkListParams {
    content: PostItem[]
}

export default async function LinkList({ content }: LinkListParams) {
    let filteredContent = content;

    const links = filteredContent.map(link => {
        const {
            path,
            creationDateString,
            title,
            creationDate
        } = link;

        return (
            <li className="post_link" key={`post-${creationDate}`}>
                <span>
                    {creationDateString}
                    {` - `}
                </span>
                <Link
                    tabIndex={0}
                    className="link post_link"
                    href={path}>
                    {title.charAt(0).toUpperCase() + title.slice(1)}
                </Link>
            </li>
        );
    });

    return (
        <ul>{links}</ul>
    );
}
