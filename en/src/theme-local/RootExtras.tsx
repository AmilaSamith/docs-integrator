import type { ReactNode } from 'react';

/**
 * Per-branch extension point for `theme/Root.js` (shared). Mounted once,
 * globally, after CookieConsent. This directory is intentionally NOT in
 * sync-theme.yaml's SHARED_PATHS -- every branch keeps its own copy of this
 * file forever, the same way it keeps its own `docusaurus.config.ts` /
 * `pages/index.*`, so a sync from `main` never touches it and a branch's own
 * global mounts (e.g. wso2-connectors' <ConnectorSwitcher />) never get
 * silently dropped by the next sync. See MAINTENANCE.md's "Shared theme &
 * shared governance" section.
 *
 * Most branches have nothing to mount here -- this default does nothing.
 */
export default function RootExtras(): ReactNode {
  return null;
}
