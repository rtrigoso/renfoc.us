import Link from "next/link";
import { Fragment } from "react";
import ExternalLink from "@/composites/ExternalLink";
import { capitalize } from "@/utils/strings";

const projects = [
    {
        key: 'scoreboard',
        label: 'scoreboard',
        description: 'play a little arcade game and see how you rank.',
        link: '/scoreboard',
        internal: true,
    },
    {
        key: 'steam-headless',
        label: 'headless steam - Intel GPU ready',
        description: 'This repo is a fork of Steam-Headless that adds the required packages to use Intel ARC battleimage GPUs.',
        link: 'https://github.com/rtrigoso/docker-steam-headless-intel-gpu',
    },
    {
        key: 'hn-focus',
        label: 'hn-focus',
        description: 'top articles focusing on computer science sorted by a custom low-interval wilson score.',
        link: 'https://hn.renfoc.us/',
    },
    {
        key: 'gameloop',
        label: 'gameloop',
        description: 'a very barebones game engine for the terminal, written in go.',
        link: 'https://github.com/rtrigoso/gameloop',
    },
    {
        key: 'chord-machine-calculator',
        label: 'chord machine calculator',
        description: "Small tool that helps visualize chords built with Elektron's chord machine utility.",
        link: 'https://chord-machine-calculator.ren.rocks/',
    },
];

type Project = {
    key: string;
    label: string;
    description: string;
    link: string;
    internal?: boolean;
};

export default async function ProjectList() {
    const links = (projects as Project[]).map(project => {
        const { key, label, description, link, internal } = project;

        return (
            <Fragment key={`project-${key}`}>
                <dt>
                    <Link
                        tabIndex={0}
                        className="link post_link"
                        href={link}>
                        {`${capitalize(label)}: `} {!internal && <ExternalLink />}
                    </Link>
                </dt>
                <dd>
                    {description}
                </dd>
            </Fragment>
        );
    });

    return (
        <dl>{links}</dl>
    );
}
