"use client";

import EmailLink from './EmailLink';
import GithubLink from './GithubLink';
import LinkedinLink from './LinkedinLink';
import RSSLink from './RSSLink';

export default function SocialLinks() {
    return (
        <div className="social_links">
            <LinkedinLink />
            <GithubLink />
            <EmailLink />
            <RSSLink />
        </div>
    );
}