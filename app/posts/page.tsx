import { PrintContentReadableCreationTime, ReadContentDirectory } from "@/utils/content";
import Link from "next/link";
import { parse } from "path";

export default async function Posts() {
    const content = await ReadContentDirectory();
    const links = content
        .sort((a,b) => a.creationTime - b.creationTime)
        .map(f => {
            const filename = parse(f.name).name;
            const creationDateString = PrintContentReadableCreationTime(f.name);

            return (
                <Link 
                    key={filename} 
                    href={`/posts/${filename}`}>
                        {creationDateString} - {filename}
                </Link>
            );
        });

    return (
        <div>
            <h2>all posts:</h2>
            {
                links
            }
        </div>
    );
}