import Link from 'next/link';
import Image from 'next/image';
import EmailLink from './EmailLink';
import GithubLink from './GithubLink';
import LinkedinLink from './LinkedinLink';
import RSSLink from './RSSLink';
import Upwork from './Upwork';

export default function Header() {
    return (
        <header>
            <Link href="/">
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
                <Link href="/">
                    <h1>Ren's blog</h1>
                </Link>
                <h2>Metaphysics, tunes, and code</h2>    
                <div>
                    <a href="https://www.buymeacoffee.com/renrocks" target="_BLANK">Buy me coffee</a>
                    <br />
                </div>
                <nav id="social_links">
                    <LinkedinLink />
                    <GithubLink />
                    <EmailLink />
                    <Upwork />
                    <RSSLink />
                </nav>
             </section>
        </header>
    );
}
