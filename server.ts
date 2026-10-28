import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '2mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for timeout
const withTimeout = <T>(promise: Promise<T>, ms = 8000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Primary Recommendation Endpoint
app.post('/api/recommend', async (req, res) => {
  const { useCase, workloadParams } = req.body;

  if (!useCase || typeof useCase !== 'string') {
    return res.status(400).json({ error: 'Use case is required' });
  }

  const startTime = Date.now();

  const prompt = `You are the lead multi-cloud solutions architect for "Warm Paper Cloud Advisor".
A technical team needs an objective, honest, best-in-class cloud provider recommendation for their specific use case.

Workload description:
"""${useCase}"""

Workload constraints / parameters provided:
- Primary Region / Latency Target: ${workloadParams?.region || 'Not specified (assume global / India/US latency sensitivity if relevant)'}
- Estimated Traffic / Scale: ${workloadParams?.scale || 'Early Stage / Moderate'}
- Estimated Monthly Budget Target: ${workloadParams?.budget || 'Cost-effective'}
- Compliance / Special Requirements: ${workloadParams?.compliance || 'None'}

Cloud Provider Options to pick from:
- AWS (Amazon Web Services)
- GCP (Google Cloud Platform)
- Microsoft Azure
- Cloudflare (Workers, Pages, R2, D1, Hyperdrive)
- DigitalOcean
- Supabase (Backend-as-a-Service + Postgres)
- Hetzner (Bare metal / dedicated / high-spec low cost)
- Vercel (Frontend / Next.js / Edge)
- Render (PaaS alternative to Heroku)

Carefully evaluate which single provider is the BEST match for this exact workload.
Provide realistic monthly cost estimates denominated in Indian Rupee (₹) as the primary currency (e.g. ₹2,500/mo, ₹18,000/mo, ₹65,000/mo) with realistic breakdown.

Return a structured JSON object according to the requested schema.`;

  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a seasoned principal cloud infrastructure architect with deep multi-cloud expertise across AWS, GCP, Azure, Cloudflare, Supabase, Hetzner, and DigitalOcean. You provide crisp, unbiased, battle-tested advice without marketing fluff. Emphasize actual developer ergonomics, egress costs, cold starts, and architectural fit. Format financial figures in Indian Rupee (₹).',
          temperature: 0.2,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          responseMimeType: 'application/json',
          responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryProvider: {
              type: Type.OBJECT,
              properties: {
                id: {
                  type: Type.STRING,
                  description: 'Provider identifier (aws, gcp, azure, cloudflare, digitalocean, supabase, hetzner, vercel, render)',
                },
                name: { type: Type.STRING, description: 'Provider display name (e.g. Google Cloud Platform, Amazon Web Services)' },
                headline: { type: Type.STRING, description: 'One punchy sentence explaining why this provider is the winner' },
                matchScore: { type: Type.INTEGER, description: 'Match score between 75 and 99' },
                whyItWins: { type: Type.STRING, description: 'Detailed 2-3 paragraph architectural rationale' },
                keyAdvantageBulletPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 to 5 key advantages'
                },
                recommendedArchitecture: {
                  type: Type.OBJECT,
                  properties: {
                    compute: {
                      type: Type.OBJECT,
                      properties: {
                        service: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ['service', 'description']
                    },
                    database: {
                      type: Type.OBJECT,
                      properties: {
                        service: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ['service', 'description']
                    },
                    storage: {
                      type: Type.OBJECT,
                      properties: {
                        service: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ['service', 'description']
                    },
                    networking: {
                      type: Type.OBJECT,
                      properties: {
                        service: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ['service', 'description']
                    },
                    aiOrExtra: {
                      type: Type.OBJECT,
                      properties: {
                        service: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ['service', 'description']
                    }
                  },
                  required: ['compute', 'database', 'storage', 'networking']
                },
                estimatedMonthlyCostInr: { type: Type.INTEGER, description: 'Total estimated monthly cost in Indian Rupees' },
                costBreakdown: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      costInr: { type: Type.INTEGER },
                      note: { type: Type.STRING }
                    },
                    required: ['item', 'costInr', 'note']
                  }
                },
                potentialWatchouts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2 to 4 honest caveats, potential cost traps (like egress fees or complex IAM), or architectural limitations'
                },
                deploymentQuickstartCmd: { type: Type.STRING, description: 'Terminal command or CLI snippet to bootstrap' },
                terraformSnippet: { type: Type.STRING, description: 'Short clean Terraform HCL or config snippet' }
              },
              required: [
                'id',
                'name',
                'headline',
                'matchScore',
                'whyItWins',
                'keyAdvantageBulletPoints',
                'recommendedArchitecture',
                'estimatedMonthlyCostInr',
                'costBreakdown',
                'potentialWatchouts',
                'deploymentQuickstartCmd'
              ]
            },
            runnerUps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  matchScore: { type: Type.INTEGER },
                  pros: { type: Type.STRING },
                  whyItFellShort: { type: Type.STRING },
                  estimatedMonthlyCostInr: { type: Type.INTEGER }
                },
                required: ['id', 'name', 'matchScore', 'pros', 'whyItFellShort', 'estimatedMonthlyCostInr']
              }
            },
            comparisonMatrix: {
              type: Type.OBJECT,
              properties: {
                dimensions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                primaryProviderScores: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dimension: { type: Type.STRING },
                      score: { type: Type.INTEGER },
                      comment: { type: Type.STRING }
                    },
                    required: ['dimension', 'score', 'comment']
                  }
                },
                contenderScores: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      providerName: { type: Type.STRING },
                      scores: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            dimension: { type: Type.STRING },
                            score: { type: Type.INTEGER },
                            comment: { type: Type.STRING }
                          },
                          required: ['dimension', 'score', 'comment']
                        }
                      }
                    },
                    required: ['providerName', 'scores']
                  }
                }
              },
              required: ['dimensions', 'primaryProviderScores', 'contenderScores']
            },
            initialAdvisorDialogue: {
              type: Type.STRING,
              description: 'Conversational executive summary in warm paper tone explaining the diagnosis directly to the engineer'
            },
            suggestedFollowUps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'primaryProvider',
            'runnerUps',
            'comparisonMatrix',
            'initialAdvisorDialogue',
            'suggestedFollowUps'
          ]
        }
      }
    }),
    20000
  );

    const parsed = JSON.parse(response.text || '{}');
    const elapsed = Date.now() - startTime;

    res.json({
      success: true,
      data: parsed,
      meta: {
        latencyMs: elapsed,
        model: 'gemini-3.1-flash-lite',
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.warn('Gemini recommendation failed, executing fallback intelligence:', err.message);
    const fallbackData = generateIntelligentFallback(useCase, workloadParams);
    const elapsed = Date.now() - startTime;
    res.json({
      success: true,
      data: fallbackData,
      meta: {
        latencyMs: elapsed,
        model: 'expert-heuristic-engine',
        note: 'Fallback architectural evaluation active',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Interactive Multi-turn Chat Endpoint for Deeper Comparison & Architecture Q&A
app.post('/api/chat', async (req, res) => {
  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const startTime = Date.now();

  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const systemInstruction = `You are the lead architect at "Warm Paper Cloud Advisor".
You are having a direct, consultative conversation with an engineer about cloud infrastructure, provider comparisons, pricing nuances, database trade-offs, egress traps, and deployment configurations.
Maintain a calm, tactile, clear editorial paper tone.
Reference currency in Indian Rupee (₹) and US Dollar ($) where helpful.
Format with clean markdown: clear bold headings, concise bullet points, and code blocks for configuration or CLI commands.
Avoid corporate buzzwords; be pragmatic, honest, and opinionated about real technical trade-offs.

Current workload context:
${context ? JSON.stringify(context, null, 2) : 'No workload context supplied yet.'}`;

    // Format contents for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: {
          systemInstruction,
          temperature: 0.4,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        }
      }),
      20000
    );

    const elapsed = Date.now() - startTime;

    res.json({
      success: true,
      reply: response.text,
      meta: {
        latencyMs: elapsed,
        model: 'gemini-3.1-flash-lite',
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.warn('Gemini chat failed, using fallback consultative generator:', err.message);
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    const fallbackReply = generateFallbackChatReply(lastUserMessage, context);
    const elapsed = Date.now() - startTime;
    res.json({
      success: true,
      reply: fallbackReply,
      meta: {
        latencyMs: elapsed,
        model: 'consultative-fallback',
        timestamp: new Date().toISOString()
      }
    });
  }
});

import { generateIntelligentFallback, generateFallbackChatReply } from './src/utils/cloudEngine';

// Development Vite Middleware setup or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Warm Paper Cloud Advisor server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
