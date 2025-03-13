import Link from "next/link";

interface LinkListItem {
    filename: string,
    creationDateString: string
}

interface LinkListParams {
    content: LinkListItem[]
    max?: number
}

export default async function LinkList ({ content, max } : LinkListParams ) {
    let filteredContent = content;
    if (max && max > 0) filteredContent = content.slice(0, max);

    const links = filteredContent
        .map(({ filename, creationDateString }) => {
            return (
                <Link 
                    key={filename} 
                    href={`/posts/${filename}`}>
                        {creationDateString} - {filename}
                </Link>
            );
        });
    
    return (<>{links}</>)
}