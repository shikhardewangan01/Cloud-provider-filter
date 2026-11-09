import React from 'react';

export interface CloudProviderInfo {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  brandColor: string;
  badgeBg: string;
  badgeText: string;
  logoUrl: string;
  logoSvg?: React.ReactNode;
  overview: string;
  bestFor: string[];
  watchOutFor: string[];
  typicalMonthlyPricing: string;
  regionsInIndia: string[];
  keyServices: {
    compute: string;
    database: string;
    storage: string;
    serverless: string;
    networking: string;
  };
}

export const CLOUD_PROVIDERS: Record<string, CloudProviderInfo> = {
  gcp: {
    id: 'gcp',
    name: 'Google Cloud Platform',
    shortName: 'GCP',
    tagline: 'Leading data, AI/ML, and serverless container ecosystem',
    brandColor: '#4285F4',
    badgeBg: '#E8F0FE',
    badgeText: '#1967D2',
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/googlecloud/googlecloud-original.svg',
    overview: 'Ideal for modern microservices, Kubernetes (GKE), serverless containers (Cloud Run), and native Gemini AI workflows.',
    bestFor: ['Cloud Run serverless containers', 'Gemini & Vertex AI models', 'BigQuery analytics', 'Fast global network backbone'],
    watchOutFor: ['Customer support can be expensive', 'Frequent service rebranding', 'Sudden quota limits'],
    typicalMonthlyPricing: '₹3,500 – ₹45,000/mo',
    regionsInIndia: ['Mumbai (asia-south1)', 'Delhi NCR (asia-south2)'],
    keyServices: {
      compute: 'Cloud Run / GKE',
      database: 'Cloud SQL / AlloyDB / Firestore',
      storage: 'Google Cloud Storage',
      serverless: 'Cloud Functions / Cloud Run',
      networking: 'Cloud CDN & Cloud Armor'
    }
  },
  aws: {
    id: 'aws',
    name: 'Amazon Web Services',
    shortName: 'AWS',
    tagline: 'The undisputed heavyweight in cloud breadth and enterprise compliance',
    brandColor: '#FF9900',
    badgeBg: '#FFF3E0',
    badgeText: '#E65100',
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    overview: 'The default choice for scale, enterprise governance, strict compliance, and endless third-party integrations.',
    bestFor: ['Mission critical enterprise apps', 'Aurora Serverless PostgreSQL', 'Complex compliance (HIPAA, SOC2, PCI-DSS)', 'Deep ecosystem support'],
    watchOutFor: ['High network egress costs (~$0.09/GB)', 'Overly complex IAM permission model', 'NAT Gateway cost traps'],
    typicalMonthlyPricing: '₹6,500 – ₹75,000/mo',
    regionsInIndia: ['Mumbai (ap-south-1)', 'Hyderabad (ap-south-2)'],
    keyServices: {
      compute: 'ECS Fargate / EKS / EC2',
      database: 'Aurora Serverless / RDS / DynamoDB',
      storage: 'Amazon S3 / Glacier',
      serverless: 'AWS Lambda / EventBridge',
      networking: 'CloudFront & Route 53'
    }
  },
  cloudflare: {
    id: 'cloudflare',
    name: 'Cloudflare',
    shortName: 'Cloudflare',
    tagline: 'Super-edge runtime with zero egress fees and sub-5ms cold starts',
    brandColor: '#F38020',
    badgeBg: '#FFF4EB',
    badgeText: '#D96500',
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/cloudflare/cloudflare-original.svg',
    overview: 'Unbeatable for globally distributed web apps, APIs, Jamstack, video/media delivery, and zero-egress storage.',
    bestFor: ['Zero data egress fees on R2', 'Instant edge workers (<5ms cold start)', 'DDoS mitigation and global CDN', 'D1 edge SQLite & Hyperdrive Postgres accelerator'],
    watchOutFor: ['No long-running background CPU tasks (>30s limits)', 'V8 isolate environment differs from Node.js', 'Complex stateful databases'],
    typicalMonthlyPricing: '₹1,600 – ₹12,000/mo',
    regionsInIndia: ['Mumbai, Delhi, Chennai, Bangalore, Hyderabad, Kolkata (Edge PoPs)'],
    keyServices: {
      compute: 'Workers / Workflows / Pages',
      database: 'D1 / Hyperdrive / KV / Vectorize',
      storage: 'R2 Object Storage (Zero Egress)',
      serverless: 'Workers AI',
      networking: 'Edge CDN, Anycast DNS & WAF'
    }
  },
  supabase: {
    id: 'supabase',
    name: 'Supabase',
    shortName: 'Supabase',
    tagline: 'The open-source Firebase alternative powered by PostgreSQL',
    brandColor: '#3ECF8E',
    badgeBg: '#EDFDF5',
    badgeText: '#0F8B52',
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/supabase/supabase-original.svg',
    overview: 'The fastest way to build modern web and mobile apps with Postgres, Auth, Row Level Security, Realtime, and Storage.',
    bestFor: ['Rapid product prototyping', 'Full Postgres power with pgvector', 'Built-in authentication & RLS', 'Realtime WebSockets'],
    watchOutFor: ['Free tier projects pause after 1 week inactivity', 'Complex custom backend logic needs edge functions', 'Large scale custom workers'],
    typicalMonthlyPricing: '₹2,000 – ₹18,000/mo',
    regionsInIndia: ['Mumbai (ap-south-1 AWS underlying)'],
    keyServices: {
      compute: 'Deno Edge Functions',
      database: 'Managed PostgreSQL + pgvector',
      storage: 'Supabase Storage (S3 API)',
      serverless: 'Realtime WebSockets',
      networking: 'Fastly CDN & Auth Proxy'
    }
  },
  azure: {
    id: 'azure',
    name: 'Microsoft Azure',
    shortName: 'Azure',
    tagline: 'The premier choice for Microsoft enterprises, .NET, and OpenAI integration',
    brandColor: '#0089D6',
    badgeBg: '#E1F3FE',
    badgeText: '#00629B',
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/azure/azure-original.svg',
    overview: 'Top tier for enterprise .NET ecosystems, Microsoft 365 / Active Directory integrations, and Azure OpenAI enterprise tiers.',
    bestFor: ['Azure OpenAI enterprise models', '.NET / C# applications', 'Active Directory & Enterprise SSO', 'Hybrid on-premise cloud'],
    watchOutFor: ['Azure portal can be sluggish', 'Higher baseline pricing', 'Complex networking setup'],
    typicalMonthlyPricing: '₹7,000 – ₹85,000/mo',
    regionsInIndia: ['Central India (Pune)', 'South India (Chennai)', 'West India (Mumbai)'],
    keyServices: {
      compute: 'Azure Container Apps / AKS',
      database: 'Azure SQL / Cosmos DB',
      storage: 'Azure Blob Storage',
      serverless: 'Azure Functions',
      networking: 'Azure Front Door & Application Gateway'
    }
  },
  digitalocean: {
    id: 'digitalocean',
    name: 'DigitalOcean',
    shortName: 'DigitalOcean',
    tagline: 'Simple, transparent developer cloud with zero billing surprises',
    brandColor: '#0080FF',
    badgeBg: '#E5F2FF',
    badgeText: '#0055B3',
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/digitalocean/digitalocean-original.svg',
    overview: 'Loved by solo developers, indie teams, and startups who want straightforward VPS (Droplets), App Platform, and fixed monthly invoices.',
    bestFor: ['Transparent flat-rate pricing', 'Fast setup App Platform (PaaS)', 'Managed PostgreSQL & Redis', 'Solo developers & small teams'],
    watchOutFor: ['Fewer global regions than hyperscalers', 'No complex multi-region active-active VPCs', 'Limited serverless event triggers'],
    typicalMonthlyPricing: '₹1,500 – ₹15,000/mo',
    regionsInIndia: ['Bangalore (BLR1)'],
    keyServices: {
      compute: 'App Platform / Droplets (VPS) / DOKS (Kubernetes)',
      database: 'Managed Postgres / MySQL / Redis',
      storage: 'Spaces Object Storage',
      serverless: 'Functions',
      networking: 'Cloud Firewalls & VPC'
    }
  },
  hetzner: {
    id: 'hetzner',
    name: 'Hetzner Cloud',
    shortName: 'Hetzner',
    tagline: 'Raw compute beast with the world’s best price-to-CPU performance ratio',
    brandColor: '#D50C2D',
    badgeBg: '#FDECEF',
    badgeText: '#A1051F',
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/hetzner/hetzner-original.svg',
    overview: 'The favorite of bootstrappers and infrastructure purists who want 8 vCPUs and 32GB RAM for the cost of a small AWS micro-instance.',
    bestFor: ['High-performance bare metal & virtual servers', 'Self-hosted Docker / Coolify / Dokku stacks', 'Heavy compute, crawling, rendering, or continuous batch processing', 'Unmatched value per Euro/Rupee'],
    watchOutFor: ['Only in Germany, Finland, and USA (Virginia/Oregon) - no India region', 'Self-managed maintenance required', 'Strict automated fraud verification at signup'],
    typicalMonthlyPricing: '₹1,200 – ₹8,000/mo',
    regionsInIndia: ['Nearest: Nuremberg/Falkenstein (EU) or Ashburn (US East) - use Cloudflare edge in front'],
    keyServices: {
      compute: 'Hetzner Cloud CPX / Dedicated AX servers',
      database: 'Self-hosted PostgreSQL / MySQL',
      storage: 'Storage Boxes & NVMe Volumes',
      serverless: 'Community PaaS (Coolify / Kamal)',
      networking: 'Cloud Networks (Private vSwitch) with 20TB free traffic'
    }
  },
  render: {
    id: 'render',
    name: 'Render',
    shortName: 'Render',
    tagline: 'Modern successor to Heroku: deploy web services, workers, and cron in seconds',
    brandColor: '#46E3B7',
    badgeBg: '#E9FBF6',
    badgeText: '#0B7F5E',
    logoUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/render/render-original.svg',
    overview: 'Zero DevOps required. Connect your GitHub repository, git push, and Render automatically builds, deploys, and provides SSL certificates.',
    bestFor: ['Fastest git-push-to-deploy workflow', 'Background workers & cron jobs', 'Managed PostgreSQL + Redis', 'Small SaaS and web apps'],
    watchOutFor: ['Free tier spin-down latency (50s cold start)', 'Bandwidth overage costs if scaling large media', 'Limited fine-grained VPC routing'],
    typicalMonthlyPricing: '₹1,600 – ₹14,000/mo',
    regionsInIndia: ['Nearest: Singapore (ap-southeast-1)'],
    keyServices: {
      compute: 'Web Services & Background Workers',
      database: 'Managed PostgreSQL & Redis',
      storage: 'Render Disks (Persistent NVMe)',
      serverless: 'Cron Jobs & Previews',
      networking: 'Automated Global CDN & SSL'
    }
  }
};

export const SAMPLE_USE_CASES = [
  {
    title: 'Real-time AI Voice Agent',
    badge: 'Low Latency + AI',
    desc: 'Audio streaming via WebSockets, Gemini API integration, and low-latency audio processing in Mumbai and Singapore.',
    params: { region: 'Mumbai & Singapore', scale: '10K DAU', budget: '₹15,000 - ₹30,000/mo', compliance: 'Standard SSL' }
  },
  {
    title: 'High-Traffic E-Commerce Store',
    badge: 'Scale + Payments',
    desc: 'Next.js storefront, high-concurrency checkout bursts, relational catalog DB, fast edge caching, and payment webhooks.',
    params: { region: 'All India (Tier 1 & Tier 2)', scale: '500K monthly sessions', budget: '₹25,000 - ₹50,000/mo', compliance: 'PCI-DSS' }
  },
  {
    title: 'Bootstrapped Indie SaaS (B2B)',
    badge: 'Minimal DevOps',
    desc: 'Multi-tenant PostgreSQL with row-level security, user authentication, subscription billing, and weekly automated reports.',
    params: { region: 'Global', scale: '1K B2B teams', budget: 'Under ₹5,000/mo', compliance: 'SOC2 ready' }
  },
  {
    title: 'Heavy Batch Processing & Web Scraping',
    badge: 'Compute Intensive',
    desc: 'Continuous background workers running Chromium instances, downloading datasets, and running OCR without high bills.',
    params: { region: 'EU or US East', scale: '24/7 continuous workers', budget: 'Best price/CPU', compliance: 'None' }
  },
  {
    title: 'Global Edge API & Media Microservice',
    badge: 'Zero Egress Fees',
    desc: 'Serving millions of user-uploaded images and documents globally with zero outbound bandwidth penalties and sub-10ms response.',
    params: { region: 'Global Anycast', scale: '5M API calls / 500GB egress', budget: 'Cost sensitive', compliance: 'GDPR' }
  }
];
