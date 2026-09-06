import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  useVersions,
  useActiveDocContext,
  useDocsVersionCandidates,
} from '@docusaurus/plugin-content-docs/client';

import styles from './styles.module.css';

type ProductKey = 'cloud' | 'integrator' | 'connectors';

/**
 * Kept in sync by hand with theme-shared/themeConfig.ts's PRODUCTS map
 * (can't import it here -- that file is TS-only config-time code, this
 * runs client-side in the browser bundle). Root-relative hrefs, real <a>
 * tags below rather than Docusaurus's <Link> -- each target is a
 * completely separate build/bundle, so this must always be a real page
 * load, never client-side routing (see themeConfig.ts's sharedProductDropdown
 * docstring for the isInternalUrl pitfall this sidesteps entirely by not
 * going through Link at all).
 */
const PRODUCTS: Record<ProductKey, { label: string; href: string }> = {
  cloud: { label: 'SaaS', href: '/integration-platform/docs/' },
  integrator: { label: 'WSO2 Integrator', href: '/integration-platform/docs/integrator/' },
  connectors: { label: 'Connectors', href: '/integration-platform/docs/connectors/' },
};

/** Detects which of the three sites this build is, from its own baseUrl -- no per-branch config needed, so this file can be byte-identical across branches. */
function detectCurrentProduct(baseUrl: string): ProductKey {
  if (baseUrl.includes('/integrator/')) return 'integrator';
  if (baseUrl.includes('/connectors/')) return 'connectors';
  return 'cloud';
}

function ChevronDownIcon(): ReactNode {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function Pill({
  label,
  children,
}: {
  label: string;
  children: (close: () => void) => ReactNode;
}): ReactNode {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div ref={ref} className={styles.pillWrapper}>
      <button
        type="button"
        className={styles.pill}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}>
        <span className={styles.pillLabel}>{label}</span>
        <ChevronDownIcon />
      </button>
      {open && <ul className={styles.pillMenu}>{children(() => setOpen(false))}</ul>}
    </div>
  );
}

function ProductPill(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const current = detectCurrentProduct(siteConfig.baseUrl);
  const others = (Object.keys(PRODUCTS) as ProductKey[]).filter((key) => key !== current);

  return (
    <Pill label={PRODUCTS[current].label}>
      {() =>
        others.map((key) => (
          <li key={key}>
            {/* Real <a>, not <Link>: target is a separate build, must be a real page load. */}
            <a href={PRODUCTS[key].href} className={styles.pillMenuItem}>
              {PRODUCTS[key].label}
            </a>
          </li>
        ))
      }
    </Pill>
  );
}

/** Mirrors @docusaurus/theme-classic's DocsVersionDropdownNavbarItem data logic (same hooks, same "don't render for a single version" rule), just restyled as a pill instead of a navbar dropdown. */
function VersionPill(): ReactNode {
  const versions = useVersions(undefined);
  const activeDocContext = useActiveDocContext(undefined);
  const candidates = useDocsVersionCandidates(undefined);

  if (versions.length <= 1) return null;

  const activeVersion =
    candidates.map((c) => versions.find((v) => v === c)).find((v) => v !== undefined) ?? versions[0];

  function targetDocFor(version: (typeof versions)[number]) {
    return (
      activeDocContext.alternateDocVersions[version.name] ??
      version.docs.find((doc) => doc.id === version.mainDocId)
    );
  }

  return (
    <Pill label={activeVersion.label}>
      {(close) =>
        versions.map((version) => {
          const targetDoc = targetDocFor(version);
          if (!targetDoc) return null;
          return (
            <li key={version.name}>
              <Link
                to={targetDoc.path}
                onClick={close}
                className={styles.pillMenuItem}
                isActive={version === activeVersion}>
                {version.label}
              </Link>
            </li>
          );
        })
      }
    </Pill>
  );
}

export default function SidebarProductHeader(): ReactNode {
  return (
    <div className={styles.header}>
      <ProductPill />
      <VersionPill />
    </div>
  );
}
