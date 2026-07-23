'use client';

import { useState } from 'react';
import PlayIcon from './icons/PlayIcon';

type Props = {
    'data-video-id': string;
    'data-start'?: number;
    'data-title'?: string;
};

export default function YoutubeEmbed({ 'data-video-id': videoId, 'data-start': start, 'data-title': title }: Props) {
    const [loaded, setLoaded] = useState(false);

    const embedParams = new URLSearchParams({ autoplay: '1' });
    if (start) embedParams.set('start', String(start));

    return (
        <figure>
            {loaded ? (
                <div className="youtube-embed">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?${embedParams}`}
                        title={title ?? 'YouTube video player'}
                        sandbox="allow-scripts allow-same-origin allow-presentation"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                    />
                </div>
            ) : (
                <button
                    type="button"
                    className="youtube-embed youtube-embed--facade"
                    onClick={() => setLoaded(true)}
                    aria-label={title ? `Play video: ${title}` : 'Play YouTube video'}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" loading="lazy" />
                    <PlayIcon />
                </button>
            )}
            {title && <figcaption>{title}</figcaption>}
        </figure>
    );
}
