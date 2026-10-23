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
 *
 * The path is just `/catalog`, not `/connectors/catalog`: wso2-connectors'
 * docs plugin is rooted at docs/connectors/ (see its sidebars.ts using
 * bare `catalog/...` doc ids), so routeBasePath: '/' strips the
 * `connectors` segment along with the usual `docs` one. Got this wrong
 * once already -- the old `/connectors/catalog/?$` regex never matched
 * anything real, so the filter rail silently never rendered and nobody
 * noticed until checking the actual built HTML instead of trusting a
 * clean `docusaurus build`.
 */
import type { ReactNode } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { Props } from '@theme/TOC';
import TOC from '@theme-original/TOC';
import ConnectorCatalogFilters from '@site/src/components/ConnectorCatalog/Filters';
import { openAIAssistant } from '@site/src/components/AIAssistantSidePanel/Launcher';
import DocFeedback from '@site/src/components/DocFeedback';
import CopyPageButton from '@site/src/theme/Navbar/CopyPageButton';

import styles from './styles.module.css';

const CONNECTOR_CATALOG_PATH = /\/catalog\/?$/;

function AskAIIcon(): ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    </svg>
  );
}

/** Only shown when this branch has the AI assistant enabled (see
 * FloatingActions' own docstring) -- otherwise there'd be nothing for it
 * to open. */
function StuckOnAStep(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  if (siteConfig.customFields?.showAiAssistant !== true) return null;
  return (
    <div className={styles.stuckBox}>
      <strong>Stuck on a step?</strong>
      <button type="button" className={styles.stuckBtn} onClick={() => openAIAssistant()}>
        <AskAIIcon />
        Ask AI about this page
      </button>
    </div>
  );
}

export default function TOCWrapper(props: Props): ReactNode {
  const { pathname } = useLocation();
  const isConnectorCatalog = CONNECTOR_CATALOG_PATH.test(pathname);

  // Filters.tsx renders its own "Filters" + "Clear all" header, so skip
  // this wrapper's own title in that case rather than showing it twice.
  if (isConnectorCatalog) {
    return <ConnectorCatalogFilters />;
  }

  // "Edit this page" + "Copy page" sit at the top of this column whenever
  // it renders (theme/DocItem/Layout drops them from the breadcrumb row
  // in that case, so there's only ever one #wso2-edit-page-slot). They
  // live outside .tocScroll -- that box scrolls, which would clip the
  // Copy page dropdown menu opening below the button.
  return (
    <div className={styles.tocWrapper}>
      <div className={styles.tocActions}>
        <div id="wso2-edit-page-slot" />
        <CopyPageButton />
      </div>
      <div className={styles.tocScroll}>
        <div className={styles.tocTitle}>On this page</div>
        <TOC {...props} />
        <StuckOnAStep />
        {/* Last item in the column -- "Edit this page" already has its
            own button above (theme/EditThisPage), so this box is just
            Yes/No + "Report an issue", not a second edit link. */}
        <DocFeedback />
      </div>
    </div>
  );
}
