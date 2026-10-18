import type { ReactNode } from 'react';
import { useDocsVersion } from '@docusaurus/plugin-content-docs/client';

import styles from './styles.module.css';

/**
 * The badge row + info grid at the top of a quickstart doc, from the
 * "Page — versioned product" design reference (ArticleOneBar.dc.html):
 * a "Quick start" pill, a version badge, then a bordered two-cell grid
 * (clock icon + Time, document icon + What you'll build).
 *
 * Globally registered (theme/MDXComponents) -- no import needed in a doc,
 * same as PaletteCard/CloudDocsLink. Usage:
 *
 *   <QuickstartHeader
 *     time="Under 10 minutes"
 *     build={<>An automation that prints <code>Hello World</code></>}
 *   />
 *
 * The version badge reads the ACTIVE version at render time
 * (useDocsVersion(), the same hook DocVersionBadge/DocVersionBanner use)
 * rather than taking it as a prop -- a versioned snapshot under
 * versioned_docs/ renders with its own frozen copy of this component, so
 * each one naturally shows its own version with no per-snapshot edits
 * ever needed.
 */
export interface QuickstartHeaderProps {
  /** e.g. "Under 10 minutes". */
  time: string;
  /** What the reader ends up with -- can include inline markup, e.g.
   * <>An automation that prints <code>Hello World</code></>. */
  build: ReactNode;
  /** Overrides the "Quick start" pill's text, for a non-quickstart page
   * reusing this same header shape. */
  kind?: string;
}

function ClockIcon(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9 2h6" />
    </svg>
  );
}

function BuildIcon(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="m7.5 10 3 2.5-3 2.5M12.5 15h4" />
    </svg>
  );
}

export default function QuickstartHeader({ time, build, kind = 'Quick start' }: QuickstartHeaderProps): ReactNode {
  const { label: versionLabel } = useDocsVersion();

  return (
    <div className={styles.header}>
      <div className={styles.badges}>
        <span className={styles.badgeAccent}>{kind}</span>
        <span className={styles.badgeNeutral}>Version: {versionLabel}</span>
      </div>
      <div className={styles.grid}>
        <div className={styles.cell}>
          <span className={styles.cellIcon}>
            <ClockIcon />
          </span>
          <span className={styles.cellText}>
            <span className={styles.cellLabel}>Time</span>
            <span className={styles.cellValue}>{time}</span>
          </span>
        </div>
        <div className={styles.cell}>
          <span className={styles.cellIcon}>
            <BuildIcon />
          </span>
          <span className={styles.cellText}>
            <span className={styles.cellLabel}>What you&apos;ll build</span>
            <span className={styles.cellValue}>{build}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
