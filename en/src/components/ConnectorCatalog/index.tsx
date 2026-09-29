import React, { useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import { useCatalogRegister, useCatalog, SORTS, PER_PAGE_OPTIONS, type Connector, type Sort } from './context';
import styles from './styles.module.css';

interface Props {
  connectors: Connector[];
  categories: string[];
  vendors: string[];
}

/**
 * One pastel bg + ink pair per category, used for the fallback initials
 * mark on cards that have no real icon image. Deliberately
 * theme-invariant (same hex regardless of light/dark mode) -- like a
 * brand-colored badge, not page chrome, so it stays vibrant either way.
 * "Built-in" gets the WSO2 accent peach since those are WSO2's own
 * bundled connectors, not third-party ones.
 */
const CATEGORY_TINTS: Record<string, [string, string]> = {
  'Built-in': ['#FDE3D9', '#D63B12'],
  'AI & ML': ['#EDE9FE', '#5B3FBF'],
  'Cloud & Infrastructure': ['#E4F0FF', '#1D5FA8'],
  Communication: ['#E7F6EF', '#1B7A52'],
  'CRM & Sales': ['#FDE7EF', '#A81B54'],
  Database: ['#E9EEF7', '#2C4373'],
  'Developer Tools': ['#EDEFF3', '#3C4657'],
  'E-Commerce': ['#FFF1DC', '#8A5A12'],
  'ERP & Business': ['#E6F1F1', '#146060'],
  'Finance & Accounting': ['#E8F4E5', '#3A6B24'],
  HRMS: ['#F3E9FB', '#6B2E8F'],
  'Marketing & Social': ['#FFE9E3', '#B23A16'],
  Messaging: ['#E5F1FB', '#175E8C'],
  'Productivity & Collaboration': ['#EAF0FE', '#2B4BAF'],
  'Security & Identity': ['#FDEEE7', '#9A4415'],
  'Storage & Files': ['#E9F3EE', '#26694C'],
};
const DEFAULT_TINT: [string, string] = ['#EDEFF3', '#3C4657'];

function tintOf(category: string): [string, string] {
  return CATEGORY_TINTS[category] ?? DEFAULT_TINT;
}

function initialsOf(name: string): string {
  return name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/** A description long enough to need "Show more" wraps past roughly
 * three lines at card width -- this character count is a rough proxy
 * for that so the toggle only appears where it's actually needed. */
const TRUNCATE_AT = 120;

/** Windowed page-number list with a single "…" gap on either side of
 * the current page, first/last always shown -- same shape as the
 * reference design's "1 2 … 22" pagination, not every page number. */
function pageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | '…')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push('…');
    result.push(p);
    prev = p;
  }
  return result;
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ConnectorCard({ connector: c, catalogBase }: { connector: Connector; catalogBase: string }) {
  const [expanded, setExpanded] = useState(false);
  const [bg, ink] = tintOf(c.category);
  const needsTruncation = c.description.length > TRUNCATE_AT;
  const description = expanded || !needsTruncation ? c.description : `${c.description.slice(0, TRUNCATE_AT).trimEnd()}…`;

  return (
    <div className={styles.card}>
      <Link to={`${catalogBase}${c.link.replace(/\/$/, '')}`} className={styles.cardLink}>
        <div className={styles.cardHeader}>
          {c.icon ? (
            <img
              src={c.icon}
              alt=""
              className={styles.cardIcon}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span className={styles.cardIconFallback} style={{ background: bg, color: ink }}>
              {initialsOf(c.name)}
            </span>
          )}
          <span className={styles.cardName}>{c.name}</span>
          {c.version && <span className={styles.versionBadge}>{c.version}</span>}
        </div>
        <p className={styles.cardDesc}>{description}</p>
      </Link>
      {needsTruncation && (
        <button type="button" className={styles.showMore} onClick={() => setExpanded((e) => !e)}>
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
      <div className={styles.cardDivider} />
      <div className={styles.cardTags}>
        {c.vendor && <span className={styles.tagVendor}>{c.vendor}</span>}
        <span className={styles.tagCategory}>{c.category}</span>
      </div>
    </div>
  );
}

export default function ConnectorCatalog({ connectors, categories, vendors }: Props) {
  useCatalogRegister(connectors, categories, vendors);
  const catalog = useCatalog();
  const catalogBase = useBaseUrl('/catalog/');

  // First render (before the registration effect above has run) or SSR:
  // fall back to the raw props so the page isn't empty for a tick.
  const sort = catalog?.sort ?? 'Popular';
  const setSort = catalog?.setSort ?? (() => {});
  const perPage = catalog?.perPage ?? PER_PAGE_OPTIONS[2];
  const setPerPage = catalog?.setPerPage ?? (() => {});
  const page = catalog?.page ?? 1;
  const setPage = catalog?.setPage ?? (() => {});
  const pageCount = catalog?.pageCount ?? 1;
  const filtered = catalog?.filtered ?? connectors;
  const clearAll = catalog?.clearAll ?? (() => {});

  const start = (page - 1) * perPage;
  const shown = filtered.slice(start, start + perPage);

  return (
    <div className={styles.catalog}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <label className={styles.perPage}>
            Per page
            <span className={styles.selectWrap}>
              <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} Items
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </span>
          </label>
          <span className={styles.resultsMeta}>
            {filtered.length === 0
              ? 'No connectors found'
              : `Showing ${start + 1}-${Math.min(start + perPage, filtered.length)} of ${filtered.length}`}
          </span>
        </div>

        <div className={styles.toolbarRight}>
          <label className={styles.sortBy}>
            Sort by
            <span className={styles.selectWrap}>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    {s === 'Popular' ? 'Most Popular' : s}
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </span>
          </label>

          {pageCount > 1 && (
            <nav className={styles.pagination} aria-label="Pagination">
              <button type="button" className={styles.pageNav} disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page">
                <ChevronLeftIcon /> Previous
              </button>
              {pageNumbers(page, pageCount).map((p, i) =>
                p === '…' ? (
                  <span key={`gap-${i}`} className={styles.pageGap}>
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={styles.pageNum}
                    aria-current={p === page ? 'page' : undefined}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ),
              )}
              <button type="button" className={styles.pageNav} disabled={page >= pageCount} onClick={() => setPage(page + 1)} aria-label="Next page">
                Next <ChevronRightIcon />
              </button>
            </nav>
          )}
        </div>
      </div>

      {shown.length > 0 ? (
        <div className={styles.grid}>
          {shown.map((c) => (
            <ConnectorCard key={c.name} connector={c} catalogBase={catalogBase} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          No connectors match those filters.{' '}
          <button type="button" className={styles.emptyClear} onClick={clearAll}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
