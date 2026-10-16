import type { ReactNode } from 'react';
import { Redirect } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

/**
 * The setup page moved from /get-started/cloud-setup to /get-started/setup,
 * so it matches the path the shared (synced) pages and the wso2-integrator
 * docs link to. Links to the old route -- including cross-product links from
 * the wso2-integrator site -- keep working through this redirect.
 *
 * <Redirect> only runs in the browser, so the page also renders a plain link
 * for visitors and crawlers that don't execute JavaScript.
 */
export default function CloudSetupRedirect(): ReactNode {
  return (
    <Layout title="Setup" description="The setup page is at /get-started/setup.">
      <Redirect to="/get-started/setup" />
      <main className="container margin-vert--lg">
        <p>
          The setup page has moved. <Link to="/get-started/setup">Go to Setup</Link>.
        </p>
      </main>
    </Layout>
  );
}
