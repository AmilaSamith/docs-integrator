---
sidebar_position: 7
title: "Process Inbound EDI Purchase Orders from Trading Partners"
sidebar_label: "Process Inbound EDI Purchase Orders"
description: Build an SFTP-driven integration that picks up EDIFACT purchase orders from a trading partner, identifies the sender from the envelope headers, parses each order into typed records, and replies with an APERAK acknowledgement that reports any message it could not read.
keywords: [wso2 integrator, edi, edifact, x12, purchase order, orders, aperak, acknowledgement, trading partner, envelope, interchange, sftp, b2b, use case, low-code]
slug: /guides/business-use-cases/edi-purchase-order-processing
card_icon: edi
card_summary: An SFTP-driven integration that routes EDI purchase orders by trading partner, parses them, and acknowledges them with an APERAK
card_keywords: [edi, edifact, b2b, sftp, purchase order, aperak]
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Process Inbound EDI Purchase Orders from Trading Partners

**Time:** About 45 minutes | **What you'll build:** An integration that picks up EDI purchase orders a trading partner drops on an SFTP server, identifies the sender from the envelope, parses each order into typed Ballerina records, and answers the partner with an acknowledgement listing what was accepted and what was rejected.

Trading partners send purchase orders as EDI files, usually by dropping them in an SFTP mailbox. Three things have to happen: work out who sent the file, turn the orders inside it into data the integration can use, and tell the partner which orders arrived. This guide builds them in that order. The first needs no schema at all, the second uses a prebuilt package for the standard purchase order message, and the third replies with an EDIFACT `APERAK` (application error and acknowledgement) message.

**Sample project:** [edi-purchase-order-processing](https://github.com/wso2/integration-samples/tree/main/integrator-default-profile/samples/edi-purchase-order-processing) is the finished project, ready to run.

## How it works

<ThemedImage
    alt="Architecture diagram: the trading partner SUPERMART uploads EDIFACT ORDERS files to an SFTP server; a WSO2 Integrator FTP integration picks up new .edi files with an SFTP listener, reads the envelope headers with the EDI module, rejects files from unknown partners, parses the orders with the EDIFACT D03A package, writes an APERAK reply to the outbox for the partner to collect, and moves each file when done"
    sources={{
        light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/architecture.png'),
        dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/architecture.png'),
    }}
/>

The partner drops each EDI file in an SFTP inbox, and every new `.edi` file runs through the same flow:

1. Read the envelope headers to find the sender. No schema is needed for this.
2. If the sender is not the expected partner, reject the file: it moves to the `rejected` folder.
3. Parse the interchange into typed purchase orders. A message that cannot be read keeps its parse error, and the rest are still processed.
4. Reply with an `APERAK` in the `outbox` folder: one entry per accepted order, and one error entry per message that could not be read.
5. Move the file to the `processed` folder.

An EDI file is an *interchange*: an envelope (`UNB`/`UNZ` in EDIFACT, `ISA`/`IEA` in X12) wrapping one or more messages. The envelope carries the sender and recipient, so reading just those segments is enough to route the file. Only once the partner is known does the integration need the message schema to read the orders themselves. EDIFACT treats each message in an interchange independently, which is why one unreadable message does not hold up the others: it is reported back to the partner instead.

## Before you begin

:::info Prerequisites

- A working WSO2 Integrator environment. See [Setup](../../get-started/setup/setup.md).
- Docker, to run a local SFTP server that stands in for the partner's mailbox.

:::

:::tip
This guide reads the orders with the [prebuilt EDIFACT package](../../reference/data-formats/edi.md#prebuilt-edifact-packages) `ballerinax/edifact.d03a.supplychain`, which covers the standard D03A `ORDERS` and `APERAK` messages. When a partner deviates from the standard, or sends a message type or directory version no prebuilt package covers, [generate your own parser](../../develop-and-test/data-transformation/edi.md#generating-code-from-an-edifact-spec) from the specification and [adapt the schema to the partner](../../develop-and-test/data-transformation/edi.md#adapting-the-schema-to-a-trading-partner). The generated library has the same `interchangeFromEdiString` and `interchangeToEdiString` functions, so the flow below stays the same.

X12 specifications are licensed from ASC X12, so no X12 specification ships with the tool and no prebuilt X12 packages are published. The flow is identical for X12, starting from a parser generated from the schema your organization is licensed to use. If you need help with that, [contact us](https://wso2.com/contact/).
:::

### Start the SFTP server

Save the following as `docker-compose.yml` and run `docker compose up -d`. It creates the user `partner` with an inbox for new files, folders for processed and rejected ones, and an outbox for the replies.

```yaml
services:
  sftp:
    image: atmoz/sftp:alpine
    container_name: edi-sftp
    ports:
      - "2222:22"
    command: partner:partner123:::edi/inbox,edi/processed,edi/rejected,edi/outbox
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

The envelope headers are read without a schema, so this part works before any message type is involved. `ballerina/edi` provides `edifactHeadersFromEdiString` for EDIFACT and `x12HeadersFromEdiString` for X12.

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

## Step 1: Create the project

Create a new project named `edi-purchase-order-processing` with an integration named `Edi Order Processing`.

<ThemedImage
    alt="Create a Project form with the project name edi-purchase-order-processing, Integration selected, and the integration name Edi Order Processing"
    sources={{
        light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/01-create-project.png'),
        dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/01-create-project.png'),
    }}
/>

## Step 2: Add the SFTP service

1. Select **+ Add Artifact**, filter by **File**, and select **FTP / SFTP**.

    <ThemedImage
        alt="Artifacts page filtered to File Integration, showing the FTP / SFTP, SMB, Local Files, and Azure Files cards"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/02-add-ftp-artifact.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/02-add-ftp-artifact.png'),
        }}
    />

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

    <ThemedImage
        alt="Create FTP Integration form with the host localhost, the SFTP protocol, port 2222, and Basic Authentication selected"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/03-sftp-listener.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/03-sftp-listener.png'),
        }}
    />

3. For **Username** and **Password**, clear the default text, then open the field's helper pane, select **Configurables**, then **New Configurable**, so the credentials are supplied at runtime instead of stored in the flow.

    <ThemedImage
        alt="New Configurable dialog creating sftpUsername of type string"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/04-new-configurable.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/04-new-configurable.png'),
        }}
    />

    <ThemedImage
        alt="Listener form with the sftpUsername and sftpPassword configurables set and the monitored path /edi/inbox"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/05-sftp-credentials.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/05-sftp-credentials.png'),
        }}
    />

4. Select **Create**.

## Step 3: Add the file handler

1. Select **+ Add Handler**, then **On Create**.

    <ThemedImage
        alt="Select Handler to Add panel listing On Create, On Delete, and On Error"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/06-add-handler.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/06-add-handler.png'),
        }}
    />

2. Set **Format** to **Raw Bytes**. The text handler is invoked only for `.txt`, `.log`, and `.md` files, while the raw handler receives a file of any extension, including `.edi`.
3. Under **File Handling Options**, keep **Move** selected for both outcomes, and set **On Success** to `/edi/processed` and **On Error** to `/edi/rejected`. A file the handler finishes with lands in the processed folder, and a file the handler returns an error for lands in the rejected one.
4. Under **Advanced Configurations**, select **File Metadata (fileInfo)**, then select **Save**.

    <ThemedImage
        alt="Configure On Create Handler panel with the format set to Raw Bytes, successful files moved to /edi/processed, and failed files moved to /edi/rejected"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/07-handler-config.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/07-handler-config.png'),
        }}
    />

## Step 4: Accept only EDI files

The raw handler receives every file in the inbox, so filter the service down to `.edi` files.

1. Open the **FTP Integration - /edi/inbox** service and select **Configure**.
2. Select the **Service Configuration** field to open the **Record Configuration** builder, select **fileNamePattern**, and set the record to:

    ```ballerina
    {path: "/edi/inbox", fileNamePattern: "^.*\\.edi$"}
    ```

    <ThemedImage
        alt="Record Configuration builder for the service configuration with fileNamePattern selected and the pattern for .edi files"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/08-file-name-pattern.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/08-file-name-pattern.png'),
        }}
    />

3. Close the builder and select **Save Changes**. Files that do not match, such as a stray `.txt` file, are left in the inbox.

    <ThemedImage
        alt="FTP Integration Configuration page with the service configuration path /edi/inbox and the fileNamePattern for .edi files"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/09-service-configuration.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/09-service-configuration.png'),
        }}
    />

## Step 5: Read the envelope headers

1. Open the `onFile` handler. Select **+** to open the node panel, then **Declare Variable**.

    <ThemedImage
        alt="Node panel opened from the onFile flow, listing Declare Variable, Call Function, If, Foreach, and Return"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/10-node-palette.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/10-node-palette.png'),
        }}
    />

2. Name the variable `ediText` of type `string`, with the expression `check string:fromBytes(content)`.

    <ThemedImage
        alt="Declare Variable form creating ediText of type string from check string:fromBytes(content)"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/11-edi-text-variable.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/11-edi-text-variable.png'),
        }}
    />

3. Select **+**, then **Call Function**, and search for `edifactHeadersFromEdiString`. Set **Edi Text** to the expression `ediText`, set **Result** to `headers`, and select **Save**.

    <ThemedImage
        alt="edifactHeadersFromEdiString form with Edi Text set to ediText and the result named headers of type edi:EdifactHeaders"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/12-read-headers.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/12-read-headers.png'),
        }}
    />

## Step 6: Reject files from unknown partners

1. Select **+** and add an **If** node. From the condition's helper pane, create a configurable named `tradingPartner` of type `string` with the default value `"SUPERMART"`. Then set the condition to `headers.unb.sender.id != tradingPartner`.

    <ThemedImage
        alt="If node form with the condition headers.unb.sender.id != tradingPartner"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/13-partner-condition.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/13-partner-condition.png'),
        }}
    />

2. Inside the **If** branch, add a **Return** node with the expression ``error(string `Unknown trading partner: ${headers.unb.sender.id}`)``. Returning an error is what moves the file to `/edi/rejected`.

    <ThemedImage
        alt="Return node form returning an Unknown trading partner error"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/14-reject-unknown-partner.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/14-reject-unknown-partner.png'),
        }}
    />

3. After the **If** node, add a **Log Info** node. Switch **Msg** to **Expression** and enter ``string `Order file from ${headers.unb.sender.id}, reference ${headers.unb.controlRef}` ``.

<ThemedImage
    alt="onFile flow: fromBytes into ediText, edifactHeadersFromEdiString into headers, an If node that returns an error for an unknown partner, then a Log Info node"
    sources={{
        light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/15-identify-partner-flow.png'),
        dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/15-identify-partner-flow.png'),
    }}
/>

</TabItem>
<TabItem value="code" label="Ballerina Code">

```ballerina
// config.bal
configurable string sftpUsername = ?;
configurable string sftpPassword = ?;
# Sender ID of the trading partner this integration accepts files from.
configurable string tradingPartner = "SUPERMART";
```

```ballerina
// main.bal
import ballerina/edi;
import ballerina/ftp;
import ballerina/log;

listener ftp:Listener ftpListener = new (host = "localhost", protocol = ftp:SFTP, port = 2222, auth = {credentials: {username: string `${sftpUsername}`, password: string `${sftpPassword}`}});

@ftp:ServiceConfig {path: "/edi/inbox", fileNamePattern: "^.*\\.edi$"}
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

Reading the orders themselves needs the `ORDERS` message schema. The prebuilt `ballerinax/edifact.d03a.supplychain` package carries it, along with typed records for every segment and the envelope-aware `interchangeFromEdiString` function.

`interchangeFromEdiString` reads the whole envelope hierarchy. Envelope segments are fail-fast: a malformed `UNB` or `UNT` fails the call. Transaction bodies are **fail-safe**: a body the schema cannot read leaves its parse error on that transaction, typed `EDI_ORDERS_ORDERS|error`, and every other message in the interchange still arrives.

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

## Step 7: Parse the interchange

1. After the **Log Info** node from step 6, select **+**, then **Call Function**, and search for `ORDERS`. Under **Extended Library**, in the **edifact.d03a.supplychain.mORDERS** section, select **interchangeFromEdiString**. The package is pulled from Ballerina Central and imported the first time you use it.

    <ThemedImage
        alt="Functions panel searching for ORDERS, listing the edifact.d03a.supplychain.mORDERS functions under Extended Library, including interchangeFromEdiString"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/16-search-orders-package.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/16-search-orders-package.png'),
        }}
    />

2. Set **Edi Text** to the expression `ediText`, set **Result** to `interchange`, and select **Save**.

    <ThemedImage
        alt="interchangeFromEdiString form with Edi Text set to ediText and the result named interchange of type mORDERS:EDI_ORDERS_ORDERSInterchange"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/17-parse-interchange.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/17-parse-interchange.png'),
        }}
    />

## Step 8: Process each order

1. Add a **Foreach** node over the collection `interchange.transactions`, with the variable `txn` of type `mORDERS:EDI_ORDERS_ORDERSTransaction`.

    <ThemedImage
        alt="Foreach form iterating over interchange.transactions with the variable txn"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/18-foreach.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/18-foreach.png'),
        }}
    />

2. Inside the loop, add a **Declare Variable** node named `body` of type `mORDERS:EDI_ORDERS_ORDERS|error` with the expression `txn.body`.
3. Add an **If** node with the condition `body is error`. Inside its branch:
    1. Add a **Log Error** node with the message `Message rejected`, the **Error** set to `body`, and an **Additional Values** entry with the key `reference` and the value `txn.transactionHeader.Message_header.message_reference_number`.

        <ThemedImage
            alt="Log Error form with the message Message rejected, the error set to body, and a reference value taken from the transaction header"
            sources={{
                light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/19-log-rejected-message.png'),
                dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/19-log-rejected-message.png'),
            }}
        />

    2. Add a **Continue** node, so the loop moves on to the next message.
4. After the **If** node, still inside the loop, add the processing for a valid order. A **Declare Variable** node and a **Log Info** node are enough to see it working:
    - `orderId` of type `string` with the expression `body.Beginning_of_message?.DOCUMENT_MESSAGE_IDENTIFICATION?.Document_identifier ?: ""`.
    - A **Log Info** node with the expression ``string `Order ${orderId} received from ${headers.unb.sender.id}` ``.

<ThemedImage
    alt="onFile flow continuing with interchangeFromEdiString, a Foreach over the transactions, an If node that logs and skips an unreadable message, and a Log Info node for each order"
    sources={{
        light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/20-process-orders-flow.png'),
        dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/20-process-orders-flow.png'),
    }}
/>

</TabItem>
<TabItem value="code" label="Ballerina Code">

```ballerina
// main.bal, inside the do block
mORDERS:EDI_ORDERS_ORDERSInterchange interchange = check mORDERS:interchangeFromEdiString(ediText);
foreach mORDERS:EDI_ORDERS_ORDERSTransaction txn in interchange.transactions {
    mORDERS:EDI_ORDERS_ORDERS|error body = txn.body;
    if body is error {
        log:printError("Message rejected", body, reference = txn.transactionHeader.Message_header.message_reference_number);
        continue;
    }
    string orderId = body.Beginning_of_message?.DOCUMENT_MESSAGE_IDENTIFICATION?.Document_identifier ?: "";
    log:printInfo(string `Order ${orderId} received from ${headers.unb.sender.id}`);
}
```

The package is imported as `import ballerinax/edifact.d03a.supplychain.mORDERS;`.

</TabItem>
</Tabs>

## Part 3: Acknowledge the orders

Trading partners expect a reply saying what was accepted and what was rejected. In EDIFACT that reply is an `APERAK`: a `DOC` segment group for every order that was read, and an `ERC` segment group, with the parse error as free text and a reference to the failed message, for every message that was not. The same prebuilt package provides the `APERAK` types and `interchangeToEdiString` to write it.

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

## Step 9: Add the acknowledgement builder

The `APERAK` is a nested record, which is quicker to write as code. Open the integration's `functions.bal` in the code editor and replace its content with the following. The function then appears under **Functions** and can be called from the flow like any other.

<details>
<summary>functions.bal</summary>

```ballerina
import ballerina/time;
import ballerinax/edifact.d03a.supplychain.mAPERAK;
import ballerinax/edifact.d03a.supplychain.mORDERS;

// EDIFACT leaves ERC application error codes to the trading partners, so the code list
// responsible agency is "ZZZ" (mutually defined) rather than a UN code list.
const string ERROR_CODE_UNREADABLE = "13";
const string AGENCY_MUTUALLY_DEFINED = "ZZZ";

// Document name code 305 is "application error and acknowledgement"; 220 is "order".
const string DOC_ACKNOWLEDGEMENT = "305";
const string DOC_ORDER = "220";

// Build an APERAK acknowledging one inbound ORDERS interchange: a DOC segment group for
// every order that was read, and an ERC segment group for every message that was not.
function buildAcknowledgement(mORDERS:EDI_ORDERS_ORDERSInterchange orders)
        returns mAPERAK:EDI_APERAK_APERAKInterchange {
    mORDERS:Interchange_header_Type inbound = orders.interchangeHeader.interchange_header;
    time:Civil now = time:utcToCivil(time:utcNow());

    mAPERAK:Group_1_GType[] accepted = [];
    mAPERAK:Group_4_GType[] rejected = [];

    foreach mORDERS:EDI_ORDERS_ORDERSTransaction txn in orders.transactions {
        string messageRef = txn.transactionHeader.Message_header.message_reference_number;
        mORDERS:EDI_ORDERS_ORDERS|error body = txn.body;
        if body is error {
            rejected.push({
                Application_error_information: {
                    APPLICATION_ERROR_DETAIL: {
                        Application_error_code: ERROR_CODE_UNREADABLE,
                        // The component is positional, so the unused code list identifier
                        // is written as an empty component ahead of the agency code.
                        Code_list_identification_code: "",
                        Code_list_responsible_agency_code: AGENCY_MUTUALLY_DEFINED
                    }
                },
                // FTX subject code AAO marks the text as an error description.
                Free_text: {
                    TEXT_SUBJECT_CODE_QUALIFIER: "AAO",
                    TEXT_LITERAL: {Free_text: toFreeText(body.message())}
                },
                group_5: [
                    {Reference: {REFERENCE: {Reference_code_qualifier: "ACW", Reference_identifier: messageRef}}}
                ]
            });
            continue;
        }
        string orderId = body.Beginning_of_message?.DOCUMENT_MESSAGE_IDENTIFICATION?.Document_identifier ?: messageRef;
        accepted.push({
            Document_message_details: {
                DOCUMENT_MESSAGE_NAME: {Document_name_code: DOC_ORDER},
                DOCUMENT_MESSAGE_DETAILS: {Document_identifier: orderId}
            }
        });
    }

    string controlRef = string `ACK${inbound.control_reference}`;
    mAPERAK:EDI_APERAK_APERAK body = {
        Beginning_of_message: {
            DOCUMENT_MESSAGE_NAME: {Document_name_code: DOC_ACKNOWLEDGEMENT},
            DOCUMENT_MESSAGE_IDENTIFICATION: {Document_identifier: controlRef},
            MESSAGE_FUNCTION_CODE: "9"
        },
        Date_time_period: [
            {
                DATE_TIME_PERIOD: {
                    Date_or_time_or_period: "137",
                    Date_or_time_or_period_text: documentDate(now),
                    Date_or_time_or_period_format_code: "102"
                }
            }
        ],
        group_1: accepted,
        // The interchange this APERAK responds to.
        group_2: [
            {Reference: {REFERENCE: {Reference_code_qualifier: "ACW", Reference_identifier: inbound.control_reference}}}
        ],
        // Sender and recipient swap around: the receiver of the orders issues the acknowledgement.
        group_3: [
            {Name_and_address: {PARTY_FUNCTION_CODE_QUALIFIER: "MS", PARTY_IDENTIFICATION_DETAILS: {Party_identifier: inbound.recipient.id}}},
            {Name_and_address: {PARTY_FUNCTION_CODE_QUALIFIER: "MR", PARTY_IDENTIFICATION_DETAILS: {Party_identifier: inbound.sender.id}}}
        ],
        group_4: rejected
    };

    // The UNZ count and the UNT segment count are recomputed by interchangeToEdiString.
    return {
        interchangeHeader: {
            interchange_header: {
                syntax_identifier: {syntax_id: "UNOA", syntax_version: "3"},
                sender: {id: inbound.recipient.id, qualifier: inbound.recipient.qualifier},
                recipient: {id: inbound.sender.id, qualifier: inbound.sender.qualifier},
                date_and_time: {date: interchangeDate(now), time: interchangeTime(now)},
                control_reference: controlRef,
                application_reference: "APERAK"
            }
        },
        transactions: [
            {
                transactionHeader: {
                    Message_header: {
                        message_reference_number: "0001",
                        message_identifier: {
                            message_type: "APERAK",
                            message_version_number: "D",
                            message_release_number: "03A",
                            controlling_agency: "UN"
                        }
                    }
                },
                body,
                transactionTrailer: {Message_trailer: {number_of_segments: 0, message_reference_number: "0001"}}
            }
        ],
        interchangeTrailer: {interchange_trailer: {interchange_control_count: 0, interchange_control_reference: controlRef}}
    };
}

// A parse error reads back as free text, so collapse its line breaks, drop the characters
// EDIFACT reserves as delimiters, and keep it within the FTX component length.
function toFreeText(string message) returns string {
    string plain = re `\s+`.replaceAll(re `[+:'?*]`.replaceAll(message, " "), " ").trim();
    return plain.length() > 70 ? plain.substring(0, 70) : plain;
}

// UNB carries the date as YYMMDD and the time as HHMM. DTM format code 102 is CCYYMMDD.
function interchangeDate(time:Civil ts) returns string =>
    pad(ts.year % 100) + pad(ts.month) + pad(ts.day);

function interchangeTime(time:Civil ts) returns string => pad(ts.hour) + pad(ts.minute);

function documentDate(time:Civil ts) returns string => ts.year.toString() + pad(ts.month) + pad(ts.day);

function pad(int value) returns string => value < 10 ? string `0${value}` : value.toString();
```

</details>

## Step 10: Connect to the SFTP server

The listener only receives files, so writing the reply needs an SFTP client.

1. After the **Foreach** node, select **+**, then **Add Connection**, search for `ftp`, and select **FTP**.

    <ThemedImage
        alt="Add Connection dialog searching for ftp, showing the FTP Caller and FTP connectors"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/21-add-ftp-connection.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/21-add-ftp-connection.png'),
        }}
    />

2. Select the **Client Config** field to open the **Record Configuration** builder, and set the record to `{protocol: ftp:SFTP, host: "localhost", port: 2222, auth: {credentials: {username: sftpUsername, password: sftpPassword}}}`, reusing the configurables from step 2. Close the builder and select **Save Connection**. The connection is named `ftpClient`.

    <ThemedImage
        alt="Record Configuration builder for the FTP client config with protocol, host, port, and auth selected and the record using the sftpUsername and sftpPassword configurables"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/22-ftp-client-config.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/22-ftp-client-config.png'),
        }}
    />

## Step 11: Write the reply

1. After the **Foreach** node, select **+**, then **Call Function**. Under **Within Project**, select **buildAcknowledgement**. Set **Orders** to the expression `interchange` and **Result** to `acknowledgement`.

    <ThemedImage
        alt="buildAcknowledgement form with Orders set to interchange and the result named acknowledgement of type mAPERAK:EDI_APERAK_APERAKInterchange"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/23-build-acknowledgement.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/23-build-acknowledgement.png'),
        }}
    />

2. Select **+**, then **Call Function**, and search for `APERAK`. In the **edifact.d03a.supplychain.mAPERAK** section, select **interchangeToEdiString**. Set **Msg** to `acknowledgement` and **Result** to `acknowledgementText`.

    <ThemedImage
        alt="mAPERAK interchangeToEdiString form with Msg set to acknowledgement and the result named acknowledgementText"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/24-serialize-acknowledgement.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/24-serialize-acknowledgement.png'),
        }}
    />

3. Select **+**, then under **Connections**, select **ftpClient** and **Put Text**. Set **Path** to the expression ``string `/edi/outbox/${fileInfo.name}` `` and **Content** to `acknowledgementText`.

    <ThemedImage
        alt="ftpClient putText form writing acknowledgementText to /edi/outbox under the name of the incoming file"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/25-write-acknowledgement.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/25-write-acknowledgement.png'),
        }}
    />

<ThemedImage
    alt="End of the onFile flow: the Foreach loop, then buildAcknowledgement, interchangeToEdiString, and an ftp putText node connected to ftpClient"
    sources={{
        light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/26-reply-flow.png'),
        dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/26-reply-flow.png'),
    }}
/>

</TabItem>
<TabItem value="code" label="Ballerina Code">

```ballerina
// connections.bal
import ballerina/ftp;

final ftp:Client ftpClient = check new ({protocol: ftp:SFTP, host: "localhost", port: 2222, auth: {credentials: {username: sftpUsername, password: sftpPassword}}});
```

```ballerina
// main.bal
import ballerina/edi;
import ballerina/ftp;
import ballerina/log;
import ballerinax/edifact.d03a.supplychain.mAPERAK;
import ballerinax/edifact.d03a.supplychain.mORDERS;

listener ftp:Listener ftpListener = new (host = "localhost", protocol = ftp:SFTP, port = 2222, auth = {credentials: {username: string `${sftpUsername}`, password: string `${sftpPassword}`}});

@ftp:ServiceConfig {path: "/edi/inbox", fileNamePattern: "^.*\\.edi$"}
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
            mORDERS:EDI_ORDERS_ORDERSInterchange interchange = check mORDERS:interchangeFromEdiString(ediText);
            foreach mORDERS:EDI_ORDERS_ORDERSTransaction txn in interchange.transactions {
                mORDERS:EDI_ORDERS_ORDERS|error body = txn.body;
                if body is error {
                    log:printError("Message rejected", body, reference = txn.transactionHeader.Message_header.message_reference_number);
                    continue;
                }
                string orderId = body.Beginning_of_message?.DOCUMENT_MESSAGE_IDENTIFICATION?.Document_identifier ?: "";
                log:printInfo(string `Order ${orderId} received from ${headers.unb.sender.id}`);
            }
            mAPERAK:EDI_APERAK_APERAKInterchange acknowledgement = buildAcknowledgement(interchange);
            string acknowledgementText = check mAPERAK:interchangeToEdiString(acknowledgement);
            check ftpClient->putText(string `/edi/outbox/${fileInfo.name}`, acknowledgementText);
        } on fail error err {
            return error("unhandled error", err);
        }
    }
}
```

`buildAcknowledgement` is in `functions.bal`, shown in step 9.

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

4. Within a minute, the listener's next poll picks the file up. Two orders are logged, and the third message is rejected with the parse error naming the segment that was missing:

    ```text
    level=INFO  message="Order file from SUPERMART, reference REF2"
    level=INFO  message="Order PO20001 received from SUPERMART"
    level=INFO  message="Order PO20002 received from SUPERMART"
    level=ERROR message="Message rejected" error={..."message":"Mandatory unit is missing in the EDI. Unit: Segment BGM ..."} reference="0003"
    ```

    The file moves to `/edi/processed`.

    <ThemedImage
        alt="Integration terminal output showing the order file accepted from SUPERMART, an unknown trading partner OTHERCO rejected, two orders received, and one rejected message naming the missing BGM segment"
        sources={{
            light: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/27-run-terminal-output.png'),
            dark: useBaseUrl('/img/guides/usecases/edi-purchase-order-processing/27-run-terminal-output.png'),
        }}
    />

5. Read the acknowledgement in the outbox:

    ```bash
    docker exec edi-sftp cat /home/partner/edi/outbox/orders.edi
    ```

    It accepts both orders and reports message `0003` with its error. Segments are shown one per line for readability:

    ```text
    UNB+UNOA:3+SUPPLIER456:14+SUPERMART:14+261018:1629+ACKREF2++APERAK'
    UNH+0001+APERAK:D:03A:UN'
    BGM+305+ACKREF2+9'
    DTM+137:20261018:102'
    DOC+220+PO20001'
    DOC+220+PO20002'
    RFF+ACW:REF2'
    NAD+MS+SUPPLIER456'
    NAD+MR+SUPERMART'
    ERC+13::ZZZ'
    FTX+AAO+++Mandatory unit is missing in the EDI. Unit Segment BGM | Min 1 | Max 1'
    RFF+ACW:0003'
    UNT+12+0001'
    UNZ+1+ACKREF2'
    ```

6. Change the sender in the `UNB` segment of `orders.edi` to something else, such as `OTHERCO`, and drop it again. The file is rejected on the envelope alone, without the schema being consulted, and moves to `/edi/rejected`. A file without the `.edi` extension stays in the inbox.

## What's next

- **Pick files up from other places.** The same handler works on a [local directory](../../develop-and-test/integration-artifacts/file-driven-integration/local-files.md), and the [FTP/SFTP service](../../develop-and-test/integration-artifacts/file-driven-integration/ftp-sftp.md) supports FTPS and key-based authentication for real partner mailboxes. For partners that post EDI over HTTP, the parsing logic is unchanged: read the request body into `ediText`.
- **Support a partner's own variant.** When a partner's messages deviate from the standard, [generate a parser](../../develop-and-test/data-transformation/edi.md#generating-code-from-an-edifact-spec) from the specification, [adapt the schema](../../develop-and-test/data-transformation/edi.md#adapting-the-schema-to-a-trading-partner) to what they send, and swap it in for the prebuilt package. Bundle the schemas for every message type a partner sends into one package with [`libgen`](../../develop-and-test/data-transformation/edi.md#building-a-reusable-library-package).
- **Deploy it.** Ship the integration to [WSO2 Cloud](../../deploy-and-run/deploy-to-wso2-cloud/deploy-to-wso2-cloud.md), a [Docker container](../../deploy-and-run/self-hosted/containerized-deployment.md#docker-deployment), or a [virtual machine](../../deploy-and-run/self-hosted/vm-deployment.md), and point the listener and client at the partner's real SFTP server through the configurables.
