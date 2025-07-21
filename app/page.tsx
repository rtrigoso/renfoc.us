import BlueskyFeed from "@/composites/BlueskyFeed";
import LinkList from "@/composites/LinkList";
import { GetLinksDataFromContent, generateRSSFeed } from "@/utils/content";

export default async function Home() {
  await generateRSSFeed();
  const content = await GetLinksDataFromContent()
  const projects = [
    {
      key: 'gameloop',
      label: 'gameloop',
      description: 'a very barebones game engine for the terminal, written in go.',
      link: 'https://github.com/rtrigoso/gameloop'
    },
    {
      key: 'hn-focus',
      label: 'hn-focus',
      description: 'top articles focusing on computer science sorted by a custom low-interval wilson score',
      link: 'https://hn.renfoc.us/'
    },
    {
      key: 'covid-aggregator',
      label: 'covid aggregator',
      description: 'A simple news aggregator that follows coronavirus-related news auto updates every 15 minutes.',
      link: 'https://covid19.ren.rocks/'
    },
    {
      key: 'chord-machine-calculator',
      label: 'chord machine calculator',
      description: 'Small tool that helps visualize chords built with Elektron’s chord machine utility',
      link: 'https://chord-machine-calculator.ren.rocks/'
    },
    {
      key: 'readenobility',
      label: 'readenobility',
      description: 'An implementation of the standalone version of the readability library used for Firefox Reader View for Deno. ',
      link: 'https://github.com/rtrigoso/readenobility'
    }
  ];

  projects.sort(() => Math.random() - 0.5);

  return (
    <>
      <LinkList content={content} max={10} />
      <div className="featured_projects">
        <h3>Featured Projects:</h3>
        {
          projects.map(({ link, label, description }) => (
            <div className="featured_project_link" key={label}>
              <a href={link} target="_BLANK" tabIndex={0}>
                <div className="featured_project_name">{label}</div>
                <div className="featured_project_description">{description}</div>
              </a>
            </div>
          ))
        }
      </div>
      <BlueskyFeed />
    </>
  );
}