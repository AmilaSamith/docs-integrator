---
title: Platform overview
---

# Platform overview

The **WSO2 Integration Platform** is an open-source integration platform for connecting **AI agents, APIs, data, events, applications, and services** across cloud, on-premises, and hybrid environments.

As an integration developer, you use the platform to:

- build integrations and workflows
- connect to enterprise and SaaS systems
- expose business capabilities as APIs
- process events and messages
- process and exchange files
- transform data between systems
- build AI-powered integrations and agents
- deploy integrations to managed or self-managed environments
- manage and observe integrations throughout their lifecycle

The platform is designed to separate **how you develop an integration** from **where the integration runs and how it is operated**.

> **Core mental model**
>
> **Develop → Build & Validate → Deploy → Test → Promote → Operate**
>
> Development environments such as **Development**, **Staging**, and **Production** are deployment environments within this lifecycle. They are not lifecycle steps themselves.

![WSO2 Integration Platform architecture](/img/platform-overview/platform-overview-architecture.png)

## Platform architecture

The platform can be understood through three primary concerns:

| Area | Responsibility |
| --- | --- |
| **Development** | Create, edit, test, debug, and package integration artifacts |
| **Control plane** | Deploy, manage, configure, and observe integrations |
| **Data plane** | Execute integration workloads |

The **control plane does not execute the integration business logic**. Integrations run in the **data plane**.

This separation allows the same development approach to be used across different deployment models.

---

# WSO2 Integrator

**WSO2 Integrator** is the development environment used to create integration projects and applications.

It supports both **visual development** and **source-code development**. These are different ways of working with the same integration source rather than separate implementation models.

## Visual development

Use the visual development experience to:

- construct integration flows
- add triggers and entry points
- configure connectors and connections
- add processing steps
- define routing and control flow
- map data
- configure integration settings

## Source-code development

Use the source editor when you need direct control over the implementation, including:

- custom logic
- reusable functions
- advanced expressions
- typed data structures
- code-level integration patterns

## Editors

WSO2 Integrator provides focused editors for common development tasks:

| Editor | Use it to |
| --- | --- |
| **Flow Diagram editor** | Build integration logic visually |
| **Service Design editor** | Define service interfaces |
| **Expression editor** | Create and edit expressions |
| **Type editor** | Define reusable data types |
| **Type Diagram editor** | Visualize type relationships |
| **Configure editor** | Configure integration and service settings |
| **Data Mapper editor** | Map data between source and target structures |
| **GraphQL editor** | Design GraphQL services and types |

> **Development model**
>
> Start with visual development when it helps you model the flow quickly. Move to source code when the integration requires more direct control. Both views work with the same underlying integration source.

![WSO2 Integrator development experience](/img/platform-overview/integrator-development-experience.png)

---

# What you can build

WSO2 Integrator supports several integration styles.

## Integrations as APIs

Build APIs that expose business capabilities, orchestrate backend systems, or provide a modern interface to legacy applications.

```text
Client
  |
  v
API Entry Point
  |
  +--> Validate
  |
  +--> Transform
  |
  +--> Invoke backend systems
  |
  +--> Compose response
  |
  v
Response
```

Typical use cases include:

- exposing backend functionality as APIs
- composing multiple services behind one API
- transforming request and response models
- orchestrating synchronous business processes

![Integrations as APIs](/img/platform-overview/integrations-as-apis.png)

---

## Event-driven integrations

Build integrations that react to messages or events instead of requiring a synchronous request.

```text
Event Producer
      |
      v
Message Broker
      |
      v
Event Listener
      |
      +--> Validate
      |
      +--> Transform
      |
      +--> Enrich
      |
      +--> Route
      |
      v
Downstream Systems
```

Typical use cases include:

- asynchronous business processing
- event routing
- real-time notifications
- data synchronization
- event enrichment
- decoupled application architectures

Supported technologies can include messaging and streaming systems such as Kafka, JMS, MQTT, and other systems available through WSO2 connectivity options.

![Event-driven integration](/img/platform-overview/event-driven-integration.png)

---

## File-driven integrations

Build integrations triggered by file creation, modification, or movement.

Typical use cases include:

- B2B file exchange
- file transformation
- file validation
- encryption and decryption
- file signing and verification
- partner file processing
- legacy-system integration

Example:

```text
Inbound File
     |
     v
Read / Validate
     |
     v
Transform
     |
     v
Secure / Process
     |
     v
Partner Repository
```

---

## Task automations

Run integration logic on a predefined schedule.

Typical use cases include:

- scheduled data synchronization
- batch processing
- recurring reports
- periodic cleanup
- scheduled data exchange

```text
Schedule
   |
   v
Automation
   |
   +--> Read source
   +--> Process data
   +--> Update target
   |
   v
Completion
```

---

## AI and agent integrations

Build AI-powered integration solutions by connecting AI models, agents, enterprise systems, data, knowledge bases, and tools.

You can use integration capabilities to:

- invoke AI models
- build AI agents
- connect agents to enterprise systems
- integrate knowledge bases
- implement RAG-based solutions
- expose tools and enterprise capabilities through MCP
- combine deterministic integration logic with AI-driven decisions

Example:

```text
User / Application
        |
        v
Integration API
        |
        v
AI Agent
   /    |    \
  /     |     \
CRM   Knowledge  Order System
      Base
        |
        v
Decision / Action
        |
        v
Response
```

The integration layer can provide the connectivity, orchestration, transformation, security, and enterprise-system access required by an AI workflow.

![AI-enabled integration](/img/platform-overview/ai-enabled-integration.png)

---

# Connectivity

Connectivity determines how an integration communicates with external systems.

WSO2 provides a broad connector ecosystem for enterprise applications, SaaS applications, databases, messaging systems, cloud services, and AI services.

The public WSO2 platform currently advertises **600+ connectors**.

A connection represents the configuration required to communicate with a target system and can be reused by integration logic.

Example:

```text
Integration
    |
    +---- Salesforce connection
    |
    +---- PostgreSQL connection
    |
    +---- Kafka connection
    |
    +---- HTTP connection
```

Use connectors when you need application-specific operations. Use supported protocols directly when your integration requires lower-level control.

---

# Data transformation

Different systems often represent the same business data differently.

WSO2 Integrator provides transformation capabilities for mapping source structures to target structures.

```text
Source Data
     |
     v
Data Mapper
     |
     +--> Rename fields
     +--> Convert types
     +--> Restructure objects
     +--> Map arrays
     +--> Apply expressions
     |
     v
Target Data
```

Use the **Data Mapper editor** for visual mapping and the **Expression editor** when a transformation requires direct expression-based logic.

---

# Integration logic and control flow

Integration flows commonly require more than a simple sequence of calls.

You can implement:

- conditions
- routing
- loops
- reusable functions
- validation
- error handling
- retries
- alternative processing paths

For example:

```text
                +--> Condition A --> System A
Request --> Validate
                +--> Condition B --> System B
```

or:

```text
Event
  |
  v
Read items
  |
  v
Iterate
  |
  v
Process each item
  |
  v
Publish result
```

---

# Deployment architecture

A key platform concept is the separation between the **control plane** and the **data plane**.

```text
Developer
    |
    v
WSO2 Integrator
    |
    v
Integration Artifact
    |
    v
Control Plane
    |
    +-------------------+
    |                   |
    v                   v
Data Plane A       Data Plane B
    |                   |
    v                   v
Runtime              Runtime
```

### Control plane

The control plane is responsible for lifecycle operations such as:

- deployment
- environment management
- runtime management
- configuration
- access control
- observability and monitoring

### Data plane

The data plane is where your integrations actually execute.

Depending on the deployment model, the data plane can run in infrastructure such as:

- WSO2-managed cloud infrastructure
- your cloud infrastructure
- Kubernetes
- OpenShift
- Docker
- virtual machines
- bare metal

![Control plane and data plane](/img/platform-overview/control-plane-and-data-plane.png)

---

# Deployment options

The platform supports different operating models depending on where you want your control plane and data plane to run.

Use **WSO2 Cloud - Integration Platform** when you want a managed platform experience.

WSO2 operates the platform infrastructure while you focus on building, deploying, managing, and observing integrations.

Typical benefits include:

- no control-plane infrastructure to install
- managed deployment workflows
- managed environments
- managed observability
- managed secret storage
- built-in platform operations

Use a **private data plane** when your integration workloads need to run in infrastructure you control while still using WSO2 Cloud capabilities for management.

Typical environments include:

- AWS
- Azure
- Google Cloud
- Kubernetes
- OpenShift

This model is useful when data residency, network topology, or internal infrastructure requirements require runtime workloads to stay within your environment.

Use a **self-hosted deployment** when your organization needs control over the platform infrastructure.

Typical environments include:

- Kubernetes
- OpenShift
- Docker
- virtual machines
- bare metal
- air-gapped environments

You can use the **Integration Control Plane (ICP)** to centrally manage self-hosted WSO2 Integrator runtimes.

---

# Control planes

WSO2 Integrator supports two primary control-plane options:

| Control plane | Operating model | Typical use |
| --- | --- | --- |
| **WSO2 Cloud - Integration Platform** | Managed SaaS | Managed cloud operations |
| **Integration Control Plane (ICP)** | Self-hosted | On-premises, private cloud, or air-gapped environments |

Both control-plane models provide centralized management of deployed integrations, but they differ in where the management infrastructure runs and how much infrastructure you operate.

> **Important**
>
> The control plane manages the integration runtime. It is not the execution environment for your integration logic.

![WSO2 Cloud vs Integration Control Plane comparison](/img/platform-overview/control-plane-comparison.png)

---

# Environments

Environments are deployment targets used to separate stages of your integration lifecycle.

A common setup is:

```text
Development
     |
     v
Staging
     |
     v
Production
```

Each environment can have its own runtime configuration, endpoints, secrets, scaling behavior, and access controls.

The important distinction is:

```text
Lifecycle action          Environment
-----------------         -----------
Develop                    Development
Build                      Development
Test                       Development / Staging
Promote                    Staging / Production
Operate                    Production
```

**Development**, **Staging**, and **Production** are environments. **Develop**, **Build**, **Test**, **Promote**, and **Operate** are lifecycle activities.

This distinction becomes important when designing CI/CD pipelines and promotion workflows.

---

# Integration lifecycle

Treat integrations as software artifacts and manage them through a repeatable development and delivery lifecycle.

The recommended conceptual flow is:

```text
Develop
   |
   v
Source Control
   |
   v
Build & Validate
   |
   v
Deploy
   |
   v
Test
   |
   v
Promote
   |
   v
Approve
   |
   v
Operate & Observe
   |
   v
Improve
   |
   +----------------------> Develop
```

Deployment environments sit within this lifecycle:

```text
                     Lifecycle
                         |
       +-----------------+------------------+
       |                 |                  |
       v                 v                  v
   Development         Staging          Production
       |                 |                  |
       +------ Deploy / Promote ------------+
```

A practical implementation can therefore look like:

```text
Developer
   |
   v
Source Control
   |
   v
Build & Validate
   |
   v
Deploy to Development
   |
   v
Test
   |
   v
Promote to Staging
   |
   v
Validate / Approve
   |
   v
Promote to Production
   |
   v
Observe & Operate
```

![Integration lifecycle](/img/platform-overview/integration-lifecycle.png)

---

# Configuration and secrets

Keep integration logic separate from environment-specific configuration and sensitive values.

Examples of environment-specific configuration include:

- endpoint URLs
- database connection settings
- queue and topic names
- credentials
- API keys
- operational parameters
- feature flags

A common deployment model is:

```text
Same integration artifact
         |
         +--> Development configuration
         |
         +--> Staging configuration
         |
         +--> Production configuration
```

This makes it possible to promote the same integration artifact across environments without changing its implementation.

---

# Security

Integration solutions often process sensitive business information, credentials, and confidential data.

Apply security throughout the lifecycle.

## During development

- do not hard-code credentials
- validate external input
- use secure configuration
- minimize privileges

## At runtime

- secure inbound APIs
- protect connections to external systems
- encrypt sensitive information where required
- restrict access to runtime resources
- monitor authentication and authorization failures

## During deployment

- keep secrets outside source code
- separate environment configuration
- restrict deployment permissions
- maintain an auditable release process

---

# Observability

Production integrations need visibility into runtime behavior.

Observability typically includes:

- **Logs** — detailed execution and error information
- **Metrics** — throughput, failures, latency, and resource behavior
- **Traces** — request and execution paths across distributed systems

A typical operational flow is:

```text
Integration Runtime
       |
       +--> Logs
       +--> Metrics
       +--> Traces
       |
       v
Observability
       |
       +--> Monitor
       +--> Diagnose
       +--> Alert
       +--> Troubleshoot
```

Use observability to answer questions such as:

- Is the integration running?
- Are requests or events being processed?
- Where are failures occurring?
- Which downstream dependency is slow?
- How long does an execution take?
- Are retries increasing?
- Which runtime instance is affected?

---

# A developer's view of the platform

For day-to-day development, use this model:

```text
                         WSO2 Integration Platform
                                  |
                  +---------------+---------------+
                  |                               |
                  v                               v
             Development                    Operations
                  |                               |
                  v                               v
          WSO2 Integrator                    Control Plane
                  |                               |
                  v                               v
         Integration Artifact                  Deploy
                  |                               |
                  +-------------------------------+
                                  |
                                  v
                              Data Plane
                                  |
                                  v
                         Integration Runtime
                                  |
                 +----------------+----------------+
                 |                |                |
                 v                v                v
                APIs            Events           Files
                 |                |                |
                 +----------------+----------------+
                                  |
                                  v
                       Enterprise / AI Systems
                                  |
                                  v
                           Observe & Operate
```

The two most important platform concepts are:

> **The development environment creates the integration artifact.**

> **The control plane manages the artifact and runtime; the data plane executes the integration.**

---

# Where to go next

Start with [Create your first integration](../develop/get-started/create-your-first-integration).

Learn how to create a project, add an integration, configure an entry point, and implement a simple flow.

Explore [Connectors](../develop/connectors/overview) to learn how to connect integrations to databases, SaaS applications, APIs, messaging systems, and other platforms.

Learn how to build [Integrations as APIs](../develop/integrations-as-apis/overview).

Learn how to build [Event-driven integrations](../develop/event-driven/overview).

Learn how to build [File-driven integrations](../develop/file-integrations/overview).

Explore [AI and agent integrations](../develop/ai/overview).

Learn about [Deployment options](../deploy/overview), environments, runtime configuration, and deployment models.

{/* NOTE: intentional divergence -- this is the saas (cloud console)
    copy, so this links at /manage/overview. wso2-integrator's copy of
    this file points this same link at /icp (Integration Control
    Plane) instead, since self-hosted management goes through that,
    not this cloud-only page. */}
Learn about [Management and observability](/manage/overview), runtime operations, monitoring, and troubleshooting.

---

# Related concepts

- [Core concepts](../get-started/concepts/core)
- [Projects and artifacts](../develop/projects/overview)
- [Connectors and connections](../develop/connectors/overview)
- [Data mapping](../develop/data-mapping/overview)
- [Deployment](../deploy/overview)
- [Control planes](./choosing-a-control-plane)
- [Observability](/operate/observability-overview)
