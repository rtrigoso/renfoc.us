###### 4-29-2025
# What happened to Progressive Web Apps (PWAs)?
Open web standards are good for us. They are publicly agreed-upon rules and technologies—like HTML, CSS, JavaScript, and HTTP—that define how the web works. These standards are maintained by organizations like the W3C (World Wide Web Consortium) and WHATWG, and are designed to ensure the web remains open, accessible, and interoperable. Open standards help prevent monopolies from locking down the internet and allow engineers to work smarter: write once, run anywhere.

Delivering applications can feel like working the kitchen at an all-you-can-eat buffet: success depends on satisfying all possible tastes. Great products should reach everyone, regardless of their personal device preferences. Just as chefs serve chicken, steak, and shrimp, engineers have to support Android, iOS, Chrome, Safari, offline use—you name it. Better support requires more resources.

Enter Progressive Web Apps (PWAs), introduced in 2015 as a "recipe" that could cater to all those tastes. A PWA uses modern browser APIs to deliver an app-like experience not tied to any operating system. PWAs can be installed like native desktop or mobile apps—and even work offline! Since they're built on browser APIs, the same implementation can work across platforms. That was huge: engineers could reach more users with fewer resources.

Web-based apps are also easier to deliver. Instead of going through the Play Store or App Store, users can access PWAs directly via a URL. Developers were excited. I was especially thrilled to skip platform approval processes and associated fees. Google’s early support of this open-source standard made it feel like a safe bet.

## Lack of Adoption and Understanding
Unfortunately, the PWA heatwave cooled down just a few years later. Hybrid frameworks like React Native gained traction. While Google’s Chrome browser offered full PWA support, Apple’s Safari and Mozilla’s Firefox lagged behind in implementing key APIs. This inconsistency made development harder.

A bug[^1] filed on December 15, 2020, on Mozilla’s Bugzilla highlighted broken and missing standard APIs needed for PWAs to function correctly—most notably, the lack of app installation in Firefox. Mozilla cited limited resources and low user interest, opting to offer only partial PWA support. Features were disabled by default and buried behind secret configuration menus.

This decision split users into two camps: those who supported the move, citing security concerns, and those who opposed it, fearing it gave Chrome an edge in the browser wars[^2]. Critics argued that if an app relies on features not universally supported, it's the app—not the browser—that's to blame. Either way, people feared that inconsistent PWA support could lead to fragmentation, pushing developers toward browsers with better support and undermining the open web.

Apple wasn’t any more enthusiastic. iOS placed severe limitations on PWAs: no background sync, limited storage, and no push notifications (until recently). Their tight control over hardware and software made it harder for PWAs to thrive. A major inconsistency: Android treats installed PWAs like native apps, complete with app drawer icons, but iOS did not—making them hard to find. One principle engineers understand: a good product shouldn’t require user instructions to function. Apple eventually added some PWA features—but only behind experimental flags, and seven years late[^3].

Things got worse on iOS. In September 2023, a bug[^4] was reported in Apple’s developer forums describing how PWAs that worked on iOS 16.6.1 were broken on iOS 17. Symptoms included broken icons, placeholder errors (like a question mark instead of content), and issues fetching PWA data. Storage was also inconsistent, depending on the frontend framework used[^5].

## Here is to Hoping
On March 20, 2025, Mozilla announced the reintroduction of web app support via "Taskbar Tabs" in Firefox. Web apps will now have their own icons in taskbars, docks, and app menus. Persistent sessions will allow them to remain open in the background—bringing us closer to native app behavior. These apps can even handle links associated with their domains, improving integration with the OS.

Although the feature is still behind a hidden preference in Firefox Nightly, it’s a hopeful sign. Mozilla has said they’re open to user feedback, though updates have been sparse. Still, I’m hopeful we can bring PWAs back into the spotlight.

#### sources
- [^1]: [1682593 - Remove the SSB feature](https://bugzilla.mozilla.org/show_bug.cgi?id=1682593)
- [^2]: [firefox removes site-specific browser features](https://news.ycombinator.com/item?id=25589177)
- [^3]: [pwa on ios](https://brainhub.eu/library/pwa-on-ios)
- [^4]: [bug report on apple support](https://developer.apple.com/forums/thread/737827)
- [^5]: [IOS PWA Feature Updates](https://firt.dev/ios-15.4b)