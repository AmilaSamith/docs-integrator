import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

/**
 * Cookie consent -- a floating card (not a full-width bar) with a settings
 * dialog, matching the "Cookie consent · in the docs theme" design
 * reference (CookieConsent.dc.html). Mounted once in theme/Root.js, like
 * FloatingActions.
 *
 * Storage: a single localStorage key holds the category choices. Reading
 * it happens in an effect (not during render), so server and first-paint
 * client markup both render nothing -- avoids a hydration mismatch and a
 * flash of the banner before we know whether consent was already given.
 *
 * Reopening later: theme/Footer links its bottom-bar "Cookie settings"
 * item to openCookieSettings() (exported below), which dispatches a
 * window event this component listens for. No floating cookie icon (it
 * would compete with FloatingActions' "Ask AI"/"Report an issue" corner).
 */

const STORAGE_KEY = 'wso2-cookie-consent';
const OPEN_SETTINGS_EVENT = 'wso2:open-cookie-settings';
/** Bumped when the category set or their defaults change, so a stored
 * choice made under an older shape doesn't silently carry over as-is --
 * the banner reappears instead. */
const CONSENT_VERSION = 1;

type CategoryId = 'functional' | 'analytics' | 'marketing';
const CATEGORY_IDS: CategoryId[] = ['functional', 'analytics', 'marketing'];

type StoredConsent = {
  version: number;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

type Choices = Record<CategoryId, boolean>;

const DEFAULT_CHOICES: Choices = { functional: false, analytics: false, marketing: false };

function readStoredConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      functional: !!parsed.functional,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
    };
  } catch {
    return null;
  }
}

function writeStoredConsent(choices: Choices): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CONSENT_VERSION, ...choices }));
  } catch {
    // Private browsing / storage disabled -- the banner just reappears
    // next visit, which is an acceptable fallback, not an error to surface.
  }
}

/** Opens the settings dialog from anywhere (e.g. the footer's "Cookie
 * settings" link) without those callers needing a reference to this
 * component's own state. */
export function openCookieSettings(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
  }
}

type View = 'checking' | 'hidden' | 'banner' | 'settings';

const CATEGORY_COPY: Record<CategoryId, { name: string; desc: string }> = {
  functional: {
    name: 'Functional',
    desc: 'Remember preferences such as theme, product and version.',
  },
  analytics: {
    name: 'Analytics',
    desc: 'Count visits and see which pages help, so we can improve the docs.',
  },
  marketing: {
    name: 'Marketing',
    desc: 'Measure campaigns and show relevant WSO2 content on other sites.',
  },
};

function CookieIcon(): ReactNode {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.5 12.5A8.5 8.5 0 1 1 11.5 3.5a3 3 0 0 0 4 3.5 3 3 0 0 0 5 5.5z" strokeWidth="1.7" strokeLinejoin="round" stroke="currentColor" />
      <circle cx="9" cy="10" r="1.2" fill="currentColor" />
      <circle cx="13.5" cy="15" r="1.2" fill="currentColor" />
      <circle cx="8.5" cy="15.5" r="1" fill="currentColor" />
    </svg>
  );
}

function CloseIcon(): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Focus-traps Tab/Shift+Tab within the dialog and closes it on Escape.
 * Focuses the close button on open, matching the design's "modal dialog
 * that traps focus" rule. */
function useDialogKeyboard(open: boolean, dialogRef: React.RefObject<HTMLDivElement | null>, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialog) return;
      const items = Array.from(
        dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])'),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, dialogRef, onClose]);
}

/** Toggle switch for one settings row. `locked` (Strictly necessary) is
 * always on and not interactive, with an "Always on" tag instead. */
function CategoryToggle({
  id,
  on,
  locked,
  onToggle,
}: {
  id: string;
  on: boolean;
  locked?: boolean;
  onToggle: () => void;
}): ReactNode {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={id}
      disabled={locked}
      onClick={onToggle}
      className={clsx(styles.toggle, on && styles.toggleOn, locked && styles.toggleLocked)}>
      <span className={styles.toggleKnob} />
    </button>
  );
}

export default function CookieConsent(): ReactNode {
  const [view, setView] = useState<View>('checking');
  const [choices, setChoices] = useState<Choices>(DEFAULT_CHOICES);
  const bannerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Read stored consent after mount only -- see this file's docstring.
  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      setChoices({ functional: stored.functional, analytics: stored.analytics, marketing: stored.marketing });
      setView('hidden');
    } else {
      setView('banner');
    }
  }, []);

  // Let the footer (or anything else) reopen settings without a direct
  // reference to this component.
  useEffect(() => {
    const onOpen = () => setView('settings');
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  // While the banner (not the settings dialog, which covers the viewport
  // behind its own overlay) is showing, push FloatingActions up by its
  // height -- see FloatingActions/styles.module.css's own var() read.
  useEffect(() => {
    const root = document.documentElement;
    if (view !== 'banner' || !bannerRef.current) {
      root.style.removeProperty('--wso2-cookie-offset');
      return;
    }
    const el = bannerRef.current;
    const update = () => root.style.setProperty('--wso2-cookie-offset', `${el.offsetHeight + 16}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--wso2-cookie-offset');
    };
  }, [view]);

  const persist = useCallback((next: Choices) => {
    setChoices(next);
    writeStoredConsent(next);
    setView('hidden');
  }, []);

  const acceptAll = useCallback(() => persist({ functional: true, analytics: true, marketing: true }), [persist]);
  const rejectAll = useCallback(() => persist({ functional: false, analytics: false, marketing: false }), [persist]);
  const saveChoices = useCallback(() => persist(choices), [persist, choices]);
  const toggleCategory = useCallback((id: CategoryId) => {
    setChoices((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);
  const closeSettings = useCallback(() => {
    // Closing without saving (Esc / the × button) falls back to the
    // banner only on a first visit (no stored choice yet); once a choice
    // exists, closing just hides the dialog again.
    setView(readStoredConsent() ? 'hidden' : 'banner');
  }, []);

  useDialogKeyboard(view === 'settings', dialogRef, closeSettings);

  if (view === 'checking' || view === 'hidden') return null;

  return (
    <>
      {view === 'banner' && (
        <div ref={bannerRef} role="region" aria-label="Cookie consent" className={styles.banner}>
          <span className={styles.icon} aria-hidden="true">
            <CookieIcon />
          </span>
          <div className={styles.copy}>
            <strong className={styles.title}>We use cookies</strong>
            <p className={styles.desc}>
              Some keep the docs working. With your OK, others help us understand which pages are useful and support
              our marketing. <a href="https://wso2.com/cookie-policy" target="_blank" rel="noopener noreferrer">Cookie Policy</a>
            </p>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.linkBtn} onClick={() => setView('settings')}>
              Cookie settings
            </button>
            <button type="button" className={styles.outlineBtn} onClick={rejectAll}>
              Reject all
            </button>
            <button type="button" className={styles.solidBtn} onClick={acceptAll}>
              Accept all
            </button>
          </div>
        </div>
      )}

      {view === 'settings' && (
        <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && closeSettings()}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title" className={styles.dialog}>
            <div className={styles.dialogHead}>
              <div className={styles.dialogHeadText}>
                <h2 id="cookie-settings-title" className={styles.dialogTitle}>
                  Cookie settings
                </h2>
                <span className={styles.dialogSub}>Choose what we can use. You can change this any time from the footer.</span>
              </div>
              <button type="button" aria-label="Close" className={styles.closeBtn} onClick={closeSettings}>
                <CloseIcon />
              </button>
            </div>

            <ul className={styles.catList}>
              <li className={styles.catRow}>
                <div className={styles.catText}>
                  <strong className={styles.catName}>
                    Strictly necessary
                    <span className={styles.alwaysOn}>Always on</span>
                  </strong>
                  <span className={styles.catDesc}>
                    Keep the site working: security, load balancing and remembering your cookie choice.
                  </span>
                </div>
                <CategoryToggle id="Strictly necessary" on locked onToggle={() => undefined} />
              </li>
              {CATEGORY_IDS.map((id) => (
                <li key={id} className={styles.catRow}>
                  <div className={styles.catText}>
                    <strong className={styles.catName}>{CATEGORY_COPY[id].name}</strong>
                    <span className={styles.catDesc}>{CATEGORY_COPY[id].desc}</span>
                  </div>
                  <CategoryToggle id={CATEGORY_COPY[id].name} on={choices[id]} onToggle={() => toggleCategory(id)} />
                </li>
              ))}
            </ul>

            <div className={styles.dialogFoot}>
              <button type="button" className={styles.outlineBtn} onClick={rejectAll}>
                Reject all
              </button>
              <button type="button" className={styles.outlineBtn} onClick={acceptAll}>
                Accept all
              </button>
              <button type="button" className={styles.saveBtn} onClick={saveChoices}>
                Save my choices
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
