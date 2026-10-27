import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import LandingHero from '@site/src/components/LandingHero';
import HeroSearch from '@site/src/components/LandingHero/HeroSearch';

import styles from './index.module.css';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const quickLinks = [
  { label: 'Build an Automation', to: '/get-started/quickstarts/build-automation' },
  { label: 'Build an AI Agent', to: '/get-started/quickstarts/build-ai-agent' },
  { label: 'Build a Durable Workflow', to: '/get-started/quickstarts/build-durable-workflow' },
];

const steps = [
  { title: 'Set up', sub: <Link to="/get-started/setup">
            Install WSO2 Integrator <span aria-hidden="true">→</span>
          </Link> },
  { title: 'Pick a quickstart', sub: 'Choose a style below ↓', active: true },
  { title: 'Design the flow', sub: 'On the canvas or with Copilot' },
  { title: 'Run and deploy', sub: 'Test locally, then ship' },
];

type Quickstart = { title: string; description: string; to: string; icon: ReactNode };

const svgProps = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const quickstarts: Quickstart[] = [
  {
    title: 'Integration as API',
    description: 'Expose HTTP, GraphQL and gRPC services that orchestrate backends.',
    to: '/get-started/quickstarts/build-integration-api',
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />
      </svg>
    ),
  },
  {
    title: 'Event integration',
    description: 'React to messages from Kafka, RabbitMQ and other brokers.',
    to: '/get-started/quickstarts/build-event-driven-integration',
    icon: (
      <svg {...svgProps}>
        <path d="M13 3 5 13h6l-1 8 8-10h-6z" />
      </svg>
    ),
  },
  {
    title: 'File integration',
    description: 'Process files arriving over FTP, SFTP or local directories.',
    to: '/get-started/quickstarts/build-file-driven-integration',
    icon: (
      <svg {...svgProps}>
        <path d="M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    title: 'Automation',
    description: 'Run scheduled or manually triggered jobs and workflows.',
    to: '/get-started/quickstarts/build-automation',
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2.5M9 2h6" />
      </svg>
    ),
  },
  {
    title: 'AI agent',
    description: 'Give an LLM tools, memory and instructions to act on your systems.',
    to: '/get-started/quickstarts/build-ai-agent',
    icon: (
      <svg {...svgProps}>
        <rect x="5" y="8" width="14" height="11" rx="3" />
        <path d="M12 8V4M9.5 13v1M14.5 13v1M2 13v2M22 13v2" />
      </svg>
    ),
  },
  {
    title: 'Durable Workflows',
    description: 'Long running, crash-safe processes.',
    to: '/get-started/quickstarts/build-durable-workflow',
    icon: (
      <svg {...svgProps}>
        <path d="M12 3 5 6v6c0 5 3 7.5 7 9 4-1.5 7-4 7-9V6l-7-3z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

type LifecycleCard = { n: string; title: string; description: string; to: string; tone: string; icon: ReactNode };

const lcProps = { ...svgProps, width: 22, height: 22, strokeWidth: 1.9 };

const lifecycle: LifecycleCard[] = [
  {
    n: '01',
    title: 'Develop and Test',
    description: 'Create and test integrations using visual design, data transformation, developer tools, and debugging.',
    to: '/develop-and-test',
    tone: 'toneInk',
    icon: (
      <svg {...lcProps}>
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Deploy and Run',
    description: 'Deploy integrations to WSO2 Cloud, configure Git-based delivery, and secure production environments.',
    to: '/deploy-and-run',
    tone: 'toneBlue',
    icon: (
      <svg {...lcProps}>
        <path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.5a4.8 4.8 0 0 1-.5 9.5z" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Manage',
    description: 'Manage deployed integrations, projects, environments, configurations, user access, and platform services.',
    to: '/manage',
    tone: 'toneIndigo',
    icon: (
      <svg {...lcProps}>
        <path d="M6 4v16M12 4v16M18 4v16M4 9h4M10 15h4M16 7h4" />
      </svg>
    ),
  },
  {
    n: '04',
    title: 'Observe',
    description: 'Monitor runtime logs and metrics, diagnose issues, and configure anomaly detection and alerts.',
    to: '/observe',
    tone: 'toneTeal',
    icon: (
      <svg {...lcProps}>
        <path d="M4 17a8 8 0 0 1 16 0M12 17l3.5-5" />
      </svg>
    ),
  },
];

type UseCase = { dept: string; hook: string; title: string; to: string; icon: ReactNode };

/* Real guide docs already in this repo (en/docs/guides/business-use-cases/)
 * -- not placeholders. Curated subset (3 of 6 real use-case guides, the
 * same ones the design mockup marks `featured`) for a homepage teaser;
 * "See all business use cases" links to the full set. */
const useCases: UseCase[] = [
  {
    dept: 'Customer support',
    hook: "What if your support agent could check a customer's live order before replying?",
    title: 'Build a Customer Care Agent with MCP',
    to: '/guides/business-use-cases/building-a-customer-care-agent-mcp',
    icon: (
      <svg {...svgProps} width={20} height={20}>
        <path d="M4 5h16v11H8l-4 4zM8 9h8M8 12h5" />
      </svg>
    ),
  },
  {
    dept: 'Human resources',
    hook: 'What if every HR policy question got a sourced answer in seconds?',
    title: 'Building an HR Knowledge Base with RAG',
    to: '/guides/business-use-cases/building-hr-knowledge-base-rag',
    icon: (
      <svg {...svgProps} width={20} height={20}>
        <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11M9 8h6" />
      </svg>
    ),
  },
  {
    dept: 'Procurement',
    hook: 'What if purchase requests raised themselves before stock runs out?',
    title: 'Raise SAP Business One Purchase Requests for Low-Stock Items',
    to: '/guides/business-use-cases/sap-b1-low-stock-purchase-automation',
    icon: (
      <svg {...svgProps} width={20} height={20}>
        <path d="M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10" />
      </svg>
    ),
  },
];

/* AWS spotlight pills -- icon paths lifted from the design mockup
 * (landing-aws-business/LandingOneBar.dc.html). */
const awsPills: { label: string; icon: ReactNode }[] = [
  {
    label: 'Build',
    icon: (
      <svg {...svgProps} width={15} height={15} strokeWidth={1.9}>
        <path d="M14.5 4.5 19 9l-9.5 9.5H5V14z" />
      </svg>
    ),
  },
  {
    label: 'Deploy',
    icon: (
      <svg {...svgProps} width={15} height={15} strokeWidth={1.9}>
        <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
      </svg>
    ),
  },
  {
    label: 'Secure',
    icon: (
      <svg {...svgProps} width={15} height={15} strokeWidth={1.9}>
        <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />
      </svg>
    ),
  },
  {
    label: 'Observe',
    icon: (
      <svg {...svgProps} width={15} height={15} strokeWidth={1.9}>
        <path d="M3 12h4l3-7 4 14 3-7h4" />
      </svg>
    ),
  },
];

type WideTile = { title: string; description: string; to: string; tags: string[]; tone: string; icon: ReactNode };

const wideTiles: WideTile[] = [
  {
    title: 'Migrate',
    description: 'Migrate integrations from MuleSoft, TIBCO BusinessWorks, and Azure Logic Apps using migration tools.',
    to: '/migrate',
    tags: ['MuleSoft', 'TIBCO BusinessWorks', 'Azure Logic Apps'],
    tone: 'wideIconOrange',
    icon: (
      <svg {...svgProps} width={26} height={26} strokeWidth={1.9}>
        <path d="M4 8h14m0 0-3-3m3 3-3 3M20 16H6m0 0 3-3m-3 3 3 3" />
      </svg>
    ),
  },
  {
    title: 'Guides',
    description: 'Explore task-focused how-to guides, practical business use cases, and end-to-end tutorials.',
    to: '/guides/overview',
    tags: ['How-to guides', 'Use cases', 'Tutorials'],
    tone: 'wideIconGold',
    icon: (
      <svg {...svgProps} width={26} height={26} strokeWidth={1.8}>
        <path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3zM21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Hero -- the layout is the shared LandingHero component (synced from */
/*  main, and restyled on this branch to the warm/cream palette -- see  */
/*  LandingHero's own styles.module.css docstring); only the copy/links */
/*  below and the `search` slot content are this product's own. The     */
/*  screenshot is this branch's static/img/landing/hero.png.            */
/* ------------------------------------------------------------------ */
function HomepageHeader(): ReactNode {
  return (
    <LandingHero
      windowTitle="WSO2 Integrator"
      imageAlt="WSO2 Integrator showing an AI agent automation flow alongside the Copilot panel"
      eyebrow="WSO2 Integration Platform · Docs"
      title="WSO2 Integrator"
      subtitle="Build, connect, and run integrations, long-running workflows, MCP servers, and AI agents with built-in governance, and architectural freedom."
      search={<HeroSearch quickLinks={quickLinks} />}
      cta={{ label: "Let's get started", to: '/get-started' }}
      secondaryCta={{ label: 'Platform overview', to: '/platform-overview' }}
      footnote="Windows · macOS · Linux · 100% open source"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  AWS announcement pill -- rendered above the hero, NOT inside        */
/*  LandingHero itself: that component is wholesale-shared (synced      */
/*  from main via sync-theme.yaml), and its eyebrow prop is a plain     */
/*  string with no slot for a clickable badge. Adding one here keeps    */
/*  this entirely a per-branch change instead of needing a `main` PR    */
/*  just to add a temporary launch pill.                                */
/* ------------------------------------------------------------------ */
function AwsAnnouncementPill(): ReactNode {
  return (
    <div className={styles.awsPillWrap}>
      <Link to="/cloud-providers/aws" className={styles.awsPill}>
        <span className={styles.awsPillBadge}>NEW</span>
        Improved AWS support
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  New to WSO2 Integrator? — step strip + quickstart tiles            */
/* ------------------------------------------------------------------ */
function GetStarted(): ReactNode {
  return (
    <section className={styles.getStarted}>
      <div className={styles.getStartedHead}>
        <div className={styles.getStartedHeadText}>
          <Heading as="h2" className={styles.h2Large}>
            New to WSO2 Integrator?
          </Heading>
          <p className={styles.lead}>Build your first integration in four steps, starting with a quickstart.</p>
        </div>
        <div className={styles.headLinks}>
          <Link to="/get-started/concepts">
            Key concepts <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <ol className={styles.steps} aria-label="Steps">
        {steps.map((step, i) => (
          <li key={step.title} className={`${styles.step} ${step.active ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>{i + 1}</span>
            <span className={styles.stepText}>
              <strong>{step.title}</strong>
              <span>{step.sub}</span>
            </span>
          </li>
        ))}
      </ol>

      <Heading as="h3" className={styles.h3}>
        What do you want to build?
      </Heading>
      <p className={styles.sub}>Pick an integration style to start building.</p>
      <div className={styles.tileGrid}>
        {quickstarts.map((q) => (
          <Link key={q.title} to={q.to} className={styles.tile}>
            <span className={styles.tileIcon}>{q.icon}</span>
            <span className={styles.tileText}>
              <strong>{q.title}</strong>
              <span>{q.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Business use cases -- a 3-card teaser; "See all" links to the full */
/*  guide listing.                                                     */
/* ------------------------------------------------------------------ */
function BusinessUseCases(): ReactNode {
  return (
    <section className={styles.useCases} aria-labelledby="uc-title">
      <div>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDash} />
          Business use cases
        </span>
        <Heading as="h2" id="uc-title" className={styles.h2Large}>
          Solve real business problems, end to end
        </Heading>
        <p className={styles.lead}>
          Step-by-step guides that take a real scenario from idea to a running integration, with AI agents, RAG and no-code automations.
        </p>
      </div>
      <div className={styles.ucGrid}>
        {useCases.map((u) => (
          <Link key={u.to} to={u.to} className={styles.ucCard}>
            <span className={styles.ucDept}>
              <span className={styles.ucDeptIcon}>{u.icon}</span>
              <span className={styles.ucDeptLabel}>{u.dept}</span>
            </span>
            <span className={styles.ucHook}>{u.hook}</span>
            <span className={styles.ucFooter}>
              <span className={styles.ucTitle}>{u.title}</span>
              <span className={styles.ucSeeHow}>
                See how <span aria-hidden="true">→</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
      <div className={styles.ucSeeAllWrap}>
        <Link to="/guides/business-use-cases" className={styles.ucSeeAll}>
          See all business use cases <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  WSO2 Integrator on AWS -- slim dark spotlight band, links to the   */
/*  new /aws doc page.                                                 */
/* ------------------------------------------------------------------ */
function AwsSpotlight(): ReactNode {
  return (
    <section className={styles.awsSpotlightWrap} aria-labelledby="aws-title">
      <div className={styles.awsBand}>
        <div className={styles.awsBandHead}>
          <span className={styles.awsBandIcon} aria-hidden="true">
            <svg {...svgProps} width={28} height={28} stroke="#FF9A4D">
              <path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.5a4.8 4.8 0 0 1-.5 9.5z" />
            </svg>
          </span>
          <span className={styles.awsBandText}>
            <strong id="aws-title">WSO2 Integrator on AWS</strong>
            <span>Connect to AWS services, build AI on Bedrock, deploy to ECS, EKS or Lambda, secure it all with IAM roles, and observe how it runs.</span>
          </span>
        </div>
        <div className={styles.awsBandPills} aria-label="What's covered">
          {awsPills.map((p) => (
            <span key={p.label}>
              {p.icon}
              {p.label}
            </span>
          ))}
        </div>
        <Link to="/cloud-providers/aws" className={styles.awsBandCta}>
          Explore AWS support <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Explore the platform                                               */
/* ------------------------------------------------------------------ */
function Explore(): ReactNode {
  return (
    <section className={`${styles.cream} ${styles.explore}`}>
      <div className={styles.exploreInner}>
        <div>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDash} />
            Explore the platform
          </span>
          <Heading as="h2" className={styles.h2Xl}>
            Everything from design canvas to production
          </Heading>
        </div>

        <div className={styles.banner}>
          <Link to="/platform-overview" className={`${styles.bannerCol} ${styles.bannerColDivider}`}>
            <span className={styles.bannerIcon}>
              <svg {...svgProps} stroke="#7FD1A0">
                <path d="m12 3 9 5-9 5-9-5zM3 12.5l9 5 9-5M3 16.5l9 5 9-5" />
              </svg>
            </span>
            <strong className={styles.bannerTitle}>Platform Overview</strong>
            <span className={styles.bannerDesc}>
              Understand WSO2 Integrator's architecture, core concepts, and key capabilities.
            </span>
            <span className={styles.bannerCta}>
              Start here <span aria-hidden="true">→</span>
            </span>
          </Link>
          <Link to="/editor" className={styles.bannerCol}>
            <span className={styles.bannerIcon}>
              <svg {...svgProps} stroke="#F29BC6">
                <path d="m4 20 1-4L16 5l3 3L8 19zM13 20h7" />
              </svg>
            </span>
            <strong className={styles.bannerTitle}>Editor Tour</strong>
            <span className={styles.bannerDesc}>
              Explore the WSO2 Integrator workspace, views, canvases, designers, panels, and Copilot.
            </span>
            <span className={styles.bannerPills}>
              {['Flow Canvas', 'Copilot', 'Project View'].map((p) => (
                <span key={p}>{p}</span>
              ))}
            </span>
          </Link>
        </div>

        <div className={styles.lifecycle}>
          <div className={styles.lifecycleHead}>
            <strong>Integration lifecycle</strong>
            <span className={styles.lifecycleRule} aria-hidden="true" />
          </div>
          <ol className={styles.lifecycleGrid}>
            {lifecycle.map((c) => (
              <li key={c.n}>
                <Link to={c.to} className={`${styles.lcCard} ${styles[c.tone]}`}>
                  <span className={styles.lcTop}>
                    <span className={styles.lcIcon} aria-hidden="true">
                      {c.icon}
                    </span>
                    <span className={styles.lcNum}>{c.n}</span>
                  </span>
                  <strong>{c.title}</strong>
                  <span>{c.description}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.wideGrid}>
          {wideTiles.map((t) => (
            <Link key={t.title} to={t.to} className={styles.wideTile}>
              <span className={`${styles.wideIcon} ${styles[t.tone]}`} aria-hidden="true">
                {t.icon}
              </span>
              <span className={styles.wideBody}>
                <strong>{t.title}</strong>
                <span>{t.description}</span>
                <span className={styles.tags}>
                  {t.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </span>
              </span>
              <span className={styles.wideArrow} aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Home page                                                          */
/* ------------------------------------------------------------------ */
export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="Build, connect, and run integrations, long-running workflows, MCP servers, and AI agents with built-in governance, and architectural freedom.">
      <div className={styles.page}>
        <main>
          <AwsAnnouncementPill />
          <HomepageHeader />
          <GetStarted />
          <BusinessUseCases />
          <AwsSpotlight />
          <Explore />
        </main>
      </div>
    </Layout>
  );
}
