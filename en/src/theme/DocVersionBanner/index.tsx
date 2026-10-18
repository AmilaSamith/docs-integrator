/**
 * Full custom swizzle (not a @theme-original wrapper). Stock
 * DocVersionBanner renders Infima's generic `alert alert--warning` box
 * with two stacked paragraphs; this is the mockup's pill-shaped strip
 * instead: a status dot, one line of text, and a right-aligned "Go to
 * latest" link. Same data as stock (useDocsVersion/useDocVersionSuggestions/
 * useActivePlugin), same unreleased/unmaintained copy via the same
 * Translate ids -- only the markup/style differs. Renders nothing when
 * the active version has no `banner` set (see docusaurus.config.ts's
 * `current.banner: 'unreleased'` for why Next has one).
 *
 * Original: node_modules/@docusaurus/theme-classic/lib/theme/DocVersionBanner/index.js
 * Keep this file in sync if you bump the @docusaurus/theme-classic major version.
 */
import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  useActivePlugin,
  useDocsVersion,
  useDocVersionSuggestions,
} from '@docusaurus/plugin-content-docs/client';

import styles from './styles.module.css';

function BannerCopy({
  banner,
  siteTitle,
  versionLabel,
}: {
  banner: 'unreleased' | 'unmaintained';
  siteTitle: string;
  versionLabel: string;
}): ReactNode {
  return banner === 'unreleased' ? (
    <Translate
      id="theme.docs.versions.unreleasedVersionLabel"
      description="The label used to tell the user that he's browsing an unreleased doc version"
      values={{ siteTitle, versionLabel: <strong>{versionLabel}</strong> }}>
      {"You're viewing {versionLabel}, an unreleased preview. Features may change before release."}
    </Translate>
  ) : (
    <Translate
      id="theme.docs.versions.unmaintainedVersionLabel"
      description="The label used to tell the user that he's browsing an unmaintained doc version"
      values={{ siteTitle, versionLabel: <strong>{versionLabel}</strong> }}>
      {"You're viewing {versionLabel}, which is no longer actively maintained."}
    </Translate>
  );
}

export default function DocVersionBanner(): ReactNode {
  const versionMetadata = useDocsVersion();
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { pluginId } = useActivePlugin({ failfast: true });
  const { latestDocSuggestion, latestVersionSuggestion } = useDocVersionSuggestions(pluginId);

  if (!versionMetadata.banner) return null;

  const latestVersionSuggestedDoc =
    latestDocSuggestion ?? latestVersionSuggestion.docs.find((doc) => doc.id === latestVersionSuggestion.mainDocId);

  return (
    <div role="note" className={styles.banner}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.text}>
        <BannerCopy banner={versionMetadata.banner} siteTitle={siteTitle} versionLabel={versionMetadata.label} />
      </span>
      {latestVersionSuggestedDoc && (
        <Link to={latestVersionSuggestedDoc.path} className={styles.link}>
          <Translate id="theme.docs.versions.latestVersionLinkLabel" description="The label used for the latest version suggestion link label">
            Go to latest
          </Translate>
          {` · ${latestVersionSuggestion.label} →`}
        </Link>
      )}
    </div>
  );
}
