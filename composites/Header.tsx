'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import SocialLink from './SocialLink';
import CoffeeCupIcon from './icons/CoffeeCupIcon';
import LinkedinIcon from './icons/LinkedinIcon';
import GithubIcon from './icons/GithubIcon';
import EmailIcon from './icons/EmailIcon';
import UpworkIcon from './icons/UpworkIcon';
import RSSIcon from './icons/RSSIcon';

export default function Header() {
    const pathname = usePathname();
    return (
        <header>
            <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
                <div className="crop_circle logo_wrapper">
                    <Image
                        src="/header.webp"
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
                    <h1>Ren's blog</h1>
                </Link>
                <h2>Metaphysics, tunes, and code</h2>
                <nav id="social_links">
                    <span className="hide_on_mobile">Connect: </span>
                    <SocialLink href="https://www.linkedin.com/in/ren-trigoso-a36609186/" ariaLabel="my linkedin" hiddenText="visit my linkedin">
                        <LinkedinIcon />
                    </SocialLink>
                    <SocialLink href="https://github.com/rtrigoso/" ariaLabel="my github" hiddenText="visit my github">
                        <GithubIcon />
                    </SocialLink>
                    <SocialLink href="mailto:resume@renrocks.mozmail.com" ariaLabel="send me an email" hiddenText="send me an email">
                        <EmailIcon />
                    </SocialLink>
                    <SocialLink href="https://www.upwork.com/freelancers/~0101ffe1f36d5b9159" ariaLabel="upwork" hiddenText="hire me for freelancing">
                        <UpworkIcon />
                    </SocialLink>
                    <SocialLink href="https://renfoc.us/rss.xml" ariaLabel="rss feed" hiddenText="rss feed link">
                        <RSSIcon />
                    </SocialLink>
                </nav>
             </section>
        </header>
    );
}
