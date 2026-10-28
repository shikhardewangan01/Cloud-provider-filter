import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { generateIntelligentFallback, generateFallbackChatReply } from '../src/utils/cloudEngine';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const withTimeout = <T>(promise: Promise<T>, ms = 15000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
};

export default async function handler(req: any, res: any) {
  // CORS & Methods
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';

  // Health
  if (url.includes('/health')) {
    return res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  }

  // Recommendation Endpoint
  if (url.includes('/recommend') || (req.body && req.body.useCase)) {
    const { useCase, workloadParams } = req.body || {};
    if (!useCase) {
      return res.status(400).json({ error: 'useCase is required' });
    }

    const startTime = Date.now();

    const prompt = `You are the lead multi-cloud solutions architect for "Warm Paper Cloud Advisor".
Workload description:
"""${useCase}"""
Constraints:
- Region: ${workloadParams?.region || 'Global'}
- Scale: ${workloadParams?.scale || 'Moderate'}
- Budget: ${workloadParams?.budget || 'Cost-effective'}
- Compliance: ${workloadParams?.compliance || 'None'}

Cloud Provider Options: AWS, GCP, Microsoft Azure, Cloudflare, DigitalOcean, Supabase, Hetzner, Vercel, Render.
Evaluate the best match and return structured JSON in Indian Rupee (₹).`;

    try {
      if (!apiKey) throw new Error('GEMINI_API_KEY is not configured in Vercel environment');

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            systemInstruction: 'You are an objective principal cloud architect. Return structured JSON with INR (₹) estimates.',
            temperature: 0.2,
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                primaryProvider: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    headline: { type: Type.STRING },
                    matchScore: { type: Type.INTEGER },
                    whyItWins: { type: Type.STRING },
                    keyAdvantageBulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    recommendedArchitecture: {
                      type: Type.OBJECT,
                      properties: {
                        compute: { type: Type.OBJECT, properties: { service: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['service', 'description'] },
                        database: { type: Type.OBJECT, properties: { service: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['service', 'description'] },
                        storage: { type: Type.OBJECT, properties: { service: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['service', 'description'] },
                        networking: { type: Type.OBJECT, properties: { service: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['service', 'description'] },
                        aiOrExtra: { type: Type.OBJECT, properties: { service: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['service', 'description'] },
                      },
                      required: ['compute', 'database', 'storage', 'networking']
                    },
                    estimatedMonthlyCostInr: { type: Type.INTEGER },
                    costBreakdown: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { item: { type: Type.STRING }, costInr: { type: Type.INTEGER }, note: { type: Type.STRING } },
                        required: ['item', 'costInr', 'note']
                      }
                    },
                    potentialWatchouts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    deploymentQuickstartCmd: { type: Type.STRING },
                    terraformSnippet: { type: Type.STRING }
                  },
                  required: ['id', 'name', 'headline', 'matchScore', 'whyItWins', 'keyAdvantageBulletPoints', 'recommendedArchitecture', 'estimatedMonthlyCostInr', 'costBreakdown', 'potentialWatchouts', 'deploymentQuickstartCmd']
                },
                runnerUps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, matchScore: { type: Type.INTEGER }, pros: { type: Type.STRING }, whyItFellShort: { type: Type.STRING }, estimatedMonthlyCostInr: { type: Type.INTEGER } },
                    required: ['id', 'name', 'matchScore', 'pros', 'whyItFellShort', 'estimatedMonthlyCostInr']
                  }
                },
                comparisonMatrix: {
                  type: Type.OBJECT,
                  properties: {
                    dimensions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    primaryProviderScores: {
                      type: Type.ARRAY,
                      items: { type: Type.OBJECT, properties: { dimension: { type: Type.STRING }, score: { type: Type.INTEGER }, comment: { type: Type.STRING } }, required: ['dimension', 'score', 'comment'] }
                    },
                    contenderScores: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          providerName: { type: Type.STRING },
                          scores: {
                            type: Type.ARRAY,
                            items: { type: Type.OBJECT, properties: { dimension: { type: Type.STRING }, score: { type: Type.INTEGER }, comment: { type: Type.STRING } }, required: ['dimension', 'score', 'comment'] }
                          }
                        },
                        required: ['providerName', 'scores']
                      }
                    }
                  },
                  required: ['dimensions', 'primaryProviderScores', 'contenderScores']
                },
                initialAdvisorDialogue: { type: Type.STRING },
                suggestedFollowUps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['primaryProvider', 'runnerUps', 'comparisonMatrix', 'initialAdvisorDialogue', 'suggestedFollowUps']
            }
          }
        }),
        14000
      );

      const parsed = JSON.parse(response.text || '{}');
      return res.status(200).json({
        success: true,
        data: parsed,
        meta: { latencyMs: Date.now() - startTime, model: 'gemini-3.1-flash-lite', timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      console.warn('Vercel serverless Gemini call failed, using intelligent fallback:', err.message);
      const fallback = generateIntelligentFallback(useCase, workloadParams);
      return res.status(200).json({
        success: true,
        data: fallback,
        meta: { latencyMs: Date.now() - startTime, model: 'expert-heuristic-engine', note: err.message, timestamp: new Date().toISOString() }
      });
    }
  }

  // Chat Endpoint
  if (url.includes('/chat') || (req.body && req.body.messages)) {
    const { messages, context } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const startTime = Date.now();

    try {
      if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

      const systemInstruction = `You are the lead architect at "Warm Paper Cloud Advisor".
Workload context: ${context ? JSON.stringify(context) : 'None'}`;

      const contents = messages.map((m: any) => ({
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
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
          }
        }),
        14000
      );

      return res.status(200).json({
        success: true,
        reply: response.text,
        meta: { latencyMs: Date.now() - startTime, model: 'gemini-3.1-flash-lite', timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      const lastMsg = [...messages].reverse().find((m: any) => m.role === 'user')?.content || '';
      const reply = generateFallbackChatReply(lastMsg, context);
      return res.status(200).json({
        success: true,
        reply,
        meta: { latencyMs: Date.now() - startTime, model: 'consultative-fallback', note: err.message, timestamp: new Date().toISOString() }
      });
    }
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
