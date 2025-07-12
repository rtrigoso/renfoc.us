import BuyMeACoffeeButton from "@/composites/BuyMeACoffeButton";
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

  while (projects.length > 4) {
    const randomIndex = Math.floor(Math.random() * projects.length);
    projects.splice(randomIndex, 1);
  }
  projects.sort(() => Math.random() - 0.5);

  return (
    <>
      <h3 className="m3">Latest Posts:</h3>
      <LinkList content={content} max={4} />
      <BuyMeACoffeeButton />
      <h3>Featured Projects:</h3>
      {
        projects.map(({ link, label, description }) => (
          <div key={label}>
            <a href={link} target="_BLANK">{label}</a> 
            <span>{description}</span>
          </div>
        ))
      }
    </>
  );
}