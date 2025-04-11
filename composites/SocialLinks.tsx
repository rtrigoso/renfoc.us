"use client";

import EmailLink from './EmailLink';
import GithubLink from './GithubLink';
import LinkedinLink from './LinkedinLink';

export default function SocialLinks() {
    return (
        <div className="social-links">
            <LinkedinLink />
            <GithubLink />
            <EmailLink />
        </div>
    );
}