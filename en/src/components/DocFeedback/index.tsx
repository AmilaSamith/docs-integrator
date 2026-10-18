/**
 * "Was this page helpful?" box at the end of the "On this page" column --
 * from the "Connector detail"/"Page" design references' own feedback row,
 * relocated into the TOC sidebar (theme/TOC) rather than the bottom of
 * the article: "Edit this page" already has its own button next to the
 * breadcrumb (theme/EditThisPage, portalled into DocItem/Layout's top
 * row), so this box only needs Yes/No + "Report an issue", not a second
 * edit link. Shared across every product branch.
 *
 * Yes/No has nowhere to send its answer -- there's no analytics/feedback
 * backend wired into this site -- so clicking either just swaps the
 * buttons for a short "Thanks for your feedback!" acknowledgement
 * instead of claiming the response went anywhere. Swap this for a real
 * submit once a backend exists; the one-line comment below marks where.
 *
 * "Report an issue" reuses ReportIssueButton's own per-product issue-
 * tracker URL (`issueUrlFor`), not a second copy of that map.
 */
import { useState, type ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { issueUrlFor } from '@site/src/components/ReportIssueButton';

import styles from './styles.module.css';

function ThumbsUpIcon(): ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 10v10H4V10zM7 10l4-7c1.5 0 2.5 1 2.5 2.5V9h5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.3 20H7" />
    </svg>
  );
}

function ThumbsDownIcon(): ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 14V4H4v10zM7 14l4 7c1.5 0 2.5-1 2.5-2.5V15h5a2 2 0 0 0 2-2.3l-1.2-7A2 2 0 0 0 17.3 4H7" />
    </svg>
  );
}

function FlagIcon(): ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
    </svg>
  );
}

export default function DocFeedback(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);

  const reportUrl = issueUrlFor(siteConfig.baseUrl);

  return (
    <div className={styles.box}>
      <span className={styles.questionText}>Was this page helpful?</span>
      {answer ? (
        <span className={styles.thanks}>Thanks for your feedback!</span>
      ) : (
        <div className={styles.answers}>
          <button
            type="button"
            className={styles.answerBtn}
            onClick={() => {
              // TODO: send to a real feedback endpoint once one exists.
              setAnswer('yes');
            }}>
            <ThumbsUpIcon />
            Yes
          </button>
          <button
            type="button"
            className={styles.answerBtn}
            onClick={() => {
              setAnswer('no');
            }}>
            <ThumbsDownIcon />
            No
          </button>
        </div>
      )}
      <a
        href={reportUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Opens a GitHub issue to report a problem with this page"
        className={styles.reportLink}>
        <FlagIcon />
        Report an issue
      </a>
    </div>
  );
}
