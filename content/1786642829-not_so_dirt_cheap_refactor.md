{/*tags
opinion
engineering
ai
software
*/}
{/*description
This post argues that AI agents haven't actually made refactoring cheaper, they've just made the same risky, all-or-nothing rewrites faster. The real fix, the author says, is doing refactors in small, incremental pieces instead of big sweeps.
*/}
###### 08-13-2026
## Not So Dirt-Cheap Refactor

Is refactoring cheap now?

Maybe a little cheaper, but not really.

I learned that refactors are expensive years ago, during my first real programming position. I worked at a broadcasting company with a 24/7 news cycle. I was eager to prove myself to the team. I researched and tested new and trending features. In that same spirit, I introduced a lot of buggy behavior to an otherwise healthy monolith.

"The app is currently working, but it is hard to maintain. We need to spend more time updating systems to a different architectural pattern. Things have changed, and previous decisions are making us slow," says the new hire, with eyes sparkling with the joy of becoming a pillar of the latest app iteration.

The leads bring down the hammer with a single note: "Is it worth it?"

The cost of a refactor is high because it doubles the points of failure. Refactoring means spending time building features that are already working. The hope is that we will improve speed if the changes are successful. The reality is, as I learned, that good engineers do prepare against eventualities. Engineers are doomsday prepers.

In a plausible worst-case scenario, the app breaks. The changes pass a quick sniff test. Suddenly, we notice that the refactor misses a little thing that was needed on a very niche scenario. More little issues start popping up. The team needs to keep the boat afloat, and so most resources are allocated toward the problems. Resources are scarce, so requested features are slowed down to a standstill, and the refactor is deemed a failure.

Some have told me that AI agents are made to refactor. The idea is to use detailed prompts to run refactors, while the saved time is moved into sniff testing. We can now verify the changes as we let the agents run with a planned refactor that you review. The repo behaves like an always-available pool of understanding that agents explore to make the correct decisions and not miss issues during a refactor. Some of these agents can do an entire rework quickly enough to shock you.

I disagree with the premise because the cost remains the same. Think about the time used during a refactor: adding prompt instructions, letting them run while you test active changes. Those resources could have added gains elsewhere, to an otherwise healthy but hard-to-maintain project. The cost of a refactor has always been relative to hypothetical changes: consider what could be done with that time instead of working on things that are already running. The time spent is relatively the same before and after agents. Objectively, the time that a refactor takes might be getting smaller, but the cost is still there.

The cost of refactoring was never the time spent. The cost of a refactor is relative to time spent, which means that cost decreases with the size of the lift. You want to make a real impact? You work on bite-sized changes. Like a snowball rolling down a hill, those small refactors start creating a very efficient application, and because the lift is validated in portions, the resources spent are not drained on backwork.

So, is refactoring cheap now? Not really. Agents just made us faster at doing the same expensive thing. The cost didn't vanish; it got compressed enough that we stopped feeling it. What actually moves the price was never the tool. It's the size of the bet.

Back in that newsroom, the version of me with sparkling eyes wanted to rework the whole monolith in one sweep. If I had that idea today, with an agent doing the typing, I'd still be betting the same chips, just faster. The team would still drop everything to bail water if the agent missed that one niche scenario. 

Faster doesn't mean safer. It means you find out you were wrong sooner.
