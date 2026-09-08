import { useState, useRef, useEffect, type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { railIconFor } from '@site/src/theme/DocSidebar/Desktop/icons';

import styles from './styles.module.css';

export interface ExploreItem {
  /** Also used to look up an icon via railIconFor -- reuse the sidebar
   * rail's existing per-section icon set instead of a second copy. */
  title: string;
  description: string;
  href: string;
}

interface Props {
  label?: string;
  items: ExploreItem[];
}

function ChevronDownIcon(): ReactNode {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/**
 * A navbar dropdown with a card grid instead of Docusaurus's built-in
 * flat link list (registered as the `exploreDropdown` navbar item type
 * -- see theme/NavbarItem/ComponentTypes.js). `items` is supplied per
 * branch from docusaurus.config.ts, since each product's top-level
 * sections differ.
 */
export default function ExploreDropdown({ label = 'Explore', items }: Props): ReactNode {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div ref={ref} className={clsx('navbar__item', styles.wrapper)}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}>
        {label}
        <ChevronDownIcon />
      </button>
      {open && (
        <div className={styles.menu}>
          <div className={styles.grid}>
            {items.map((item) => (
              <Link key={item.href} to={item.href} className={styles.card} onClick={() => setOpen(false)}>
                <span className={styles.cardIcon}>{railIconFor(item.title)}</span>
                <span className={styles.cardText}>
                  <span className={styles.cardTitle}>{item.title}</span>
                  <span className={styles.cardDesc}>{item.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
