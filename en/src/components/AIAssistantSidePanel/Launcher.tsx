import { useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

import AssistantChat from './index';
import styles from './launcher.module.css';

const OPEN_EVENT = 'wso2:open-ai-assistant';

/**
 * Opens the assistant panel from anywhere (e.g. the sidebar's "Ask AI"
 * button, a TOC "Stuck on a step?" prompt, a search-modal row) without
 * those callers needing a reference to this component's own state --
 * same event-based pattern as CookieConsent's openCookieSettings. A
 * no-op if `showAiAssistant` isn't on for this branch (Launcher simply
 * isn't mounted then, so nothing listens).
 */
export function openAIAssistant(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(OPEN_EVENT));
  }
}

/**
 * The floating AI Docs Assistant button plus the side panel it opens.
 * Mounted in the shared FloatingActions cluster (src/theme/Root.js), so
 * it's on every page and the conversation survives navigating between
 * pages. The panel slides in over the right side of the page, below the
 * header rows; the page itself doesn't move.
 */

/** Lucide's "bot" icon (https://lucide.dev/icons/bot), ISC-licensed. */
function AssistantButtonIcon(): ReactNode {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

export default function AIAssistantSidePanel(): ReactNode {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  return (
    <>
      {open && (
        <div className={styles.dock}>
          <AssistantChat onClose={close} />
        </div>
      )}
      <button
        type="button"
        className={styles.fab}
        aria-label="AI Docs Assistant"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}>
        <AssistantButtonIcon />
      </button>
    </>
  );
}
