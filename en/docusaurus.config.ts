import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {
  sharedColorMode,
  sharedDocsSidebar,
  sharedNavbarLogo,
  sharedFooterStyle,
  sharedFooterCopyright,
  sharedCommunityNavbarItem,
  sharedGithubNavbarItem,
  sharedBlogNavbarItem,
  sharedContributeNavbarItem,
  sharedPrism,
  sharedImage,
  sharedAlgoliaSearch,
  sharedHeadTags,
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

  // Google Tag Manager + CookiePro -- see themeConfig.ts's sharedHeadTags
  // docstring for the full explanation (same snippet on every product
  // branch, and why there is deliberately no GTM <noscript> snippet).
  headTags: sharedHeadTags,

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

  // @easyops-cn/docusaurus-search-local used to live here -- replaced by
  // Algolia (themeConfig.algolia below), which is site-wide across every
  // product instead of scoped to just this build. See sharedAlgoliaSearch's
  // own docstring in themeConfig.ts for the full explanation.
  themes: ['@docusaurus/theme-mermaid'],

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
    algolia: sharedAlgoliaSearch,
    // "On this page" shows H2/H3 only -- same rule as wso2-integrator's
    // sidebar-depth redesign, see that branch's docusaurus.config.ts for
    // the full reasoning (part of the shared theme, just not synced via
    // this per-branch config file itself).
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    navbar: {
      logo: sharedNavbarLogo,
      // Single-header design (matches wso2-integrator/saas): four text
      // links, then (right zone) colour-mode toggle, GitHub and
      // Integration Store. The former SaaS self-link and the Discord/
      // Stack Overflow/LinkedIn/YouTube/X icons are gone from here --
      // Footer (en/src/theme/Footer, shared) already renders all of
      // those itself (SOCIAL_LINKS), and SaaS is one click away via the
      // product switcher (SidebarProductHeader) next to the logo.
      items: [
        sharedBlogNavbarItem,
        sharedCommunityNavbarItem,
        sharedContributeNavbarItem(),
        // Plain-text FAQ (the shared sharedFaqNavbarItem adds a "?" icon the
        // new header doesn't have) -- same as wso2-integrator.
        { label: 'FAQ', to: '/reference/faq', position: 'left' },
        sharedGithubNavbarItem,
        // Last on purpose: the right zone renders toggle, divider, then
        // these in array order (see theme/Navbar/Content), so this button
        // ends the row. `html` (not `label`) so Docusaurus doesn't append
        // its external-link arrow; styled by .navbar-download-btn in
        // custom.css (same class wso2-integrator's Download button uses --
        // same orange CTA treatment, different label/icon/href here).
        {
          html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Integration Store',
          href: 'https://wso2.com/integration-platform/connectors/',
          position: 'right',
          className: 'navbar-download-btn',
          'aria-label': 'Browse the Integration Store',
        },
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
