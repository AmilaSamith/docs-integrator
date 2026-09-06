import { themes as prismThemes } from 'prism-react-renderer';

/**
 * The shared visual identity contract across every docs-integrator site
 * branch (main, wso2-integrator, wso2-connectors, and future sites).
 *
 * This file is kept in sync across branches by
 * .github/workflows/sync-theme.yaml, sourced from wso2-integrator as the
 * canonical branch. Per the branch rule (Docs Repo & Branch Strategy §5):
 * this is evergreen, decoupled-from-content configuration, so it is
 * synced like the connectors catalog rather than authored per-branch.
 *
 * What's deliberately NOT here: title, tagline, docs.path, editUrl,
 * navbar.items, and footer.links beyond the shared community group —
 * those are genuinely per-branch and stay local to each
 * docusaurus.config.ts.
 */

export const sharedColorMode = {
  defaultMode: 'light' as const,
  respectPrefersColorScheme: true,
};

export const sharedDocsSidebar = {
  sidebar: {
    // Collapse sibling categories whenever a category expands. With
    // `useAutoExpandActiveCategory`, this means navigating to a page
    // collapses every other top-level category and only leaves the
    // current path expanded.
    autoCollapseCategories: true,
  },
};

export const sharedNavbarLogo = {
  alt: 'WSO2 Integration Platform Logo',
  src: 'img/WSO2_Integration_Platform_Black.svg',
  srcDark: 'img/WSO2_Integration_Platform_White.svg',
  href: '/',
};

export const sharedFooterStyle = 'dark' as const;

export const sharedFooterCopyright = `Copyright © ${new Date().getFullYear()} WSO2 LLC. Built with Docusaurus.`;

/** The one footer link group common to every site — everything else is per-branch. */
export const sharedCommunityFooterLinks = {
  title: 'Community',
  items: [
    { label: 'WSO2 Integrator: MI', href: 'https://mi.docs.wso2.com' },
    { label: 'WSO2 Integrator: SI', href: 'https://si.docs.wso2.com/latest/' },
    { label: 'Ballerina Central', href: 'https://central.ballerina.io' },
    { label: 'Community Forums', href: 'https://discord.com/invite/wso2' },
    { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/wso2' },
    { label: 'GitHub', href: 'https://github.com/wso2' },
  ],
};

export const sharedPrism = {
  theme: prismThemes.github,
  darkTheme: prismThemes.dracula,
  additionalLanguages: ['java', 'bash', 'json', 'yaml', 'toml'],
};

export const sharedImage = 'img/logo.svg';

type ProductKey = 'cloud' | 'integrator' | 'connectors';

/**
 * The three site branches that make up the WSO2 Integration Platform docs,
 * keyed by product. Root-relative hrefs (not absolute wso2.com URLs) so
 * these resolve correctly both in production, where all three are merged
 * under one domain by the publish workflows' destination_dir, and in a
 * local preview that replicates the same path prefixes.
 */
const PRODUCTS: Record<ProductKey, { label: string; href: string }> = {
  cloud: { label: 'WSO2 Cloud', href: '/integration-platform/docs/' },
  integrator: { label: 'WSO2 Integrator', href: '/integration-platform/docs/integrator/' },
  connectors: { label: 'Connectors', href: '/integration-platform/docs/connectors/' },
};

/**
 * Builds the navbar dropdown that lets readers jump between the three
 * product sites. `current` is per-branch (each docusaurus.config.ts calls
 * this with its own product key), so the dropdown's label always names the
 * site you're already on, and its items list only the other two.
 *
 * Each item's target belongs to a completely separate Docusaurus build
 * (own JS bundle, own router), even though in production they're merged
 * under one domain via the publish workflows' destination_dir. A plain
 * root-relative href (e.g. `/integration-platform/docs/integrator/`) gets
 * treated as "internal" by Docusaurus's isInternalUrl check purely
 * because it has no protocol -- same-origin isn't actually checked -- so
 * clicking it does a client-side React Router navigation instead of a
 * real page load, which 404s because that route doesn't exist in the
 * current site's own bundle (confirmed: reproduced locally, only fixed by
 * a manual refresh forcing a real request).
 *
 * The fix is Docusaurus's own documented escape hatch: a `pathname://`
 * prefix makes isInternalUrl treat the link as external (real <a> tag, no
 * history.push()), and `autoAddBaseUrl: false` stops it from prepending
 * the *current* site's own baseUrl on top of the already-complete path
 * (which would double up or misfire depending on which site you're
 * navigating from -- verified against Docusaurus's addBaseUrl source).
 */
export function sharedProductDropdown(current: ProductKey) {
  return {
    type: 'dropdown' as const,
    label: PRODUCTS[current].label,
    position: 'left' as const,
    items: (Object.keys(PRODUCTS) as ProductKey[])
      .filter((key) => key !== current)
      .map((key) => ({
        label: PRODUCTS[key].label,
        href: `pathname://${PRODUCTS[key].href}`,
        autoAddBaseUrl: false,
      })),
  };
}
