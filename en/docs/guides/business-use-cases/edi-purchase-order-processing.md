---
sidebar_position: 7
title: "Process Inbound EDI Purchase Orders from Trading Partners"
sidebar_label: "Process Inbound EDI Purchase Orders"
description: Build an SFTP-driven integration that picks up EDIFACT purchase orders from a trading partner, identifies the sender from the envelope headers, and parses each order into typed records, quarantining any message it cannot read.
keywords: [wso2 integrator, edi, edifact, x12, purchase order, orders, trading partner, envelope, interchange, sftp, b2b, use case, low-code]
slug: /guides/business-use-cases/edi-purchase-order-processing
card_icon: edi
card_summary: An SFTP-driven integration that routes EDI purchase orders by trading partner and parses them into typed records
card_keywords: [edi, edifact, b2b, sftp, purchase order]
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Process Inbound EDI Purchase Orders from Trading Partners

**Time:** About 40 minutes | **What you'll build:** An integration that picks up EDI purchase orders a trading partner drops on an SFTP server, identifies the sender from the envelope, and parses each order into typed Ballerina records, without losing the whole batch to one malformed message.

Trading partners send purchase orders as EDI files, usually by dropping them in an SFTP mailbox. Two things have to happen before any business logic runs: work out who sent the file, and turn the orders inside it into data the integration can use. This guide builds them in that order. The first needs no schema at all, and the second needs one that matches what the partner actually sends.

**Sample project:** [edi-purchase-order-processing](https://github.com/wso2/integration-samples/tree/main/integrator-default-profile/samples/edi-purchase-order-processing) is the finished project, ready to run.

## How it works

```text
/edi/inbox/*.edi ──▶ read the envelope headers ──▶ known partner? ──┬── no  ──▶ file moved to /edi/rejected
                     (no schema needed)                             │
                                                                    └── yes ──▶ parse the interchange ──┬──▶ orders processed
                                                                               (generated library)      └──▶ malformed messages quarantined
                                                                                                         file moved to /edi/processed
```

An EDI file is an *interchange*: an envelope (`UNB`/`UNZ` in EDIFACT, `ISA`/`IEA` in X12) wrapping one or more messages. The envelope carries the sender and recipient, so reading just those segments is enough to route the file. Only once the partner is known does the integration need a schema to read the orders themselves.

## Before you begin

:::info Prerequisites

- A working WSO2 Integrator environment. See [Setup](../../get-started/setup/setup.md).
- The `bal edi` tool, pulled once per machine:

    ```bash
    bal tool pull edi
    ```

- The UN/EDIFACT D03A directory archive, downloaded from [UN/EDIFACT directory downloads](https://unece.org/trade/uncefact/unedifact/download). The tool builds the schema from the specification in this archive.
- Docker, to run a local SFTP server that stands in for the partner's mailbox.

:::

:::tip
For standard EDIFACT D03A message types, a [prebuilt EDIFACT package](../../reference/data-formats/edi.md#prebuilt-edifact-packages) reads a whole interchange with no code generation: envelope headers, batch splitting, and quarantining included. Use it whenever a partner sends the standard message unchanged. This guide generates its own library because step 6 tightens the schema to what the partner actually sends, which a prebuilt package cannot express.

X12 specifications are licensed from ASC X12, so no X12 specification ships with the tool and no prebuilt X12 packages are published. The flow in this guide is identical for X12, starting from the schema your organization is licensed to use. If you need help with that, [contact us](https://wso2.com/contact/).
:::

### Start the SFTP server

Save the following as `docker-compose.yml` and run `docker compose up -d`. It creates the user `partner` with an inbox for new files and folders for processed and rejected ones.

```yaml
services:
  sftp:
    image: atmoz/sftp:alpine
    container_name: edi-sftp
    ports:
      - "2222:22"
    command: partner:partner123:::edi/inbox,edi/processed,edi/rejected
```

### The sample interchange

Save the following as `orders.edi`. It is one interchange from the partner `SUPERMART` holding two purchase orders, and a third message that is missing its mandatory `BGM` segment, so there is something for the quarantine path to catch.

```text
UNB+UNOA:3+SUPERMART:14+SUPPLIER456:14+260101:1200+REF2+++ORDERS'
UNH+0001+ORDERS:D:03A:UN'
BGM+220+PO20001+9'
DTM+137:20260101:102'
NAD+BY+BUYER123::91'
LIN+1++ITEM-A:VP'
QTY+21:100'
UNS+S'
UNT+8+0001'
UNH+0002+ORDERS:D:03A:UN'
BGM+220+PO20002+9'
DTM+137:20260101:102'
NAD+BY+BUYER123::91'
LIN+1++ITEM-B:VP'
QTY+21:40'
UNS+S'
UNT+8+0002'
UNH+0003+ORDERS:D:03A:UN'
DTM+137:20260101:102'
NAD+BY+BUYER123::91'
LIN+1++ITEM-C:VP'
QTY+21:10'
UNS+S'
UNT+7+0003'
UNZ+3+REF2'
```

The segments are shown one per line for readability. An EDI file has no line breaks: the `'` terminator ends each segment.

## Part 1: Receive files and identify the trading partner

The envelope headers are read without a schema, so this part works before any code is generated. `ballerina/edi` provides `edifactHeadersFromEdiString` for EDIFACT and `x12HeadersFromEdiString` for X12.

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

## Step 1: Create the project

Create a new project named `edi-purchase-order-processing` with an integration named `Edi Order Processing`.

## Step 2: Add the SFTP service

1. Select **+ Add Artifact**, and under **File Integration**, select **FTP / SFTP**.
2. Configure the listener:

    | Field | Value |
    |---|---|
    | **Host** | `localhost` |
    | **Protocol** | **SFTP** |
    | **Port** | `2222` |
    | **Authentication** | **Basic Authentication** |
    | **Username** | A configurable named `sftpUsername` (`string`) |
    | **Password** | A configurable named `sftpPassword` (`string`) |
    | **Monitored Path** | `/edi/inbox` |

    For **Username** and **Password**, clear the default text, then select **Configurables** in the [Expression editor](../../editor/panels/expression-panel.md)'s helper pane and **New Configurable**, so the credentials are supplied at runtime instead of stored in the flow.

    <ThemedImage
        alt="FTP Integration form with port 2222, Basic Authentication, the sftpUsername and sftpPassword configurables, and the monitored path /edi/inbox"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/01-sftp-listener.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/01-sftp-listener.png'),
        }}
    />

3. Select **Create**.

## Step 3: Add the file handler

1. Select **+ Add Handler**, then **On Create**.
2. Set **Format** to **Raw Bytes**. The text handler is invoked only for `.txt`, `.log`, and `.md` files, while the raw handler receives a file of any extension, including `.edi`.
3. Under **File Handling Options**, keep **Move** selected for both outcomes, and set **On Success** to `/edi/processed` and **On Error** to `/edi/rejected`. A file the handler finishes with lands in the processed folder, and a file the handler returns an error for lands in the rejected one.
4. Under **Advanced Configurations**, select **File Metadata (fileInfo)**, then select **Save**.

<ThemedImage
    alt="Configure On Create Handler panel with the format set to Raw Bytes, and successful files moved to /edi/processed and failed files moved to /edi/rejected"
    sources={{
        light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/02-file-handler.png'),
        dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/02-file-handler.png'),
    }}
/>

The `onFile` handler opens in the flow editor.

## Step 4: Read the envelope headers

1. Select **+** and add a **Declare Variable** node named `ediText` of type `string`, with the expression `check string:fromBytes(content)`.

    <ThemedImage
        alt="Declare Variable form creating ediText of type string from check string:fromBytes(content)"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/03-edi-text-variable.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/03-edi-text-variable.png'),
        }}
    />

2. Select **+**, then **Call Function**, and search for `edifactHeadersFromEdiString`. Set **Edi Text** to the expression `ediText`, set **Result** to `headers`, and select **Save**.

    <ThemedImage
        alt="edifactHeadersFromEdiString form with Edi Text set to the ediText variable and the result named headers of type edi:EdifactHeaders"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/04-read-headers.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/04-read-headers.png'),
        }}
    />

## Step 5: Reject files from unknown partners

1. Select **+** and add an **If** node. In the condition's helper pane, select **Configurables**, then **New Configurable**, and create `tradingPartner` of type `string` with the default value `"SUPERMART"`. Then set the condition to:

    ```ballerina
    headers.unb.sender.id != tradingPartner
    ```

2. Inside the **If** branch, add a **Return** node with the expression:

    ```ballerina
    error(string `Unknown trading partner: ${headers.unb.sender.id}`)
    ```

    Returning an error is what moves the file to `/edi/rejected`.

3. After the **If** node, add a **Log Info** node. Switch **Msg** to **Expression** and enter:

    ```ballerina
    string `Order file from ${headers.unb.sender.id}, reference ${headers.unb.controlRef}`
    ```

<ThemedImage
    alt="onFile flow: fromBytes into ediText, edifactHeadersFromEdiString into headers, an If node that returns an error for an unknown partner, then a Log Info node"
    sources={{
        light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/05-identify-partner-flow.png'),
        dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/05-identify-partner-flow.png'),
    }}
/>

</TabItem>
<TabItem value="code" label="Ballerina Code">

```ballerina
// config.bal
configurable string sftpUsername = ?;
configurable string sftpPassword = ?;
configurable string tradingPartner = "SUPERMART";
```

```ballerina
// main.bal
import ballerina/edi;
import ballerina/ftp;
import ballerina/log;

listener ftp:Listener ftpListener = new (host = "localhost", protocol = ftp:SFTP, port = 2222, auth = {credentials: {username: string `${sftpUsername}`, password: string `${sftpPassword}`}});

@ftp:ServiceConfig {path: "/edi/inbox"}
service ftp:Service on ftpListener {
    @ftp:FunctionConfig {afterProcess: {moveTo: "/edi/processed"}, afterError: {moveTo: "/edi/rejected"}}
    remote function onFile(byte[] content, ftp:FileInfo fileInfo) returns error? {
        do {
            string ediText = check string:fromBytes(content);
            edi:EdifactHeaders headers = check edi:edifactHeadersFromEdiString(ediText);
            if headers.unb.sender.id != tradingPartner {
                return error(string `Unknown trading partner: ${headers.unb.sender.id}`);
            }
            log:printInfo(string `Order file from ${headers.unb.sender.id}, reference ${headers.unb.controlRef}`);
            // Part 2 continues here.
        } on fail error err {
            return error("unhandled error", err);
        }
    }
}
```

</TabItem>
</Tabs>

## Part 2: Parse the purchase orders

Reading the orders themselves needs a schema. Generate one from the D03A specification, adapt it to what the partner actually sends, and generate a typed library from it.

### Step 6: Generate and adapt the schema

From the project root, convert the `ORDERS` message type of the D03A directory, passing the archive you downloaded with `-i`:

```bash
bal edi convertEdifactSchema -v d03a -t ORDERS -i d03a.zip -o schema
```

This writes `schema/ORDERS.json`, named after the message type.

Trading partners rarely send a standard message exactly as specified. Because the schema is written out as JSON before any code is generated, a partner's deviations are handled by editing that file. The specification itself is never touched.

For the sample interchange, the partner sends a `QTY` segment on every line item, which the standard marks optional. Tighten it so a line item without a quantity is rejected rather than parsed as an order with no quantity. A converted schema declares its segments as references into `segmentDefinitions`, so the edit is on the reference inside the line-item segment group, the group whose first entry is `{"ref": "LIN", ...}`. Add `minOccurances` to its `QTY` entry:

```json
{"ref": "QTY", "tag": "Quantity", "minOccurances": 1, "maxOccurances": 99}
```

The fields most often adjusted are `delimiters`, `minOccurances` and `maxOccurances`, a field's `dataType`, and `ignoreSegments` for segments the partner adds that the integration does not care about. See [Adapting the schema to a trading partner](../../develop-and-test/data-transformation/edi.md#adapting-the-schema-to-a-trading-partner) for the full list.

Keep the edited schema in version control next to the integration: it is the record of what that partner sends.

### Step 7: Generate the library

1. On the project overview, select **+ Add**, select **Library**, enter `orders` as the library name, and select **Add**.

    <ThemedImage
        alt="Add an Integration or Library page with Library selected and the library name set to orders"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/06-add-library.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/06-add-library.png'),
        }}
    />

2. In the terminal, move into the `orders` directory and generate the code from the edited schema:

    ```bash
    cd orders
    bal edi codegen -i ../schema/ORDERS.json -o orders.bal
    ```

The library now holds a record type per segment, `fromEdiString` and `toEdiString` for a single message, and, because an EDIFACT schema carries an envelope, the envelope-aware `interchangeFromEdiString`, `interchangeToEdiString`, and `headersFromEdiString`.

### Step 8: Parse the interchange and quarantine bad messages

`interchangeFromEdiString` reads the whole envelope hierarchy. Envelope segments are fail-fast: a malformed `UNB` or `UNT` fails the call. Transaction bodies are **fail-safe**: a body the schema cannot read leaves its parse error on that transaction, typed `ORDERS|error`, and every other message in the interchange still arrives. That is what keeps one bad message from costing a batch: the good orders go on to be processed, and the bad one is quarantined with the reason attached.

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

1. Back in the `onFile` flow, after the **Log Info** node from step 5, select **+**, then **Call Function**. Under **Within Project**, in the **orders** section, select **interchangeFromEdiString**. Set **Edi Text** to the expression `ediText`, set **Result** to `interchange`, and select **Save**.

    <ThemedImage
        alt="Functions panel listing the generated orders library functions under Within Project, including interchangeFromEdiString"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/07-within-project-functions.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/07-within-project-functions.png'),
        }}
    />

2. Add a **Foreach** node over the collection `interchange.transactions`, with the variable `txn` of type `orders:ORDERSTransaction`.
3. Inside the loop, add a **Declare Variable** node named `body` of type `orders:ORDERS|error` with the expression `txn.body`.
4. Add an **If** node with the condition `body is error`. Inside its branch:
    1. Add a **Log Error** node with the message `Quarantined message`, the **Error** set to `body`, and an **Additional Values** entry with the key `reference` and the value `txn.transactionHeader.Message_header.message_reference_number`. This is the quarantine path.

        <ThemedImage
            alt="Log Error form with the message Quarantined message, the error set to body, and a reference value taken from the transaction header"
            sources={{
                light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/08-quarantine-log.png'),
                dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/08-quarantine-log.png'),
            }}
        />

    2. Add a **Continue** node, so the loop moves on to the next message.
5. After the **If** node, still inside the loop, add the processing for a valid order. A **Declare Variable** node and a **Log Info** node are enough to see it working:
    - `orderId` of type `string` with the expression `body.Beginning_of_message?.DOCUMENT_MESSAGE_IDENTIFICATION?.Document_identifier ?: ""`.
    - A **Log Info** node with the expression ``string `Order ${orderId} received from ${headers.unb.sender.id}` ``.

<ThemedImage
    alt="onFile flow continuing with interchangeFromEdiString, a Foreach over the transactions, an If node that logs and skips a malformed body, and a Log Info node for each valid order"
    sources={{
        light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/09-parse-orders-flow.png'),
        dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/09-parse-orders-flow.png'),
    }}
/>

</TabItem>
<TabItem value="code" label="Ballerina Code">

```ballerina
// main.bal
import ballerina/edi;
import ballerina/ftp;
import ballerina/log;

// The library generated in step 7.
import supplier/orders;

listener ftp:Listener ftpListener = new (host = "localhost", protocol = ftp:SFTP, port = 2222, auth = {credentials: {username: string `${sftpUsername}`, password: string `${sftpPassword}`}});

@ftp:ServiceConfig {path: "/edi/inbox"}
service ftp:Service on ftpListener {
    @ftp:FunctionConfig {afterProcess: {moveTo: "/edi/processed"}, afterError: {moveTo: "/edi/rejected"}}
    remote function onFile(byte[] content, ftp:FileInfo fileInfo) returns error? {
        do {
            string ediText = check string:fromBytes(content);
            edi:EdifactHeaders headers = check edi:edifactHeadersFromEdiString(ediText);
            if headers.unb.sender.id != tradingPartner {
                return error(string `Unknown trading partner: ${headers.unb.sender.id}`);
            }
            log:printInfo(string `Order file from ${headers.unb.sender.id}, reference ${headers.unb.controlRef}`);
            orders:ORDERSInterchange interchange = check orders:interchangeFromEdiString(ediText);
            foreach orders:ORDERSTransaction txn in interchange.transactions {
                orders:ORDERS|error body = txn.body;
                if body is error {
                    log:printError("Quarantined message", body, reference = txn.transactionHeader.Message_header.message_reference_number);
                    continue;
                }
                string orderId = body.Beginning_of_message?.DOCUMENT_MESSAGE_IDENTIFICATION?.Document_identifier ?: "";
                log:printInfo(string `Order ${orderId} received from ${headers.unb.sender.id}`);
            }
        } on fail error err {
            return error("unhandled error", err);
        }
    }
}
```

Replace `supplier` with the organization name of your project.

</TabItem>
</Tabs>

## Run and verify

1. Supply the SFTP credentials. Go to **Configurations** and set `sftpUsername` to `partner` and `sftpPassword` to `partner123`, or add them to a [`Config.toml`](../../develop-and-test/integration-artifacts/supportive-artifacts/configurations.md#providing-values) file in the integration directory:

    ```toml
    sftpUsername = "partner"
    sftpPassword = "partner123"
    ```

2. Select **Run** on the integration.
3. Drop the sample interchange into the partner's inbox:

    ```bash
    docker cp orders.edi edi-sftp:/home/partner/edi/inbox/
    docker exec edi-sftp chown partner /home/partner/edi/inbox/orders.edi
    ```

4. Within a minute, the listener's next poll picks the file up. Two orders are logged, and the third message is quarantined with the parse error naming the segment that was missing:

    ```text
    level=INFO  message="Order file from SUPERMART, reference REF2"
    level=INFO  message="Order PO20001 received from SUPERMART"
    level=INFO  message="Order PO20002 received from SUPERMART"
    level=ERROR message="Quarantined message" error={..."message":"Mandatory unit is missing in the EDI. Unit: Segment BGM ..."} reference="0003"
    ```

    The file then moves to `/edi/processed`.

5. Change the sender in the `UNB` segment of `orders.edi` to something else, such as `OTHERCO`, and drop it again. The file is rejected on the envelope alone, without the schema being consulted, and moves to `/edi/rejected`.

<ThemedImage
    alt="Integration terminal output showing the order file accepted from SUPERMART, an unknown trading partner OTHERCO rejected, two orders received, and one quarantined message naming the missing BGM segment"
    sources={{
        light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/10-run-terminal-output.png'),
        dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/10-run-terminal-output.png'),
    }}
/>

## What's next

- **Pick files up from other places.** The same handler works on a [local directory](../../develop-and-test/integration-artifacts/file-driven-integration/local-files.md), and the [FTP/SFTP service](../../develop-and-test/integration-artifacts/file-driven-integration/ftp-sftp.md) supports FTPS and key-based authentication for real partner mailboxes. For partners that post EDI over HTTP, the parsing logic is unchanged: read the request body into `ediText`.
- **Acknowledge the orders.** Trading partners usually expect a reply saying what was accepted and what was rejected. The quarantined messages from step 8 are exactly the input for an EDIFACT `APERAK`; see the [EDI acknowledgement example](https://github.com/ballerina-platform/module-ballerina-edi/tree/main/examples/edi-acknowledgement).
- **Handle several formats at once.** Bundle the schemas for every message type a partner sends into one package with [`libgen`](../../develop-and-test/data-transformation/edi.md#building-a-reusable-library-package).
