/**
 * Per-branch extension point for the shared `theme/DocRoot/Layout/Sidebar`
 * -- see that file's own docstring and MAINTENANCE.md's "When a branch
 * needs its own hook into shared theme internals" for why this exists (not
 * in sync-theme.yaml's SHARED_PATHS, so `main` never overwrites it).
 *
 * wso2-connectors-only: scopes the sidebar to the current connector when
 * viewing one of its own pages (.../catalog/<area>/<package>/<doc>):
 * instead of the full alphabetical tree of all ~165 connectors, shows just
 * Overview plus that one connector's own category (its overview/setup/
 * actions/example items) -- the other 164 connectors aren't relevant while
 * you're reading one specific connector's docs, and 165 sibling categories
 * is a lot of scrolling to find your way back otherwise. "Build Your Own"
 * stays visible throughout -- it's a short, constant-size link regardless
 * of which connector you're on, not something that needs scoping away.
 *
 * And the other direction: until a connector IS selected, "Connector
 * Catalog" itself renders as a plain link, not an expandable category.
 * Landing on the catalog's own index page makes that category "active" by
 * Docusaurus's own reckoning (its `link` doc is the current page), which
 * normally force-expands it and dumps all ~165 connectors into the sidebar
 * even though nothing under it is actually the active page -- the catalog
 * page's own filter rail is how you browse from there, not a wall of
 * sidebar links. Dropping `items`/`collapsed` and changing `type` to
 * `'link'` sidesteps that auto-expand entirely rather than fighting it (see
 * theme/DocSidebarItem/Category's own `useAutoExpandActiveCategory` -- it
 * re-expands on every render where the category is active, so merely
 * setting `collapsed: true` in the data doesn't stick).
 */
import type { PropSidebarItem, PropSidebarItemCategory, PropSidebarItemLink } from '@docusaurus/plugin-content-docs';
import { connectorPrefixFor, CONNECTOR_SWITCHER_SLOT_ID } from '@site/src/utils/connectorScope';

function isCategory(item: PropSidebarItem): item is PropSidebarItemCategory {
  return item.type === 'category';
}

function asPlainLink(item: PropSidebarItemCategory): PropSidebarItemLink | PropSidebarItemCategory {
  if (!item.href) return item;
  // customProps carries through too (e.g. a connector-count `badge`) --
  // DocSidebarItem/Link's own LinkLabel renders it the same way
  // DocSidebarItem/Category's CategoryLinkLabel does, so the row looks
  // identical whether it's currently rendered as a link (here) or as a
  // category with its items scoped down to one connector (below).
  return { key: item.key, className: item.className, customProps: item.customProps, type: 'link', href: item.href, label: item.label };
}

export default function sidebarTransform(sidebar: PropSidebarItem[], pathname: string, baseUrl: string): PropSidebarItem[] {
  const prefix = connectorPrefixFor(pathname, baseUrl);

  if (!prefix) {
    return sidebar.map((item) =>
      isCategory(item) && item.label === 'Connector Catalog' ? asPlainLink(item) : item,
    );
  }

  return sidebar.flatMap((item) => {
    if (!isCategory(item) || item.label !== 'Connector Catalog') return [item];
    const match = item.items.find((sub): sub is PropSidebarItemCategory => isCategory(sub) && !!sub.href?.startsWith(prefix));
    if (!match) return [item];
    // A synthetic `html` item (stock Docusaurus's own escape hatch for
    // non-standard sidebar content), PREPENDED to "Connector Catalog"'s
    // own items (not a sibling of the category -- a sibling renders AFTER
    // the category's entire `<li>`, which already contains its nested
    // items `<ul>`, landing the switcher below Setup Guide/Actions/Example
    // instead of above them). As items[0] it's the first row inside that
    // nested `<ul>`, i.e. between the pinned row's own header and its
    // first page link, matching the design reference.
    // `customProps.portalSlotId` (the generic mechanism theme/
    // DocSidebarItem/Html provides -- see its own docstring) tells that
    // swizzle to render this as a real React `<div id="...">`, not a
    // `dangerouslySetInnerHTML` string, which silently orphans the portal
    // on some re-renders.
    const switcherSlot: PropSidebarItem = {
      type: 'html',
      value: '',
      defaultStyle: false,
      customProps: { portalSlotId: CONNECTOR_SWITCHER_SLOT_ID },
    } as PropSidebarItem;
    // `match.items` (not `[match]`) -- the design reference shows the
    // connector's own pages (Setup Guide/Actions/Example) as flat rows
    // directly under "Connector Catalog", not nested one level deeper
    // behind an "Alfresco" row of their own; ConnectorSwitcher's trigger
    // card already carries that identity. Dropping the wrapper category
    // also means these end up one level shallower in the DOM
    // (theme-doc-sidebar-item-link-level-2, not -3) -- custom.css's
    // `.catalog-pinned-row > .menu__list` rule restyles them to read at the
    // same visual weight as the pinned row itself, canceling the
    // indent/smaller-font treatment that level normally gets everywhere
    // else in the sidebar.
    //
    // `collapsed: false` is forced explicitly, not left to Docusaurus's own
    // isActiveSidebarItem-driven default -- that check only looks at
    // `item.href` (this category's own, "/catalog") and `item.items` (now
    // the 3 flattened pages), so it's only TRUE when the active page is
    // literally one of those 3. A connector's own "overview"/landing page
    // -- what the catalog grid's card actually links to, i.e. the first
    // page most readers land on -- isn't among them, so without this
    // override the category falls back to `item.collapsed` (true, from
    // sidebars.ts) and silently renders nothing: no connector pages, no
    // switcher slot content, until some OTHER navigation happens to land
    // on one of the 3 flattened pages directly (e.g. a reload deep on the
    // Setup Guide URL) and makes isActive true by coincidence.
    return [{ ...item, items: [switcherSlot, ...match.items], collapsed: false }];
  });
}
