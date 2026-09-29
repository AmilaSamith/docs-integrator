---
sidebar_position: 1
title: Create a Project
description: Create a project workspace to organize multiple integrations and libraries.
slug: /develop-and-test/organize-workbench/create-a-project
---

# Create a Project

A project is a workspace that organizes multiple integrations and libraries in a single repository with shared dependencies. Use projects when you need to manage related packages together.

## Open the creation wizard

To start creating a new project:

1. Open the WSO2 Integrator.
2. Locate the **Create a Project** card on the main dashboard.
3. Click **Create** to open the project creation wizard.

:::tip
If you want to open a workspace you are already working on, click **Open Existing** on the same card, or select a repository directly from the **Recent Projects** list at the bottom of the screen.
:::

Click More Actions below the main cards to reveal additional options. The panel expands and the trigger relabels itself Show less:

**Migrate Integrations from Other Vendors** — Import integrations from other vendors and convert them to WSO2 Integrator format.

![WSO2 Integrator](/img/create-project/wso2-integrator.png)

## Configure the project

In the **Create a Project** dialog, define the core properties of your workspace and select your starting component.

1. Specify the main workspace details:

| Field | Description |
|---|---|
| **Project name** | A name for your project. |
| **Location** | The directory where the project will be created. Click **Browse** to select a specific folder. |

2. Under the **What do you want to build?** section, select your starting component:
   * **Integration:** Build any type of integration, workflow, MCP server, or AI agent.
   * **Library:** Build reusable components and utilities that can be shared across integrations.

> **Note:** This initial selection is just a starting point. You can add more integrations and libraries to this project later.

3. Enter a name for your initial component in the **Integration name** (or **Library Name**) field.

![Create Project form](/img/create-project/create-project.png)

### Advanced configurations

Expand the **Advanced Configurations** panel to specify the Ballerina Package details. This section defines how the underlying Ballerina package is generated:

| Field | Description |
|---|---|
| **Package Name** | Provide a name for the package. |
| **Organization Name** | Provide the name of the organization that owns this package. |
| **Package Version** | Provide a version for the package. |

4. Click **Create** to generate the project and open the workspace.

![Advanced Configuration form](/img/create-project/advanced-configuration-form.png)


## Add additional integrations and libraries

To add more components, switch to the Project view by clicking Overview in the sidebar. The project view lists all integrations and libraries in the project.

Click **+ Add** under the **Integrations & Libraries** card. Then Add an Integration or Library form opens.

![Project view](/img/create-project/add-integration.png)

:::tip 
Use the **README** card in the project view to document your project, integrations, and libraries.
:::

![Add Integration form](/img/create-project/add-integration-library-form.png)


### Add an integration

1. Select **Integration** as the type.

2. Enter an **Integration Name**.

3. Optionally expand **Advanced Configurations** to set Ballerina package details:


   | Field | Description |
   |---|---|
   | **Package Name** | The Ballerina package name. Defaults to the integration name (for example, `untitled`). |
   | **Organization Name** | Inherited from the parent project and shown as read-only. |
   | **Package Version** | The initial version of the package. Defaults to `0.1.0`. |

4. Click **Add**.

![Add New Integration dialog](/img/create-project/choose-integration.png)

### Add a library

1. Select **Library** as the Type.

2. Enter a **Library Name**.

3. Optionally expand **Advanced Configurations** to set the same Ballerina package fields as above. **Organization Name** is inherited from the parent project.

4. Click **Add**.

![Add New Library dialog](/img/create-project/choose-library.png)

## What's next

- [Open a project](open-a-project.md) — Open an existing project