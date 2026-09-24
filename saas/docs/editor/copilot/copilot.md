---
title: WSO2 Integrator Copilot
---

# WSO2 Integrator Copilot

If you have already [signed up for WSO2 Cloud](../../get-started/cloud-setup.md) and are working in the cloud editor, WSO2 Integrator Copilot uses the same authentication and is ready to use. Otherwise, sign in from the Copilot welcome screen.

## Sign in from the Copilot welcome screen

1. In your WSO2 Integrator project view, open Copilot by clicking the **Generate with AI** button, or the **Open WSO2 Integrator Copilot** icon in the top-right corner of the editor toolbar.

   ![Open WSO2 Integrator Copilot icon](/img/editor/copilot/open-copilot-icon.png)

2. The Copilot welcome screen opens with the available sign-in options.

   ![WSO2 Integrator Copilot welcome screen](/img/editor/copilot/copilot-sign-in.png)

   - **Login using WSO2 Integration Platform** (recommended): Sign in with your WSO2 Cloud account.
   - **Enter your [Anthropic API key](https://platform.claude.com/settings/keys)**: Use your own Anthropic key to power Copilot.
   - **Enter your [AWS Bedrock credentials](https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html)**: Use your AWS Bedrock account.
   - **Enter your [Google Vertex AI credentials](https://docs.cloud.google.com/vertex-ai/docs/authentication)**: Use your Google Vertex AI account.

3. Select one option and complete the sign-in. Once authenticated, Copilot opens its chat view and is ready to use.

   ![WSO2 Integrator Copilot signed in](/img/editor/copilot/copilot-welcome.png)

:::info Terms of use and data handling
By signing in, you agree to the WSO2 Integrator Copilot Terms of Use shown on the welcome screen. See [Copilot architecture and data handling](copilot-architecture.md) for how Copilot handles your data.

## Chat controls

The chat input bar is where you type prompts and control how Copilot responds. It groups the following controls:

![Copilot chat controls: the slash palette listing commands and built-in skills, the Edit/Plan mode toggle, web access, attach context, and send.](/img/editor/copilot/copilot-chat-controls.png)

| # | Control | Description |
|---|---|---|
| 1 | **Commands** | Task-specific entry points shipped with Copilot: `/typecreator`, `/ask`, `/openapi`, `/doc`. Accessible by typing `/` in the chat or selecting the `/` icon. |
| 2 | **Built-in skills** | Domain playbooks Copilot applies while it writes code: data mapping, AI agents, workflows. Invoke them explicitly or let Copilot pick. |
| 3 | **Edit / Plan mode** | **Edit** applies changes to your project directly. **Plan** returns a proposed approach first, with no code written until you accept. |
| 4 | **Web access** | Toggles whether Copilot may search the web for current documentation and references while answering. |
| 5 | **Slash palette** | Selecting it opens the command and skill list, the same list you get by typing `/` in the message field. |
| 6 | **Attach context** | Adds files, specs, or images to the request so Copilot works from your material rather than assumptions. |
| 7 | **Send** | Submits the prompt with the mode, web setting, and attachments currently selected. |

## Slash commands

Type `/` in the Copilot input bar to invoke a command for a specific task. You can also invoke an enabled skill directly: type `/` and select the skill from the list, for example `/data-map`.

| Command | Description |
|---|---|
| `/ask` | Ask questions about Ballerina to be answered based on the documentation. |
| `/doc` | Generate documentation for your integration. |
| `/openapi` | Import OpenAPI specifications. |
| `/typecreator` | Create custom types. |
| `/data-map` | [Generate data mappings](../../develop-and-test/integration-artifacts/supportive-artifacts/data-mapper/ai-mapping.md). |
| `/natural-programming` | Experimental. Generate code from requirements and check for drift. |

`/ask` answers only from the Ballerina documentation and does not use your codebase context. For questions about your code or any other topic, message Copilot directly without a command. `/data-map` is powered by the built-in `data-map` skill rather than a command.

## Modes

Copilot has two modes: plan and edit. Switch between them using the toggle in the Copilot input bar.

- **Edit Mode**: Copilot starts generating immediately and applies the changes to your integration. Best for quick edits.
- **Plan Mode**: Copilot first proposes a high-level plan with a step-by-step task breakdown. Review or revise the plan, then approve it to begin generation.

  ![Plan mode showing a structured step-by-step breakdown of execution tasks.](/img/editor/copilot/plan-mode.png)

## What's next

- [Built-in Capabilities](capabilities.md) — Explore planning, review, testing, and more.
- [Customize Copilot](customize-copilot.md) — Give Copilot project instructions, reusable skills, and your own tools through MCP servers.
