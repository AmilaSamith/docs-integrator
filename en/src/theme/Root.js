import React, { useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import { Prism } from 'prism-react-renderer';
import FloatingActions from '@site/src/components/FloatingActions';
// Per-branch extension point, NOT in sync-theme.yaml's SHARED_PATHS --
// every branch keeps its own copy of src/theme-local/RootExtras.tsx
// forever (same as docusaurus.config.ts / pages/index.*), so a sync from
// here never touches it. Most branches' copy just returns null; a branch
// that needs to mount something globally (e.g. wso2-connectors'
// ConnectorSwitcher) does it there instead of importing it directly into
// this file, which would get silently wiped by the next sync since this
// file doesn't know that branch-specific component exists. See
// MAINTENANCE.md's "Shared theme & shared governance" section.
import RootExtras from '@site/src/theme-local/RootExtras';
import { CatalogProvider } from '@site/src/components/ConnectorCatalog/context';

// Make Prism available globally so extensions can reach it
(typeof global !== 'undefined' ? global : window).Prism = Prism;

Prism.languages.ballerina = {
  comment: [
    { pattern: /\/\/.*$/m, greedy: true },
    { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
  ],

  string: [
    { pattern: /`(?:[^\\`]|\\.)*`/, greedy: true },        // template strings
    { pattern: /"(?:[^\\"\r\n]|\\.)*"/, greedy: true },    // regular strings
  ],

  annotation: {
    pattern: /@(?:[\w.]+)/,
    alias: 'builtin',
  },

  // Module-qualified types: devant:BinaryDataLoader, twilio:Client, http:Listener
  'class-name': /\b[a-z]\w*:[A-Z]\w*\b/,

  // Standalone PascalCase user-defined types and records
  'type-name': {
    pattern: /\b[A-Z]\w*\b/,
    alias: 'class-name',
  },

  keyword: /\b(?:import|as|public|private|external|final|service|resource|function|object|record|annotation|type|typedesc|new|map|future|error|stream|table|transaction|from|on|returns|return|match|foreach|in|while|do|if|else|fork|worker|wait|start|flush|send|receive|check|checkpanic|trap|panic|fail|is|typeof|var|const|configurable|isolated|transactional|rollback|commit|retry|lock|enum|class|distinct|readonly|any|anydata|never|byte|int|float|boolean|string|decimal|json|xml|handle|xmlns|listener|client|let|where|select|limit|join|outer|order|by|ascending|descending|equals|conflict|version)\b/,

  boolean: /\b(?:true|false)\b/,

  nil: {
    pattern: /\(\s*\)/,
    alias: 'constant',
  },

  number: /\b0[xX][\da-fA-F]+\b|\b0[oO][0-7]+\b|\b0[bB][01]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[eE][+-]?\d+)?(?:d|f)?\b/,

  operator: /->|=>|::|\.\.\.?|[+\-*/%^&|~!=<>?:]+/,

  punctuation: /[{}[\];(),.:]/,
};

// Fix navbar active state for unified sidebar — only highlight the
// tab whose path matches the current URL.
const sectionPaths = [
  '/docs/get-started',
  '/docs/develop',
  '/docs/connectors',
  '/docs/genai',
  '/docs/tutorials',
  '/docs/deploy-operate',
  '/docs/reference',
];

// Map section paths to their sidebar label text for matching.
const sectionLabels = {
  '/docs/get-started': 'Get Started',
  '/docs/develop': 'Develop',
  '/docs/connectors': 'Connectors',
  '/docs/genai': 'GenAI',
  '/docs/tutorials': 'Tutorials',
  '/docs/deploy-operate': 'Deploy & Operate',
  '/docs/reference': 'Reference',
};

function useNavbarActiveState() {
  const { pathname } = useLocation();
  const prevSectionRef = useRef(null);

  useEffect(() => {
    // Update navbar active link highlights
    const links = document.querySelectorAll('.navbar__items .navbar__link');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || !sectionPaths.some((p) => href.startsWith(p))) return;
      const section = sectionPaths.find((p) => href.startsWith(p));
      if (section && pathname.startsWith(section)) {
        link.classList.add('navbar__link--active');
      } else {
        link.classList.remove('navbar__link--active');
      }
    });

    // Collapse non-active top-level sidebar categories when section changes
    const currentSection = sectionPaths.find((p) => pathname.startsWith(p));
    if (currentSection && currentSection !== prevSectionRef.current) {
      prevSectionRef.current = currentSection;
      // Small delay to let Docusaurus render the sidebar first
      requestAnimationFrame(() => {
        const topItems = document.querySelectorAll(
          '.theme-doc-sidebar-menu > .theme-doc-sidebar-item-category-level-1'
        );
        topItems.forEach((li) => {
          const labelEl = li.querySelector(
            ':scope > .menu__list-item-collapsible .menu__link'
          );
          const label = labelEl?.textContent?.trim();
          const isActive = label === sectionLabels[currentSection];
          const toggleBtn = li.querySelector(
            ':scope > .menu__list-item-collapsible .clean-btn'
          );
          const isCollapsed = li.classList.contains('menu__list-item--collapsed');

          if (!isActive && !isCollapsed && toggleBtn) {
            toggleBtn.click();
          } else if (isActive && isCollapsed && toggleBtn) {
            toggleBtn.click();
          }
        });
      });
    }
  }, [pathname]);
}

export default function Root({ children }) {
  useNavbarActiveState();
  return (
    <>
      {/* No GTM <noscript> fallback here -- deliberately removed, not an
          oversight. It was static markup with no gating mechanism: it
          would request googletagmanager.com/ns.html unconditionally on
          every page load, disclosing connection/request metadata to
          Google regardless of any consent choice, for an audience
          (JS-disabled visitors) that can never grant or deny consent in
          the first place since CookiePro's whole banner/preference-center
          UI is itself a JS widget. "Only emit it after consent" isn't
          achievable for this case -- there's no JS running to check
          consent state -- so removal was the only correct fix. GTM's
          normal (JS-enabled) path is unaffected; see sharedHeadTags'
          own docstring in themeConfig.ts for that half.

          No custom <CookieConsent /> mounted here anymore either -- that
          was a cosmetic banner (categories saved to localStorage) with no
          real script behind it to actually gate. sharedHeadTags' CookiePro
          script (the real consent management platform marketing uses on
          wso2.com) renders and owns its own banner/preference center now;
          CookiePro's own auto-injected floating icon is the reopen entry
          point, not a component that lived here. */}
      <CatalogProvider>
        {/* SiteNav (the homepage-only sidebar drawer + hamburger) is no longer
            mounted: the single-header landing page has no sidebar toggle.
            src/components/SiteNav is left in place, unused. */}
        {children}
        <FloatingActions />
        <RootExtras />
      </CatalogProvider>
    </>
  );
}
