---
title: Telegram
---

# Telegram

Telegram event integrations receive webhook updates from a Telegram bot and trigger handler functions as bot events occur, such as incoming messages, edited messages, and callback queries from inline keyboards. Use them to build chatbots, notification services, and interactive workflows that respond to Telegram activity in real time.

## Creating a Telegram service

The Telegram webhook listener must be reachable from the internet over HTTPS. For local development, use a tunneling tool such as [ngrok](https://ngrok.com) to create a public HTTPS URL for your local port and pass it as the listener's `callbackUrl`. In production, deploy the integration to a publicly accessible, HTTPS-enabled host. The listener registers the webhook with Telegram automatically on startup using the bot's access token.

```ballerina
import ballerinax/telegram;
import ballerina/log;

configurable int port = 8090;
configurable string accessToken = ?;
configurable string callbackUrl = ?;

listener telegram:Listener telegramListener = new (port,
    accessToken = accessToken,
    callbackUrl = callbackUrl
);

service telegram:TelegramService on telegramListener {

    remote function onMessage(telegram:Message message) returns error? {
        log:printInfo("Message received", chatId = message.chat.id, text = message?.text ?: "");
    }

    remote function onEditedMessage(telegram:Message editedMessage) returns error? {
        log:printInfo("Message edited", chatId = editedMessage.chat.id, text = editedMessage?.text ?: "");
    }

    remote function onChannelPost(telegram:Message channelPost) returns error? {
        log:printInfo("Channel post received", chatId = channelPost.chat.id);
    }

    remote function onEditedChannelPost(telegram:Message editedChannelPost) returns error? {
        log:printInfo("Channel post edited", chatId = editedChannelPost.chat.id);
    }

    remote function onCallbackQuery(telegram:CallbackQuery callbackQuery) returns error? {
        log:printInfo("Callback query received", data = callbackQuery?.data ?: "");
    }

    remote function onInlineQuery(telegram:InlineQuery inlineQuery) returns error? {
        log:printInfo("Inline query received", query = inlineQuery.query);
    }

    remote function onPoll(telegram:Poll poll) returns error? {
        log:printInfo("Poll updated", pollId = poll.id);
    }

    remote function onPreCheckoutQuery(telegram:PreCheckoutQuery preCheckoutQuery) returns error? {
        log:printInfo("Pre-checkout query received", queryId = preCheckoutQuery.id);
    }

    remote function onShippingQuery(telegram:ShippingQuery shippingQuery) returns error? {
        log:printInfo("Shipping query received", queryId = shippingQuery.id);
    }
}
```

## Service and listener configuration

**Listener configuration:**

| Field | Description | Default |
|---|---|---|
| **Listen On** | The port on which the listener accepts the HTTPS callback used to register the webhook. | `8090` |
| **Access Token** | The bot token issued by [@BotFather](https://t.me/BotFather) when the bot was created. The listener uses this token to authenticate with the Telegram Bot API and to derive the webhook secret. | Required |
| **Callback URL** | The public HTTPS URL Telegram sends updates to. The listener registers this URL as the bot's webhook automatically on startup. | Required |

```ballerina
listener telegram:Listener telegramListener = new (8090,
    accessToken = "<bot-access-token>",
    callbackUrl = "https://my-app.example.com/"
);
```

**Service configuration:**

All nine handlers on `telegram:TelegramService` are optional — implement only the ones relevant to your bot. Unimplemented handlers are simply not invoked for their corresponding update type.

## Event handlers

The `TelegramService` type provides a handler for each category of update the Telegram Bot API can deliver.

| Handler | Triggered when |
|---|---|
| `onMessage` | A new text, media, or command message is sent to the bot |
| `onEditedMessage` | An existing message the bot received is edited |
| `onChannelPost` | A new post is published to a channel the bot administers |
| `onEditedChannelPost` | An existing channel post is edited |
| `onCallbackQuery` | A user presses a button on an inline keyboard |
| `onInlineQuery` | A user invokes the bot in inline mode (typing `@botname query`) |
| `onPoll` | The state of a poll the bot is tracking changes (votes, close) |
| `onPreCheckoutQuery` | A user confirms payment details before a Telegram Payments checkout completes |
| `onShippingQuery` | A user submits a shipping address for an invoice that requires shipping |

## What's next

- [WhatsApp Business](whatsapp-business.md) — react to WhatsApp Business events
- [Google Chat](google-chat.md) — react to Google Chat space events
- [Connections](../supportive-artifacts/connections.md) — reuse credentials across services
