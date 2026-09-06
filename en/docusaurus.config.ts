import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {
  sharedColorMode,
  sharedDocsSidebar,
  sharedNavbarLogo,
  sharedFooterStyle,
  sharedFooterCopyright,
  sharedCommunityFooterLinks,
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
        highlightSearchTermsOnTargetPage: true,
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
          href: 'https://github.com/wso2/docs-integrator',
          label: 'GitHub',
          position: 'right',
        }
      ]
    },
    footer: {
      style: sharedFooterStyle,
      links: [
        {
          title: 'Get started',
          items: [
            { label: 'Overview', to: '/get-started/introduction' },
            { label: 'Install', to: '/get-started/setup/local-setup' },
            { label: 'Quick starts', to: '/get-started/build-automation' },
          ],
        },
        {
          title: 'Develop',
          items: [
            { label: 'Integration artifacts', to: '/develop/integration-artifacts' },
            { label: 'Transform', to: '/develop/integration-artifacts/supporting/data-mapper/' },
            { label: 'Test', to: '/develop/test/built-in-try-it-tool' },
            { label: 'Connectors', to: '/connectors/overview' },
            { label: 'AI Integrations', to: '/genai/overview' },
          ],
        },
        {
          title: 'Deploy',
          items: [
            { label: 'Docker and Kubernetes', to: '/deploy/self-hosted/containerized-deployment' },
            { label: 'CI/CD', to: '/deploy-operate/cicd/github-actions' },
            { label: 'Observe', to: '/deploy-operate/observe/observability-overview' },
            { label: 'Secure', to: '/deploy-operate/secure/authentication' },
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
