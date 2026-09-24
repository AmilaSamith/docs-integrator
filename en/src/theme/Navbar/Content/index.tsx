/**
 * Ejected from @docusaurus/theme-classic to add a third, centered zone
 * for the plain-link nav items (Connectors, Explore, Contribute,
 * Community, Blog, FAQ -- everything configured with `position: 'left'`
 * in docusaurus.config.ts) instead of clustering them right next to the
 * logo. Only the layout changes: still the same NavbarItem components,
 * same splitNavbarItems() left/right split for which items go where
 * (the "left" set now renders in the new center zone, "right" items
 * are untouched), same color-mode toggle and search fallback.
 *
 * The centering itself needs no bespoke CSS -- Infima already ships a
 * `.navbar__items--center` class for exactly this: flanked by the
 * logo's `.navbar__items` (flex: 1) on one side and `.navbar__items
 * --right` (also flex: 1, but only via the adjacent-sibling selector
 * `.navbar__items--center + .navbar__items--right`) on the other, so
 * both sides grow equally and the center block sits truly centered
 * regardless of how wide the logo or the right-side icons are. Equal
 * spacing between the items themselves is likewise already Infima's
 * default: every `.navbar__item` gets the same
 * `--ifm-navbar-item-padding-horizontal` on both sides.
 *
 * On mobile (<996px), Infima's stock responsive rules already collapse
 * every `.navbar__items` except `--right` behind the hamburger sidebar
 * -- that includes this new center zone the same way it included these
 * items when they lived in the logo's own zone, so mobile behavior is
 * unchanged.
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
import SearchBar from '@theme/SearchBar';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarSearch from '@theme/Navbar/Search';

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
      <div className={clsx(ThemeClassNames.layout.navbar.containerLeft, 'navbar__items')}>{logo}</div>
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
  const searchBarItem = items.find((item) => item.type === 'search');
  return (
    <NavbarContentLayout
      logo={
        <>
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          <NavbarLogo />
        </>
      }
      center={<NavbarItems items={leftItems} />}
      right={
        <>
          <NavbarItems items={rightItems} />
          <NavbarColorModeToggle className={styles.colorModeToggle} />
          {!searchBarItem && (
            <NavbarSearch>
              <SearchBar />
            </NavbarSearch>
          )}
        </>
      }
    />
  );
}
