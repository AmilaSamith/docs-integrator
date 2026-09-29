import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Plain useLayoutEffect warns during Docusaurus's server-side static
// generation ("useLayoutEffect does nothing on the server") -- SSG has
// no browser to paint a flash in anyway, so fall back to useEffect
// there and only use the real layout effect once actually in a browser.
const useIsomorphicLayoutEffect = ExecutionEnvironment.canUseDOM ? useLayoutEffect : useEffect;

export interface Connector {
  name: string;
  description: string;
  operations: string;
  auth: string;
  link: string;
  category: string;
  icon?: string;
  /** The company that owns the underlying system/API, when there is a
   * single clear one worth filtering by (e.g. "Oracle" for MySQL and
   * Java JDBC, "Apache" for Kafka) -- not necessarily the connector's
   * own display name. Omitted for generic protocols/specs with no
   * single commercial owner (HTTP, TCP, GraphQL, MQTT, PostgreSQL,
   * RabbitMQ, and similar community/open-governance technologies)
   * rather than guessing one. */
  vendor?: string;
  /** The package's latest published version, extracted from its own
   * icon URL (bcentral-packageicons filenames embed it) rather than a
   * second hand-maintained field -- so it's only present for the ~106
   * of 165 connectors that have a real icon. Shown as the card's
   * corner badge when present; omitted rather than shown as blank. */
  version?: string;
}

export const SORTS = ['Popular', 'A–Z', 'Most operations'] as const;
export type Sort = (typeof SORTS)[number];

export const PER_PAGE_OPTIONS = [12, 24, 30, 48] as const;
export const DEFAULT_PER_PAGE = 30;

interface CatalogData {
  connectors: Connector[];
  categories: string[];
  vendors: string[];
}

interface CatalogContextValue {
  data: CatalogData | null;
  setData: (data: CatalogData | null) => void;
  query: string;
  setQuery: (q: string) => void;
  selectedCats: string[];
  toggleCategory: (cat: string) => void;
  selectedVendors: string[];
  toggleVendor: (vendor: string) => void;
  sort: Sort;
  setSort: (s: Sort) => void;
  perPage: number;
  setPerPage: (n: number) => void;
  page: number;
  setPage: (p: number) => void;
  clearAll: () => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

/**
 * Mounted once, globally, at Root.js (shared across every product
 * branch) -- the actual catalog data only exists inside the MDX page
 * that renders <ConnectorCatalog> (wso2-connectors only), but the
 * filter rail needs to live in the TOC slot (a completely separate
 * sibling in DocItem/Layout's row, not a descendant of the MDX content).
 * A page-scoped local state can't bridge two sibling render trees, so
 * this is a real context instead -- inert (data: null) on every branch
 * that never calls useCatalogRegister.
 *
 * wso2-connectors owns this file (and Filters.tsx, index.tsx,
 * styles.module.css) outright -- see MAINTENANCE.md's note on why
 * ConnectorCatalog is excluded from the shared-theme sync entirely,
 * unlike the rest of src/theme and src/components. Root.js and
 * TOC/index.tsx still import CatalogProvider/useCatalog from here on
 * every branch, so those two stay defensive about ctx/data being null.
 */
export function CatalogProvider({ children }: { children: ReactNode }): ReactNode {
  const [data, setData] = useState<CatalogData | null>(null);
  const [query, setQueryState] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>('Popular');
  const [perPage, setPerPageState] = useState(DEFAULT_PER_PAGE);
  const [page, setPage] = useState(1);

  const setQuery = (q: string) => {
    setQueryState(q);
    setPage(1);
  };
  const toggleCategory = (cat: string) => {
    setSelectedCats((cur) => (cur.includes(cat) ? cur.filter((c) => c !== cat) : [...cur, cat]));
    setPage(1);
  };
  const toggleVendor = (vendor: string) => {
    setSelectedVendors((cur) => (cur.includes(vendor) ? cur.filter((v) => v !== vendor) : [...cur, vendor]));
    setPage(1);
  };
  const setPerPage = (n: number) => {
    setPerPageState(n);
    setPage(1);
  };
  const clearAll = () => {
    setSelectedCats([]);
    setSelectedVendors([]);
    setQueryState('');
    setPage(1);
  };

  const value = useMemo<CatalogContextValue>(
    () => ({
      data,
      setData,
      query,
      setQuery,
      selectedCats,
      toggleCategory,
      selectedVendors,
      toggleVendor,
      sort,
      setSort,
      perPage,
      setPerPage,
      page,
      setPage,
      clearAll,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, query, selectedCats, selectedVendors, sort, perPage, page],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

/** Called by <ConnectorCatalog> to publish its MDX-provided data into the
 * shared context, and clear it again on unmount (navigating away).
 * useLayoutEffect, not useEffect: registering happens in an effect
 * either way (the data isn't known until this component mounts), but a
 * plain useEffect can let the browser paint the "no data yet" frame
 * first -- the filter rail would flash empty, then pop in a moment
 * later. useLayoutEffect runs before that paint, so the empty frame
 * never actually reaches the screen. */
export function useCatalogRegister(connectors: Connector[], categories: string[], vendors: string[]): void {
  const ctx = useContext(CatalogContext);
  useIsomorphicLayoutEffect(() => {
    ctx?.setData({ connectors, categories, vendors });
    return () => ctx?.setData(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectors, categories, vendors]);
}

function opsCount(operations: string): number {
  return operations.split(',').filter((s) => s.trim().length > 0).length;
}

/** Derived, memoized view over the raw context -- both the grid (main
 * content) and the filter rail (TOC slot) call this so the filtering/
 * sorting/counting logic exists in exactly one place. Returns null when
 * there's no registered catalog data (any page other than the catalog). */
export function useCatalog() {
  const ctx = useContext(CatalogContext);
  const data = ctx?.data;

  return useMemo(() => {
    if (!ctx || !data) return null;
    const { connectors, categories, vendors } = data;

    const categoryCounts = new Map<string, number>();
    for (const cat of categories) {
      categoryCounts.set(cat, connectors.filter((c) => c.category === cat).length);
    }
    const sortedCategories = [...categories].sort(
      (a, b) => (categoryCounts.get(b) ?? 0) - (categoryCounts.get(a) ?? 0),
    );

    const vendorCounts = new Map<string, number>();
    for (const vendor of vendors) {
      vendorCounts.set(vendor, connectors.filter((c) => c.vendor === vendor).length);
    }
    const sortedVendors = [...vendors]
      .filter((v) => (vendorCounts.get(v) ?? 0) > 0)
      .sort((a, b) => (vendorCounts.get(b) ?? 0) - (vendorCounts.get(a) ?? 0));

    const q = ctx.query.trim().toLowerCase();
    let filtered = connectors.filter((c) => {
      if (
        q &&
        !(
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (c.vendor?.toLowerCase().includes(q) ?? false)
        )
      ) {
        return false;
      }
      if (ctx.selectedCats.length && !ctx.selectedCats.includes(c.category)) return false;
      if (ctx.selectedVendors.length && !(c.vendor && ctx.selectedVendors.includes(c.vendor))) return false;
      return true;
    });
    if (ctx.sort === 'A–Z') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    else if (ctx.sort === 'Most operations') filtered = [...filtered].sort((a, b) => opsCount(b.operations) - opsCount(a.operations));

    const pageCount = Math.max(1, Math.ceil(filtered.length / ctx.perPage));
    const page = Math.min(ctx.page, pageCount);

    return {
      connectors,
      categories,
      vendors,
      categoryCounts,
      sortedCategories,
      vendorCounts,
      sortedVendors,
      filtered,
      pageCount,
      query: ctx.query,
      setQuery: ctx.setQuery,
      selectedCats: ctx.selectedCats,
      toggleCategory: ctx.toggleCategory,
      selectedVendors: ctx.selectedVendors,
      toggleVendor: ctx.toggleVendor,
      sort: ctx.sort,
      setSort: ctx.setSort,
      perPage: ctx.perPage,
      setPerPage: ctx.setPerPage,
      page,
      setPage: ctx.setPage,
      clearAll: ctx.clearAll,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, data]);
}
