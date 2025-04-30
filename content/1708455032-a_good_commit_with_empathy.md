###### 2-13-2025
# A Good Commit, with Empathy
It is easy to miss good solutions. The best type of solution is the one that feels natural, hence invisible. Good commits tend to fall into that spectrum. 

For those who aren't fluent in programming lingo, commits are a way to save the state of our work, like you'd save your progress on a videogame. 

Git commits allow us to go back to a specific point in our progress to see or revert changes made to a project. Since projects are often worked on between multiple people, the safe states come from all the members working on it.  

A commit is mainly made up of:
- a unique identifier
- file(s) changes
- a message

All of these items are accessible to the people working on the project.

## What is a Commit Message?
Focus not on the *what* but the *why*.

Developers have access to both a unique identifier and the file changes. This leaves the message with the high order responsibility to contain everything else. A commit message is the description of the state outside of the file changes. 

The message should be able to fill in the following sentence: "**IF APPLIED, THIS COMMIT WILL _________**" without describing the code changes. 

## Empathy Wanted
Generally, we code in packs. Just like another relationship, communication is essential. These git messages are a way to tell a story, and we should take advantage of that. When we successfully understand our code as affecting others, we can begin tackling major issues impeding progress. Progress halts when
- we feel frustration out of code that makes no sense to us.
- We feel ineptitude while looking for new ways to do a previously done task.
- We feel hopeless while working on code we have no background on.

The following is an example of a commit message that lacks empathy:
```
commit ce820a9da
Author: ren-rocks 
Date:   Mon Feb 4 11:23:07 2021 -0500

    quick fix


```

## What is a Good Commit Message?
First of, a good commit message follows the generally accepted structure. There are [tons](https://www.git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project#_commit_guidelines) of [posts](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) [about](https://github.com/torvalds/subsurface-for-dirk/blob/master/README.md#contributing) a [good](https://github.com/erlang/otp/wiki/writing-good-commit-messages) commit structure. 

```
commit b3ed56c94a7
Author: ren-rocks 
Date:   Mon Mar 1 23:02:47 2021 -0500

    fix bad parsing due to v3.1 API changes

    changes to the NYT API response broke 
    the regex string.

    this change removes patch ce820a9dd. The
    new regex handles both endpoints.

    endpoints updated: topStories and 
    latest.

    an alert has been added to check for
    future API changes so we do not go 
    through this again.

    find the new alert in card 38t90
```

Aside from the general commit rules, a good commit message 
- explains why the change is needed

and has at least a few of the following:
- has keywords that help searches
- tells other developers how the author arrived at that fix
- teaches about the new tools or the repo
- sounds human, not robotic

Ideally, we can make each other's lives easier. I hope this post helps to do that.