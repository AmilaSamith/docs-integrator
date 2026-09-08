/**
 * Full custom swizzle (not a @theme-original wrapper) -- the reference
 * design's footer layout (a brand/social column alongside the config-driven
 * link columns, then a separate bottom bar) has no equivalent in
 * @docusaurus/theme-classic's stock Footer, which only renders link columns
 * + a single logo/copyright row. Content stays config-driven (reads
 * `footer.links` / `footer.copyright` from docusaurus.config.ts via
 * useThemeConfig, same as the original); only the brand column and bottom
 * bar are new, hardcoded here since they aren't really per-page config.
 */
import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useThemeConfig } from '@docusaurus/theme-common';

import styles from './styles.module.css';

type FooterItem = { label: string; to?: string; href?: string; autoAddBaseUrl?: boolean; target?: string };
type FooterColumn = { title?: string; items?: FooterItem[] };

function ExternalIcon(): ReactNode {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function DiscordIcon(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 18c-1-4 .3-8.5 2-10l1 1.4A9 9 0 0 1 15 9.4L16 8c1.7 1.5 3 6 2 10a13 13 0 0 1-4 1.6l-.8-1.5a11 11 0 0 0-3.4 0L9 19.6A13 13 0 0 1 6 18Z" />
      <path d="M10 13v.01M14 13v.01" />
    </svg>
  );
}

function YoutubeIcon(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3a2.7 2.7 0 0 0-1.9 1.9A28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8ZM10 15.2V8.8l5.5 3.2Z" />
    </svg>
  );
}

function StackOverflowIcon(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.4 18.2v-4.6h1.5V19.7H4.6v-6.1h1.5v4.6ZM7.7 13.6l7.3 1.5.3-1.5-7.3-1.6Zm1-3.6 6.8 3.1.6-1.4-6.7-3.2Zm2-3.4 5.8 4.8.9-1.2-5.7-4.8Zm3.3-3.5-1.2.9 4.4 5.9 1.2-.9ZM7.6 17.1h7.4v-1.5H7.6Z" />
    </svg>
  );
}

function FooterLink({ item }: { item: FooterItem }): ReactNode {
  const { label, to, href, autoAddBaseUrl, target } = item;
  const toUrl = useBaseUrl(to);
  return (
    <Link
      className={styles.footerColLink}
      {...(href ? { href } : { to: toUrl })}
      {...(autoAddBaseUrl === false && { autoAddBaseUrl: false })}
      {...(target && { target })}>
      {label}
      {href && !isInternalUrl(href) && <ExternalIcon />}
    </Link>
  );
}

export default function Footer(): ReactNode {
  const { footer } = useThemeConfig() as { footer?: { links?: FooterColumn[]; copyright?: string } };
  const { siteConfig } = useDocusaurusContext();
  // The real lockup file, used as-is -- the footer background is always
  // navy regardless of the site's light/dark theme, so it always needs
  // the white+orange variant (the black one would be invisible here).
  const logoSrc = useBaseUrl('/img/wso2-integration-platform-full-colour.svg');

  if (!footer) return null;
  const { links, copyright } = footer;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerBrand}>
          <img className={styles.footerLogo} src={logoSrc} alt="WSO2 Integration Platform" />
          <p className={styles.footerTagline}>{siteConfig.tagline}</p>
          <span className={styles.footerSocialLabel}>Community</span>
          <div className={styles.footerSocial}>
            <a
              className={styles.footerSocialBtn}
              href="https://discord.com/invite/wso2"
              target="_blank"
              rel="noopener noreferrer">
              <DiscordIcon />
              Discord
            </a>
            <a
              className={styles.footerSocialBtn}
              href="https://www.youtube.com/@WSO2official"
              target="_blank"
              rel="noopener noreferrer">
              <YoutubeIcon />
              YouTube
            </a>
            <a
              className={styles.footerSocialBtn}
              href="https://stackoverflow.com/questions/tagged/wso2"
              target="_blank"
              rel="noopener noreferrer">
              <StackOverflowIcon />
              Stack Overflow
            </a>
          </div>
        </div>

        {links?.map((column, i) => (
          <div className={styles.footerCol} key={i}>
            {column.title && <div className={styles.footerColTitle}>{column.title}</div>}
            {column.items?.map((item, j) => (
              <FooterLink key={j} item={item} />
            ))}
          </div>
        ))}
      </div>

      <div className={styles.footerBottom}>
        {copyright && <span className={styles.footerCopyright}>{copyright}</span>}
        <div className={styles.footerLegal}>
          {/* Privacy policy / Terms of use aren't linked here yet -- no
              confirmed URL for either; add once we have real ones. */}
          <a
            className={styles.footerLegalLink}
            href="https://github.com/wso2/docs-integrator/issues/new"
            target="_blank"
            rel="noopener noreferrer">
            Report an issue
          </a>
        </div>
      </div>
    </footer>
  );
}
