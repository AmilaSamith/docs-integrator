---
title: Deploy to WSO2 Cloud
---

# Deploy to WSO2 Cloud

WSO2 Cloud is a fully managed platform that builds and runs your integrations from a Git repository. There are four ways to get your integrations onto WSO2 Cloud, depending on where your work lives.

## Deploy

- **[Deploy from the editor](deploy-from-editor.md)** — Push a single integration or a whole project from the WSO2 Integrator editor.
- **[Import a project](import-project.md)** — Import a whole WSO2 Integrator project and configure all its integrations at once.
- **[Import an integration](import-integration.md)** — Import a single integration from an existing repository.
- **[Deploy from the cloud editor](deploy-from-cloud-editor.md)** — Build and deploy directly in the browser-based cloud editor, without installing anything locally.

Importing a project or integration connects it to a Git repository. From then on, every commit to the configured branch builds and deploys automatically, with no manual upload step. GitHub connects with one click; for Bitbucket, GitLab, or Azure DevOps, see [Connect a Git provider](connect-git-provider.md) first.

## Once you're deployed

- **[Managing configurations](managing-configurations.md)** — Externalize and manage runtime configuration values across environments.
- **[Troubleshoot deployment](troubleshoot-deployment.md)** — Diagnose issues that only appear once an integration is running on WSO2 Cloud.
