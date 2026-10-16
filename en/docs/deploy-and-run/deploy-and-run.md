---
sidebar_position: 0
title: Deploy and Run
description: Deploy WSO2 Integrator projects to WSO2 Cloud and secure integrations in production.
keywords: [wso2 integrator, wso2 cloud, deploy, security, overview]
slug: /deploy-and-run
hide_table_of_contents: true
wide_layout: true
---

# Deploy and Run

Once your integration is ready, this section covers how to ship it to WSO2 Cloud and secure it in production.

WSO2 Cloud runs your integrations on one of two data plane models: the shared **WSO2 Cloud data plane (CDP)** operated by WSO2, or a **private data plane (PDP)** dedicated to your organization. Deploying works the same way on both — the data plane determines where your integrations run, not how you deploy them. Setting up a private data plane is a separate, one-time infrastructure task.

<PaletteGrid>

<PaletteCard icon="cloud" href="/deploy-and-run/deploy-to-wso2-cloud">
  <h3 class="palette-card-title">Deploy Your Integration</h3>
  <ul class="palette-card-list">
    <li>Works the same on either data plane model</li>
    <li>Deploy from the editor or the cloud editor</li>
    <li>Connect a Git provider and deploy automatically on every commit</li>
    <li>Troubleshoot deployment</li>
  </ul>
</PaletteCard>

<PaletteCard icon="server" href="/deploy-and-run/deploy-on-private-data-plane">
  <h3 class="palette-card-title">Set up a Private Data Plane</h3>
  <ul class="palette-card-list">
    <li>Infrastructure requirements and system components</li>
    <li>Management models</li>
    <li>Security levels</li>
  </ul>
</PaletteCard>

<PaletteCard icon="security" href="/deploy-and-run/secure/keystore-truststore">
  <h3 class="palette-card-title">Secure Integrations</h3>
  <ul class="palette-card-list">
    <li>Authentication and keystores</li>
    <li>API security and rate limiting</li>
    <li>Secrets, encryption, and IP whitelisting</li>
    <li>Compliance considerations</li>
  </ul>
</PaletteCard>

</PaletteGrid>
