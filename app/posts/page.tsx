import LinkList from "@/composites/LinkList";
import { GetLinksDataFromContent } from "@/utils/content";

export default async function Posts() {
    const content = await GetLinksDataFromContent()

    return (
        <>
            <LinkList content={content}/>
        </>
    );
}