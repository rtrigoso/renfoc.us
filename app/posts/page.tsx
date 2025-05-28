import LinkList from "@/composites/LinkList";
import { GetLinksDataFromContent, PrintContentReadableCreationTime, ReadContentDirectory } from "@/utils/content";

export default async function Posts() {
    const content = await GetLinksDataFromContent()

    return (
        <div>
            <h3>All posts:</h3>
            <LinkList content={content}/>
        </div>
    );
}