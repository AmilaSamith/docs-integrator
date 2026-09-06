import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useVersions } from '@docusaurus/plugin-content-docs/client';

export default function Versions(): ReactNode {
  const versions = useVersions(undefined);
  const current = versions.find((v) => v.name === 'current');
  const released = versions.filter((v) => v.name !== 'current');

  return (
    <Layout title="Versions" description="WSO2 Integrator documentation versions">
      <main className="container margin-vert--lg">
        <h1>Documentation versions</h1>

        {current && (
          <div className="margin-bottom--lg">
            <h3 id="current">Current</h3>
            <p>
              The latest documentation, tracking <code>wso2-integrator</code>&apos;s
              in-progress work toward the next release.
            </p>
            <ul>
              <li>
                <Link to={current.path}>{current.label}</Link>
              </li>
            </ul>
          </div>
        )}

        {released.length > 0 && (
          <div className="margin-bottom--lg">
            <h3 id="released">Released versions</h3>
            <p>Documentation as it stood at each release, frozen and unchanged since.</p>
            <ul>
              {released.map((version) => (
                <li key={version.name}>
                  <Link to={version.path}>{version.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </Layout>
  );
}
