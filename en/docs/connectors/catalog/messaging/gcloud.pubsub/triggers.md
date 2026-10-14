---
title: Triggers
---
# Triggers

The `ballerinax/gcloud.pubsub` connector supports event-driven message consumption through a streaming pull mechanism. When messages arrive on a Google Cloud Pub/Sub subscription, the listener receives them in real time and invokes your service's `onMessage` callback automatically.


Three components work together:

| Component | Role |
|-----------|------|
| `pubsub:Listener` | Connects to Google Cloud Pub/Sub and opens streaming pull connections to receive messages from subscriptions. |
| `pubsub:Service` | Defines the `onMessage` callback invoked for each received message. |
| `pubsub:Caller` | Provided to the callback to acknowledge (`ack`) or reject (`nack`) the received message. |
| `pubsub:Message` | The message payload passed to the `onMessage` callback, containing data, attributes, and metadata. |

For action-based record operations, see the [Action Reference](actions.md).

---

## Listener

The `gcloud.pubsub:Listener` establishes the connection and manages event subscriptions.

### Configuration

The listener supports the following connection strategies:

| Config Type | Description |
|-------------|-------------|
| `ListenerConfiguration` | Configuration for the Pub/Sub listener. Authenticates using GCP service account credentials. |

The listener is initialized with a subscription name followed by the `ListenerConfiguration` fields. The subscription name can be a subscription ID (for example, `my-subscription`), which is resolved against `projectId`, or a full resource name in the format `projects/{project-id}/subscriptions/{subscription-id}`.

`ListenerConfiguration` fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `projectId` | `string` | Required | Google Cloud project ID. |
| `credentials` | `Credentials` | `()` | Service account credentials. Set `credentialsPath` (path to the JSON key file) or `credentialsJson` (the JSON key content as a string). |

### Initializing the listener

**Initialize with service account credentials:**

```ballerina
import ballerinax/gcloud.pubsub;

configurable string projectId = ?;
configurable string subscriptionName = ?;
configurable string gcpCredentialsFilePath = ?;

listener pubsub:Listener pubsubListener = check new (subscriptionName,
    projectId = projectId,
    credentials = {credentialsPath: gcpCredentialsFilePath}
);
```



---

## Service

A `pubsub:Service` is a Ballerina service attached to a `pubsub:Listener`. It receives messages from the subscription configured on the listener and implements the `onMessage` callback to process incoming messages.


### Callback signatures

| Function | Signature | Description |
|----------|-----------|-------------|
| `onMessage` | `remote function onMessage(pubsub:Message message, pubsub:Caller caller) returns error?` | Invoked when a message is received from the subscription. Use the `Caller` to acknowledge or reject the message. |

:::note
Use `caller->ack()` to acknowledge successful processing, or `caller->nack()` to reject the message and request re-delivery.
:::

### Full usage example

```ballerina
import ballerina/log;
import ballerinax/gcloud.pubsub;

configurable string projectId = ?;
configurable string subscriptionName = ?;
configurable string gcpCredentialsFilePath = ?;

listener pubsub:Listener pubsubListener = check new (subscriptionName,
    projectId = projectId,
    credentials = {credentialsPath: gcpCredentialsFilePath}
);

service on pubsubListener {
    remote function onMessage(pubsub:Message message, pubsub:Caller caller) returns error? {
        // The message payload is delivered as bytes
        string data = check string:fromBytes(message.data);
        log:printInfo("Received message",
            messageId = message.messageId,
            data = data,
            attributes = message.attributes.toString()
        );
        // Acknowledge the message on successful processing
        check caller->ack();
    }
}
```

:::note
The subscription is set when initializing the `pubsub:Listener`. The package also defines an optional `@pubsub:ServiceConfig` annotation (of type `PubSubServiceConfig`, with a single `subscriptionName` field), but the listener does not use it to select the subscription.
:::

---

## Supporting types

### `Message`

| Field | Type | Description |
|-------|------|-------------|
| `messageId` | `string?` | The unique ID assigned by Pub/Sub when the message is published. |
| `data` | `byte[]` | The message payload as bytes. Use `string:fromBytes()` to convert text payloads. |
| `attributes` | `map<string>?` | Optional key-value attributes attached to the message. |
| `publishTime` | `time:Utc?` | The timestamp when the message was published by the server. |
| `orderingKey` | `string?` | The ordering key for message ordering, if set by the publisher. |

### `Credentials`

| Field | Type | Description |
|-------|------|-------------|
| `credentialsPath` | `string?` | File path to the GCP service account JSON key file. |
| `credentialsJson` | `string?` | The GCP service account JSON key content as a string. |
