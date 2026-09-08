import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {
  sharedColorMode,
  sharedDocsSidebar,
  sharedNavbarLogo,
  sharedFooterStyle,
  sharedFooterCopyright,
  sharedCommunityFooterLinks,
  sharedCommunityDropdown,
  sharedGithubNavbarItem,
  sharedBlogNavbarItem,
  sharedContributeNavbarItem,
  sharedReleasesNavbarItem,
  sharedPrism,
  sharedImage,
} from './src/theme-shared/themeConfig';

const config: Config = {
  title: 'WSO2 Integration Platform Documentation',
  tagline: 'Build, deploy, and manage integrations at cloud speed',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://wso2.com',
  baseUrl: process.env.BASE_URL || '/',

  organizationName: 'wso2',
  projectName: 'docs-integrator',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    './src/plugins/connector-versions',
    './plugins/docusaurus-plugin-markdown-export',
    './src/plugins/expose-sidebars',
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        // Was `true`: the plugin's own behavior is to mark *every*
        // occurrence of the searched term across the whole target
        // page's <article> and leave it lit for as long as you stay on
        // that page -- reads as the term being highlighted everywhere
        // rather than helping you find the one relevant spot. Disabled
        // in favor of the existing search-result context snippets,
        // which already show where the match is.
        highlightSearchTermsOnTargetPage: false,
        explicitSearchResultPath: true,
        docsRouteBasePath: '/',
        indexBlog: false,
        indexPages: true,
        searchBarShortcutHint: false,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/wso2/docs-integrator/tree/saas/en/',
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: sharedImage,
    colorMode: sharedColorMode,
    docs: sharedDocsSidebar,
    navbar: {
      logo: sharedNavbarLogo,
      items: [
        {
          // Real <a> tag (via pathname:// + autoAddBaseUrl:false), not a
          // client-side route -- /integration-platform/docs/connectors/
          // is a completely separate build/bundle. See
          // SidebarProductHeader's docstring for the isInternalUrl pitfall
          // this sidesteps. Goes straight to the catalog, not just the
          // connectors site's homepage.
          href: 'pathname:///integration-platform/docs/connectors/catalog',
          autoAddBaseUrl: false,
          html: 'Connectors',
          position: 'left',
        },
        sharedReleasesNavbarItem('/reference/appendix/release-notes'),
        sharedContributeNavbarItem('saas'),
        sharedCommunityDropdown,
        sharedBlogNavbarItem,
        sharedGithubNavbarItem,
      ]
    },
    footer: {
      style: sharedFooterStyle,
      links: [
        {
          title: 'Get started',
          items: [
            { label: 'Overview', to: '/platform-overview' },
            { label: 'Install', to: '/get-started/setup/local-setup' },
            { label: 'Quick starts', to: '/develop/how-to/build-automation' },
          ],
        },
        {
          title: 'Develop',
          items: [
            { label: 'Integration artifacts', to: '/develop/integration-artifacts' },
            { label: 'Transform', to: '/develop/integration-artifacts/supporting/data-mapper/' },
            { label: 'Test', to: '/test/built-in-try-it-tool' },
            { label: 'AI Integrations', to: '/develop/ai/overview' },
          ],
        },
        {
          title: 'Deploy',
          items: [
            { label: 'CI/CD', to: '/deploy/cicd/github-actions' },
            { label: 'Observe', to: '/operate/observability-overview' },
            { label: 'Secure', to: '/deploy/secure/authentication' },
          ],
        },
        sharedCommunityFooterLinks,
      ],
      copyright: sharedFooterCopyright,
    },
    prism: sharedPrism,
  } satisfies Preset.ThemeConfig,
};

export default config;
