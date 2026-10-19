import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';

/**
 * Per-branch extension point for `theme/DocRoot/Layout/Sidebar` (shared).
 * Runs on every sidebar render, after Docusaurus builds `sidebar` from
 * `sidebars.ts` but before it's handed to `<DocSidebar>`. This directory is
 * intentionally NOT in sync-theme.yaml's SHARED_PATHS -- every branch keeps
 * its own copy of this file forever (see RootExtras.tsx's docstring for the
 * same pattern and why), so a sync from `main` never touches it and a
 * branch's own sidebar customization (e.g. wso2-connectors scoping the
 * sidebar down to one connector's own pages) never gets silently dropped by
 * the next sync.
 *
 * Most branches have no sidebar-level transform of their own -- this
 * default is the identity function.
 */
export default function sidebarTransform(
  sidebar: PropSidebarItem[],
  _pathname: string,
  _baseUrl: string,
): PropSidebarItem[] {
  return sidebar;
}
