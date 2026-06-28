###### 06-26-2026
## Antipatterns: The Blob

I am not referring to the original movie from 1958, starring Steve McQueen.
I am also not referring to the reboot directed by Chuck Russell.

In software engineering, sometimes you run into a file holding an absurdly complicated function. This function runs for hundreds of lines and has more conditionals than you can hold in your head. You have been tasked to update this function with a small feature request. As soon as you see the code, you freeze up.

The thought crosses your mind: "I do not want to mess anything up." It makes you procrastinate the changes. Even after reading the code, you aren't sure what consequences your changes will have everywhere else.

Just like in the movie, it freezes you.

And here is the thing: it is good that you are scared. I mean it. Great engineers get scared too.

### Megalophobia

Have you noticed how much easier it is to add new code than update old code? When you write something new, you know exactly what the consequences are: none yet. No previous code to break. No existing callers to surprise. No edge cases hiding in logic you didn't write.

The more code there is inside the logic you need to change, the scarier it gets. The more responsibilities a function has picked up over time, the scarier it gets. That is just how it works, and you are not being dramatic by feeling it.

We do not like when a single function keeps eating responsibilities. They never stop on their own.

As people leave the team and new ones join, the Blob grows stronger. The new folks add more logic to it because there is really no other option: you have a timeline, you have a release schedule, and nobody can afford to refactor something this size. And the additions make sense in the moment. They always do.

### Painting the Picture

Maybe the function is called `HandleSubmission`. Maybe it started simple. It receives a text value and, if not empty, sends a request to another service. Then the product manager asks you to track who clicks submit. You add a username argument and send it along. Then a special message needs to show for admins. You add an `is_admin` boolean and a conditional. Then bad words need to be filtered. You add regex. Then a specific user needs their submissions logged.

Where do you add that last one?

### Beware of the Blob

The Blob is a class or function that has taken on too many responsibilities. You may also see it called a God Class or God Object, though those names carry their own distinctions. It knows too much, does too much, and touches too much. Everything flows through it. Nobody knows what it fully does anymore, and nobody wants to be the one to find out the hard way.

Here is `HandleSubmission`, a few sprints later:

```js
async function HandleSubmission(text, username, isAdmin, userId) {
  if (!text) return;

  if (userId === "usr_debug_001") {
    console.log(`[LOG] ${username} tried to submit: ${text}`);
  }

  const badWords = ["spam", "hate", "bad"];
  let cleaned = text;
  for (const word of badWords) {
    cleaned = cleaned.replace(new RegExp(word, "gi"), "***");
  }

  if (isAdmin) {
    await fetch("/api/submissions", {
      method: "POST",
      body: JSON.stringify({ text: cleaned, username, isAdmin }),
    });
    return "Thank you Admin person!";
  }

  await fetch("/api/submissions", {
    method: "POST",
    body: JSON.stringify({ text: cleaned, username }),
  });

  trackEvent("submission", { username });
}
```

It validates. It filters. It logs. It fetches. It tracks. It formats responses based on role. None of these things belong together, and yet here they all are.

Blobs tend to share the same tells. They are named something vague like `Handle`, `Process`, `Manage`, or `Do`. The argument list has grown longer than it should ever be. There are conditionals checking for roles, types, or specific hardcoded values scattered throughout. It reaches out to multiple services, databases, or files. Writing tests for it means mocking a dozen things first. Every PR touching it includes a comment saying "be careful, this is complex." New logic always gets added at the bottom because nobody dares touch what is already up there.

### You Are Not Alone

Look, this happens everywhere. [The Linux process scheduler](https://github.com/torvalds/linux/blob/master/kernel/sched/core.c) is over 10,000 lines. [Chromium's RenderFrameHostImpl](https://github.com/chromium/chromium/blob/main/content/browser/renderer_host/render_frame_host_impl.cc) has been brought up repeatedly as one of the most tangled classes in its codebase. [Rails' ActiveRecord::Base](https://github.com/rails/rails/blob/main/activerecord/lib/active_record/base.rb) has pulled in so many concerns that entire patterns now exist just to move logic back out of it.

These are maintained by some of the best engineers in the world. Finding a Blob is not a sign that you are surrounded by bad engineers. It is a sign of awareness.

The first step is just recognizing it. Name it. When you open a function and feel that freeze, you are looking at a Blob. The second step is not necessarily fixing it today. It is making sure what you add next does not make it worse.

You will be fine.

#### More Antipatterns Incoming
I hope this short definition was enjoyable because I will be writing more of it. I am starting a new series on my blog. These posts are meant to work as reaffirmations for me and you, and hopefully clear up all that negative imposter-syndrome, which I suffer from a lot. Either way, I am sure that refreshing anti-patterns will make you a better engineer, even in these trying, AI-trending times.
