import { defineConfig } from 'vitepress'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  title: 'Alternate Futures Docs',
  description: 'Documentation for the Alternate Futures DePIN platform',
  base: '/',

  vite: {
    resolve: {
      alias: {
        'docs/.vitepress/theme/lib/utils': path.resolve(__dirname, './theme/lib/utils.ts'),
        'docs/.vitepress/theme/components': path.resolve(__dirname, './theme/components')
      }
    }
  },

  ignoreDeadLinks: [
    // Ignore TypeDoc-generated relative links in SDK API docs
    /^\.\/README$/,
    /^\.\/classes\//,
    /^\.\/interfaces\//,
    /^\.\/modules\//,
    /^\.\/enums\//,
    // Ignore dead links to pages not yet created
    '/guides/registry-api',
    './team',
    '/guides/monitoring'
  ],

  markdown: {
    theme: {
      light: 'solarized-light',
      dark: 'solarized-dark'
    },
    codeCopyButtonTitle: 'Copy code',
    languageAlias: {},
    lineNumbers: false,
    config: async (md) => {
      // Register custom security container
      const { default: MarkdownItContainer } = await import('markdown-it-container')

      md.use(MarkdownItContainer, 'security', {
        render: (tokens, idx) => {
          const token = tokens[idx]
          const info = token.info.trim().slice('security'.length).trim()
          if (token.nesting === 1) {
            const title = info || 'Security'
            return `<security title="${md.utils.escapeHtml(title)}">\n`
          } else {
            return '</security>\n'
          }
        }
      })
    }
  },

  themeConfig: {
    logo: {
      src: '/logo.svg',
      alt: 'Alternate Futures'
    },
    siteTitle: false, // Hide the text title since the logo contains the brand name

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/guides/' },
      { text: 'CLI', link: '/cli/' },
      { text: 'SDK', link: '/sdk/' }
      // { text: 'App', link: 'https://app.alternatefutures.ai' } // Temporarily hidden during development
    ],

    sidebar: {
      '/guides/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guides/' },
            { text: 'Quick Start', link: '/guides/quickstart' },
            { text: 'Authentication', link: '/guides/authentication' },
            { text: 'Glossary', link: '/guides/glossary' }
          ]
        },
        {
          text: 'Core Features',
          items: [
            { text: 'Projects', link: '/guides/projects' },
            { text: 'Deploying Sites', link: '/guides/sites' },
            { text: 'Cloud Functions', link: '/guides/functions' },
            { text: 'Managing Agents', link: '/guides/agents' },
            { text: 'Storage Management', link: '/guides/storage' },
            { text: 'Observability & APM', link: '/guides/observability' }
          ]
        },
        {
          text: 'Networking',
          items: [
            { text: 'Custom Domains', link: '/guides/custom-domains' },
            { text: 'Private Gateways', link: '/guides/gateways' },
            { text: 'IPNS Records', link: '/guides/ipns' },
            { text: 'ENS Integration', link: '/guides/ens' }
          ]
        },
        {
          text: 'Account & Access',
          items: [
            { text: 'Applications', link: '/guides/applications' },
            { text: 'API Keys', link: '/guides/api-keys' },
            { text: 'Billing', link: '/guides/billing' }
            // { text: 'Dashboard Overview', link: '/guides/dashboard' } // Hidden during app development
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'CI/CD Integration', link: '/guides/cicd' },
            { text: 'Best Practices', link: '/guides/best-practices' }
          ]
        },
        {
          text: 'Infrastructure',
          items: [
            { text: 'Decentralized Registry', link: '/guides/decentralized-registry' },
            { text: 'Registry Architecture', link: '/guides/registry-architecture' },
            { text: 'Deploy Your Registry', link: '/guides/registry-deployment' }
          ]
        }
      ],

      '/cli/': [
        {
          text: 'CLI Documentation',
          items: [
            { text: 'Overview', link: '/cli/' },
            { text: 'Installation', link: '/cli/installation' },
            { text: 'Commands', link: '/cli/commands' }
          ]
        }
      ],

      '/sdk/': [
        {
          text: 'SDK Documentation',
          items: [
            { text: 'Overview', link: '/sdk/' },
            { text: 'Installation', link: '/sdk/installation' },
            { text: 'Quick Start', link: '/sdk/quickstart' },
            { text: 'API Reference', link: '/sdk/api' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/alternatefutures' },
      { icon: 'twitter', link: 'https://twitter.com/alternatefutures' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Alternate Futures'
    },

    search: {
      provider: 'local'
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: 'https://use.typekit.net/qqp2xqh.css' }]
  ]
})
