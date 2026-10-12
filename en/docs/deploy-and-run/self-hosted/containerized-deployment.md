---
title: Containerized Deployment
description: Deploy WSO2 Integrator projects to Docker, Kubernetes, and Red Hat OpenShift using the Ballerina Code to Cloud feature.
keywords: [wso2 integrator, docker, kubernetes, openshift, containerized deployment, code to cloud, bal build, cloud.toml]
slug: /deploy-and-run/self-hosted/containerized-deployment
sidebar_position: 1
---

# Containerized Deployment

WSO2 Integrator leverages the Ballerina Code to Cloud feature to generate containerized deployment artifacts directly from your source code. You can target Docker, Kubernetes, or Red Hat OpenShift without writing deployment descriptors by hand. The compiler derives images and manifests from your code and the optional `Cloud.toml` configuration file.

## Supported platforms

The Code to Cloud feature supports the following containerized deployment platforms:

- **[Docker](#docker-deployment)** — Build and run containerized applications locally or on any Docker-compatible runtime
- **[Kubernetes](#kubernetes-deployment)** — Deploy to any Kubernetes cluster with auto-generated manifests, services, and autoscaling configurations
- **[Red Hat OpenShift](#red-hat-openshift-deployment)** — Deploy to OpenShift using the `oc` CLI with platform-specific manifests
- **[Amazon EKS](#amazon-eks-deployment)** — Deploy to AWS Elastic Kubernetes Service using ECR for image hosting and an internal NLB for service access
- **[Azure AKS](#azure-aks-deployment)** — Deploy to Azure Kubernetes Service using ACR for image hosting and an Azure Load Balancer for service access
- **Amazon Bedrock AgentCore Runtime** — Deploy an AI agent to AWS's serverless agent runtime using ECR for image hosting, with each session in its own microVM

:::info Prerequisites
- [Docker](https://www.docker.com/) installed and running on your build machine
- A WSO2 Integrator project based on Ballerina
- For Kubernetes: [kubectl](https://kubernetes.io/docs/tasks/tools/) installed and configured against a Kubernetes cluster
- For OpenShift: [OpenShift CLI (`oc`)](https://docs.openshift.com/container-platform/latest/cli_reference/openshift_cli/getting-started-cli.html) installed and logged in to your cluster
:::

:::note Package naming constraint
The `name` field in `Ballerina.toml` must contain only alphanumerics, underscores, and periods — hyphens are not allowed. Use `my_integration` rather than `my-integration`. Image names in `Cloud.toml` under `[container.image]` can include hyphens.
:::

## How Code to Cloud works

When you build a Ballerina project with a cloud target, the compiler extension generates deployment artifacts alongside the executable JAR. The artifacts land in the `target/` directory:

```
├── Cloud.toml
├── Ballerina.toml
├── Config.toml
└── target/
    ├── bin/
    │   └── <module>.jar
    ├── docker/
    │   └── Dockerfile
    ├── kubernetes/              # when cloud = "k8s"
    │   └── <module>-0.0.1.yaml
    └── openshift/               # when cloud = "openshift"
        └── <module>-0.0.1.yaml
```

**`Cloud.toml`** overrides defaults that the compiler infers from your code. Every field is optional. The compiler provides sensible defaults when the file is absent or when a field is omitted. See the [Cloud.toml reference](../../reference/configuration-reference.md#cloudtoml-reference) for the full field list.

**`Config.toml`** is intentionally excluded from the container image because it can contain sensitive values. For Docker, you supply it at runtime via a volume mount. For Kubernetes and OpenShift, use the `[[cloud.config.files]]` entry in `Cloud.toml` to mount it as a ConfigMap.

## Docker deployment

The Docker deployment path generates a Dockerfile and optionally builds the Docker image locally. This is the simplest containerized deployment option and serves as the foundation for Kubernetes and OpenShift deployments.

### Step 1: Set the cloud target

Open `Ballerina.toml` and add the cloud build option:

```toml
[build-options]
cloud = "docker"
```

Alternatively, pass the flag inline at build time without modifying `Ballerina.toml`:

```bash
bal build --cloud=docker
```

### Step 2: Configure the image

Create a `Cloud.toml` file in the project root. The `[container.image]` section controls the generated image name and tag:

```toml
[container.image]
repository = "myorg"
name = "my-integration"
tag = "v1.0.0"

[settings]
buildImage = true
```

Set `buildImage = false` if you only need the generated Dockerfile without building the image locally.

:::tip
`Cloud.toml` is optional. If you skip it, the compiler falls back to the package metadata in `Ballerina.toml` (the `org`, `name`, and `version` fields) to name the image and set the tag.
:::

### Step 3: Create a Config.toml

Create a `Config.toml` with values for any `configurable` variables in your code:

```toml
# Config.toml - provided at runtime, not packed into the image
greeting = "Hello"
```

### Step 4: Build

```bash
bal build
```

The output confirms the image was built and shows the `docker run` command:

```
Compiling source
        myorg/my_integration:1.0.0

Generating executable

Generating artifacts

Building the docker image

        ... (Docker BuildKit output) ...

        Execute the below command to run the generated Docker image:
        docker run -d -p 9090:9090 myorg/my-integration:v1.0.0

        target/bin/my_integration.jar
```

### Step 5: Run the container

Mount your `Config.toml` into the container at runtime to supply the configurable values:

```bash
docker run -d \
  -v /absolute/path/to/Config.toml:/home/ballerina/Config.toml \
  -p 9090:9090 \
  myorg/my-integration:v1.0.0
```

:::note
If you encounter a "Is a directory" error when mounting Config.toml, mount the parent directory instead:

```bash
docker run -d \
  -v /absolute/path/to/project:/home/ballerina/config \
  -p 9090:9090 \
  --env BAL_CONFIG_FILES=/home/ballerina/config/Config.toml \
  myorg/my-integration:v1.0.0
```
:::

Verify the integration is running by calling your service endpoint:

```bash
curl http://localhost:9090/<your-service-path>
```

## Kubernetes deployment

The Kubernetes deployment path generates a complete set of Kubernetes manifests (Deployment, Service, ConfigMap, HorizontalPodAutoscaler) alongside the Docker image. This enables you to deploy your integration to any Kubernetes cluster with a single `kubectl apply` command.

### Step 1: Set the cloud target

Open `Ballerina.toml` and add the cloud build option:

```toml
[build-options]
cloud = "k8s"
```

Alternatively, pass the flag inline at build time:

```bash
bal build --cloud=k8s
```

### Step 2: Configure the deployment

Create a `Cloud.toml` with container, resource, autoscaling, ConfigMap, and probe settings:

```toml
[container.image]
repository = "myorg"
name = "my-integration"
tag = "v1.0.0"

[cloud.deployment]
min_memory = "100Mi"
max_memory = "256Mi"
min_cpu = "500m"
max_cpu = "500m"

[cloud.deployment.autoscaling]
min_replicas = 2
max_replicas = 5
cpu = 60

[[cloud.config.files]]
file = "./Config.toml"

[cloud.deployment.probes.liveness]
port = 9091
path = "/probes/healthz"

[cloud.deployment.probes.readiness]
port = 9091
path = "/probes/readyz"
```

The `[[cloud.config.files]]` entry mounts your `Config.toml` as a Kubernetes ConfigMap, which is the recommended way to supply configuration to Kubernetes workloads.

:::note
The `[cloud.deployment.probes.liveness]` and `[cloud.deployment.probes.readiness]` sections only apply to long-running service workloads. Omit them if your integration is an Automation. For services, add a dedicated probe listener in your Ballerina code to back these endpoints:

```ballerina
import ballerina/http;

listener http:Listener probeEndpoint = new (9091);

service /probes on probeEndpoint {
    resource function get healthz() returns boolean {
        return true;
    }
    resource function get readyz() returns boolean {
        return true;
    }
}
```
:::

### Step 3: Build

```bash
bal build
```

The compiler generates all Kubernetes manifests and prints the `kubectl apply` command:

```
Compiling source
        myorg/my_integration:1.0.0

Generating executable

Generating artifacts

        @kubernetes:Service
        @kubernetes:ConfigMap
        @kubernetes:Deployment
        @kubernetes:HPA

Building the docker image

        ... (Docker BuildKit output) ...

        Execute the below command to deploy the Kubernetes artifacts:
        kubectl apply -f /path/to/project/target/kubernetes/my_integration

        Execute the below command to access service via NodePort:
        kubectl expose deployment my-integration-deployment --type=NodePort --name=my-integration-svc-local

        target/bin/my_integration.jar
```

For a service-type workload, the generated manifest includes a `Deployment`, `Service`, `ConfigMap`, and `HorizontalPodAutoscaler`. The `HorizontalPodAutoscaler` is only generated when `[cloud.deployment.autoscaling]` is configured.

For Automations, the compiler generates a `Job` or `CronJob` resource instead of a `Deployment`, with no `Service` or `HorizontalPodAutoscaler`.

### Step 4: Push the image

Push the built image to your container registry before applying the manifests:

```bash
docker push myorg/my-integration:v1.0.0
```

:::tip
If you are using Minikube, run `eval $(minikube docker-env)` before `bal build` to build the image directly into the Minikube Docker daemon. You can then skip the push step.
:::

### Step 5: Deploy

```bash
kubectl apply -f target/kubernetes/my_integration/
```

Expected output for a service-type workload:

```
service/my-integration created
configmap/config-config-map created
deployment.apps/my-integration-deployment created
horizontalpodautoscaler.autoscaling/my-integration created
```

:::note
Automations generate `Job` or `CronJob` resources instead of a `Deployment`, and do not produce a `Service` or `HorizontalPodAutoscaler`.
:::

### Step 6: Verify

```bash
kubectl get pods
kubectl get services
kubectl logs -f deployment/my-integration-deployment
```

### Step 7: Expose and test

:::note
This step applies to service-type workloads that expose an HTTP endpoint. If your integration is an Automation or Event Listener, skip this step.
:::

Expose the deployment via NodePort to access it in a development cluster:

```bash
kubectl expose deployment my-integration-deployment \
  --type=NodePort \
  --name=my-integration-svc-local
```

Get the assigned port:

```bash
kubectl get svc my-integration-svc-local
```

If you are using Minikube, get the cluster IP:

```bash
minikube ip
```

Then call the service:

```bash
curl http://<cluster-ip>:<node-port>/<your-service-path>
```

:::tip
Code to Cloud does not expose every Kubernetes configuration option. For changes beyond what `Cloud.toml` supports, use [Kustomize](https://kustomize.io/) to patch the generated YAML without modifying it directly. This keeps generated files untouched and makes upgrades easier when you rebuild.
:::

## Red Hat OpenShift deployment

The OpenShift deployment path generates manifests that are structurally identical to the Kubernetes output but land in `target/openshift/` and are applied using the `oc` CLI. This makes deploying to Red Hat OpenShift as straightforward as deploying to any Kubernetes cluster.

### Step 1: Set the cloud target

Open `Ballerina.toml` and add the cloud build option:

```toml
[build-options]
cloud = "openshift"
```

Alternatively, pass the flag inline at build time:

```bash
bal build --cloud=openshift
```

### Step 2: Configure the deployment

Create a `Cloud.toml` with container, resource, autoscaling, ConfigMap, and probe settings:

```toml
[container.image]
repository = "myorg"
name = "my-integration"
tag = "v1.0.0"

[cloud.deployment]
min_memory = "100Mi"
max_memory = "256Mi"
min_cpu = "500m"
max_cpu = "500m"

[cloud.deployment.autoscaling]
min_replicas = 2
max_replicas = 5
cpu = 60

[[cloud.config.files]]
file = "./Config.toml"

[cloud.deployment.probes.liveness]
port = 9091
path = "/probes/healthz"

[cloud.deployment.probes.readiness]
port = 9091
path = "/probes/readyz"
```

The `[[cloud.config.files]]` entry mounts your `Config.toml` as a ConfigMap, which is the recommended way to supply configuration to OpenShift workloads.

:::note
The `[cloud.deployment.probes.liveness]` and `[cloud.deployment.probes.readiness]` sections only apply to long-running service workloads. Omit them if your integration is an Automation. For services, add a dedicated probe listener in your Ballerina code to back these endpoints:

```ballerina
import ballerina/http;

listener http:Listener probeEndpoint = new (9091);

service /probes on probeEndpoint {
    resource function get healthz() returns boolean {
        return true;
    }
    resource function get readyz() returns boolean {
        return true;
    }
}
```
:::

### Step 3: Build

```bash
bal build
```

The compiler generates all OpenShift manifests and prints the `oc apply` command:

```
Compiling source
        myorg/my_integration:1.0.0

Generating executable

Generating artifacts

        @kubernetes:Service
        @kubernetes:ConfigMap
        @kubernetes:Deployment
        @kubernetes:HPA

Building the docker image

        ... (Docker BuildKit output) ...

        Execute the below command to deploy the OpenShift artifacts:
        oc apply -f /path/to/project/target/openshift/my_integration

        target/bin/my_integration.jar
```

For a service-type workload, the generated manifest includes a `Deployment`, `Service`, `ConfigMap`, and `HorizontalPodAutoscaler`. The `HorizontalPodAutoscaler` is only generated when `[cloud.deployment.autoscaling]` is configured.

For Automations, the compiler generates a `Job` or `CronJob` resource instead of a `Deployment`, with no `Service` or `HorizontalPodAutoscaler`.

### Step 4: Push the image

Push the built image to your container registry before applying the manifests:

```bash
docker push myorg/my-integration:v1.0.0
```

### Step 5: Deploy

```bash
oc apply -f target/openshift/my_integration/
```

Expected output:

```
service/my-integration created
configmap/config-config-map created
deployment.apps/my-integration-deployment created
horizontalpodautoscaler.autoscaling/my-integration created
```

:::note
Automations generate `Job` or `CronJob` resources instead of a `Deployment`, and do not produce a `Service` or `HorizontalPodAutoscaler`.
:::

### Step 6: Verify

```bash
oc get pods
oc get services
oc logs -f deployment/my-integration-deployment
```

### Step 7: Expose and test

:::note
This step applies to service-type workloads that expose an HTTP endpoint. If your integration is an Automation or Event Listener, skip this step.
:::

Expose the deployment via NodePort to access it in a development cluster:

```bash
oc expose deployment my-integration-deployment \
  --type=NodePort \
  --name=my-integration-svc-local
```

Get the assigned port:

```bash
oc get svc my-integration-svc-local
```

Then call the service:

```bash
curl http://<cluster-ip>:<node-port>/<your-service-path>
```

:::tip
Code to Cloud does not expose every OpenShift configuration option. For changes beyond what `Cloud.toml` supports, use [Kustomize](https://kustomize.io/) to patch the generated YAML without modifying it directly. This keeps generated files untouched and makes upgrades easier when you rebuild.
:::

## Amazon EKS deployment

Amazon Elastic Kubernetes Service (EKS) follows the same Kubernetes deployment path described above, with a few AWS-specific steps: pushing the image to Amazon ECR, configuring VPC endpoints for private clusters, and exposing the service via an AWS Network Load Balancer.

### Prerequisites

In addition to the [general prerequisites](#prerequisites), you need:

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and configured (`aws configure` or `aws sso login`)
- An EKS cluster with `kubectl` configured: `aws eks update-kubeconfig --region <region> --name <cluster-name>`
- An [Amazon ECR](https://aws.amazon.com/ecr/) repository created for your image:

```bash
aws ecr create-repository --region <region> --repository-name my-integration
```

### Step 1: Set the cloud target

Open `Ballerina.toml` and set the cloud target:

```toml
[build-options]
cloud = "k8s"
```

### Step 2: Configure the deployment

Create a `Cloud.toml` with your ECR repository as the image repository so the generated Kubernetes manifests reference the correct image URI:

```toml
[container.image]
repository = "<account-id>.dkr.ecr.<region>.amazonaws.com"
name = "my-integration"
tag = "v1.0.0"

[cloud.deployment]
min_memory = "100Mi"
max_memory = "256Mi"
min_cpu = "500m"
max_cpu = "500m"

[cloud.deployment.autoscaling]
min_replicas = 2
max_replicas = 5
cpu = 60

[[cloud.config.files]]
file = "./Config.toml"

[cloud.deployment.probes.liveness]
port = 9091
path = "/probes/healthz"

[cloud.deployment.probes.readiness]
port = 9091
path = "/probes/readyz"
```

### Step 3: Build

```bash
bal build
```

This generates the Kubernetes manifests under `target/kubernetes/my_integration/` and the Docker build context under `target/docker/my_integration/`.

### Step 4: Build and push the image

For **x86_64 node groups**: if you are building on Apple Silicon or another ARM machine, use `docker buildx` to produce a `linux/amd64` image and push it directly to ECR:

```bash
aws ecr get-login-password --region <region> | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com

docker buildx build \
  --platform linux/amd64 \
  --tag <account-id>.dkr.ecr.<region>.amazonaws.com/my-integration:v1.0.0 \
  --push \
  target/docker/my_integration/
```

:::tip
If your build machine is already `x86_64`, you can skip `docker buildx` and use `docker push` on the image built by `bal build` instead. For **Arm64 node groups**, set `--platform linux/arm64`; you can omit the flag only when building on an Arm64 machine (such as Apple Silicon) where the default platform already matches.
:::

### Step 5: Configure VPC endpoints for private clusters

EKS nodes in private subnets cannot reach ECR's public endpoints without a NAT gateway. Create three VPC endpoints to allow image pulls over private networking:

```bash
# ECR API endpoint (authentication and manifest requests)
aws ec2 create-vpc-endpoint --region <region> \
  --vpc-id <vpc-id> \
  --service-name com.amazonaws.<region>.ecr.api \
  --vpc-endpoint-type Interface \
  --subnet-ids <subnet-id-1> <subnet-id-2> \
  --security-group-ids <security-group-id> \
  --private-dns-enabled

# ECR DKR endpoint (image layer pulls)
aws ec2 create-vpc-endpoint --region <region> \
  --vpc-id <vpc-id> \
  --service-name com.amazonaws.<region>.ecr.dkr \
  --vpc-endpoint-type Interface \
  --subnet-ids <subnet-id-1> <subnet-id-2> \
  --security-group-ids <security-group-id> \
  --private-dns-enabled

# S3 gateway endpoint (ECR stores image layers in S3)
aws ec2 create-vpc-endpoint --region <region> \
  --vpc-id <vpc-id> \
  --service-name com.amazonaws.<region>.s3 \
  --vpc-endpoint-type Gateway \
  --route-table-ids <route-table-id>
```

:::tip
Skip this step if your nodes have internet access via a NAT gateway or if you are using a public EKS cluster.
:::

### Step 6: Deploy

```bash
kubectl apply -f target/kubernetes/my_integration/
```

Expected output:

```bash
service/my-integration created
configmap/config-config-map created
deployment.apps/my-integration-deployment created
horizontalpodautoscaler.autoscaling/my-integration created
```

Verify the pods come up:

```bash
kubectl get pods
kubectl get services
kubectl logs -f deployment/my-integration-deployment
```

### Step 7: Expose and test

Tag the cluster subnets so the EKS load balancer controller can discover them:

```bash
aws ec2 create-tags --region <region> \
  --resources <subnet-id-1> <subnet-id-2> \
  --tags Key=kubernetes.io/role/internal-elb,Value=1 \
         Key=kubernetes.io/cluster/<cluster-name>,Value=shared
```

If a service named `my-integration-lb` already exists, delete it first:

```bash
kubectl delete svc my-integration-lb 2>/dev/null || true
```

Create an internal NLB with all annotations set at creation time:

```bash
kubectl apply -f - <<'EOF'
apiVersion: v1
kind: Service
metadata:
  name: my-integration-lb
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internal"
    service.beta.kubernetes.io/aws-load-balancer-type: "external"
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: "ip"
spec:
  selector:
    app: my_integration
  type: LoadBalancer
  ports:
    - port: 9090
      targetPort: 9090
      protocol: TCP
EOF
```

Wait for the NLB hostname to be assigned:

```bash
kubectl get svc my-integration-lb
```

```bash
NAME                TYPE           CLUSTER-IP      EXTERNAL-IP                                      PORT(S)          AGE
my-integration-lb   LoadBalancer   10.100.160.80   <nlb-hostname>.elb.<region>.amazonaws.com        9090:31659/TCP   30s
```

Call the service from within the VPC:

```bash
curl http://<nlb-hostname>.elb.<region>.amazonaws.com:9090/<your-service-path>
```

:::note
An internal NLB is only reachable from within the same VPC. For internet-facing access, replace `internal-elb` with `elb` in the subnet tag and set `aws-load-balancer-scheme` to `internet-facing` in the Service manifest. Ensure the subnets have a route to an internet gateway.
:::

## Amazon Bedrock AgentCore Runtime deployment

Amazon Bedrock AgentCore Runtime is AWS's serverless runtime for AI agents. It runs your container image and gives each session its own microVM. You don't manage a cluster, nodes, or a load balancer. Callers invoke the runtime through the AWS API with IAM (SigV4) authentication.

The steps below deploy an AI agent built with `ballerina/ai`. Code to Cloud builds the image, and the agent reaches its model and tools through Amazon Bedrock AgentCore Gateway.

### Prerequisites

In addition to the general prerequisites, you need:

- AWS CLI v2 installed and configured (`aws configure` or `aws sso login`)
- Docker with `buildx`, able to build `linux/arm64` images. Apple Silicon machines build them natively.
- IAM permissions to manage AgentCore (the `BedrockAgentCoreFullAccess` managed policy), create IAM roles and pass them (`iam:PassRole`), and push to Amazon ECR
- An AgentCore Gateway with Amazon Cognito inbound authentication. Note its MCP URL, its model URL, and the Cognito token URL, client ID, and client secret.
- An Amazon ECR repository for the image:

```bash
aws ecr create-repository --region <region> --repository-name my-agent
```

### Step 1: Write the service

AgentCore Runtime starts your container and talks to it over a fixed contract. An agent runtime uses the `HTTP` protocol, and the container must serve `GET /ping` and `POST /invocations` on `0.0.0.0:8080`:

- `GET /ping` returns `200` with `{"status":"Healthy"}`. The runtime polls it every few seconds.
- `POST /invocations` takes the caller's JSON payload and returns JSON.
- Each invocation carries the session id in the `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id` header. A session id has at least 33 characters.

The following service exposes an agent over this contract. It uses the session id as the agent's memory key, so calls with the same session id continue one conversation:

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/log;

configurable int port = 8080;

type InvocationRequest record {
    string prompt;
};

type InvocationResponse record {|
    string response;
    string status;
|};

type FailureResponse record {|
    string message;
    string status;
|};

service / on new http:Listener(port) {

    // Health probe polled by AgentCore Runtime.
    resource function get ping() returns json => {status: "Healthy"};

    resource function post invocations(@http:Payload InvocationRequest payload,
            @http:Header {name: "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id"} string? sessionId)
            returns http:Ok|http:InternalServerError {
        // The session id doubles as the agent's memory key.
        string session = sessionId ?: "default";

        ai:Agent|error agent = agentFor();
        if agent is error {
            log:printError("agent unavailable", agent, session = session);
            return <http:InternalServerError>{
                body: <FailureResponse>{message: agent.message(), status: "error"}
            };
        }

        string|ai:Error response = agent.run(payload.prompt, sessionId = session);
        if response is ai:Error {
            log:printError("agent run failed", response, session = session);
            return <http:InternalServerError>{
                body: <FailureResponse>{message: response.message(), status: "error"}
            };
        }
        return <http:Ok>{body: <InvocationResponse>{response, status: "success"}};
    }
}
```

`agentFor()` returns the agent, which Step 2 builds. The runtime gives each session its own microVM, so one container serves one session.

:::note
Log the reason for any failure inside the container. When the agent returns an error, the caller sees only a `RuntimeClientError (500)`. The cause is in the runtime's log group.
:::

### Step 2: Connect the agent to AgentCore Gateway

AgentCore Gateway gives the agent one MCP endpoint for all its tools and one endpoint for its model calls. The Gateway authenticates every call, can check each one against policies, and holds the credentials for the services behind it.

The model provider's API key stays out of the agent. Store it in AgentCore Identity (**AgentCore** > **Identity** > **Outbound Auth** > **API key**), and add an **Inference** target to the Gateway that uses that credential provider. The agent then calls the model through the Gateway and sends its Gateway token in place of a provider key.

The agent gets a Gateway token from Amazon Cognito with the OAuth 2.0 client credentials flow, and uses it for both its tools and its model:

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerinax/ai.openai;

configurable string mcpServerUrl = ?;   // Gateway MCP URL
configurable string inferenceUrl = ?;   // Gateway model URL, ending in /v1
configurable string mcpTokenUrl = ?;    // Cognito token URL
configurable string mcpClientId = ?;
configurable string mcpClientSecret = ?;

isolated function gatewayToken() returns string|error {
    http:Client tokenClient = check new (mcpTokenUrl);
    http:Request request = new;
    request.setTextPayload(string `grant_type=client_credentials&client_id=${mcpClientId}` +
            string `&client_secret=${mcpClientSecret}`, "application/x-www-form-urlencoded");
    // Cognito returns expires_in and token_type alongside the token.
    record {string access_token;} token = check tokenClient->post("", request);
    return token.access_token;
}

isolated function buildAgent(string token) returns ai:Agent|error {
    // Lists the Gateway's tools once, when the toolkit is created.
    ai:McpToolKit gateway = check new (mcpServerUrl, auth = {token});

    // The OpenAI provider sends its key as Authorization: Bearer, which the Gateway reads.
    ai:ModelProvider model = check new openai:ModelProvider(token, openai:GPT_4_1, inferenceUrl);

    return check new ai:Agent(
        systemPrompt = {
            role: "Assistant",
            instructions: "You are a helpful assistant. Use the provided tools when they help answer the question."
        }, model = model, tools = [gateway]
    );
}

isolated ai:Agent? cachedAgent = ();

// Builds the agent on the first invocation and reuses it for the rest of the session.
isolated function agentFor() returns ai:Agent|error {
    lock {
        ai:Agent? existing = cachedAgent;
        if existing is ai:Agent {
            return existing;
        }
    }
    ai:Agent agent = check buildAgent(check gatewayToken());
    lock {
        cachedAgent = agent;
    }
    return agent;
}
```

Keep these behaviors in mind:

- Use a model provider that sends its key as `Authorization: Bearer`, such as `ballerinax/ai.openai`. The Gateway rejects a key sent as `x-api-key` with `401 Missing Bearer token`.
- Cognito access tokens expire after one hour, and the model provider doesn't renew its token, so a session that runs longer than that starts failing its model calls.

AgentCore Policy and guardrails apply only to calls that pass through the Gateway:

- Tools defined in the agent with `@ai:AgentTool` run inside the agent, so no Gateway policy or guardrail applies to them. To control such a tool, host it behind the Gateway as an MCP server or REST API target, or make it a gated tool so it needs approval before it runs (`ai:RequiresApproval`).
- Don't add session-aware (temporal) policies to the Gateway's policy engine. They require the `x-amzn-bedrock-agentcore-policy-session-id` header on every Gateway request, and `ai:McpToolKit` doesn't send it, so every tool call from the agent fails.

### Step 3: Configure the image

Set the cloud target in `Ballerina.toml`:

```toml
[build-options]
cloud = "docker"
```

Point the image at your ECR repository in `Cloud.toml`:

```toml
[container.image]
repository = "<account-id>.dkr.ecr.<region>.amazonaws.com"
name = "my-agent"
tag = "v1.0.0"
```

To send the agent's traces to AWS X-Ray, the image also needs an OpenTelemetry Collector running next to the agent. Code to Cloud adds it through `[[container.copy.files]]` and `entrypoint` entries in the same `Cloud.toml`. Distributed Tracing describes these entries under Send traces to AWS X-Ray and CloudWatch.

Follow these rules for every image you deploy to AgentCore Runtime:

| Rule | What happens if you skip it |
|---|---|
| Push a `linux/arm64` image | AgentCore Runtime runs only `arm64` images and rejects any other with an unhelpful error. |
| Push with `--provenance=false` | `buildx` otherwise pushes an attestation manifest list. The push succeeds, but the runtime fails to deploy. |
| Keep secrets out of the image | Code to Cloud leaves `Config.toml` out of the image. Pass configuration as environment variables instead (Step 7). |
| Set only environment variables the code reads | An unknown key in `Config.toml`, or a `BAL_CONFIG_VAR_` variable that matches no `configurable`, stops the program at startup with `unused environment variable`. On AgentCore, this shows up only as `An error occurred when starting the runtime`. |

### Step 4: Build and test locally

Build the project. Code to Cloud builds the executable JAR, generates the Docker build context under `target/docker/my_agent/`, and builds the image for your machine:

```bash
bal build
```

Run the image with the same configuration you'll give the runtime, and call the contract endpoints from another terminal:

```bash
docker run --rm -p 8080:8080 -e BAL_CONFIG_VAR_<NAME>=<value> \
  <account-id>.dkr.ecr.<region>.amazonaws.com/my-agent:v1.0.0
```

```bash
curl localhost:8080/ping

curl -X POST localhost:8080/invocations \
  -H 'Content-Type: application/json' \
  -H 'X-Amzn-Bedrock-AgentCore-Runtime-Session-Id: local-0000000000000000000000000000000' \
  -d '{"prompt":"Add 2 and 3."}'
```

### Step 5: Push the image to ECR

Log in to ECR, then build the generated context for `linux/arm64` and push it in one step:

```bash
aws ecr get-login-password --region <region> | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com

docker buildx build \
  --platform linux/arm64 \
  --provenance=false \
  --tag <account-id>.dkr.ecr.<region>.amazonaws.com/my-agent:v1.0.0 \
  --push \
  target/docker/my_agent/
```

### Step 6: Create the IAM role

The runtime assumes an IAM role to pull the image, write logs, and send traces. Save the trust policy as `runtime-trust.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "bedrock-agentcore.amazonaws.com" },
    "Action": "sts:AssumeRole",
    "Condition": {
      "StringEquals": { "aws:SourceAccount": "<account-id>" },
      "ArnLike": { "aws:SourceArn": "arn:aws:bedrock-agentcore:<region>:<account-id>:*" }
    }
  }]
}
```

Save the permissions as `runtime-permissions.json`. Replace `<runtime-name>` with the runtime name you use in Step 7:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "ECRImageAccess", "Effect": "Allow",
      "Action": ["ecr:BatchGetImage", "ecr:GetDownloadUrlForLayer"],
      "Resource": ["arn:aws:ecr:<region>:<account-id>:repository/*"] },
    { "Sid": "ECRTokenAccess", "Effect": "Allow",
      "Action": ["ecr:GetAuthorizationToken"], "Resource": "*" },
    { "Sid": "LogGroupManagement", "Effect": "Allow",
      "Action": ["logs:DescribeLogStreams", "logs:CreateLogGroup"],
      "Resource": ["arn:aws:logs:<region>:<account-id>:log-group:/aws/bedrock-agentcore/runtimes/*"] },
    { "Sid": "LogGroupDiscovery", "Effect": "Allow",
      "Action": ["logs:DescribeLogGroups"],
      "Resource": ["arn:aws:logs:<region>:<account-id>:log-group:*"] },
    { "Sid": "LogWrite", "Effect": "Allow",
      "Action": ["logs:CreateLogStream", "logs:PutLogEvents"],
      "Resource": ["arn:aws:logs:<region>:<account-id>:log-group:/aws/bedrock-agentcore/runtimes/*:log-stream:*"] },
    { "Sid": "Tracing", "Effect": "Allow",
      "Action": ["xray:PutTraceSegments", "xray:PutTelemetryRecords", "xray:GetSamplingRules", "xray:GetSamplingTargets"],
      "Resource": ["*"] },
    { "Sid": "Metrics", "Effect": "Allow",
      "Action": "cloudwatch:PutMetricData", "Resource": "*",
      "Condition": { "StringEquals": { "cloudwatch:namespace": "bedrock-agentcore" } } },
    { "Sid": "GetAgentAccessToken", "Effect": "Allow",
      "Action": ["bedrock-agentcore:GetWorkloadAccessToken",
                 "bedrock-agentcore:GetWorkloadAccessTokenForJWT",
                 "bedrock-agentcore:GetWorkloadAccessTokenForUserId"],
      "Resource": ["arn:aws:bedrock-agentcore:<region>:<account-id>:workload-identity-directory/default",
                   "arn:aws:bedrock-agentcore:<region>:<account-id>:workload-identity-directory/default/workload-identity/<runtime-name>-*"] }
  ]
}
```

Create the role:

```bash
aws iam create-role --role-name AgentCoreRuntime-my_agent \
  --assume-role-policy-document file://runtime-trust.json

aws iam put-role-policy --role-name AgentCoreRuntime-my_agent \
  --policy-name AgentCoreRuntimeExecution \
  --policy-document file://runtime-permissions.json
```

### Step 7: Create the runtime

A runtime name can contain only letters, digits, and underscores, and must start with a letter. Hyphens are rejected.

The runtime passes configuration to the container as environment variables. A configurable is read from `BAL_CONFIG_VAR_` followed by its name in **uppercase**: `mcpServerUrl` becomes `BAL_CONFIG_VAR_MCPSERVERURL`. A variable with any other casing is silently ignored.

The following command reads the Cognito client secret straight into the runtime definition, so the secret never appears on screen, in your shell history, or in the process list. `umask 077` makes the file readable only by you, and the last command deletes it:

```bash
umask 077
aws cognito-idp describe-user-pool-client --region <region> \
  --user-pool-id <user-pool-id> --client-id <client-id> \
  --query UserPoolClient.ClientSecret --output text \
| python3 -c '
import json, sys
gw = "https://<gateway-id>.gateway.bedrock-agentcore.<region>.amazonaws.com"
print(json.dumps({
  "agentRuntimeName": "my_agent",
  "agentRuntimeArtifact": {"containerConfiguration": {
    "containerUri": "<account-id>.dkr.ecr.<region>.amazonaws.com/my-agent:v1.0.0"}},
  "roleArn": "arn:aws:iam::<account-id>:role/AgentCoreRuntime-my_agent",
  "networkConfiguration": {"networkMode": "PUBLIC"},
  "protocolConfiguration": {"serverProtocol": "HTTP"},
  "environmentVariables": {
    "BAL_CONFIG_VAR_MCPSERVERURL": gw + "/mcp",
    "BAL_CONFIG_VAR_INFERENCEURL": gw + "/inference/v1",
    "BAL_CONFIG_VAR_MCPTOKENURL": "https://<cognito-domain>/oauth2/token",
    "BAL_CONFIG_VAR_MCPCLIENTID": "<client-id>",
    "BAL_CONFIG_VAR_MCPCLIENTSECRET": sys.stdin.read().strip()}}))' > agent-runtime.json

aws bedrock-agentcore-control create-agent-runtime --region <region> \
  --cli-input-json file://agent-runtime.json

rm -f agent-runtime.json
```

:::warning Environment variables are not secret
Anyone with `bedrock-agentcore:GetAgentRuntime` can read a runtime's environment variables, including the client secret. Limit that permission to the people who deploy the agent, and rotate the secret in Cognito if it's exposed.
:::

:::note
To deploy new code later, push a new image tag and run `aws bedrock-agentcore-control update-agent-runtime`. The update replaces the whole configuration, so send the image, role, network, protocol, and **all** environment variables again. If you leave out `environmentVariables`, the runtime drops them and the agent fails to start.
:::

### Step 8: Verify

Check that the runtime is ready:

```bash
aws bedrock-agentcore-control get-agent-runtime --region <region> \
  --agent-runtime-id <runtime-id> \
  --query '{status:status,protocol:protocolConfiguration.serverProtocol,arn:agentRuntimeArn}'
```

Wait for `status` to be `READY`. Then look up the runtime ARN and invoke it. The session id must be at least 33 characters, so this example joins two UUIDs:

```bash
ARN=$(aws bedrock-agentcore-control list-agent-runtimes --region <region> \
  --query "agentRuntimes[?agentRuntimeName=='my_agent'].agentRuntimeArn | [0]" --output text)

aws bedrock-agentcore invoke-agent-runtime --region <region> \
  --agent-runtime-arn "$ARN" \
  --runtime-session-id "$(uuidgen)$(uuidgen)" \
  --content-type application/json --accept application/json \
  --cli-binary-format raw-in-base64-out \
  --payload '{"prompt":"Add 2 and 3."}' \
  /dev/stdout
```

To continue a conversation, reuse the same session id.

Follow the agent's logs. The container's standard output goes to CloudWatch Logs:

```bash
aws logs tail /aws/bedrock-agentcore/runtimes/<runtime-id>-DEFAULT --region <region> --follow
```

If the runtime doesn't deploy or the invocation fails, the usual causes are:

- The image pushed, but the runtime fails to deploy: the image isn't `linux/arm64`, or it was pushed without `--provenance=false`.
- The caller gets `An error occurred when starting the runtime`: the program exited at startup. Look in the log for `unused environment variable`, or for an unknown key in `Config.toml`, and run the image locally.
- The runtime is `READY`, but its log group is empty: the runtime isn't using the `HTTP` protocol, or the service doesn't listen on port `8080`.
- The caller gets `RuntimeClientError (500)` with no detail: the agent's own error message is in the runtime's log group, on the `agent unavailable` or `agent run failed` line.
- `Failed to initialize the MCP client`: the Gateway is unreachable, or it refused the token.
- Model calls return `400` with `Failed to fetch outbound api key`: the Gateway's service role can't read the model provider's key from AgentCore Identity. It needs `bedrock-agentcore:GetResourceApiKey` on the credential provider and `secretsmanager:GetSecretValue` on its secret.
- Model calls fail after about an hour in one session: the Gateway token expired. Start a new session.

## Azure AKS deployment

Azure Kubernetes Service (AKS) follows the same Kubernetes deployment path described above, with a few Azure-specific steps: pushing the image to Azure Container Registry (ACR), attaching the registry to the cluster, and exposing the service via an Azure Load Balancer.

### Prerequisites

In addition to the [general prerequisites](#prerequisites), you need:

- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed and configured (`az login`)
- An AKS cluster with `kubectl` configured: `az aks get-credentials --resource-group <resource-group> --name <cluster-name>`
- An [Azure Container Registry](https://azure.microsoft.com/en-us/products/container-registry) created and attached to the cluster:

```bash
az acr create \
  --resource-group <resource-group> \
  --name <registry-name> \
  --sku Basic

az aks update \
  --resource-group <resource-group> \
  --name <cluster-name> \
  --attach-acr <registry-name>
```

:::tip
You can also attach the ACR at cluster creation time with the `--attach-acr` flag:

```bash
az aks create \
  --resource-group <resource-group> \
  --name <cluster-name> \
  --node-count 1 \
  --attach-acr <registry-name> \
  --generate-ssh-keys
```
:::

### Step 1: Set the cloud target

Open `Ballerina.toml` and set the cloud target:

```toml
[build-options]
cloud = "k8s"
```

### Step 2: Configure the deployment

Create a `Cloud.toml` with your ACR login server as the image repository so the generated Kubernetes manifests reference the correct image URI:

```toml
[container.image]
repository = "<registry-name>.azurecr.io"
name = "my-integration"
tag = "v1.0.0"

[cloud.deployment]
min_memory = "100Mi"
max_memory = "256Mi"
min_cpu = "500m"
max_cpu = "500m"

[cloud.deployment.autoscaling]
min_replicas = 2
max_replicas = 5
cpu = 60

[[cloud.config.files]]
file = "./Config.toml"

[cloud.deployment.probes.liveness]
port = 9091
path = "/probes/healthz"

[cloud.deployment.probes.readiness]
port = 9091
path = "/probes/readyz"
```

### Step 3: Build

```bash
bal build
```

This generates the Kubernetes manifests under `target/kubernetes/my_integration/` and the Docker build context under `target/docker/my_integration/`.

### Step 4: Build and push the image

Log in to ACR using the Azure CLI:

```bash
az acr login --name <registry-name>
```

For **x86_64 node pools**: if you are building on Apple Silicon or another ARM machine, use `docker buildx` to produce a `linux/amd64` image and push it directly to ACR:

```bash
docker buildx build \
  --platform linux/amd64 \
  --tag <registry-name>.azurecr.io/my-integration:v1.0.0 \
  --push \
  target/docker/my_integration/
```

:::tip
If your build machine is already `x86_64`, you can skip `docker buildx` and push the image built by `bal build` directly:

```bash
docker push <registry-name>.azurecr.io/my-integration:v1.0.0
```

For **Arm64 node pools**, set `--platform linux/arm64`; you can omit the flag only when building on an Arm64 machine (such as Apple Silicon) where the default platform already matches.
:::

### Step 5: Deploy

```bash
kubectl apply -f target/kubernetes/my_integration/
```

Expected output for a service-type workload:

```bash
service/my-integration created
configmap/config-config-map created
deployment.apps/my-integration-deployment created
horizontalpodautoscaler.autoscaling/my-integration created
```

Verify the pods come up:

```bash
kubectl get pods
kubectl get services
kubectl logs -f deployment/my-integration-deployment
```

### Step 6: Expose and test

The generated manifest deploys a `ClusterIP` service. Create a separate `LoadBalancer` service to expose the integration externally via an Azure Load Balancer:

```bash
kubectl apply -f - <<'EOF'
apiVersion: v1
kind: Service
metadata:
  name: my-integration-lb
spec:
  selector:
    app: my_integration
  type: LoadBalancer
  ports:
    - port: 9090
      targetPort: 9090
      protocol: TCP
EOF
```

Wait for the public IP to be assigned:

```bash
kubectl get svc my-integration-lb
```

```bash
NAME                TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)          AGE
my-integration-lb   LoadBalancer   10.0.179.234   <public-ip>      9090:31234/TCP   60s
```

Call the service once the external IP is available:

```bash
curl http://<public-ip>:9090/<your-service-path>
```

:::note
For an internal (private) load balancer that is reachable only within the virtual network, add the following annotation to the Service manifest:

```yaml
metadata:
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
```
:::
