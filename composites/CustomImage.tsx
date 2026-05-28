type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
    src: string;
    alt: string;
};

export default function CustomImage({ src, alt, className, ...props }: Props) {
    const webpSrc = src.replace(/\.[^.]+$/, '.webp');

    return (
        <picture>
            <source srcSet={webpSrc} type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                className={`custom-image${className ? ` ${className}` : ''}`}
                {...props}
            />
        </picture>
    );
}
