import type { ReactNode } from 'react';
import { tintOf, initialsOf } from '@site/src/components/ConnectorCatalog';

import styles from './styles.module.css';

/**
 * The identity card at the top of a connector's own page (Setup Guide /
 * Actions / Example), from the "Connector detail" design reference
 * (ConnectorDetail.dc.html): icon, name, version badge, description,
 * vendor/category tags, then a bordered Package / Released / Works with
 * grid.
 *
 * Globally registered (theme/MDXComponents) -- no import needed in a doc,
 * same as QuickstartHeader. Icon/category/vendor/description/version are
 * explicit props here rather than looked up from the catalog's own
 * `connectors` array (docs/connectors/catalog/index.mdx) -- that array
 * only exists once ConnectorCatalog has rendered and registered it
 * (CatalogProvider's state), which isn't guaranteed on a first client-side
 * navigation straight to a connector's own page. `packageName`/`released`/
 * `worksWith` have no existing data source at all (not even in the
 * catalog array) -- each defaults to an italic "Not specified" rather
 * than the design reference's literal `[bracket]` placeholder, which is a
 * mockup-only convention, not something this site ships to real pages.
 *
 * Usage (see docs/connectors/catalog/storage-file/alfresco/setup-guide.md
 * for the worked example):
 *
 *   <ConnectorHeader
 *     name="Alfresco" version="2.0.2" vendor="Alfresco" category="Storage & Files"
 *     description="Enterprise content management platform with document CRUD, versioning, shared links, and collaboration features"
 *     icon="https://bcentral-packageicons.azureedge.net/images/ballerinax_alfresco_2.0.2.png"
 *     packageName="ballerinax/alfresco"
 *   />
 */
export interface ConnectorHeaderProps {
  name: string;
  version?: string;
  description: string;
  category: string;
  vendor?: string;
  /** Falls back to a tinted two-letter mark (ConnectorCatalog's own
   * fallback) when omitted or when the image fails to load. */
  icon?: string;
  packageName?: string;
  /** e.g. "2024-03-15" or "March 2024" -- rendered as-is, not parsed. */
  released?: string;
  /** e.g. "WSO2 Integrator 1.2.0+". */
  worksWith?: string;
}

const NOT_SPECIFIED = <em>Not specified</em>;

export default function ConnectorHeader({
  name,
  version,
  description,
  category,
  vendor,
  icon,
  packageName,
  released,
  worksWith,
}: ConnectorHeaderProps): ReactNode {
  const [bg, ink] = tintOf(category);

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        {icon ? (
          <img
            src={icon}
            alt=""
            className={styles.icon}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span className={styles.iconFallback} style={{ background: bg, color: ink }}>
            {initialsOf(name)}
          </span>
        )}
        <div className={styles.titleCol}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{name}</h1>
            {version && <span className={styles.versionBadge}>v{version}</span>}
          </div>
          <p className={styles.description}>{description}</p>
          <div className={styles.tags}>
            {vendor && <span className={styles.tagVendor}>{vendor}</span>}
            <span className={styles.tagCategory}>{category}</span>
          </div>
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.cell}>
          <span className={styles.cellLabel}>Package</span>
          <span className={styles.cellValue}>{packageName ? <code>{packageName}</code> : NOT_SPECIFIED}</span>
        </div>
        <div className={styles.cell}>
          <span className={styles.cellLabel}>Released</span>
          <span className={styles.cellValue}>{released ?? NOT_SPECIFIED}</span>
        </div>
        <div className={styles.cell}>
          <span className={styles.cellLabel}>Works with</span>
          <span className={styles.cellValue}>{worksWith ?? NOT_SPECIFIED}</span>
        </div>
      </div>
    </section>
  );
}
