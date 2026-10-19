/**
 * Full custom swizzle (not a @theme-original wrapper) -- identical to stock
 * EXCEPT for one special case: an item with `customProps.portalSlotId: '<id>'`
 * renders a real React-owned `<div id="<id>">`, not a `dangerouslySetInnerHTML`
 * string.
 *
 * Why: stock's `dangerouslySetInnerHTML` approach works for ordinary static
 * HTML, but breaks for the "empty div as a portal mount point" use case --
 * React is supposed to skip re-writing `innerHTML` when the string is
 * unchanged, but in practice (confirmed via direct DOM inspection on a real
 * use of this pattern) the element can get torn down and recreated with a
 * fresh identity on some re-renders. Whatever called `document.getElementById`
 * to grab a portal target then holds a detached node -- content silently
 * stops rendering, with no error, while a fresh `getElementById` call
 * elsewhere quietly finds the new element instead. A plain React-rendered
 * `<div>` doesn't have that failure mode: React's own reconciliation keeps a
 * stable DOM node for an unchanged element at a stable position, which is a
 * much stronger guarantee than string equality on a `dangerouslySetInnerHTML`
 * value.
 *
 * `portalSlotId` is intentionally generic (not product-specific): any sidebar
 * extension injected via a `sidebarTransform` (see
 * `theme/DocRoot/Layout/Sidebar`'s docstring) that needs a portal mount point
 * can use this same mechanism, not just one particular product's feature.
 *
 * Original: node_modules/@docusaurus/theme-classic/lib/theme/DocSidebarItem/Html/index.js
 * Keep this file in sync if you bump the @docusaurus/theme-classic major version.
 */
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import type { Props } from '@theme/DocSidebarItem/Html';

import styles from './styles.module.css';

export default function DocSidebarItemHtml({ item, level, index }: Props): ReactNode {
  const { value, defaultStyle, className, customProps } = item;
  const portalSlotId = customProps?.portalSlotId as string | undefined;

  if (portalSlotId) {
    return (
      <li
        className={clsx(
          ThemeClassNames.docs.docSidebarItemLink,
          ThemeClassNames.docs.docSidebarItemLinkLevel(level),
          defaultStyle && [styles.menuHtmlItem, 'menu__list-item'],
          className,
        )}>
        <div id={portalSlotId} />
      </li>
    );
  }

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        defaultStyle && [styles.menuHtmlItem, 'menu__list-item'],
        className,
      )}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}
