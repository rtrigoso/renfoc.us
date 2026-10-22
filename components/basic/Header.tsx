'use client';
import Link from 'next/link';
import CustomImage from './CustomImage';
import { usePathname } from 'next/navigation';
import SocialLink from './SocialLink';
import CoffeeCupIcon from '@/components/icons/CoffeeCupIcon';
import LinkedinIcon from '@/components/icons/LinkedinIcon';
import GithubIcon from '@/components/icons/GithubIcon';
import EmailIcon from '@/components/icons/EmailIcon';
import RSSIcon from '@/components/icons/RSSIcon';
import BskyIcon from '@/components/icons/BskyIcon';

export default function Header() {
    const pathname = usePathname();
    return (
        <header>
            <div id="top_header">
                <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
                    <div className="crop_circle logo_wrapper">
                        <CustomImage
                            src="/header.jpg"
                            alt=""
                            className="logo glitch-img"
                            width={250}
                            height={140}
                        />
                    </div>
                </Link>
                <section className="title_block">
                    <h1 className="glitch website_header" data-text="Ren's blog">
                        <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>Ren&apos;s blog</Link>
                    </h1>
                    <div className="tagline">Metaphysics, tunes, and code</div>
                </section>
            </div>
            <div id="bottom_header">
                <nav id="social_links" className="social_links">
                    <h6 className="hide_on_mobile">Connect: </h6>
                    <ul id="social_links_list">
                        <SocialLink href="https://www.linkedin.com/in/ren-trigoso-a36609186/" ariaLabel="my linkedin" hiddenText="visit my linkedin">
                            <LinkedinIcon />
                        </SocialLink>
                        <SocialLink href="https://github.com/rtrigoso/" ariaLabel="my github" hiddenText="visit my github">
                            <GithubIcon />
                        </SocialLink>
                        <SocialLink href="https://bsky.app/profile/ren-rocks.bsky.social" ariaLabel="my bluesky" hiddenText="visit my bluesky">
                            <BskyIcon />
                        </SocialLink>
                        <SocialLink href="mailto:resume@renrocks.mozmail.com" ariaLabel="send me an email" hiddenText="send me an email">
                            <EmailIcon />
                        </SocialLink>
                        <SocialLink href="https://renfoc.us/rss.xml" ariaLabel="rss feed" hiddenText="rss feed link">
                            <RSSIcon />
                        </SocialLink>
                    </ul>
                </nav>
                <div className="buymecoffee_wrapper">
                    like my stuff? <a href="https://www.buymeacoffee.com/renrocks" target="_blank" rel="noreferrer">buy me coffee <CoffeeCupIcon /><span className="hidden">, opens in new tab</span></a>
                    <br />
                </div>
            </div>
        </header>
    );
}
