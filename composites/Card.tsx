import PostCardEmbed from './PostCardEmbed';
import { renderContent } from '@/utils/cardContent';

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
                }
                <br />
            </div>
        </li>
    );
}
