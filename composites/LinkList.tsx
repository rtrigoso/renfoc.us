import Link from "next/link";

interface LinkListItem {
    filename: string
    creationDateString: string
    title: string
    creationDate: number
}

interface LinkListParams {
    content: LinkListItem[]
    max?: number
}

export default async function LinkList ({ content, max } : LinkListParams ) {
    let filteredContent = content;
    if (max && max > 0) filteredContent = content.slice(0, max);

    const links = filteredContent
        .map(({ filename, creationDateString, title, creationDate }) => {
            return (
                <div className="post_link" key={`post-${creationDate}`}>
                    <div className="date">{creationDateString}</div>
                    <Link
                        tabIndex={0}
                        className="link post_link"
                        key={filename}
                        href={`/posts/${filename}`}>
                        {title.charAt(0).toUpperCase() + title.slice(1)}
                    </Link>
                </div>
            );
        });
    
    return (
        <div className="latest_posts">
            {max && <h3>Latest Posts:</h3>}
            {!max && <h3>All Posts:</h3>}
            {links}
        </div>
    );
}