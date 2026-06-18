###### 06-18-2026
## What I Look for on Code Reviews

An intern on my team didn't know how to open a pull request. That stuck with me. I was never taught what to look for once one is open either. I figured it out by watching teammates and missing things. Nobody handed me a checklist.

Here is mine.

### 1. Run Lint

If the project doesn't run lint on every push, I run it myself and treat every output line as a finding.

```bash
npx eslint $(git diff --name-only origin/main | grep '\.ts$')
```

A missing semicolon might seem small. But if obvious issues slip through, what else did?

### 2. Check Dependencies

If the PR adds or changes a dependency, I stop. Two questions: is this package safe, and why was it added?

```bash
npm audit
```

Most PRs that drop in a new library don't explain why. I want a comment, a ticket reference, something. If I can't find a reason, I ask.

### 3. Review Anti-Patterns

A class I once reviewed validated input, wrote to the database, sent emails, and formatted the response. No method was longer than 20 lines. It looked clean. It was a God Object. Tests were a nightmare and nothing could be touched without breaking something else.

I scan for patterns like that. Some to watch for:

- God Object
- Spaghetti Code
- Golden Hammer
- Big Ball of Mud
- Lava Flow
- Magic Numbers
- Magic Strings
- Premature Optimization
- Copy-Paste Programming
- Cargo Cult Programming
- Boat Anchor
- Dead Code
- Hardcoding
- Yo-yo Problem
- Poltergeist
- Sequential Coupling
- Shotgun Surgery
- Feature Envy
- Divergent Change
- Data Clumps
- Primitive Obsession
- Temporal Coupling
- Singleton Abuse

### 4. Review Language-Specific Bad Practices

Every language has its traps. If I know it, I look for them. If I don't, I say so. Pretending makes the review worse, not better.

In JavaScript, forgetting `await` is a quiet one:

```js
// silently returns a Promise, not a user
async function getUser(id) {
  const user = fetchUser(id);
  return user.name;
}

// correct
async function getUser(id) {
  const user = await fetchUser(id);
  return user.name;
}
```

No error, no warning. It just fails at runtime.

### 5. Check Test Coverage

New code should be tested. Not just that tests exist, but that they cover what changed.

A PR that adds an endpoint without testing the error path is half-done. I look for:

- The happy path
- Edge cases: empty input, null, boundary values
- Error paths

Tools like [nyc](https://github.com/istanbuljs/nyc) or [c8](https://github.com/bcoe/c8) can flag gaps before the review even starts.

### The Point

The lint and dependency checks take minutes. The rest takes judgment. If all you needed was a script, you wouldn't need a reviewer.
