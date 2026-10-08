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
  sharedStackOverflowNavbarItem,
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
  title: 'WSO2 Connectors',
  tagline: 'Pre-built connectors for the WSO2 Integration Platform',
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
    // No top-level sections to scroll between here (one long connector
    // catalog), so skip the sidebar's scroll-to-section behavior.
    sidebarScrollToSection: false,
  },

  organizationName: 'wso2',
  projectName: 'docs-integrator',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
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
        // See saas's docusaurus.config.ts for why this is off.
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
          path: 'docs/connectors',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/wso2/docs-integrator/tree/wso2-connectors/en/',
          showLastUpdateTime: true,
          // Lets docs link to a sibling product with `product://<product>/<path>`
          // instead of a hardcoded production path -- see the plugin's docstring.
          remarkPlugins: [[require('./src/plugins/crossProductLinks'), { base: CROSS_PRODUCT_BASE }]],
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
        // No self-link to Connectors here -- this is the connectors site.
        // Instead, the first item is a real <a> (via pathname:// +
        // autoAddBaseUrl:false, same reasoning as the other two branches'
        // Connectors item) back to the saas site, so this is never a
        // dead end -- matches saas/wso2-integrator's item count too,
        // keeping the centered nav group the same width across all three.
        {
          href: `pathname://${CROSS_PRODUCT_BASE}`,
          autoAddBaseUrl: false,
          // See saas's docusaurus.config.ts for why target:'_self' is here.
          target: '_self',
          html: 'SaaS',
          position: 'left',
        },
        // Real <a> tag (external, not a client-side route) to the
        // marketplace listing for this catalog on wso2.com -- not a
        // sharedReleasesNavbarItem call, since this item isn't release
        // notes here, and the label/target genuinely diverge from what
        // that shared helper assumes.
        {
          href: 'https://wso2.com/integration-platform/connectors/',
          label: 'Integration Store',
          position: 'left',
        },
        sharedContributeNavbarItem(),
        sharedCommunityNavbarItem,
        sharedBlogNavbarItem,
        sharedFaqNavbarItem('/reference/faq'),
        sharedGithubNavbarItem,
        sharedDiscordNavbarItem,
        sharedStackOverflowNavbarItem,
        sharedLinkedInNavbarItem,
        sharedYoutubeNavbarItem,
        sharedXNavbarItem,
      ]
    },
    footer: {
      style: sharedFooterStyle,
      links: [
        {
          title: 'Connectors',
          items: [
            { label: 'Overview', to: '/overview' },
            { label: 'Using Connectors', to: '/using-connectors' },
            { label: 'Catalog', to: '/catalog' },
          ],
        },
        {
          title: 'Build your own',
          items: [
            { label: 'Getting started', to: '/build-your-own/build-own' },
            { label: 'Build from OpenAPI spec', to: '/build-your-own/create-from-openapi-spec' },
            { label: 'Build from scratch', to: '/build-your-own/custom-development' },
            { label: 'Publish a connector', to: '/build-your-own/publish-connector' },
          ],
        },
        {
          title: 'Platform Components',
          items: [
            // Real <a> tags (pathname:// + autoAddBaseUrl:false), not
            // client-side routes -- each is a completely separate
            // build/bundle. See SidebarProductHeader's docstring for
            // the isInternalUrl pitfall this sidesteps. target:'_self'
            // overrides Link's default of opening anything it treats as
            // external (which pathname:// does) in a new tab -- a
            // sibling product should feel like same-site navigation.
            { label: 'SaaS', href: `pathname://${CROSS_PRODUCT_BASE}`, autoAddBaseUrl: false, target: '_self' },
            { label: 'WSO2 Integrator', href: `pathname://${CROSS_PRODUCT_BASE}integrator/`, autoAddBaseUrl: false, target: '_self' },
          ],
        },
      ],
      copyright: sharedFooterCopyright,
    },
    prism: sharedPrism,
  } satisfies Preset.ThemeConfig,
};

export default config;
