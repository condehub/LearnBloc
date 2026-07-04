# Version Control Guidelines

This project strictly follows the **Conventional Commits** specification and the principle of **Atomic Commits**. All versioning must be done in **English**.

## 1. Conventional Commits

Every commit message should be structured as follows:
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Allowed Types (`<type>`)
- **feat**: A new feature for the user or app.
- **fix**: A bug fix.
- **docs**: Changes to the documentation only (e.g., README, specifications).
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **perf**: A code change that improves performance.
- **test**: Adding missing tests or correcting existing tests.
- **build**: Changes that affect the build system or external dependencies (example scopes: npm, expo, docker).
- **ci**: Changes to CI configuration files and scripts (example scopes: github actions, gitlab).
- **chore**: Other changes that don't modify src or test files.
- **revert**: Reverts a previous commit.

### Description (`<description>`)
- Use the imperative, present tense: "change" not "changed" nor "changes".
- Don't capitalize the first letter.
- No dot (.) at the end.

## 2. Atomic Commits

Commits must be **atomic**. This means:
- **One concern per commit**: A commit should do exactly one thing (e.g., fix a bug, add a specific feature, format a file). Do not mix a bug fix and a new feature in the same commit.
- **Runnable and Stable**: Every commit must leave the codebase in a working state. It shouldn't break the build or tests.
- **Small and Focused**: If a feature is large, break it down into smaller, logical commits (e.g., one for the database schema, one for the API route, one for the frontend component).

## 3. Examples of Good Commits

✅ `feat(auth): implement JWT refresh token flow`
✅ `fix(mobile): resolve crash on lesson detail screen`
✅ `refactor(db): extract gamification logic to dedicated service`
✅ `docs: update setup instructions in README`
✅ `chore: update styled-components to latest version`

## 4. Examples of Bad Commits

❌ `fixed bug and added new feature` (Not atomic, no type)
❌ `Update files` (Too vague, no type)
❌ `feat: Added login screen.` (Capitalized, period at the end, past tense)

## 5. Local-Only Files (Specs)
Project specifications (*-spec.md), the compendium/ folder, and implementation walkthroughs (walkthrough.md) are kept strictly **local**. They are intentionally excluded via .gitignore so they never reach the remote repository. This prevents sensitive planning details from being exposed publicly.
