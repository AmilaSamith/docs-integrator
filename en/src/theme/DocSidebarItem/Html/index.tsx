/**
 * Swizzled from @docusaurus/theme-classic -- identical to stock EXCEPT for
 * one special case: an item with `customProps.connectorSwitcherSlot: true`
 * (DocRoot/Layout/Sidebar's scopeSidebarToConnector, the connector
 * switcher's mount point) renders a real React-owned `<div>`, not a
 * `dangerouslySetInnerHTML` string.
 *
 * Why: stock's `dangerouslySetInnerHTML` approach worked for the simple
 * "always-identical HTML string" case on paper -- React is supposed to
 * skip re-writing `innerHTML` when the string is unchanged -- but in
 * practice, on some re-renders (confirmed via direct DOM inspection: the
 * `<div id="...">` ConnectorSwitcher's effect captured via
 * `getElementById` stopped being the SAME node current in the document a
 * couple seconds later), the element gets torn down and recreated with a
 * fresh identity. ConnectorSwitcher's `createPortal` target was then a
 * detached node -- the switcher silently stopped rendering into the
 * visible DOM, with no error, while `document.getElementById` elsewhere
 * (and even a fresh `getElementById` call) quietly found the NEW element.
 * A plain React-rendered `<div>` doesn't have that failure mode: React's
 * own reconciliation keeps a stable DOM node for an unchanged element at
 * a stable position, which is a much stronger guarantee than string
 * equality on a `dangerouslySetInnerHTML` value.
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
  const { value, defaultStyle, className } = item;
  const liClassName = clsx(
    ThemeClassNames.docs.docSidebarItemLink,
    ThemeClassNames.docs.docSidebarItemLinkLevel(level),
    defaultStyle && [styles.menuHtmlItem, 'menu__list-item'],
    className,
  );

  if (item.customProps?.connectorSwitcherSlot === true) {
    // `value` still carries the slot id (single source of truth, set
    // alongside this flag in scopeSidebarToConnector) -- parsed out of
    // the id="..." attribute rather than hardcoding the string twice.
    const idMatch = /id="([^"]+)"/.exec(value);
    return <li className={liClassName} key={index} id={idMatch?.[1]} />;
  }

  return (
    <li
      className={liClassName}
      key={index}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}
