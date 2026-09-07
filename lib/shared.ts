export const appName = 'Alternate Futures Docs';
export const siteDescription =
  'Documentation hub for Alternate Futures products. Alternate Clouds is the decentralized cloud platform: deploy containers, AI agents, GPU and confidential workloads from the web app, the acc CLI, or the SDK.';
// Canonical production origin. Runtime code prefers window.location.origin so
// previews and staging produce URLs that actually resolve; this is the
// fallback for server-rendered text (llms.txt) where no request origin exists.
export const siteUrl = 'https://docs.alternatefutures.ai';
// Docs pages live at the site root (/guides/..., /cli/..., /sdk/...) to keep
// the URLs identical to the previous VitePress site.
export const docsRoute = '/';
export const docsContentRoute = '/llms.mdx';

export const gitConfig = {
  user: 'alternatefutures',
  repo: 'web-docs.alternatefutures.ai',
  branch: 'main',
};

// Platform facts referenced from several places (agent context, pages).
export const platform = {
  appUrl: 'https://app.alternatefutures.ai',
  cliPackage: '@alternatefutures/acc',
  sdkPackage: '@alternatefutures/sdk',
  skillsRepo: 'https://github.com/alternatefutures/alternate-clouds-skills',
};
