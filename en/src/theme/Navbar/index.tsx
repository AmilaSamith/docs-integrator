/**
 * Wraps @docusaurus/theme-classic's Navbar to add a persistent
 * product+version pill row directly under it, present on every page
 * (not just doc pages with a sidebar -- SidebarProductHeader used to
 * live inside the swizzled DocSidebar/Desktop, which meant it was
 * invisible on the homepage, search, etc). The navbar itself
 * (`.navbar--fixed-top`) is `position: sticky; top: 0`; this row is
 * `position: sticky; top: var(--ifm-navbar-height)` in its own
 * stylesheet, so it sits directly beneath it and stays there together
 * while scrolling.
 */
import type { ReactNode } from 'react';
import Navbar from '@theme-original/Navbar';
import SidebarProductHeader from '@site/src/components/SidebarProductHeader';

import styles from './styles.module.css';

export default function NavbarWrapper(props: Record<string, unknown>): ReactNode {
  return (
    <>
      <Navbar {...props} />
      <div className={styles.secondaryRow}>
        <SidebarProductHeader />
      </div>
    </>
  );
}
