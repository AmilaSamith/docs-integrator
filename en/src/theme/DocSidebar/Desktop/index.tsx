/**
 * Swizzled from @docusaurus/theme-classic -- two additions on top of the
 * original:
 *
 * 1. `<ProductDocsLinks />` between `<Content>` and the collapse button
 *    (unchanged from before, text-style external links to WSO2 MI/SI docs).
 *
 * 2. A collapse button overlaid on the first sidebar row (no separate
 *    title row above Content -- see `.sidebarContentWrap` in
 *    styles.module.css) + a real icon rail for the collapsed state,
 *    instead of stock Docusaurus's fully-hidden sidebar with a tiny
 *    30px re-expand sliver. This reuses Docusaurus's own `isHidden`/
 *    `onCollapse` props and the same collapse animation (see custom.css's
 *    `--doc-sidebar-hidden-width: 64px` override) -- only what gets
 *    rendered at each state differs, not how the collapse itself works.
 *    Clicking a category icon opens that section's first page (its
 *    overview, when it has one) and re-expands the sidebar on it.
 *
 * 3. `<SidebarSearch />` above the nav tree, and a search icon on the
 *    collapsed rail, first in the icon list below the divider. Both open
 *    the search dialog owned by theme/SearchBar (see its docstring).
 *
 * Original: node_modules/@docusaurus/theme-classic/lib/theme/DocSidebar/Desktop/index.js
 * Keep this file in sync if you bump the @docusaurus/theme-classic major version.
 */
import React, { useEffect, useRef, type ReactNode } from 'react';
import clsx from 'clsx';
import { useThemeConfig } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Logo from '@theme/Logo';
import Content from '@theme/DocSidebar/Desktop/Content';
import type { Props } from '@theme/DocSidebar';
import { useHistory } from '@docusaurus/router';
import isInternalUrl from '@docusaurus/isInternalUrl';

import ProductDocsLinks from '@site/src/components/ProductDocsLinks';
import { openDocsSearch } from '@site/src/theme/SearchBar';
import SidebarSearch from './SidebarSearch';
import { railIconFor } from './icons';

import styles from './styles.module.css';

/** Matches the top margin of the sidebar's divided top-level rows (custom.css). */
const PINNED_GAP = 8;

/** Space kept below the active sidebar link when deciding whether it stays visible. */
const ACTIVE_MARGIN = 24;

/** Unchanged frames that count as "the sidebar has stopped animating". */
const STABLE_FRAMES = 4;

/** Longest extra wait for the sidebar to stop animating before scrolling anyway. */
const MAX_SETTLE_MS = 1500;

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

/** Same glyph as the sidebar search box's icon, at the rail icons' size
 * and stroke (17px, 1.8 -- see iconProps in icons.tsx). */
function RailSearchIcon(): ReactNode {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

/** The first page on this site that a sidebar item leads to, in sidebar
 * order: a category's own index page if it has one, otherwise the first
 * internal page inside it. External links are skipped, so a section whose
 * first entry links off-site still opens its first real page. */
function firstInternalPage(item: Props['sidebar'][number]): string | undefined {
  if (item.type === 'link') return isInternalUrl(item.href) ? item.href : undefined;
  if (item.type !== 'category') return undefined;
  if (item.href && isInternalUrl(item.href)) return item.href;
  for (const child of item.items) {
    const href = firstInternalPage(child);
    if (href) return href;
  }
  return undefined;
}

/** Collapsed state: a 64px icon-only rail -- an expand button, a divider,
 * a search button, then one icon per top-level sidebar category. A
 * category icon opens that section's first page (firstInternalPage: the
 * category's own index page if it has one) and re-expands the sidebar; an
 * item with no internal page to open only re-expands it. The
 * search button opens the search dialog without expanding the sidebar. */
function IconRail({ sidebar, onExpand }: { sidebar: Props['sidebar']; onExpand: () => void }): ReactNode {
  const history = useHistory();
  const openSection = (item: Props['sidebar'][number]) => {
    const href = firstInternalPage(item);
    onExpand();
    if (href) history.push(href);
  };

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
      <button
        type="button"
        onClick={openDocsSearch}
        title="Search docs"
        aria-label="Search docs"
        aria-haspopup="dialog"
        className={styles.railButton}>
        <RailSearchIcon />
      </button>
      {sidebar
        .filter((item) => item.type !== 'html')
        .map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openSection(item)}
            title={item.label}
            aria-label={item.label}
            className={styles.railButton}>
            {railIconFor(item.label)}
          </button>
        ))}
    </nav>
  );
}

/** Keeps the "Platform Overview" row pinned to the top of the sidebar and
 * scrolls the active top-level section up to just beneath it so its whole
 * subtree is visible -- only when the section changes (or on first load),
 * so browsing within a section never moves the scroll position. */
function usePinnedOverviewAndScroll(path: string, disabled: boolean) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lastSection = useRef<string | null>(null);

  useEffect(() => {
    if (disabled) return undefined;
    const menu = wrapRef.current?.querySelector<HTMLElement>('nav.menu');
    if (!menu) return undefined;

    const first = menu.querySelector<HTMLElement>('ul.theme-doc-sidebar-menu > li');
    const pinned = first?.textContent?.trim() === 'Platform Overview' ? first : null;
    if (pinned) pinned.dataset.pinned = 'true';

    const section = menu.querySelector<HTMLElement>(
      'li.theme-doc-sidebar-item-category-level-1:has(.menu__link--active)',
    );
    const key = section?.querySelector('.menu__link')?.textContent ?? null;
    if (!section || key === lastSection.current) return undefined;
    lastSection.current = key;
    const scrollToSection = () => {
      // The pinned row sticks below .menu's own top padding, so that padding counts too.
      const inset = pinned ? parseFloat(getComputedStyle(menu).paddingTop) + pinned.offsetHeight + PINNED_GAP : 0;
      const menuRect = menu.getBoundingClientRect();
      let delta = section.getBoundingClientRect().top - (menuRect.top + inset);
      // A long section (e.g. the connector catalog) can put the active page
      // far below its heading; never scroll it out of view -- land it in
      // the sidebar's upper third instead (the "Nesting depth" design
      // reference's own "auto-scroll" rule: the current page sits in its
      // upper third, not centered or pushed to the very top). */
      const activeLinks = section.querySelectorAll<HTMLElement>('a.menu__link--active');
      const active = activeLinks[activeLinks.length - 1];
      if (active) {
        const r = active.getBoundingClientRect();
        if (r.bottom - delta > menuRect.bottom - ACTIVE_MARGIN) {
          delta = r.top - (menuRect.top + menu.clientHeight / 3);
        }
      }
      menu.scrollTo({ top: menu.scrollTop + delta, behavior: 'smooth' });
    };

    // Wait out the categories' expand/collapse animations so the section's
    // position and the scroll range are final. A tall section that was
    // open above this one (e.g. Develop and Test, before Deploy and Run)
    // can still be collapsing after a fixed delay, which used to leave the
    // section's top under the pinned row's strip once it finished. So after
    // the initial delay, also wait until the section stops moving (a few
    // unchanged frames), up to a cap.
    let frame = 0;
    const timer = window.setTimeout(() => {
      const started = performance.now();
      let last = '';
      let stableFrames = 0;
      const waitForStableLayout = () => {
        const r = section.getBoundingClientRect();
        const current = `${r.top}|${r.height}`;
        stableFrames = current === last ? stableFrames + 1 : 0;
        last = current;
        if (stableFrames < STABLE_FRAMES && performance.now() - started < MAX_SETTLE_MS) {
          frame = window.requestAnimationFrame(waitForStableLayout);
          return;
        }
        scrollToSection();
      };
      frame = window.requestAnimationFrame(waitForStableLayout);
    }, 350);
    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
    };
  }, [path, disabled]);

  return wrapRef;
}

function DocSidebarDesktop({ path, sidebar, onCollapse, isHidden }: Props): ReactNode {
  const {
    navbar: { hideOnScroll },
    docs: {
      sidebar: { hideable },
    },
  } = useThemeConfig();
  // On by default; a product with no top-level sections to scroll between
  // (e.g. the connectors site) turns it off with
  // `customFields: { sidebarScrollToSection: false }` in its docusaurus.config.ts.
  const { siteConfig } = useDocusaurusContext();
  const scrollEnabled = siteConfig.customFields?.sidebarScrollToSection !== false;
  const wrapRef = usePinnedOverviewAndScroll(path, isHidden || !scrollEnabled);

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
      {/* A sibling of .sidebarContentWrap, not a child -- .sidebarCollapseOverlay
          inside that wrap is absolutely positioned against ITS own top edge,
          hand-tuned to land on Content's first row ("Platform Overview").
          Nesting the search row inside the wrap too would push that row
          down without the overlay's math knowing, landing the button on
          top of the search box instead. */}
      <SidebarSearch />
      <div ref={wrapRef} className={styles.sidebarContentWrap}>
        {hideable && (
          <button
            type="button"
            onClick={onCollapse}
            title="Collapse navigation"
            aria-label="Collapse navigation"
            className={styles.sidebarCollapseOverlay}>
            <CollapseIcon />
          </button>
        )}
        <Content path={path} sidebar={sidebar} />
      </div>
      <ProductDocsLinks />
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
