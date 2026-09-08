/**
 * Swizzled from @docusaurus/theme-classic. Same state machine as the
 * original (hiddenSidebarContainer / hiddenSidebar / toggleSidebar,
 * ResetOnSidebarChange) -- the only reason for this swizzle is that the
 * original's width-collapse CSS lives inside `@layer docusaurus.theme-classic`
 * in its styles.module.css. Cascade layers make unlayered normal rules win
 * over layered ones, and unlayered `!important` rules the LOSE to layered
 * `!important` (the important-vs-layer order is the reverse of normal's) --
 * so nothing in our own custom.css could override that module's collapsed
 * width to the 64px our icon rail (theme/DocSidebar/Desktop) needs, no
 * matter the selector specificity or `!important`. Authoring the
 * width-setting rules ourselves, in a stylesheet that never opts into a
 * layer, sidesteps that fight entirely.
 *
 * Also drops the original's <ExpandButton> -- our icon rail already
 * fills the whole collapsed width with clickable icons, including its
 * own expand button, so a second one stacked on top would be redundant.
 *
 * Original: node_modules/@docusaurus/theme-classic/lib/theme/DocRoot/Layout/Sidebar/index.js
 * Keep this file in sync if you bump the @docusaurus/theme-classic major version.
 */
import React, { useState, useCallback, useEffect, type ReactNode } from 'react';
import clsx from 'clsx';
import { prefersReducedMotion, ThemeClassNames } from '@docusaurus/theme-common';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import { useLocation } from '@docusaurus/router';
import DocSidebar from '@theme/DocSidebar';
import type { Props } from '@theme/DocRoot/Layout/Sidebar';

import styles from './styles.module.css';

function ResetOnSidebarChange({ children }: { children: ReactNode }) {
  const sidebar = useDocsSidebar();
  return <React.Fragment key={sidebar?.name ?? 'noSidebar'}>{children}</React.Fragment>;
}

export default function DocRootLayoutSidebar({
  sidebar,
  hiddenSidebarContainer,
  setHiddenSidebarContainer,
}: Props): ReactNode {
  const { pathname } = useLocation();
  const [hiddenSidebar, setHiddenSidebar] = useState(false);
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }
    // onTransitionEnd won't fire when sidebar animation is disabled
    // fixes https://github.com/facebook/docusaurus/issues/8918
    if (!hiddenSidebar && prefersReducedMotion()) {
      setHiddenSidebar(true);
    }
    setHiddenSidebarContainer((value) => !value);
  }, [setHiddenSidebarContainer, hiddenSidebar]);

  // Auto-collapse to the icon rail on narrower desktop widths, so the
  // sidebar doesn't eat too much of the content column before Infima's own
  // breakpoint (996px) swaps to the mobile drawer entirely. Only binds
  // within the "still desktop" range -- .docSidebarContainer itself is
  // display:none below 997px (see Infima's docSidebar.css), so this never
  // fights the mobile sidebar.
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1200px)');
    const applyForMatch = (matches: boolean) => {
      setHiddenSidebarContainer(matches);
      if (!matches) {
        setHiddenSidebar(false);
      }
    };
    applyForMatch(mql.matches);
    const listener = (e: MediaQueryListEvent) => applyForMatch(e.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside
      className={clsx(
        ThemeClassNames.docs.docSidebarContainer,
        styles.docSidebarContainer,
        hiddenSidebarContainer && styles.docSidebarContainerHidden,
      )}
      onTransitionEnd={(e) => {
        if (!e.currentTarget.classList.contains(styles.docSidebarContainer)) {
          return;
        }
        if (hiddenSidebarContainer) {
          setHiddenSidebar(true);
        }
      }}>
      <ResetOnSidebarChange>
        <div
          className={clsx(
            styles.sidebarViewport,
            hiddenSidebar && styles.sidebarViewportHidden,
          )}>
          <DocSidebar sidebar={sidebar} path={pathname} onCollapse={toggleSidebar} isHidden={hiddenSidebar} />
        </div>
      </ResetOnSidebarChange>
    </aside>
  );
}
