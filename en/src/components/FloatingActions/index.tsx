import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import AIAssistantSidePanel from '@site/src/components/AIAssistantSidePanel/Launcher';

import styles from './styles.module.css';

/**
 * Shared fixed-position bottom-right cluster for every floating action
 * button on the site -- currently just AIAssistantSidePanel (the
 * floating ReportIssueButton was dropped: DocFeedback's own "Report an
 * issue" link, in the "On this page" column, covers the same action
 * without a second always-on button competing for the corner).
 * Mounted once, in src/theme/Root.js, so it's present on every page.
 *
 * AIAssistantSidePanel only shows when the site's docusaurus.config.ts
 * sets `customFields.showAiAssistant: true`. A branch without the
 * setting keeps it hidden.
 */
export default function FloatingActions(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const showAiAssistant = siteConfig.customFields?.showAiAssistant === true;

  if (!showAiAssistant) return null;

  return (
    <div className={`${styles.wrapper} floating-actions`}>
      <AIAssistantSidePanel />
    </div>
  );
}
