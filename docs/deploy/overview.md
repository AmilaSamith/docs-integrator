---
title: Deploy Overview
---

{/* TODO: Work in progress */}

# Deploy and Operate

Once your integration is ready, this section covers everything you need to ship it, keep it running, and operate it in production.

## Deployment options

WSO2 Integrator supports multiple deployment targets. Choose the one that fits your infrastructure:

- **[WSO2 Cloud](deploy-to-cloud-overview.md)** — Push your project directly from the IDE or the cloud editor to the managed WSO2 Integration Platform. No infrastructure setup required.
- **[Serverless deployment](serverless-deployment.md)** — Run integrations as serverless functions.
- **[GraalVM native images](graalvm-native-images.md)** — Compile your integration to a native binary for faster startup and lower memory usage.

## Configuration and scaling

- **[Managing configurations](managing-configurations.md)** — Externalize and manage runtime configuration values.
- **[Scaling and high availability](scaling-high-availability.md)** — Design your deployment for resilience and scale.
- **[Capacity planning](capacity-planning/overview.md)** — Estimate resource requirements and plan deployment sizing.

## CI/CD

Automate your deployment pipeline using your preferred CI/CD platform:

- [GitHub Actions](cicd/github-actions.md)
- [Jenkins](cicd/jenkins.md)
- [GitLab](cicd/gitlab.md)
- [Azure DevOps](cicd/azure-devops.md)

## Observability

Monitor your integrations in production with logs, metrics, and traces:

- **[Observability overview](../operate/observability-overview.md)** — Understand the observability model.
- **[Logging overview](../operate/logging-overview.md)** — Capture and query structured log output.
- **[Metrics overview](../operate/metrics-overview.md)** — Emit application-level metrics.
- **[Prometheus and Grafana](../operate/metrics-prometheus-grafana.md)** — Scrape metrics and build dashboards.
- **[Jaeger](../operate/jaeger-distributed-tracing.md)** and **[Zipkin](../operate/zipkin-tracing.md)** tracing — Distributed request tracing.
- **[Datadog](../operate/datadog-integration.md)**, **[New Relic](../operate/new-relic-integration.md)**, **[Elastic Stack (ELK)](../operate/elastic-stack-elk.md)**, **[OpenSearch](../operate/opensearch-integration.md)**, **[Moesif](../operate/moesif-api-analytics.md)** — Third-party observability platforms.

## Security

Protect your integrations and the data they process:

- **[Runtime security](secure/runtime-security.md)** — Harden the runtime environment.
- **[Authentication](secure/authentication.md)** — Secure service endpoints.
- **[API security and rate limiting](secure/api-security-rate-limiting.md)** — Enforce access policies.
- **[Secrets and encryption](secure/secrets-encryption.md)** — Manage sensitive credentials safely.
- **[Compliance considerations](secure/compliance-considerations.md)** — Meet regulatory and audit requirements.
