import type { ReactNode } from 'react';
import ConnectorSwitcher from '@site/src/components/ConnectorSwitcher';

/**
 * Per-branch extension point for the shared `theme/Root.js` -- see that
 * file's own docstring and MAINTENANCE.md's "When a branch needs its own
 * hook into shared theme internals" for why this exists (not in
 * sync-theme.yaml's SHARED_PATHS, so `main` never overwrites it).
 *
 * wso2-connectors-only: mounts ConnectorSwitcher globally, same as
 * FloatingActions/CookieConsent. See that component's own docstring for
 * what it does and where it portals its content to.
 */
export default function RootExtras(): ReactNode {
  return <ConnectorSwitcher />;
}
