import type { ReactNode } from 'react';

import styles from './styles.module.css';

/**
 * The info grid at the top of a quickstart doc, from the "Page —
 * versioned product" design reference (ArticleOneBar.dc.html): a
 * bordered two-cell grid (clock icon + Time, document icon + What
 * you'll build). Used to also carry a "Quick start"/version pill row
 * above the grid -- dropped (along with the "Quick start" pill text
 * and version label, which the `kind` prop and useDocsVersion() fed)
 * since the page's own H1 + breadcrumbs already say what kind of page
 * this is, and DocItem/Layout's own version badge already covers the
 * version, making this row redundant.
 *
 * Globally registered (theme/MDXComponents) -- no import needed in a doc,
 * same as PaletteCard/CloudDocsLink. Usage:
 *
 *   <QuickstartHeader
 *     time="Under 10 minutes"
 *     build={<>An automation that prints <code>Hello World</code></>}
 *   />
 */
export interface QuickstartHeaderProps {
  /** e.g. "Under 10 minutes". */
  time: string;
  /** What the reader ends up with -- can include inline markup, e.g.
   * <>An automation that prints <code>Hello World</code></>. */
  build: ReactNode;
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

export default function QuickstartHeader({ time, build }: QuickstartHeaderProps): ReactNode {
  return (
    <div className={styles.header}>
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
