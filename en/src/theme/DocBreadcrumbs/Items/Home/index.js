/**
 * Full replacement (not a wrapper) of theme-classic's Home breadcrumb item.
 * The stock version links to useBaseUrl('/'), which on this branch is the
 * bare connectors site root (no page renders there) rather than anything
 * useful -- clicking it landed on a blank "page not found"-adjacent URL.
 * This site's real entry point is the catalog, so point Home there instead.
 *
 * Original: node_modules/@docusaurus/theme-classic/lib/theme/DocBreadcrumbs/Items/Home/index.js
 * Keep this file in sync if you bump the @docusaurus/theme-classic major version.
 */
import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { translate } from '@docusaurus/Translate';
import IconHome from '@theme/Icon/Home';
import styles from './styles.module.css';

export default function HomeBreadcrumbItem() {
  const homeHref = useBaseUrl('/catalog');
  return (
    <li className="breadcrumbs__item">
      <Link
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.home',
          message: 'Home page',
          description: 'The ARIA label for the home page in the breadcrumbs',
        })}
        className="breadcrumbs__link"
        href={homeHref}>
        <IconHome className={styles.breadcrumbHomeIcon} />
      </Link>
    </li>
  );
}
