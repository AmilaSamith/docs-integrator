---
connector: true
connector_name: "smpp"
title: "Actions"
description: "Full reference for the SMPP Client operations: submit, submitMulti, submitData, queryStatus, cancel, replace, and close, with parameters and sample code."
---

# Actions

The SMPP connector exposes the following clients:

Available clients:

| Client | Purpose |
|--------|---------|
| [`Client`](#client) | Submits, queries, cancels, and replaces messages against an SMSC |

For event-driven integration, see the [Trigger Reference](trigger-reference.md).

---

## Client

An SMPP client bound to an SMSC as `TRANSMITTER`, `RECEIVER`, or `TRANSCEIVER`, for issuing the submit-family operations as an active outbound session. The client binds once at initialization. It never rebinds automatically: if the session drops, every later operation fails with the `LINK_ABANDONED` failure mode, so close the client and create a new one.

### Configuration

The `host`, `systemId`, and `password` used to bind are required parameters of the client's initialization, ahead of the rest of the configuration below.

**`ClientConfig`**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `port` | <code>int</code> | <code>2775</code> | SMSC port |
| `systemType` | <code>string</code> | <code>""</code> | The optional SMPP `system_type` |
| `bindType` | <code>TRANSMITTER&#124;RECEIVER&#124;TRANSCEIVER</code> | <code>TRANSCEIVER</code> | The bind mode. `TRANSMITTER` and `TRANSCEIVER` can submit; `RECEIVER` cannot |
| `bindTimeout` | <code>decimal</code> | <code>60</code> | Maximum time, in seconds, the connect-and-bind handshake may take |
| `transactionTimeout` | <code>decimal</code> | <code>30</code> | How long a submit-family operation waits for the SMSC's response, in seconds |
| `enquireLinkInterval` | <code>decimal</code> | <code>60</code> | How often the client sends a keepalive `enquire_link` when the session is otherwise idle, in seconds |
| `secureSocket` | <code>SecureSocket&#124;InsecureSocket?</code> | <code>()</code> | Transport security. Absent means plaintext TCP |

### Initializing the client

```ballerina
import ballerina/smpp;

smpp:Client smppClient = check new ("smsc.example.com", systemId, password,
        port = 2775, bindType = smpp:TRANSMITTER);
```

With TLS:

```ballerina
smpp:Client smppClient = check new ("smsc.example.com", systemId, password,
        port = 3550,
        secureSocket = {
            cert: {path: "./truststore.p12", password: trustStorePass}
        });
```

### Operations

#### Submit

<details>
<summary>submit</summary>

<div>

Submits a message to the SMSC (`submit_sm`) and waits for the response. Requires `bindType: TRANSMITTER` or `TRANSCEIVER`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sms` | <code>TextSms&#124;BinarySms</code> | Yes | The message to send: a `TextSms` (the client encodes it) or a `BinarySms` (pre-encoded octets). If `sourceAddress` is omitted, no source address (a NULL address) is sent; a `Client` has no default sender to fall back to |

**Returns:** `SubmitResult|smpp:Error`

**Sample code:**

```ballerina
smpp:SubmitResult|smpp:Error result = smppClient->submit({
    destinationAddress: "94771234567",
    shortMessage: "Hello from Ballerina!",
    registeredDelivery: smpp:ON_SUCCESS_OR_FAILURE
});
if result is smpp:SubmitResult {
    // Correlate later delivery receipts against result.messageId.
}
```

</div>
</details>

<details>
<summary>submitMulti</summary>

<div>

Submits one message to several destinations in a single `submit_multi` request. Requires `bindType: TRANSMITTER` or `TRANSCEIVER`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sms` | <code>TextSms&#124;BinarySms</code> | Yes | The message to send; `sms.destinationAddress` is not used |
| `destinationAddresses` | <code>string[]</code> | Yes | The recipient addresses for this batch; must contain at least one |

**Returns:** `MultiSubmitResult|smpp:Error`

**Sample code:**

```ballerina
smpp:MultiSubmitResult result = check smppClient->submitMulti(
    {destinationAddress: "", shortMessage: "Flash sale ends tonight!"},
    ["94771234567", "94777654321"]
);
```

</div>
</details>

<details>
<summary>submitData</summary>

<div>

Submits a message via `data_sm` instead of `submit_sm`, the alternative MT transfer PDU some SMSCs prefer for binary/WAP-push payloads. Requires `bindType: TRANSMITTER` or `TRANSCEIVER`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `data` | <code>TextSms&#124;BinarySms</code> | Yes | The message to send. The payload travels in the `message_payload` TLV, so it can be up to 65535 octets; `validityPeriod` is validated but not sent, since `data_sm` has no such field |

**Returns:** `SubmitResult|smpp:Error`

**Sample code:**

```ballerina
smpp:SubmitResult result = check smppClient->submitData({
    destinationAddress: "94771234567",
    shortMessageBytes: payloadBytes,
    dataCoding: 0
});
```

</div>
</details>

#### Query, cancel, and replace

<details>
<summary>queryStatus</summary>

<div>

Queries the SMSC's current view of a previously submitted message's delivery state (`query_sm`). Requires `bindType: TRANSMITTER` or `TRANSCEIVER`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `messageId` | <code>string</code> | Yes | The SMSC's `message_id` for the message, as returned by `submit`/`submitMulti`/`submitData` |
| `sourceAddress` | <code>string</code> | Yes | The message's original source address. An empty string is sent as a NULL address (use it for a message submitted without a source address) |

**Returns:** `QueryResult|smpp:Error`

**Sample code:**

```ballerina
smpp:QueryResult status = check smppClient->queryStatus(messageId, "94771234567");
```

</div>
</details>

<details>
<summary>cancel</summary>

<div>

Cancels a previously submitted, not-yet-delivered message (`cancel_sm`). Requires `bindType: TRANSMITTER` or `TRANSCEIVER`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `messageId` | <code>string</code> | Yes | The SMSC's `message_id` for the message to cancel |
| `sourceAddress` | <code>string</code> | Yes | The message's original source address. An empty string is sent as a NULL address |
| `destinationAddress` | <code>string</code> | Yes | The message's original destination address |

**Returns:** `smpp:Error?`

**Sample code:**

```ballerina
check smppClient->cancel(messageId, "94771234567", "94771234567");
```

</div>
</details>

<details>
<summary>replace</summary>

<div>

Replaces the text/attributes of a previously submitted, not-yet-delivered message (`replace_sm`). Requires `bindType: TRANSMITTER` or `TRANSCEIVER`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `messageId` | <code>string</code> | Yes | The SMSC's `message_id` for the message to replace |
| `sourceAddress` | <code>string</code> | Yes | The message's original source address. An empty string is sent as a NULL address |
| `sms` | <code>TextSms&#124;BinarySms</code> | Yes | The replacement content. Only the message body, `registeredDelivery`, and `validityPeriod` are sent; `destinationAddress`, `serviceType`, `dataCoding`, and `udhi` are accepted but ignored |

**Returns:** `smpp:Error?`

**Sample code:**

```ballerina
check smppClient->replace(messageId, "94771234567",
        {destinationAddress: "94771234567", shortMessage: "Updated text"});
```

</div>
</details>

#### Connection lifecycle

<details>
<summary>close</summary>

<div>

Unbinds and releases the underlying SMSC session. Idempotent: closing an already-closed client is a no-op. A closed client cannot be reused; create a new one.

**Parameters:**

No parameters

**Returns:** `smpp:Error?`

**Sample code:**

```ballerina
check smppClient.close();
```

</div>
</details>

## Supporting types

The records below are what the client operations take and return.

### TextSms

A text message; the client encodes `shortMessage` and sets the matching `data_coding`.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `destinationAddress` | <code>string&#124;Address</code> | Required | Recipient. A plain `string` is an international ISDN address, without a leading `+` |
| `sourceAddress` | <code>string&#124;Address?</code> | <code>()</code> | Sender. Omitted means no source address is sent |
| `registeredDelivery` | <code>NONE&#124;ON_SUCCESS_OR_FAILURE&#124;ON_FAILURE_ONLY</code> | <code>NONE</code> | Whether the SMSC should return a delivery receipt, which arrives later at a listener's `onDeliverSm` |
| `serviceType` | <code>string</code> | <code>""</code> | SMPP `service_type`; empty means the SMSC's default service |
| `validityPeriod` | <code>string?</code> | <code>()</code> | How long the SMSC keeps trying, as a 16-character SMPP time string (for example, `000000020000000R` for 2 hours) |
| `shortMessage` | <code>string</code> | Required | The message text; must not be empty |
| `encoding` | <code>ASCII&#124;LATIN1&#124;UCS2</code> | <code>LATIN1</code> | How `shortMessage` is encoded (`data_coding` `0x01`, `0x03`, or `0x08`). The GSM 7-bit default alphabet is not available for sending; use a `BinarySms` with `dataCoding: 0` instead |

### BinarySms

A pre-encoded payload, sent verbatim. Shares `destinationAddress`, `sourceAddress`, `registeredDelivery`, `serviceType`, and `validityPeriod` with `TextSms`, plus:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `shortMessageBytes` | <code>byte[]</code> | Required | The payload octets; must not be empty |
| `dataCoding` | <code>int</code> | Required | The raw `data_coding` byte (0-255) describing the payload |
| `udhi` | <code>boolean</code> | <code>false</code> | Sets the UDHI bit, declaring that `shortMessageBytes` starts with a User Data Header |

### Address

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `value` | <code>string</code> | Required | The address digits or alphanumeric sender ID |
| `typeOfNumber` | <code>TypeOfNumber</code> | <code>TON_INTERNATIONAL</code> | Type of number, for example `TON_ALPHANUMERIC` for a sender ID or `TON_ABBREVIATED` for a short code |
| `numberingPlanIndicator` | <code>NumberingPlanIndicator</code> | <code>NPI_ISDN</code> | Numbering plan indicator |

### Results

| Record | Field | Type | Description |
|--------|-------|------|-------------|
| `SubmitResult` | `messageId` | <code>string</code> | The SMSC's `message_id`; correlate delivery receipts against it |
| `MultiSubmitResult` | `messageId` | <code>string</code> | The SMSC's `message_id` for the batch |
| `MultiSubmitResult` | `unsuccessfulAddresses` | <code>string[]</code> | Destinations the SMSC could not accept; empty when all were accepted |
| `QueryResult` | `messageState` | <code>DeliveryReceiptStatus</code> | The message's current state, for example `ENROUTE`, `DELIVRD`, or `UNDELIV` |
| `QueryResult` | `finalDate` | <code>string?</code> | When the message reached a final state (`yyMMddHHmm`), or `()` if it has not |
| `QueryResult` | `errorCode` | <code>int</code> | SMSC/network-specific error code; `0` when there is none |

### Error

Every operation returns `smpp:Error` on failure. Its detail record carries the following optional fields, populated for submit-family failures:

| Field | Type | Description |
|-------|------|-------------|
| `failureMode` | <code>FailureMode?</code> | Why the operation failed: `REJECTED`, `TIMEOUT_DELIVERY_UNKNOWN`, `LINK_DOWN`, `LINK_ABANDONED`, `INVALID_REQUEST`, or `PROTOCOL_ERROR` |
| `commandStatus` | <code>int?</code> | The SMPP `command_status` from a negative response, when `failureMode` is `REJECTED` |
| `possiblySubmitted` | <code>boolean?</code> | `true` when the SMSC may already have accepted the message, so a retry may deliver a duplicate |

```ballerina
smpp:SubmitResult|smpp:Error result = smppClient->submit(sms);
if result is smpp:Error && result.detail().possiblySubmitted == false {
    // Safe to retry: the message cannot have reached the SMSC.
}
```

### SecureSocket

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `cert` | <code>crypto:TrustStore&#124;string</code> | Required | Truststore, or path to a PEM CA certificate, used to verify the SMSC's certificate |
| `key` | <code>crypto:KeyStore?</code> | <code>()</code> | Client keystore for mutual TLS |
| `protocolVersions` | <code>string[]</code> | <code>["TLSv1.3", "TLSv1.2"]</code> | Enabled TLS versions; only `TLSv1.2` and `TLSv1.3` are allowed |
| `ciphers` | <code>string[]</code> | <code>[]</code> | Enabled cipher suites; empty uses the JDK defaults |
| `verifyHostName` | <code>boolean</code> | <code>true</code> | Whether the certificate must match the configured host |

For a local or self-signed test SMSC only, pass `{disableSslVerification: true}` (an `InsecureSocket`) instead; it encrypts the connection but accepts any certificate.
