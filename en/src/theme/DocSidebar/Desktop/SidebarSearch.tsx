/**
 * Search box + "Ask AI" icon button, rendered above the sidebar's own
 * nav tree (see index.tsx). Page views have no search in the navbar (the
 * single-header design has none -- see theme/Navbar/Content's own
 * docstring), so this is the search entry point on every doc page; the
 * landing page keeps its own hero search instead (src/components/
 * LandingHero/HeroSearch).
 *
 * Opens the same SearchModal the old navbar trigger used
 * (theme/SearchBar/SearchModal) -- same index, same results, only a new
 * trigger shape. Also where the global Ctrl/Cmd+K shortcut now lives:
 * moving search out of the navbar moved the shortcut's only previous
 * owner (theme/SearchBar/index.tsx's SearchTrigger) with it, so without
 * this it would have silently stopped working everywhere. It still only
 * fires where this component is mounted -- every doc page, not the
 * landing page or other standalone pages, which is the overwhelming
 * majority of the site and matches the mockup's own intent (search
 * lives in the sidebar on page views).
 */
import { useEffect, useState, type ReactNode } from 'react';
import { openAIAssistant } from '@site/src/components/AIAssistantSidePanel/Launcher';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SearchModal from '@site/src/theme/SearchBar/SearchModal';

import styles from './sidebarSearch.module.css';

function SearchIcon(): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function AskAIIcon(): ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    </svg>
  );
}

export default function SidebarSearch(): ReactNode {
  const [open, setOpen] = useState(false);
  const { siteConfig } = useDocusaurusContext();
  const showAiAssistant = siteConfig.customFields?.showAiAssistant === true;

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

  return (
    <div className={styles.row}>
      <button type="button" className={styles.searchBtn} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <SearchIcon />
        <span className={styles.searchLabel}>Search docs</span>
        <span className={styles.kbdGroup}>
          <kbd>Ctrl</kbd>
          <kbd>K</kbd>
        </span>
      </button>
      {showAiAssistant && (
        <button type="button" className={styles.aiBtn} aria-label="Ask AI" onClick={() => openAIAssistant()}>
          <AskAIIcon />
        </button>
      )}
      {open && <SearchModal onClose={() => setOpen(false)} />}
    </div>
  );
}
