---
title: Solace (JMS)
---

# Solace (JMS)

Solace (JMS) event integrations connect to a Solace PubSub+ broker through its standard JMS interface, using the generic `ballerinax/java.jms` connector rather than the Solace-specific JCSMP-based listener described in [Solace](solace.md). Choose JMS mode when you're migrating an existing JMS-based system onto Solace, when other consumers on the same destination expect JMS semantics (message types, JNDI-style connection factories, transacted sessions), or when you want a broker-agnostic listener that can later point at a different JMS provider.

## Creating a Solace (JMS) service

```ballerina
import ballerinax/java.jms;
import ballerina/log;

configurable string providerUrl = "smf://localhost:55555";
configurable string vpnName = "default";
configurable string username = "admin";
configurable string password = "admin";

listener jms:Listener solaceJmsListener = check new (
    connectionConfig = {
        initialContextFactory: "com.solacesystems.jndi.SolJNDIInitialContextFactory",
        providerUrl: providerUrl,
        connectionFactoryName: "ConnectionFactory",
        username: string `${username}@${vpnName}`,
        password: password
    },
    acknowledgementMode = jms:AUTO_ACKNOWLEDGE,
    consumerOptions = {
        destination: {
            'type: "queue",
            name: "test-queue"
        }
    }
);

service jms:Service on solaceJmsListener {

    remote function onMessage(jms:Message message) returns error? {
        if message is jms:TextMessage {
            log:printInfo("Message received", content = message.content);
        }
    }
}
```

## Listener configuration

The listener is built on the generic `ballerinax/java.jms` connector, configured with Solace's JMS/JNDI connection factory so it can reach a Solace PubSub+ broker over SMF.

`jms:MessageListenerConfigurations` fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `connectionConfig` | `jms:ConnectionConfiguration` | Required | JNDI connection details for the broker (see below) |
| `acknowledgementMode` | `jms:AcknowledgementMode` | `AUTO_ACKNOWLEDGE` | Session acknowledgement mode: `AUTO_ACKNOWLEDGE`, `CLIENT_ACKNOWLEDGE`, `DUPS_OK_ACKNOWLEDGE`, or `SESSION_TRANSACTED` |
| `consumerOptions` | `jms:ConsumerOptions` | — | Destination and subscription settings (see below) |

`jms:ConnectionConfiguration` fields, set for a Solace broker:

| Field | Type | Default | Description |
|---|---|---|---|
| `initialContextFactory` | `string` | Required | JNDI initial context factory class. For Solace, `com.solacesystems.jndi.SolJNDIInitialContextFactory` |
| `providerUrl` | `string` | Required | The broker's SMF connection URL, e.g. `smf://localhost:55555` (or `tcps://` for TLS) |
| `connectionFactoryName` | `string` | `"ConnectionFactory"` | Name of the JNDI-bound connection factory to look up |
| `username` | `string?` | — | Authentication principal. For Solace, combine the username and message VPN as `username@vpnName` |
| `password` | `string?` | — | Password for the authentication principal |
| `properties` | `map<string>` | `{}` | Additional JNDI environment properties passed to the initial context |

`jms:ConsumerOptions` fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `destination` | `jms:Destination` | — | The queue or topic to consume from, as `{ 'type: "queue"\|"topic", name: "<name>" }` |
| `'type` | `jms:ConsumerType` | `DEFAULT` | `DEFAULT` for a regular consumer, or `DURABLE`/`SHARED`/`SHARED_DURABLE` for topic subscriptions |
| `messageSelector` | `string` | `""` | SQL-92 message selector expression |
| `noLocal` | `boolean` | `false` | When `true`, suppresses delivery of messages published by the same connection |
| `subscriberName` | `string?` | — | Subscription name, required for durable topic subscriptions |

## Event handling

A Solace (JMS) service exposes a single remote function, `onMessage`, which is called for each message delivered on the configured destination:

```ballerina
remote function onMessage(jms:Message message) returns error?
```

`message` is a `jms:Message`, with the concrete shape depending on the JMS message type the sender used:

| Type | Payload field | Description |
|---|---|---|
| `jms:TextMessage` | `content` (`string`) | A text-bodied message |
| `jms:BytesMessage` | `content` (`byte[]`) | A binary-bodied message |
| `jms:MapMessage` | `content` (`map<anydata>`) | A name/value-pair message |

Every message also carries common JMS metadata such as `messageId`, `timestamp`, `correlationId`, `replyTo`, `destination`, `deliveryMode`, `redelivered`, `jmsType`, `expiration`, `deliveredTime`, `priority`, and `properties` (a `map` of application-defined properties).

When `acknowledgementMode` is `CLIENT_ACKNOWLEDGE` or `SESSION_TRANSACTED`, use a `jms:Caller` to acknowledge messages or commit/roll back the session:

```ballerina
remote function onMessage(jms:Message message, jms:Caller caller) returns error? {
    if message is jms:TextMessage {
        check processMessage(message.content);
        check caller->acknowledge(message);
    }
}
```

## What's next

- [Solace](solace.md) — connect to Solace using its native PubSub+ protocol instead
- [RabbitMQ](rabbitmq.md) — consume messages from RabbitMQ queues
- [Connections](../supportive-artifacts/connections.md) — reuse credentials across services
