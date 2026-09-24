import type { ReactNode } from 'react';

import styles from './styles.module.css';

/**
 * Floating "Report an issue" button -- see src/components/FloatingActions
 * for where/how this is mounted (alongside AiAssistantPanel) and its
 * shared fixed positioning/sizing.
 *
 * Links straight to product-integrator's own issue-template chooser
 * (`/issues/new/choose`), not a prefilled `/issues/new?title=...`
 * form -- this is about reporting a problem with the *product*, and
 * `/choose` is where that product's own structured templates (bug
 * report, feature request, etc.) live. Files against
 * wso2/product-integrator, not this docs-integrator repo: most things
 * a reader reports from a doc page ("this doesn't work", "this is out
 * of date") are actually product behavior, not a docs bug, and
 * product-integrator is where that gets triaged.
 *
 * A plain `<a>`, not a button + `window.open()` -- there's no
 * per-click URL to build anymore (the chooser page doesn't accept
 * `title`/`body` query params the way a template's own form does), so
 * a real link is simpler and gets the usual link affordances (open in
 * new tab, copy link, etc.) for free.
 */
const ISSUE_CHOOSER_URL = 'https://github.com/wso2/product-integrator/issues/new/choose';

function FlagIcon(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 22V4" />
      <path d="M4 4h14l-2.5 4L18 12H4" />
    </svg>
  );
}

export default function ReportIssueButton(): ReactNode {
  return (
    <a
      className={styles.fab}
      href={ISSUE_CHOOSER_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Report product issue"
      title="Report product issue">
      <FlagIcon />
    </a>
  );
}
