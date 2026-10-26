/**
 * Owns the docs search dialog (SearchModal) and the Ctrl/Cmd+K shortcut
 * that opens it from anywhere. Rendered by theme/Navbar/Content as the
 * first item after the vertical rule, which stays mounted on every page,
 * so the shortcut works whether the doc sidebar is expanded or collapsed
 * to its rail.
 *
 * The navbar icon itself shows only on mobile (below 997px, see
 * .trigger in styles.module.css), where there is no doc sidebar. On
 * desktop the entry points are the sidebar's search box and the search
 * icon on the collapsed rail (theme/DocSidebar/Desktop), which call
 * `openDocsSearch()` so there is only ever one dialog and one shortcut
 * listener.
 */
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';

import SearchModal from './SearchModal';
import styles from './styles.module.css';

const OPEN_EVENT = 'wso2:open-docs-search';

/** Opens the search dialog from anywhere on the page. */
export function openDocsSearch(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export default function SearchBar(): ReactNode {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const label = translate({
    id: 'theme.SearchBar.label',
    message: 'Search',
    description: 'The ARIA label and placeholder for search button',
  });

  // Ctrl/Cmd+K, or openDocsSearch(), opens the dialog from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
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
