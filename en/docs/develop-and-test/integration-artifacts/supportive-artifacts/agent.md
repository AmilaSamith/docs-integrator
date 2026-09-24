---
title: Agent
description: A reusable AI agent definition you can reference from a Chat Agent Service, an MCP Service, or a workflow, instead of defining the agent inline each time.
keywords: [wso2 integrator, agent, ai agent, reusable, supporting artifact]
slug: /develop-and-test/integration-artifacts/supportive-artifacts/agent
---

# Agent

<!-- TODO: as a standalone item under "Other Artifacts" (as opposed to the
     AI Chat Agent Wizard under AI Integration), this is not yet covered
     by the published WSO2 Integrator docs as of writing. This page
     currently treats it as the same underlying AI agent building block
     described in ../ai-integrations/agents/agents.md, exposed here as a reusable,
     standalone artifact rather than one scaffolded together with a chat
     service. Verify that framing against the actual feature and replace
     this note once confirmed -- add creation steps and screenshots. -->

An Agent artifact is a standalone AI agent definition — the same model, system prompt, tools, and memory building blocks described in [AI Agents](../ai-integrations/agents/agents.md) — defined once as a reusable artifact so you can reference it from more than one place, instead of configuring it inline every time. Use it the same way you'd use a [Connection](connections.md) or a [Type](types.md): define it once under **Other Artifacts**, then reference it from a Chat Agent Service, an MCP Service, or a [Durable Agentic Workflow](../workflow/durable-agentic-workflow.md).

## Creating an Agent

<!-- TODO: Visual Designer walkthrough not yet written. Add the creation-form
     screenshot and field table here once available. -->

## What's next

- [AI Agents](../ai-integrations/agents/agents.md) — the model, system prompt, tools, and memory components that make up an agent
- [Creating an Agent](../ai-integrations/agents/create-an-agent.md) — the AI Chat Agent Wizard walkthrough
- [Durable Agentic Workflow](../workflow/durable-agentic-workflow.md) — use an agent to drive a durable workflow's decisions
