import Link from "next/link";

export default async function Page() {
    return (
        <>
            <section>
                <h3>Demos:</h3>
                <ul className="tools">
                    <li>
                        <Link href={'/tools/subharmonics'}>Subharmonics</Link>
                    </li>
                </ul>
            </section>
            <section>
                <h3>Self-Hosted Tools:</h3>
                <ul className="tools">
                    <li>
                        <a href="https://app.plex.tv" target="_BLANK">For media sharing and storage</a>
                    </li>
                    <li>
                        <a href="https://ntfy.renfoc.us" target="_BLANK">HTTP based pub-sub notification service</a>
                    </li>
                    <li>
                        <a href="https://watchlist.renfoc.us" target="_BLANK">Media request server for my Plex instance</a>
                    </li>
                </ul>
            </section>
        </>
    );
}
