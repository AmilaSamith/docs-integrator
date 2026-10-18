import { useEffect, useRef, type ReactNode } from 'react';

import styles from './styles.module.css';

/**
 * Numbered-circle-with-connecting-line step list, from the "Page —
 * versioned product" design reference (ArticleOneBar.dc.html). Wraps a
 * run of literal `## Step N: ...` markdown headings (and their content)
 * -- NOT a <Step> sub-component that swallows each heading as a prop --
 * so every step stays a real heading in the page's MDX AST: TOC
 * extraction, the URL's #anchor, and the "On this page" sidebar's own
 * active-section highlight (custom.css's .table-of-contents__link
 * --active) all keep working exactly as they do for any other heading,
 * with no extra code. That highlight is the other half of "track
 * progress" -- the circles below are the in-article half.
 *
 * Globally registered (theme/MDXComponents) -- no import needed in a doc,
 * same as PaletteCard/CloudDocsLink. Usage:
 *
 *   <Steps>
 *
 *   ## Create the integration
 *   [content]
 *
 *   ## Add an automation artifact
 *   [content]
 *
 *   </Steps>
 *
 * Only `##` headings that are DIRECT children belong in the numbered
 * sequence -- a doc section that isn't itself a step (e.g. "Source
 * code", "Scheduling automations") goes outside the wrapper, not
 * between two step headings, or it gets numbered as if it were one.
 *
 * The connecting line's top/height are measured from the real rendered
 * first/last circle position (not guessed from font-size math) because
 * step content varies a lot in height (a one-line instruction vs. a
 * screenshot) -- a fixed-geometry CSS-only line would either stop short
 * of the last circle or run on past it. Re-measures on resize (images
 * loading, window resize, font load) via ResizeObserver, same pattern
 * CookieConsent/FloatingActions already use for their own live-measured
 * offset.
 */
export default function Steps({ children }: { children: ReactNode }): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return undefined;

    const update = () => {
      const headings = Array.from(container.querySelectorAll<HTMLElement>(`:scope > .${styles.content} > h2`));
      if (headings.length < 2) {
        line.style.display = 'none';
        return;
      }
      line.style.display = 'block';
      // Circle center = heading's own top edge + half the circle's
      // diameter (--steps-circle-size, defined alongside the circle
      // itself in styles.module.css so the two never drift apart).
      const circleRadius = parseFloat(getComputedStyle(container).getPropertyValue('--steps-circle-size')) / 2;
      const first = headings[0]!.offsetTop + circleRadius;
      const last = headings[headings.length - 1]!.offsetTop + circleRadius;
      line.style.top = `${first}px`;
      line.style.height = `${last - first}px`;
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    // Images inside steps (screenshots/GIFs) change layout once loaded,
    // after ResizeObserver's own initial callback already fired.
    container.querySelectorAll('img').forEach((img) => img.addEventListener('load', update));
    return () => {
      observer.disconnect();
      container.querySelectorAll('img').forEach((img) => img.removeEventListener('load', update));
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.steps}>
      {/* Not a child of .content below (see styles.module.css): that
          wrapper's own margin-left rule is meant for the markdown
          content, and would shift this line out from under the
          circles too if it applied here as well. */}
      <span ref={lineRef} className={styles.line} aria-hidden="true" />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
