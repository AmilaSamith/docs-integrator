import React from 'react';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import PaletteIcon, { type PaletteIconName } from '@site/src/components/PaletteIcon';

/**
 * The .palette-card component (see "PALETTE CARDS" in src/css/custom.css)
 * as MDX-friendly building blocks.
 *
 * PaletteCard deliberately does NOT take a `title`/`description` prop --
 * write the heading and description as literal children instead, since
 * a heading passed as a JSX prop (e.g. `title="Views"`) can never appear
 * in Docusaurus's "On this page" TOC (that scan can't see inside a
 * custom component's props). Even as literal children, headings inside
 * a custom component are NOT reliably picked up by the TOC either --
 * so on a page where the "On this page" panel matters, don't rely on
 * these cards appearing there. For a landing/hub page where the cards
 * ARE the navigation, set `hide_table_of_contents: true` in that page's
 * frontmatter instead of fighting it.
 *
 *   <PaletteCard icon="connections">
 *     <h4 class="palette-card-title">Connections</h4>
 *     <p class="palette-card-desc">...</p>
 *     <div class="palette-chip-row">
 *       <PaletteChip href="...">Connection</PaletteChip>
 *     </div>
 *   </PaletteCard>
 */

export function PaletteGrid({ children }: { children: React.ReactNode }): React.ReactElement {
  return <div className="palette-grid">{children}</div>;
}

export function PaletteCard({
  icon,
  href,
  children,
}: {
  icon: PaletteIconName;
  /** Whole-card link -- only for a single-item category with no chips. */
  href?: string;
  children: React.ReactNode;
}): React.ReactElement {
  const content = (
    <>
      <PaletteIcon name={icon} />
      {children}
    </>
  );

  if (href) {
    const external = !isInternalUrl(href);
    // Internal hrefs MUST go through Link -- a plain <a href="/manage/..."> is
    // un-prefixed and only ever "worked" by accident while this site's own
    // baseUrl was "/"; now that it's "/integration-platform/docs/saas/" (and
    // "/integrator/" on the sibling branch these same shared-slug pages are
    // synced to), a raw <a> does a full-page nav straight to the un-prefixed
    // path and 404s. Link/useBaseUrl resolves against whatever baseUrl this
    // build actually has, so the exact same href is correct on every branch
    // with zero per-page changes. External hrefs keep the plain <a>, since
    // Link is for same-site client-side routing only.
    if (!external) {
      return (
        <Link className="palette-card" to={href}>
          {content}
        </Link>
      );
    }
    return (
      <a className="palette-card" href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <div className="palette-card">{content}</div>;
}

export function PaletteChip({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}): React.ReactElement {
  // Same internal-vs-external split as PaletteCard above, and for the same
  // reason -- see that block's comment.
  if (!isInternalUrl(href)) {
    return (
      <a className="palette-chip" href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className="palette-chip" to={href}>
      {children}
    </Link>
  );
}
