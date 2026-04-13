###### 04-13-2026
# Shielding Repos on a Budget
Consultants wait. It's part of the job. Contracts dry up. The bench fills. For a stretch you're just a developer with time and no fire to put out. Automation makes it easier. Less to remember.

I had a situation come up last week. My employer didn't have the budget for a GitHub Enterprise account. No enterprise means no branch protection. No branch protection means anyone can merge directly to main. I had time, so I got creative.

The goal was straightforward. No one merges their own pull request. Every merge needs at least one review. GitHub won't enforce that without enterprise, but GitHub Actions will run on a pull request, and [Husky](https://typicode.github.io/husky/) will run before a push. That's enough to work with.

It's not airtight. Someone determined enough can get around it. But most problems aren't caused by determination. They're caused by habit and convenience. Raise the floor, and you handle most of it.

## The Plan

![a flowchart of the implemented safeguards](../shielding_github_repos_on_a_budget.png)

### Making it harder to commit to main
Git lets you attach scripts that run automatically before a commit is saved. These are called pre-commit hooks. If the script throws an error, Git cancels the commit completely and nothing gets recorded. [Husky](https://typicode.github.io/husky/) is a tool that manages these scripts in JavaScript projects, setting them up automatically when developers install dependencies.

```
#!/bin/sh
# .husky/pre-commit: block direct commits to main (or master)

BRANCH=$(git symbolic-ref HEAD 2>/dev/null | sed 's|refs/heads/||')
PROTECTED_BRANCHES="main master"

for protected in $PROTECTED_BRANCHES; do
  if [ "$BRANCH" = "$protected" ]; then
    echo ""
    echo "  🚫  Direct commits to '$BRANCH' are not allowed."
    echo "      Please create a feature branch and open a pull request."
    echo ""
    exit 1
  fi
done

exit 0
```

Once we successfully commit and push to the origin, every pull request triggers two automated checks. The first builds the project and runs the linter, catching any code that fails to compile or breaks formatting rules. The second runs the full test suite and measures code coverage. If coverage drops below 80%, the check fails. Both checks must pass before the pull request can be merged.

GitHub Actions is built into GitHub. When a pull request is opened or updated, it runs automatically. One of those checks reads the pull request description and looks for a valid Miro URL. No link, or an @todo placeholder still sitting there, and the action fails. The pull request doesn't go anywhere. Every pull request needs context. If the Miro link is missing, the intention behind the change is too.

GitHub Actions also manages a ready-to-merge label that controls whether a pull request can be merged. When a reviewer who is not the pull request author approves the changes, an action adds the label automatically. If the review is dismissed or new commits are pushed, the label is removed immediately and the process starts over. Humans cannot add the label themselves. If someone tries, an action detects it and removes it straight away. A final check reads whether the label is present before allowing the merge to go through.

```
name: Manage Ready-to-Merge Label

on:
  pull_request:
    types: [labeled, synchronize]
  pull_request_review:
    types: [submitted, dismissed]

jobs:
  enforce-bot-only-label:
    runs-on: ubuntu-latest
    if: |
      github.event.label.name == 'ready-to-merge' &&
      github.event.sender.login != 'github-actions[bot]'
    permissions:
      issues: write
      pull-requests: write
    steps:
      - name: Remove label if not added by github-actions[bot]
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          REPO: ${{ github.repository }}
        run: |
          curl -sf -X DELETE \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github+json" \
            "https://api.github.com/repos/$REPO/issues/$PR_NUMBER/labels/ready-to-merge"

  remove-label-on-review-dismissal:
    runs-on: ubuntu-latest
    if: |
      github.event_name == 'pull_request_review' &&
      github.event.review.state == 'dismissed'
    permissions:
      issues: write
      pull-requests: write
    steps:
      - name: Remove ready-to-merge label if no approvals remain
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          REPO: ${{ github.repository }}
        run: |
          approvals=$(curl -sf \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github+json" \
            "https://api.github.com/repos/$REPO/pulls/$PR_NUMBER/reviews" \
            | jq '[.[] | select(.state == "APPROVED")] | length')

          if [ "$approvals" -eq 0 ]; then
            curl -sf -X DELETE \
              -H "Authorization: token $GITHUB_TOKEN" \
              -H "Accept: application/vnd.github+json" \
              "https://api.github.com/repos/$REPO/issues/$PR_NUMBER/labels/ready-to-merge" || true
          fi

  remove-label-on-push:
    runs-on: ubuntu-latest
    if: |
      github.event_name == 'pull_request' &&
      github.event.action == 'synchronize'
    permissions:
      issues: write
      pull-requests: write
    steps:
      - name: Remove ready-to-merge label if present
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          REPO: ${{ github.repository }}
        run: |
          labels=$(curl -sf \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github+json" \
            "https://api.github.com/repos/$REPO/issues/$PR_NUMBER/labels" \
            | jq -r '.[].name')

          if echo "$labels" | grep -q "^ready-to-merge$"; then
            curl -sf -X DELETE \
              -H "Authorization: token $GITHUB_TOKEN" \
              -H "Accept: application/vnd.github+json" \
              "https://api.github.com/repos/$REPO/issues/$PR_NUMBER/labels/ready-to-merge" || true
          fi

  add-label-on-approval:
    runs-on: ubuntu-latest
    if: |
      github.event_name == 'pull_request_review' &&
      github.event.review.state == 'approved' &&
      github.event.review.user.login != github.event.pull_request.user.login
    permissions:
      issues: write
      pull-requests: write
    steps:
      - name: Add ready-to-merge label on approval by non-author
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          REPO: ${{ github.repository }}
        run: |
          echo "✅ PR approved by a non-author reviewer. Adding 'ready-to-merge' label..."

          curl -sf -X POST \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github+json" \
            "https://api.github.com/repos/$REPO/issues/$PR_NUMBER/labels" \
            -d '{"labels":["ready-to-merge"]}'

          echo "✅ Label added."
```

The Miro link check is simpler. It just reads the pull request description and looks for a valid URL.

```
on:
  pull_request:
    types: [opened, edited, reopened, synchronize]

jobs:
  check-miro-link:
    runs-on: ubuntu-latest
    steps:
      - name: Check for Miro link
        env:
          PR_BODY: ${{ github.event.pull_request.body }}
        run: |
          if echo "$PR_BODY" | grep -qi '@todo'; then
            echo "❌ PR description still contains '@todo' placeholder. Please replace it with a Miro link."
            exit 1
          fi

          if ! echo "$PR_BODY" | grep -qiE 'https?://(www\.)?miro\.com/\S+'; then
            echo "❌ PR description is missing a Miro link. Please add a link to the relevant Miro board."
            exit 1
          fi

          echo "✅ Miro link found in PR description."
```

The label has to be earned fresh every time.

I got pulled back in eventually. New contract, new team. But the repo stayed clean. That's the thing about time on the bench. If you use it right, you build something that keeps working after you stop thinking about it.
