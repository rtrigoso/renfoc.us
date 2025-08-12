import LinkList from "@/composites/PostsList";
import { GetLinksDataFromContent } from "@/utils/content";

export default async function Posts() {
    const content = await GetLinksDataFromContent()

    return (
        <section>
            <h3>All Posts:</h3>
            <LinkList content={content}/>
        </section>
    );
}