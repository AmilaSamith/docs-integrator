/**
 * Swizzled from @docusaurus/theme-classic -- identical to stock except
 * the connector catalog page gets a wider, FIXED-width TOC/filter
 * column instead of Infima's normal 25% (col--3) split. That 25% is
 * fine for a heading list, but too narrow for the filter rail's
 * category labels ("Productivity & Collaboration") without wrapping
 * awkwardly -- a fixed 320px comfortably fits them regardless of
 * viewport width, with the main content column just taking whatever's
 * left instead of a hardcoded 75%.
 *
 * Original: node_modules/@docusaurus/theme-classic/lib/theme/DocItem/Layout/index.js
 * Keep this file in sync if you bump the @docusaurus/theme-classic major version.
 */
import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { useWindowSize } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { useLocation } from '@docusaurus/router';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import type { Props } from '@theme/DocItem/Layout';

import styles from './styles.module.css';

const CONNECTOR_CATALOG_PATH = /\/connectors\/catalog\/?$/;

function useDocTOC() {
  const { frontMatter, toc } = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  const mobile = canRender ? <DocItemTOCMobile /> : undefined;
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? <DocItemTOCDesktop /> : undefined;
  return { hidden, mobile, desktop };
}

export default function DocItemLayout({ children }: Props): ReactNode {
  const docTOC = useDocTOC();
  const { metadata } = useDoc();
  const { pathname } = useLocation();
  const isConnectorCatalog = CONNECTOR_CATALOG_PATH.test(pathname);

  return (
    <div className="row">
      <div
        className={clsx(
          'col',
          !docTOC.hidden && (isConnectorCatalog ? styles.docItemColWide : styles.docItemCol),
        )}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && (
        <div className={clsx('col', isConnectorCatalog ? styles.tocColWide : 'col--3')}>
          {docTOC.desktop}
        </div>
      )}
    </div>
  );
}
