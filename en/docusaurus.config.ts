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
  title: 'WSO2 Integrator Documentation',
  tagline: 'Build integrations with low-code simplicity and pro-code power',
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
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/wso2/docs-integrator/tree/wso2-integrator/en/',
          showLastUpdateTime: true,
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
    navbar: {
      logo: sharedNavbarLogo,
      items: [
        {
          // Real <a> tag (via pathname:// + autoAddBaseUrl:false), not a
          // client-side route -- /integration-platform/docs/connectors/
          // is a completely separate build/bundle. See
          // SidebarProductHeader's docstring for the isInternalUrl pitfall
          // this sidesteps. `html` (not `label`) so Docusaurus doesn't
          // auto-append its external-link arrow icon. Goes straight to
          // the catalog, not just the connectors site's homepage.
          href: 'pathname:///integration-platform/docs/connectors/catalog',
          autoAddBaseUrl: false,
          html: 'Connectors',
          position: 'left',
        },
        sharedReleasesNavbarItem('/reference/appendix/release-notes'),
        sharedContributeNavbarItem('wso2-integrator'),
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
            { label: 'Docker and Kubernetes', to: '/deploy/containerized-deployment' },
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
