---
title: Setup Guide
# ConnectorHeader (below) already renders "Alfresco" as the page's big
# title -- a synthetic "Setup Guide" <h1> on top of that (Docusaurus's
# default when a doc has no literal `# heading` of its own) would be a
# second, redundant title. `title` above still sets <title>/breadcrumbs/
# sidebar label as usual; only the auto-heading is suppressed.
hide_title: true
---

<ConnectorHeader
  name="Alfresco"
  version="2.0.2"
  vendor="Alfresco"
  category="Storage & Files"
  description="Enterprise content management platform with document CRUD, versioning, shared links, and collaboration features"
  icon="https://bcentral-packageicons.azureedge.net/images/ballerinax_alfresco_2.0.2.png"
  packageName="ballerinax/alfresco"
/>

This guide walks you through creating an Alfresco account and obtaining the Basic Authentication credentials required to use the Alfresco connector.

## Prerequisites

- An active Alfresco Content Services instance. If you do not have one, [sign up for a free trial](https://www.alfresco.com/try-alfresco-acs).

## Step 1: Set up your Alfresco environment

1. Go to [Alfresco's trial page](https://www.alfresco.com/try-alfresco-acs) and register for an account.
2. Once registered, follow the instructions in the setup email to provision your Alfresco Content Services instance.

:::note
If you are using a self-hosted Alfresco deployment, ensure that the Alfresco REST API is enabled and accessible.
:::

## Step 2: Obtain your credentials

1. Note the default **username** and **password** provided in the setup email or configured during installation.
2. For self-hosted deployments, the default admin credentials are typically `admin`/`admin` — change these immediately in production.
3. These credentials are used for Basic Authentication with the connector.

:::warning
Store your credentials securely. Do not commit them to source control. Use Ballerina's `configurable` feature and a `Config.toml` file to supply them at runtime.
:::

## Step 3: Get your service URL

The service URL is the base URL of your Alfresco Content Services REST API:

```
https://<your-alfresco-host>/alfresco/api/-default-/public/alfresco/versions/1
```

For Alfresco Cloud (Hyland Experience Platform), the URL is provided in your setup instructions. For local or self-hosted deployments, replace `<your-alfresco-host>` with your server's hostname and port (for example, `http://localhost:8080`).

:::tip
Verify the service URL by opening `<serviceUrl>/nodes/-root-` in a browser and authenticating with your credentials. A successful response confirms the URL is correct.
:::

## What's next

- [Action reference](actions.md): Available operations
