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
  CROSS_PRODUCT_BASE,
} from './src/theme-shared/themeConfig';

const config: Config = {
  title: 'WSO2 Integrator Documentation',
  tagline: 'Build integrations with low-code simplicity and pro-code power',
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
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/wso2/docs-integrator/tree/wso2-integrator/en/',
          showLastUpdateTime: true,
          // Lets docs link to a sibling product with `product://<product>/<path>`
          // instead of a hardcoded production path -- see the plugin's docstring.
          remarkPlugins: [[require('./src/plugins/crossProductLinks'), { base: CROSS_PRODUCT_BASE }]],
          // Serve Next (docs/, the new IA) at the site root by default —
          // matching reactnative.dev's model of latest/current up front,
          // older releases behind the version switcher. Without this,
          // Docusaurus defaults to serving the last *released* version
          // (5.0.0, the frozen pre-migration snapshot) at the root and
          // hiding Next behind /next/.
          lastVersion: 'current',
          versions: {
            // No `path` here: leaving it unset is what makes `lastVersion`
            // actually serve at the site root with no prefix. Setting an
            // explicit path (e.g. 'next') overrides that and pushes this
            // version's content to /next/ instead, leaving the root empty
            // — verified by build inspection after getting this wrong once.
            current: {
              label: 'Next',
              // `lastVersion: 'current'` above means Next also serves at
              // the site root, so Docusaurus's own default-banner logic
              // (only shown when the viewed version differs from
              // lastVersion) would otherwise stay silent here. Explicit
              // `banner: 'unreleased'` restores the preview warning
              // (restyled in theme/DocVersionBanner) even though Next is
              // still what most visitors land on by default.
              banner: 'unreleased',
            },
          },
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
    // "On this page" shows H2/H3 only (the "Nesting depth" design
    // reference's own rule) -- a doc with real content below H3 uses a
    // bold lead-in or a list instead, per that same reference ("H5/H6
    // are not used"); H4 still renders in the article body, it just
    // doesn't get its own TOC entry.
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    navbar: {
      logo: sharedNavbarLogo,
      // Single-header design: four text links, then (right zone) search,
      // color-mode toggle, GitHub and Download. Connectors, Explore and
      // Releases moved out of the navbar -- Connectors stays one click away
      // in the product switcher, Explore's sections are the landing page's
      // "Explore the platform" grid and the docs sidebar, Releases in the
      // Reference sidebar -- and the Discord/Stack Overflow/LinkedIn/
      // YouTube/X icons live in the footer and the Community page instead.
      items: [
        sharedBlogNavbarItem,
        sharedCommunityNavbarItem,
        sharedContributeNavbarItem(),
        // Plain-text FAQ (the shared sharedFaqNavbarItem adds a "?" icon the
        // new header doesn't have).
        { label: 'FAQ', to: '/reference/faq', position: 'left' },
        sharedGithubNavbarItem,
        // Last on purpose: the right zone renders search, toggle, divider,
        // then these in array order (see theme/Navbar/Content), so the
        // Download button ends the row. `html` (not `label`) so Docusaurus
        // doesn't append its external-link arrow; styled by
        // .navbar-download-btn in custom.css.
        {
          html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Download',
          href: 'https://wso2.com/products/downloads/?product=wso2integrator',
          position: 'right',
          className: 'navbar-download-btn',
          'aria-label': 'Download WSO2 Integrator',
        },
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
            { label: 'Setup', to: '/get-started/setup' },
            { label: 'Quickstarts', to: '/get-started/quickstarts/build-automation' },
          ],
        },
        {
          title: 'Editor Tour',
          items: [
            { label: 'Flow Canvas', to: '/editor/canvases/flow-canvas' },
            { label: 'Copilot', to: '/editor/copilot' },
            { label: 'Project View', to: '/editor/views/project-view' },
          ],
        },
        {
          // One column for the whole develop -> deploy -> manage ->
          // observe journey (each linking to that section's own landing
          // page), same as saas. The Integration Control Plane is this
          // product's self-hosted manage/observe surface, so it sits here too.
          title: 'Integration Lifecycle',
          items: [
            { label: 'Develop and Test', to: '/develop-and-test' },
            { label: 'Deploy and Run', to: '/deploy-and-run' },
            { label: 'Manage', to: '/manage' },
            { label: 'Observe', to: '/observe' },
            { label: 'Integration Control Plane', to: '/icp' },
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
