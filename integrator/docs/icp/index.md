---
title: Integration Control Plane
---

# Integration Control Plane

The Integration Control Plane (ICP) is a centralized monitoring and management server for WSO2 Integrator deployments. It provides a web dashboard and APIs for real-time visibility into running integrations, and is used to monitor, manage, and troubleshoot them.

## Overview

The ICP provides a single pane of glass for all your deployed integrations, regardless of whether they run on Kubernetes, VMs, or WSO2 Devant. It collects runtime data from connected integration nodes and presents it through a web-based dashboard and a GraphQL API.

Key capabilities:

- **Service inventory** -- View all running integrations, their versions, and deployment status
- **Real-time monitoring** -- Observe request rates, error rates, and latency for each service
- **Log aggregation** -- View logs from connected integrations without accessing individual nodes
- **Configuration management** -- Inspect and update runtime configuration
- **Health status** -- See the health of each instance
- **Deployment history** -- Track when services were deployed or updated

## Components

| Component | Description |
|-----------|-------------|
| **ICP Server** | Ballerina-based backend that hosts the GraphQL API, auth service, and observability endpoints |
| **ICP Dashboard** | React and TypeScript web UI served at port `9446`, bundled into the distribution |
| **Database** | Persistent store for integration metadata. Supports MySQL, PostgreSQL, MSSQL, and H2. |

## Integration profiles

ICP supports two integration profiles that determine the type of runtime that connects to an integration:

| Profile | Runtime | Description |
|---------|---------|-------------|
| **Default profile** | Ballerina | A Ballerina-based integration. This is the default for all new integrations created in ICP. |
| **MI profile** | Micro Integrator | A WSO2 Micro Integrator-based integration for connecting existing MI deployments. |

The profile is set when the integration is created and cannot be changed later. Runtimes connect to ICP using the bridge library that corresponds to their profile type.

:::info Supported MI versions
The MI profile in ICP 2.0.0 supports WSO2 Micro Integrator 4.6.0 and later. Earlier MI versions cannot connect to ICP 2.0.0. If you are using an older MI version, download the compatible ICP release from [ICP previous releases](https://wso2.com/integrator/icp/previous-releases/).

## Configuring the integration node with ICP

ICP allows you to connect Ballerina and MI runtimes to the ICP server for centralized management and monitoring.
This guide will walk you through the steps to connect your integration runtime to the ICP server.

1. Navigate to the home view of WSO2 Integrator.
2. Select the **Enable ICP monitoring** checkbox under the **Integration Control Plane** section.

   ![ICP Enable Checkbox](/img/deploy-operate/observe/icp-enable.png)

3. Enabling ICP monitoring will generate and add the following configurations to your runtime.

```toml
[wso2.icp.runtime.bridge]
environment = "dev"
project = "<project name>"
integration = "<integration name>"
runtime = "<unique id for the runtime>"
secret = "<your-secret-here>"
# serverUrl="https://<hostname>:9445"
```

Remote management will be enabled in the `Ballerina.toml` file.

```toml
[build-options]
remoteManagement = true
```

The `wso2.icp.runtime.bridge` package will be imported into the integration entrypoint.

```ballerina
import wso2/icp.runtime.bridge as _;
```

4. Click the **View in ICP** button to start and connect the integration runtime to the ICP server.
5. The ICP server will start on `https://localhost:9446`.

## Browsing the ICP

1. Navigate to `https://localhost:9446` in your browser.
2. Enter the default username (`admin`) and password (`admin`), then click the **Sign In** button.

   :::caution Security Recommendation
   Default credentials must be changed before using ICP in production. Update the admin password account through **Profile > Change Password** in the ICP dashboard.
   :::

3. The project will be displayed on the **Home** page of the ICP dashboard.

   ![ICP Projects Dashboard](/img/deploy-operate/observe/icp-projects.png)

4. Click on the project to view the integrations.

   ![ICP Integrations View](/img/deploy-operate/observe/icp-integrations.png)

5. Click on an integration to view integration artifacts.

   ![ICP Integration Artifacts](/img/deploy-operate/observe/icp-artifacts.png)

## Default ports

| Port | Protocol | Description |
|------|----------|-------------|
| `9446` | HTTPS | All ICP Server endpoints: GraphQL, auth, and observability |
| `9445` | HTTPS | Runtime communication. Integration runtimes connect here to register and send heartbeats. |

## Endpoints

| Path | Description |
|------|-------------|
| `https://<host>:9446/graphql` | GraphQL API |
| `https://<host>:9446/auth` | Authentication API for login and token refresh |
| `https://<host>:9446/icp/observability` | Observability REST API |

See [ICP Runtime API](runtime-api.md) for the full REST endpoint reference.

## What's next

- [Get started with ICP](quick-start.md) — connect a runtime and enable observability end to end
- [Install ICP](install-icp.md) — download and configure ICP for your environment
- [ICP console overview](icp-console-overview.md) — understand the console layout and navigation
- [Manage Workflows](manage-workflows/manage-workflows.md) — start, follow, and complete durable workflow runs from the console
- [Observability Setup](observability-setup.md) — set up centralized logs and metrics monitoring
- [Logging](../observe/logging.md) — configure structured logging
- [Metrics](../observe/metrics.md) — Prometheus metrics and Grafana dashboards
