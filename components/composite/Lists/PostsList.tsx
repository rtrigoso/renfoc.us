import { PostItem } from "@/utils/content";
import { shortHash } from "@/utils/strings";
import { Fragment } from "react";
import Link from "next/link";

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
            <Fragment key={`post-${creationDate}`}>
                <dt>
                    {creationDateString}
                </dt>
                <dd>
                    <span className="post_title">{title}</span>
                    <br />
                    <Link
                        tabIndex={0}
                        className="link post_link"
                        href={`${path}#main_content`}>
                        read here: {shortHash(path)}
                    </Link>
                </dd>
            </Fragment>
        );
    });

    return (
        <dl className="posts_list">{links}</dl>
    );
}
