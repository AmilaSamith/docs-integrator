/**
 * Command-palette style search dialog opened by the navbar's search icon:
 * a blurred backdrop, one input (search icon + "Search documentation"
 * placeholder, no title), live results, and a keyboard-hint footer.
 *
 * Queries Algolia directly (via themeConfig.algolia -- see
 * sharedAlgoliaSearch's own docstring in themeConfig.ts for why this
 * replaced @easyops-cn/docusaurus-search-local: one index crawled across
 * every product, instead of each product's build only ever seeing its
 * own pages). Unlike the local-search worker this replaced, Algolia's
 * API works identically in `docusaurus start` and a production build --
 * no more dev-only "search doesn't work here" notice.
 *
 * Each hit's title is always its page's own h1 (`hierarchy.lvl1`, set by
 * the crawler's recordExtractor) regardless of which heading/paragraph
 * on that page actually matched, so results read as "which page",
 * consistently -- the matched location (a specific heading, or a
 * content snippet) renders underneath as the path/detail line. Grouping
 * is by `hierarchy.lvl0`, which the crawler currently hardcodes to the
 * literal string "Documentation" for every record (not derived from
 * which product a page belongs to) -- so today this produces one
 * undifferentiated group. That's a crawler-config fix (Algolia
 * dashboard, not this file); the grouping code is kept so results
 * self-organize by product for free once lvl0 is made product-aware.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { translate } from '@docusaurus/Translate';
import { liteClient as algoliasearch } from 'algoliasearch/lite';

import styles from './SearchModal.module.css';

const RESULT_LIMIT = 20;
const HEADING_LEVELS = ['lvl1', 'lvl2', 'lvl3', 'lvl4', 'lvl5', 'lvl6'] as const;

interface HighlightField {
  value: string;
}

interface AlgoliaHit {
  objectID: string;
  url: string;
  hierarchy: Partial<Record<(typeof HEADING_LEVELS)[number] | 'lvl0', string | null>>;
  type: string; // 'lvl1'..'lvl6' | 'content'
  _highlightResult?: { hierarchy?: Partial<Record<string, HighlightField>> };
  _snippetResult?: { content?: HighlightField };
}

/** The page's own title (hierarchy.lvl1) -- always present, always the
 * result's heading, regardless of which level actually matched. */
function hitTitleHtml(hit: AlgoliaHit): string {
  return hit._highlightResult?.hierarchy?.lvl1?.value ?? hit.hierarchy.lvl1 ?? hit.url;
}

/** What actually matched within the page: the specific heading (for a
 * heading-level hit) or a content snippet (for a body-text hit) -- null
 * when the match IS the page title itself (type === 'lvl1'), since
 * showing it twice would be redundant. */
function hitDetailHtml(hit: AlgoliaHit): string | null {
  if (hit.type === 'lvl1') return null;
  if (hit.type === 'content') return hit._snippetResult?.content?.value ?? null;
  return hit._highlightResult?.hierarchy?.[hit.type]?.value ?? hit.hierarchy[hit.type as (typeof HEADING_LEVELS)[number]] ?? null;
}

/** Breadcrumb of intermediate heading levels between the page title and
 * whatever matched, e.g. "Develop and Test > Create an Agent". */
function hitPath(hit: AlgoliaHit): string {
  const matchedLevel = hit.type === 'content' ? undefined : hit.type;
  return HEADING_LEVELS.slice(1)
    .filter((lvl) => lvl !== matchedLevel)
    .map((lvl) => hit.hierarchy[lvl])
    .filter((v): v is string => Boolean(v))
    .join(' › ');
}

type ResultGroup = { category: string; results: AlgoliaHit[] };

/** Groups by hierarchy.lvl0 while preserving each hit's original rank
 * (first appearance order) -- Algolia's own relevance ordering stays
 * intact within and across groups. Currently produces one group (see
 * this file's own docstring for why); kept so it self-organizes by
 * product for free once the crawler's lvl0 is product-aware. */
function groupResults(hits: AlgoliaHit[]): ResultGroup[] {
  const order: string[] = [];
  const byCategory = new Map<string, AlgoliaHit[]>();
  for (const hit of hits) {
    const cat = hit.hierarchy.lvl0 ?? 'Results';
    if (!byCategory.has(cat)) {
      byCategory.set(cat, []);
      order.push(cat);
    }
    byCategory.get(cat)!.push(hit);
  }
  return order.map((category) => ({ category, results: byCategory.get(category)! }));
}

function SearchIcon(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function HitIcon({ heading }: { heading: boolean }): ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {heading ? (
        <path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" />
      ) : (
        <>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
        </>
      )}
    </svg>
  );
}

export default function SearchModal({
  onClose,
  initialQuery = '',
}: {
  onClose: () => void;
  /** Pre-fills the query (e.g. from the landing page's HeroSearch, which
   * lets someone type before the modal even opens) and runs it
   * immediately -- same box, same results, wherever it was opened from. */
  initialQuery?: string;
}): ReactNode {
  const {
    siteConfig: { themeConfig },
  } = useDocusaurusContext();
  const { appId, apiKey, indexName } = (themeConfig as { algolia?: { appId: string; apiKey: string; indexName: string } }).algolia ?? {};
  const client = useMemo(() => (appId && apiKey ? algoliasearch(appId, apiKey) : null), [appId, apiKey]);
  const history = useHistory();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<AlgoliaHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const q = query.trim();
    if (!q || !client || !indexName) {
      setResults([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const { results: responses } = await client.search<AlgoliaHit>({
          requests: [
            {
              indexName,
              query: q,
              hitsPerPage: RESULT_LIMIT,
              attributesToSnippet: ['content:20'],
              attributesToHighlight: ['hierarchy', 'content'],
            },
          ],
        });
        if (cancelled) return;
        const hits = (responses[0] && 'hits' in responses[0] ? responses[0].hits : []) as AlgoliaHit[];
        setResults(hits);
        setActive(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, client, indexName]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  const open = useCallback(
    (hit: AlgoliaHit) => {
      history.push(hit.url.replace(/^https?:\/\/[^/]+/, ''));
      onClose();
    },
    [history, onClose],
  );

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      open(results[active]);
    }
  };

  const placeholder = translate({ id: 'wso2.search.placeholder', message: 'Search documentation' });
  const hasQuery = query.trim().length > 0;

  return createPortal(
    <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={placeholder}>
        <div className={styles.header}>
          <span className={styles.headerIcon}>
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="search"
            className={styles.input}
            placeholder={placeholder}
            aria-label={placeholder}
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
          />
          {hasQuery && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}>
              Clear
            </button>
          )}
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close search">
            Esc
          </button>
        </div>

        {hasQuery && (
          <div className={styles.body}>
            {results.length > 0 ? (
              <ul ref={listRef} className={styles.results}>
                {groupResults(results).map((group) => (
                  <li key={group.category} className={styles.group}>
                    <span className={styles.groupHeader}>
                      {group.category}
                      <span className={styles.groupCount}>
                        {group.results.length} {group.results.length === 1 ? 'result' : 'results'}
                      </span>
                    </span>
                    <ul className={styles.groupList}>
                      {group.results.map((hit) => {
                        const i = results.indexOf(hit);
                        const detail = hitDetailHtml(hit);
                        const path = hitPath(hit);
                        return (
                          <li key={hit.objectID}>
                            <Link
                              to={hit.url.replace(/^https?:\/\/[^/]+/, '')}
                              className={styles.hit}
                              data-active={i === active}
                              onMouseMove={() => setActive(i)}
                              onClick={onClose}>
                              <span className={styles.hitIcon}>
                                <HitIcon heading={hit.type !== 'content'} />
                              </span>
                              <span className={styles.hitText}>
                                <span className={styles.hitTitle} dangerouslySetInnerHTML={{ __html: hitTitleHtml(hit) }} />
                                {detail && <span className={styles.hitPath} dangerouslySetInnerHTML={{ __html: detail }} />}
                                {!detail && path && <span className={styles.hitPath}>{path}</span>}
                              </span>
                              <span className={styles.hitOpen} aria-hidden="true">
                                Open <kbd>↵</kbd>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>{loading ? 'Searching…' : `No results for “${query.trim()}”`}</p>
            )}
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.hint}>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            to navigate
          </span>
          <span className={styles.hint}>
            <kbd>↵</kbd>
            to open
          </span>
          <span className={styles.footerSpacer} />
          <span>Searching across every WSO2 Integration Platform product</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
