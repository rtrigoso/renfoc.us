interface SocialLinkProps {
    href: string;
    ariaLabel: string;
    hiddenText: string;
    children: React.ReactNode;
}

export default function SocialLink({ href, ariaLabel, hiddenText, children }: SocialLinkProps) {
    return (
        <a className="social-link" href={href} target="_BLANK" aria-label={ariaLabel}>
            <span className="hidden">{hiddenText}</span>
            {children}
        </a>
    );
}
