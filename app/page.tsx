import BuyMeACoffeeButton from "@/composites/BuyMeACoffeButton";
import LinkList from "@/composites/LinkList";
import { GetLinksDataFromContent } from "@/utils/content";

export default async function Home() {
  const content = await GetLinksDataFromContent()
  const projects = [
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
  
  return (
    <>
      <h2>Metaphysics, tunes, and code.</h2>
      <h3>Latest Posts:</h3>
      <LinkList content={content} max={4} />
      <BuyMeACoffeeButton />
      <h3>Latest Projects:</h3>
      {
        projects.map(({ link, label, description }) => (
          <div key={label}>
            <a href={link} target="_BLANK">{label}</a> 
            <span> - {description}</span>
          </div>
        ))
      }
    </>
  );
}
