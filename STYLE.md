# Docs style guide

House rules for every page under `content/docs/`. They follow the Google
developer documentation style guide and the Diátaxis model, trimmed to what
this site needs. Agents writing docs: read this before `content/`.

## Structure (Diátaxis)

Every page is one of four kinds. Say which in the first sentence and do not mix.

| Kind | Answers | Sidebar group | Example |
|---|---|---|---|
| Tutorial | "Show me" | Start here | Quick start |
| How-to guide | "How do I ..." | Guides | Custom domains |
| Reference | "What exactly is ..." | Reference | Command reference |
| Explanation | "Why / what is ..." | Start here | What is Alternate Clouds? |

Sidebar rules (`content/docs/meta.json`):

- Two top-level blocks, each with an icon header: the company (Alternate
  Futures: overview, brand, changelog) and the product (Alternate Clouds).
- Inside the product: Start here, Guides, Reference, Archive.
  Add a group only when it will hold three or more pages.
- Never nest deeper than one folder. Folders are for a tool with several pages
  (CLI, SDK) or an archive, not for topics.
- Retired content goes under Archive with a warning callout, never deleted
  while people still land on it.

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
  environment (TEE)". Assume a curious non-developer can follow the Start here
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
