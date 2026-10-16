import type { ReactNode } from 'react';
import { Redirect } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

/**
 * Keeps the pretty per-type paths (/guides/tutorials, /guides/how-to-guides,
 * /guides/business-use-cases) working after their landing pages were removed:
 * each one sends the visitor to its section of the searchable catalog on the
 * Guides page (/guides/overview#<section>). See GuidesCatalog's SECTIONS for
 * the anchor ids.
 *
 * <Redirect> only runs in the browser, so the page also renders a plain link
 * -- visitors and crawlers that don't execute JavaScript get a usable page
 * instead of a blank one.
 */
export default function GuideTypeRedirect({ title, anchor }: { title: string; anchor: string }): ReactNode {
  const to = `/guides/overview#${anchor}`;
  return (
    <Layout title={title} description={`${title} are listed on the Guides page.`}>
      <Redirect to={to} />
      <main className="container margin-vert--lg">
        <p>
          {title} are listed on the Guides page. <Link to={to}>Go to {title}</Link>.
        </p>
      </main>
    </Layout>
  );
}
