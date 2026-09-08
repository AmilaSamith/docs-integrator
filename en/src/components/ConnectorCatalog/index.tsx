import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import { useCatalogRegister, useCatalog, SORTS, PAGE_SIZE, type Connector } from './context';
import styles from './styles.module.css';

interface Props {
  connectors: Connector[];
  categories: string[];
}

/**
 * Curated highlights for the "Most used" row -- real connector names,
 * cross-checked against the actual catalog data below (see `featured`),
 * not a separate popularity metric we don't have. Silently drops any
 * name that isn't present, so this can never render a broken chip if
 * the catalog data changes.
 */
const FEATURED_NAMES = ['HTTP', 'AI', 'Salesforce', 'Kafka', 'AWS S3', 'Slack', 'Stripe'];

/**
 * One pastel bg + ink pair per category, used for the fallback initials
 * mark on cards/chips that have no real icon image. Deliberately
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

/** No operation-count field exists in the data -- `operations` is a
 * comma-separated list of real operation names, so this derives a count
 * from it rather than inventing one. */
function opsCount(operations: string): number {
  return operations.split(',').filter((s) => s.trim().length > 0).length;
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function ConnectorCatalog({ connectors, categories }: Props) {
  useCatalogRegister(connectors, categories);
  const catalog = useCatalog();
  const catalogBase = useBaseUrl('/catalog/');

  // First render (before the registration effect above has run) or SSR:
  // fall back to the raw props so the page isn't empty for a tick.
  const query = catalog?.query ?? '';
  const setQuery = catalog?.setQuery ?? (() => {});
  const sort = catalog?.sort ?? 'Popular';
  const setSort = catalog?.setSort ?? (() => {});
  const selectedCats = catalog?.selectedCats ?? [];
  const filtered = catalog?.filtered ?? connectors;
  const limit = catalog?.limit ?? PAGE_SIZE;
  const clearAll = catalog?.clearAll ?? (() => {});
  const loadMore = catalog?.loadMore ?? (() => {});

  const featured = FEATURED_NAMES.map((n) => connectors.find((c) => c.name === n)).filter(
    (c): c is Connector => Boolean(c),
  );

  const shown = filtered.slice(0, limit);
  const remaining = filtered.length - shown.length;

  return (
    <div className={styles.catalog}>
      <label className={styles.bigSearch}>
        <SearchIcon />
        <input
          type="search"
          className={styles.bigSearchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search connectors by name, description or operation"
          aria-label="Search connectors"
        />
        {query ? (
          <button type="button" className={styles.bigSearchClear} onClick={() => setQuery('')} aria-label="Clear search">
            <ClearIcon />
          </button>
        ) : (
          <kbd className={styles.kbd}>/</kbd>
        )}
      </label>

      {featured.length > 0 && (
        <>
          <div className={styles.rule}>
            <span>Most used</span>
            <span className={styles.ruleLine} />
          </div>
          <div className={styles.featured}>
            {featured.map((c) => {
              const [bg, ink] = tintOf(c.category);
              return (
                <Link key={c.name} to={`${catalogBase}${c.link.replace(/\/$/, '')}`} className={styles.fchip}>
                  <span className={styles.fmark} style={{ background: bg, color: ink }}>
                    {initialsOf(c.name)}
                  </span>
                  {c.name}
                </Link>
              );
            })}
          </div>
        </>
      )}

      <div className={styles.resultBar}>
        <span className={styles.count}>
          <strong>{filtered.length}</strong> connector{filtered.length === 1 ? '' : 's'}
          {selectedCats.length ? ` in ${selectedCats.length} categor${selectedCats.length === 1 ? 'y' : 'ies'}` : ''}
        </span>
        <div className={styles.sorts}>
          {SORTS.map((s) => (
            <button key={s} type="button" className={styles.sortBtn} aria-pressed={sort === s} onClick={() => setSort(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {shown.length > 0 ? (
        <div className={styles.grid}>
          {shown.map((c) => {
            const [bg, ink] = tintOf(c.category);
            return (
              <Link key={c.name} to={`${catalogBase}${c.link.replace(/\/$/, '')}`} className={styles.card}>
                <div className={styles.cardHead}>
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
                    <span className={styles.cardMark} style={{ background: bg, color: ink }}>
                      {initialsOf(c.name)}
                    </span>
                  )}
                  <span className={styles.cardHeadText}>
                    <span className={styles.cardName}>{c.name}</span>
                    <span className={styles.cardCat}>{c.category}</span>
                  </span>
                  {c.category === 'Built-in' && <span className={styles.tag}>BUILT-IN</span>}
                </div>
                <p className={styles.cardDesc}>{c.description}</p>
                <div className={styles.cardFoot}>
                  <span>{opsCount(c.operations)} operations</span>
                  <span className={styles.cardFootAuth}>{c.auth}</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          No connectors match those filters.{' '}
          <button type="button" className={styles.emptyClear} onClick={clearAll}>
            Clear all filters
          </button>
        </div>
      )}

      {remaining > 0 && (
        <button type="button" className={styles.more} onClick={loadMore}>
          Show {Math.min(PAGE_SIZE, remaining)} more connectors
        </button>
      )}
    </div>
  );
}
