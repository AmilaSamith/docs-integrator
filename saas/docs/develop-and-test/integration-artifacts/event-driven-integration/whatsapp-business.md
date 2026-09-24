---
title: WhatsApp Business
---

# WhatsApp Business

WhatsApp Business event integrations receive webhook notifications from Meta's WhatsApp Business Cloud API and trigger handler functions as events occur, such as an inbound customer message, a message status update, or a change to a message template's status. Use them to build chat-based workflows and track message delivery without polling the Graph API. The same connector also exposes a client for sending messages, templates, and media, which you can use alongside the webhook service to reply to incoming conversations.

The WhatsApp Business webhook listener must be reachable from the internet. For local development, use a tunneling tool such as [ngrok](https://ngrok.com) to create a public URL for your local port. In production, deploy the integration to a publicly accessible host.

After starting the integration, configure the webhook in the **Meta App Dashboard** under **WhatsApp > Configuration**:
- Set the **Callback URL** to `https://<your-host>:<port>`.
- Set the **Verify Token** to the same value configured as `verifyToken` on the listener.
- Subscribe to the webhook fields you want to receive, such as `messages`, `message_template_status_update`, or `account_update`.

## Creating a WhatsApp Business service

```ballerina
import ballerinax/whatsapp.business;
import ballerina/log;

configurable int port = 8090;
configurable string verifyToken = ?;
configurable string appSecret = ?;

listener business:Listener whatsappListener = new (port,
    verifyToken = verifyToken, appSecret = appSecret);

service business:WhatsAppService on whatsappListener {

    remote function onMessages(business:MessagesNotification notification) returns error? {
        if notification is business:Messages {
            foreach business:InboundMessage inboundMessage in notification.messages {
                log:printInfo("Inbound WhatsApp message",
                              'from = inboundMessage.'from,
                              messageType = inboundMessage.messageType);
            }
        } else {
            log:printInfo("WhatsApp message status update",
                          count = notification.statuses.length());
        }
    }

    remote function onMessageTemplateStatusUpdate(business:MessageTemplateStatusUpdate update) returns error? {
        log:printInfo("Message template status changed");
    }

    remote function onError(business:HandlerError handlerError) returns error? {
        log:printError("WhatsApp event handler failed", handlerError);
    }
}
```

## Service and listener configuration

**Listener configuration** (`business:ListenerConfig`):

| Field | Description | Default |
|---|---|---|
| **Listen On** (`listenTo`) | Port number for a new HTTP listener, or an existing `http:Listener` to attach to. | Required |
| **Verify Token** (`verifyToken`) | The verification token configured in the Meta App Dashboard, used during the webhook subscription handshake. | Required |
| **App Secret** (`appSecret`) | The Meta app secret, used to verify the `X-Hub-Signature-256` HMAC-SHA256 signature on inbound notifications. | Required |

**Service configuration** (`@business:ServiceConfig`, optional):

| Field | Description | Default |
|---|---|---|
| **Auto Ack** (`autoAck`) | Whether the listener automatically responds `200 OK` to Meta as soon as a notification is received, before any handler runs. Set to `false` and call `caller->complete()` from a handler's optional second `business:Caller` parameter to control acknowledgement manually. | `true` |

```ballerina
listener business:Listener whatsappListener = new (8090,
    verifyToken = "my-verify-token", appSecret = "my-app-secret");
```

## Event handlers

When a WhatsApp Business service is created, declare only the handlers you need — none are required, and a subscribed field with no matching handler is logged and dropped. A compiler plugin validates that each handler you declare uses the correct event type and returns `error?`.

| Handler | Triggered when |
|---|---|
| `onMessages` | A `messages` notification arrives — either inbound customer messages (`business:Messages`) or outbound delivery/read status updates (`business:MessageStatuses`); narrow with `notification is business:Messages` |
| `onAccountReviewUpdate` | A WhatsApp Business Account (WABA) review decision changes |
| `onAccountUpdate` | An account-lifecycle or compliance change occurs |
| `onBusinessCapabilityUpdate` | A WABA's messaging or phone-number capability limits change |
| `onMessageTemplateQualityUpdate` | A message template's quality score changes |
| `onMessageTemplateStatusUpdate` | A message template's status changes |
| `onPhoneNumberNameUpdate` | A phone number's display-name review outcome is available |
| `onPhoneNumberQualityUpdate` | A phone number's messaging throughput/quality tier changes |
| `onSecurity` | A two-step-verification PIN change or reset is requested for a phone number |
| `onTemplateCategoryUpdate` | A message template's category changes, or is about to change |
| `onError` | Any of the handlers above returns an `error` while being dispatched |

## What's next

- [Telegram](telegram.md) — react to Telegram bot events
- [Google Chat](google-chat.md) — react to Google Chat space events
- [Connections](../supportive-artifacts/connections.md) — reuse credentials across services
