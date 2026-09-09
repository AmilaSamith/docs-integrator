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

/** Absolute path the saas site is rooted at in real production/staging --
 * used for any link that must resolve to a SIBLING site's real URL
 * regardless of this build's own baseUrl (sharedNavbarLogo below,
 * SidebarProductHeader, and each docusaurus.config.ts's own
 * pathname:// cross-product links). Overridable via env var so a
 * one-off build hosted at a different absolute root (e.g. a GitHub
 * fork's own Pages URL) can point these at itself instead --
 * real production/staging never set this, so they're unaffected. */
export const CROSS_PRODUCT_BASE = process.env.CROSS_PRODUCT_BASE || '/integration-platform/docs/';

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
    // Off by default in Docusaurus -- turns on the collapse toggle at
    // all. theme/DocSidebar/Desktop replaces what it collapses TO (a
    // 64px icon rail) but this flag is what makes the toggle exist.
    hideable: true,
  },
};

/** The real WSO2 lockup files, used as-is (not recreated in CSS/HTML) --
 * `src` is the solid-black variant (light theme, dark ink on a light
 * navbar), `srcDark` is the white+orange variant (dark theme -- it's
 * white ink, so it only reads correctly on a dark navbar background).
 *
 * `href` is a plain absolute path to the saas site's root, not a
 * hardcoded `https://wso2.com/...` domain -- the logo is meant to be
 * the one consistent "home base" across every site branch (saas,
 * wso2-integrator, wso2-connectors), so clicking it from anywhere lands
 * on the saas homepage rather than each subsite's own root, but it
 * should resolve against whatever origin is CURRENTLY serving the
 * site (localhost while testing, the real domain in production), not
 * always jump out to the real production URL. Rendered via the
 * theme/Logo swizzle (a plain native <a>, not Docusaurus's <Link>) --
 * see that file's docstring for why stock Logo can't do this safely
 * (it always runs href through useBaseUrl, which would double-prepend
 * this site's own baseUrl onto an already-absolute path). */
export const sharedNavbarLogo = {
  alt: 'WSO2 Integration Platform',
  src: 'img/wso2-integration-platform-black.svg',
  srcDark: 'img/wso2-integration-platform-full-colour.svg',
  href: CROSS_PRODUCT_BASE,
};

export const sharedFooterStyle = 'dark' as const;

export const sharedFooterCopyright = `Copyright © ${new Date().getFullYear()} WSO2 LLC. Built with Docusaurus.`;

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

/** A plain link to the in-site Community page (src/pages/community.tsx)
 * instead of a dropdown -- that page is where the channel list (same
 * links as sharedCommunityFooterLinks) actually lives now, presented as
 * real cards rather than a flyout menu (ballerina.io/community was the
 * reference for that pattern). `position: 'left'` here (and on the
 * other nav items below) puts these in the CENTER-justified group in
 * theme/Navbar/Content's custom 3-region layout (logo pinned left,
 * these centered, GitHub/toggle/search pinned right) -- despite the
 * name, "left" just means "not explicitly right" to Docusaurus's own
 * left/right split, which our swizzle repurposes. */
export const sharedCommunityNavbarItem = {
  to: '/community',
  label: 'Community',
  position: 'left' as const,
};

export const sharedBlogNavbarItem = {
  href: 'https://wso2.com/api-platform/learn/',
  label: 'Blog',
  position: 'left' as const,
};

/** Links to the in-site Contribute page (src/pages/contribute.tsx),
 * which itself links out to the real GitHub CONTRIBUTING.md -- `branch`
 * still picks which branch's guide that in-page link points at, same
 * as before. */
export function sharedContributeNavbarItem() {
  return {
    to: '/contribute',
    label: 'Contribute',
    position: 'left' as const,
  };
}

/** `target` is an in-site doc path (rendered as `to`, real client-side route) or an external URL (rendered as `href`) -- wso2-connectors has no release-notes page of its own, so it points at GitHub's releases instead. */
export function sharedReleasesNavbarItem(target: string) {
  const isExternal = target.startsWith('http');
  return {
    [isExternal ? 'href' : 'to']: target,
    label: 'Releases',
    position: 'left' as const,
  };
}
