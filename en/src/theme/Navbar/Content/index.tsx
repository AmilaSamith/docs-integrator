/**
 * Ejected from @docusaurus/theme-classic for the single-header layout
 * (see the landing-page header mockup). Three zones, same NavbarItem
 * components and same splitNavbarItems() left/right split as stock:
 *
 *   logo zone   -- mobile toggle, logo, a "Docs" label (this is a docs
 *                  site, not the product's own marketing site), and the
 *                  product/version segment (desktop >= 1360px; below that
 *                  the segment moves to the secondary row, see
 *                  theme/Navbar/index.tsx)
 *   center zone -- the `position: 'left'` items in docusaurus.config.ts
 *                  (today: Learn Hub, Community, Contribute, FAQ)
 *   right zone  -- after the vertical rule: the search icon (theme/SearchBar,
 *                  which owns the search dialog and the Ctrl/Cmd+K
 *                  shortcut; the icon shows only on mobile, desktop
 *                  search is in the doc sidebar), the color-mode toggle,
 *                  then the
 *                  `position: 'right'` items in
 *                  config order (today: GitHub, Download). Keep new
 *                  right-side items appended to the config array to
 *                  preserve this order.
 *
 * Layout (styles.module.css): only the logo zone grows, so the links sit
 * right next to the right zone, which is set off by a vertical rule --
 * stock instead gives both outer zones flex: 1 to center the links.
 *
 * On mobile (<996px), Infima's stock responsive rules collapse every
 * `.navbar__items` except `--right` behind the hamburger sidebar, so the
 * links live in the drawer there.
 *
 * Original: node_modules/@docusaurus/theme-classic/lib/theme/Navbar/Content/index.js
 * Keep this file in sync if you bump the @docusaurus/theme-classic major version.
 */
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { useThemeConfig, ErrorCauseBoundary, ThemeClassNames } from '@docusaurus/theme-common';
import { splitNavbarItems, useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import NavbarItem, { type Props as NavbarItemConfig } from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
import SearchBar from '@theme/SearchBar';
import SidebarProductHeader from '@site/src/components/SidebarProductHeader';

import styles from './styles.module.css';

// TODO temporary casting until ThemeConfig type is improved, same as stock.
function useNavbarItems(): NavbarItemConfig[] {
  return (useThemeConfig() as { navbar: { items: NavbarItemConfig[] } }).navbar.items;
}

function NavbarItems({ items }: { items: NavbarItemConfig[] }): ReactNode {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              { cause: error },
            )
          }>
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

function NavbarContentLayout({
  logo,
  center,
  right,
}: {
  logo: ReactNode;
  center: ReactNode;
  right: ReactNode;
}): ReactNode {
  return (
    <div className="navbar__inner">
      <div className={clsx(ThemeClassNames.layout.navbar.containerLeft, 'navbar__items', styles.logoZone)}>{logo}</div>
      <div className="navbar__items navbar__items--center">{center}</div>
      <div className={clsx(ThemeClassNames.layout.navbar.containerRight, 'navbar__items navbar__items--right')}>
        {right}
      </div>
    </div>
  );
}

export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);
  return (
    <NavbarContentLayout
      logo={
        <>
          {/* Fixed-width (>= 1360px) so productSegment's separator below
              always lands at the doc sidebar's own right edge -- see
              styles.module.css's .logoBlock docstring. */}
          <div className={styles.logoBlock}>
            {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
            <NavbarLogo />
            <span className={styles.docsLabel}>Docs</span>
          </div>
          {/* Single-header layout: product + version segment sits right
              after the logo (>= 1360px only -- below that it lives in the
              secondary row, see theme/Navbar/index.tsx). */}
          <div className={styles.productSegment}>
            <SidebarProductHeader />
          </div>
        </>
      }
      center={<NavbarItems items={leftItems} />}
      right={
        <>
          <SearchBar />
          <NavbarColorModeToggle className={styles.colorModeToggle} />
          <NavbarItems items={rightItems} />
        </>
      }
    />
  );
}
