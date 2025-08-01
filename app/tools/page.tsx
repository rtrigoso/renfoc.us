export default async function Posts() {
    return (
        <>
            <h3>Tools:</h3>
            <p>
                This page showcases tools I&apos;ve personally host. Access is limited to select users. If you need access or think you should have it, feel free to email me!
            </p>
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
        </>
    );
}
