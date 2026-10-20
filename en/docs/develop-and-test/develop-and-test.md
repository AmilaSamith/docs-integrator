---
title: "Develop and Test"
description: "Build AI integrations -- chat agents, MCP, RAG, and direct LLM calls -- with WSO2 Agent Builder."
sidebar_label: Overview
sidebar_position: 0
slug: /develop-and-test
hide_table_of_contents: true
wide_layout: true
---

# Build Your Integration

This section covers the Develop and Test phase of the [integration lifecycle](product://integrator/platform-overview#from-development-to-production): building integrations in the WSO2 Integrator editor before anything ships. We assume you're already familiar with the editor's surfaces from the [Editor Tour](../editor/editor.md).

:::tip
Start building your integration by prompting [WSO2 Integrator Copilot](../editor/copilot/copilot.md) to generate a first working version of your integration flow, refine it on the visual designer, and drop into Ballerina pro-code only when you need more precise control; everything stays in sync throughout.
:::

## Create Integration Workspace

<PaletteGrid>

<PaletteCard icon="quickstart" href="/develop-and-test/create-workspace">
  <h3 class="palette-card-title">Create integrations</h3>
  <ul class="palette-card-list">
    <li>Start new integration project</li>
    <li>Explore samples</li>
    <li>Build libraries</li>
  </ul>
</PaletteCard>

<PaletteCard icon="editor-window" href="/editor">
  <h3 class="palette-card-title">Editor Tour<span class="palette-card-badge">Prerequisite</span></h3>
  <ul class="palette-card-list">
    <li>Workspace and views</li>
    <li>Editors and canvases</li>
    <li>WSO2 Integrator Copilot</li>
  </ul>
</PaletteCard>

</PaletteGrid>

Moving from another platform? See [Migrate](product://integrator/migrate).

## Build Integration

<div class="palette-card--standalone">

<PaletteCard icon="ai" href="/editor/copilot">
  <h3 class="palette-card-title">Build with Copilot</h3>
  <ul class="palette-card-list">
    <li>Prompt Copilot to generate a first working version</li>
    <li>Works across artifacts, logic, and data mapping</li>
    <li>Iterate in chat, then refine visually or in code</li>
  </ul>
</PaletteCard>

</div>

<div class="palette-group">

<p class="palette-group-label">Or build visually</p>

<PaletteGrid>

<PaletteCard icon="artifacts" href="/develop-and-test/integration-artifacts">
  <h3 class="palette-card-title">Add Integration artifacts</h3>
  <ul class="palette-card-list">
    <li>Chat agents and MCP services</li>
    <li>RAG and direct LLM calls</li>
    <li>AI building blocks</li>
  </ul>
</PaletteCard>

<PaletteCard icon="canvases" href="/editor/canvases/flow-canvas">
  <h3 class="palette-card-title">Design integration logic</h3>
  <ul class="palette-card-list">
    <li>Flow Canvas with Node Palette</li>
    <li>Control flow and error handling</li>
    <li>Expressions and query expressions</li>
    <li>Ballerina pro-code</li>
  </ul>
</PaletteCard>

</PaletteGrid>

</div>

## What's next

- [Create a new integration](create-workspace/create-a-project.md) — Start a project in the WSO2 Integrator or from the CLI
- [Design integration logic](../editor/canvases/flow-canvas/flow-canvas.md) — Wire up the flow between request and response
- [Deploy and operate](product://integrator/deploy-and-run) — Ship your integration once it's ready
