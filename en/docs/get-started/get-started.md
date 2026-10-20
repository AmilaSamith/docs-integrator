---
sidebar_position: 0
sidebar_label: Get Started
title: Get Started
description: Placeholder Get Started section, demonstrating a category with sub-sections filled by sample pages instead of real onboarding content.
hide_table_of_contents: true
wide_layout: true
slug: /get-started
---

# Get Started

Placeholder for a product's own "Get Started" flow -- on a real product
branch this is usually the first thing a new reader sees: sign-up/setup,
core vocabulary, then a quickstart that matches what they're trying to
build. The two sub-sections below (Cloud Setup, Quickstarts) are sample
pages demonstrating the shape, not real onboarding instructions.

Kept at the same paths (`get-started/cloud-setup`, `get-started/concepts`)
[Platform Overview](/platform-overview) already links to, from before
this section existed -- so replacing the sample content below with real
content, or deleting this section entirely once a product provides its
own, needs those links in `docs/platform-overview/platform-overview.md`
updated too (that page is copied verbatim from `saas`, not authored
here -- see its own frontmatter). Quickstarts now links to real AI
Agent / Durable Agent content copied from `wso2-integrator`, not a
sample page -- `platform-overview.md`'s own quickstart link was updated
to match.

<PaletteGrid>

<PaletteCard icon="cloud" href="/get-started/cloud-setup">
  <h3 class="palette-card-title">Cloud Setup</h3>
  <p class="palette-card-desc">Sample page -- on a real product, sign-up/environment setup instructions would go here.</p>
</PaletteCard>

<PaletteCard icon="book" href="/get-started/concepts">
  <h3 class="palette-card-title">Concepts</h3>
  <p class="palette-card-desc">Sample page -- on a real product, the vocabulary used across its docs would go here.</p>
</PaletteCard>

<PaletteCard icon="quickstart">
  <h3 class="palette-card-title">Quickstarts</h3>
  <p class="palette-card-desc">A sub-section with a few sample quickstart pages, one per style of thing a reader might want to build first.</p>
  <div class="palette-chip-row">
    <PaletteChip href="/get-started/quickstarts/build-ai-agent">AI Agent</PaletteChip>
    <PaletteChip href="/get-started/quickstarts/build-durable-agent">Durable Agent</PaletteChip>
  </div>
</PaletteCard>

</PaletteGrid>

## What's next

- [Cloud setup](cloud-setup.md) — Sample page for sign-up/environment setup.
- [Concepts](concepts/concepts.mdx) — Sample page for a vocabulary/glossary-style page.
- [Quickstarts: AI Agent](quickstarts/build-ai-agent.md) — Build your first AI agent in under 10 minutes.
- [Quickstarts: Durable Agent](quickstarts/build-durable-agent.md) — Build a human-in-the-loop durable agentic workflow.
