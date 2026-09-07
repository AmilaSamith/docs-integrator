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

// The product-switcher dropdown used to live here as a navbar item
// (sharedProductDropdown). It's now a persistent row under the navbar
// instead (see src/components/SidebarProductHeader, rendered globally via
// the src/theme/Navbar wrapper swizzle) to match the reference pattern
// from reactnative.dev/docs -- no navbar duplicate. That component keeps
// its own copy of the product list (label/href) since it's a client-side
// React component and this file is TS-only config-time code; keep the two
// in sync by hand if the product list ever changes.

/** Icon-only GitHub navbar link -- `html` (not `label`) so Docusaurus's
 * auto-appended external-link arrow (added whenever `label` is used with
 * a non-internal href) doesn't show; an icon needs no such affordance.
 * `className` gives it the same 2rem circular hit target as the
 * color-mode toggle (see custom.css's `.navbar-github-link`), so the two
 * read as one visual family of icon buttons at the navbar's right edge. */
export const sharedGithubNavbarItem = {
  html: '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>',
  href: 'https://github.com/wso2/docs-integrator',
  position: 'right' as const,
  className: 'navbar-github-link',
  'aria-label': 'GitHub',
};

/** Community dropdown reusing the exact same links as the shared footer group -- one source of truth for the URL list. */
export const sharedCommunityDropdown = {
  type: 'dropdown' as const,
  label: 'Community',
  position: 'right' as const,
  items: sharedCommunityFooterLinks.items,
};

export const sharedBlogNavbarItem = {
  href: 'https://wso2.com/blog/',
  label: 'Blog',
  position: 'right' as const,
};

/** `branch` picks the per-branch CONTRIBUTING.md, matching the existing editUrl pattern (each branch's docusaurus.config.ts already points editUrl at its own branch). */
export function sharedContributeNavbarItem(branch: string) {
  return {
    href: `https://github.com/wso2/docs-integrator/blob/${branch}/CONTRIBUTING.md`,
    label: 'Contribute',
    position: 'right' as const,
  };
}

/** `target` is an in-site doc path (rendered as `to`, real client-side route) or an external URL (rendered as `href`) -- wso2-connectors has no release-notes page of its own, so it points at GitHub's releases instead. */
export function sharedReleasesNavbarItem(target: string) {
  const isExternal = target.startsWith('http');
  return {
    [isExternal ? 'href' : 'to']: target,
    label: 'Releases',
    position: 'right' as const,
  };
}
