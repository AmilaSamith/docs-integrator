---
title: Google Chat
---

# Google Chat

Google Chat event integrations receive interaction events directly from a Google Chat app over HTTPS and trigger handler functions as users message the app, join or leave a space, or interact with cards and dialogs. Use them to build Chat apps that reply to messages, react to space membership changes, and process card clicks, slash commands, and form submissions without polling the Google Chat API.

## Creating a Google Chat service

The Google Chat listener must be reachable from the internet over HTTPS. For local development, use a tunneling tool such as [ngrok](https://ngrok.com) to create a public HTTPS URL for your local port. In production, deploy the integration to a publicly accessible host.

After starting the integration, configure the app's connection settings in the **Google Chat API** configuration page of the Google Cloud console, setting the app URL to `https://<your-host>` with HTTP method `POST`.

```ballerina
import ballerinax/googleapis.chat;
import ballerina/log;

configurable int port = 8090;
configurable string serviceAccountPath = "./service-account-key.json";
configurable string endpointUrl = "https://<your-host>";

listener chat:Listener chatListener = new (port, {
    auth: {path: serviceAccountPath}
});

@chat:ServiceConfig {
    endpointUrl: endpointUrl
}
service chat:ChatService on chatListener {

    remote function onMessage(chat:MessageEvent event, chat:MessageCaller caller) returns error? {
        log:printInfo("Message received", text = event.message.text ?: "");
        check caller->respond({text: "Echo: " + (event.message.text ?: "")});
    }

    remote function onAddedToSpace(chat:ChatEvent event, chat:MessageCaller caller) returns error? {
        log:printInfo("App added to space", space = event.space?.name ?: "");
        check caller->respond({text: "Thanks for adding me!"});
    }

    remote function onRemovedFromSpace(chat:ChatEvent event) returns error? {
        log:printInfo("App removed from space", space = event.space?.name ?: "");
    }

    remote function onCardClicked(chat:ChatEvent event, chat:CardClickedCaller caller) returns error? {
        log:printInfo("Card clicked", space = event.space?.name ?: "");
        check caller->respond({text: "Got your click!"});
    }

    remote function onWidgetUpdated(chat:ChatEvent event, chat:WidgetUpdatedCaller caller) returns error? {
        log:printInfo("Widget updated", space = event.space?.name ?: "");
    }

    remote function onAppCommand(chat:ChatEvent event, chat:MessageCaller caller) returns error? {
        log:printInfo("App command invoked", space = event.space?.name ?: "");
        check caller->respond({text: "Command received"});
    }

    remote function onAppHome(chat:ChatEvent event, chat:AppHomeCaller caller) returns error? {
        log:printInfo("App home opened", user = event.user?.name ?: "");
        check caller->respond({});
    }

    remote function onSubmitForm(chat:ChatEvent event, chat:SubmitFormCaller caller) returns error? {
        log:printInfo("Form submitted", space = event.space?.name ?: "");
        check caller->respond({});
    }
}
```

## Service and listener configuration

`chat:Listener` accepts a port number (or an existing `http:Listener`) together with a `ListenerConfig` record, and starts an HTTPS-facing endpoint that Google Chat posts interaction events to.

**Listener configuration (`chat:ListenerConfig`):**

| Field | Description | Default |
|---|---|---|
| `auth` | Authentication used to verify and process events: a service account (`ServiceAccountAuthConfig`), OAuth2 credentials (`OAuth2Config`), or a bearer token (`http:BearerTokenConfig`). | Required |
| `httpListenerConfig` | Underlying `http:ListenerConfiguration` applied to the HTTP listener created for this port. | `{}` |

**Service configuration (`@chat:ServiceConfig` annotation, required on every `ChatService`):**

| Field | Description |
|---|---|
| `endpointUrl` | The public HTTPS URL of this listener, exactly as configured for the app in the Google Chat API console. Used to verify the bearer token on incoming requests. |
| `projectNumber` | Alternative to `endpointUrl`: the GCP project number the Chat app was built under, used to verify the token's audience instead. |

Only one of `endpointUrl` or `projectNumber` needs to be set.

## Event handlers

When a Google Chat service is created, implement the handlers for the interactions your app needs to support. All handlers are optional remote functions on `chat:ChatService`.

| Handler | Triggered when |
|---|---|
| `onMessage` | A user sends a message to the app in a space or direct message |
| `onAddedToSpace` | The app is added to a space or direct message |
| `onRemovedFromSpace` | The app is removed from a space or direct message |
| `onCardClicked` | A user clicks an interactive element on a card message |
| `onWidgetUpdated` | A user interacts with a widget, such as a multi-select menu, that updates a card in place |
| `onAppCommand` | A user invokes a slash command registered by the app |
| `onAppHome` | A user opens the app's Home tab |
| `onSubmitForm` | A user submits a dialog form |

## What's next

- [Telegram](telegram.md) — react to Telegram bot events
- [WhatsApp Business](whatsapp-business.md) — react to WhatsApp Business events
- [Connections](../supportive-artifacts/connections.md) — reuse credentials across services
