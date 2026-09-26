# Docs style guide

House rules for every page under `content/docs/`. They follow the Google
developer documentation style guide and the Diátaxis model, trimmed to what
this site needs. Agents writing docs: read this before `content/`.

## Structure (Diátaxis)

Every page is one of four kinds. Say which in the first sentence and do not mix.

| Kind | Answers | Sidebar group | Example |
|---|---|---|---|
| Tutorial | "Show me" | Get started / Deploy | First deployment with the CLI |
| How-to guide | "How do I ..." | Deploy / Manage / Help | Manage projects |
| Reference | "What exactly is ..." | Reference | Command reference |
| Explanation | "Why / what is ..." | Get started / Deploy / Manage | What is Alternate Clouds? |

Sidebar rules (`content/docs/meta.json`):

- Keep separate icon headers for Alternate Futures (the company) and Alternate
  Clouds (the product). Company pages are Overview, Brand guide and Changelog.
- Inside Alternate Clouds, organize around the user journey: Get started, Deploy,
  Manage, Reference, Help.
- Get started stays short: What is Alternate Clouds?, Sign in, First deployment with the CLI,
  Dashboard tour. Authentication comes before deployment tutorials.
- Use short, specific labels. Keep CLI, SDK and API folders collapsed unless active.
- Keep Legacy docs in sidebar utility navigation.
- Keep existing page URLs stable, including pages reached through contextual links.
- Link billing concepts from Billing and credits. The company Overview links to
  the product introduction under Alternate Clouds.
- Generated reference pages retain their generator ownership and existing routes.

## Screenshots and videos in procedures

- Use a descriptive numbered heading for each tutorial step so it has a stable
  anchor and appears in the table of contents.
- Put instructions first, then the screenshot or video that demonstrates that
  step, then the expected result. Keep text instructions complete on their own.
- Use responsive images with useful alt text and a short caption when needed.
- Use native video controls, no autoplay, and `preload="none"`. Provide captions
  for speech and a text transcript. Set explicit width and height on media to
  prevent layout shifts; use a poster for video when available.
- Keep media in the reading column. Do not add empty media placeholders or a
  second media sidebar. Code examples must remain selectable text.

## Titles and headings

- Sentence case everywhere: "Install the CLI", not "Installing The CLI".
- Task pages start with a bare verb: "Deploy the registry". Concept pages are
  noun phrases: "Registry architecture". Reference pages name the thing:
  "Command reference".
- One H1 (the frontmatter title). Do not skip levels. No code or links in
  headings.
- `description:` is one sentence a search result or an agent can act on. It
  appears in `/llms.txt`, so make it specific: what the page lets you do.

## Voice

- Second person, present tense, active voice. "Run `acc login`. The CLI opens
  your browser."
- Say "select" for menus and checkboxes, "click" for buttons and links. Bold
  UI labels: select **Deploy**.
- Plain words first, jargon second and defined: "a trusted execution
  environment (TEE)". Assume a curious non-developer can follow the Get started
  pages; assume a developer for Reference.
- No em-dashes in copy. Use a period, a comma, or a colon.
- Link text is the destination's title or a short noun phrase. Never "here".

## Procedures

1. Open with what the reader will have at the end and what they need first.
2. One action per numbered step. Put the command in a fenced block right
   under the step.
3. Show how to verify the result (`acc services list` shows the URL).
4. End with "Next steps": two to four links, current pages only.

## Facts

- Only document what the released `acc` does. The command reference is
  generated from source; if a flag is not there, do not describe it.
- Prices, limits, and regions come from the platform, not from memory. When in
  doubt, link to the billing page instead of repeating a number.
- Mark anything gated or unreleased with a callout, never in running prose.

## Writing for agents

- Every fact an agent needs to act (URLs, install command, env vars, `-y`,
  `--json`) lives in `lib/agent-context.ts`. Update it there; it flows into
  `/llms.txt`, `/llms-full.txt`, the Copy for AI button, and `/ai-agents`.
- Code blocks must be copy-pasteable as written. No `<placeholders>` without a
  comment saying where the value comes from.
- Keep `title` and `description` honest: agents pick pages from `/llms.txt` by
  those two fields alone.
