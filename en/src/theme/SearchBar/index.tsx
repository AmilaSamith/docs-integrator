/**
 * On desktop, renders @easyops-cn/docusaurus-search-local's own stock
 * SearchBar unchanged (the autocomplete.js dropdown) -- there's enough
 * room there for it to work well. On mobile, swaps it for a plain
 * trigger that jumps straight to the plugin's own `/search` page (a
 * real page, still stock/unswizzled -- large input, live results,
 * works with an empty query) instead of the same dropdown squeezed
 * into a much narrower width.
 *
 * `useWindowSize` is the same hook stock DocSidebar/index.js uses for
 * this exact desktop/mobile split -- 'ssr' (server render / before
 * hydration determines the real viewport) is treated as desktop, same
 * hydration-safety reasoning as that component: default to the richer
 * experience, then swap down to the mobile trigger once the client
 * confirms a narrow viewport.
 */
import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { useWindowSize } from '@docusaurus/theme-common';
import OriginalSearchBar from '@theme-original/SearchBar';

import styles from './styles.module.css';

// @theme/SearchBar ships no typed Props (theme-classic's own
// declaration just re-exports a Noop default) -- the search-local
// plugin's real implementation takes this one optional prop.
type Props = { handleSearchBarToggle?: (toggle: boolean) => void };

function MobileSearchTrigger(): ReactNode {
  const label = translate({
    id: 'theme.SearchBar.label',
    message: 'Search',
    description: 'The ARIA label and placeholder for search button',
  });
  return (
    <Link to="/search" className={`navbar__search-input ${styles.trigger}`} aria-label={label}>
      {label}
    </Link>
  );
}

export default function SearchBar(props: Props): ReactNode {
  const windowSize = useWindowSize();
  if (windowSize === 'mobile') {
    return <MobileSearchTrigger />;
  }
  return <OriginalSearchBar {...props} />;
}
