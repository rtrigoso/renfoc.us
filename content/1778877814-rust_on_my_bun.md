###### 05-15-2026
## Rust on my Bun
I am surprised we are not talking about Bun.sh and how it was ported to Rust using LLM. This whole week has been fascinating!

Everything started with [Anthropic acquiring Bun.sh](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone).

Some within [the bun community raised some concerns](https://wwj.dev/posts/i-am-worried-about-bun/) due to Anthropic's taste for the experimental, which is generally a good thing for innovation but it goes against "if it is not broken, do not fix it".

Suddenly, a PR to port bun from zig to rust was written. It sent people into a frenzy, to the point that the PR owner had to comment on the matter:

> I work on Bun and this is my branch This whole thread is an overreaction. 302 comments about code that does not work. We haven't committed to rewriting. There's a very high chance all this code gets thrown out completely. I'm curious to see what a working version of this looks, what it feels like, how it performs and if/how hard it'd be to get it to pass Bun's test suite and be maintainable. I'd like to be able to compare a viable Rust version and a Zig version side by side.
>
> -- Jarred [(source)](https://news.ycombinator.com/item?id=48019226)

Hilariously enough, the [PR merged](https://github.com/oven-sh/bun/pull/30412). We found that the entire port was mostly done by a model and a giant prompt, which [was added to the repo](https://github.com/oven-sh/bun/commit/46d3bc29f270fa881dd5730ef1549e88407701a5#diff-b3c07d9485bc3ae6894a60cba66d6d93c1c43223c9dcf47ad64691930f090152R352).

And here we are now, with a ton of issue tickets being added to the repo, with titles like "[all of rust codebase: This codebase fails even the most basic miri checks, allows for UB in safe rust](https://github.com/oven-sh/bun/issues/30719)"

I find these small moments of engineering history fascinating. People were split in the middle about the work, and they still are. There were a ton of things that could have been done process wise to improve the perception of the community, and hopefully we see a post-mortem.

Either way, I think we all benefit from events like these.
