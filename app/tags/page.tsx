import { GetAllTags } from "@/utils/content";
import { formatTagLabel } from "@/utils/strings";
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
                            {formatTagLabel(tag)}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
