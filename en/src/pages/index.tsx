import type { ReactNode } from 'react';
import { Redirect } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * The connectors site has no landing page of its own -- its home IS the
 * catalog (the navbar logo and the product switcher already point there).
 * This used to be a copy of the old unified-platform homepage whose cards
 * linked to sections that don't exist on this site (get-started, develop,
 * deploy, ...), so the root now just forwards to the catalog.
 */
export default function Home(): ReactNode {
  return <Redirect to={useBaseUrl('/catalog')} />;
}
