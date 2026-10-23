/**
 * The navbar search entry point: a 2rem icon button, placed by
 * theme/Navbar/Content as the first item after the vertical rule (before
 * the color-mode toggle). Always opens SearchModal (a blurred-backdrop
 * search dialog), and owns the Ctrl/Cmd+K shortcut that opens it from
 * anywhere -- the navbar stays mounted on every page, so the shortcut
 * works whether the doc sidebar is expanded or collapsed to its rail.
 */
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';

import SearchModal from './SearchModal';
import styles from './styles.module.css';

export default function SearchBar(): ReactNode {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const label = translate({
    id: 'theme.SearchBar.label',
    message: 'Search',
    description: 'The ARIA label and placeholder for search button',
  });

  // Ctrl/Cmd+K opens the dialog from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // No visible text (see .trigger in styles.module.css); `aria-label`
  // carries the accessible name.
  return (
    <>
      <button
        type="button"
        className={`navbar__search-input ${styles.trigger}`}
        aria-label={label}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      />
      {open && <SearchModal onClose={close} />}
    </>
  );
}
