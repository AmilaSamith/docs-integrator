import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import { connectorVersionedDocs } from './src/utils/sidebarUtils';

/**
 * WSO2 Integrator Documentation — Sidebar Configuration
 *
 * Structure follows the Documentation Blueprint (March 2026).
 * Seven top-level sections answering seven developer questions:
 *
 *   Get Started       — "I'm new — what is this and how do I begin?"
 *   Develop           — "How do I build, transform, and test X?"
 *   Connectors        — "Can I connect to Y?"
 *   GenAI             — "How do I build AI agents, RAG, or MCP?"
 *   Tutorials         — "Show me a complete, real example"
 *   Deploy            — "How do I ship, run, and secure this?"
 *   Manage            — "How do I set up and manage ICP?"
 *   Reference         — "What's the exact syntax / config / API for Z?"
 */
const sidebars: SidebarsConfig = {
  mainSidebar: [
    // ─────────────────────────────────────────────
    // GET STARTED
    // "I'm new — what is this and how do I begin?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Get Started',
      collapsed: true,
      link: { type: 'doc', id: 'get-started/introduction' },
      items: [
        {
          type: 'category',
          label: 'Concepts',
          link: { type: 'doc', id: 'get-started/concepts/overview' },
          items: [
            'get-started/concepts/core',
            'get-started/concepts/integration-cloud-concepts',
          ],
        },
        {
          type: 'category',
          label: 'Set Up',
          link: { type: 'doc', id: 'get-started/setup/overview' },
          items: [
            'get-started/setup/local-setup',
            'get-started/setup/sign-up-sign-in',
            'get-started/setup/cloud-setup',
          ],
        },
        {
          type: 'category',
          label: 'Quick Starts',
          items: [
            'get-started/build-automation',
            'get-started/build-ai-agent',
            'get-started/build-integration-api',
            'get-started/build-event-driven-integration',
            'get-started/build-file-driven-integration',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // DEVELOP
    // "How do I build, transform, and test X?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Develop',
      collapsed: true,
      link: { type: 'doc', id: 'develop/develop' },
      items: [
        // 6.1 Create Integrations
        {
          type: 'category',
          label: 'Create Integrations',
          items: [
            'develop/create-integrations/create-a-new-integration',
            'develop/create-integrations/open-existing-integration',
            'develop/create-integrations/explore-sample-integrations',
            'develop/create-integrations/create-a-library',
            'develop/create-integrations/create-a-project',
            'develop/create-integrations/open-a-project',
            'develop/create-integrations/migrate-third-party-integrations',
          ],
        },
        // 6.2 Understand the IDE
        {
          type: 'category',
          label: 'Understand the IDE',
          link: { type: 'doc', id: 'develop/understand-ide/understand-ide' },
          items: [
            'develop/understand-ide/integrator-app',
            {
              type: 'category',
              label: 'Views',
              items: [
                'develop/understand-ide/views/project-view',
                'develop/understand-ide/views/integration-view',
                'develop/understand-ide/views/library-view',
              ],
            },
            {
              type: 'category',
              label: 'Editors',
              items: [
                {
                  type: 'category',
                  label: 'Flow Diagram Editor',
                  link: { type: 'doc', id: 'develop/understand-ide/editors/flow-diagram-editor/flow-diagram-editor' },
                  items: [
                    'develop/understand-ide/editors/flow-diagram-editor/connections',
                    'develop/understand-ide/editors/flow-diagram-editor/statement',
                    'develop/understand-ide/editors/flow-diagram-editor/control',
                    'develop/understand-ide/editors/flow-diagram-editor/ai',
                    'develop/understand-ide/editors/flow-diagram-editor/error-handling',
                    'develop/understand-ide/editors/flow-diagram-editor/concurrency',
                    'develop/understand-ide/editors/flow-diagram-editor/logging',
                    'develop/understand-ide/editors/flow-diagram-editor/show-more-functions',
                  ],
                },
                'develop/understand-ide/editors/service-design-editor',
                'develop/understand-ide/editors/expression-editor',
                'develop/understand-ide/editors/type-editor',
                'develop/understand-ide/editors/type-diagram-editor',
                'develop/understand-ide/editors/configure-editor',
                'develop/understand-ide/editors/datamapper-editor',
                'develop/understand-ide/editors/graphql-editor',
              ],
            },
          ],
        },
        // 6.3 Integration Artifacts
        {
          type: 'category',
          label: 'Integration Artifacts',
          link: { type: 'doc', id: 'develop/integration-artifacts/integration-artifacts' },
          items: [
            'develop/integration-artifacts/automation',
            {
              type: 'category', label: 'Integration as API',
              collapsed: true,
              items: [
                'develop/integration-artifacts/service/http',
                'develop/integration-artifacts/service/graphql',
                'develop/integration-artifacts/service/tcp',
                'develop/integration-artifacts/service/websocket',
                'develop/integration-artifacts/service/websub-hub',
                'develop/integration-artifacts/service/grpc',
              ],
            },
            {
              type: 'category', label: 'Event-Driven Integration',
              collapsed: true,
              items: [
                'develop/integration-artifacts/event/kafka',
                'develop/integration-artifacts/event/rabbitmq',
                'develop/integration-artifacts/event/mqtt',
                'develop/integration-artifacts/event/azure-service-bus',
                'develop/integration-artifacts/event/pop3imap4',
                'develop/integration-artifacts/event/salesforce-events',
                'develop/integration-artifacts/event/twilio',
                'develop/integration-artifacts/event/github-webhooks',
                'develop/integration-artifacts/event/solace',
                'develop/integration-artifacts/event/cdc-mssql',
                'develop/integration-artifacts/event/cdc-postgresql',
              ],
            },
            {
              type: 'category', label: 'File-Driven Integration',
              collapsed: true,
              items: [
                {
                  type: 'category', label: 'Remote Servers (FTP/SFTP)',
                  collapsed: true,
                  link: { type: 'doc', id: 'develop/integration-artifacts/file/ftp-sftp' },
                  items: [
                    'develop/integration-artifacts/file/high-availability-and-coordination',
                    'develop/integration-artifacts/file/dependency-and-trigger-conditions',
                    'develop/integration-artifacts/file/csv-fault-tolerance',
                  ],
                },
                'develop/integration-artifacts/file/smb',
                'develop/integration-artifacts/file/local-files',
                'develop/integration-artifacts/file/azure-files'
              ],
            },
            {
              type: 'category', label: 'Other Artifacts',
              collapsed: true,
              items: [
                'develop/integration-artifacts/supporting/types',
                'develop/integration-artifacts/supporting/connections',
                'develop/integration-artifacts/supporting/configurations',
                'develop/integration-artifacts/supporting/functions',
                'develop/integration-artifacts/supporting/data-persistence',
                {
                  type: 'category',
                  label: 'Data Mapper',
                  collapsed: true,
                  link: { type: 'doc', id: 'develop/integration-artifacts/supporting/data-mapper/data-mapper' },
                  items: [
                    {
                      type: 'category',
                      label: 'Access Paths',
                      collapsed: true,
                      link: { type: 'doc', id: 'develop/integration-artifacts/supporting/data-mapper/access-paths/access-paths' },
                      items: [
                        'develop/integration-artifacts/supporting/data-mapper/access-paths/reusable',
                        'develop/integration-artifacts/supporting/data-mapper/access-paths/inline',
                      ],
                    },
                    'develop/integration-artifacts/supporting/data-mapper/mapping-capabilities',
                    {
                      type: 'category',
                      label: 'Array Mappings',
                      collapsed: true,
                      link: { type: 'doc', id: 'develop/integration-artifacts/supporting/data-mapper/array-mappings/array-mappings' },
                      items: [
                        'develop/integration-artifacts/supporting/data-mapper/array-mappings/array-to-array',
                        'develop/integration-artifacts/supporting/data-mapper/array-mappings/array-to-single-value',
                      ],
                    },
                    'develop/integration-artifacts/supporting/data-mapper/generic-type-mappings',
                    'develop/integration-artifacts/supporting/data-mapper/submappings',
                    'develop/integration-artifacts/supporting/data-mapper/ai-mapping',
                  ],
                },
              ],
            },
          ],
        },
        // 6.5 Transform (per blueprint)
        {
          type: 'category',
          label: 'Transform',
          items: [
            'develop/transform/json',
            'develop/transform/xml',
            'develop/transform/csv-flat-file',
            'develop/transform/xlsx',
            'develop/transform/edi',
            'develop/transform/pdf',
            'develop/transform/freemarker',
            'develop/transform/zip',
            'develop/transform/yaml-toml'
          ],
        },
        // Develop with Copilot
        {
          type: 'category',
          label: 'WSO2 Integrator Copilot',
          items: [
            'develop/copilot/getting-started',
            'develop/copilot/overview',
            'develop/copilot/mcp-tools',
          ],
        },
        // 6.6 Try & Test
        {
          type: 'category',
          label: 'Test',
          link: { type: 'doc', id: 'develop/test/overview' },
          items: [
            {
              type: 'category',
              label: 'Try-It Tool',
              link: { type: 'doc', id: 'develop/test/built-in-try-it-tool' },
              items: [
                'develop/test/try-it-http',
                'develop/test/try-it-graphql',
                'develop/test/try-it-chat',
                'develop/test/try-it-mcp',
              ],
            },
            {
              type: 'category',
              label: 'Test Explorer',
              link: { type: 'doc', id: 'develop/test/test-explorer' },
              items: [
                'develop/test/unit-testing',
                'develop/test/configure-tests',
                'develop/test/services-clients',
                'develop/test/data-driven-tests',
                'develop/test/groups',
                'develop/test/mocking',
                'develop/test/execute-tests',
                'develop/test/code-coverage-and-reports',
              ],
            },
            'develop/test/ai-generated-cases',
          ],
        },
        // 6.7 Debug
        {
          type: 'category',
          label: 'Debug',
          items: [
            'develop/debugging/editor',
            'develop/debugging/features',
          ],
        },
        // 6.8 Troubleshooting
        {
          type: 'category',
          label: 'Troubleshooting',
          items: [
            'develop/troubleshooting/errors-and-stack-traces',
            'develop/troubleshooting/logging',
            'develop/troubleshooting/deployment',
            'develop/troubleshooting/strand-dump-analysis',
            'develop/troubleshooting/profiling',
            'develop/troubleshooting/ide-troubleshooting',
          ],
        },
        // 6.9 Tools
        {
          type: 'category',
          label: 'Tools',
          link: { type: 'doc', id: 'develop/tools/tools' },
          items: [
            {
              type: 'category',
              label: 'Integration Tools',
              collapsed: true,
              items: [
                'develop/tools/integration-tools/openapi-tool',
                'develop/tools/integration-tools/graphql-tool',
                'develop/tools/integration-tools/asyncapi-tool',
                'develop/tools/integration-tools/grpc-tool',
                'develop/tools/integration-tools/health-tool',
                'develop/tools/integration-tools/edi-tool',
                'develop/tools/integration-tools/wsdl-tool',
                'develop/tools/integration-tools/xsd-tool',
                'develop/tools/integration-tools/persist-tool',
                'develop/tools/integration-tools/connector-tool',
              ],
            },
            {
              type: 'category',
              label: 'Migration Tools',
              link: { type: 'doc', id: 'develop/tools/migration-tools/migration-tools' },
              collapsed: true,
              items: [
                'develop/tools/migration-tools/migrate-from-mulesoft',
                'develop/tools/migration-tools/migrate-from-tibco-businessworks',
                'develop/tools/migration-tools/migrate-from-azure-logic-apps',
              ],
            },
            {
              type: 'category',
              label: 'Other',
              collapsed: true,
              items: [
                'develop/tools/other/scan-tool',
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // AI INTEGRATIONS
    // "How do I build AI agents, RAG, or MCP?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'AI Integrations',
      collapsed: true,
      link: { type: 'doc', id: 'genai/overview' },
      items: [
        // Getting Started
        {
          type: 'category',
          label: 'Getting Started',
          items: [
            'genai/getting-started/build-a-sentiment-analyzer',
            'genai/getting-started/build-a-hotel-finder-agent',
          ],
        },
        // Develop AI Applications
        {
          type: 'category',
          label: 'Develop AI Applications',
          items: [
            // Direct LLM Calls (single page)
            'genai/develop/direct-llm/overview',
            // RAG
            {
              type: 'category',
              label: 'RAG',
              link: { type: 'doc', id: 'genai/develop/rag/overview' },
              collapsed: true,
              items: [
                'genai/develop/rag/rag-ingestion',
                'genai/develop/rag/rag-query'
              ]
            },
            // AI Agents
            {
              type: 'category',
              label: 'AI Agents',
              link: { type: 'doc', id: 'genai/develop/agents/overview' },
              collapsed: true,
              items: [
                'genai/develop/agents/creating-an-agent',
                'genai/develop/agents/tools',
                'genai/develop/agents/memory',
                'genai/develop/agents/observability',
                {
                  type: 'category',
                  label: 'Evaluations',
                  link: { type: 'doc', id: 'genai/develop/agents/evaluations/overview' },
                  collapsed: true,
                  items: [
                    'genai/develop/agents/evaluations/evalsets',
                    'genai/develop/agents/evaluations/creating-evaluations',
                    'genai/develop/agents/evaluations/running-evaluations',
                  ],
                },
              ],
            },
            // MCP Integration
            {
              type: 'category',
              label: 'MCP Integration',
              link: { type: 'doc', id: 'genai/develop/mcp/overview' },
              collapsed: true,
              items: [
                'genai/develop/mcp/exposing-as-mcp',
                'genai/develop/mcp/consuming-mcp-from-agent',
              ],
            },
            // Natural Functions (single page)
            'genai/develop/natural-functions/overview',
            // Components
            'genai/develop/components/model-providers',
            'genai/develop/components/embedding-providers',
            'genai/develop/components/vector-stores',
            'genai/develop/components/knowledge-bases',
            'genai/develop/components/chunkers',
            'genai/develop/components/data-loaders',
          ],
        },
        // Tutorials
        {
          type: 'category',
          label: 'Tutorials',
          items: [
            'genai/tutorials/email-generator-direct-llm',
            'genai/tutorials/review-summarizer-natural-function',
            'genai/tutorials/building-hr-knowledge-base-rag',
            'genai/tutorials/building-a-customer-care-agent-mcp',
            'genai/tutorials/it-helpdesk-chatbot',
          ],
        }
      ],
    },

    // ─────────────────────────────────────────────
    // TUTORIALS
    // "Show me a complete, real example"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      link: { type: 'doc', id: 'guides/guides' },
      items: [
        {
          type: 'category',
          label: 'Enterprise Integration Patterns',
          items: [
            'guides/patterns/message',
            'guides/patterns/message-filter',
            'guides/patterns/content-based-routing',
            'guides/patterns/selective-consumer',
            'guides/patterns/polling-consumer',
            'guides/patterns/channel-adapter',
            'guides/patterns/message-dispatcher',
            'guides/patterns/service-activator',
            'guides/patterns/message-mapper',
          ],
        },
        {
          type: 'category',
          label: 'How to Guides',
          items: [
            'guides/howtoguides/sap-b1-low-stock-purchase-automation',
            'guides/howtoguides/s3-events-via-sqs-listener',
          ],
        },
        // Migration Guides
        {
          type: 'category',
          label: 'Migration Guides',
          items: [
            'guides/migration/from-mulesoft',
            'guides/migration/from-tibco',
          ],
        },
      ],
    },
    // DEPLOY
    // "How do I ship, run, and secure this?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Deploy',
      collapsed: true,
      link: { type: 'doc', id: 'deploy/overview' },
      items: [
        // WSO2 Cloud
        {
          type: 'category',
          label: 'Deploy to WSO2 Cloud',
          link: { type: 'doc', id: 'deploy/cloud/overview' },
          items: [
            'deploy/cloud/push-from-ide',
            'deploy/cloud/deploy-from-cloud-editor',
            'deploy/cloud/import-project',
            'deploy/cloud/import-integration',
          ],
        },
        // Self-hosted: upstream has migrated run-locally / docker /
        // kubernetes / openshift to deploy/self-hosted/*. The remaining
        // legacy deploy-operate/deploy/* docs that don't have a new
        // home yet are listed alongside so they stay reachable until
        // they're migrated too.
        {
          type: 'category',
          label: 'Self-Hosted',
          items: [
            'deploy/self-hosted/vm-deployment',
            'deploy/self-hosted/containerized-deployment',
            'deploy-operate/deploy/serverless-deployment',
            'deploy-operate/deploy/graalvm-native-images',
            'deploy-operate/deploy/managing-configurations',
            'deploy-operate/deploy/scaling-high-availability',
          ],
        },
        // CI/CD
        {
          type: 'category',
          label: 'CI/CD',
          items: [
            'deploy-operate/cicd/github-actions',
            'deploy-operate/cicd/jenkins',
            'deploy-operate/cicd/gitlab',
            'deploy-operate/cicd/azure-devops',
          ],
        },
        // Observe
        {
          type: 'category',
          label: 'Observe',
          items: [
            'deploy-operate/observe/observability-overview',
            'deploy-operate/observe/metrics-overview',
            'deploy-operate/observe/logging-overview',
            {
              type: 'category',
              label: 'Distributed Tracing',
              items: [
                'deploy-operate/observe/jaeger-distributed-tracing',
                'deploy-operate/observe/zipkin-tracing',
              ],
            },
            {
              type: 'category',
              label: 'Supported Platforms',
              items: [
                'deploy-operate/observe/integration-control-plane-icp',
                'deploy-operate/observe/recipe-datadog-setup',
                'deploy-operate/observe/new-relic-integration',
                'deploy-operate/observe/moesif-api-analytics',
              ],
            },
          ],
        },
        // Secure
        {
          type: 'category',
          label: 'Secure',
          items: [
            'deploy-operate/secure/keystore-truststore',
            'deploy-operate/secure/runtime-security',
            'deploy-operate/secure/authentication',
            'deploy-operate/secure/api-security-rate-limiting',
            'deploy-operate/secure/secrets-encryption',
            'deploy-operate/secure/ip-whitelisting',
            'deploy-operate/secure/compliance-considerations',
          ],
        },
        // Capacity Planning
        {
          type: 'category',
          label: 'Capacity Planning',
          items: [
            'deploy-operate/capacity-planning/overview',
            'deploy-operate/capacity-planning/performance-benchmarks',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // MANAGE
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Manage',
      collapsed: true,
      link: { type: 'doc', id: 'manage/overview' },
      items: [
        'manage/choosing-a-control-plane',
        // Cloud
        {
          type: 'category',
          label: 'WSO2 Cloud',
          link: { type: 'doc', id: 'manage/cloud/overview' },
          items: [
            // Integrations
            'manage/cloud/integrations',
            // Projects
            'manage/cloud/projects',
            // Configuration Management
            {
              type: 'category',
              label: 'Configurations',
              link: { type: 'doc', id: 'manage/cloud/configurations/overview' },
              items: [
                'manage/cloud/configurations/runtime-configurations',
                'manage/cloud/configurations/endpoint-configurations',
                'manage/cloud/configurations/security-configurations',
                'manage/cloud/configurations/build-configurations',
                'manage/cloud/configurations/scaling-resource-limits',
                'manage/cloud/configurations/custom-domain',
              ],
            },
            // Environments
            {
              type: 'category',
              label: 'Environments',
              link: { type: 'doc', id: 'manage/cloud/environments/overview' },
              items: [
                'manage/cloud/environments/promotion',
                'manage/cloud/environments/promotion-approval',
                'manage/cloud/environments/create',
              ],
            },
            // Observability
            {
              type: 'category',
              label: 'Observability',
              link: { type: 'doc', id: 'manage/cloud/observability/overview' },
              items: [
                'manage/cloud/observability/runtime-logs',
                'manage/cloud/observability/metrics',
                'manage/cloud/observability/anomaly-detection-alerts',
              ],
            },
            // CI/CD
            {
              type: 'category',
              label: 'CI/CD',
              link: { type: 'doc', id: 'manage/cloud/cicd/overview' },
              items: [
                'manage/cloud/cicd/connect-git-repository',
                'manage/cloud/cicd/deployment-pipelines',
              ],
            },
            // Users and Access
            {
              type: 'category',
              label: 'Users and Access',
              link: { type: 'doc', id: 'manage/cloud/users-and-access/overview' },
              items: [
                    'manage/cloud/users-and-access/access-control',
                    'manage/cloud/users-and-access/configure-enterprise-login',
                    {
                        type: 'category',
                        label: 'Access APIs with an External IdP',
                        link: { type: 'doc', id: 'manage/cloud/users-and-access/api-external-idp/overview' },
                        items: [
                            'manage/cloud/users-and-access/api-external-idp/asgardeo',
                            'manage/cloud/users-and-access/api-external-idp/azure',
                        ],
                    },
                ],
            },
            {
              type: 'category',
              label: 'Platform Services',
              items: [
                'manage/cloud/platform-services/managed-databases',
              ],
            },
             {
              type: 'category',
              label: 'RAG (Retrieval-Augmented Generation)',
              items: [
                'manage/cloud/rag-ingestion/ingestion',
                'manage/cloud/rag-ingestion/retrieval',
                'manage/cloud/rag-ingestion/service',
                'manage/cloud/rag-ingestion/vector-databases',
                'manage/cloud/rag-ingestion/querying',
              ],
            },
            {
              type: 'category',
              label: 'Billing',
              items: [
                'manage/cloud/billing/pricing-and-plans',
                'manage/cloud/billing/usage-dashboards',
              ],
            },
            {
              type: 'category',
              label: 'Audit',
              items: [
                'manage/cloud/audit/audit-logs',
                'manage/cloud/audit/compliance-data-residency',
              ],
            },
            // API Management
            {
              type: 'category',
              label: 'API Management',
              link: { type: 'doc', id: 'manage/cloud/api-management/overview' },
              items: [
                'manage/cloud/api-management/lifecycle-management',
                'manage/cloud/api-management/api-security',
                {
                  type: 'category',
                  label: 'Consuming APIs',
                  items: [
                    'manage/cloud/api-management/consuming-apis/consuming-an-api-secured-with-an-api-key',
                    'manage/cloud/api-management/consuming-apis/consuming-an-api-secured-with-oauth2',
                  ],
                },
                'manage/cloud/api-management/api-rate-limiting',
              ],
            },
            // Private data plane
            {
              type: 'category',
              label: 'Private Data Plane',
              link: { type: 'doc', id: 'manage/cloud/private-data-plane/overview' },
              items: [
                'manage/cloud/private-data-plane/management-models',
                'manage/cloud/private-data-plane/security-levels',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'WSO2 Integration Control Plane',
          link: { type: 'doc', id: 'manage/icp/integration-control-plane' },
          items: [
            'manage/icp/install-icp',
            'manage/icp/deploy-kubernetes',
            'manage/icp/icp-console-overview',
            'manage/icp/quick-start',
            'manage/icp/connect-runtime',
            'manage/icp/observability-setup',
            'manage/icp/manage-projects',
            'manage/icp/manage-environments',
            'manage/icp/manage-integrations',
            'manage/icp/manage-runtimes',
            'manage/icp/reverse-proxy',
            'manage/icp/access-control',
            'manage/icp/encrypt-secrets',
            {
              type: 'category',
              label: 'User Stores',
              link: { type: 'doc', id: 'manage/icp/user-stores/configure-user-stores' },
              items: [
                'manage/icp/user-stores/default-user-store',
                'manage/icp/user-stores/ldap-user-store',
                'manage/icp/user-stores/sso-configuration',
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // REFERENCE
    // "What's the exact syntax / config / API for Z?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      link: { type: 'doc', id: 'reference/reference' },
      items: [
        // Language
        {
          type: 'category',
          label: 'Language',
          items: [
            'reference/language/type-system',
            'reference/language/error-handling',
            'reference/language/query-expressions',
            'reference/language/concurrency'
          ],
        },
        // Configuration
        {
          type: 'category',
          label: 'Configuration',
          items: [
            'reference/config/configuration-management',
            'reference/config/configtoml-reference',
          ],
        },
        // Project
        {
          type: 'category',
          label: 'Project',
          items: [
            'reference/project/ballerinatoml-reference',
            'reference/project/cloudtoml-reference',
          ],
        },
        // ICP Configuration
        {
          type: 'category',
          label: 'ICP Configuration',
          items: [
            'reference/icp/server-configuration',
            'reference/icp/database-configuration',
            'reference/icp/authentication-config',
          ],
        },
        // APIs
        {
          type: 'category',
          label: 'APIs',
          items: [
            'reference/api/management',
            'reference/api/auth-api',
            'reference/api/icp',
            'reference/api/ballerina-documentation',
          ],
        },

        'reference/supported-protocols',
        'reference/streaming-capabilities',
        {
          type: 'category',
          label: 'Supported Data Formats',
          link: { type: 'doc', id: 'reference/data-formats/supported-data-formats' },
          items: [
            'reference/data-formats/avro',
            'reference/data-formats/csv',
            'reference/data-formats/edi',
            'reference/data-formats/fhir',
            'reference/data-formats/hl7',
            'reference/data-formats/json',
            'reference/data-formats/protocol-buffers',
            'reference/data-formats/toml',
            'reference/data-formats/xml',
            'reference/data-formats/xlsx',
            'reference/data-formats/yaml',
          ],
        },
        'reference/ballerina-by-example',
        'reference/ballerina-specifications',
        'reference/ai-usage-and-data-handling-guidelines',
        // Miscellaneous
        {
          type: 'category',
          label: 'Miscellaneous',
          items: [
            'reference/miscellaneous/configure-a-network-proxy',
            'reference/miscellaneous/proxy-ballerina-central-with-maven-repository',
          ],
        },
        // Appendix
        {
          type: 'category',
          label: 'Appendix',
          items: [
            'reference/appendix/error-code',
            'reference/appendix/glossary',
            'reference/appendix/faq',
            'reference/appendix/release-notes',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
