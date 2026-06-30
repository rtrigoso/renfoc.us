import { GetAllTags } from "@/utils/content";
import Link from "next/link";

export default async function TagsPage() {
    const tags = await GetAllTags();
    const sorted = [...tags].sort();

    return (
        <section>
            <h3>All Tags:</h3>
            <ul>
                {sorted.map(tag => (
                    <li key={tag}>
                        <Link href={`/tags/${tag}`}>
                            {tag.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
