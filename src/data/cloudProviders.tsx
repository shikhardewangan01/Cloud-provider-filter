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
  logoSvg: React.ReactNode;
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
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
    logoSvg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <path fill="#EA4335" d="M19.4 17.6l2.9-5.1C18.6 10.4 14.5 9 10 9c-7.2 0-13 5.8-13 13 0 2.2.6 4.3 1.5 6.1l5.2-3c-.5-1-.7-2-.7-3.1 0-3.9 3.1-7 7-7 3.4 0 6.3 2.4 7 5.6h2.4z"/>
        <path fill="#4285F4" d="M37.5 19c-1.3-5.7-6.4-10-12.5-10-4.5 0-8.6 2.3-11.1 5.8l2.9 5.1c1.8-2.5 4.8-4.1 8.2-4.1 4.7 0 8.7 3.2 9.8 7.6h4.7z"/>
        <path fill="#FBBC05" d="M37.5 19H34.8c-.3 1.4-.9 2.7-1.8 3.8l3.4 3.4c1.8-2 2.9-4.5 3.3-7.2h-2.2z"/>
        <path fill="#34A853" d="M36.4 26.2l-3.4-3.4c-1.6 2-4 3.2-6.7 3.2-3.1 0-5.8-1.7-7.2-4.2l-5.1 3c2.4 4.3 7 7.2 12.3 7.2 4.4 0 8.3-2.1 10.8-5.8h-.7z"/>
      </svg>
    ),
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
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    logoSvg: (
      <svg viewBox="0 0 64 40" className="w-full h-full" fill="none">
        <path fill="#FF9900" d="M52.3 30.6C44.4 35.3 32.8 37.8 22 36.2c-7.3-1.1-13.8-4-19.1-8.5-.7-.6-.1-1.5.7-1.1 8.5 4.7 18.7 7.3 29.3 7.3 6.6 0 13.9-1.2 20.3-4.2.9-.4 1.7.5 1.1 1.2z"/>
        <path fill="#FF9900" d="M54.7 28.5c-.8-1-5.1-1.3-7.8-1.1-.4 0-.5-.3-.2-.5 2.1-1.5 5.6-1.1 6.3-.2.8 1 0 4.6-2 6.3-.3.3-.6.1-.5-.2.5-1.1 4.5-3.8 4.2-4.3z"/>
        <path fill="#232F3E" d="M19.7 15.6c0 3.2-1.7 5.4-4.8 5.4-1.6 0-3-.7-3.9-1.8v1.5h-2.7V7.8h2.7v4.6c.9-1.1 2.3-1.8 3.9-1.8 3.1 0 4.8 2.2 4.8 5zm-2.7 0c0-1.8-.9-3-2.6-3s-2.6 1.2-2.6 3 .9 3 2.6 3 2.6-1.2 2.6-3zM32.8 20.7h-2.6l-3.2-8.3h2.8l2 6 2.1-6h2.7l-3.8 8.3zM45 19.3c-1.3 1-3.2 1.6-5 1.6-3.8 0-6.1-2.2-6.1-5.4 0-3.3 2.5-5.5 6.4-5.5 1.6 0 3.1.4 4.3 1.2l-1.3 2c-.9-.6-2-1-3-1-2.2 0-3.6 1.3-3.6 3.2 0 1.9 1.3 3.3 3.6 3.3 1.1 0 2.2-.4 3.2-1.1l1.5 1.7z"/>
      </svg>
    ),
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
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg',
    logoSvg: (
      <svg viewBox="0 0 48 32" className="w-full h-full" fill="none">
        <path fill="#F38020" d="M34.8 9.4c-.7-4.1-4.2-7.2-8.5-7.2-3.8 0-7 2.4-8.1 5.9C17.2 8 16 8 14.9 8.2c-4.3.7-7.6 4.4-7.6 8.9 0 .5 0 1 .1 1.5C3.1 19.3 0 22.8 0 27c0 4.8 3.9 8.7 8.7 8.7h29.5c5.4 0 9.8-4.4 9.8-9.8 0-4.9-3.6-9-8.4-9.7-.1-2.4-1.7-4.9-4.8-6.8z"/>
        <path fill="#FAAD3F" d="M37.3 17.2c-.4 0-.8.1-1.2.2-.4-2.8-2.6-5.1-5.5-5.5-2.9-.4-5.6 1.1-6.8 3.7-1.1-.8-2.6-1.1-4-.7-1.9.5-3.3 2.1-3.6 4.1h21.1c2.4 0 4.4-1.8 4.4-4.1 0-2.3-2-4.1-4.4-4.1v6.4z"/>
      </svg>
    ),
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
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg',
    logoSvg: (
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <path fill="#3ECF8E" d="M22.5 3L6.2 22.8c-.8 1-.1 2.5 1.2 2.5h12.1L17.5 37l16.3-19.8c.8-1 .1-2.5-1.2-2.5H20.5l2-11.7z"/>
      </svg>
    ),
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
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
    logoSvg: (
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <path fill="#0089D6" d="M14.6 4.5l-9.1 27c-.6 1.8.7 3.6 2.6 3.6h9.8c1.3 0 2.5-.8 3-2l5.7-17.1-12-11.5z"/>
        <path fill="#0072C6" d="M21.2 16.5l5.2-10.2c.8-1.5 2.4-2.4 4.1-2.4h3.3c1.9 0 3.2 1.9 2.5 3.7L25.8 33.1c-.5 1.2-1.7 2-3 2h-9.9l8.3-18.6z"/>
      </svg>
    ),
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
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg',
    logoSvg: (
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <path fill="#0080FF" d="M20 4C11.2 4 4 11.2 4 20c0 4.4 1.8 8.4 4.7 11.3l5.7-5.7c-1.4-1.4-2.3-3.4-2.3-5.6 0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8v8c8.8 0 16-7.2 16-16S32.8 4 20 4z"/>
        <rect fill="#0080FF" x="8" y="28" width="5" height="5"/>
        <rect fill="#0080FF" x="3" y="28" width="3" height="3"/>
        <rect fill="#0080FF" x="8" y="34" width="3" height="3"/>
      </svg>
    ),
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
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hetzner/hetzner-original.svg',
    logoSvg: (
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <rect width="40" height="40" rx="4" fill="#D50C2D"/>
        <path fill="#FFFFFF" d="M12 10h5v8h6v-8h5v20h-5v-8h-6v8h-5V10z"/>
      </svg>
    ),
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
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/render/render-original.svg',
    logoSvg: (
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <path fill="#1E232A" d="M10 8h9a9 9 0 019 9v15h-6V17a3 3 0 00-3-3h-9V8z"/>
        <circle cx="13" cy="27" r="5" fill="#46E3B7"/>
      </svg>
    ),
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
