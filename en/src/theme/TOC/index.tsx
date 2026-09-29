/**
 * Wraps @theme-original/TOC to add an "ON THIS PAGE" title above the
 * items -- Docusaurus's stock TOC has no title/heading of its own.
 *
 * On the connectors catalog page specifically, this slot is repurposed
 * entirely: instead of a heading list, it renders the catalog's filter
 * rail (see ConnectorCatalog/Filters.tsx and .../context.tsx for why
 * that needs a shared context rather than local state). Harmless on
 * every other page/branch -- useCatalog() just returns null there, so
 * ConnectorCatalogFilters renders nothing and the real TOC list shows
 * as before.
 */
import type { ReactNode } from 'react';
import { useLocation } from '@docusaurus/router';
import type { Props } from '@theme/TOC';
import TOC from '@theme-original/TOC';
import ConnectorCatalogFilters from '@site/src/components/ConnectorCatalog/Filters';

import styles from './styles.module.css';

const CONNECTOR_CATALOG_PATH = /\/connectors\/catalog\/?$/;

export default function TOCWrapper(props: Props): ReactNode {
  const { pathname } = useLocation();
  const isConnectorCatalog = CONNECTOR_CATALOG_PATH.test(pathname);

  // Filters.tsx renders its own "Filters" + "Clear all" header, so skip
  // this wrapper's own title in that case rather than showing it twice.
  if (isConnectorCatalog) {
    return <ConnectorCatalogFilters />;
  }

  return (
    <div className={styles.tocWrapper}>
      <div className={styles.tocTitle}>On this page</div>
      <TOC {...props} />
    </div>
  );
}
