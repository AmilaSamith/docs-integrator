import type { ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

/* ------------------------------------------------------------------ */
/*  Clean SVG Icon Components                                          */
/* ------------------------------------------------------------------ */
function IconPlatformOverview(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconDevelop(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconTutorials(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IconDeploy(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function IconMigrate(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h13l-3-3M20 17H7l3 3" />
    </svg>
  );
}

function IconManage(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function IconEditorTour(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconObserve(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a8 8 0 1 1 16 0" />
      <path d="M12 14l4-5" />
      <path d="M4 14h1M19 14h1M12 14v1" />
    </svg>
  );
}

/** The pulse/waveform mark used as the "Docs" badge icon in the hero
 * and as the logo-ish icon in the cloud-console mockup. */
function IconWave({ stroke = 'currentColor', size = 14 }: { stroke?: string; size?: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h3l2-4 3 8 2-4h4" />
    </svg>
  );
}

function IconArrowRight(): ReactNode {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

function IconLaunch(): ReactNode {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Data                                                       */
/* ------------------------------------------------------------------ */
type SectionCard = {
  title: string;
  description: string;
  link: string;
  icon: ReactNode;
  /** Kept per-category (not tied to the brand accent) so the grid stays
   * quickly scannable -- only the icon stroke is tinted, the badge itself
   * is a neutral bordered square (see .sectionIcon). */
  iconColor: string;
};

const sections: SectionCard[] = [
  {
    title: 'Platform Overview',
    description: "Understand WSO2 Integrator's architecture, core concepts, and key capabilities.",
    link: '/platform-overview',
    icon: <IconPlatformOverview />,
    iconColor: '#059669',
  },
  {
    title: 'Editor Tour',
    description: 'Take a tour of the WSO2 Integrator editor -- workspace, canvases, and Copilot.',
    link: '/editor',
    icon: <IconEditorTour />,
    iconColor: '#DB2777',
  },
  {
    title: 'Develop and Test',
    description: 'Build services, transform data, and test integrations on your machine.',
    link: '/develop-and-test',
    icon: <IconDevelop />,
    iconColor: '#26365A',
  },
  {
    title: 'Deploy and Run',
    description: 'Deploy to WSO2 Cloud, connect a Git provider, and secure integrations in production.',
    link: '/deploy-and-run',
    icon: <IconDeploy />,
    iconColor: '#0891B2',
  },
  {
    title: 'Manage',
    description: 'Centralized control over integrations, environments, and access via the WSO2 Cloud console.',
    link: '/manage',
    icon: <IconManage />,
    iconColor: '#4F46E5',
  },
  {
    title: 'Observe',
    description: 'Monitor logs, metrics, and alerts for your integrations in WSO2 Cloud.',
    link: '/observe',
    icon: <IconObserve />,
    iconColor: '#0D9488',
  },
  {
    title: 'Migrate',
    description: 'Move existing MuleSoft, TIBCO BusinessWorks, and Azure Logic Apps integrations to WSO2.',
    link: '/migrate',
    icon: <IconMigrate />,
    iconColor: '#B45309',
  },
  {
    title: 'Guides',
    description: 'End-to-end tutorials and integration patterns.',
    link: '/guides/overview',
    icon: <IconTutorials />,
    iconColor: '#D97706',
  },
];

/* ------------------------------------------------------------------ */
/*  Quick-links shown when the search input is focused but empty       */
/* ------------------------------------------------------------------ */
const quickLinks = [
  { label: 'Build an Automation', sub: 'Scheduled and on-demand jobs', to: '/get-started/quickstarts/build-automation' },
  { label: 'Build an AI Agent', sub: 'Agents, RAG and MCP servers', to: '/get-started/quickstarts/build-ai-agent' },
  { label: 'Build an API Integration', sub: 'Services, proxies and gateways', to: '/get-started/quickstarts/build-integration-api' },
];

/* ------------------------------------------------------------------ */
/*  Central Search Bar                                                 */
/* ------------------------------------------------------------------ */
function SearchBar(): ReactNode {
  const history = useHistory();
  const searchPath = useBaseUrl('/search');
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (e.target as HTMLElement).tagName,
        )
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (query.trim()) {
        history.push(`${searchPath}?q=${encodeURIComponent(query.trim())}`);
        setFocused(false);
      }
    },
    [query, history, searchPath],
  );

  return (
    <div ref={wrapperRef} className={styles.searchWrapper}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <button type="submit" className={styles.searchIconButton} aria-label="Search">
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          aria-label="Search documentation"
        />
        <kbd className={styles.searchKbd}>/</kbd>
      </form>

      {/* Quick-links dropdown when focused and empty query */}
      {focused && !query && (
        <div className={styles.searchDropdown}>
          <p className={styles.searchDropdownLabel}>Popular pages</p>
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={styles.searchDropdownItem}
              onClick={() => setFocused(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cloud console screenshot -- the real WSO2 Cloud sign-in page,
 *  inside the same browser-chrome frame used across the hero. A raw
 *  flat screenshot (no rounding/shadow of its own baked in), so the
 *  chrome frame is what gives it presentation.
 * ------------------------------------------------------------------ */
function CloudConsoleScreenshot(): ReactNode {
  const src = useBaseUrl('/img/landing/wso2-integration-platform-sign-in.png');
  return (
    <div className={styles.productCard}>
      <div className={styles.productCardChrome}>
        <span className={styles.productCardDot} />
        <span className={styles.productCardDot} />
        <span className={styles.productCardDot} />
        <span className={styles.productCardTitle}>WSO2 Cloud Console</span>
      </div>
      <img src={src} alt="WSO2 Integration Platform sign-in page" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Banner — split layout: product-screenshot card (left) +      */
/*  badge/heading/search/CTA (right)                                  */
/* ------------------------------------------------------------------ */
function HomepageHeader(): ReactNode {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroInner}>
        <div className={styles.heroLeft}>
          <CloudConsoleScreenshot />
          <div className={styles.downloadRow}>
            <Link
              className={styles.downloadBtn}
              href="https://console.devant.dev/signup"
              target="_blank"
              rel="noopener noreferrer">
              <IconLaunch />
              Launch WSO2 Cloud
            </Link>
            <span className={styles.downloadCaption}>
              No installation required
              <br />
              Runs entirely in your browser
            </span>
          </div>
        </div>

        <div className={styles.heroRight}>
          <span className={styles.heroBadge}>
            <IconWave stroke="#FF8A3D" />
            Docs · WSO2 Cloud
          </span>
          <Heading as="h1">WSO2 Integration Platform</Heading>
          <p className={styles.heroSubtitle}>
            Build and deploy integrations with low-code simplicity and pro-code power.
          </p>
          <SearchBar />
          <div className={styles.buttons}>
            <Link
              className={styles.heroBtn}
              to="/get-started">
              Let's get started
              <IconArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  "What do you want to build?" — tutorial row                        */
/* ------------------------------------------------------------------ */
function TutorialRow(): ReactNode {
  return (
    <section className={styles.tutorialRow}>
      <Heading as="h2" className={styles.tutorialRowTitle}>
        What do you want to build?
      </Heading>
      <div className={styles.tutorialGrid}>
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to} className={styles.tutorialCard}>
            <span className={styles.tutorialCardText}>
              <span className={styles.tutorialCardTitle}>{link.label}</span>
              <span className={styles.tutorialCardSub}>{link.sub}</span>
            </span>
            <span className={styles.tutorialCardArrow}>
              <IconArrowRight />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Cards                                                      */
/* ------------------------------------------------------------------ */
function SectionCards(): ReactNode {
  return (
    <section className={styles.sectionCards}>
      <Heading as="h2" className={styles.sectionCardsTitle}>
        Explore the platform
      </Heading>
      <div className={styles.sectionGrid}>
        {sections.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className={styles.sectionCard}
            style={{ '--icon-color': card.iconColor } as React.CSSProperties}>
            <span className={styles.sectionIcon}>{card.icon}</span>
            <Heading as="h3" className={styles.sectionCardTitle}>
              {card.title}
            </Heading>
            <p className={styles.sectionCardDesc}>{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Home page                                                          */
/* ------------------------------------------------------------------ */
export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <TutorialRow />
        <SectionCards />
      </main>
    </Layout>
  );
}
