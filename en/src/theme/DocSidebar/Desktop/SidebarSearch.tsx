/**
 * Search box + "Ask AI" icon button, rendered above the sidebar's own
 * nav tree (see index.tsx). This is the desktop search entry point on
 * every doc page -- the navbar's search icon shows only on mobile (see
 * theme/SearchBar/index.tsx); the landing page keeps its own hero search
 * instead (src/components/LandingHero/HeroSearch).
 *
 * Opens the same SearchModal as the navbar icon and the collapsed rail's
 * search icon, through `openDocsSearch()`: theme/SearchBar owns the one
 * dialog and the Ctrl/Cmd+K shortcut, and stays mounted when this
 * component unmounts as the sidebar collapses to its icon rail (the
 * shortcut used to die with it, issue #1027).
 */
import { type ReactNode } from 'react';
import { openAIAssistant } from '@site/src/components/AIAssistantSidePanel/Launcher';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { openDocsSearch } from '@site/src/theme/SearchBar';

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
  const { siteConfig } = useDocusaurusContext();
  const showAiAssistant = siteConfig.customFields?.showAiAssistant === true;

  return (
    <div className={styles.row}>
      <button type="button" className={styles.searchBtn} aria-haspopup="dialog" onClick={openDocsSearch}>
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
    </div>
  );
}
