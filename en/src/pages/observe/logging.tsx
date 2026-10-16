import type { ReactNode } from 'react';
import { Redirect } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

/**
 * Shared (synced) pages link to /observe/logging, which is what the logging
 * page is called on the wso2-integrator site. On saas that page is
 * /observe/runtime-logs, so send visitors there instead of a 404. Shared pages
 * can't be edited here -- the next content sync would overwrite the change.
 *
 * <Redirect> only runs in the browser, so the page also renders a plain link
 * for visitors and crawlers that don't execute JavaScript.
 */
export default function LoggingRedirect(): ReactNode {
  return (
    <Layout title="Runtime Logs" description="Runtime logs are at /observe/runtime-logs.">
      <Redirect to="/observe/runtime-logs" />
      <main className="container margin-vert--lg">
        <p>
          Logging is covered under runtime logs. <Link to="/observe/runtime-logs">Go to Runtime Logs</Link>.
        </p>
      </main>
    </Layout>
  );
}
