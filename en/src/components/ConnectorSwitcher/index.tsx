/**
 * The sidebar's "switch connector" trigger + dropdown, from the
 * "Connector detail" design reference (ConnectorDetail.dc.html) -- a
 * 56px card (current connector's icon/name/version/category) that opens
 * a quick-jump panel: a filter input, a "Recent" section (this viewer's
 * own last few connectors, localStorage -- per-viewer convenience, never
 * synced), a "Popular" section (a fixed subset -- there's no real
 * popularity metric wired up yet, see POPULAR_NAMES below), and a footer
 * that hands off to the catalog's own search/filters for anything not in
 * either list.
 *
 * Mounted unconditionally (theme/Root.js, alongside FloatingActions/
 * CookieConsent) but renders nothing of its own -- it portals into a
 * synthetic sidebar slot (CONNECTOR_SWITCHER_SLOT_ID) that
 * DocRoot/Layout/Sidebar's scopeSidebarToConnector only inserts right
 * after the pinned "Connector Catalog" row, and only on a connector's own
 * page. `document.getElementById` can't run during render (the slot's
 * `<li>` may not exist in the DOM yet), so the portal target is found in
 * an effect keyed on `pathname` -- re-checked after every navigation,
 * once Docusaurus's own sidebar re-render (if any) has committed.
 *
 * Not wired to the catalog page's own search box or a `?q=` URL param --
 * neither exists yet (ConnectorCatalog's query state is local React state,
 * not URL-synced), so "Search the catalog" below is a plain link to the
 * catalog page, not a pre-filled one.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { CONNECTORS, type Connector } from '@site/src/data/connectors';
import { tintOf, initialsOf } from '@site/src/components/ConnectorCatalog';
import { activeConnector } from '@site/src/utils/connectorScope';
import { CONNECTOR_SWITCHER_SLOT_ID } from '@site/src/theme/DocRoot/Layout/Sidebar';

import styles from './styles.module.css';

const RECENT_KEY = 'wso2:recent-connectors';
const RECENT_MAX = 3;

// No real popularity/usage metric is wired up yet -- a fixed, reasonable
// starter list (common, broadly-recognized integrations) stands in for
// one. Swap for real data (e.g. download counts) when that exists.
const POPULAR_NAMES = ['Gmail', 'Amazon S3', 'PostgreSQL', 'Salesforce'];

function readRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function pushRecent(name: string): void {
  try {
    const next = [name, ...readRecent().filter((n) => n !== name)].slice(0, RECENT_MAX);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // Private window, blocked storage, etc. -- the switcher still works,
    // it just won't remember recents for next time.
  }
}

function SearchIcon(): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function SwapIcon(): ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m7 9 5-5 5 5M7 15l5 5 5-5" />
    </svg>
  );
}

function ConnectorBadge({ connector, size = 28 }: { connector: Connector; size?: number }): ReactNode {
  const [bg, ink] = tintOf(connector.category);
  return connector.icon ? (
    <img
      src={connector.icon}
      alt=""
      style={{ width: size, height: size, borderRadius: size >= 36 ? 10 : 8, objectFit: 'contain', flexShrink: 0 }}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  ) : (
    <span
      className={styles.badgeFallback}
      style={{ width: size, height: size, borderRadius: size >= 36 ? 10 : 8, background: bg, color: ink, fontSize: size >= 36 ? 14 : 11 }}>
      {initialsOf(connector.name)}
    </span>
  );
}

function ConnectorRow({ connector, catalogBase, tag, onNavigate }: { connector: Connector; catalogBase: string; tag?: string; onNavigate: () => void }): ReactNode {
  return (
    <Link
      to={`${catalogBase}${connector.link.replace(/\/$/, '')}`}
      className={styles.row}
      data-current={!!tag}
      onClick={() => {
        pushRecent(connector.name);
        onNavigate();
      }}>
      <ConnectorBadge connector={connector} />
      <span className={styles.rowText}>
        <strong className={styles.rowName}>{connector.name}</strong>
        <span className={styles.rowMeta}>{tag ? connector.category : connector.version ? `v${connector.version}` : connector.category}</span>
      </span>
      {tag && <span className={styles.rowTag}>{tag}</span>}
    </Link>
  );
}

export default function ConnectorSwitcher(): ReactNode {
  const { pathname } = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const catalogBase = useBaseUrl('/catalog/');
  const current = useMemo(() => activeConnector(pathname, siteConfig.baseUrl), [pathname, siteConfig.baseUrl]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (current) pushRecent(current.name);
  }, [current]);

  // The slot `<li>` only exists in the DOM when the sidebar is actually
  // scoped to a connector (DocRoot/Layout/Sidebar's scopeSidebarToConnector).
  // A plain one-shot `document.getElementById` right after navigation
  // isn't enough: shortly after the first client render, React sometimes
  // replaces this subtree's DOM wholesale (observed directly via
  // MutationObserver -- content gets inserted into the slot, then the
  // `<li>` itself is swapped for a new element with the same id, orphaning
  // whatever a portal had already attached to the old one, with no error
  // or warning). A MutationObserver on the sidebar keeps re-resolving the
  // id for as long as this component is scoped to a connector, so a swap
  // like that gets caught and portalTarget re-points at whichever element
  // currently has the id -- not just whichever one existed at the moment
  // this effect first ran.
  useEffect(() => {
    if (!current) {
      setPortalTarget(null);
      return undefined;
    }
    const resync = () => {
      setPortalTarget((prev) => {
        const found = document.getElementById(CONNECTOR_SWITCHER_SLOT_ID);
        return found === prev ? prev : found;
      });
    };
    resync();
    const observer = new MutationObserver(resync);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [current, pathname]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  if (!current || !portalTarget) return null;

  const q = query.trim().toLowerCase();
  const filtered = q ? CONNECTORS.filter((c) => c.name.toLowerCase().includes(q) || c.vendor?.toLowerCase().includes(q)).slice(0, 8) : null;

  const recentNames = readRecent().filter((n) => n !== current.name);
  const recent = recentNames.map((n) => CONNECTORS.find((c) => c.name === n)).filter((c): c is Connector => !!c).slice(0, RECENT_MAX - 1);
  const popular = POPULAR_NAMES.map((n) => CONNECTORS.find((c) => c.name === n))
    .filter((c): c is Connector => !!c && c.name !== current.name && !recent.some((r) => r.name === c.name));

  return createPortal(
    <div ref={rootRef} className={styles.root}>
      <button type="button" className={styles.trigger} aria-haspopup="listbox" aria-expanded={open} aria-label={`${current.name}${current.version ? ` v${current.version}` : ''}. Switch connector`} onClick={() => setOpen((o) => !o)}>
        <ConnectorBadge connector={current} size={38} />
        <span className={styles.triggerText}>
          <strong className={styles.triggerName}>{current.name}</strong>
          <span className={styles.triggerMeta}>
            {current.version && `v${current.version}`}
            {current.version && ' · '}
            {current.category}
          </span>
        </span>
        <span className={styles.swapBadge} title="Switch connector">
          <SwapIcon />
        </span>
      </button>

      {open && (
        <div role="listbox" aria-label="Switch connector" className={styles.panel}>
          <div className={styles.searchRow}>
            <SearchIcon />
            <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a connector name…" aria-label="Filter connectors" className={styles.searchInput} />
          </div>
          <div className={styles.list}>
            {filtered ? (
              filtered.length > 0 ? (
                filtered.map((c) => <ConnectorRow key={c.name} connector={c} catalogBase={catalogBase} onNavigate={() => setOpen(false)} />)
              ) : (
                <p className={styles.empty}>No connectors match &ldquo;{query.trim()}&rdquo;.</p>
              )
            ) : (
              <>
                <span className={styles.sectionLabel}>Recent</span>
                <ConnectorRow connector={current} catalogBase={catalogBase} tag="Current" onNavigate={() => setOpen(false)} />
                {recent.map((c) => (
                  <ConnectorRow key={c.name} connector={c} catalogBase={catalogBase} onNavigate={() => setOpen(false)} />
                ))}
                {popular.length > 0 && (
                  <>
                    <span className={styles.sectionLabel}>Popular</span>
                    {popular.map((c) => (
                      <ConnectorRow key={c.name} connector={c} catalogBase={catalogBase} onNavigate={() => setOpen(false)} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
          <div className={styles.footer}>
            <Link to={catalogBase} className={styles.footerSearch} title="Open the catalog to search and filter all connectors" onClick={() => setOpen(false)}>
              <SearchIcon />
              <span className={styles.footerSearchLabel}>Search the catalog</span>
              <kbd className={styles.kbd}>Enter</kbd>
            </Link>
            <Link to={catalogBase} className={styles.footerBrowse} onClick={() => setOpen(false)}>
              Browse all {CONNECTORS.length} with filters
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      )}
    </div>,
    portalTarget,
  );
}
