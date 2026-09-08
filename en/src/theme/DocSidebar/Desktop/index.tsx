/**
 * Swizzled from @docusaurus/theme-classic -- two additions on top of the
 * original:
 *
 * 1. `<ProductDocsLinks />` between `<Content>` and the collapse button
 *    (unchanged from before, text-style external links to WSO2 MI/SI docs).
 *
 * 2. A "DOCUMENTATION" title row + a real icon rail for the collapsed
 *    state, instead of stock Docusaurus's fully-hidden sidebar with a tiny
 *    30px re-expand sliver. This reuses Docusaurus's own `isHidden`/
 *    `onCollapse` props and the same collapse animation (see custom.css's
 *    `--doc-sidebar-hidden-width: 64px` override) -- only what gets
 *    rendered at each state differs, not how the collapse itself works.
 *    Rail icons don't navigate (mirrors the reference design): clicking
 *    one just re-expands the sidebar, same as the header's own toggle.
 *
 * Original: node_modules/@docusaurus/theme-classic/lib/theme/DocSidebar/Desktop/index.js
 * Keep this file in sync if you bump the @docusaurus/theme-classic major version.
 */
import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { useThemeConfig } from '@docusaurus/theme-common';
import Logo from '@theme/Logo';
import Content from '@theme/DocSidebar/Desktop/Content';
import type { Props } from '@theme/DocSidebar';

import ProductDocsLinks from '@site/src/components/ProductDocsLinks';
import { railIconFor } from './icons';

import styles from './styles.module.css';

function CollapseIcon(): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5v14" />
      <path d="M20 12H9" />
      <path d="m13 8-4 4 4 4" />
    </svg>
  );
}

function ExpandIcon(): ReactNode {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

/** Collapsed state: a 64px icon-only rail -- an expand button, a divider,
 * then one icon per top-level sidebar category. Icons don't navigate;
 * clicking any of them just re-expands the sidebar (same as the reference). */
function IconRail({ sidebar, onExpand }: { sidebar: Props['sidebar']; onExpand: () => void }): ReactNode {
  return (
    <nav className={styles.rail}>
      <button
        type="button"
        onClick={onExpand}
        title="Expand navigation"
        aria-label="Expand navigation"
        className={styles.railButton}>
        <ExpandIcon />
      </button>
      <div className={styles.railDivider} />
      {sidebar
        .filter((item) => item.type !== 'html')
        .map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={onExpand}
            title={item.label}
            aria-label={item.label}
            className={styles.railButton}>
            {railIconFor(item.label)}
          </button>
        ))}
    </nav>
  );
}

function DocSidebarDesktop({ path, sidebar, onCollapse, isHidden }: Props): ReactNode {
  const {
    navbar: { hideOnScroll },
    docs: {
      sidebar: { hideable },
    },
  } = useThemeConfig();

  if (isHidden) {
    return <IconRail sidebar={sidebar} onExpand={onCollapse} />;
  }

  return (
    <div
      className={clsx(
        styles.sidebar,
        hideOnScroll && styles.sidebarWithHideableNavbar,
      )}>
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarHeaderTitle}>Documentation</span>
        {hideable && (
          <button
            type="button"
            onClick={onCollapse}
            title="Collapse navigation"
            aria-label="Collapse navigation"
            className={styles.sidebarHeaderCollapse}>
            <CollapseIcon />
          </button>
        )}
      </div>
      <Content path={path} sidebar={sidebar} />
      <ProductDocsLinks />
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
