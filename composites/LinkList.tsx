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
                <Link 
                    className="link post_link"
                    key={filename} 
                    href={`/posts/${filename}`}>
                    <span>{creationDateString}</span>
                    <span>{title.charAt(0).toUpperCase() + title.slice(1)}</span>
                </Link>
            );
        });
    
    return (<>{links}</>)
}