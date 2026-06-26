
interface PostCardEmbed {
    alt: string
    type: 'image'
    link: string
    aspectRatio: string
}

export default function PostCardEmbed({ alt, link, aspectRatio, type }: PostCardEmbed) {
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
