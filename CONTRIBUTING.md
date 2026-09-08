# Contributing to docs-integrator

This repo publishes three products from three branches onto one merged
site (`/integration-platform/docs/`, `/integrator/`, `/connectors/`):

| Branch | Product | Versioned? |
|---|---|---|
| `saas` | WSO2 Cloud | No |
| `wso2-integrator` | WSO2 Integrator (self-hosted) | Yes |
| `wso2-connectors` | Connectors catalog | No |

(`main` isn't a product branch — see [MAINTENANCE.md](MAINTENANCE.md)
for what it's for and how a change actually reaches production.)

A set of sections is genuinely hosting-model-agnostic and is **shared**:
authored once on `wso2-integrator`, then synced to `saas` by a bot PR.
Everything else is **independently authored** per branch. Getting a
change into the right place depends on which kind of content it is —
see [Section Ownership](#section-ownership) and the scenarios below.

## Golden Rules

1. **Never hand-edit shared content on `saas`.** `platform-overview/`,
   `editor/`, `develop/`, `test/`, `customize/`, `migrate/`, `guides/`,
   `get-started/concepts/core.md`, and `reference/appendix/glossary.md`
   are synced from `wso2-integrator`. A direct edit on `saas` gets
   silently reverted by the next sync — the CI guard
   (`shared-content-guard.yaml`) rejects such a PR outright. Send the
   PR to `wso2-integrator` instead.
2. **Hosting-model-specific content stays per-branch.** `deploy/`,
   `operate/`, `manage/`, the rest of `get-started/`, and the rest of
   `reference/` are authored independently on each branch — self-hosted
   deployment/ICP content on `wso2-integrator`, cloud console content on
   `saas`. Don't try to sync these; they're allowed to (and often must)
   say different things.
3. **Connector content lives only on `wso2-connectors`,** referenced by
   link from elsewhere, never duplicated onto another branch.
4. **A `NOTE:` comment marks intentional divergence.** A few files
   inside otherwise-synced folders (`editor/views/integration-view.md`,
   `editor/views/project-view.md`, `editor/integrator-app.md`) carry a
   deliberate saas-specific override, each marked with an inline
   `{/* NOTE: ... */}` comment. When reviewing a sync PR, if a diff
   removes one of these overrides (e.g. re-adding self-hosted-only
   deploy options), that's the sync clobbering the override — revert
   that hunk, don't accept it.
5. **Never push directly to `main`.** `main` isn't a product branch or
   a deploy target — it's the shared-theme/governance source of truth
   every product branch forks from and syncs out of. An unreviewed
   change there fans out everywhere. See
   [MAINTENANCE.md](MAINTENANCE.md) for the full branch/release model
   this fits into, including how staging and production actually work.

## Section Ownership

| Path | Branch | Owner |
|---|---|---|
| `en/docs/icp/` | `wso2-integrator` | ICP team (`@wso2/icp-team` — placeholder, needs a real team slug) |
| `en/docs/` (all) | `wso2-connectors` | Library team (`@wso2/library-team` — placeholder, needs a real team slug) |
| Everything else | all branches | Default maintainers (see `.github/CODEOWNERS` on each branch) |

## Contributor scenarios

### "I'm fixing/adding content for the next release"

First figure out what kind of content it is:

- **Shared** (see Golden Rule 1's list) → PR against `wso2-integrator`.
  It reaches `saas` automatically via a bot PR the next time
  `sync-content-to-saas.yaml` runs — you don't need to open a second PR.
- **Self-hosted-only** (`deploy/`, `operate/`, `manage/`, `get-started/`,
  `reference/` on `wso2-integrator`) → PR directly against
  `wso2-integrator`. Not synced anywhere.
- **Cloud-only** (`deploy/`, `manage/`, `get-started/`, `reference/` on
  `saas`) → PR directly against `saas`. Not synced anywhere.
- **Connector** → PR against `wso2-connectors`.

### "I'm backporting a fix to an already-released version"

Only applies to `wso2-integrator` (the only versioned branch). Edit the
frozen snapshot directly under `en/versioned_docs/version-X.Y.Z/...` —
versioned docs are point-in-time copies, they don't inherit fixes from
the current docs and aren't touched by the content sync (which only
watches `en/docs/`, not `en/versioned_docs/`). PR against
`wso2-integrator`.

### "This only applies to WSO2 Cloud"

PR directly against `saas`. If the content would also make sense for
self-hosted users, consider whether it actually belongs in a shared
section instead (PR against `wso2-integrator`) rather than duplicating
it by hand on both branches.

### "I'm cutting a new wso2-integrator release version"

A maintainer task, not a typical content PR:

1. On `wso2-integrator`, run `npm run docusaurus docs:version X.Y.Z`
   (from `en/`) to freeze the current `docs/` into
   `versioned_docs/version-X.Y.Z/` and `versioned_sidebars/`.
2. Commit the generated files and the updated `versions.json`.
3. The version pill above the sidebar and the `/versions` page pick up
   the new entry automatically — no further config needed.

## Local verification

`npm run preview:all` builds all three branches and merges them under
the real production path scheme so you can check cross-product
navigation and (on `wso2-integrator`) the version switcher before
relying on a real deploy. `npm run preview:all -- --dev` is a much
faster content-only check (three separate dev servers, no cross-product
links, no product/version pill accuracy — see the script's own header
comment for why).
