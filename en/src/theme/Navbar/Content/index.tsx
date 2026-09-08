/**
 * Full custom swizzle (not a @theme-original wrapper). Stock Docusaurus's
 * NavbarContent only has two regions -- "left" (logo + left-position
 * items, as one flex group) and "right" (right-position items + the
 * color-mode toggle + search, pushed to the far edge via margin-left:
 * auto). Logo and left-position items are flat siblings in that SAME
 * left group, so there's no way to center just the nav links while
 * keeping the logo pinned left using CSS alone on top of that structure
 * -- the left group has no extra space to redistribute internally (see
 * this file's own centering rule below for why).
 *
 * This swizzle restructures it into three independent regions instead:
 * logo (fixed left) | nav items (centered, in the remaining space) |
 * GitHub icon + color-mode toggle + search (fixed right). Which navbar
 * items land in the center group is still driven by config as before
 * (theme-shared/themeConfig.ts's items use `position: 'left'` for
 * "goes in the center group", `position: 'right'` for "stays pinned
 * right" -- repurposing Docusaurus's own left/right split rather than
 * inventing a third config value it doesn't understand).
 *
 * Original: node_modules/@docusaurus/theme-classic/lib/theme/Navbar/Content/index.js
 * Keep this file in sync if you bump the @docusaurus/theme-classic major version.
 */
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { useThemeConfig, ThemeClassNames } from '@docusaurus/theme-common';
import { splitNavbarItems, useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import NavbarItem, { type Props as NavbarItemConfig } from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import SearchBar from '@theme/SearchBar';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarSearch from '@theme/Navbar/Search';

import styles from './styles.module.css';

function useNavbarItems(): NavbarItemConfig[] {
  return (useThemeConfig() as { navbar: { items: NavbarItemConfig[] } }).navbar.items;
}

function NavbarItems({ items }: { items: NavbarItemConfig[] }): ReactNode {
  return (
    <>
      {items.map((item, i) => (
        <NavbarItem {...item} key={i} />
      ))}
    </>
  );
}

export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const [centerItems, rightItems] = splitNavbarItems(items);
  const searchBarItem = items.find((item) => item.type === 'search');

  return (
    <div className="navbar__inner">
      <div className={clsx(ThemeClassNames.layout.navbar.containerLeft, 'navbar__items', styles.navLeft)}>
        {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
        <NavbarLogo />
      </div>

      <div className={styles.navCenter}>
        <NavbarItems items={centerItems} />
      </div>

      <div className={clsx(ThemeClassNames.layout.navbar.containerRight, 'navbar__items navbar__items--right', styles.navRight)}>
        <NavbarItems items={rightItems} />
        <NavbarColorModeToggle className={styles.colorModeToggle} />
        {!searchBarItem && (
          <NavbarSearch>
            <SearchBar />
          </NavbarSearch>
        )}
      </div>
    </div>
  );
}
