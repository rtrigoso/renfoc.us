'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import SocialLink from './SocialLink';
import CoffeeCupIcon from './icons/CoffeeCupIcon';
import LinkedinIcon from './icons/LinkedinIcon';
import GithubIcon from './icons/GithubIcon';
import EmailIcon from './icons/EmailIcon';
import RSSIcon from './icons/RSSIcon';
import { SITE_TAGLINE, GITHUB_USERNAME, SITE_DOMAIN, HEADER_IMAGE } from '@/utils/config';

const SOCIAL_LINKS = [
    { href: 'https://www.linkedin.com/in/ren-trigoso-a36609186/', ariaLabel: 'my linkedin', hiddenText: 'visit my linkedin', icon: <LinkedinIcon /> },
    { href: `https://github.com/${GITHUB_USERNAME}/`, ariaLabel: 'my github', hiddenText: 'visit my github', icon: <GithubIcon /> },
    { href: 'mailto:resume@renrocks.mozmail.com', ariaLabel: 'send me an email', hiddenText: 'send me an email', icon: <EmailIcon /> },
    { href: `https://${SITE_DOMAIN}/rss.xml`, ariaLabel: 'rss feed', hiddenText: 'rss feed link', icon: <RSSIcon /> },
];

export default function Header() {
    const pathname = usePathname();
    return (
        <header>
            <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
                <div className="crop_circle logo_wrapper">
                    <Image
                        src={HEADER_IMAGE}
                        alt="selfie created with ai on the style of a studio ghibli movie"
                        className="logo"
                        width={250}
                        height={140}
                        placeholder="blur"
                        blurDataURL="/header_loading.webp"
                    />
                </div>
            </Link>
            <section>
                <div className="buymecoffee_wrapper">
                    <a href="https://www.buymeacoffee.com/renrocks" target="_blank" rel="noreferrer">Buy me <CoffeeCupIcon /><span className="hidden">, opens in new tab</span></a>
                    <br />
                </div>
                <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
                    <h1 className="glitch" data-text="Ren's blog">Ren's blog</h1>
                </Link>
                <h2>{SITE_TAGLINE}</h2>
                <nav id="social_links">
                    <span className="hide_on_mobile">Connect: </span>
                    <ul id="social_links_list">
                        {SOCIAL_LINKS.map(({ href, ariaLabel, hiddenText, icon }) => (
                            <SocialLink key={href} href={href} ariaLabel={ariaLabel} hiddenText={hiddenText}>
                                {icon}
                            </SocialLink>
                        ))}
                    </ul>
                </nav>
             </section>
        </header>
    );
}
