---
sidebar_position: 3
title: Distributed Tracing
description: Enable distributed tracing in WSO2 Integrator to follow a request across services, find latency bottlenecks, and debug failures, and choose where to send the traces.
slug: /observe/tracing
---

# Distributed Tracing

Distributed tracing follows a single request end to end as it passes through your integration and the services it calls. Each step is recorded as a **span** with its duration and details, and the spans of one request are grouped into a **trace**. Use traces to see where time is spent, identify latency bottlenecks across service boundaries, and debug request failures.

WSO2 Integrator produces traces using OpenTelemetry. You choose the backend that receives and displays them.

## Enable tracing in your integration

Tracing needs three things: observability included in the build, the extension for your tracing backend, and the tracing configuration.

### 1. Include observability in the build

Open `Ballerina.toml` and add:

```toml
[build-options]
observabilityIncluded = true
```

### 2. Import the tracing extension

In your entry point file (typically `main.bal`), import the extension for the backend you use. Use one of:

```ballerina
import ballerinax/jaeger as _;
```

```ballerina
import ballerinax/zipkin as _;
```

To export over OTLP to an OpenTelemetry Collector or any other OTLP endpoint, use the `ballerina/otel` module:

```ballerina
import ballerina/otel as _;
```

### 3. Turn tracing on

In `Config.toml`, enable tracing and name the provider (`"jaeger"`, `"zipkin"`, or `"otel"`):

```toml
[ballerina.observe]
tracingEnabled = true
tracingProvider = "jaeger"
```

Each backend also takes its own connection settings (agent host and port, sampler, and buffering) under `[ballerinax.jaeger]` or `[ballerinax.zipkin]`. Those are covered on the backend's page. The `otel` provider takes its endpoint and protocol under `[ballerina.otel]`, as shown in Send traces to AWS X-Ray and CloudWatch below.

## Sampling

Sampling controls how many requests are traced. Both Jaeger and Zipkin support the same three strategies, set with `samplerType` and `samplerParam`:

| Strategy | Parameter | Description |
|----------|-----------|-------------|
| `const` | `1.0` (on) or `0.0` (off) | Sample all or none |
| `probabilistic` | `0.0` to `1.0` | Probability of sampling each trace |
| `ratelimiting` | traces per second | Fixed rate of traces per second |

Sampling every request is fine for development. In production, use `probabilistic` or `ratelimiting` to reduce overhead while keeping visibility into your system.

## Choose a tracing backend

| Backend | Best for | Guide |
|---------|----------|-------|
| **Jaeger** | Production-grade distributed tracing | [Jaeger](open-source/jaeger.md) |
| **Zipkin** | A lightweight tracing alternative | [Zipkin](open-source/zipkin.md) |

You can also send traces to a managed platform: [Datadog](commercial/datadog.md) and [New Relic](commercial/new-relic.md) both accept traces, and [Moesif](commercial/moesif.md) supports traces alongside metrics and logs. For a complete stack that includes tracing, see the [Local Development Stack](recipes/local-development-stack.md) and [Kubernetes Production Stack](recipes/kubernetes-production-stack.md) recipes.

## Send traces to AWS X-Ray and CloudWatch

AWS X-Ray accepts OpenTelemetry traces over OTLP at `https://xray.<region>.amazonaws.com/v1/traces`, but only from requests signed with AWS Signature Version 4 (SigV4). The `ballerina/otel` module can't sign requests, so an OpenTelemetry Collector runs next to the integration: the integration sends unsigned OTLP to the collector on the loopback interface, and the collector signs each batch with the workload's IAM role and forwards it. The spans then appear in CloudWatch.

The steps below run the collector as a second process in the integration's own container. This works on any container platform, and it's the only option on Amazon Bedrock AgentCore Runtime, which runs one container per session rather than a pod that could hold a sidecar.

### Before you start

Do the following once per AWS account and Region:

1. **Enable CloudWatch Transaction Search.** In the CloudWatch console, open **Application Signals (APM)** > **Transaction Search**, choose **Enable**, and choose to ingest spans as structured logs. Spans then land in the `aws/spans` log group.
2. **Index every trace while you test.** The default indexing rule indexes 1% of traces, so a handful of test requests may index nothing:

    ```bash
    aws xray update-indexing-rule --region <region> --name "Default" \
      --rule '{"Probabilistic": {"DesiredSamplingPercentage": 100}}'
    ```

    Lower the percentage again for production traffic.

3. **Grant the workload's IAM role permission to write traces:**

    ```json
    { "Sid": "Tracing", "Effect": "Allow",
      "Action": ["xray:PutTraceSegments", "xray:PutTelemetryRecords",
                 "xray:GetSamplingRules", "xray:GetSamplingTargets"],
      "Resource": ["*"] }
    ```

    If the collector's output shows `AccessDenied` from `xray.<region>.amazonaws.com/v1/traces`, also allow `xray:PutSpans` and `xray:PutSpansForIndexing`.

### 1. Configure the integration

Include observability in the build and import `ballerina/otel` as described in Enable tracing in your integration. Then point the `otel` provider at the collector:

```toml
[ballerina.observe]
tracingEnabled = true
tracingProvider = "otel"

[ballerina.otel]
tracesEndpoint = "http://127.0.0.1:4317"
tracesProtocol = "grpc"

[ballerina.otel.tracesResourceAttributes]
"service.name" = "my-integration"

[ballerina.log]
format = "json"
```

JSON logs let CloudWatch parse each log line into fields. With tracing on, each line also carries the `traceId` and `spanId` of the request that wrote it.

This file holds no secrets, so you can copy it into the image as `/app/Config.toml`. Keep it separate from the `Config.toml` you use for local runs. `Config.toml` is strict: an unknown key, such as `[ballerinai.otel]` for `[ballerina.otel]`, stops the program at startup.

### 2. Configure the collector

Use the contrib distribution of the OpenTelemetry Collector (`otel/opentelemetry-collector-contrib`). It includes the `sigv4auth` extension and the `filter` and `transform` processors used on this page. Save the configuration as `otel-collector.yaml`:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 127.0.0.1:4317          # loopback only

extensions:
  sigv4auth:
    region: <region>
    service: xray

exporters:
  otlp_http:
    traces_endpoint: https://xray.<region>.amazonaws.com/v1/traces
    auth:
      authenticator: sigv4auth
    compression: gzip

processors:
  filter/drop_health:                     # don't trace health checks
    error_mode: ignore
    traces:
      span:
        - 'attributes["http.url"] == "/ping"'

service:
  extensions: [sigv4auth]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [filter/drop_health]
      exporters: [otlp_http]
```

The `filter/drop_health` processor drops the spans of health-check requests. On AgentCore Runtime, `/ping` is polled every few seconds, and each poll would otherwise become a billed span. Change the path to match your own health check.

The collector signs with the credentials of the environment it runs in: the execution role on AgentCore Runtime, or the task or node role elsewhere.

### 3. Run the collector in the same container

Start the collector in the background, then run the integration in the foreground so that the container lives and dies with it. Code to Cloud places the executable JAR at `/home/ballerina/jars/<package-name>.jar`. Save this as `start.sh` and make it executable (`chmod +x start.sh`):

```sh
#!/bin/sh
set -e
/usr/local/bin/otelcol --config=/etc/otel/config.yaml &
exec java -jar /home/ballerina/jars/my_integration.jar
```

Copy the collector binary out of the official image. Use the platform you deploy to, for example `linux/arm64` for AWS Graviton or Amazon Bedrock AgentCore Runtime:

```bash
mkdir -p otel
docker create --name otelcol --platform linux/arm64 otel/opentelemetry-collector-contrib:latest
docker cp otelcol:/otelcol-contrib otel/otelcol
docker rm otelcol
```

Then add the files to the image with Code to Cloud. In `Cloud.toml`, copy the collector, its configuration, the start script, and the tracing configuration into the image, and make the start script the entry point. The `entrypoint` value is the complete Dockerfile instruction:

```toml
[container.image]
repository = "<account-id>.dkr.ecr.<region>.amazonaws.com"
name = "my-integration"
tag = "v1.0.0"
entrypoint = "ENTRYPOINT [\"/home/ballerina/start.sh\"]"

[[container.copy.files]]
sourceFile = "./otel/otelcol"
target = "/usr/local/bin/otelcol"

[[container.copy.files]]
sourceFile = "./otel-collector.yaml"
target = "/etc/otel/config.yaml"

[[container.copy.files]]
sourceFile = "./start.sh"
target = "/home/ballerina/start.sh"

[[container.copy.files]]
sourceFile = "./observability.toml"
target = "/home/ballerina/Config.toml"
```

Here `observability.toml` is the file from step 1. It holds no secrets, and Ballerina reads it as `Config.toml` from the working directory, `/home/ballerina`. With `cloud = "docker"` set under `[build-options]` in `Ballerina.toml`, `bal build` generates the image with these files.

### On Amazon Bedrock AgentCore Runtime

Turn tracing on for the runtime: in the AgentCore console, open the runtime and enable **Tracing**. Spans are captured from then on; nothing earlier is backfilled. If the integration calls an AgentCore Gateway, enable tracing on the Gateway as well.

CloudWatch groups spans under an agent by resource attributes that AgentCore injects into the container as the `OTEL_RESOURCE_ATTRIBUTES` environment variable. Spans without them, in particular without `deployment.environment.name`, are classed as `Generic` and don't roll up under the agent. Copy them onto every span with two more processors:

```yaml
processors:
  resource/agent_identity:
    attributes:
      - { key: service.name,                value: "${env:AGENT_SERVICE_NAME}",      action: upsert }
      - { key: cloud.resource_id,           value: "${env:AGENT_CLOUD_RESOURCE_ID}", action: upsert }
      - { key: deployment.environment.name, value: "${env:AGENT_DEPLOYMENT_ENV}",    action: upsert }
      - { key: aws.log.group.names,         value: "${env:AGENT_LOG_GROUP}",         action: upsert }
      - { key: aws.log.stream.names,        value: "${env:AGENT_LOG_STREAM}",        action: upsert }
      - { key: cloud.platform,              value: "${env:AGENT_CLOUD_PLATFORM}",    action: upsert }
      - { key: cloud.provider,              value: "${env:AGENT_CLOUD_PROVIDER}",    action: upsert }
      - { key: cloud.region,                value: "${env:AGENT_CLOUD_REGION}",      action: upsert }

  attributes/agentcore_origin:
    actions:
      - { key: aws.xray.origin,   value: "AWS::BedrockAgentCore::Runtime", action: upsert }
      - { key: aws.resource.type, value: "AWS::BedrockAgentCore::Runtime", action: upsert }
      - { key: aws.resource.arn,  value: "${env:AGENT_CLOUD_RESOURCE_ID}", action: upsert }

service:
  extensions: [sigv4auth]
  pipelines:
    traces:
      receivers: [otlp]
      # Keep on one line: start.sh removes processors from it with sed.
      processors: [filter/drop_health, resource/agent_identity, attributes/agentcore_origin]
      exporters: [otlp_http]
```

The `service.name` in the integration's `Config.toml` becomes a fallback: these processors overwrite it with the runtime's own name.

Extend `start.sh` to read the values from `OTEL_RESOURCE_ATTRIBUTES` into the variables that the processors use. If the variable is missing, as it is when you run the image locally, an empty `${env:...}` value makes the collector exit without an error. The script therefore removes the two processors in that case:

```sh
#!/bin/sh
set -e
CONFIG=/etc/otel/config.yaml

# AgentCore injects OTEL_RESOURCE_ATTRIBUTES with the identity CloudWatch expects.
otel_attr() {
    printf '%s' "$OTEL_RESOURCE_ATTRIBUTES" | tr ',' '\n' | sed -n "s/^$1=//p" | head -1
}
AGENT_SERVICE_NAME=$(otel_attr 'service\.name')
AGENT_CLOUD_RESOURCE_ID=$(otel_attr 'cloud\.resource_id')
AGENT_DEPLOYMENT_ENV=$(otel_attr 'deployment\.environment\.name')
AGENT_LOG_GROUP=$(otel_attr 'aws\.log\.group\.names')
AGENT_LOG_STREAM=$(otel_attr 'aws\.log\.stream\.names')
AGENT_CLOUD_PLATFORM=$(otel_attr 'cloud\.platform')
AGENT_CLOUD_PROVIDER=$(otel_attr 'cloud\.provider')
AGENT_CLOUD_REGION=$(otel_attr 'cloud\.region')
export AGENT_SERVICE_NAME AGENT_CLOUD_RESOURCE_ID AGENT_DEPLOYMENT_ENV \
    AGENT_LOG_GROUP AGENT_LOG_STREAM AGENT_CLOUD_PLATFORM AGENT_CLOUD_PROVIDER \
    AGENT_CLOUD_REGION

# Outside AgentCore, drop the identity processors instead of letting the collector exit.
if [ -z "$AGENT_SERVICE_NAME" ] || [ -z "$AGENT_CLOUD_RESOURCE_ID" ] ||
    [ -z "$AGENT_DEPLOYMENT_ENV" ] || [ -z "$AGENT_LOG_GROUP" ] ||
    [ -z "$AGENT_LOG_STREAM" ] || [ -z "$AGENT_CLOUD_PLATFORM" ] ||
    [ -z "$AGENT_CLOUD_PROVIDER" ] || [ -z "$AGENT_CLOUD_REGION" ]; then
    echo "start.sh: OTEL_RESOURCE_ATTRIBUTES missing or incomplete -- tracing without AgentCore resource identity" >&2
    sed -e 's|, resource/agent_identity||' -e 's|, attributes/agentcore_origin||' \
        "$CONFIG" > /tmp/otel-config.yaml
    CONFIG=/tmp/otel-config.yaml
fi

/usr/local/bin/otelcol --config="$CONFIG" &
exec java -jar /home/ballerina/jars/my_integration.jar
```

### AI agents: the GenAI dashboard and AgentCore Evaluations

An agent built with `ballerina/ai` emits spans that follow the OpenTelemetry GenAI conventions: an `invoke_agent` span for each run, with `chat` and `execute_tool` spans beneath it. CloudWatch's **GenAI Observability** dashboard and AgentCore Evaluations read these spans, but they expect a few details that differ from what Ballerina emits. Add these processors to the agent's collector to bridge the gap:

| Processor | What it fixes |
|---|---|
| `attributes/genai_token_types` | Ballerina records token counts as strings. Without converting them to integers, the dashboard's total token count reads 0. |
| `transform/genai_total_tokens` | Adds `gen_ai.usage.total_tokens`, which the dashboard's queries use. |
| `transform/scope_name` | AgentCore Evaluations reads only spans whose instrumentation scope is named `opentelemetry.instrumentation.*`. Ballerina's scope is named `otel`. |
| `transform/genai_eval_aliases` | Copies the prompt, the answer, and the tool arguments and results to the attribute names AgentCore Evaluations reads. Without it, every evaluator receives empty input and scores it 1.0. |
| `attributes/session_id` | Copies `gen_ai.conversation.id` to `session.id`, which AWS uses to group the spans of one session. |

```yaml
processors:
  attributes/genai_token_types:
    actions:
      - { key: gen_ai.usage.input_tokens,  action: convert, converted_type: int }
      - { key: gen_ai.usage.output_tokens, action: convert, converted_type: int }

  transform/genai_total_tokens:
    error_mode: ignore
    trace_statements:
      - context: span
        statements:
          - set(span.attributes["gen_ai.usage.total_tokens"], Int(span.attributes["gen_ai.usage.input_tokens"]) + Int(span.attributes["gen_ai.usage.output_tokens"])) where span.attributes["gen_ai.usage.input_tokens"] != nil and span.attributes["gen_ai.usage.output_tokens"] != nil

  transform/scope_name:
    error_mode: ignore
    trace_statements:
      - context: scope
        statements:
          - set(scope.name, "opentelemetry.instrumentation.ballerina") where scope.name == "otel"

  transform/genai_eval_aliases:
    error_mode: ignore
    trace_statements:
      - context: span
        statements:
          - set(span.attributes["gen_ai.task.input"], span.attributes["gen_ai.input.messages"]) where span.attributes["gen_ai.operation.name"] == "invoke_agent" and span.attributes["gen_ai.input.messages"] != nil
          - set(span.attributes["gen_ai.task.output"], span.attributes["gen_ai.output.messages"]) where span.attributes["gen_ai.operation.name"] == "invoke_agent" and span.attributes["gen_ai.output.messages"] != nil
          - set(span.attributes["agentcore.invocation.user_prompt"], span.attributes["gen_ai.input.messages"]) where span.attributes["gen_ai.operation.name"] == "invoke_agent" and span.attributes["gen_ai.input.messages"] != nil
          - set(span.attributes["agentcore.invocation.agent_response"], span.attributes["gen_ai.output.messages"]) where span.attributes["gen_ai.operation.name"] == "invoke_agent" and span.attributes["gen_ai.output.messages"] != nil
          - set(span.attributes["gen_ai.tool.call.arguments"], span.attributes["gen_ai.tool.arguments"]) where span.attributes["gen_ai.operation.name"] == "execute_tool" and span.attributes["gen_ai.tool.arguments"] != nil
          - set(span.attributes["gen_ai.tool.call.result"], span.attributes["gen_ai.tool.output"]) where span.attributes["gen_ai.operation.name"] == "execute_tool" and span.attributes["gen_ai.tool.output"] != nil

  attributes/session_id:
    actions:
      - { key: session.id, from_attribute: gen_ai.conversation.id, action: upsert }
```

Add them to the pipeline, keeping the list on one line:

```yaml
      processors: [filter/drop_health, attributes/genai_token_types, transform/genai_total_tokens, transform/scope_name, transform/genai_eval_aliases, resource/agent_identity, attributes/agentcore_origin, attributes/session_id]
```

:::note
Use the contrib collector rather than the AWS Distro for OpenTelemetry (ADOT) collector here. ADOT v0.50.0 doesn't include the `transform` processor.
:::

### Where the data lands

| What | Where |
|---|---|
| Spans from every service, including the AgentCore Gateway | The `aws/spans` log group, and **CloudWatch** > **Application Signals (APM)** > **Transaction Search** |
| Logs from an AgentCore runtime, with `traceId` and `spanId` on each line | The `/aws/bedrock-agentcore/runtimes/<runtime-id>-DEFAULT` log group |
| Agent sessions, traces, and token usage | **CloudWatch** > **GenAI Observability** > **Bedrock AgentCore** |
| Runtime metrics: invocations, errors, latency, CPU, and memory | CloudWatch metrics, which AgentCore Runtime publishes with no setup |

The dashboards lag by 10 to 15 minutes. To confirm that spans are arriving, count recent spans by name:

```bash
aws logs tail aws/spans --region <region> --since 30m \
  | grep -o '"name":"[^"]*"' | sort | uniq -c | sort -rn
```

### Known limitations

- **The platform hop and the integration's own spans are separate traces.** AgentCore Runtime records its `AgentCore.Runtime.Invoke` span in one trace, and the Ballerina HTTP listener starts a new trace instead of continuing it. CloudWatch can't show them as one end-to-end trace.

## What's next

- [Jaeger](open-source/jaeger.md) — Set up Jaeger and view traces
- [Zipkin](open-source/zipkin.md) — Set up Zipkin and view traces
- [Metrics](metrics.md) — Collect and monitor metrics alongside traces
- [Logging](logging.md) — Configure structured logging
