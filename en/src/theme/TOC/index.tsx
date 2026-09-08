/**
 * Wraps @theme-original/TOC to add an "ON THIS PAGE" title above the
 * items -- Docusaurus's stock TOC has no title/heading of its own.
 */
import type { ReactNode } from 'react';
import type { Props } from '@theme/TOC';
import TOC from '@theme-original/TOC';

import styles from './styles.module.css';

export default function TOCWrapper(props: Props): ReactNode {
  return (
    <div className={styles.tocWrapper}>
      <div className={styles.tocTitle}>On this page</div>
      <TOC {...props} />
    </div>
  );
}
