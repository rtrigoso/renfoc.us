import { PostItem } from "@/utils/content";
import { capitalize } from "@/utils/strings";
import Link from "next/link";
import ExternalLink from "@/composites/ExternalLink";

interface LinkListParams {
    content: PostItem[]
}

export default async function LinkList({ content }: LinkListParams) {
    const links = content.map(link => {
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
                </span>
                <Link
                    tabIndex={0}
                    className="link post_link"
                    href={path}>
                    {capitalize(title)} <ExternalLink />
                </Link>
            </li>
        );
    });

    return (
        <ul>{links}</ul>
    );
}
