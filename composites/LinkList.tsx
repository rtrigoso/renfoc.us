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
                    className="link"
                    key={filename} 
                    href={`/posts/${filename}`}>
                    {creationDateString} - {title.charAt(0).toUpperCase() + title.slice(1)}
                </Link>
            );
        });
    
    return (<>{links}</>)
}