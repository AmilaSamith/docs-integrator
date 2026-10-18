/**
 * Shared by DocRoot/Layout/Sidebar (scopes the sidebar down to one
 * connector's own category) and ConnectorSwitcher (the sidebar's "switch
 * connector" dropdown) -- both need to answer the same question, "is this
 * page one of a connector's own pages, and if so which connector."
 *
 * `useLocation().pathname` is the real browser path, which includes
 * `baseUrl` (e.g. `/integration-platform/docs/connectors/catalog/...` in
 * production) -- every real deployment sets a nested `BASE_URL`, so this
 * strips it off before looking for the `catalog/<area>/<package>/` prefix.
 */
import { CONNECTORS, type Connector } from '@site/src/data/connectors';

/** `[area, packageSlug]` for a connector's own page, or null for anything
 * else (including the catalog's own index page). */
export function connectorAreaPackage(pathname: string, baseUrl: string): [string, string] | null {
  if (!pathname.startsWith(baseUrl)) return null;
  const parts = pathname.slice(baseUrl.length).split('/').filter(Boolean);
  if (parts[0] !== 'catalog' || parts.length < 3) return null;
  return [parts[1]!, parts[2]!];
}

/** baseUrl-prefixed absolute path for a connector's own category, e.g.
 * `/catalog/storage-file/alfresco/` -- matches sidebar item hrefs, which
 * are baseUrl-prefixed absolute paths too. */
export function connectorPrefixFor(pathname: string, baseUrl: string): string | null {
  const areaPackage = connectorAreaPackage(pathname, baseUrl);
  if (!areaPackage) return null;
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${base}/catalog/${areaPackage[0]}/${areaPackage[1]}/`;
}

/** The full catalog entry (name/version/icon/...) for the connector whose
 * own page is currently active, or null. */
export function activeConnector(pathname: string, baseUrl: string): Connector | null {
  const areaPackage = connectorAreaPackage(pathname, baseUrl);
  if (!areaPackage) return null;
  const linkPrefix = `${areaPackage[0]}/${areaPackage[1]}/`;
  return CONNECTORS.find((c) => c.link === linkPrefix.slice(0, -1) || c.link.startsWith(linkPrefix)) ?? null;
}
