import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {
  sharedColorMode,
  sharedDocsSidebar,
  sharedNavbarLogo,
  sharedFooterStyle,
  sharedFooterCopyright,
  sharedCommunityNavbarItem,
  sharedDiscordNavbarItem,
  sharedLinkedInNavbarItem,
  sharedYoutubeNavbarItem,
  sharedXNavbarItem,
  sharedGithubNavbarItem,
  sharedBlogNavbarItem,
  sharedFaqNavbarItem,
  sharedContributeNavbarItem,
  sharedPrism,
  sharedImage,
  CROSS_PRODUCT_BASE,
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

  // Exposes CROSS_PRODUCT_BASE to client-side code (SidebarProductHeader) --
  // config-time TS modules like themeConfig.ts aren't importable from
  // browser-bundled components, so Docusaurus's customFields is the
  // sanctioned bridge. See themeConfig.ts's CROSS_PRODUCT_BASE docstring.
  customFields: {
    crossProductBase: CROSS_PRODUCT_BASE,
  },

  organizationName: 'wso2',
  projectName: 'docs-integrator',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'throw',

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
    './src/plugins/guidesCatalogPlugin',
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
          href: `pathname://${CROSS_PRODUCT_BASE}connectors/catalog`,
          autoAddBaseUrl: false,
          // Docusaurus's Link auto-opens a new tab for anything it treats
          // as external, which the pathname:// prefix above does -- fine
          // for a genuinely external site (GitHub, the blog), wrong for a
          // sibling product that should feel like same-site navigation.
          target: '_self',
          html: 'Connectors',
          position: 'left',
        },
        // Same 8 sections as the homepage's "Explore the platform" grid --
        // one source of truth would need lifting that data out of
        // src/pages/index.tsx into a shared module; kept in sync by hand
        // for now, matching how SidebarProductHeader's own product list
        // note already handles the analogous config-vs-component split.
        {
          type: 'custom-exploreDropdown',
          label: 'Explore',
          position: 'left',
          items: [
            { title: 'Platform Overview', description: "Understand the platform's architecture and core concepts.", href: '/platform-overview' },
            { title: 'Editor Tour', description: 'Tour the WSO2 Integrator editor and its Copilot.', href: '/editor' },
            { title: 'Develop and Test', description: 'Build services, transform data, and test integrations.', href: '/develop-and-test' },
            { title: 'Deploy and Run', description: 'Deploy to WSO2 Cloud, CI/CD, and production security.', href: '/deploy-and-run' },
            { title: 'Manage', description: 'Centralized control via the WSO2 Cloud console.', href: '/manage' },
            { title: 'Observe', description: 'Monitor logs, metrics, and alerts in WSO2 Cloud.', href: '/observe' },
            { title: 'Migrate', description: 'Move existing MuleSoft, TIBCO, and Azure Logic Apps integrations.', href: '/migrate' },
            { title: 'Guides', description: 'End-to-end tutorials and integration patterns.', href: '/guides/overview' },
          ],
        },
        sharedContributeNavbarItem(),
        sharedCommunityNavbarItem,
        sharedBlogNavbarItem,
        sharedFaqNavbarItem('/reference/faq'),
        sharedGithubNavbarItem,
        sharedDiscordNavbarItem,
        sharedLinkedInNavbarItem,
        sharedYoutubeNavbarItem,
        sharedXNavbarItem,
      ]
    },
    footer: {
      style: sharedFooterStyle,
      links: [
        {
          title: 'Get Started',
          items: [
            { label: 'Platform Overview', to: '/platform-overview' },
            { label: 'Concepts', to: '/get-started/concepts' },
            { label: 'Cloud Setup', to: '/get-started/cloud-setup' },
            { label: 'Quickstarts', to: '/get-started/quickstarts/build-automation' },
          ],
        },
        {
          title: 'Editor Tour',
          items: [
            { label: 'Flow Canvas', to: '/editor/canvases/flow-canvas' },
            { label: 'Copilot', to: '/editor/copilot/getting-started' },
            { label: 'Project View', to: '/editor/views/project-view' },
          ],
        },
        {
          // One column for the whole develop -> deploy -> manage ->
          // observe journey (each linking to that section's own
          // landing page) instead of a separate column per stage --
          // four nearly-empty columns read as more cluttered than one
          // well-organized one. Matches Resources' landing-page-only
          // pattern below.
          title: 'Integration Lifecycle',
          items: [
            { label: 'Develop and Test', to: '/develop-and-test' },
            { label: 'Deploy and Run', to: '/deploy-and-run' },
            { label: 'Manage', to: '/manage' },
            { label: 'Observe', to: '/observe' },
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'Migrate', to: '/migrate' },
            { label: 'Guides', to: '/guides/overview' },
            { label: 'FAQ', to: '/reference/faq' },
          ],
        },
      ],
      copyright: sharedFooterCopyright,
    },
    prism: sharedPrism,
  } satisfies Preset.ThemeConfig,
};

export default config;
