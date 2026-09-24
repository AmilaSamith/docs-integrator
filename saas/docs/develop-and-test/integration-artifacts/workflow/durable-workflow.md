---
title: Durable Workflow
---

# Durable Workflow

A Durable Workflow is a long-running workflow artifact that can be interrupted by events, wait on timers, involve human tasks, and recover its state after a crash or restart — as opposed to a single request/response flow that runs start to finish in one execution.

## When to use it

Reach for a Durable Workflow instead of a regular integration flow when the process:

- Spans a long period of time (hours, days, or longer) rather than completing in one request.
- Needs to pause and wait for an external event, a timer, or a person to complete a step before continuing.
- Must survive a restart or crash partway through without losing its place.

## Creating a Durable Workflow

## What's next

- [Durable Agentic Workflow](durable-agentic-workflow.md) — the same durable execution model, with an AI agent driving the workflow's decisions
- [Automation](../automation.md) — for scheduled or on-demand logic that doesn't need to pause and resume
- [AI Agents](../ai-integrations/agents/agents.md) — the AI agent building block, usable inside a workflow
