---
title: Actions
toc_max_heading_level: 4
---

# Actions

The `ballerinax/gcloud.pubsub` package exposes the following clients:

| Client | Purpose |
|--------|---------|
| [`Publisher`](#publisher) | Publishes messages to a Google Cloud Pub/Sub topic. |

For event-driven integration, see the [Trigger Reference](triggers.md).

---

## Publisher

Publishes messages to a Google Cloud Pub/Sub topic.

### Configuration

The `Publisher` is initialized with a topic name followed by the `PublisherConfiguration` fields. The topic name can be a topic ID (for example, `my-topic`), which is resolved against `projectId`, or a full resource name in the format `projects/{project-id}/topics/{topic-id}`.

`PublisherConfiguration` fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `projectId` | `string` | Required | Google Cloud project ID. |
| `credentials` | `Credentials` | `()` | Service account credentials. Set `credentialsPath` (path to the JSON key file) or `credentialsJson` (the JSON key content as a string). |
| `enableBatching` | `boolean` | `true` | Batch messages before sending them to Pub/Sub. |
| `batchSettings` | `BatchSettings` | `()` | Batching thresholds: `elementCountThreshold` (default `100` messages), `requestByteSizeThreshold` (default `1000000` bytes), and `delayThresholdMillis` (default `10` ms). |
| `enableMessageOrdering` | `boolean` | `false` | Enable message ordering using ordering keys. Must be `true` to publish messages with an `orderingKey`. |

### Initializing the client

```ballerina
import ballerinax/gcloud.pubsub;

configurable string projectId = ?;
configurable string topicName = ?;
configurable string gcpCredentialsFilePath = ?;

pubsub:Publisher publisher = check new (topicName,
    projectId = projectId,
    credentials = {credentialsPath: gcpCredentialsFilePath}
);
```

### Operations

#### Messaging

<details>
<summary>publish</summary>

<div>

Publishes a message to the configured Pub/Sub topic. The message `data` field is a `byte[]`, so convert other values to bytes (for example, with `.toBytes()`) before publishing.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `message` | `Message` | Yes | The message record containing `data` (`byte[]`), optional `attributes`, and optional `orderingKey`. |

Returns: `string|Error`

Sample code:

```ballerina
string messageId = check publisher->publish({
    data: "Hello from Ballerina!".toBytes(),
    attributes: {"source": "ballerina-app", "env": "production"}
});
```

Sample response:

```ballerina
"1234567890123456"
```

</div>

</details>

<details>
<summary>publishBatch</summary>

<div>

Publishes multiple messages to the configured Pub/Sub topic and returns their message IDs in the same order as the input messages.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `messages` | `Message[]` | Yes | The messages to publish. Each message's `data` field is a `byte[]`. |

Returns: `string[]|Error`

Sample code:

```ballerina
string[] messageIds = check publisher->publishBatch([
    {data: "Message 1".toBytes()},
    {data: "Message 2".toBytes(), attributes: {"source": "ballerina-app"}}
]);
```

Sample response:

```ballerina
["1234567890123456", "1234567890123457"]
```

</div>

</details>

<details>
<summary>close</summary>

<div>

Gracefully shuts down the publisher, flushing any pending batched messages and releasing all resources.

No parameters.

Returns: `Error?`

Sample code:

```ballerina
check publisher->close();
```

</div>

</details>
