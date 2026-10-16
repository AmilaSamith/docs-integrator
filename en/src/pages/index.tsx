import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import LandingHero from '@site/src/components/LandingHero';
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

function IconArrowRight(): ReactNode {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M4 12h15M13 6l6 6-6 6" />
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
    description: 'Explore the WSO2 Integrator workspace, views, canvases, designers, panels, and Copilot.',
    link: '/editor',
    icon: <IconEditorTour />,
    iconColor: '#DB2777',
  },
  {
    title: 'Develop and Test',
    description: 'Create and test integrations using visual design, data transformation, developer tools, and debugging.',
    link: '/develop-and-test',
    icon: <IconDevelop />,
    iconColor: '#26365A',
  },
  {
    title: 'Deploy and Run',
    description: 'Deploy integrations to WSO2 Cloud, configure Git-based delivery, and secure production environments.',
    link: '/deploy-and-run',
    icon: <IconDeploy />,
    iconColor: '#0891B2',
  },
  {
    title: 'Manage',
    description: 'Manage deployed integrations, projects, environments, configurations, user access, and platform services.',
    link: '/manage',
    icon: <IconManage />,
    iconColor: '#4F46E5',
  },
  {
    title: 'Observe',
    description: 'Monitor runtime logs and metrics, diagnose issues, and configure anomaly detection and alerts.',
    link: '/observe',
    icon: <IconObserve />,
    iconColor: '#0D9488',
  },
  {
    title: 'Migrate',
    description: 'Migrate integrations from MuleSoft, TIBCO BusinessWorks, and Azure Logic Apps using migration tools.',
    link: '/migrate',
    icon: <IconMigrate />,
    iconColor: '#B45309',
  },
  {
    title: 'Guides',
    description: 'Explore task-focused how-to guides, business use cases, and end-to-end tutorials.',
    link: '/guides/overview',
    icon: <IconTutorials />,
    iconColor: '#D97706',
  },
];

/* ------------------------------------------------------------------ */
/*  Quick-links for the "What do you want to build?" row               */
/* ------------------------------------------------------------------ */
const quickLinks = [
  { label: 'Build an Automation', sub: 'Scheduled and on-demand jobs', to: '/get-started/quickstarts/build-automation' },
  { label: 'Build an AI Agent', sub: 'Agents, RAG and MCP servers', to: '/get-started/quickstarts/build-ai-agent' },
  { label: 'Build an Integration as API', sub: 'REST services backed by integration logic', to: '/get-started/quickstarts/build-integration-api' },
  { label: 'Build an Event-Driven Integration', sub: 'React to messages from a broker', to: '/get-started/quickstarts/build-event-driven-integration' },
  { label: 'Build a File-Driven Integration', sub: 'Watch files and process changes', to: '/get-started/quickstarts/build-file-driven-integration' },
  { label: 'Exposing a Service as MCP', sub: 'Make service operations available as MCP tools', to: '/develop-and-test/integration-artifacts/ai-integrations/mcp/exposing-as-mcp' },
];

/* ------------------------------------------------------------------ */
/*  Hero -- the layout is the shared LandingHero component (synced from */
/*  main); only the copy/links below are this product's own. The        */
/*  screenshot is this branch's static/img/landing/hero.png.            */
/* ------------------------------------------------------------------ */
function HomepageHeader(): ReactNode {
  return (
    <LandingHero
      windowTitle="WSO2 Cloud Console"
      imageAlt="Integration Platform on WSO2 Cloud"
      badge="Docs · WSO2 Integration Platform"
      title="Integration Platform on WSO2 Cloud (Saas)"
      subtitle="Build, deploy, and manage integrations at cloud speed."
      cta={{ label: "Let's Get Started", to: '/get-started' }}
      secondaryCta={{ label: 'Platform Overview', to: '/platform-overview' }}
      secondary={{
        prefix: 'Prefer to try it first?',
        label: 'Launch WSO2 Cloud',
        href: 'https://console.devant.dev/signup',
        icon: 'external',
      }}
      footnote="No installation · runs in your browser"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  "What do you want to build?" — tutorial row                        */
/* ------------------------------------------------------------------ */
function TutorialRow(): ReactNode {
  const quickLinkRows = Array.from(
    { length: Math.ceil(quickLinks.length / 3) },
    (_, rowIndex) => quickLinks.slice(rowIndex * 3, rowIndex * 3 + 3),
  );

  return (
    <section className={styles.tutorialRow}>
      <Heading as="h2" className={styles.tutorialRowTitle}>
        What do you want to build?
      </Heading>
      {quickLinkRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={styles.tutorialGrid}
          style={rowIndex > 0 ? { marginTop: 16 } : undefined}>
          {row.map((link) => (
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
      ))}
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
