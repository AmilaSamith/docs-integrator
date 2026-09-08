import React, { type ReactNode } from 'react';
import { useCatalog } from './context';
import styles from './styles.module.css';

function CheckIcon(): ReactNode {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 13 4.5 4.5L19 7" />
    </svg>
  );
}

/**
 * Rendered in the "On this page" TOC slot (see theme/TOC), not inline in
 * the main content column -- see context.tsx's docstring for why this
 * needs a shared context rather than local state. Returns null on every
 * page except the catalog itself (no registered data to show).
 */
export default function ConnectorCatalogFilters(): ReactNode {
  const catalog = useCatalog();
  if (!catalog) return null;

  return (
    <div className={styles.filters}>
      <div className={styles.filtersHead}>
        <span>Filters</span>
        <button type="button" className={styles.clear} onClick={catalog.clearAll}>
          Clear all
        </button>
      </div>
      <div className={styles.facetGroup}>
        <div className={styles.facetTitle}>Category</div>
        {catalog.sortedCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={styles.facet}
            aria-pressed={catalog.selectedCats.includes(cat)}
            onClick={() => catalog.toggleCategory(cat)}
          >
            <span className={styles.box}>
              <CheckIcon />
            </span>
            <span className={styles.facetLabel}>{cat}</span>
            <span className={styles.facetCount}>{catalog.categoryCounts.get(cat) ?? 0}</span>
          </button>
        ))}
      </div>
      <div className={styles.promo}>
        <b>Missing a connector?</b>
        <span>Generate one from an OpenAPI spec, or request it on GitHub.</span>
      </div>
    </div>
  );
}
