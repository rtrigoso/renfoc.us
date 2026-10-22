import PostCardEmbed from './PostCardEmbed';
import { renderContent } from './cardContent';
import ExternalLink from "@/components/basic/ExternalLink";
import { shortHash } from "@/utils/strings";
import { formatDateWithOffset } from "@/utils/dates";

interface CardProps {
    username: string;
    handle: string;
    date: Date;
    content: string;
    embedImgURL?: string;
    embedAlt?: string;
    embedAspectRatio?: string;
    embedExternalUri?: string;
    postURL: string;
}


export default function Card(props: CardProps) {
    return (
        <li>
            <ul>
                <li>
                    <a href={props.postURL} target="_BLANK">link hash: {shortHash(props.postURL)} <ExternalLink /></a>
                </li>
                <li>
                    <div>
                        <strong className="card_username">Author: {props.username} <span className="card_handle">&lt;{props.handle}&gt;</span></strong>
                    </div>
                </li>
                <li>
                    <div>
                        Date: {formatDateWithOffset(props.date)}
                    </div>
                </li>
                <li>
                    <div className="card_content_text">
                        {renderContent(props.content, props.embedExternalUri)}
                    </div>
                </li>
                {
                    props.embedImgURL &&
                    <li className="card_embed_item">
                        <PostCardEmbed
                            alt={props.embedAlt || ''}
                            type={"image"}
                            link={props.embedImgURL}
                            aspectRatio={props.embedAspectRatio || ''}
                        />
                    </li>
                }
            </ul>
        </li>
    );
}
