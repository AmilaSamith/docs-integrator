---
title: Durable Workflow
description: Design long-running workflow logic that survives restarts, waits on events and timers, and involves human tasks.
keywords: [wso2 integrator, durable workflow, long-running, crash recovery]
slug: /develop-and-test/integration-artifacts/workflow/durable-workflow
---

# Durable Workflow

<!-- TODO: this artifact type is very new in the editor's "Add Artifact"
     panel and is not yet covered by the published WSO2 Integrator docs
     (bi.docs.wso2.com) or discoverable Ballerina Central packages as of
     writing. The paragraph below is based only on the panel's own
     tooltip text, verified against a real screenshot: "Long-running
     workflow logic with events, timers, human tasks, and crash recovery."
     Everything past that single sentence needs to be written from the
     actual feature once it's available to document properly -- steps,
     screenshots, configuration fields, and any Ballerina code. -->

A Durable Workflow is a long-running workflow artifact that can be interrupted by events, wait on timers, involve human tasks, and recover its state after a crash or restart — as opposed to a single request/response flow that runs start to finish in one execution.

## When to use it

Reach for a Durable Workflow instead of a regular integration flow when the process:

- Spans a long period of time (hours, days, or longer) rather than completing in one request.
- Needs to pause and wait for an external event, a timer, or a person to complete a step before continuing.
- Must survive a restart or crash partway through without losing its place.

## Creating a Durable Workflow

<!-- TODO: Visual Designer walkthrough not yet written. Add the creation-form
     screenshot and field table here once available. -->

## What's next

- [Durable Agentic Workflow](durable-agentic-workflow.md) — the same durable execution model, with an AI agent driving the workflow's decisions
- [Automation](../automation.md) — for scheduled or on-demand logic that doesn't need to pause and resume
- [AI Agents](../ai-integrations/agents/agents.md) — the AI agent building block, usable inside a workflow
