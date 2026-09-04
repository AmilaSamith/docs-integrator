import * as fs from 'fs';
import * as path from 'path';

/**
 * Scans a connector directory for a versions.json file and returns hidden
 * sidebar entries for all versioned pages (non-latest versions).
 *
 * `connectorPath` is always the full physical path relative to `docs/`
 * (e.g. 'connectors/catalog/communication/twilio'), since this site's docs
 * plugin is scoped to `path: 'docs/connectors'`. The leading `connectors/`
 * segment is stripped from the emitted sidebar `id`s, which must be
 * relative to that scoped root, not the physical `docs/` directory.
 *
 * Usage in the sidebar:
 *   ...connectorVersionedDocs('connectors/catalog/communication/twilio')
 */
export function connectorVersionedDocs(connectorPath: string) {
  const docsDir = path.resolve(__dirname, '../../docs');
  const connectorDir = path.join(docsDir, connectorPath);
  const versionsFile = path.join(connectorDir, 'versions.json');
  const idPath = connectorPath.replace(/^connectors\//, '');

  if (!fs.existsSync(versionsFile)) return [];

  const { versions, latest, shared = [] } = JSON.parse(fs.readFileSync(versionsFile, 'utf-8'));
  const items: Array<{ type: 'doc'; id: string; className: string }> = [];

  for (const version of versions) {
    if (version === latest) continue;
    const versionDir = path.join(connectorDir, version);
    if (!fs.existsSync(versionDir)) continue;

    for (const file of fs.readdirSync(versionDir)) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
      const slug = file.replace(/\.mdx?$/, '');
      if (shared.includes(slug)) continue;
      items.push({
        type: 'doc',
        id: `${idPath}/${version}/${slug}`,
        className: 'hidden',
      });
    }
  }

  return items;
}
