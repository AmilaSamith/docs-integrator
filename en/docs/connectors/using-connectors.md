---
title: "Using Connectors"
description: "How connectors, connections, actions, and triggers come together in a real integration."
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Using Connectors

The [Overview](overview.md) introduces connectors, connections, actions, and triggers as concepts. This page shows how they come together in practice, once you've picked a connector from the [catalog](catalog/index.mdx).

## Create a connection

Before you can call a connector's actions, you need a connection: a named, reusable configuration holding the credentials and endpoint settings for the external service. You create one from the **Artifacts** view or directly from the node palette while building a flow.

<ThemedImage
    alt="Add Connection panel"
    sources={{
        light: useBaseUrl('/img/connectors/using-connectors/add-connection.png'),
        dark: useBaseUrl('/img/connectors/using-connectors/add-connection.png'),
    }}
/>

Fill in the connection initialization form with the connector's specific configuration, such as endpoints, API keys, or OAuth settings.

<ThemedImage
    alt="Connection initialization form"
    sources={{
        light: useBaseUrl('/img/connectors/using-connectors/init-connection.png'),
        dark: useBaseUrl('/img/connectors/using-connectors/init-connection.png'),
    }}
/>

See [Connections](../develop-and-test/integration-artifacts/supportive-artifacts/connections.md) for how to add, edit, and reuse connections across an integration, and the [node palette's connection section](../editor/canvases/flow-canvas/node-palette.md#connection) for adding one without leaving the flow you're building.

## Invoke an action

Once a connection exists, it appears in the node palette's **Connections** section. Expand the dropdown of the created connection to see its available actions.

<ThemedImage
    alt="A connection in the node palette's Connections section"
    sources={{
        light: useBaseUrl('/img/connectors/using-connectors/connection-node.png'),
        dark: useBaseUrl('/img/connectors/using-connectors/connection-node.png'),
    }}
/>

Select an action and configure its inputs the same way you would any other node.

<ThemedImage
    alt="Actions available on a connection"
    sources={{
        light: useBaseUrl('/img/connectors/using-connectors/connection-actions.png'),
        dark: useBaseUrl('/img/connectors/using-connectors/connection-actions.png'),
    }}
/>

See the [node palette's connection actions section](../editor/canvases/flow-canvas/node-palette.md#connection-actions) for the mechanics.

## Handle a trigger

Most connectors are action-only, but a select few (primarily databases, messaging systems, and file storage) also support triggers — inbound events the external service pushes into your integration. See [Kafka](../develop-and-test/integration-artifacts/event-driven-integration/kafka.md) and [CDC (MySQL)](../develop-and-test/integration-artifacts/event-driven-integration/cdc-mysql.md) for two worked examples of setting up a trigger-based flow.

## What's next

- [Overview](overview.md): Revisit the connector, connection, action, and trigger concepts
- [Connector catalog](catalog/index.mdx): Browse all available connectors
- [Build a connector](build-your-own/build-own.md): Create a custom connector for a service not in the catalog
