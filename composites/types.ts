export interface PostCardEmbed {
    alt: string
    type: 'image'
    link: string
    aspectRatio: string
}

export interface PostCardPost {
    avatar: string
    displayName: string
    content: string
    createdAt: Date
    embeds: PostCardEmbed[]
    link: string
}
