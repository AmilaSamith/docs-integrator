---
title: Durable Agentic Workflow
description: A durable workflow driven by an AI agent's decisions, combining long-running, crash-recoverable execution with autonomous reasoning.
keywords: [wso2 integrator, durable agentic workflow, ai agent, long-running, crash recovery]
slug: /develop-and-test/integration-artifacts/workflow/durable-agentic-workflow
---

# Durable Agentic Workflow

<!-- TODO: this artifact type is very new in the editor's "Add Artifact"
     panel and is not yet covered by the published WSO2 Integrator docs
     (bi.docs.wso2.com) or discoverable Ballerina Central packages as of
     writing. The paragraph below is inferred from the panel's own
     "Durable Workflow" tooltip text ("Long-running workflow logic with
     events, timers, human tasks, and crash recovery") plus the existing,
     already-documented AI Agents building block — not from any confirmed
     source specific to this artifact type. Replace this section once the
     actual feature can be verified: steps, screenshots, configuration
     fields, and any Ballerina code. -->

A Durable Agentic Workflow combines the [Durable Workflow](durable-workflow.md) execution model — long-running, interruptible by events and timers, recoverable after a crash or restart — with an [AI agent](../ai-integrations/agents/agents.md) driving the workflow's decisions at each step, instead of (or alongside) fixed logic.

## When to use it

Reach for a Durable Agentic Workflow instead of a plain Durable Workflow when the process needs an agent to reason about what to do next at one or more points — for example, deciding which branch to take, what tool to call, or how to respond to a human task's outcome — while still needing the durability guarantees (surviving restarts, waiting on timers or events) that a plain request/response agent invocation doesn't provide.

## Creating a Durable Agentic Workflow

<!-- TODO: Visual Designer walkthrough not yet written. Add the creation-form
     screenshot and field table here once available. -->

## What's next

- [Durable Workflow](durable-workflow.md) — the same durable execution model, without an agent driving it
- [AI Agents](../ai-integrations/agents/agents.md) — the agent building block (model, system prompt, tools, memory) used inside this workflow
- [Creating an Agent](../ai-integrations/agents/create-an-agent.md) — configure the agent's role, instructions, and tools
