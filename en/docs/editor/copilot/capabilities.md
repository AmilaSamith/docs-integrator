---
title: "Built-in Capabilities"
description: "Write, test, debug, and fix integrations with WSO2 Integrator Copilot."
keywords: [wso2 integrator, copilot, ai, integration generation]
sidebar_position: 2
slug: /editor/copilot/copilot-capabilities
---

# Copilot Built-in Capabilities

WSO2 Integrator Copilot builds integrations from natural language prompts. It produces ready-to-use artifacts in your project. Iterate through follow-up prompts to refine logic, add features, or modify behavior.

![WSO2 Integrator Copilot panel open alongside an integration project in the editor.](/img/editor/copilot/copilot-overview.png)

## Clarifying requirements

During the planning or generation phase, Copilot may identify missing information that is critical to the integration. If a requirement is ambiguous, it pauses and presents a list of suggested options. Select one, or select **Other** to type your own answer.

![Clarifying requirements prompt showing selection options.](/img/editor/copilot/clarifying-requirements.png)


## Using web tools

Copilot can search the internet for external context or up-to-date documentation. It asks for permission before each search unless you enable the web tools toggle in the input bar.

![Web tools permission prompt in the Copilot input bar.](/img/editor/copilot/web-tool.png)

## Generating connectors

Copilot can generate a custom connector when a pre-built one is not available. During integration generation, if no pre-built connector exists, Copilot prompts the user for an OpenAPI specification. The user can also directly request to generate a custom connector. Once generated, the connector is available for Copilot to use in the flow.

![Copilot generating custom connector code from an OpenAPI specification.](/img/editor/copilot/connector-generator.png)

## Review generated artifacts

After generation completes, you can inspect exactly what was built or changed before finalizing the changes. Review the generated artifacts as the flow diagram or as source code with a diff view.

![Review mode showing the generated integration diagram.](/img/editor/copilot/review-mode.png)

## Configure to Run/Test

When you run or test the integration, Copilot identifies the required configurables and prompts you to enter them.

![Configuration collection prompt showing required fields for the integration.](/img/editor/copilot/config-collection.png)

## Generate Integration Tests

Copilot generates tests for your integration and runs them with the built-in test runner, allowing you to verify the generated artifacts immediately.

![Test runner showing generated tests and results.](/img/editor/copilot/running-tests.png)

## TryOut your services

Once your integration is running, you can send test requests to your services from Copilot. Describe what you want to test in plain language, and Copilot calls your service and returns the response.

![Copilot calling a running service and showing the response.](/img/editor/copilot/try-it.png)

## Debug Runtime Issues

Copilot can run your integrations and read the runtime logs to debug issues as they occur.

![Copilot debugging an integration by reproducing the failing request, inspecting the HTTP response and service logs, and identifying a case-sensitivity bug in the team filter.](/img/editor/copilot/debugging-using-service-logs.png)

## Preserve Chat History

Copilot saves each project's conversation, so it stays available after you reload or restart the editor. History is tied to the project's location on disk, so it no longer appears if you move, rename, or open the project from a different path.

You can also reset the conversation in two ways:

- **New Chat**: Clears the current project's history and starts a fresh conversation.
- **Restore Checkpoint**: Rolls your integration back to a saved checkpoint, undoing the changes Copilot made afterward and removing the later prompts.

## See also

- [Getting started](getting-started.md) — Sign in to WSO2 Integrator Copilot.
- [Customize Copilot](customize-copilot.md) — Give Copilot project instructions, reusable skills, and your own tools through MCP servers.
- [Generate tests with AI](../../develop-and-test/test/ai-generated-cases.md) — Use Copilot to generate test cases.
- [AI data mapper](../../develop-and-test/integration-artifacts/supportive-artifacts/data-mapper/ai-mapping.md) — Generate data mappings using AI.
- [Try-It tool](../../develop-and-test/test/try-it-tool/try-it-tool.md) — Test services without leaving the editor.
- [Copilot architecture and data handling](copilot-architecture.md) — How Copilot handles your data.
