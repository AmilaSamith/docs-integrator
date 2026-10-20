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
 * trigger shape.
 *
 * Purely presentational -- `open`/`onOpen` are owned by DocSidebar/
 * Desktop/index.tsx, not this component. The global Ctrl/Cmd+K listener
 * used to live here (moving search out of the navbar moved the
 * shortcut's only previous owner, theme/SearchBar/index.tsx's
 * SearchTrigger, with it) but that meant the shortcut silently stopped
 * working the moment the sidebar collapsed to its icon rail -- this
 * component (and its listener) unmounts entirely in that state (see
 * index.tsx's `IconRail` branch), since React tears down a removed
 * component's effects. Lifting the state/listener to the parent, which
 * stays mounted across the collapsed/expanded toggle, fixes that (issue
 * #1027).
 */
import { type ReactNode } from 'react';
import { openAIAssistant } from '@site/src/components/AIAssistantSidePanel/Launcher';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

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

export default function SidebarSearch({ onOpen }: { onOpen: () => void }): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const showAiAssistant = siteConfig.customFields?.showAiAssistant === true;

  return (
    <div className={styles.row}>
      <button type="button" className={styles.searchBtn} aria-haspopup="dialog" onClick={onOpen}>
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
