---
title: Durable Agentic Workflow
---

# Durable Agentic Workflow

A Durable Agentic Workflow combines the [Durable Workflow](durable-workflow.md) execution model — long-running, interruptible by events and timers, recoverable after a crash or restart — with an [AI agent](../ai-integrations/agents/agents.md) driving the workflow's decisions at each step, instead of (or alongside) fixed logic.

## When to use it

Reach for a Durable Agentic Workflow instead of a plain Durable Workflow when the process needs an agent to reason about what to do next at one or more points — for example, deciding which branch to take, what tool to call, or how to respond to a human task's outcome — while still needing the durability guarantees (surviving restarts, waiting on timers or events) that a plain request/response agent invocation doesn't provide.

## Creating a Durable Agentic Workflow

## What's next

- [Durable Workflow](durable-workflow.md) — the same durable execution model, without an agent driving it
- [AI Agents](../ai-integrations/agents/agents.md) — the agent building block (model, system prompt, tools, memory) used inside this workflow
- [Creating an Agent](../ai-integrations/agents/create-an-agent.md) — configure the agent's role, instructions, and tools
