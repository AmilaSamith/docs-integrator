/**
 * Swizzled from @docusaurus/theme-classic — adds a fixed-to-bottom
 * ProductDocsLinks footer (text-style external links to WSO2 MI and SI
 * docs) so the doc sidebar matches the homepage drawer footer.
 *
 * The product+version pill row (SidebarProductHeader) used to live here,
 * above <Content>. It moved to src/theme/Navbar (a global wrapper
 * swizzle) so it's a persistent row under the navbar on every page, not
 * just doc pages with a sidebar -- see that file's docstring.
 *
 * Original: node_modules/@docusaurus/theme-classic/lib/theme/DocSidebar/Desktop/index.js
 * The only addition is `<ProductDocsLinks />` between `<Content />` and
 * the optional `<CollapseButton />`. Keep this file in sync if you bump
 * the @docusaurus/theme-classic major version.
 */
import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { useThemeConfig } from '@docusaurus/theme-common';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import type { Props } from '@theme/DocSidebar';

import ProductDocsLinks from '@site/src/components/ProductDocsLinks';

import styles from './styles.module.css';

function DocSidebarDesktop({ path, sidebar, onCollapse, isHidden }: Props): ReactNode {
  const {
    navbar: { hideOnScroll },
    docs: {
      sidebar: { hideable },
    },
  } = useThemeConfig();
  return (
    <div
      className={clsx(
        styles.sidebar,
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarHidden,
      )}>
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <Content path={path} sidebar={sidebar} />
      <ProductDocsLinks />
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
