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
                    src={link}
                    alt={alt}
                    width={75}
                    height={75 * h / w}
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

export default function Card(props: CardProps) {
    return (
        <div className="card">
            <div>
                <img
                    className="avatar"
                    src={props.avatarURL}
                    alt={`image: avatar for ${props.username}`}
                    width={25}
                    height={25}
                />
            </div>
            <div>
                <div>
                    <strong>{props.username}</strong> - {props.date.toLocaleDateString("en-US")}
                </div>
                <div>
                    {props.content}
                </div>
                {
                    props.embedImgURL &&
                    <PostCardEmbed
                        alt={props.embedAlt || ''}
                        type={"image"}
                        link={props.embedImgURL}
                        aspectRatio={props.embedAspectRatio || ''}
                    />
                }
                <div>
                    <a href={props.postURL} target="_BLANK">view post</a>
                </div>
            </div>
        </div>
    );
}