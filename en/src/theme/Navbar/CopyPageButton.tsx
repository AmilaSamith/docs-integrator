import type { ReactNode } from 'react';
import { useActiveDocContext } from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';
import MarkdownButton from '@site/src/theme/DocBreadcrumbs/MarkdownButton';

/**
 * Renders at the top of the article, beside the breadcrumb (see
 * theme/DocItem/Layout) -- kept in this file (not moved there, and not
 * rewritten to use useDoc(), which IS available at that call site) only
 * because `activeDoc` from useActiveDocContext is the same safe,
 * path-matched lookup already used elsewhere in the chrome (e.g.
 * SidebarProductHeader's VersionPill): `undefined` (not a throw) on a
 * non-doc page, since it only depends on global plugin data, not a
 * route-scoped provider. One fewer thing to get wrong by having two
 * different ways to ask "is there an active doc" in the codebase.
 */
export default function CopyPageButton(): ReactNode {
  const { activeDoc } = useActiveDocContext(undefined);
  const docsBaseUrl = useBaseUrl('/docs');

  if (!activeDoc) return null;
  return <MarkdownButton markdownUrl={`${docsBaseUrl}/${activeDoc.id}.md`} />;
}
