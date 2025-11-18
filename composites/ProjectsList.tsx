import Link from "next/link";
import { Fragment } from "react";

const projects = [
    {
        key: 'steam-headless',
        label: 'headless steam - Intel GPU ready',
        description: 'This repo is a fork of Steam-Headless that adds the required packages to use Intel ARC battleimage GPUs.',
        link: 'https://github.com/rtrigoso/docker-steam-headless-intel-gpu'
    },
    {
        key: 'hn-focus',
        label: 'hn-focus',
        description: 'top articles focusing on computer science sorted by a custom low-interval wilson score.',
        link: 'https://hn.renfoc.us/'
    },
    {
        key: 'gameloop',
        label: 'gameloop',
        description: 'a very barebones game engine for the terminal, written in go.',
        link: 'https://github.com/rtrigoso/gameloop'
    },
    {
        key: 'chord-machine-calculator',
        label: 'chord machine calculator',
        description: 'Small tool that helps visualize chords built with Elektron’s chord machine utility.',
        link: 'https://chord-machine-calculator.ren.rocks/'
    },
];

export default async function ProjectList() {
    const links = projects.map(project => {
        const {
            key,
            label,
            description,
            link
        } = project;

        return (
            <Fragment key={`project-${key}`}>
                <dt>
                    <Link
                        tabIndex={0}
                        className="link post_link"
                        href={link}>
                        {`${label.charAt(0).toUpperCase() + label.slice(1)}: `}
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
