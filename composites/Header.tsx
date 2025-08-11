import Link from 'next/link';
import Image from 'next/image';
import EmailLink from './EmailLink';
import GithubLink from './GithubLink';
import LinkedinLink from './LinkedinLink';
import RSSLink from './RSSLink';

export default function Header() {
    return (
        <header>
            <Link href="/">
                <Image
                    src="/header.webp"
                    alt="selfie created with ai on the style of a studio ghibli movie"
                    width={250}
                    height={140}
                    placeholder="blur"
                    blurDataURL="/header_loading.webp"
                />
            </Link>
            <Link href="/">
                <h1>Ren's blog</h1>
            </Link>
            <h2>Metaphysics, tunes, and code</h2>
            <nav role="navigation">
                <section>
                    <a href="https://www.buymeacoffee.com/renrocks" target="_BLANK">Buy me coffee</a>
                    <br />
                </section>
                <section>
                    <LinkedinLink /> |{` `}
                    <GithubLink /> |{` `}
                    <EmailLink /> |{` `}
                    <RSSLink />
                </section>
            </nav>
        </header>
    );
}
