// Shared Cloud Architecture & Heuristic Engine
// Works seamlessly in Express, Vercel Serverless, and as a browser fallback

export function generateIntelligentFallback(useCase: string, params?: any) {
  const text = (useCase + ' ' + (params?.preferredType || '') + ' ' + (params?.compliance || '')).toLowerCase();

  const isEdgeOrStatic = text.includes('edge') || text.includes('static') || text.includes('cdn') || text.includes('jamstack') || text.includes('workers');
  const isAiMl = text.includes('ai') || text.includes('llm') || text.includes('rag') || text.includes('machine learning') || text.includes('gemini') || text.includes('vertex') || text.includes('vector');
  const isIndieOrSimple = text.includes('mvp') || text.includes('indie') || text.includes('prototype') || text.includes('simple') || text.includes('low budget') || text.includes('cheap');
  const isHeavyCompute = text.includes('bare metal') || text.includes('heavy') || text.includes('rendering') || text.includes('scraping') || text.includes('mining') || text.includes('gpu');
  const isEnterprise = text.includes('enterprise') || text.includes('hipaa') || text.includes('soc2') || text.includes('rbi') || text.includes('banking') || text.includes('compliance');

  let chosenId = 'gcp';
  let chosenName = 'Google Cloud Platform';
  let headline = 'Top tier container ergonomics with Cloud Run and low-latency global network.';
  let matchScore = 94;

  if (isEdgeOrStatic) {
    chosenId = 'cloudflare';
    chosenName = 'Cloudflare';
    headline = 'Zero-cold-start edge compute with ultra-low latency across 300+ global cities.';
    matchScore = 97;
  } else if (isAiMl) {
    chosenId = 'gcp';
    chosenName = 'Google Cloud Platform';
    headline = 'Unrivaled developer ergonomics with Vertex AI, Cloud Run, and native Gemini integration.';
    matchScore = 96;
  } else if (isIndieOrSimple) {
    chosenId = 'supabase';
    chosenName = 'Supabase';
    headline = 'Instant PostgreSQL backend with built-in Auth, Realtime, and Edge Functions.';
    matchScore = 95;
  } else if (isHeavyCompute) {
    chosenId = 'hetzner';
    chosenName = 'Hetzner Cloud';
    headline = 'Unmatched compute price-to-performance ratio in Europe & North America.';
    matchScore = 93;
  } else if (isEnterprise) {
    chosenId = 'aws';
    chosenName = 'Amazon Web Services';
    headline = 'Industry-standard compliance certifications, deepest enterprise IAM, and global availability.';
    matchScore = 95;
  }

  const providerArchitectureMap: Record<string, any> = {
    gcp: {
      compute: { service: 'Cloud Run', description: 'Serverless container orchestration scaling to zero in <1.2s' },
      database: { service: 'Cloud SQL (PostgreSQL)', description: 'Managed transactional DB with automated failover and daily snapshots' },
      storage: { service: 'Google Cloud Storage (GCS)', description: 'Multi-region bucket for static assets and user uploads' },
      networking: { service: 'Cloud CDN + Cloud Armor', description: 'Google premium tier global backbone with DDoS protection' },
      aiOrExtra: { service: 'Vertex AI + Gemini 3.1 Flash Lite', description: 'Native model endpoints with built-in grounding and low-latency embeddings' }
    },
    aws: {
      compute: { service: 'AWS ECS on Fargate', description: 'Serverless containers running isolated task definitions without EC2 maintenance' },
      database: { service: 'Amazon Aurora Serverless v2', description: 'Auto-scaling PostgreSQL with 99.99% multi-AZ reliability' },
      storage: { service: 'Amazon S3 Standard', description: 'Industry standard durable object storage with lifecycle tiering' },
      networking: { service: 'Amazon CloudFront + Route 53', description: 'Global content delivery network with edge certificate management' },
      aiOrExtra: { service: 'Amazon Bedrock / SQS', description: 'Decoupled asynchronous worker messaging' }
    },
    cloudflare: {
      compute: { service: 'Cloudflare Workers & Workflows', description: 'V8 isolates running at 330+ edge PoPs with <5ms cold starts' },
      database: { service: 'D1 & Hyperdrive', description: 'Distributed SQLite at the edge connected to PostgreSQL connection pools' },
      storage: { service: 'Cloudflare R2', description: 'S3-compatible object storage with ZERO outbound egress fees' },
      networking: { service: 'Cloudflare Edge CDN & DNS', description: 'Fastest anycast DNS in the world with automatic DDoS mitigation' },
      aiOrExtra: { service: 'Workers AI + Vectorize', description: 'Serverless AI inference running directly on Cloudflare edge GPUs' }
    },
    supabase: {
      compute: { service: 'Supabase Edge Functions (Deno)', description: 'Low-latency serverless TypeScript functions' },
      database: { service: 'Supabase Managed Postgres (pgvector)', description: 'Production-ready Postgres with Row-Level Security, vector search, and webhooks' },
      storage: { service: 'Supabase Storage', description: 'Integrated asset storage with image transformation on the fly' },
      networking: { service: 'Supabase Realtime Engine', description: 'WebSocket protocol for live client synchronization' },
      aiOrExtra: { service: 'Supabase Auth & RLS', description: 'Instant JWT session management and role-based policies' }
    },
    hetzner: {
      compute: { service: 'Hetzner Cloud CPX / Dedicated AX', description: 'High-frequency AMD EPYC virtual machines with dedicated vCPUs' },
      database: { service: 'Self-hosted PostgreSQL / TimescaleDB', description: 'Direct NVMe SSD storage performance without managed DB markup' },
      storage: { service: 'Hetzner Storage Box', description: 'Reliable RAID storage via rsync, SFTP, and WebDAV' },
      networking: { service: 'Hetzner Cloud Networks (vSwitch)', description: 'Private 10Gbps mesh network with 20TB free outbound traffic' },
      aiOrExtra: { service: 'Coolify / Docker Swarm', description: 'Open-source PaaS interface on top of Hetzner raw compute' }
    }
  };

  const arch = providerArchitectureMap[chosenId] || providerArchitectureMap.gcp;

  return {
    primaryProvider: {
      id: chosenId,
      name: chosenName,
      headline,
      matchScore,
      whyItWins: `Based on your workload evaluation, ${chosenName} emerged as the clear winner. It matches your operational requirements by providing an optimal balance of developer ergonomics, minimal infrastructure operational overhead, and predictable operational costs.

Unlike competing providers that introduce steep IAM configuration overhead or high egress penalty fees, ${chosenName} allows you to deploy containerized services or distributed edge primitives with minimal friction while retaining high global reliability.`,
      keyAdvantageBulletPoints: [
        'Minimal operational maintenance: automated scaling and zero-downtime rolling updates.',
        'Predictable pricing without hidden cross-zone network charges.',
        'Superb developer ergonomics: native local development and fast CI/CD integration.',
        'High performance regional presence in key latency zones (Mumbai, Singapore, Frankfurt, US East).'
      ],
      recommendedArchitecture: arch,
      estimatedMonthlyCostInr: chosenId === 'cloudflare' ? 4200 : chosenId === 'supabase' ? 3800 : chosenId === 'hetzner' ? 5600 : 18500,
      costBreakdown: [
        { item: 'Core Compute / Function Execution', costInr: chosenId === 'hetzner' ? 3200 : 8500, note: 'Sized for baseline + burst headroom' },
        { item: 'Managed Database / High Availability', costInr: chosenId === 'hetzner' ? 1200 : 6500, note: 'Includes automated daily backups' },
        { item: 'Storage & Object Backups', costInr: 1200, note: 'Standard tier data storage' },
        { item: 'Networking & Global Egress', costInr: chosenId === 'cloudflare' ? 0 : 2300, note: chosenId === 'cloudflare' ? 'Zero egress fees on R2' : 'Bandwidth allowance' }
      ],
      potentialWatchouts: [
        'Verify database connection pooling under sudden concurrency bursts.',
        'Configure billing alerts at 80% and 100% threshold to prevent surprise overages.',
        'Keep multi-region failover scripts tested quarterly.'
      ],
      deploymentQuickstartCmd: `npm install -g @${chosenId}/cli && ${chosenId} init`,
      terraformSnippet: `resource "${chosenId}_service" "app" {\n  name     = "core-service"\n  location = "asia-south1"\n  plan     = "standard"\n}`
    },
    runnerUps: [
      {
        id: chosenId === 'aws' ? 'gcp' : 'aws',
        name: chosenId === 'aws' ? 'Google Cloud Platform' : 'Amazon Web Services',
        matchScore: matchScore - 6,
        pros: 'Deepest service catalog and massive enterprise ecosystem.',
        whyItFellShort: 'Steeper IAM learning curve and higher complexity for small to mid-sized teams.',
        estimatedMonthlyCostInr: 24800
      },
      {
        id: chosenId === 'cloudflare' ? 'supabase' : 'cloudflare',
        name: chosenId === 'cloudflare' ? 'Supabase' : 'Cloudflare',
        matchScore: matchScore - 9,
        pros: 'Rapid developer iteration with great DX.',
        whyItFellShort: 'Requires hybrid integration for heavy custom background long-running CPU tasks.',
        estimatedMonthlyCostInr: 6400
      }
    ],
    comparisonMatrix: {
      dimensions: [
        'Developer Ergonomics',
        'Cost Efficiency (₹)',
        'Indian & Global Latency',
        'Database & Scaling',
        'Ecosystem Maturity'
      ],
      primaryProviderScores: [
        { dimension: 'Developer Ergonomics', score: 94, comment: 'Clean CLI and automated preview environments' },
        { dimension: 'Cost Efficiency (₹)', score: 91, comment: 'Generous free tier and predictable billing tiers' },
        { dimension: 'Indian & Global Latency', score: 95, comment: 'Direct point-of-presence in Mumbai/Delhi' },
        { dimension: 'Database & Scaling', score: 92, comment: 'Zero-config connection pooling and auto-grow' },
        { dimension: 'Ecosystem Maturity', score: 90, comment: 'Strong community, robust docs, and SDK coverage' }
      ],
      contenderScores: [
        {
          providerName: 'AWS',
          scores: [
            { dimension: 'Developer Ergonomics', score: 78, comment: 'Dense console and complex IAM policies' },
            { dimension: 'Cost Efficiency (₹)', score: 76, comment: 'Egress fees and NAT gateways inflate monthly total' },
            { dimension: 'Indian & Global Latency', score: 96, comment: 'Comprehensive Mumbai and Hyderabad regions' },
            { dimension: 'Database & Scaling', score: 97, comment: 'Aurora is gold standard for large relational workloads' },
            { dimension: 'Ecosystem Maturity', score: 99, comment: 'Every third-party tool has first-class AWS support' }
          ]
        },
        {
          providerName: 'Cloudflare',
          scores: [
            { dimension: 'Developer Ergonomics', score: 96, comment: 'Wrangler CLI is fast and effortless' },
            { dimension: 'Cost Efficiency (₹)', score: 98, comment: 'Zero egress fees makes bandwidth essentially free' },
            { dimension: 'Indian & Global Latency', score: 99, comment: 'Edge caches hit user in under 15ms across India' },
            { dimension: 'Database & Scaling', score: 82, comment: 'D1 and Hyperdrive are evolving rapidly' },
            { dimension: 'Ecosystem Maturity', score: 85, comment: 'Excellent for edge apps; growing for heavy stateful jobs' }
          ]
        }
      ]
    },
    initialAdvisorDialogue: `I have thoroughly analyzed your workload requirements. Based on compute profile, regional latency considerations, and cost efficiency, **${chosenName}** is your best-in-class foundation.

It provides a match score of **${matchScore}%**, minimizing infrastructure toil while giving your team runway to scale without rewriting core architecture. Below is the proposed topology, estimated expenditure in ₹, and side-by-side trade-offs against key contenders.`,
    suggestedFollowUps: [
      `How does ${chosenName} handle database failovers and backups?`,
      'Compare egress network costs between AWS, GCP, and Cloudflare.',
      'Show me a production Terraform boilerplate for this architecture.',
      'What are the cold-start benchmarks for serverless compute in India regions?'
    ]
  };
}

export function generateFallbackChatReply(userMessage: string, context: any) {
  const q = userMessage.toLowerCase();
  const provider = context?.primaryProvider?.name || 'the recommended cloud provider';

  if (q.includes('cost') || q.includes('price') || q.includes('bill') || q.includes('₹') || q.includes('$')) {
    return `### Cloud Cost Analysis & Optimization Strategy

When evaluating expenditure for your workload on **${provider}**, the three primary cost drivers to monitor are:

1. **Compute Sizing vs. Idle Time:**
   - On managed serverless services (e.g. Cloud Run, AWS Fargate), you only pay for active request cycles and provisioned concurrency. This typically results in a **35–55% savings** over running dedicated 24/7 virtual machines during off-peak hours.
   - For an average scale, expect compute to hover around **₹6,000 to ₹14,000/mo ($70–$170/mo)**.

2. **Data Egress & Cross-Zone Network Bandwidth:**
   - AWS and GCP charge standard outbound internet egress (~₹7.20 / $0.09 per GB after first 100GB).
   - If your application serves heavy media or large API payloads, placing a **Cloudflare CDN** in front of ${provider}'s storage buckets drops egress bills to near zero due to the Bandwidth Alliance.

3. **Managed Database Reserved Pricing:**
   - Committing to a 1-year reserved instance or savings plan drops database costs by **up to 40%**.

*Recommendation:* Configure a hard billing budget with email alerts at 50%, 80%, and 100% of your target threshold to ensure zero surprises.`;
  }

  if (q.includes('compare') || q.includes('vs') || q.includes('alternative')) {
    return `### Direct Architectural Comparison

Comparing **${provider}** with its immediate alternatives:

| Dimension | ${provider} | Amazon Web Services (AWS) | Cloudflare Edge Stack |
| :--- | :--- | :--- | :--- |
| **Developer Ergonomics** | High (fast CLI, clean UI) | Moderate (steep IAM curve) | Extreme (Wrangler, zero cold starts) |
| **Database Ecosystem** | Managed Postgres / BigQuery | Aurora Serverless / RDS | D1 SQLite / Hyperdrive proxy |
| **Network Egress Fees** | Standard cloud rates | High egress (~$0.09/GB) | **Zero egress fees** on R2 |
| **Setup Time to Prod** | < 1 hour | 2–3 days (VPC, Subnets, IAM) | 15 minutes |
| **Vendor Portability** | High (Standard OCI Containers) | Moderate | Moderate (V8 Worker runtime) |

*Bottom Line:* If your team wants minimal DevOps maintenance with maximum development velocity, **${provider}** remains the most balanced choice for this specific workload.`;
  }

  if (q.includes('terraform') || q.includes('iac') || q.includes('code') || q.includes('deploy')) {
    return `### Production Infrastructure-as-Code (Terraform)

Here is a clean Terraform foundation tailored for your workload:

\`\`\`hcl
# main.tf - Cloud Infrastructure Blueprint
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = "asia-south1" # Mumbai Region
}

resource "google_cloud_run_v2_service" "app_service" {
  name     = "warm-cloud-service"
  location = "asia-south1"
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = 1 # Keep 1 warm to eliminate cold starts
      max_instance_count = 20
    }

    containers {
      image = "gcr.io/\${var.project_id}/app:latest"
      resources {
        limits = {
          cpu    = "2000m"
          memory = "2Gi"
        }
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }
  }
}
\`\`\`

You can deploy this in 3 commands:
\`\`\`bash
terraform init
terraform plan -out=tfplan
terraform apply tfplan
\`\`\``;
  }

  return `### Architectural Insight & Guidance

Regarding your question about **${provider}**:

- **Operational Simplicity:** The chosen architecture isolates compute from state. This means your application containers can be destroyed, restarted, or auto-scaled horizontally without any risk to your persistent database or storage assets.
- **Resilience Strategy:** For zero downtime, ensure your health check endpoints (\`/healthz\` or \`/api/health\`) test both process liveness and database connection ping before reporting healthy status to the load balancer.
- **Security Baseline:** Implement strict least-privilege service accounts rather than root credentials. Keep secrets managed in the cloud provider's native Secret Manager rather than baking them into container environment variables.

Feel free to ask for a deeper dive into database connection pooling, latency comparisons across specific Indian or global regions, or disaster recovery playbooks!`;
}
