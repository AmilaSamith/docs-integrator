import React from 'react';
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
    return (
      <a
        className="palette-card"
        href={href}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
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
  return (
    <a className="palette-chip" href={href}>
      {children}
    </a>
  );
}
