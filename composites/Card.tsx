import ExternalLink from "@/composites/ExternalLink";

interface PostCardEmbed {
    alt: string
    type: 'image'
    link: string
    aspectRatio: string
}

function PostCardEmbed({ alt, link, aspectRatio, type }: PostCardEmbed) {
    switch (type) {
        case 'image':
            const w = parseInt(aspectRatio.split('/')[0]);
            const h = parseInt(aspectRatio.split('/')[1]);
            return (
                <img
                    className="card_embed_img"
                    src={link}
                    alt={alt}
                    width={100}
                    height={100 * h / w}
                />
            )
        default:
            return null;
    }

}

interface CardProps {
    avatarURL: string;
    username: string;
    date: Date;
    content: string;
    embedImgURL?: string;
    embedAlt?: string;
    embedAspectRatio?: string;
    postURL: string;
}

function renderContent(content: string) {
    return content.split(/(\s+)/).map((part, i) => {
        const match = part.match(/^(#\w+)(.*)/);
        if (!match) return part;

        const [, hashtag, rest] = match;
        return (
            <span key={i}>
                <a href={`https://bsky.app/hashtag/${hashtag.slice(1)}`} target="_blank" rel="noopener noreferrer">
                    {hashtag}
                </a>
                {rest}
            </span>
        );
    });
}

export default function Card(props: CardProps) {
    return (
        <li className="card">
            <div className="card_header">
                 <img
                    className="avatar"
                    src={props.avatarURL}
                    alt={`image: avatar for ${props.username}`}
                    width={50}
                    height={50}
                />
                <div>
                    <strong>{props.username}</strong>
                </div>
                <div>
                    {props.date.toLocaleDateString("en-US", { month: 'numeric', day: 'numeric' })}
                </div>

            </div>
            <div className="card_content">
               <div>
                    {renderContent(props.content)}
                </div>
                {
                    props.embedImgURL &&
                    <PostCardEmbed
                        alt={props.embedAlt || ''}
                        type={"image"}
                        link={props.embedImgURL}
                        aspectRatio={props.embedAspectRatio || ''}
                    />
                }                <div>
                    <a href={props.postURL} target="_BLANK">view post <ExternalLink /></a>
                </div>
            </div>
        </li>
    );
}
