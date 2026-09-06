---
title: AI Integrations Overview
description: Build AI-powered integrations with WSO2 Integrator using direct LLM calls, RAG pipelines, AI agents, and MCP servers.
keywords: [wso2 integrator, genai, ai, llm, rag, agent, mcp, natural function, model provider, embedding, vector store, knowledge base]
sidebar_label: Overview
slug: /develop/ai/overview
---

# AI Integrations

WSO2 Integrator lets you build AI-powered integrations, including direct LLM calls, RAG pipelines, AI agents, and MCP servers.

## Getting started

- **[Build a Sentiment Analyzer](../../guides/ai-tutorials/build-a-sentiment-analyzer.md):** Your first AI integration with a direct LLM call.
- **[Build a Hotel Finder Agent](../../guides/ai-tutorials/build-a-hotel-finder-agent.md):** An agent with two custom tools and session-scoped memory.

## Develop AI applications

- **[Direct LLM calls](direct-llm/overview.md):** The simplest AI block. Send a prompt and bind the response to a typed value, in a single round-trip.
- **[RAG](rag/overview.md):** Retrieval-augmented generation that grounds LLM responses in your own documents by retrieving relevant content at query time and injecting it into the prompt.
- **[AI agents](agents/overview.md):** Autonomous LLM-driven agents that reason over a system prompt, call tools, and maintain conversation state across turns.
- **[MCP integration](mcp/overview.md):** Expose your integrations as MCP tools for AI assistants, or use external MCP tools with your agents.
- **[Natural functions](natural-functions/overview.md):** (Experimental) Write the function body in plain English. The LLM returns a value that conforms to your declared return type.
- **[Model providers](components/model-providers.md):** Connect to OpenAI, Anthropic, Azure OpenAI, Google Vertex, Mistral, and others through one consistent interface.
- **[Embedding providers](components/embedding-providers.md):** Turn text into semantic vectors used on both ingest and query for similarity search.
- **[Vector stores](components/vector-stores.md):** Persist embeddings and run similarity search across in-memory, Pinecone, pgvector, Weaviate, or Milvus vector databases.
- **[Knowledge bases](components/knowledge-bases.md):** The indexable document store RAG reads from and writes to, composed of a vector store, embedding provider, and chunker.
- **[Chunkers](components/chunkers.md):** Split documents into chunks before embedding. Smaller chunks improve retrieval precision. Larger chunks preserve more surrounding context.

## Tutorials

- **[Email Generator with Direct LLM](../../guides/ai-tutorials/email-generator-direct-llm.md)**
- **[Customer review analyzer with Natural Function](../../guides/ai-tutorials/review-summarizer-natural-function.md)**
- **[Building an HR knowledge base with RAG](../../guides/ai-tutorials/building-hr-knowledge-base-rag.md)**
- **[Build a customer care agent with MCP](../../guides/ai-tutorials/building-a-customer-care-agent-mcp.md)**
- **[Building an IT Helpdesk AI Agent with Persistent Memory](../../guides/ai-tutorials/it-helpdesk-chatbot.md)**

