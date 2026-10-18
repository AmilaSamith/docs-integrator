import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';

import SearchModal from '@site/src/theme/SearchBar/SearchModal';
import styles from './heroSearch.module.css';

export type HeroQuickLink = { label: string; to: string };

/**
 * The hero's own search box (rendered via LandingHero's `search` prop) --
 * distinct from the sidebar's search (theme/DocSidebar/Desktop/
 * SidebarSearch), which the single-header design has none of in the
 * navbar itself (see theme/Navbar/Content's own docstring). Reads
 * --lh-* colour tokens from the LandingHero wrapper it's nested inside,
 * so it needs no light/dark handling of its own.
 *
 * Opens the SAME SearchModal every other search entry point does --
 * this used to be its own separate thing (a local "Popular pages"
 * dropdown, Enter submitting to Docusaurus's stock /search page), which
 * meant the landing page's search didn't match the rest of the site's
 * result list, grouping, or "Ask AI" affordance. Typing still happens
 * in this box first (so it feels responsive, not jarring), and nothing
 * opens until the "Search" button is clicked or Enter is pressed --
 * the modal then opens with that same query already run.
 */
export default function HeroSearch({ quickLinks }: { quickLinks: HeroQuickLink[] }): ReactNode {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: "/" to focus search.
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close the quick-links dropdown on outside click.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openModal = () => {
    if (!query.trim()) return;
    setFocused(false);
    setModalOpen(true);
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      openModal();
    }
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          openModal();
        }}
        className={styles.form}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className={styles.icon}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          placeholder="Search guides, connectors, APIs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={onInputKeyDown}
          aria-label="Search documentation"
        />
        <button type="submit" className={styles.submit}>
          Search
        </button>
      </form>
      <span className={styles.hint}>
        Press <kbd>/</kbd> to search from anywhere
      </span>

      {focused && !query && quickLinks.length > 0 && (
        <div className={styles.dropdown}>
          <p className={styles.dropdownLabel}>Popular pages</p>
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to} className={styles.dropdownItem} onClick={() => setFocused(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {modalOpen && <SearchModal initialQuery={query} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
